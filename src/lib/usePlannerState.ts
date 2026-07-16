/**
 * usePlannerState.ts
 * Central planner state — mode, base, deployment, scores.
 * All scoring wrapped in try/catch to prevent crashes.
 *
 * UNIFIED DEPLOYMENT SYSTEM (Phase 2):
 * This is now the single source of truth for deployments — per-adjuster,
 * with base address, expected/actual return dates, active/completed status,
 * plus the original route-planning capacity fields. Table: `deployments`,
 * keyed by `adjuster_id`. localStorage keys unchanged so claims.index.tsx
 * and plan.tsx (which read them directly) keep working untouched.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/lib/useUserProfile";
import { useAdjusterSettings } from "@/lib/useAdjusterSettings";
import { clusterClaims, clusterLookup } from "@/lib/clustering";

export type WorkMode = "cat" | "regular";

export interface BaseLocation {
  label: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Deployment {
  id: string;
  cat_number: string;
  name: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  target_claims_per_day: number;
  default_inspection_duration_min: number;
  default_travel_buffer_min: number;
  workday_start: string;
  workday_end: string;
  admin_reserve_min: number;
  break_reserve_min: number;
  contingency_reserve_min: number;
  notes: string | null;
  // Unified per-employee fields
  base_address: string | null;
  base_lat: number | null;
  base_lng: number | null;
  expected_return_date: string | null;
  is_completed: boolean;
  completed_at: string | null;
  expected_claims_count: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface NewDeploymentInput {
  cat_number: string;
  name?: string | null;
  base_address?: string | null;
  base_lat?: number | null;
  base_lng?: number | null;
  expected_return_date?: string | null;
  target_claims_per_day?: number;
  default_inspection_duration_min?: number;
  default_travel_buffer_min?: number;
  workday_start?: string;
  workday_end?: string;
  expected_claims_count?: number | null;
  notes?: string | null;
}

export interface ScoredClaim {
  id: string;
  insured_name: string;
  score: number;
  whySummary: string;
  distToBaseKm: number;
  clusterId: string;
  clusterSize: number;
}

export interface CapacityEstimate {
  dailyCapacityMin: number;
  claimLoadMin: number;
  claimsPerDay: number;
  daysRequired: number;
  warnings: string[];
}

export interface PlannerState {
  workMode: WorkMode;
  setWorkMode: (m: WorkMode) => void;
  base: BaseLocation | null;
  setBase: (b: BaseLocation | null) => void;
  returnToBase: boolean;
  setReturnToBase: (v: boolean) => void;
  activeDeployment: Deployment | null;
  setActiveDeployment: (d: Deployment | null) => void;
  deployments: Deployment[];
  completedDeployments: Deployment[];
  scoredClaims: ScoredClaim[];
  callbacksDue: ScoredClaim[];
  capacityEstimate: CapacityEstimate | null;
  totalClaims: number;
  unscheduledCount: number;
  scheduledCount: number;
  inspectedCount: number;
  clusterSummaryText: string;
  callsToday: number;
  bookingsToday: number;
  callsTarget: number;
  bookingsTarget: number;
  recalculate: () => void;
  savingBase: boolean;
  // Unified deployment actions
  createDeployment: (input: NewDeploymentInput) => Promise<Deployment | null>;
  updateDeployment: (id: string, input: Partial<NewDeploymentInput>) => Promise<Deployment | null>;
  extendDeployment: (id: string, newReturnDate: string) => Promise<Deployment | null>;
  endDeployment: (id: string) => Promise<Deployment | null>;
  deleteDeployment: (id: string) => Promise<void>;
  redeploy: (input: NewDeploymentInput) => Promise<Deployment | null>;
  activateDeployment: (d: Deployment) => Promise<void>;
}

const LS_MODE = "planner_work_mode";
const LS_BASE = "planner_base";
const LS_RETURN = "planner_return_to_base";
const LS_DEPLOYMENT = "planner_active_deployment_id";

function safeParseLS<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function parseTimeToMin(hhmm: string): number {
  try { const [h, m] = hhmm.replace(/:\d\d$/, "").split(":").map(Number); return h * 60 + (m || 0); }
  catch { return 0; }
}

export function usePlannerState(): PlannerState {
  const qc = useQueryClient();

  const [workMode, setWorkModeState] = useState<WorkMode>(() => safeParseLS(LS_MODE, "regular") as WorkMode);
  const [base, setBaseState] = useState<BaseLocation | null>(() => safeParseLS(LS_BASE, null));
  const [returnToBase, setReturnToBaseState] = useState<boolean>(() => localStorage.getItem(LS_RETURN) !== "false");
  const [activeDeploymentId, setActiveDeploymentId] = useState<string | null>(() => {
    const stored = localStorage.getItem(LS_DEPLOYMENT);
    return stored && stored !== "null" && stored !== "undefined" ? stored : null;
  });

  const setWorkMode = useCallback((m: WorkMode) => {
    setWorkModeState(m);
    try {
      localStorage.setItem(LS_MODE, JSON.stringify(m));
      // Switching to Regular clears the active deployment so the app
      // doesn't auto-revert to CAT on next launch.
      if (m === "regular") {
        localStorage.removeItem(LS_DEPLOYMENT);
        setActiveDeployment(null);
      }
    } catch { /* best-effort — non-critical, safe to ignore */ }
  }, []);

  const setBase = useCallback((b: BaseLocation | null) => {
    setBaseState(b);
    try { localStorage.setItem(LS_BASE, JSON.stringify(b)); } catch { /* best-effort — non-critical, safe to ignore */ }
    qc.invalidateQueries({ queryKey: ["planner"] });
  }, [qc]);

  // Regular mode: if no base has ever been set, fall back to the user's
  // home address from their profile. A base explicitly set via the Route
  // planner (setBase / LS_BASE) always takes priority over this.
  const { profile } = useUserProfile();
  const { callTargetOverride } = useAdjusterSettings();
  useEffect(() => {
    if (workMode !== "regular") return;
    if (base) return; // user already has a base — never override it
    if (localStorage.getItem(LS_BASE)) return; // explicit "cleared" state, don't re-fill
    if (profile?.home_address && profile.home_lat != null && profile.home_lng != null) {
      setBaseState({
        label: "Home",
        address: profile.home_address,
        lat: profile.home_lat,
        lng: profile.home_lng,
      });
      try {
        localStorage.setItem(LS_BASE, JSON.stringify({
          label: "Home", address: profile.home_address, lat: profile.home_lat, lng: profile.home_lng,
        }));
      } catch { /* best-effort — non-critical, safe to ignore */ }
    }
  }, [workMode, base, profile?.home_address, profile?.home_lat, profile?.home_lng]);

  const setReturnToBase = useCallback((v: boolean) => {
    setReturnToBaseState(v);
    try { localStorage.setItem(LS_RETURN, String(v)); } catch { /* best-effort — non-critical, safe to ignore */ }
  }, []);

  // Fetch all active claims — scoped strictly to current mode.
  // Regular Mode: deployment_id IS NULL. CAT Mode: deployment_id = activeDeployment.id.
  const { data: allClaims } = useQuery({
    queryKey: ["planner", "claims", workMode, activeDeploymentId],
    queryFn: async () => {
      try {
        let q = supabase.from("claims_with_call_status" as any).select("*")
          .neq("status", "closed").neq("status", "cancelled");
        if (workMode === "cat" && activeDeploymentId) {
          q = (q as any).eq("deployment_id", activeDeploymentId);
        } else if (workMode === "cat") {
          return [] as Record<string, unknown>[];
        } else {
          q = (q as any).is("deployment_id", null);
        }
        const { data } = await q;
        // claims_with_call_status is a view; supabase-js can't infer its
        // relationships through the "as any" table-name cast above, so it
        // falls back to a SelectQueryError type here even though the query
        // itself is valid — hence the explicit unknown-first cast.
        if (data) return data as unknown as Record<string, unknown>[];
      } catch { /* best-effort — non-critical, safe to ignore */ }
      let q2 = supabase.from("claims").select("*")
        .neq("status", "closed").neq("status", "cancelled");
      if (workMode === "cat" && activeDeploymentId) {
        q2 = (q2 as any).eq("deployment_id", activeDeploymentId);
      } else if (workMode === "cat") {
        return [] as Record<string, unknown>[];
      } else {
        q2 = (q2 as any).is("deployment_id", null);
      }
      const { data } = await q2;
      return (data ?? []).map(c => ({ ...c, last_call_outcome: null, last_call_at: null, call_count: 0 })) as Record<string, unknown>[];
    },
    staleTime: 30000,
  });

  // Today's call/booking funnel — how many calls made today, how many
  // turned into bookings, versus a rough target (default ~10 calls to
  // land ~4 bookings, or scaled to the CAT's actual daily capacity below).
  const { data: callBookingCounts = { calls: 0, bookings: 0 } } = useQuery({
    queryKey: ["planner", "call_booking_counts", new Date().toDateString()],
    queryFn: async () => {
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(todayStart); todayEnd.setDate(todayEnd.getDate() + 1);
      try {
        const [{ count: calls }, { count: bookings }] = await Promise.all([
          supabase.from("call_attempts").select("id", { count: "exact", head: true })
            .gte("attempted_at", todayStart.toISOString()).lt("attempted_at", todayEnd.toISOString()),
          supabase.from("claims").select("id", { count: "exact", head: true })
            .gte("booked_at", todayStart.toISOString()).lt("booked_at", todayEnd.toISOString()),
        ]);
        return { calls: calls ?? 0, bookings: bookings ?? 0 };
      } catch {
        return { calls: 0, bookings: 0 };
      }
    },
    staleTime: 15000,
  });

  // Fetch ALL deployments for this adjuster (active + completed)
  const { data: allDeployments = [] } = useQuery({
    queryKey: ["deployments"],
    queryFn: async (): Promise<Deployment[]> => {
      try {
        const { data } = await supabase
          .from("deployments" as any)
          .select("*")
          .order("created_at", { ascending: false });
        return ((data ?? []) as any[]).map(d => ({
          ...d,
          is_completed: d.is_completed ?? false,
        })) as Deployment[];
      } catch { return []; }
    },
  });

  const deployments = useMemo(
    () => allDeployments.filter(d => !d.is_completed),
    [allDeployments]
  );
  const completedDeployments = useMemo(
    () => allDeployments.filter(d => d.is_completed),
    [allDeployments]
  );

  const activeDeployment = useMemo(
    () => deployments.find(d => d.id === activeDeploymentId) ?? deployments.find(d => d.is_active) ?? null,
    [deployments, activeDeploymentId]
  );

  useEffect(() => {
    if (!activeDeploymentId && activeDeployment?.id) {
      setActiveDeploymentId(activeDeployment.id);
      try { localStorage.setItem(LS_DEPLOYMENT, activeDeployment.id); } catch { /* best-effort — non-critical, safe to ignore */ }
    }
  }, [activeDeploymentId, activeDeployment?.id]);

  const setActiveDeployment = useCallback((d: Deployment | null) => {
    setActiveDeploymentId(d?.id ?? null);
    try {
      if (d?.id) localStorage.setItem(LS_DEPLOYMENT, d.id);
      else localStorage.removeItem(LS_DEPLOYMENT);
    } catch { /* best-effort — non-critical, safe to ignore */ }
    qc.invalidateQueries({ queryKey: ["deployments"] });
    qc.invalidateQueries({ queryKey: ["planner"] });
    qc.invalidateQueries({ queryKey: ["claims"] });
  }, [qc]);

  const refreshDeployments = useCallback(async () => {
    await qc.invalidateQueries({ queryKey: ["deployments"] });
    await qc.invalidateQueries({ queryKey: ["planner"] });
    await qc.invalidateQueries({ queryKey: ["claims"] });
  }, [qc]);

  const activateDeployment = useCallback(async (d: Deployment): Promise<void> => {
    await supabase.from("deployments" as any).update({ is_active: false } as any);
    const { error } = await supabase.from("deployments" as any).update({ is_active: true } as any).eq("id", d.id);
    if (error) throw error;
    setActiveDeployment({ ...d, is_active: true });
    await refreshDeployments();
  }, [setActiveDeployment, refreshDeployments]);

  // ---- Unified deployment actions ----

  const createDeployment = useCallback(async (input: NewDeploymentInput): Promise<Deployment | null> => {
    // Only one active deployment at a time
    await supabase.from("deployments" as any).update({ is_active: false } as any);

    const { data, error } = await supabase
      .from("deployments" as any)
      .insert({
        cat_number: input.cat_number,
        name: input.name ?? null,
        is_active: true,
        is_completed: false,
        target_claims_per_day: input.target_claims_per_day ?? 4,
        default_inspection_duration_min: input.default_inspection_duration_min ?? 60,
        default_travel_buffer_min: input.default_travel_buffer_min ?? 20,
        workday_start: input.workday_start ?? "08:00:00",
        workday_end: input.workday_end ?? "17:00:00",
        base_address: input.base_address ?? null,
        base_lat: input.base_lat ?? null,
        base_lng: input.base_lng ?? null,
        expected_return_date: input.expected_return_date ?? null,
        expected_claims_count: input.expected_claims_count ?? null,
        notes: input.notes ?? null,
        start_date: new Date().toISOString().split("T")[0],
      } as any)
      .select("*")
      .single();

    if (error) throw error;
    // "deployments" is queried through an "as any" table-name cast (see
    // notes above), so the returned row type can't be matched structurally
    // against our local Deployment interface — cast through unknown first.
    const created = data as unknown as Deployment;
    setActiveDeployment(created);
    try { localStorage.setItem("planner_default_duration", String(created.default_inspection_duration_min)); } catch { /* best-effort — non-critical, safe to ignore */ }
    await refreshDeployments();
    return created;
  }, [setActiveDeployment, refreshDeployments]);

  const updateDeployment = useCallback(async (id: string, input: Partial<NewDeploymentInput>): Promise<Deployment | null> => {
    const { data, error } = await supabase
      .from("deployments" as any)
      .update(input as any)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    const updated = data as unknown as Deployment;
    if (activeDeployment?.id === id) setActiveDeployment(updated);
    await refreshDeployments();
    return updated;
  }, [activeDeployment?.id, setActiveDeployment, refreshDeployments]);

  const extendDeployment = useCallback(async (id: string, newReturnDate: string): Promise<Deployment | null> => {
    return updateDeployment(id, { expected_return_date: newReturnDate } as any);
  }, [updateDeployment]);

  const endDeployment = useCallback(async (id: string): Promise<Deployment | null> => {
    const { data, error } = await supabase
      .from("deployments" as any)
      .update({ is_completed: true, completed_at: new Date().toISOString(), is_active: false } as any)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    if (activeDeploymentId === id) {
      setActiveDeploymentId(null);
      try { localStorage.removeItem(LS_DEPLOYMENT); } catch { /* best-effort — non-critical, safe to ignore */ }
    }
    await refreshDeployments();
    return data as unknown as Deployment;
  }, [activeDeploymentId, refreshDeployments]);

  const deleteDeployment = useCallback(async (id: string): Promise<void> => {
    await supabase.from("claims").update({ deployment_id: null } as any).eq("deployment_id", id);
    const { error } = await supabase.from("deployments" as any).delete().eq("id", id);
    if (error) throw error;
    if (activeDeployment?.id === id) setActiveDeployment(null);
    await refreshDeployments();
  }, [activeDeployment?.id, setActiveDeployment, refreshDeployments]);

  const redeploy = useCallback(async (input: NewDeploymentInput): Promise<Deployment | null> => {
    return createDeployment(input);
  }, [createDeployment]);

  // Score claims — pure calculation, no Map/Set class usage, all try/caught
  const { scoredClaims, callbacksDue, clusterSummaryText } = useMemo(() => {
    const empty = { scoredClaims: [] as ScoredClaim[], callbacksDue: [] as ScoredClaim[], clusterSummaryText: "Set base to enable scoring" };
    if (!allClaims || !base) return empty;

    try {
      const now = Date.now();
      const claims = allClaims.filter(c =>
        c.status !== "inspected" && c.status !== "closed" &&
        typeof c.latitude === "number" && typeof c.longitude === "number"
      );

      // Real geographic clustering — groups nearby claims so calling/
      // booking them together produces an efficient route, instead of
      // just ranking each claim in isolation.
      const clusters = clusterClaims(
        claims.map(c => ({ id: c.id as string, lat: c.latitude as number, lng: c.longitude as number, city: c.city as string | null })),
        4
      );
      const clusterOf = clusterLookup(clusters);

      const scored: ScoredClaim[] = claims.map(c => {
        const distKm = haversineKm(base, { lat: c.latitude as number, lng: c.longitude as number });
        const priority = ((c.priority as number ?? 3) - 1) / 4;
        const proxScore = distKm < 5 ? 1 : distKm < 15 ? 0.8 : distKm < 30 ? 0.6 : distKm < 60 ? 0.3 : 0.1;
        const waitDays = (now - new Date(c.created_at as string).getTime()) / 86400000;
        const waitScore = Math.min(waitDays / 30, 1);
        const callbackScore = (c.last_call_outcome === "left_vm" || c.last_call_outcome === "callback") ? 0.7 : 0;
        const cluster = clusterOf[c.id as string];
        // Bonus for being in a larger cluster — steers toward calling
        // geographically-bunched claims together rather than scattering
        // today's calls across the whole map.
        const clusterBonus = cluster ? Math.min((cluster.size - 1) * 0.08, 0.24) : 0;
        const score = Math.round((priority * 0.22 + proxScore * 0.32 + waitScore * 0.22 + callbackScore * 0.12 + clusterBonus) * 100);

        const reasons: string[] = [];
        if (cluster && cluster.size > 1) reasons.push(`${cluster.size} in ${cluster.label}`);
        if (priority > 0.6) reasons.push("High priority");
        if (proxScore > 0.7) reasons.push(`${distKm.toFixed(1)}km from base`);
        if (waitDays >= 5) reasons.push(`${Math.floor(waitDays)}d waiting`);
        if (callbackScore > 0) reasons.push("Callback pending");

        return {
          id: c.id as string,
          insured_name: c.insured_name as string,
          score,
          whySummary: reasons.join(" · ") || `${distKm.toFixed(1)}km from base`,
          distToBaseKm: Math.round(distKm * 10) / 10,
          clusterId: cluster?.label ?? "Solo",
          clusterSize: cluster?.size ?? 1,
        };
      }).sort((a, b) => {
        // Primary: larger cluster first (call a whole area together).
        // Secondary: individual score within that.
        if (b.clusterSize !== a.clusterSize) return b.clusterSize - a.clusterSize;
        return b.score - a.score;
      });

      const callbacks = scored.filter(s => {
        const c = allClaims.find(cl => cl.id === s.id);
        return (c?.last_call_outcome === "left_vm" || c?.last_call_outcome === "callback") &&
          c?.next_followup_at && new Date(c.next_followup_at as string) <= new Date();
      });

      const multiClusters = clusters.filter(c => c.size > 1);
      const summary = multiClusters.length > 0
        ? `${clusters.length} zones — ${multiClusters.slice(0, 3).map(c => `${c.label} (${c.size})`).join(", ")}${multiClusters.length > 3 ? "…" : ""}`
        : `${claims.length} geocoded claims, no tight clusters yet`;

      return { scoredClaims: scored, callbacksDue: callbacks, clusterSummaryText: summary };
    } catch (err) {
      console.error("Scoring error:", err);
      return empty;
    }
  }, [allClaims, base]);

  // CAT capacity
  const capacityEstimate = useMemo<CapacityEstimate | null>(() => {
    if (!activeDeployment || workMode !== "cat" || !allClaims) return null;
    try {
      const total = allClaims.filter(c => c.status !== "inspected" && c.status !== "closed").length;
      const workMin = parseTimeToMin(activeDeployment.workday_end) - parseTimeToMin(activeDeployment.workday_start);
      const dailyCapacityMin = workMin - activeDeployment.admin_reserve_min - activeDeployment.break_reserve_min - activeDeployment.contingency_reserve_min;
      const claimLoadMin = activeDeployment.default_inspection_duration_min + activeDeployment.default_travel_buffer_min + 10;
      const claimsPerDay = Math.max(1, Math.floor(dailyCapacityMin / claimLoadMin));
      const daysRequired = Math.ceil(total / claimsPerDay);
      const warnings: string[] = [];
      if (daysRequired > 10) warnings.push(`At current settings, ${total} claims will take ~${daysRequired} days.`);
      if (claimsPerDay < 3) warnings.push(`Only ~${claimsPerDay} claims/day fit with ${activeDeployment.default_inspection_duration_min}min inspections.`);
      return { dailyCapacityMin, claimLoadMin, claimsPerDay, daysRequired, warnings };
    } catch { return null; }
  }, [activeDeployment, workMode, allClaims]);

  const recalculate = useCallback(() => {
    qc.invalidateQueries({ queryKey: ["planner"] });
    qc.invalidateQueries({ queryKey: ["claims"] });
  }, [qc]);

  // Daily call/booking funnel target — ~10 calls to land ~4 bookings by
  // default, or scaled to the CAT's actual computed daily capacity.
  const bookingsTarget = capacityEstimate?.claimsPerDay ?? 4;
  const callsTarget = callTargetOverride ?? Math.round(bookingsTarget * 2.5);

  const totalClaims = allClaims?.length ?? 0;
  const unscheduledCount = allClaims?.filter(c => !c.scheduled_at && c.status !== "inspected" && c.status !== "closed").length ?? 0;
  const scheduledCount = allClaims?.filter(c => c.status === "scheduled").length ?? 0;
  const inspectedCount = allClaims?.filter(c => c.status === "inspected").length ?? 0;

  return {
    workMode, setWorkMode,
    base, setBase,
    returnToBase, setReturnToBase,
    activeDeployment, setActiveDeployment,
    deployments,
    completedDeployments,
    scoredClaims,
    callbacksDue,
    capacityEstimate,
    totalClaims,
    unscheduledCount,
    scheduledCount,
    inspectedCount,
    clusterSummaryText,
    callsToday: callBookingCounts.calls,
    bookingsToday: callBookingCounts.bookings,
    callsTarget,
    bookingsTarget,
    recalculate,
    savingBase: false,
    createDeployment,
    updateDeployment,
    extendDeployment,
    endDeployment,
    deleteDeployment,
    redeploy,
    activateDeployment,
  };
}
