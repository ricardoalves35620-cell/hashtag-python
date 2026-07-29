import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Loader2, Map, Navigation, Clock, ChevronLeft, ChevronRight,
  Phone, MapPin, Printer, Settings2, Plus, Minus,
  CheckCircle2, AlertCircle, Home, Zap, Star, Save, Route as RouteIcon,
  GripVertical,
} from "lucide-react";
import { ciscoJabberLink, formatDateTime, formatRelative, googleMapsDirectionsLink, telLink } from "@/lib/format";
import { geocodeAddress, planRoute } from "@/lib/claims.functions";
import { CallLogger, OUTCOMES } from "@/components/CallLogger";
import { StaticMapImage } from "@/components/StaticMapImage";
import { clusterClaims, clusterLookup } from "@/lib/clustering";
import { usePlanner } from "@/lib/PlannerContext";
import { AddressAutocomplete, type ResolvedAddress } from "@/components/AddressAutocomplete";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Claim = Database["public"]["Tables"]["claims"]["Row"];
type PlanSearch = Record<string, never>;

export const Route = createFileRoute("/_authenticated/plan")({
  head: () => ({ meta: [{ title: "Route Plan — Claim Navigator" }] }),
  validateSearch: (): PlanSearch => ({}),
  component: RoutePlan,
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function toDateLocal(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function fromDateLocal(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function isoStart(d: Date) { const s = new Date(d); s.setHours(0,0,0,0); return s.toISOString(); }
function isoEnd(d: Date) { const s = new Date(d); s.setHours(23,59,59,999); return s.toISOString(); }

const PLANNER_DATE_KEY = "planner_selected_date";

// If the adjuster advanced to "tomorrow" (via Complete Route → Plan
// Tomorrow) that choice should survive navigating to another page and
// back — the component fully remounts, so plain useState resets to
// today every time otherwise. We persist the chosen date, but snap back
// to the real today if the stored date has fallen into the past (e.g.
// they didn't open the app for a few days) rather than leaving them
// stuck looking at a stale day.
function loadPersistedPlanDate(today: Date): string {
  try {
    const stored = localStorage.getItem(PLANNER_DATE_KEY);
    if (stored) {
      const storedDate = fromDateLocal(stored);
      const startOfToday = new Date(today); startOfToday.setHours(0, 0, 0, 0);
      if (storedDate.getTime() >= startOfToday.getTime()) return stored;
    }
  } catch { /* localStorage unavailable — fall through to today */ }
  return toDateLocal(today);
}
function hav(a: {lat:number;lng:number}, b: {lat:number;lng:number}) {
  const R = 6371, dLat = (b.lat-a.lat)*Math.PI/180, dLng = (b.lng-a.lng)*Math.PI/180;
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}
function minsToHHMM(m: number) {
  return String(Math.floor(m/60)%24).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
}

interface Base { label: string; address: string; lat: number; lng: number; placeId?: string; }
interface Leg { toId: string; distKm: number; driveMin: number; arrivalTime: string; departureTime: string; }
interface RouteResult { orderedIds: string[]; legs: Leg[]; totalDriveMin: number; totalDistKm: number; leaveByTime: string | null; }

function hhmmToMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// windowStart is the time you need to be STARTING the first inspection —
// not the time you leave base. This derives "leave by" from the first
// leg's arrival time minus its drive time from base.
function computeLeaveByTime(legs: Leg[]): string | null {
  if (!legs.length) return null;
  const first = legs[0];
  if (!first.driveMin || first.driveMin <= 0) return null;
  return minsToHHMM(hhmmToMin(first.arrivalTime) - first.driveMin);
}

function hasCoords(s: Pick<Claim, "latitude" | "longitude">): s is Claim & { latitude: number; longitude: number } {
  return typeof s.latitude === "number" && typeof s.longitude === "number" && Number.isFinite(s.latitude) && Number.isFinite(s.longitude);
}

/** Build a Google Maps "navigate to" link for a single claim stop. */
function driveToClaimLink(s: Claim): string {
  const dest = hasCoords(s)
    ? `${s.latitude},${s.longitude}`
    : encodeURIComponent(s.formatted_address ?? [s.street, s.city, s.province, s.postal_code].filter(Boolean).join(", "));
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
}

function hasBaseCoords(base: Base | null): boolean {
  return !!base && Number.isFinite(base.lat) && Number.isFinite(base.lng) && (base.lat !== 0 || base.lng !== 0);
}

function claimAddress(s: Partial<Claim>): string {
  return [
    s.formatted_address,
    s.street,
    s.city,
    s.province,
    s.postal_code,
    "Canada",
  ].filter(Boolean).join(", ");
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function baseMapStop(base: Base | null): { lat: number; lng: number } | { address: string } | null {
  if (!base) return null;
  if (Number.isFinite(base.lat) && Number.isFinite(base.lng) && (base.lat !== 0 || base.lng !== 0)) {
    return { lat: base.lat, lng: base.lng };
  }
  const address = base.address?.trim() || base.label?.trim();
  return address ? { address } : null;
}

function claimMapStop(s: Claim): { lat: number; lng: number } | { address: string } {
  return hasCoords(s) ? { lat: s.latitude, lng: s.longitude } : { address: claimAddress(s) };
}

function scheduledMinutes(s: Claim): number | null {
  if (!s.scheduled_at) return null;
  const d = new Date(s.scheduled_at);
  if (Number.isNaN(d.getTime())) return null;
  return d.getHours() * 60 + d.getMinutes();
}

function buildAddressLegs(ordered: Claim[], windowStart: string, defaultDuration = 60): Leg[] {
  const [sh, sm] = windowStart.split(":").map(Number);
  let t = sh * 60 + sm;
  return ordered.map((s) => {
    const scheduled = scheduledMinutes(s);
    const arrival = scheduled ?? t;
    const duration = (s as any).inspection_duration_minutes ?? defaultDuration;
    const departure = arrival + duration;
    t = departure;
    return {
      toId: s.id,
      distKm: 0,
      driveMin: 0,
      arrivalTime: minsToHHMM(arrival),
      departureTime: minsToHHMM(departure),
    };
  });
}

function buildLegsFromLiveMetrics(
  ordered: Claim[],
  localLegs: Leg[],
  legDurations: number[],
  legDistances: number[],
  windowStart: string,
  preserveScheduled: boolean,
  defaultDuration = 60,
): Leg[] {
  const [sh, sm] = windowStart.split(":").map(Number);
  let t = sh * 60 + sm;
  return ordered.map((s, i) => {
    const drive = Math.round((legDurations[i] ?? 0) / 60);
    const dist = Math.round(((legDistances[i] ?? 0) / 1000) * 10) / 10;
    const scheduled = preserveScheduled ? scheduledMinutes(s) : null;
    // windowStart is when the FIRST inspection starts, not when you leave base —
    // so the first stop anchors directly to windowStart (or its fixed appointment
    // time), not windowStart + drive.
    const arrival = i === 0 ? (scheduled ?? t) : (scheduled ?? (t + drive));
    const duration = (s as any).inspection_duration_minutes ?? defaultDuration;
    const departure = arrival + duration;
    t = departure;
    const previous = localLegs.find((l) => l.toId === s.id);
    return {
      ...previous,
      toId: s.id,
      distKm: dist,
      driveMin: drive,
      arrivalTime: minsToHHMM(arrival),
      departureTime: minsToHHMM(departure),
    };
  });
}

function buildRoute(stops: Claim[], base: Base | null, windowStart: string, returnToBase: boolean, defaultDuration = 60): RouteResult {
  if (!stops.length) return { orderedIds: [], legs: [], totalDriveMin: 0, totalDistKm: 0 };
  const anchorBase = base && hasBaseCoords(base) ? base : null;

  const geo = stops.filter(hasCoords);
  if (!geo.length) {
    const ordered = [...stops];
    return { orderedIds: ordered.map((s) => s.id), legs: buildAddressLegs(ordered, windowStart, defaultDuration), totalDriveMin: 0, totalDistKm: 0, leaveByTime: null };
  }

  // Smart sequencing: group by window time, nearest-neighbor within each group
  // Use plain arrays to avoid Map constructor bundling issues
  const groupKeys: string[] = [];
  const groupStopsArr: Claim[][] = [];

  for (const s of geo) {
    const key = s.scheduled_at
      ? new Date(s.scheduled_at).getHours().toString().padStart(2,"0") + ":" +
        new Date(s.scheduled_at).getMinutes().toString().padStart(2,"0")
      : "flex";
    const existingIdx = groupKeys.indexOf(key);
    if (existingIdx === -1) {
      groupKeys.push(key);
      groupStopsArr.push([s]);
    } else {
      groupStopsArr[existingIdx].push(s);
    }
  }

  // Sort groups by time key (flex last)
  const sortedIdxs = groupKeys
    .map((k, i) => ({ k, i }))
    .sort((a, b) => {
      if (a.k === "flex") return 1;
      if (b.k === "flex") return -1;
      return a.k.localeCompare(b.k);
    })
    .map(x => x.i);

  // Within each group, nearest-neighbor from last position
  const ordered: Claim[] = [];
  let cur: {lat:number;lng:number} = anchorBase ?? { lat: geo[0].latitude, lng: geo[0].longitude };

  for (const idx of sortedIdxs) {
    const remaining = [...groupStopsArr[idx]];
    while (remaining.length) {
      let best = 0;
      for (let i = 1; i < remaining.length; i++) {
        if (hav(cur, {lat:remaining[i].latitude,lng:remaining[i].longitude}) <
            hav(cur, {lat:remaining[best].latitude,lng:remaining[best].longitude})) best = i;
      }
      ordered.push(remaining[best]);
      cur = {lat:remaining[best].latitude,lng:remaining[best].longitude};
      remaining.splice(best, 1);
    }
  }

  // Append non-geocoded stops at end
  ordered.push(...stops.filter((s) => !hasCoords(s)));

  const [sh,sm] = windowStart.split(":").map(Number);
  let t = sh*60+sm;
  let prev: {lat:number;lng:number} | null = anchorBase ?? (hasCoords(ordered[0]) ? { lat: ordered[0].latitude, lng: ordered[0].longitude } : null);
  const legs: Leg[] = [];
  let totalDrive = 0, totalDist = 0;
  ordered.forEach((s, idx) => {
    let dist = 0, drive = 0;
    if (prev && hasCoords(s)) {
      dist = hav(prev, {lat:s.latitude,lng:s.longitude});
      // dist is the straight-line (haversine) distance. Real road distance in
      // suburban Montreal (DDO, Pierrefonds, Châteauguay, etc.) is typically
      // 1.3–1.4x the crow-flies distance due to street grids, curves, and
      // cul-de-sacs. Average driving speed door-to-door (with stops, turns,
      // parking approach) is ~35 km/h — NOT highway speed. At 50 km/h the
      // app showed 4 min for a trip that actually took 14 min.
      const ROAD_FACTOR = 1.35;   // straight-line → road distance multiplier
      const AVG_SPEED_KMH = 35;   // suburban driving with stops and turns
      drive = Math.round((dist * ROAD_FACTOR) / AVG_SPEED_KMH * 60);
      totalDrive += drive; totalDist += dist;
      prev = {lat:s.latitude,lng:s.longitude};
    }
    // windowStart is when the FIRST inspection starts, not when you leave base.
    // So the first stop's arrival = windowStart directly; later stops still
    // accumulate drive + dwell time from the previous stop as before.
    const arrival = idx === 0 ? t : t + drive;
    const duration = (s as any).inspection_duration_minutes ?? defaultDuration;
    legs.push({ toId: s.id, distKm: Math.round(dist*10)/10, driveMin: drive, arrivalTime: minsToHHMM(arrival), departureTime: minsToHHMM(arrival+duration) });
    t = arrival + duration;
  });
  if (returnToBase && anchorBase && prev) {
    const dist = hav(prev, anchorBase);
    totalDrive += Math.round((dist * 1.35) / 35 * 60); totalDist += dist;
  }
  return { orderedIds: ordered.map(s=>s.id), legs, totalDriveMin: totalDrive, totalDistKm: Math.round(totalDist*10)/10, leaveByTime: computeLeaveByTime(legs) };
}

// ── Main component ────────────────────────────────────────────────────────────
function RoutePlan() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDateState] = useState(() => loadPersistedPlanDate(today));
  function setSelectedDate(d: string) {
    setSelectedDateState(d);
    try { localStorage.setItem(PLANNER_DATE_KEY, d); } catch { /* best-effort — non-critical, safe to ignore */ }
  }
  // weekStart drives the 7-day strip; navigating weeks shifts this by ±7 days
  const [weekStart, setWeekStart] = useState<string>(() => toDateLocal(today));
  const [dailyCap, setDailyCap] = useState(4);
  const [windowStart, setWindowStart] = useState("09:00");
  const [windowEnd, setWindowEnd] = useState("13:00");
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [planning, setPlanning] = useState(false);
  const [justInspectedId, setJustInspectedId] = useState<string | null>(null);

  // Persist the optimized route so it survives navigating away and back.
  // Key includes the date + a fingerprint of the stop IDs so stale results
  // from a different set of stops are never shown.
  const routeResultKey = (date: string, ids: string[]) =>
    `route_result_${date}_${ids.slice().sort().join(",")}`;

  // Restore persisted result when stops load for the selected date.
  // NOTE: this useEffect is declared after the stops useQuery below.

  function persistRouteResult(result: RouteResult | null, forDate: string, forStopIds: string[]) {
    setRouteResult(result);
    try {
      if (result) {
        localStorage.setItem(routeResultKey(forDate, forStopIds), JSON.stringify(result));
      } else if (forStopIds.length) {
        localStorage.removeItem(routeResultKey(forDate, forStopIds));
      }
    } catch { /* best-effort — non-critical, safe to ignore */ }
  }

  const [returnToBase, setReturnToBase] = useState(true);
  const [scheduleDialog, setScheduleDialog] = useState<{claim:Claim|null;open:boolean}>({claim:null,open:false});
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [scheduleDuration, setScheduleDuration] = useState(60);
  const [defaultInspDuration] = useState(() => {
    try { return parseInt(localStorage.getItem("planner_default_duration") ?? "60") || 60; } catch { return 60; }
  });
  const [saving, setSaving] = useState(false);
  const [showBaseDialog, setShowBaseDialog] = useState(false);
  const [base, setBase] = useState<Base|null>(() => {
    try { return JSON.parse(localStorage.getItem("planner_base") ?? "null"); } catch { return null; }
  });
  const qc = useQueryClient();
  const selectedDateObj = fromDateLocal(selectedDate);
  const isCat = localStorage.getItem("planner_work_mode") === '"cat"';
  const activeCATId = localStorage.getItem("planner_active_deployment_id");
  const [activeCATLabel, setActiveCATLabel] = useState<string | null>(null);
  // Load active CAT label
  useState(() => {
    if (!activeCATId) return;
    supabase.from("deployments" as any).select("cat_number,name").eq("id", activeCATId).single()
      .then(({ data }) => {
        if (data) {
          const d = data as any;
          setActiveCATLabel(d.cat_number + (d.name ? ` — ${d.name}` : ""));
        }
      }).catch(() => {});
  });

  function prevWeek() {
    const d = fromDateLocal(weekStart); d.setDate(d.getDate() - 7);
    const s = toDateLocal(d); setWeekStart(s);
    // If selected date falls outside new window, snap to first day of new window
    const selD = fromDateLocal(selectedDate);
    const newEnd = new Date(d); newEnd.setDate(d.getDate() + 6);
    if (selD < d || selD > newEnd) { setSelectedDate(s); setRouteResult(null); }
  }
  function nextWeek() {
    const d = fromDateLocal(weekStart); d.setDate(d.getDate() + 7);
    const s = toDateLocal(d); setWeekStart(s);
    const selD = fromDateLocal(selectedDate);
    const newEnd = new Date(d); newEnd.setDate(d.getDate() + 6);
    if (selD < d || selD > newEnd) { setSelectedDate(s); setRouteResult(null); }
  }

  const isToday = selectedDate === toDateLocal(today);
  const isPast = fromDateLocal(selectedDate) < today && !isToday;
  const dayLabel = isToday ? "Today" : fromDateLocal(selectedDate).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  // Load the active deployment's full date range so we can show past days
  const { data: activeCATDeployment } = useQuery({
    queryKey: ["plan", "active-deployment", activeCATId],
    enabled: !!activeCATId && isCat,
    staleTime: 60000,
    queryFn: async () => {
      const { data } = await supabase.from("deployments" as any).select("cat_number,name,start_date,end_date,expected_return_date").eq("id", activeCATId!).single();
      return data as { cat_number: string; name: string; start_date: string | null; end_date: string | null; expected_return_date: string | null } | null;
    },
  });

  // Always exactly 7 days from weekStart — fills the strip evenly, navigate by week
  const quickDays = (() => {
    const days: { value: string; top: string; bottom: string; selected: boolean }[] = [];
    const startD = fromDateLocal(weekStart);
    const todayStr = toDateLocal(today);
    for (let i = 0; i < 7; i++) {
      const d = new Date(startD);
      d.setDate(startD.getDate() + i);
      const value = toDateLocal(d);
      days.push({
        value,
        top: value === todayStr ? "Today" : d.toLocaleDateString(undefined, { weekday: "short" }),
        bottom: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        selected: value === selectedDate,
      });
    }
    return days;
  })();

  const { data: stops, isLoading: stopsLoading } = useQuery({
    queryKey: ["plan", "stops", selectedDate, isPast, isCat, activeCATId],
    queryFn: async (): Promise<Claim[]> => {
      // Strict isolation: CAT mode with no deployment selected → empty
      // Regular mode → only claims with no deployment (deployment_id IS NULL)
      if (isCat && !activeCATId) return [];
      const addModeFilter = (q: ReturnType<typeof supabase.from>) => {
        if (isCat && activeCATId) return (q as any).eq("deployment_id", activeCATId);
        return (q as any).is("deployment_id", null); // Regular mode
      };
      if (isPast) {
        const d = fromDateLocal(selectedDate);
        const { data: byInspected } = await addModeFilter(supabase.from("claims").select("*")
          .gte("inspected_at", isoStart(d))
          .lte("inspected_at", isoEnd(d))
          .in("status", ["inspected", "closed"]));
        const { data: byScheduled } = await addModeFilter(supabase.from("claims").select("*")
          .gte("scheduled_at", isoStart(d))
          .lte("scheduled_at", isoEnd(d)));
        const all = [...(byInspected ?? []), ...(byScheduled ?? [])];
        const seen = new Set<string>();
        return all.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; })
          .sort((a, b) => {
            const ta = (a as any).inspected_at ?? a.scheduled_at ?? "";
            const tb = (b as any).inspected_at ?? b.scheduled_at ?? "";
            return ta < tb ? -1 : ta > tb ? 1 : 0;
          });
      }
      const { data, error } = await addModeFilter(supabase.from("claims").select("*")
        .gte("scheduled_at", isoStart(selectedDateObj))
        .lte("scheduled_at", isoEnd(selectedDateObj))
        .eq("status", "scheduled")
        .order("scheduled_at"));
      if (error) throw error;
      return data ?? [];
    },
  });

  // Restore persisted route result when stops load for the selected date.
  // routeResult is intentionally omitted from deps: it's only read here to
  // bail out once a result exists, and it changes on every optimize/save —
  // including it would re-run this effect and clobber a freshly-computed
  // route with the stale cached one.
  useEffect(() => {
    if (!stops || stops.length === 0) return;
    if (routeResult) return;
    try {
      const key = routeResultKey(selectedDate, stops.map(s => s.id));
      const stored = localStorage.getItem(key);
      if (stored) setRouteResult(JSON.parse(stored));
    } catch { /* best-effort — non-critical, safe to ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, selectedDate]);

  // Get status for all days in the strip (completed, in-progress, not-started)
  const quickDaysDateStrings = quickDays.map(d => d.value);
  const { data: allQuickDaysClaims } = useQuery({
    queryKey: ["plan", "quick-days-status", quickDaysDateStrings.join(","), isCat, activeCATId],
    queryFn: async () => {
      // Strict isolation: CAT mode with no deployment → no day indicators
      if (isCat && !activeCATId) return {};
      const applyMode = (q: any) => {
        if (isCat && activeCATId) return q.eq("deployment_id", activeCATId);
        return q.is("deployment_id", null); // Regular mode
      };
      const results: Record<string, { scheduled: number; inspected: number }> = {};
      for (const dateStr of quickDaysDateStrings) {
        const d = fromDateLocal(dateStr);
        const isPastD = d < today && dateStr !== toDateLocal(today);
        if (isPastD) {
          const { data: ins } = await applyMode(supabase.from("claims").select("id")
            .gte("inspected_at", isoStart(d)).lte("inspected_at", isoEnd(d)));
          results[dateStr] = { scheduled: 0, inspected: (ins ?? []).length };
        } else {
          const { data } = await applyMode(supabase.from("claims").select("id, status")
            .gte("scheduled_at", isoStart(d))
            .lte("scheduled_at", isoEnd(d))
            .in("status", ["scheduled", "inspected"]));
          results[dateStr] = {
            scheduled: (data ?? []).filter((c: any) => c.status === "scheduled").length,
            inspected: (data ?? []).filter((c: any) => c.status === "inspected").length,
          };
        }
      }
      return results;
    },
  });

  // Calculate day status for each day in quick navigation.
  // counts.scheduled = still-pending count (shrinks as claims get inspected),
  // so "completed" means nothing pending left AND at least one was done —
  // NOT scheduled === inspected, which was wrong (both could be 2 with 3 more
  // pending, and this would have incorrectly shown "completed").
  const getDayStatus = (dateStr: string): "not-started" | "in-progress" | "completed" => {
    const counts = allQuickDaysClaims?.[dateStr];
    if (!counts) return "not-started";
    const total = counts.scheduled + counts.inspected;
    if (total === 0) return "not-started";
    if (counts.scheduled === 0) return "completed";
    if (counts.inspected > 0) return "in-progress";
    return "not-started";
  };

  const stopIdsKey = (stops ?? []).map((s) => s.id).sort().join(",");
  const { data: firstContactedByClaim } = useQuery({
    queryKey: ["plan", "first-contacted", stopIdsKey],
    enabled: !!stopIdsKey,
    queryFn: async (): Promise<Record<string, string>> => {
      const ids = stopIdsKey.split(",").filter(Boolean);
      if (!ids.length) return {};
      const { data, error } = await supabase
        .from("call_attempts")
        .select("claim_id, attempted_at")
        .in("claim_id", ids)
        .order("attempted_at", { ascending: true });
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const row of data ?? []) {
        if (!map[row.claim_id]) map[row.claim_id] = row.attempted_at;
      }
      return map;
    },
  });

  const { data: unscheduled } = useQuery({
    queryKey: ["plan", "unscheduled", activeCATId, isCat],
    queryFn: async (): Promise<Claim[]> => {
      if (isCat && !activeCATId) return [];
      let query = supabase.from("claims").select("*")
        .in("status", ["to_call", "new"])
        .not("latitude", "is", null)
        .not("longitude", "is", null);
      if (isCat && activeCATId) {
        query = query.eq("deployment_id", activeCATId);
      } else {
        query = (query as any).is("deployment_id", null); // Regular mode
      }
      const { data, error } = await query.order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const scheduledIds = new Set((stops ?? []).map(s => s.id));
  // Smart suggestions: score by proximity to scheduled stops + cluster density
  const suggestions = (() => {
    const candidates = (unscheduled ?? []).filter(c => !scheduledIds.has(c.id));
    if (!candidates.length) return [];

    // Anchor points = today's scheduled stops (or base if no stops yet)
    const anchorPts: {lat:number;lng:number}[] = [
      ...(stops ?? []).filter(s => s.latitude && s.longitude).map(s => ({ lat: s.latitude!, lng: s.longitude! })),
      ...(base ? [base] : []),
    ];

    // Score each candidate
    const scored = candidates.map(c => {
      if (!c.latitude || !c.longitude) return { claim: c, score: 0, distKm: 999, clusterCount: 0 };
      const pt = { lat: c.latitude, lng: c.longitude };

      // Distance to nearest anchor (lower = better)
      const distToAnchor = anchorPts.length > 0
        ? Math.min(...anchorPts.map(a => hav(a, pt)))
        : 999;

      // Cluster density: how many OTHER candidates are within 8km (higher = better)
      const clusterCount = candidates.filter(other => {
        if (other.id === c.id || !other.latitude || !other.longitude) return false;
        return hav(pt, { lat: other.latitude, lng: other.longitude }) <= 8;
      }).length;

      // Days waiting (higher = more urgent)
      const daysWaiting = (Date.now() - new Date(c.created_at).getTime()) / 86400000;

      // Score: proximity 40% + cluster density 40% + wait time 20%
      const proxScore = distToAnchor < 5 ? 1 : distToAnchor < 15 ? 0.8 : distToAnchor < 30 ? 0.5 : distToAnchor < 60 ? 0.2 : 0.05;
      const clusterScore = Math.min(clusterCount / 5, 1);
      const waitScore = Math.min(daysWaiting / 30, 1);
      const score = proxScore * 0.4 + clusterScore * 0.4 + waitScore * 0.2;

      return { claim: c, score, distKm: Math.round(distToAnchor * 10) / 10, clusterCount, daysWaiting: Math.floor(daysWaiting) };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 10);
  })();

  function nextSlot(): string {
    const scheduled = (stops ?? []).filter(s=>s.scheduled_at).map(s=>new Date(s.scheduled_at!).getTime()).sort((a,b)=>a-b);
    const [sh,sm] = windowStart.split(":").map(Number);
    const [eh,em] = windowEnd.split(":").map(Number);
    const day = fromDateLocal(selectedDate);
    let candidate = new Date(day).setHours(sh,sm,0,0);
    const end = new Date(day).setHours(eh,em,0,0);
    const dur = 60*60*1000;
    for (const t of scheduled) { if (Math.abs(t-candidate)<dur) candidate=t+dur; }
    if (candidate>=end) return windowStart;
    const h=new Date(candidate).getHours(), m=new Date(candidate).getMinutes();
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
  }

  function openSchedule(claim: Claim) {
    setScheduleDialog({claim,open:true});
    setScheduleDuration((claim as any).inspection_duration_minutes ?? defaultInspDuration);
    setScheduleTime(nextSlot());
  }

  async function saveSchedule() {
    const c = scheduleDialog.claim; if (!c) return;
    setSaving(true);
    try {
      const [h,m] = scheduleTime.split(":").map(Number);
      const dt = new Date(selectedDateObj); dt.setHours(h,m,0,0);
      const updatePayload: Record<string, unknown> = {
        scheduled_at: dt.toISOString(),
        inspection_duration_minutes: scheduleDuration,
        status: "scheduled",
      };
      if (isCat && activeCATId) updatePayload.deployment_id = activeCATId;
      const { error } = await supabase.from("claims").update(updatePayload).eq("id", c.id);
      if (error) throw error;
      toast.success(`${c.insured_name} scheduled for ${scheduleTime}`);
      setScheduleDialog({claim:null,open:false});
      qc.invalidateQueries({queryKey:["plan"]});
      qc.invalidateQueries({queryKey:["claims"]});
      setRouteResult(null);
    } catch(err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally { setSaving(false); }
  }

  async function markInspected(id: string, insuredName: string) {
    const { error } = await supabase.from("claims").update({
      status: "inspected",
      inspected_at: new Date().toISOString(),
    } as any).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`${insuredName} marked as inspected ✓`);
    setJustInspectedId(id);
    qc.invalidateQueries({ queryKey: ["plan"] });
    qc.invalidateQueries({ queryKey: ["claims"] });
    qc.invalidateQueries({ queryKey: ["claims_with_call_status"] });
    setRouteResult(null);
  }

  async function unschedule(id: string) {
    const { error } = await supabase.from("claims").update({scheduled_at:null,status:"to_call"} as any).eq("id",id);
    if (error) { toast.error(error.message); return; }
    toast.success("Removed from day");
    if (stops) persistRouteResult(null, selectedDate, stops.map(s => s.id));
    setRouteResult(null);
    qc.invalidateQueries({queryKey:["plan"]});
    qc.invalidateQueries({queryKey:["claims"]});
  }

  async function markContactStarted(claim: Claim) {
    const now = new Date();
    const todayDate = toDateLocal(now);
    const patch: Record<string, unknown> = { last_contacted_at: now.toISOString() };
    if (!(claim as any).date_contacted) patch.date_contacted = todayDate;
    const { error } = await supabase.from("claims").update(patch).eq("id", claim.id);
    if (!error) {
      qc.invalidateQueries({ queryKey: ["plan"] });
      qc.invalidateQueries({ queryKey: ["claims"] });
    }
  }

  function optimize() {
    if (!stops?.length) { toast.error("No stops scheduled."); return; }
    setPlanning(true);
    setTimeout(() => {
      try {
        const result = buildRoute(stops, base, windowStart, returnToBase, defaultInspDuration);
        persistRouteResult(result, selectedDate, stops.map(s => s.id));
        const missingGeo = stops.filter((s) => !hasCoords(s)).length;
        toast.success(missingGeo ? "Route ready from addresses. Geocoding will improve drive-time estimates." : "Route ready");
      } catch(err) { toast.error(String(err)); }
      finally { setPlanning(false); }
    }, 50);
  }

  async function geocodeMissingStops(inputStops: Claim[]): Promise<Claim[]> {
    const updated: Claim[] = [];
    let changed = false;
    for (const s of inputStops) {
      if (hasCoords(s)) { updated.push(s); continue; }
      const address = claimAddress(s);
      if (!address.trim()) { updated.push(s); continue; }
      try {
        const geo = await geocodeAddress(address);
        if (geo.ok && typeof geo.latitude === "number" && typeof geo.longitude === "number") {
          const patch: Record<string, unknown> = {
            latitude: geo.latitude,
            longitude: geo.longitude,
            place_id: geo.placeId,
            formatted_address: s.formatted_address || geo.formattedAddress || address,
            street: s.street || geo.street,
            city: s.city || geo.city,
            province: s.province || geo.province,
            postal_code: s.postal_code || geo.postalCode,
            country: geo.country || "CA",
          };
          await supabase.from("claims").update(patch).eq("id", s.id);
          updated.push({ ...s, ...patch } as Claim);
          changed = true;
        } else {
          updated.push(s);
        }
      } catch {
        updated.push(s);
      }
    }
    if (changed) {
      qc.invalidateQueries({ queryKey: ["plan"] });
      qc.invalidateQueries({ queryKey: ["claims"] });
    }
    return updated;
  }

  async function resolveBaseForRoute(currentBase: Base | null): Promise<Base | null> {
    if (!currentBase) return null;
    if (currentBase && hasBaseCoords(currentBase)) return currentBase;
    const query = currentBase.address?.trim() || currentBase.label?.trim();
    if (!query) return currentBase;
    try {
      const geo = await geocodeAddress(query);
      if (geo.ok && typeof geo.latitude === "number" && typeof geo.longitude === "number") {
        const resolved: Base = {
          ...currentBase,
          address: geo.formattedAddress || currentBase.address || query,
          lat: geo.latitude,
          lng: geo.longitude,
          placeId: geo.placeId || currentBase.placeId,
        };
        setBase(resolved);
        try { localStorage.setItem("planner_base", JSON.stringify(resolved)); } catch { /* best-effort — non-critical, safe to ignore */ }
        return resolved;
      }
    } catch (err) {
      console.warn("Base geocode failed", err);
    }
    return currentBase;
  }

  async function geocodeMissingStopsUI() {
    if (!stops?.length) return;
    const missing = stops.filter(s => !s.latitude || !s.longitude);
    if (!missing.length) { toast.info("All stops already have coordinates."); return; }
    toast.info(`Geocoding ${missing.length} address${missing.length > 1 ? "es" : ""}…`);
    let fixed = 0;
    for (const s of missing) {
      const addr = s.formatted_address ?? [s.street, s.city, s.province, s.postal_code].filter(Boolean).join(", ");
      if (!addr) continue;
      try {
        const geo = await geocodeAddress(addr);
        if (geo.ok && geo.latitude && geo.longitude) {
          await supabase.from("claims").update({ latitude: geo.latitude, longitude: geo.longitude } as any).eq("id", s.id);
          fixed++;
        }
      } catch { /* best-effort — non-critical, safe to ignore */ }
    }
    if (fixed > 0) {
      toast.success(`Geocoded ${fixed} address${fixed > 1 ? "es" : ""}`);
      qc.invalidateQueries({ queryKey: ["plan"] });
      qc.invalidateQueries({ queryKey: ["claims"] });
      setRouteResult(null);
    } else {
      toast.error("Could not geocode any addresses. Check your internet connection.");
    }
  }

  async function optimizeWithMaps() {
    if (!stops?.length) { toast.error("No stops."); return; }
    setManualOrder(null);
    setPlanning(true);
    try {
      const routeBase = await resolveBaseForRoute(base);
      const hydratedStops = await geocodeMissingStops(stops);
      const hasFixedAppointments = hydratedStops.some((s) => !!s.scheduled_at);
      const local = buildRoute(hydratedStops, routeBase, windowStart, returnToBase, defaultInspDuration);
      const localOrderedStops = local.orderedIds
        .map((id) => hydratedStops.find((s) => s.id === id))
        .filter((s): s is Claim => !!s);

      const anchor = routeBase && hasBaseCoords(routeBase)
        ? { lat: routeBase.lat, lng: routeBase.lng }
        : null;
      const routeableStops = localOrderedStops.filter(hasCoords);

      // If Google/Base/stop coordinates are missing, still create the Google Maps link
      // from addresses and show the best local estimate available.
      if (!anchor || routeableStops.length === 0) {
        persistRouteResult(local, selectedDate, (stops??[]).map(s=>s.id));
        toast.success("Route ready from addresses. Search/select the base and stop addresses for drive time + distance.");
        return;
      }

      try {
        const live = await planRoute({
          origin: anchor,
          stops: routeableStops.map((s) => ({ id: s.id, lat: s.latitude, lng: s.longitude })),
          destination: returnToBase ? anchor : undefined,
          optimize: !hasFixedAppointments,
        });

        const liveOrderedIds = hasFixedAppointments
          ? routeableStops.map((s) => s.id)
          : live.orderedIds;
        const nonGeoIds = localOrderedStops.filter((s) => !hasCoords(s)).map((s) => s.id);
        const finalOrderedIds = hasFixedAppointments
          ? local.orderedIds
          : [...liveOrderedIds, ...nonGeoIds];

        const liveOrderedStops = liveOrderedIds
          .map((id) => hydratedStops.find((s) => s.id === id))
          .filter((s): s is Claim => !!s);
        const liveLegs = buildLegsFromLiveMetrics(
          liveOrderedStops,
          local.legs,
          live.legDurations,
          live.legDistances,
          windowStart,
          hasFixedAppointments,
          defaultInspDuration,
        );
        const liveLegMap = liveLegs.reduce((acc, l) => { acc[l.toId] = l; return acc; }, {} as Record<string, typeof liveLegs[0]>);
        const finalLegs = finalOrderedIds
          .map((id) => liveLegMap[id] ?? local.legs.find((l) => l.toId === id))
          .filter((l): l is Leg => !!l);

        persistRouteResult({ orderedIds: finalOrderedIds, legs: finalLegs, totalDriveMin: Math.round(live.durationSeconds / 60), totalDistKm: Math.round((live.distanceMeters / 1000) * 10) / 10, leaveByTime: computeLeaveByTime(finalLegs) }, selectedDate, (stops??[]).map(s=>s.id));
        toast.success(hasFixedAppointments ? "Route calculated. Appointment hours preserved." : "Route optimized with live traffic.");
        return;
      } catch (err) {
        console.warn("Live route failed; using local distance estimate", err);
        persistRouteResult(local, selectedDate, (stops??[]).map(s=>s.id));
        toast.success("Route ready with local distance estimate. Check Google Maps link for live traffic.");
        return;
      }
    } catch (err) {
      console.error("Route generation failed", err);
      toast.error("Something went wrong generating your route. Check that your stops have verified addresses, then try again.");
      optimize();
    } finally {
      setPlanning(false);
    }
  }

  const orderedStops = routeResult
    ? routeResult.orderedIds.map(id=>stops!.find(s=>s.id===id)!).filter(Boolean)
    : stops ?? [];

  // Manual drag reorder — overrides the optimized/natural order above.
  // Persisted per-date so it survives navigating away and back, same
  // reasoning as the selected-date persistence.
  const [manualOrder, setManualOrderState] = useState<string[] | null>(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`planner_manual_order_${selectedDate}`);
      setManualOrderState(stored ? JSON.parse(stored) : null);
    } catch { setManualOrderState(null); }
  }, [selectedDate]);
  function setManualOrder(order: string[] | null) {
    setManualOrderState(order);
    try {
      if (order) localStorage.setItem(`planner_manual_order_${selectedDate}`, JSON.stringify(order));
      else localStorage.removeItem(`planner_manual_order_${selectedDate}`);
    } catch { /* best-effort — non-critical, safe to ignore */ }
  }

  const displayStops = manualOrder
    ? [
        ...manualOrder.map(id => orderedStops.find(s => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s),
        ...orderedStops.filter(s => !manualOrder.includes(s.id)),
      ]
    : orderedStops;
  const manualOrderActive = manualOrder != null && displayStops.some((s, i) => orderedStops[i]?.id !== s.id);

  // Drag-to-reorder — pointer events (not HTML5 draggable) because iOS
  // Safari doesn't fire drag events for touch-initiated drags on
  // draggable elements. setPointerCapture keeps move/up events targeted
  // at the handle even as the finger moves over other rows.
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dragOrderRef = useRef<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function startDrag(id: string, e: React.PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOrderRef.current = displayStops.map(s => s.id);
    setDraggingId(id);
  }
  function onDragMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!draggingId) return;
    const y = e.clientY;
    const order = dragOrderRef.current;
    const draggingIndex = order.indexOf(draggingId);
    if (draggingIndex === -1) return;
    for (let idx = 0; idx < order.length; idx++) {
      if (idx === draggingIndex) continue;
      const el = rowRefs.current[order[idx]];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if ((idx < draggingIndex && y < mid) || (idx > draggingIndex && y > mid)) {
        const newOrder = [...order];
        newOrder.splice(draggingIndex, 1);
        newOrder.splice(idx, 0, draggingId);
        dragOrderRef.current = newOrder;
        setManualOrder(newOrder);
        break;
      }
    }
  }
  function endDrag() {
    setDraggingId(null);
  }


  const originStop = baseMapStop(base);
  const mapsStops = [
    ...(originStop ? [originStop] : []),
    ...displayStops.map(claimMapStop),
    ...(returnToBase && originStop && displayStops.length > 0 ? [originStop] : []),
  ];
  const mapsLink = displayStops.length > 0 ? googleMapsDirectionsLink(mapsStops) : null;

  const routeMapUrl = (() => {
    const geoStops = displayStops.filter(hasCoords);
    if (geoStops.length === 0) return null;
    const points = geoStops
      .map((s, i) => `${s.latitude},${s.longitude},${i + 1},blue`)
      .join(";");
    const params = new URLSearchParams({ points, width: "600", height: "280" });
    if (base) params.set("base", `${base.lat},${base.lng}`);
    const pathPoints = [
      ...(base ? [`${base.lat},${base.lng}`] : []),
      ...geoStops.map((s) => `${s.latitude},${s.longitude}`),
      ...(returnToBase && base ? [`${base.lat},${base.lng}`] : []),
    ];
    if (pathPoints.length > 1) params.set("path", pathPoints.join("|"));
    return `/api/static-map?${params.toString()}`;
  })();

  const atCap = (stops?.length??0) >= dailyCap;
  const overCap = (stops?.length??0) > dailyCap;

  // Smart call scoring (simple, no engine import)
  // Geographic clustering — group nearby claims so the call queue
  // naturally steers toward calling (and later booking) a whole area
  // together, instead of scattering today's calls across the map.
  return (
    <div className="space-y-4">
      {/* Week nav header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={prevWeek} aria-label="Previous week">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Route Planner</p>
            {selectedDate !== toDateLocal(new Date()) && (
              <button
                type="button"
                onClick={() => {
                  const todayStr = toDateLocal(new Date());
                  setSelectedDate(todayStr);
                  setWeekStart(todayStr);
                  setRouteResult(null);
                }}
                className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20"
              >
                Back to Today
              </button>
            )}
          </div>
          <h1 className="text-xl font-semibold">{dayLabel}</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={nextWeek} aria-label="Next week">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 7-day strip — evenly spaced, full width */}
      <div className="grid grid-cols-7 gap-1">
        {quickDays.map((d) => {
          const isPastDay = fromDateLocal(d.value) < today && d.value !== toDateLocal(today);
          const dayStatus = getDayStatus(d.value);
          return (
            <Button
              key={d.value}
              type="button"
              variant={d.selected ? "default" : "outline"}
              size="sm"
              className={`h-auto flex-col gap-0.5 py-1.5 px-0.5 text-center ${isPastDay && !d.selected ? "opacity-60" : ""}`}
              onClick={() => { setSelectedDate(d.value); setRouteResult(null); }}
            >
              <span className="text-xs leading-none truncate w-full text-center">{d.top}</span>
              <span className="text-xs font-semibold leading-none">{d.bottom}</span>
              {dayStatus === "completed" && <CheckCircle2 className="w-2.5 h-2.5 text-green-500 mt-0.5" />}
              {dayStatus === "in-progress" && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mt-0.5" />}
              {dayStatus === "not-started" && <div className="w-1.5 h-1.5 rounded-full bg-muted mt-0.5" />}
            </Button>
          );
        })}
      </div>

      {/* Settings card — Route Mode only; Call Mode doesn't need date/cap/base */}
      <Card className="p-3 space-y-3">
        {/* Active CAT info */}
        {isCat && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              {activeCATLabel
                ? <span className="font-medium text-orange-700 dark:text-orange-400">{activeCATLabel}</span>
                : <span className="text-muted-foreground">No CAT selected</span>
              }
            </div>
            <Link to="/deployments" className="text-orange-600 dark:text-orange-400 underline text-xs">
              {activeCATLabel ? "Switch CAT" : "Select CAT"}
            </Link>
          </div>
        )}

        {/* Base */}
        {base ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Home className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Base</p>
                <p className="text-sm font-medium truncate">{base.label}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowBaseDialog(true)}>Change</Button>
          </div>
        ) : (
          <div className="rounded-lg border-2 border-primary/40 bg-primary/5 p-3 text-center space-y-2">
            <Home className="w-6 h-6 mx-auto text-primary" />
            <p className="text-sm font-medium">Set your base to calculate routes and call priority.</p>
            <Button size="sm" onClick={() => setShowBaseDialog(true)}>Set base</Button>
          </div>
        )}

        {base && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Return to base at end</span>
            <button onClick={() => setReturnToBase(!returnToBase)}
              className={`w-10 h-5 rounded-full transition-colors ${returnToBase?"bg-primary":"bg-muted"}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${returnToBase?"translate-x-5":""}`} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Date</Label>
            <Input type="date" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setRouteResult(null); }} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1"><Settings2 className="w-3 h-3" />Cap</Label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-11 w-11" onClick={() => setDailyCap(Math.max(1,dailyCap-1))} aria-label="Decrease cap"><Minus className="w-4 h-4" /></Button>
              <span className="text-lg font-bold tabular-nums w-8 text-center">{dailyCap}</span>
              <Button variant="outline" size="icon" className="h-11 w-11" onClick={() => setDailyCap(dailyCap+1)} aria-label="Increase cap"><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="space-y-1 col-span-2">
            <Label className="text-xs flex items-center gap-1"><Clock className="w-3 h-3" />First inspection starts at</Label>
            <div className="flex items-center gap-2">
              <Input type="time" value={windowStart} onChange={e=>setWindowStart(e.target.value)} className="flex-1" />
              <span className="text-xs text-muted-foreground">to</span>
              <Input type="time" value={windowEnd} onChange={e=>setWindowEnd(e.target.value)} className="flex-1" />
            </div>
            <p className="text-xs text-muted-foreground">This is when you start your first inspection — not when you leave base. We'll tell you when to leave.</p>
          </div>
          {/* Inspection duration set in CAT config, shown here as info only */}
          {defaultInspDuration !== 60 && (
            <div className="col-span-2 text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />Inspection duration: {defaultInspDuration}min (from CAT config)
            </div>
          )}
        </div>

        {overCap && (
          <div className="flex items-center gap-2 text-xs text-orange-500/80 text-xs">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {stops!.length} stops booked ({stops!.length - dailyCap} over cap) — route will run anyway
          </div>
        )}
      </Card>

      {/* ROUTE MODE */}
        <>
          {/* Past day — read-only history view */}
          {isPast && (
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span>Route history — {dayLabel}</span>
                <span className="ml-auto font-medium text-foreground">{stops?.length ?? 0} visit{(stops?.length ?? 0) !== 1 ? "s" : ""}</span>
              </div>
              {routeMapUrl && (
                <StaticMapImage src={routeMapUrl} alt={`Route history ${dayLabel}`} className="w-full h-44 object-cover rounded-lg border border-border" />
              )}
              {stopsLoading ? <Skeleton className="h-16" /> : !stops?.length ? (
                <p className="text-sm text-muted-foreground text-center py-4">No visits recorded for this day.</p>
              ) : (
                <div className="space-y-2">
                  {displayStops.map((s, i) => (
                    <div key={s.id} className="flex items-start gap-2 py-1 border-b border-border/50 last:border-0">
                      <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">{i + 1}</div>
                      <Link to="/claims/$claimId" params={{ claimId: s.id }} className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{s.insured_name}</div>
                        <div className="text-xs text-muted-foreground truncate">{s.formatted_address}</div>
                        {s.inspected_at && (
                          <div className="text-xs text-green-600 mt-0.5">
                            Inspected {new Date(s.inspected_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        )}
                      </Link>
                      <div className="shrink-0">
                        {s.status === "inspected" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        {s.status === "scheduled" && <AlertCircle className="w-4 h-4 text-amber-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <PrintButton stops={displayStops} routeResult={null} selectedDate={selectedDate} base={base} />
                <PackageButton stops={displayStops} routeResult={null} selectedDate={selectedDate} firstContactedByClaim={firstContactedByClaim ?? {}} />
              </div>
            </Card>
          )}

          {/* Future/today — editable route */}
          {!isPast && (<>
          {routeResult && (
            <Card className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xl font-semibold tabular-nums">{Math.round(routeResult.totalDriveMin)} min</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Driving</div>
                </div>
                <div>
                  <div className="text-xl font-semibold tabular-nums">{routeResult.totalDistKm.toFixed(1)} km</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Distance</div>
                </div>
                <div>
                  <div className="text-xl font-semibold tabular-nums">
                    {routeResult.legs.length > 0 ? routeResult.legs[0].arrivalTime : "—"}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">First stop</div>
                </div>
              </div>
              {routeResult.legs.length > 0 && (
                <div className="text-xs text-muted-foreground text-center">
                  Route: {routeResult.legs[0]?.arrivalTime} → {routeResult.legs[routeResult.legs.length - 1]?.arrivalTime}
                  {returnToBase ? " (returns to base)" : ""}
                </div>
              )}
              {routeResult.leaveByTime && routeResult.legs.length > 0 && (
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-primary bg-primary/10 rounded-md py-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Plan to leave by {routeResult.leaveByTime} to arrive at {routeResult.legs[0].arrivalTime}
                </div>
              )}
              {routeResult.totalDriveMin === 0 && displayStops.some(s => !s.latitude) && (
                <div className="flex items-start gap-2 text-xs text-orange-600 bg-orange-50 dark:bg-orange-950/20 rounded-md p-2">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Some stops have no coordinates — drive times estimated as 0. <button className="underline font-medium" onClick={geocodeMissingStopsUI}>Geocode missing addresses</button></span>
                </div>
              )}
              {manualOrderActive && (
                <div className="flex items-center justify-between gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 rounded-md p-2">
                  <span className="flex items-center gap-1.5"><GripVertical className="w-3.5 h-3.5 shrink-0" />Manually reordered — drive times below are from the last optimize.</span>
                  <button className="underline font-medium shrink-0" onClick={optimizeWithMaps}>Re-optimize</button>
                </div>
              )}
              <div className="flex gap-2">
                {mapsLink && (
                  <Button asChild className="flex-1" variant="secondary">
                    <a href={mapsLink} target="_blank" rel="noreferrer"><Navigation className="w-4 h-4 mr-2" />Full Route</a>
                  </Button>
                )}
                {base && (
                  <Button asChild variant="outline" title="Drive back to base">
                    <a
                      href={
                        hasBaseCoords(base)
                          ? `https://www.google.com/maps/dir/?api=1&destination=${base.lat},${base.lng}&travelmode=driving`
                          : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(base.address ?? base.label)}&travelmode=driving`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Navigation className="w-4 h-4 mr-1" />Base
                    </a>
                  </Button>
                )}
                <PrintButton stops={displayStops} routeResult={manualOrderActive ? null : routeResult} selectedDate={selectedDate} base={base} />
                <PackageButton stops={displayStops} routeResult={manualOrderActive ? null : routeResult} selectedDate={selectedDate} firstContactedByClaim={firstContactedByClaim ?? {}} />
              </div>
            </Card>
          )}

          {/* Why optimize can't run yet */}
          {!stopsLoading && !routeResult && (() => {
            const reasons: string[] = [];
            if (!stops || stops.length === 0) reasons.push("No scheduled inspections for this date.");
            if (!hasBaseCoords(base)) reasons.push("No base location set.");
            if (stops && stops.length > 0 && stops.some(s => !hasCoords(s))) reasons.push("Some claims are missing coordinates.");
            if (reasons.length === 0) return null;
            return (
              <div className="rounded-md border border-orange-300/50 bg-orange-50 dark:bg-orange-950/20 p-2.5 text-xs text-orange-700 dark:text-orange-400 space-y-1">
                {reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-1.5"><AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />{r}</div>
                ))}
              </div>
            );
          })()}

          {/* Route assumptions before optimizing */}
          {!stopsLoading && !routeResult && stops && stops.length > 0 && (
            <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 px-1">
              <span>Start: <strong className="text-foreground">{windowStart}</strong></span>
              <span>Inspection: <strong className="text-foreground">{defaultInspDuration}min</strong></span>
              <span>Max stops: <strong className="text-foreground">{dailyCap}</strong></span>
              <span>Base: <strong className="text-foreground">{base?.label ?? "not set"}</strong></span>
            </div>
          )}

          {/* Action buttons */}
          {!stopsLoading && (
            <div className="flex gap-2">
              <Button onClick={optimizeWithMaps} disabled={planning} className="flex-1">
                {planning ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RouteIcon className="w-4 h-4 mr-2" />{routeResult?"Re-optimize":"Optimize route"}</>}
              </Button>
              {stops && stops.length > 0 && !routeResult && (
                <>
                  <PrintButton stops={displayStops} routeResult={null} selectedDate={selectedDate} base={base} />
                  <PackageButton stops={displayStops} routeResult={null} selectedDate={selectedDate} firstContactedByClaim={firstContactedByClaim ?? {}} />
                </>
              )}
            </div>
          )}

          {/* Route map — numbered stops in visit order, connected by a line
              once optimized. Same static-image approach as the Call Mode
              cluster map (cheap, fast, no client-side Maps SDK). */}
          {routeMapUrl && (
            <Card className="p-3">
              <StaticMapImage
                src={routeMapUrl}
                alt="Map of today's route"
                className="w-full h-52 object-cover rounded-lg border border-border"
              />
            </Card>
          )}

          {/* Scheduled stops */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold">
              Scheduled <span className={`text-xs font-normal ${atCap?"text-orange-600":"text-muted-foreground"}`}>{stops?.length??0}/{dailyCap}</span>
            </h2>
            {stopsLoading ? <><Skeleton className="h-16" /><Skeleton className="h-16" /></> :
              !stops?.length && (allQuickDaysClaims?.[selectedDate]?.inspected ?? 0) > 0 ? (
                <Card className="p-6 text-center space-y-3 border-green-300 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">Route complete!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      All {allQuickDaysClaims![selectedDate].inspected} inspection{allQuickDaysClaims![selectedDate].inspected > 1 ? "s" : ""} marked inspected for {dayLabel}.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {base && (
                      <Button asChild size="sm" variant="outline" className="gap-1.5 border-green-400 text-green-700 hover:bg-green-100">
                        <a
                          href={
                            hasBaseCoords(base)
                              ? `https://www.google.com/maps/dir/?api=1&destination=${base.lat},${base.lng}&travelmode=driving`
                              : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(base.address ?? base.label)}&travelmode=driving`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Drive to Base
                        </a>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                      onClick={() => { toast.success("Nice work — route complete! Let's plan tomorrow."); nextDay(); }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete Route — Plan Tomorrow
                    </Button>
                  </div>
                </Card>
              ) : !stops?.length ? (
                <Card className="p-6 text-center text-sm text-muted-foreground space-y-2">
                  <Map className="w-8 h-8 mx-auto text-muted-foreground/60" />
                  <p>No inspections scheduled.</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {displayStops.map((s,i) => {
                    const leg = !manualOrderActive ? routeResult?.legs.find(l=>l.toId===s.id) : undefined;
                    const nextStop = displayStops[i + 1];
                    return (
                      <Card
                        key={s.id}
                        ref={(el) => { rowRefs.current[s.id] = el; }}
                        className={`p-3 transition-shadow ${draggingId === s.id ? "shadow-lg ring-2 ring-primary/40" : ""}`}
                      >
                        {/* Just-inspected confirmation banner with Drive to Next */}
                        {justInspectedId === s.id && (
                          <div className="mb-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-2.5 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-400 flex-1">Inspection complete</span>
                            {nextStop && (
                              <Button asChild size="sm" className="h-8 gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs shrink-0">
                                <a href={driveToClaimLink(nextStop)} target="_blank" rel="noreferrer">
                                  <Navigation className="w-3.5 h-3.5" />Drive to next
                                </a>
                              </Button>
                            )}
                            <button type="button" onClick={() => setJustInspectedId(null)} className="text-muted-foreground hover:text-foreground ml-1 text-xs">✕</button>
                          </div>
                        )}
                        {/* Top row: drag handle + stop number + claim info (tappable) */}
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            className="h-10 w-7 flex items-center justify-center text-muted-foreground shrink-0 touch-none cursor-grab active:cursor-grabbing"
                            style={{ touchAction: "none" }}
                            aria-label={`Reorder ${s.insured_name}`}
                            onPointerDown={(e) => startDrag(s.id, e)}
                            onPointerMove={onDragMove}
                            onPointerUp={endDrag}
                            onPointerCancel={endDrag}
                          >
                            <GripVertical className="w-4 h-4" />
                          </button>
                          <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5">{i+1}</div>
                          <Link to="/claims/$claimId" params={{claimId:s.id}} className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{s.insured_name}</div>
                            <div className="text-xs text-muted-foreground truncate">{s.formatted_address}</div>
                            {leg ? (
                              <div className="flex items-center gap-1.5 text-xs mt-0.5 flex-wrap">
                                <span className="font-semibold text-primary">{leg.arrivalTime}</span>
                                <span className="text-muted-foreground">–</span>
                                <span className="text-muted-foreground">{leg.departureTime}</span>
                                {leg.driveMin > 0 && i > 0 && (
                                  <span className="text-muted-foreground ml-auto">{leg.driveMin}min · {leg.distKm}km</span>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-primary mt-0.5">{formatDateTime(s.scheduled_at)}</div>
                            )}
                          </Link>
                        </div>

                        {/* Bottom action bar */}
                        <div className="flex gap-0 mt-2 -mx-1 border-t border-border/50 pt-2">
                          {/* Drive Here */}
                          <a
                            href={driveToClaimLink(s)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors"
                          >
                            <Navigation className="w-4 h-4" />
                            <span className="text-[10px] font-medium">Drive</span>
                          </a>
                          {/* Call */}
                          {s.insured_phone && (
                            <a
                              href={ciscoJabberLink(s.insured_phone) ?? telLink(s.insured_phone) ?? "#"}
                              onClick={() => void markContactStarted(s)}
                              className="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                              <span className="text-[10px] font-medium">Call</span>
                            </a>
                          )}
                          {/* Mark Inspected */}
                          <button
                            type="button"
                            onClick={() => markInspected(s.id, s.insured_name)}
                            className="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-lg transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[10px] font-medium">Done</span>
                          </button>
                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => unschedule(s.id)}
                            className="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                            <span className="text-[10px] font-medium">Remove</span>
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )
            }
          </section>

          {/* Suggestions */}
          {!isPast && suggestions.length > 0 && (
            <section className="space-y-2">
              <div>
                <h2 className="text-sm font-semibold">Suggestions</h2>
                <p className="text-xs text-muted-foreground">Unscheduled geocoded claims — oldest first</p>
              </div>
              <div className="space-y-2">
                {suggestions.map(({ claim: c, distKm, clusterCount, daysWaiting }, i) => (
                  <Card key={c.id} className={`p-3 border-dashed ${i<3?"border-primary/40":""}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${i===0?"bg-primary text-primary-foreground":i<3?"bg-primary/20 text-primary":"bg-muted text-muted-foreground"}`}>{i+1}</div>
                      <Link to="/claims/$claimId" params={{claimId:c.id}} className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{c.insured_name}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{c.formatted_address ?? c.city ?? "No address"}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {distKm < 999 && <span className="text-xs text-muted-foreground">{distKm < 1 ? `${Math.round(distKm*1000)}m` : `${distKm}km`} away</span>}
                          {clusterCount > 0 && <span className="text-xs text-primary">{clusterCount} nearby claim{clusterCount > 1 ? "s" : ""}</span>}
                          {daysWaiting >= 5 && <span className="text-xs text-orange-500">{daysWaiting}d waiting</span>}
                        </div>
                      </Link>
                      <Button size="sm" variant={i<3?"default":"outline"} className="shrink-0 h-8"
                        disabled={atCap} onClick={() => openSchedule(c)}
                        title={atCap?`Cap of ${dailyCap} reached`:`Add at ${nextSlot()}`}>
                        <Plus className="w-3.5 h-3.5 mr-1" />Add
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
          </>) /* end !isPast editable route */}
        </>

      {/* Schedule dialog */}
      <Dialog open={scheduleDialog.open} onOpenChange={o => { if(!o) setScheduleDialog({claim:null,open:false}); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule inspection</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">{scheduleDialog.claim?.insured_name}</p>
              <p className="text-xs text-muted-foreground">{scheduleDialog.claim?.formatted_address}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Date</Label>
                <Input type="date" value={selectedDate} readOnly className="bg-muted" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Time</Label>
                <Input type="time" value={scheduleTime} onChange={e=>setScheduleTime(e.target.value)} /></div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Duration (min)</Label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="h-11 w-11" onClick={()=>setScheduleDuration(Math.max(15,scheduleDuration-15))} aria-label="Decrease duration"><Minus className="w-4 h-4" /></Button>
                <span className="text-lg font-bold w-12 text-center">{scheduleDuration}</span>
                <Button variant="outline" size="icon" className="h-11 w-11" onClick={()=>setScheduleDuration(scheduleDuration+15)} aria-label="Increase duration"><Plus className="w-4 h-4" /></Button>
                <span className="text-xs text-muted-foreground">min</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={()=>setScheduleDialog({claim:null,open:false})}>Cancel</Button>
            <Button onClick={saveSchedule} disabled={saving}>
              {saving?<Loader2 className="w-4 h-4 animate-spin" />:<><CheckCircle2 className="w-4 h-4 mr-1" />Schedule</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Base dialog */}
      <BaseDialog open={showBaseDialog} onClose={()=>setShowBaseDialog(false)} current={base}
        onSave={b=>{ setBase(b); try{localStorage.setItem("planner_base",JSON.stringify(b));}catch{ /* best-effort */ } setShowBaseDialog(false); toast.success("Base saved"); }} />
    </div>
  );
}

// ── Base dialog ────────────────────────────────────────────────────────────────
function CallQueueCard({ c, i, base, markContactStarted, qc }: {
  c: any; i: number; base: Base | null;
  markContactStarted: (c: any) => Promise<void>;
  qc: ReturnType<typeof useQueryClient>;
}) {
  return (
    <Card className={`p-3 ${i === 0 ? "border-primary/40 bg-primary/5" : ""}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${i === 0 ? "bg-primary text-primary-foreground" : i < 3 ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
          {i === 0 ? <Star className="w-4 h-4" /> : i + 1}
        </div>
        <Link to="/claims/$claimId" params={{ claimId: c.id }} className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{c.insured_name}</span>
            <Badge variant="outline" className={`text-xs ${i < 3 ? "border-primary/40 text-primary" : ""}`}>{c.score}</Badge>
            {c.clusterSize > 1 && (
              <Badge className="text-xs bg-primary/15 text-primary border-0 gap-0.5">
                <MapPin className="w-2.5 h-2.5" />{c.clusterLabel}
              </Badge>
            )}
          </div>
          {c.claim_number && <div className="text-xs text-muted-foreground">#{c.claim_number}</div>}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{c.formatted_address ?? c.city ?? "—"}</span>
          </div>
          {base && c.dist < 999 && (
            <p className="text-xs text-muted-foreground mt-0.5">{c.dist.toFixed(1)}km from base · {Math.floor((Date.now() - new Date(c.created_at).getTime()) / 86400000)}d waiting</p>
          )}
          {c.last_call_outcome && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Last: {OUTCOMES.find((o) => o.value === c.last_call_outcome)?.label ?? c.last_call_outcome}
              {c.last_call_at ? ` · ${formatRelative(c.last_call_at)}` : ""}
            </p>
          )}
        </Link>
        {c.insured_phone && (
          <div className="flex flex-col gap-1 shrink-0">
            <Button asChild size="sm" variant={i === 0 ? "default" : "secondary"}>
              <a href={ciscoJabberLink(c.insured_phone) ?? telLink(c.insured_phone) ?? "#"} onClick={() => void markContactStarted(c)}><Phone className="w-3.5 h-3.5 mr-1" />Call</a>
            </Button>
          </div>
        )}
      </div>
      <div className="mt-2 pt-2 border-t border-border/60">
        <CallLogger claimId={c.id} compact onLogged={() => qc.invalidateQueries({ queryKey: ["plan", "all_active"] })} latitude={c.latitude} longitude={c.longitude} />
      </div>
    </Card>
  );
}

function BaseDialog({ open, onClose, current, onSave }: { open:boolean; onClose:()=>void; current:Base|null; onSave:(b:Base)=>void }) {
  const [label, setLabel] = useState(current?.label ?? "");
  const [address, setAddress] = useState(current?.address ?? "");
  const [lat, setLat] = useState(String(current?.lat ?? ""));
  const [lng, setLng] = useState(String(current?.lng ?? ""));
  const [placeId, setPlaceId] = useState(current?.placeId ?? "");
  const [locating, setLocating] = useState(false);
  const [savingBase, setSavingBase] = useState(false);

  function onBaseResolved(addr: ResolvedAddress) {
    setAddress(addr.formattedAddress || [addr.street, addr.city, addr.province, addr.postalCode].filter(Boolean).join(", "));
    setLat(String(addr.latitude));
    setLng(String(addr.longitude));
    setPlaceId(addr.placeId);
    if (!label.trim()) setLabel(addr.name || addr.formattedAddress || "Base");
    toast.success("Base address resolved");
  }

  function useGPS() {
    if (!navigator.geolocation) { toast.error("Geolocation unavailable"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      p => { setLat(p.coords.latitude.toFixed(6)); setLng(p.coords.longitude.toFixed(6)); setPlaceId(""); setLocating(false); },
      e => { toast.error(e.message); setLocating(false); },
      {enableHighAccuracy:true,timeout:10000}
    );
  }

  async function save() {
    const query = address.trim() || label.trim();
    if (!query) { toast.error("Search a hotel/address or add coordinates."); return; }
    const finalLabel = label.trim() || query;
    let finalAddress = address.trim() || query;
    let finalPlaceId = placeId || undefined;
    let latNum = parseFloat(lat);
    let lngNum = parseFloat(lng);
    let hasCoordinates = Number.isFinite(latNum) && Number.isFinite(lngNum);

    if (!hasCoordinates) {
      setSavingBase(true);
      try {
        const geo = await geocodeAddress(query);
        if (!geo.ok || typeof geo.latitude !== "number" || typeof geo.longitude !== "number") {
          toast.error("Pick a Google result or add coordinates for this base.");
          return;
        }
        latNum = geo.latitude;
        lngNum = geo.longitude;
        hasCoordinates = true;
        finalAddress = geo.formattedAddress || finalAddress;
        finalPlaceId = geo.placeId || finalPlaceId;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not resolve base address");
        return;
      } finally {
        setSavingBase(false);
      }
    }

    onSave({ label: finalLabel, address: finalAddress, lat: latNum, lng: lngNum, placeId: finalPlaceId });
  }

  return (
    <Dialog open={open} onOpenChange={o=>{if(!o)onClose();}}>
      <DialogContent>
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Home className="w-4 h-4" />Set base location</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Your base anchors all routing and call priority. Set it to your hotel, home, or CAT office.</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={()=>{setLabel("Home — Oshawa, ON");setAddress("Oshawa, ON");setLat("43.8971");setLng("-78.8658");}}>
              Home — Oshawa
            </Button>
            <Button size="sm" variant="outline" onClick={useGPS} disabled={locating}>
              {locating?<Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />:<MapPin className="w-3.5 h-3.5 mr-1" />}
              Current location
            </Button>
            <Button size="sm" variant="outline" onClick={()=>{setLabel("Hotel/CAT Office");setAddress("");setLat("");setLng("");}}>
              Hotel/CAT office
            </Button>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Label</Label>
            <Input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Home / Hotel / CAT Office" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Google search — hotel name or address</Label>
            <AddressAutocomplete
              initialValue={address}
              onResolve={onBaseResolved}
              placeholder="Type hotel name or address, then pick a result…"
            />
            <p className="text-xs text-muted-foreground">Picking a Google result fills the address and coordinates automatically.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Latitude</Label>
              <Input value={lat} onChange={e=>setLat(e.target.value)} placeholder="43.8971" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Longitude</Label>
              <Input value={lng} onChange={e=>setLng(e.target.value)} placeholder="-78.8658" /></div>
          </div>
          <p className="text-xs text-muted-foreground">Tip: select a Google search result first. Manual coordinates are only a fallback.</p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={savingBase || locating}>
            {savingBase ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
            Save base
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Print helpers ──────────────────────────────────────────────────────────────
function PrintButton({stops,routeResult,selectedDate,base}:{stops:Claim[];routeResult:RouteResult|null;selectedDate:string;base:Base|null}) {
  function print() {
    if (!stops.length) { toast.error("No stops."); return; }
    const w = window.open("","_blank"); if (!w) return;
    const date = fromDateLocal(selectedDate).toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"});
    const stopRows = stops.map((s,i)=>{
      const leg=routeResult?.legs.find(l=>l.toId===s.id);
      return `<tr><td>${i+1}</td><td><strong>${s.insured_name}</strong><br/>${s.claim_number?`#${s.claim_number}`:""}</td><td>${s.formatted_address??""}</td><td>${s.insured_phone??"—"}</td><td>${leg?`${leg.arrivalTime}–${leg.departureTime}`:s.scheduled_at?new Date(s.scheduled_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"—"}</td><td>${leg?`${leg.driveMin}m·${leg.distKm}km`:""}</td><td style="border:1px solid #ccc;width:60px">&nbsp;</td></tr>`;
    }).join("");
    const baseRow = base ? `<tr><td>Start</td><td><strong>${escapeHtml(base.label)}</strong></td><td>${escapeHtml(base.address || "Base")}</td><td>—</td><td>Start</td><td>Base</td><td></td></tr>` : "";
    const rows = baseRow + stopRows;
    w.document.write(`<!DOCTYPE html><html><head><title>Route</title><style>body{font-family:Arial;font-size:12px;margin:20px}table{border-collapse:collapse;width:100%}th{background:#eee;padding:6px;text-align:left;border-bottom:2px solid #ccc;font-size:11px;text-transform:uppercase}td{padding:6px;border-bottom:1px solid #eee;vertical-align:top}.meta{color:#666;font-size:11px;margin-bottom:12px}.toolbar{display:flex;gap:8px;margin-bottom:16px}button{padding:6px 14px;font-size:13px;cursor:pointer;border-radius:4px;border:1px solid #ccc}button.primary{background:#1a3a6e;color:#fff;border-color:#1a3a6e}@media print{.toolbar{display:none}body{margin:8px}}</style></head><body><div class="toolbar"><button class="primary" onclick="window.print()">🖨 Print</button><button onclick="window.close()">✕ Close</button></div><h2>Inspection Route</h2><div class="meta">${date}${base?` · Base: ${base.label}`:""}</div><table><thead><tr><th>#</th><th>Insured</th><th>Address</th><th>Phone</th><th>Time</th><th>Drive</th><th>✓</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close();
  }
  return <Button variant="outline" onClick={print} title="Print route"><Printer className="w-4 h-4" /></Button>;
}

function PackageButton({stops,routeResult,selectedDate,firstContactedByClaim}:{stops:Claim[];routeResult:RouteResult|null;selectedDate:string;firstContactedByClaim:Record<string,string>}) {
  const LABELS: Record<string,string>={fire:"Fire",water:"Water/Flood",wind_hail:"Wind/Hail",theft:"Theft",vandalism:"Vandalism",vehicle_impact:"Vehicle Impact",earthquake:"Earthquake",frozen_pipes:"Frozen Pipes",sewage_backup:"Sewage Backup",mold:"Mold",glass_breakage:"Glass Breakage",other:"Other"};
  function fmt(iso:string|null|undefined){if(!iso)return"—";const d=new Date(iso);if(Number.isNaN(d.getTime()))return escapeHtml(iso);return d.toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric"});}
  function fmtT(iso:string|null|undefined){if(!iso)return"—";const d=new Date(iso);if(Number.isNaN(d.getTime()))return"—";return d.toLocaleTimeString("en-CA",{hour:"2-digit",minute:"2-digit"});}
  function fmtP(p:string|null|undefined){if(!p)return"—";const d=p.replace(/\D/g,"");if(d.length===11&&d.startsWith("1"))return`(${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`;if(d.length===10)return`(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;return p;}
  function firstContacted(s: Claim): string | null {
    const sc = s as any;
    return sc.date_contacted || firstContactedByClaim[s.id] || sc.last_contacted_at || null;
  }

  function generate() {
    if (!stops.length) { toast.error("No stops."); return; }
    const w = window.open("","_blank");
    if (!w) { toast.error("Pop-up blocked — allow pop-ups for this site."); return; }
    const dateLabel = fromDateLocal(selectedDate).toLocaleDateString("en-CA",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
    const gridRows = Array.from({length:34},()=>`<div class="grid-row">${Array.from({length:48},()=>'<div class="gc"></div>').join("")}</div>`).join("");
    const sheets = stops.map((s,i)=>{
      const sc=s as any;
      const addr=s.formatted_address??[s.street,s.city,s.province,s.postal_code].filter(Boolean).join(", ")??"—";
      const leg=routeResult?.legs.find(l=>l.toId===s.id);
      const time=leg?leg.arrivalTime:fmtT(s.scheduled_at);
      return `<section class="page">
        <div class="hbar"><div class="hleft"><span class="pnum">Stop ${i+1} of ${stops.length}</span><span class="dlbl">${escapeHtml(dateLabel)}</span></div><div class="hadj">Ricardo Alves</div></div>
        <div class="stitle">Claim Information</div>
        <table class="it"><tr><td class="lbl">Insured Name</td><td class="val">${escapeHtml(s.insured_name??"—")}</td><td class="lbl">Telephone</td><td class="val">${escapeHtml(fmtP(s.insured_phone))}</td></tr><tr><td class="lbl">Loss Address</td><td colspan="3" class="val">${escapeHtml(addr)}</td></tr><tr><td class="lbl">Contacted</td><td class="val">${fmt(firstContacted(s))}</td><td class="lbl">Date of Loss</td><td class="val">${fmt(s.loss_date)}</td></tr><tr><td class="lbl">Time</td><td class="val">${escapeHtml(time)}</td><td class="lbl">Cause of Loss</td><td class="val">${escapeHtml(LABELS[s.loss_type??""]??s.loss_type??"—")}</td></tr><tr><td class="lbl">Claim Number</td><td class="val">${escapeHtml(s.claim_number??"—")}</td><td class="lbl">Company</td><td class="val">${escapeHtml(s.carrier??"TD Insurance")}</td></tr><tr><td class="lbl">CAT Code</td><td class="val">${escapeHtml(sc.cat_code??"—")}</td><td class="lbl">Deductible</td><td class="val">${escapeHtml(sc.deductible?`$${sc.deductible}`:"—")}</td></tr></table>
        <div class="pilot-row"><span class="plbl">PILOT</span><span class="pval">CAT FA</span><span class="pval">RICARDO</span></div>
        <div class="stitle">Property Details</div>
        <table class="it"><tr><td class="lbl">Ceiling Height (ft):</td><td class="vblank"></td><td class="lbl">Basement (Yes/No):</td><td class="vblank"></td></tr><tr><td class="lbl">Property Type (Risk):</td><td class="vblank"></td><td class="lbl">Year Built:</td><td class="vblank"></td></tr><tr><td class="lbl">Notes:</td><td colspan="3" class="vblank ntall"></td></tr></table>
        <div class="stitle">Sketch Area</div><div class="sketch">${gridRows}</div>
        <div class="stitle">Additional Notes</div><div class="anotes"></div>
      </section>`;
    }).join("\n");
    w.document.write(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width"/><title>Inspection Package</title><style>@page{size:A4 portrait;margin:0}*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}html,body{background:#fff;width:210mm}body{font-family:Arial,sans-serif;font-size:9.4px;color:#111}.toolbar{display:flex;gap:8px;padding:10px 16px;background:#f5f5f5;border-bottom:1px solid #ddd;position:sticky;top:0;z-index:10}button{padding:6px 14px;font-size:13px;cursor:pointer;border-radius:4px;border:1px solid #ccc}button.primary{background:#1a3a6e;color:#fff;border-color:#1a3a6e}.page{width:210mm;height:290mm;padding:6mm 8mm;break-after:page;page-break-after:always;overflow:hidden;display:flex;flex-direction:column;gap:3px;position:relative}.page:last-child{break-after:auto;page-break-after:avoid}.hbar{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #1a3a6e;padding-bottom:3px;margin-bottom:1px}.hleft{display:flex;gap:10px;align-items:baseline}.pnum{font-weight:bold;font-size:10px;color:#1a3a6e}.dlbl{font-size:9px;color:#444}.hadj{font-size:9px;color:#1a3a6e;font-weight:bold}.stitle{background:#1a3a6e;color:#fff;font-weight:bold;font-size:8.8px;padding:2px 5px;text-transform:uppercase;letter-spacing:.04em}.it{width:100%;border-collapse:collapse;font-size:9px}.it td{padding:2px 4px;border:.5px solid #ccc;vertical-align:top;line-height:1.12}.lbl{background:#e8eef7;font-weight:bold;width:18%;white-space:nowrap}.val{width:32%}.vblank{width:32%;height:13px}.ntall{height:20px}.pilot-row{border:.5px solid #ccc;padding:2px 5px;font-size:8.5px;display:flex;gap:18px}.plbl{font-weight:bold;color:#1a3a6e}.pval{color:#333}.sketch{border:.5px solid #ccc;flex:1 1 auto;min-height:0;display:flex;flex-direction:column}.grid-row{display:flex;flex:1;min-height:0}.gc{flex:1;border-right:.3px solid #ddd;border-bottom:.3px solid #ddd}.grid-row:last-child .gc{border-bottom:none}.grid-row .gc:last-child{border-right:none}.anotes{border:.5px solid #ccc;height:13mm}@media print{.toolbar{display:none}html,body{width:210mm;margin:0;padding:0}.page{height:290mm;break-after:page;page-break-after:always;page-break-inside:avoid}body>section:last-child{page-break-after:avoid}}</style></head><body><div class="toolbar"><button class="primary" onclick="window.print()">🖨 Print Package</button><button onclick="window.close()">✕ Close</button></div>${sheets}</body></html>`);
    w.document.close();
  }
  return <Button variant="default" onClick={generate} title="Inspection package"><Printer className="w-4 h-4" /> Package</Button>;
}
