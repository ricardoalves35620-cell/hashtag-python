import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, MapPin, Search, Plus, Layers, Calendar, ChevronDown, ChevronUp, ChevronRight, Trash2, CheckSquare, Square, X, AlertTriangle, Loader2, Zap, RefreshCw, CalendarCheck, StickyNote, CheckCircle2, Navigation, ArrowUpDown, Download, ClipboardList } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ciscoJabberLink, formatRelative, formatDateTime, telLink } from "@/lib/format";
import { geocodeAddress } from "@/lib/claims.functions";
import { usePlanner } from "@/lib/PlannerContext";
import { toast } from "sonner";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

type Claim = Database["public"]["Tables"]["claims"]["Row"];
type Status = "all" | "active" | "needs_contact" | "new" | "to_call" | "scheduled" | "inspected" | "estimate_entered" | "to_close" | "closed" | "cancelled";
type GroupBy = "none" | "date";

const searchSchema = z.object({
  status: z.enum(["all", "active", "needs_contact", "inspected", "scheduled", "estimate_entered", "to_close", "closed", "cancelled"]).optional().default("active"),
});

export const Route = createFileRoute("/_authenticated/claims/")({
  head: () => ({ meta: [{ title: "Claims — Claim Navigator" }] }),
  validateSearch: searchSchema,
  component: ClaimsList,
});

const STATUSES: { value: Status; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "needs_contact", label: "Needs to Contact" },
  { value: "inspected", label: "Inspected" },
  { value: "to_close", label: "To Close" },
  { value: "closed", label: "Closed" },
  { value: "cancelled", label: "Cancelled" },
];

const ALL_STATUSES = [
  { value: "new", label: "Not contacted" },
  { value: "to_call", label: "To call" },
  { value: "scheduled", label: "Scheduled" },
  { value: "inspected", label: "Inspected" },
  { value: "estimate_entered", label: "Estimate entered" },
  { value: "closed", label: "Closed" },
  { value: "cancelled", label: "Cancelled" },
];

function toDateKey(iso: string | null | undefined): string {
  if (!iso) return "unscheduled";
  return iso.slice(0, 10);
}

function formatDateKey(key: string): string {
  if (key === "unscheduled") return "No inspection date";
  const d = new Date(key + "T12:00:00");
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const todayKey = toDateKey(today.toISOString());
  const tomorrowKey = toDateKey(tomorrow.toISOString());
  if (key === todayKey) return "Today · " + d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
  if (key === tomorrowKey) return "Tomorrow · " + d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function distanceFromBaseKm(base: { lat: number; lng: number } | null, lat: number | null, lng: number | null): number | null {
  if (!base || lat == null || lng == null) return null;
  const R = 6371;
  const dLat = (lat - base.lat) * Math.PI / 180;
  const dLng = (lng - base.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(base.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)) * 10) / 10;
}

type SortBy = "default" | "distance" | "appointment" | "newest" | "oldest_uncontacted" | "city" | "status";

const STATUS_ORDER: Record<string, number> = { new: 0, to_call: 1, scheduled: 2, inspected: 3, estimate_entered: 4, closed: 5 };

function distKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function ClaimsList() {
  const { status } = Route.useSearch();
  const navigate = Route.useNavigate();
  const qc = useQueryClient();
  const { base } = usePlanner();
  const [q, setQ] = useState("");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [sortBy, setSortBy] = useState<SortBy>("default");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Multi-select state
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeProgress, setGeocodeProgress] = useState<{done:number;total:number}|null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["claims", "list", status, localStorage.getItem("planner_active_deployment_id")],
    queryFn: async (): Promise<Claim[]> => {
      const isCatMode = localStorage.getItem("planner_work_mode") === '"cat"';
      const catId = localStorage.getItem("planner_active_deployment_id");

      // CAT Mode: Must have a CAT selected, filter to that CAT only
      if (isCatMode && !catId) {
        return [];  // No CAT selected - show nothing
      }

      let query = supabase.from("claims").select("*");

      // Strict mode isolation: CAT claims (deployment_id set) never appear in
      // Regular Mode, and Regular claims (deployment_id null) never appear in
      // CAT Mode. This is the single enforcement point.
      if (isCatMode && catId) {
        query = query.eq("deployment_id", catId);
      } else {
        // Regular Mode: only claims with no deployment_id
        query = (query as any).is("deployment_id", null);
      }

      // Apply status filter based on tab
      if (status === "all") {
        // "All" tab: show ALL statuses
        query = query.in("status", ["new", "to_call", "scheduled", "inspected", "estimate_entered", "closed", "cancelled"]);
      } else if (status === "active") {
        // "Active" tab: new + to_call + scheduled
        query = query.in("status", ["new", "to_call", "scheduled"]);
      } else if (status === "needs_contact") {
        // "Needs to Contact" tab: new + to_call
        query = query.in("status", ["new", "to_call"]);
      } else if (status === "scheduled") {
        // "Scheduled" tab: scheduled only — a claim that was scheduled and
        // has since moved to inspected/closed/cancelled should drop out.
        query = query.eq("status", "scheduled");
      } else if (status === "inspected") {
        // "Inspected" tab: inspected only
        query = query.eq("status", "inspected");
      } else if (status === "to_close") {
        // "To Close" tab: inspection done but claim not closed yet —
        // these are the ones still waiting for estimate entry + closing.
        query = query.in("status", ["inspected", "estimate_entered"] as any);
      } else if (status === "closed") {
        // "Closed" tab: closed only
        query = query.eq("status", "closed");
      } else if (status === "cancelled") {
        // "Cancelled" tab: cancelled only
        query = query.eq("status", "cancelled");
      }

      // Order by scheduled_at for scheduled claims, updated_at for others
      if (status === "scheduled") {
        query = query.order("scheduled_at", { ascending: true });
      } else {
        query = query.order("updated_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!q.trim()) return data;
    const needle = q.toLowerCase();
    return data.filter(c =>
      c.insured_name.toLowerCase().includes(needle) ||
      (c.claim_number ?? "").toLowerCase().includes(needle) ||
      (c.policy_number ?? "").toLowerCase().includes(needle) ||
      (c.insured_phone ?? "").toLowerCase().includes(needle) ||
      (c.formatted_address ?? "").toLowerCase().includes(needle) ||
      (c.city ?? "").toLowerCase().includes(needle) ||
      (c.notes ?? "").toLowerCase().includes(needle)
    );
  }, [data, q]);

  const sortedFiltered = useMemo(() => {
    if (sortBy === "default") return filtered;
    const arr = [...filtered];
    switch (sortBy) {
      case "distance":
        if (!base) return arr;
        return arr.sort((a, b) => {
          const da = a.latitude != null && a.longitude != null ? distKm(base, { lat: a.latitude, lng: a.longitude }) : Infinity;
          const db = b.latitude != null && b.longitude != null ? distKm(base, { lat: b.latitude, lng: b.longitude }) : Infinity;
          return da - db;
        });
      case "appointment":
        return arr.sort((a, b) => {
          if (!a.scheduled_at && !b.scheduled_at) return 0;
          if (!a.scheduled_at) return 1;
          if (!b.scheduled_at) return -1;
          return a.scheduled_at.localeCompare(b.scheduled_at);
        });
      case "newest":
        return arr.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
      case "oldest_uncontacted":
        return arr.sort((a, b) => {
          if (!a.last_contacted_at && !b.last_contacted_at) return (a.created_at ?? "").localeCompare(b.created_at ?? "");
          if (!a.last_contacted_at) return -1;
          if (!b.last_contacted_at) return 1;
          return a.last_contacted_at.localeCompare(b.last_contacted_at);
        });
      case "city":
        return arr.sort((a, b) => (a.city ?? "").localeCompare(b.city ?? ""));
      case "status":
        return arr.sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99));
      default:
        return arr;
    }
  }, [filtered, sortBy, base]);

  const grouped = useMemo(() => {
    if (groupBy === "none") return null;
    const groups = new Map<string, Claim[]>();
    const sorted = [...sortedFiltered].sort((a, b) => {
      if (!a.scheduled_at && !b.scheduled_at) return 0;
      if (!a.scheduled_at) return 1;
      if (!b.scheduled_at) return -1;
      return a.scheduled_at.localeCompare(b.scheduled_at);
    });
    for (const c of sorted) {
      const key = c.scheduled_at ? toDateKey(c.scheduled_at) : "unscheduled";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(c);
    }
    return groups;
  }, [sortedFiltered, groupBy]);

  function toggleGroup(key: string) {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  // Multi-select helpers
  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(filtered.map(c => c.id)));
  }

  function clearSelection() {
    setSelected(new Set());
    setSelectMode(false);
  }

  async function deleteSelected() {
    if (selected.size === 0) return;
    setDeleting(true);
    try {
      const ids = Array.from(selected);
      // Delete in batches of 20
      for (let i = 0; i < ids.length; i += 20) {
        const batch = ids.slice(i, i + 20);
        const { error } = await supabase.from("claims").delete().in("id", batch);
        if (error) throw error;
      }
      toast.success(`${selected.size} claim${selected.size > 1 ? "s" : ""} deleted`);
      setDeleteDialog(false);
      clearSelection();
      qc.invalidateQueries({ queryKey: ["claims"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  async function geocodeAll() {
    // Fetch ALL claims regardless of current filter
    const { data: allForGeo } = await supabase.from("claims").select("id,formatted_address,street,city,province,postal_code,latitude,longitude");
    const missing = (allForGeo ?? []).filter((c: any) => !c.latitude || !c.longitude);
    if (!missing.length) { toast.success("All claims already have coordinates!"); return; }
    setGeocoding(true);
    setGeocodeProgress({ done: 0, total: missing.length });
    let fixed = 0, failed = 0;
    for (let i = 0; i < missing.length; i++) {
      const c = missing[i];
      const addr = ((c as any).formatted_address ?? [(c as any).street, (c as any).city, (c as any).province, (c as any).postal_code].filter(Boolean).join(", ")) || "";
      if (!addr) { failed++; setGeocodeProgress({ done: i + 1, total: missing.length }); continue; }
      try {
        const geo = await geocodeAddress(addr);
        if (geo.ok && geo.latitude && geo.longitude) {
          await supabase.from("claims").update({ latitude: geo.latitude, longitude: geo.longitude } as any).eq("id", c.id);
          fixed++;
        } else { failed++; }
      } catch { failed++; }
      setGeocodeProgress({ done: i + 1, total: missing.length });
      // 1.1s delay — the free Nominatim fallback's usage policy caps
      // requests at 1/sec; going faster gets responses silently blocked.
      if (i < missing.length - 1) await new Promise(r => setTimeout(r, 1100));
    }
    setGeocoding(false);
    setGeocodeProgress(null);
    qc.invalidateQueries({ queryKey: ["claims"] });
    if (fixed > 0) toast.success(`Geocoded ${fixed} claim${fixed > 1 ? "s" : ""}${failed > 0 ? ` · ${failed} failed` : ""}`);
    else toast.error(
      failed > 0
        ? `Could not find ${failed} address${failed > 1 ? "es" : ""} — check they're complete and correctly spelled.`
        : "No addresses to geocode."
    );
  }

  const [exporting, setExporting] = useState(false);
  async function exportBackup(format: "json" | "csv") {
    setExporting(true);
    try {
      // Fetch ALL claims (not just the current filtered view)
      const isCatMode = localStorage.getItem("planner_work_mode") === '"cat"';
      const catId = localStorage.getItem("planner_active_deployment_id");
      let q = supabase.from("claims").select("*").order("updated_at", { ascending: false });
      if (isCatMode && catId) q = q.eq("deployment_id", catId);
      const { data, error } = await q;
      if (error) throw error;
      const claims = data ?? [];

      const now = new Date().toISOString().slice(0, 10);
      const catCode = (claims[0] as any)?.cat_code ?? "export";
      const filename = `CAT${catCode}_Claim_Navigator_Backup_${now}`;

      if (format === "json") {
        const out = {
          schemaVersion: "claim-navigator-import-v1",
          generatedAt: now,
          catMode: isCatMode,
          catCode: catCode,
          recordsCount: claims.length,
          summary: {
            inspected: claims.filter(c => c.status === "inspected").length,
            pending: claims.filter(c => ["new","to_call","scheduled"].includes(c.status)).length,
            cancelled: claims.filter(c => c.status === "cancelled").length,
            closed: claims.filter(c => c.status === "closed").length,
          },
          claims: claims.map((c: any) => ({
            externalId: `${catCode}-${c.claim_number ?? c.id}`,
            catCode: c.cat_code,
            insuredName: c.insured_name,
            claimNumber: c.claim_number,
            policyNumber: c.policy_number,
            carrier: c.carrier,
            lossType: c.loss_type,
            lossDate: c.loss_date,
            dateContacted: c.date_contacted,
            firstContactedAt: c.first_contacted_at ?? null,
            plannedInspectionDate: c.scheduled_at ?? null,
            dateInspected: c.inspected_at ?? null,
            currentStatus: c.status,
            primaryPhone: c.insured_phone,
            email: c.insured_email,
            address: {
              search: c.formatted_address,
              street: c.street,
              city: c.city,
              province: c.province,
              postalCode: c.postal_code,
              country: c.country ?? "Canada",
            },
            deductible: c.deductible,
            xaId: c.xa_id,
            scheduledAt: c.scheduled_at,
            latitude: c.latitude,
            longitude: c.longitude,
            notes: c.notes,
            updatedAt: c.updated_at,
          })),
        };
        const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
        triggerDownload(blob, `${filename}.json`);
      } else {
        // CSV — flat, matching the import format the parser already handles
        const headers = ["externalId","catCode","insuredName","claimNumber","policyNumber","carrier",
          "lossType","lossDate","dateContacted","firstContactedAt","plannedInspectionDate",
          "dateInspected","currentStatus",
          "primaryPhone","email","street","city","province","postalCode","addressSearch",
          "deductible","xaId","scheduledAt","latitude","longitude","notes"];
        const rows = claims.map((c: any) => [
          `${catCode}-${c.claim_number ?? c.id}`,
          c.cat_code ?? "",
          c.insured_name ?? "",
          c.claim_number ?? "",
          c.policy_number ?? "",
          c.carrier ?? "",
          c.loss_type ?? "",
          c.loss_date ?? "",
          c.date_contacted ?? "",
          c.first_contacted_at ?? "",
          c.scheduled_at ?? "",
          c.inspected_at ?? "",
          c.status ?? "",
          c.insured_phone ?? "",
          c.insured_email ?? "",
          c.street ?? "",
          c.city ?? "",
          c.province ?? "",
          c.postal_code ?? "",
          c.formatted_address ?? "",
          c.deductible ?? "",
          c.xa_id ?? "",
          c.scheduled_at ?? "",
          c.latitude ?? "",
          c.longitude ?? "",
          c.notes ?? "",
        ].map(csvCell));
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
        triggerDownload(blob, `${filename}.csv`);
      }
      toast.success(`Exported ${claims.length} claims as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  function csvCell(v: unknown): string {
    const s = v == null ? "" : String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }
  function triggerDownload(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  // Assign to active CAT
  const [assigning, setAssigning] = useState(false);

  async function assignToCAT() {
    const isCat = localStorage.getItem("planner_work_mode") === '"cat"';
    const activeCATId = localStorage.getItem("planner_active_deployment_id");
    if (!isCat || !activeCATId) {
      toast.error("Switch to CAT mode and select a CAT deployment first.");
      return;
    }
    if (selected.size === 0) { toast.error("Select claims to assign first."); return; }
    setAssigning(true);
    try {
      const ids = Array.from(selected);
      for (let i = 0; i < ids.length; i += 20) {
        const batch = ids.slice(i, i + 20);
        const { error } = await supabase.from("claims").update({ deployment_id: activeCATId } as any).in("id", batch);
        if (error) throw error;
      }
      toast.success(`${selected.size} claim${selected.size > 1 ? "s" : ""} assigned to active CAT`);
      setSelected(new Set());
      setSelectMode(false);
      qc.invalidateQueries({ queryKey: ["claims"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Assign failed");
    } finally { setAssigning(false); }
  }

  async function removeFromCAT() {
    if (selected.size === 0) return;
    setAssigning(true);
    try {
      const ids = Array.from(selected);
      for (let i = 0; i < ids.length; i += 20) {
        const batch = ids.slice(i, i + 20);
        await supabase.from("claims").update({ deployment_id: null } as any).in("id", batch);
      }
      toast.success(`${selected.size} claim${selected.size > 1 ? "s" : ""} removed from CAT`);
      setSelected(new Set());
      setSelectMode(false);
      qc.invalidateQueries({ queryKey: ["claims"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setAssigning(false); }
  }

  // Full counts across ALL claims regardless of current tab filter
  const { data: allClaims } = useQuery({
    queryKey: ["claims", "all_counts", localStorage.getItem("planner_active_deployment_id")],
    queryFn: async () => {
      let q = supabase.from("claims").select("status");
      const isCatMode = localStorage.getItem("planner_work_mode") === '"cat"';
      const catId = localStorage.getItem("planner_active_deployment_id");
      if (isCatMode && catId) {
        q = (q as any).eq("deployment_id", catId);
      } else {
        q = (q as any).is("deployment_id", null);
      }
      const { data } = await q;
      return data ?? [];
    },
    staleTime: 10000,
  });

  const counts = useMemo(() => {
    const src = allClaims ?? [];
    return {
      total: src.length,
      open: src.filter(c => c.status !== "closed" && c.status !== "cancelled").length,
      scheduled: src.filter(c => c.status === "scheduled").length,
      notContacted: src.filter(c => c.status === "new").length,
      toCall: src.filter(c => c.status === "to_call").length,
      estimateEntered: src.filter(c => c.status === "estimate_entered").length,
      active: src.filter(c => ["new", "to_call", "scheduled"].includes(c.status)).length,
      needsContact: src.filter(c => ["new", "to_call"].includes(c.status)).length,
      inspected: src.filter(c => c.status === "inspected").length,
      toClose: src.filter(c => c.status === "inspected" || (c.status as string) === "estimate_entered").length,
      closed: src.filter(c => c.status === "closed").length,
      cancelled: src.filter(c => c.status === "cancelled").length,
    };
  }, [allClaims]);

  // Status change for multi-select
  const [statusChangeDialog, setStatusChangeDialog] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [targetStatus, setTargetStatus] = useState("to_call");

  async function changeSelectedStatus() {
    if (selected.size === 0) return;
    setChangingStatus(true);
    try {
      const ids = Array.from(selected);
      const now = new Date().toISOString();
      const extra: Record<string, unknown> = {};
      if (targetStatus === "inspected") extra.inspected_at = now;
      if (targetStatus === "estimate_entered") extra.estimate_entered_at = now;
      if (targetStatus === "closed") extra.closed_at = now;
      for (let i = 0; i < ids.length; i += 20) {
        const batch = ids.slice(i, i + 20);
        await supabase.from("claims").update({ status: targetStatus as any, ...extra } as any).in("id", batch);
      }
      toast.success(`${selected.size} claim${selected.size > 1 ? "s" : ""} → ${ALL_STATUSES.find(s => s.value === targetStatus)?.label}`);
      setStatusChangeDialog(false);
      setSelected(new Set());
      setSelectMode(false);
      qc.invalidateQueries({ queryKey: ["claims"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setChangingStatus(false); }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Claims</h1>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {!selectMode ? (
            <>
              <Button asChild size="sm" variant="outline">
                <Link to="/claims-map"><MapPin className="w-4 h-4" /><span className="hidden sm:inline ml-1">Map</span></Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/claims/batch"><Layers className="w-4 h-4" /><span className="hidden sm:inline ml-1">Batch</span></Link>
              </Button>
              <div className="relative group">
                <Button size="sm" variant="outline" disabled={exporting} title="Export backup">
                  {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span className="hidden sm:inline ml-1">Export</span>
                </Button>
                <div className="absolute right-0 top-full mt-1 z-50 hidden group-hover:flex group-focus-within:flex flex-col bg-popover border border-border rounded-lg shadow-lg overflow-hidden min-w-[120px]">
                  <button onClick={() => exportBackup("json")} className="px-3 py-2 text-sm text-left hover:bg-muted transition-colors">JSON</button>
                  <button onClick={() => exportBackup("csv")} className="px-3 py-2 text-sm text-left hover:bg-muted transition-colors">CSV</button>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={geocodeAll} disabled={geocoding} title="Geocode all claims missing coordinates">
                {geocoding
                  ? <><Loader2 className="w-4 h-4 animate-spin" /><span className="hidden sm:inline ml-1">{geocodeProgress ? `${geocodeProgress.done}/${geocodeProgress.total}` : "…"}</span></>
                  : <><MapPin className="w-4 h-4" /><span className="hidden sm:inline ml-1">Geocode</span></>
                }
              </Button>
              <Button asChild size="sm">
                <Link to="/claims/new"><Plus className="w-4 h-4" /><span className="ml-1">New</span></Link>
              </Button>
            </>
          ) : (
            <Button size="sm" variant="ghost" onClick={clearSelection}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Summary metrics */}
      {!selectMode && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <button onClick={() => navigate({ search: { status: "all" } })}
            title="Everything that isn't closed or cancelled"
            className="rounded-lg border border-border p-2 hover:border-primary/40 transition-colors">
            <div className="text-lg font-bold tabular-nums">{counts.open}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Open</div>
          </button>
          <button onClick={() => navigate({ search: { status: "scheduled" } })}
            title="Inspection booked, not done yet"
            className="rounded-lg border border-primary/30 bg-primary/5 p-2 hover:border-primary transition-colors">
            <div className="text-lg font-bold tabular-nums text-primary">{counts.scheduled}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Scheduled</div>
          </button>
          <button onClick={() => navigate({ search: { status: "to_close" } })}
            title="Inspection done — still needs estimate entered and closing"
            className="rounded-lg border border-purple-300/60 bg-purple-50/50 dark:bg-purple-950/10 p-2 hover:border-purple-400 transition-colors">
            <div className="text-lg font-bold tabular-nums text-purple-600 dark:text-purple-400">{counts.toClose}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">To close</div>
          </button>
          <button onClick={() => navigate({ search: { status: "needs_contact" } })}
            title="Brand-new claims you haven't reached out to yet"
            className="rounded-lg border border-border p-2 hover:border-primary/40 transition-colors">
            <div className="text-lg font-bold tabular-nums">{counts.notContacted}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Not contacted</div>
          </button>
          <button onClick={() => navigate({ search: { status: "needs_contact" } })}
            title="People you need to call to book an inspection"
            className="rounded-lg border border-orange-300/50 bg-orange-50/50 dark:bg-orange-950/10 p-2 hover:border-orange-400 transition-colors">
            <div className="text-lg font-bold tabular-nums text-orange-600 dark:text-orange-400">{counts.toCall}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">To call</div>
          </button>
          <button onClick={() => navigate({ search: { status: "closed" } })}
            title="Fully done — estimate entered and claim closed"
            className="rounded-lg border border-border p-2 hover:border-primary/40 transition-colors">
            <div className="text-lg font-bold tabular-nums text-green-600">{counts.closed}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Closed</div>
          </button>
        </div>
      )}

      {/* Multi-select action bar */}
      {selectMode && (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-muted/80 rounded-lg px-3 py-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{selected.size} selected</span>
              <button onClick={selectAll} className="text-xs text-primary underline">All ({filtered.length})</button>
            </div>
            <Button size="sm" variant="destructive" disabled={selected.size === 0} onClick={() => setDeleteDialog(true)}>
              <Trash2 className="w-3.5 h-3.5 mr-1" />Delete {selected.size > 0 ? `(${selected.size})` : ""}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <Button size="sm" variant="outline" className="text-orange-600 border-orange-300 text-xs"
              disabled={selected.size === 0 || assigning} onClick={assignToCAT}>
              {assigning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 mr-1" />}
              CAT
            </Button>
            <Button size="sm" variant="outline" className="text-xs"
              disabled={selected.size === 0 || assigning} onClick={removeFromCAT}>
              – CAT
            </Button>
            <Button size="sm" variant="outline" className="text-xs"
              disabled={selected.size === 0} onClick={() => setStatusChangeDialog(true)}>
              <RefreshCw className="w-3 h-3 mr-1" />Status
            </Button>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, claim #, phone, policy, city…" className="pl-9" />
      </div>

      {/* Status tabs + controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Button variant={groupBy === "date" ? "default" : "outline"} size="sm" className="shrink-0 h-11 w-11 p-0"
            onClick={() => setGroupBy(g => g === "date" ? "none" : "date")} title="Group by date">
            <Calendar className="w-4 h-4" />
          </Button>
          <Button variant={selectMode ? "default" : "outline"} size="sm" className="shrink-0 h-11 w-11 p-0"
            onClick={() => { setSelectMode(s => !s); setSelected(new Set()); }}
            title="Select multiple">
            <CheckSquare className="w-4 h-4" />
          </Button>
          <Select value={sortBy} onValueChange={(v) => {
            const next = v as SortBy;
            if (next === "distance" && !base) toast.error("Set a base location in Route Planner first to sort by distance.");
            setSortBy(next);
          }}>
            <SelectTrigger className="h-11 w-11 shrink-0 p-0 justify-center [&>svg]:hidden" title="Sort" aria-label="Sort claims">
              <ArrowUpDown className="w-4 h-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default order</SelectItem>
              <SelectItem value="distance">Distance from base</SelectItem>
              <SelectItem value="appointment">Appointment time</SelectItem>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest_uncontacted">Oldest uncontacted first</SelectItem>
              <SelectItem value="city">City (A–Z)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex gap-1 min-w-max">
              {STATUSES.map(s => (
                <button key={s.value}
                  onClick={() => navigate({ search: { status: s.value as Status } })}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium transition-colors ${
                    status === s.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Claims list */}
      <div className="space-y-2">
        {isLoading ? (
          <><Skeleton className="h-20" /><Skeleton className="h-20" /><Skeleton className="h-20" /></>
        ) : filtered.length === 0 ? (
          <Card className="p-6 text-center space-y-2">
            <ClipboardList className="w-8 h-8 mx-auto text-muted-foreground/50" />
            <p className="text-sm font-medium">No claims here yet</p>
            <p className="text-xs text-muted-foreground">Create your first claim, or check your filters above — they may be hiding results.</p>
            <Button asChild size="sm" className="h-11">
              <Link to="/claims/new"><Plus className="w-4 h-4 mr-1" /> New claim</Link>
            </Button>
          </Card>
        ) : grouped ? (
          Array.from(grouped.entries()).map(([key, claims]) => {
            const collapsed = collapsedGroups.has(key);
            const isUnscheduled = key === "unscheduled";
            return (
              <div key={key} className="space-y-1.5">
                <button onClick={() => toggleGroup(key)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md bg-muted/60 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-3.5 h-3.5 ${isUnscheduled ? "text-muted-foreground" : "text-primary"}`} />
                    <span className={`text-sm font-medium ${isUnscheduled ? "text-muted-foreground" : ""}`}>{formatDateKey(key)}</span>
                    <Badge variant="outline" className="text-xs">{claims.length}</Badge>
                  </div>
                  {collapsed ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
                {!collapsed && (
                  <div className="space-y-1.5 pl-1">
                    {claims.map(c => (
                      <ClaimListRow key={c.id} claim={c} showTime selectMode={selectMode} base={base}
                        selected={selected.has(c.id)} onToggle={() => toggleSelect(c.id)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          sortedFiltered.map(c => (
            <ClaimListRow key={c.id} claim={c} selectMode={selectMode} base={base}
              selected={selected.has(c.id)} onToggle={() => toggleSelect(c.id)} />
          ))
        )}
      </div>

      {/* Status change dialog */}
      <Dialog open={statusChangeDialog} onOpenChange={o => { if (!o) setStatusChangeDialog(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />Change status — {selected.size} claim{selected.size > 1 ? "s" : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Select the new status for the selected claims.</p>
            <Select value={targetStatus} onValueChange={setTargetStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setStatusChangeDialog(false)}>Cancel</Button>
            <Button onClick={changeSelectedStatus} disabled={changingStatus}>
              {changingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : `Update ${selected.size} claim${selected.size > 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialog} onOpenChange={o => { if (!o) setDeleteDialog(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" /> Delete {selected.size} claim{selected.size > 1 ? "s" : ""}?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete {selected.size === 1 ? "this claim" : `these ${selected.size} claims`} and all associated call history and inspection records. This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteSelected} disabled={deleting}>
              {deleting ? "Deleting…" : `Delete ${selected.size} claim${selected.size > 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ClaimListRow({ claim, showTime, selectMode, selected, onToggle, base }: {
  claim: Claim; showTime?: boolean;
  selectMode: boolean; selected: boolean; onToggle: () => void;
  base?: { lat: number; lng: number } | null;
}) {
  const qc = useQueryClient();
  const tel = telLink(claim.insured_phone);
  const distKm = distanceFromBaseKm(base ?? null, claim.latitude, claim.longitude);

  async function markContactStarted() {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const patch: Record<string, unknown> = { last_contacted_at: now.toISOString() };
    if (!claim.date_contacted) patch.date_contacted = today;
    await supabase.from("claims").update(patch).eq("id", claim.id);
  }

  async function markInspected() {
    const previousStatus = claim.status;
    try {
      const { error } = await supabase.from("claims")
        .update({ status: "inspected", inspected_at: new Date().toISOString() } as any)
        .eq("id", claim.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["claims"] });
      toast.success("Marked inspected", {
        action: {
          label: "Undo",
          onClick: async () => {
            await supabase.from("claims").update({ status: previousStatus as any, inspected_at: null } as any).eq("id", claim.id);
            qc.invalidateQueries({ queryKey: ["claims"] });
            toast.success("Undone");
          },
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  const isInspectedOrLater = ["inspected", "estimate_entered", "closed"].includes(claim.status);

  return (
    <Card
      className={`p-3 transition-colors cursor-pointer ${selectMode ? selected ? "border-primary bg-primary/5" : "border-border" : ""}`}
      onClick={selectMode ? onToggle : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        {selectMode && (
          <div className="shrink-0 mt-0.5">
            {selected
              ? <CheckSquare className="w-4 h-4 text-primary" />
              : <Square className="w-4 h-4 text-muted-foreground" />
            }
          </div>
        )}
        <Link
          to={selectMode ? undefined as any : "/claims/$claimId"}
          params={selectMode ? undefined : { claimId: claim.id }}
          className="flex-1 min-w-0"
          onClick={selectMode ? e => { e.preventDefault(); onToggle(); } : undefined}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{claim.insured_name}</span>
            {!selectMode && (
              <StatusChanger claimId={claim.id} status={claim.status} onChanged={() => qc.invalidateQueries({ queryKey: ["claims"] })} />
            )}
            {selectMode && <StatusBadge status={claim.status} />}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{claim.formatted_address ?? "No address"}</span>
            {distKm !== null && (
              <span className="flex items-center gap-0.5 shrink-0 text-muted-foreground/80">
                <Navigation className="w-2.5 h-2.5" />{distKm}km
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {claim.claim_number ? `#${claim.claim_number}` : ""}
            {claim.claim_number && showTime && claim.scheduled_at ? " · " : ""}
            {showTime && claim.scheduled_at
              ? <span className="text-primary font-medium">{formatDateTime(claim.scheduled_at)}</span>
              : !showTime && !claim.scheduled_at ? ` · added ${formatRelative(claim.created_at)}` : ""}
            {!showTime && claim.scheduled_at
              ? <span className="text-primary font-medium"> · {formatDateTime(claim.scheduled_at)}</span> : ""}
          </div>
        </Link>
        {!selectMode && (
          <div className="flex items-center gap-1.5 shrink-0">
            {tel && (
              <Button asChild size="sm" variant="secondary" className="h-11 text-sm px-3">
                <a href={ciscoJabberLink(claim.insured_phone) ?? tel} onClick={() => void markContactStarted()}><Phone className="w-3.5 h-3.5 mr-1" />Call</a>
              </Button>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
          </div>
        )}
      </div>

      {!selectMode && (
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border/60" onClick={e => e.stopPropagation()}>
          <QuickScheduleButton claimId={claim.id} currentScheduledAt={claim.scheduled_at} onChanged={() => qc.invalidateQueries({ queryKey: ["claims"] })} />
          <Button
            size="sm" variant="ghost" className="h-11 text-sm gap-1.5 px-3"
            disabled={isInspectedOrLater}
            onClick={markInspected}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isInspectedOrLater ? "Inspected" : "Mark inspected"}
          </Button>
          <QuickNotesButton claimId={claim.id} initialNotes={claim.notes} />
        </div>
      )}
    </Card>
  );
}

// Formats a Date (or UTC ISO string) as "YYYY-MM-DDTHH:mm" in LOCAL time —
// the format <input type="datetime-local"> expects. Using toISOString()
// or slicing an ISO string feeds UTC digits into a local-time input,
// silently shifting times by the timezone offset (4-5h in Ontario/Quebec).
function toLocalInputValue(src: string | Date): string {
  const d = typeof src === "string" ? new Date(src) : src;
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function QuickScheduleButton({ claimId, currentScheduledAt, onChanged }: {
  claimId: string; currentScheduledAt: string | null; onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(() => {
    if (currentScheduledAt) return toLocalInputValue(currentScheduledAt);
    const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0);
    return toLocalInputValue(d);
  });

  async function confirm() {
    setSaving(true);
    try {
      const iso = new Date(scheduledAt).toISOString();
      const { error } = await supabase.from("claims")
        .update({ status: "scheduled", scheduled_at: iso, booked_at: new Date().toISOString() } as any)
        .eq("id", claimId);
      if (error) throw error;
      onChanged();
      toast.success(`Scheduled for ${new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to schedule");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size="sm" variant="ghost" className="h-11 text-sm gap-1.5 px-3" onClick={() => setOpen(true)}>
        <CalendarCheck className="w-3.5 h-3.5" />
        {currentScheduledAt ? "Reschedule" : "Schedule"}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-primary" />Set inspection appointment
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Date & time</Label>
            <Input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className="text-sm" />
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <span className="font-medium">
              {scheduledAt ? new Date(scheduledAt).toLocaleString(undefined, { weekday: "long", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Pick a date"}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={confirm} disabled={saving || !scheduledAt}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function QuickNotesButton({ claimId, initialNotes }: { claimId: string; initialNotes: string | null }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const { error } = await supabase.from("claims").update({ notes } as any).eq("id", claimId);
      if (error) throw error;
      toast.success("Note saved");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={o => { setOpen(o); if (o) setNotes(initialNotes ?? ""); }}>
      <Button size="sm" variant="ghost" className="h-11 text-sm gap-1.5 px-3" onClick={() => setOpen(true)}>
        <StickyNote className="w-3.5 h-3.5" />
        {initialNotes ? "Notes" : "Add note"}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-primary" />Notes
          </DialogTitle>
        </DialogHeader>
        <Textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add a note about this claim…"
          rows={5}
          className="text-sm"
          autoFocus
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  new: { label: "Not contacted", cls: "bg-muted text-muted-foreground" },
  to_call: { label: "To call", cls: "bg-orange-500/15 text-orange-700 dark:text-orange-400" },
  scheduled: { label: "Scheduled", cls: "bg-primary/20 text-primary border-primary/30" },
  inspected: { label: "Inspected", cls: "bg-green-500/15 text-green-700 dark:text-green-400" },
  estimate_entered: { label: "Estimate in", cls: "bg-blue-500/15 text-blue-700 dark:text-blue-400" },
  closed: { label: "Closed", cls: "bg-secondary text-secondary-foreground" },
  cancelled: { label: "Cancelled", cls: "bg-red-500/15 text-red-700 dark:text-red-400" },
};

function StatusBadge({ status }: { status: string }) {
  const v = STATUS_STYLE[status] ?? STATUS_STYLE.new;
  return <Badge variant="outline" className={`text-xs ${v.cls}`}>{v.label}</Badge>;
}

function StatusChanger({ claimId, status, onChanged }: { claimId: string; status: string; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState<string | null>(null); // status waiting for datetime
  const [scheduledAt, setScheduledAt] = useState(() => {
    // Default to tomorrow 9am
    const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0);
    return toLocalInputValue(d);
  });
  const qc = useQueryClient();

  async function change(newStatus: string, scheduledAtIso?: string) {
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const extra: Record<string, unknown> = {};
      if (newStatus === "inspected") extra.inspected_at = now;
      if (newStatus === "estimate_entered") extra.estimate_entered_at = now;
      if (newStatus === "closed") extra.closed_at = now;
      if (newStatus === "scheduled" && scheduledAtIso) {
        extra.scheduled_at = new Date(scheduledAtIso).toISOString();
        extra.booked_at = now;
      }
      // Clear scheduled_at for any status that is not "scheduled" or beyond
      if (["new", "to_call"].includes(newStatus)) {
        extra.scheduled_at = null;
        extra.booked_at = null;
      }
      const { error } = await supabase.from("claims")
        .update({ status: newStatus as any, ...extra } as any)
        .eq("id", claimId);
      if (error) throw error;
      setOpen(false);
      setPending(null);
      onChanged();
      qc.invalidateQueries({ queryKey: ["claims"] });
      toast.success(newStatus === "scheduled"
        ? `Scheduled for ${new Date(scheduledAtIso!).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
        : `Status → ${STATUS_STYLE[newStatus]?.label ?? newStatus}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setSaving(false); }
  }

  function handleStatusClick(newStatus: string) {
    if (newStatus === "scheduled") {
      setPending("scheduled");
    } else {
      change(newStatus);
    }
  }

  return (
    <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setPending(null); }}>
      <button onClick={e => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="shrink-0">
        <StatusBadge status={status} />
      </button>
      <DialogContent>
        {!pending ? (
          <>
            <DialogHeader><DialogTitle>Change status</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-2">
              {ALL_STATUSES.map(s => (
                <Button key={s.value} variant={s.value === status ? "default" : "outline"}
                  className="justify-start" disabled={saving || s.value === status}
                  onClick={() => handleStatusClick(s.value)}>
                  {s.label}
                  {s.value === status && <span className="ml-auto text-xs opacity-60">current</span>}
                </Button>
              ))}
            </div>
            <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button></DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-primary" />Set inspection appointment
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">When is the inspection scheduled?</p>
              <div className="space-y-1.5">
                <Label className="text-xs">Date & time</Label>
                <Input type="datetime-local" value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)} className="text-sm" />
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <span className="font-medium">
                  {scheduledAt ? new Date(scheduledAt).toLocaleString(undefined, {
                    weekday: "long", month: "long", day: "numeric",
                    hour: "2-digit", minute: "2-digit"
                  }) : "Pick a date"}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setPending(null)}>← Back</Button>
              <Button onClick={() => change("scheduled", scheduledAt)} disabled={saving || !scheduledAt}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm appointment"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
