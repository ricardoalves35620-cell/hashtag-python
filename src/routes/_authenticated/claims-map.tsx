/**
 * claims-map.tsx — /claims-map
 *
 * Visual overview of all claims for the current mode on an interactive map.
 * Color coded by status. Tap any pin to see claim details + link.
 * Respects CAT/Regular isolation — only shows claims for the active deployment.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { List, MapPin, RefreshCw, Zap } from "lucide-react";
import { usePlanner } from "@/lib/PlannerContext";
import type { Database } from "@/integrations/supabase/types";

type Claim = Database["public"]["Tables"]["claims"]["Row"];

export const Route = createFileRoute("/_authenticated/claims-map")({
  head: () => ({ meta: [{ title: "Map — Claim Navigator" }] }),
  component: ClaimsMapPage,
});

const STATUS_COLORS: Record<string, string> = {
  new:              "#f97316", // orange
  to_call:          "#ef4444", // red
  scheduled:        "#3b82f6", // blue
  inspected:        "#22c55e", // green
  estimate_entered: "#16a34a", // dark green
  closed:           "#6b7280", // grey
  cancelled:        "#d1d5db", // light grey
};

const STATUS_LABELS: Record<string, string> = {
  new: "New", to_call: "To call", scheduled: "Scheduled",
  inspected: "Inspected", estimate_entered: "Estimate entered",
  closed: "Closed", cancelled: "Cancelled",
};

function ClaimsMapPage() {
  const { workMode, activeDeployment } = usePlanner();
  const isCat = workMode === "cat";
  const activeCATId = activeDeployment?.id ?? null;
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selected, setSelected] = useState<Claim | null>(null);

  const { data: claims, isLoading, refetch } = useQuery({
    queryKey: ["claims-map", isCat, activeCATId],
    queryFn: async (): Promise<Claim[]> => {
      if (isCat && !activeCATId) return [];
      let q = supabase.from("claims").select("*")
        .not("latitude", "is", null)
        .not("longitude", "is", null);
      if (isCat && activeCATId) q = q.eq("deployment_id", activeCATId);
      else q = (q as any).is("deployment_id", null);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Status count summary
  const counts: Record<string, number> = {};
  for (const c of claims ?? []) counts[c.status ?? "new"] = (counts[c.status ?? "new"] ?? 0) + 1;

  // Load Leaflet dynamically to avoid SSR issues
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    import("leaflet").then(L => {
      const Leaflet = L.default ?? L;

      // Fix default marker icons (Vite asset issue)
      delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = Leaflet.map(mapRef.current!, {
        center: [43.7, -79.4], // Default: GTA
        zoom: 10,
        zoomControl: true,
      });

      Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      leafletMapRef.current = { map, Leaflet, markers: [] as any[] };
      setMapReady(true);

      // Load Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
    });

    return () => {
      if (leafletMapRef.current?.map) {
        leafletMapRef.current.map.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Add/update markers whenever claims change
  useEffect(() => {
    if (!mapReady || !leafletMapRef.current || !claims) return;
    const { map, Leaflet, markers } = leafletMapRef.current;

    // Remove existing markers
    markers.forEach((m: any) => m.remove());
    leafletMapRef.current.markers = [];

    const bounds: [number, number][] = [];

    for (const claim of claims) {
      const lat = claim.latitude as number;
      const lng = claim.longitude as number;
      const color = STATUS_COLORS[claim.status ?? "new"] ?? "#f97316";

      const icon = Leaflet.divIcon({
        html: `<div style="
          width:14px;height:14px;border-radius:50%;
          background:${color};border:2.5px solid white;
          box-shadow:0 1px 4px rgba(0,0,0,0.4);
        "></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = Leaflet.marker([lat, lng], { icon })
        .addTo(map)
        .on("click", () => setSelected(claim));

      leafletMapRef.current.markers.push(marker);
      bounds.push([lat, lng]);
    }

    if (bounds.length > 0) {
      map.fitBounds(Leaflet.latLngBounds(bounds), { padding: [32, 32], maxZoom: 13 });
    }
  }, [mapReady, claims]);

  return (
    <div className="flex flex-col h-full -mx-4 -mt-5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background shrink-0">
        <div>
          <div className="flex items-center gap-2">
            {isCat && activeDeployment && (
              <Badge className="bg-orange-500 text-white text-xs">
                <Zap className="w-2.5 h-2.5 mr-0.5" />{activeDeployment.cat_number}
              </Badge>
            )}
            <span className="font-semibold text-sm">Claims Map</span>
            {claims && <span className="text-xs text-muted-foreground">{claims.length} with location</span>}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {Object.entries(counts).map(([status, count]) => (
              <div key={status} className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STATUS_COLORS[status] ?? "#999" }} />
                {STATUS_LABELS[status] ?? status} ({count})
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => refetch()}><RefreshCw className="w-4 h-4" /></Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/claims"><List className="w-4 h-4 mr-1" />List</Link>
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1" style={{ minHeight: 0 }}>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <Skeleton className="w-32 h-8" />
          </div>
        )}
        {!isCat || activeCATId ? (
          <div ref={mapRef} className="w-full h-full" style={{ minHeight: "calc(100vh - 14rem)" }} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <MapPin className="w-10 h-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Select a CAT to see its claims on the map.</p>
            <Button asChild size="sm"><Link to="/deployments">Select CAT</Link></Button>
          </div>
        )}

        {/* Selected claim popup */}
        {selected && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000]">
            <Card className="p-3 shadow-lg">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{selected.insured_name}</span>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[selected.status ?? "new"] }} />
                      {STATUS_LABELS[selected.status ?? "new"]}
                    </div>
                  </div>
                  {selected.claim_number && <div className="text-xs text-muted-foreground">#{selected.claim_number}</div>}
                  {selected.formatted_address && <div className="text-xs text-muted-foreground truncate">{selected.formatted_address}</div>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button asChild size="sm">
                    <Link to="/claims/$claimId" params={{ claimId: selected.id }}>Open</Link>
                  </Button>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
