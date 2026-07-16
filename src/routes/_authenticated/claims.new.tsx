import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";

import { supabase } from "@/integrations/supabase/client";
import { extractClaimFromAttachments, checkClaimDuplicates, geocodeAddress } from "@/lib/claims.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2, Sparkles, FileText, X, Layers, CopyX, Zap } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
import { AddressAutocomplete, type ResolvedAddress } from "@/components/AddressAutocomplete";
import { AddressConfidenceBadge, getAddressConfidence } from "@/components/AddressConfidence";
import { useUserProfile } from "@/lib/useUserProfile";
import { formatCaPhone, normalizeCaPhone, formatPostal, isValidCaPostal, formatRelative } from "@/lib/format";
import { LOSS_TYPES, normalizeLossType } from "@/lib/loss-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/claims/new")({
  head: () => ({ meta: [{ title: "New claim — FieldAdjust" }] }),
  component: NewClaim,
});

interface Form {
  insured_name: string;
  insured_phone: string;
  insured_email: string;
  claim_number: string;
  policy_number: string;
  carrier: string;
  loss_type: string;
  loss_date: string;
  date_contacted: string;
  inspection_duration_minutes: number;
  street: string;
  city: string;
  province: string;
  postal_code: string;
  formatted_address: string;
  latitude: number | null;
  longitude: number | null;
  place_id: string;
  cat_code: string;
  deductible: string;
  xa_id: string;
  notes: string;
}

const EMPTY: Form = {
  insured_name: "", insured_phone: "", insured_email: "", claim_number: "", policy_number: "",
  carrier: "TD Insurance", loss_type: "", loss_date: "", date_contacted: "",
  inspection_duration_minutes: 60, cat_code: "", deductible: "", xa_id: "",
  street: "", city: "", province: "", postal_code: "",
  formatted_address: "", latitude: null, longitude: null, place_id: "", notes: "",
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function blobToDataUrl(blob: Blob, mime: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result as string;
      // Ensure correct mime prefix
      if (r.startsWith("data:") && r.includes(";base64,")) {
        const idx = r.indexOf(";base64,");
        resolve(`data:${mime}${r.slice(idx)}`);
      } else resolve(r);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

type ExtractItem =
  | { kind: "image"; dataUrl: string; filename: string }
  | { kind: "pdf"; dataUrl: string; filename: string }
  | { kind: "text"; text: string; filename: string };

function mimeFor(name: string): string {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  const map: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
    gif: "image/gif", heic: "image/heic", pdf: "application/pdf",
    eml: "message/rfc822", txt: "text/plain", html: "text/html", htm: "text/html",
  };
  return map[ext] ?? "application/octet-stream";
}

/** Extract readable text from a binary .msg (Compound File Binary) blob. */
function extractPrintableFromMsgBytes(bytes: Uint8Array): string {
  const runs: string[] = [];
  let current = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if ((b >= 0x20 && b <= 0x7e) || b === 0x09 || b === 0x0a || b === 0x0d || (b >= 0x80 && b <= 0xff)) {
      current += String.fromCharCode(b);
    } else {
      if (current.length >= 6) runs.push(current.trim());
      current = "";
    }
  }
  if (current.length >= 6) runs.push(current.trim());
  return runs
    .filter(r => {
      const alphaNum = (r.match(/[a-zA-Z0-9 ]/g) ?? []).length;
      return alphaNum / r.length > 0.4;
    })
    .join(" ")
    .replace(/\s{3,}/g, "  ")
    .slice(0, 12000);
}

async function fileToItems(file: File): Promise<ExtractItem[]> {
  const name = file.name;
  const lower = name.toLowerCase();
  const mime = file.type || mimeFor(name);

  if (lower.endsWith(".zip") || mime.includes("zip")) {
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const out: ExtractItem[] = [];
    const entries = Object.values(zip.files).filter((f) => !f.dir);
    for (const entry of entries) {
      const ename = entry.name.split("/").pop() ?? entry.name;
      const el = ename.toLowerCase();
      if (el.startsWith(".") || el === "") continue;
      const emime = mimeFor(ename);
      if (emime.startsWith("image/")) {
        const blob = await entry.async("blob");
        out.push({ kind: "image", dataUrl: await blobToDataUrl(blob, emime), filename: ename });
      } else if (emime === "application/pdf") {
        const blob = await entry.async("blob");
        out.push({ kind: "pdf", dataUrl: await blobToDataUrl(blob, emime), filename: ename });
      } else if (emime.startsWith("text/") || emime === "message/rfc822") {
        out.push({ kind: "text", text: await entry.async("string"), filename: ename });
      }
    }
    if (out.length === 0) throw new Error("Zip had no supported files (images, PDFs, .eml, .txt, .html).");
    return out;
  }

  if (mime.startsWith("image/")) {
    return [{ kind: "image", dataUrl: await fileToDataUrl(file), filename: name }];
  }
  if (mime === "application/pdf") {
    return [{ kind: "pdf", dataUrl: await fileToDataUrl(file), filename: name }];
  }
  if (mime.startsWith("text/") || mime === "message/rfc822" || lower.endsWith(".eml") || lower.endsWith(".txt") || lower.endsWith(".html")) {
    return [{ kind: "text", text: await file.text(), filename: name }];
  }
  if (lower.endsWith(".msg")) {
    // Outlook MSG (Compound File Binary Format) — extract printable text
    const bytes = new Uint8Array(await file.arrayBuffer());
    const text = extractPrintableFromMsgBytes(bytes);
    return [{ kind: "text", text, filename: name }];
  }
  throw new Error(`Unsupported file: ${name}`);
}

function NewClaim() {
  const navigate = useNavigate();
  const checkDup = checkClaimDuplicates;
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftBanner, setDraftBanner] = useState<{ savedAt: string } | null>(null);
  const [draftDismissed, setDraftDismissed] = useState(false);
  const [deployments, setDeployments] = useState<Array<{id:string;cat_number:string;name:string|null;default_inspection_duration_min:number}>>([]);
  const [selectedCATId, setSelectedCATId] = useState<string | null>(
    () => localStorage.getItem("planner_active_deployment_id") || null
  );

  // Load open deployments and auto-show CAT picker
  useEffect(() => {
    supabase.from("deployments" as any)
      .select("id,cat_number,name,default_inspection_duration_min")
      .eq("is_completed", false)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDeployments(data as any[]);
          const activeId = localStorage.getItem("planner_active_deployment_id");
          if (activeId && (data as any[]).find((d: any) => d.id === activeId)) {
            // Active CAT already set — auto-assign, no dialog needed
            setSelectedCATId(activeId);
          } else {
            // Open deployments exist but none selected — leave unselected (user picks in form)
          }
        }
      });
  }, []);
  // Inspection duration always follows the selected CAT's config — no
  // per-claim override. Regular (no CAT) claims follow the user's profile
  // default instead of a hardcoded number.
  const { profile } = useUserProfile();
  const effectiveDuration = selectedCATId
    ? (deployments.find(d => d.id === selectedCATId)?.default_inspection_duration_min ?? 60)
    : (profile?.default_inspection_duration_min ?? 60);

  useEffect(() => {
    setForm((f) => ({ ...f, inspection_duration_minutes: effectiveDuration }));
  }, [effectiveDuration]);

  // Draft autosave — protects against losing entered data if connectivity
  // drops or the tab closes mid-entry. Only saves plain form fields
  // (never the uploaded files/photos — those aren't serializable and
  // aren't worth re-prompting for anyway).
  const DRAFT_KEY = "claim_new_draft";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.form?.insured_name || parsed?.form?.claim_number || parsed?.form?.formatted_address) {
          setDraftBanner({ savedAt: parsed.savedAt });
        }
      }
    } catch {
      // draft is best-effort — a corrupt/unavailable localStorage entry just means no banner
    }
  }, []);

  useEffect(() => {
    if (draftDismissed) return;
    const hasContent = form.insured_name.trim() || form.claim_number.trim() || form.formatted_address.trim();
    if (!hasContent) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, savedAt: new Date().toISOString() }));
      } catch { /* best-effort — non-critical, safe to ignore */ }
    }, 800);
    return () => clearTimeout(t);
  }, [form, draftDismissed]);

  function resumeDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.form) setForm(parsed.form);
      }
    } catch { /* best-effort — non-critical, safe to ignore */ }
    setDraftBanner(null);
    setDraftDismissed(true);
  }

  function discardDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* best-effort — non-critical, safe to ignore */ }
    setDraftBanner(null);
    setDraftDismissed(true);
  }

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* best-effort — non-critical, safe to ignore */ }
  }

  const [items, setItems] = useState<ExtractItem[]>([]);
  const [intakeFiles, setIntakeFiles] = useState<File[]>([]);
  const [duplicateOf, setDuplicateOf] = useState<{ id: string; insured_name: string; claim_number: string | null } | null>(null);
  const [overrideDup, setOverrideDup] = useState(false);
  const [verifyingAddress, setVerifyingAddress] = useState(false);

  const hasAddressCoords = form.latitude != null && form.longitude != null;
  const hasAnyAddressText = !!(form.formatted_address.trim() || form.street.trim());

  const missingFields: string[] = [];
  if (!form.insured_name.trim()) missingFields.push("Insured name");
  if (!form.claim_number.trim()) missingFields.push("Claim number");
  if (!hasAnyAddressText) missingFields.push("Address");

  // Step progress — refs kept as section anchors; step visibility (below)
  // is what actually drives the one-screen-at-a-time wizard.
  const uploadRef = useRef<HTMLDivElement>(null);
  const insuredRef = useRef<HTMLDivElement>(null);
  const claimRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const STEP_KEYS = ["upload", "insured", "claim", "address", "review"] as const;
  type StepKey = typeof STEP_KEYS[number];
  const [currentStep, setCurrentStep] = useState<StepKey>("upload");
  const stepIndex = STEP_KEYS.indexOf(currentStep);

  function goToStep(step: StepKey) {
    setCurrentStep(step);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  // Which required fields are missing on a given step — used to gate Next
  // with plain-language feedback instead of letting people sail through
  // and only discover problems at Review (QA finding).
  const [triedNext, setTriedNext] = useState<Partial<Record<StepKey, boolean>>>({});
  function stepMissing(step: StepKey): string[] {
    const miss: string[] = [];
    if (step === "insured") {
      if (!form.insured_name.trim()) miss.push("Full name");
    }
    if (step === "claim") {
      if (!form.claim_number.trim()) miss.push("Claim #");
    }
    if (step === "address") {
      if (!hasAnyAddressText) miss.push("Address");
      if (form.postal_code && !isValidCaPostal(form.postal_code)) miss.push("Postal code (format A1A 1A1)");
    }
    return miss;
  }
  function nextStep() {
    const miss = stepMissing(currentStep);
    if (miss.length > 0) {
      setTriedNext(t => ({ ...t, [currentStep]: true }));
      toast.error(`Please fill in: ${miss.join(", ")}`);
      return;
    }
    if (stepIndex < STEP_KEYS.length - 1) goToStep(STEP_KEYS[stepIndex + 1]);
  }
  function prevStep() {
    if (stepIndex > 0) goToStep(STEP_KEYS[stepIndex - 1]);
  }

  const stepStatus = {
    upload: items.length > 0,
    insured: !!form.insured_name.trim(),
    claim: !!form.claim_number.trim() && !!form.carrier.trim(),
    address: hasAnyAddressText,
    review: missingFields.length === 0,
  };

  async function verifyAddressNow() {
    const query = form.formatted_address.trim() || [form.street, form.city, form.province, form.postal_code].filter(Boolean).join(", ");
    if (!query) { toast.error("Enter an address first."); return; }
    setVerifyingAddress(true);
    try {
      const geo = await geocodeAddress(query);
      if (!geo.ok || typeof geo.latitude !== "number" || typeof geo.longitude !== "number") {
        toast.error("Could not verify this address. Try selecting a result from the search box instead.");
        return;
      }
      setForm((f) => ({
        ...f,
        latitude: geo.latitude,
        longitude: geo.longitude,
        formatted_address: geo.formattedAddress || f.formatted_address,
        place_id: geo.placeId || f.place_id,
      }));
      toast.success("Address verified · Coordinates found");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not verify address");
    } finally {
      setVerifyingAddress(false);
    }
  }

  async function runDupCheck(next: Form): Promise<{ id: string; insured_name: string; claim_number: string | null } | null> {
    try {
      const { results } = await checkDup({
        data: {
          candidates: [{
            id: "current",
            claim_number: next.claim_number || null,
            policy_number: next.policy_number || null,
            insured_phone: next.insured_phone ? normalizeCaPhone(next.insured_phone) : null,
            postal_code: next.postal_code || null,
          }],
        },
      });
      const found = results[0]?.existing ?? null;
      setDuplicateOf(found);
      return found;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  function update<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    e.target.value = "";
    setExtracting(true);
    try {
      const collected: ExtractItem[] = [];
      for (const file of files) {
        const sub = await fileToItems(file);
        collected.push(...sub);
      }
      setItems(collected);
      setIntakeFiles(files);
      const result = await extractClaimFromAttachments(collected);
      setForm((f) => ({
        ...f,
        insured_name: result.insured_name ?? f.insured_name,
        insured_phone: result.insured_phone ? formatCaPhone(result.insured_phone) : f.insured_phone,
        insured_email: result.insured_email ?? f.insured_email,
        claim_number: result.claim_number ?? f.claim_number,
        policy_number: result.policy_number ?? f.policy_number,
        carrier: result.carrier ?? f.carrier ?? "TD Insurance",
        loss_type: normalizeLossType(result.loss_type) ?? f.loss_type,
        loss_date: result.loss_date ?? f.loss_date,
        date_contacted: result.date_contacted ?? f.date_contacted,
        street: result.street ?? f.street,
        city: result.city ?? f.city,
        province: result.province ?? f.province,
        postal_code: result.postal_code ? formatPostal(result.postal_code) : f.postal_code,
        formatted_address: result.formatted_address ?? f.formatted_address,
        // Use coordinates from Google Maps URL in email — more accurate than geocoding
        latitude: (result as Record<string, unknown>).latitude != null
          ? Number((result as Record<string, unknown>).latitude)
          : f.latitude,
        longitude: (result as Record<string, unknown>).longitude != null
          ? Number((result as Record<string, unknown>).longitude)
          : f.longitude,
        notes: result.notes ?? f.notes,
        cat_code: (result as Record<string, unknown>).cat_code as string ?? f.cat_code,
        deductible: (result as Record<string, unknown>).deductible as string ?? f.deductible,
        xa_id: (result as Record<string, unknown>).xa_id as string ?? f.xa_id,
      }));
      toast.success("Extracted — review and fill any missing fields.");
      const next: Form = {
        ...form,
        claim_number: result.claim_number ?? form.claim_number,
        policy_number: result.policy_number ?? form.policy_number,
        insured_phone: result.insured_phone ? formatCaPhone(result.insured_phone) : form.insured_phone,
        postal_code: result.postal_code ? formatPostal(result.postal_code) : form.postal_code,
      } as Form;
      await runDupCheck(next);
      // Auto-advance so user can immediately review and fill missing fields
      goToStep("insured");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Extraction failed";
      toast.error(msg);
    } finally {
      setExtracting(false);
    }
  }

  function onAddressResolved(addr: ResolvedAddress) {
    setForm((f) => ({
      ...f,
      street: addr.street,
      city: addr.city,
      province: addr.province,
      postal_code: addr.postalCode,
      formatted_address: addr.formattedAddress,
      latitude: addr.latitude,
      longitude: addr.longitude,
      place_id: addr.placeId,
    }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.insured_name.trim()) {
      toast.error("Insured name is required.");
      return;
    }
    if (!form.formatted_address.trim() && !form.street.trim()) {
      toast.error("Address is required for route planning.");
      return;
    }
    if (form.postal_code && !isValidCaPostal(form.postal_code)) {
      toast.error("Postal code must be Canadian format, e.g. A1A 1A1.");
      return;
    }
    // Re-check duplicates with latest values
    const found = await runDupCheck(form);
    if (found && !overrideDup) {
      toast.error("Duplicate detected — toggle 'Save anyway' to override.");
      return;
    }
    setSaving(true);
    try {
      // Auto-geocode typed addresses on save so nobody has to know the
      // "Verify address" button exists. Without coordinates, the claim
      // never appears in the route planner.
      let geoPatch: { latitude?: number; longitude?: number; formatted_address?: string; place_id?: string } = {};
      if (form.latitude == null || form.longitude == null) {
        const query = form.formatted_address.trim() || [form.street, form.city, form.province, form.postal_code].filter(Boolean).join(", ");
        if (query) {
          try {
            const geo = await geocodeAddress(query);
            if (geo.ok && typeof geo.latitude === "number" && typeof geo.longitude === "number") {
              geoPatch = {
                latitude: geo.latitude,
                longitude: geo.longitude,
                formatted_address: geo.formattedAddress || undefined,
                place_id: geo.placeId || undefined,
              };
              toast.success("Address verified automatically");
            } else {
              toast.warning("Saved, but the address couldn't be verified on the map. Open the claim later and fix the address so it shows up in your route.", { duration: 8000 });
            }
          } catch {
            toast.warning("Saved, but the address couldn't be verified on the map. Open the claim later and fix the address so it shows up in your route.", { duration: 8000 });
          }
        }
      }

      const phoneE164 = form.insured_phone ? normalizeCaPhone(form.insured_phone) : null;

      const { data: claim, error } = await supabase
        .from("claims")
        .insert({
          insured_name: form.insured_name.trim(),
          insured_phone: phoneE164,
          insured_email: form.insured_email.trim() || null,
          claim_number: form.claim_number.trim() || null,
          policy_number: form.policy_number.trim() || null,
          carrier: form.carrier.trim() || "TD Insurance",
          loss_type: form.loss_type || null,
          loss_date: form.loss_date || null,
          date_contacted: form.date_contacted || null,
          inspection_duration_minutes: form.inspection_duration_minutes,
          cat_code: form.cat_code.trim() || null,
          deductible: form.deductible.trim() || null,
          xa_id: form.xa_id.trim() || null,
          street: form.street.trim() || null,
          city: form.city.trim() || null,
          province: form.province.trim().toUpperCase() || null,
          postal_code: form.postal_code.trim().toUpperCase() || null,
          country: "CA",
          formatted_address: geoPatch.formatted_address ?? (form.formatted_address.trim() || null),
          latitude: geoPatch.latitude ?? form.latitude,
          longitude: geoPatch.longitude ?? form.longitude,
          place_id: geoPatch.place_id ?? (form.place_id || null),
          status: "new",
          notes: form.notes.trim() || null,
          deployment_id: selectedCATId || null,
        })
        .select("id")
        .single();
        if (error) {
          if ((error as { code?: string }).code === "23505") throw new Error("Duplicate of an existing claim.");
          throw error;
        }

      // Upload intake image if any
      for (const f of intakeFiles) {
        const ext = (f.name.split(".").pop() ?? "bin").toLowerCase();
        const path = `claims/${claim.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("intake-photos").upload(path, f);
        if (!upErr) {
          await supabase.from("claim_intake_images").insert({
            claim_id: claim.id,
            storage_path: path,
          });
        }
      }

      // Check if any active CAT deployment exists
      const { data: activeCats } = await supabase
        .from("deployments" as any)
        .select("id,cat_number,name")
        .eq("is_active", true)
        .eq("is_completed", false)
        .order("created_at", { ascending: false });

      if (activeCats && activeCats.length > 0) {
        // Auto-assign to active CAT if only one, or show picker if multiple
        const activeCATId = localStorage.getItem("planner_active_deployment_id");
        const matchingCat = (activeCats as any[]).find((d: any) => d.id === activeCATId) ?? (activeCats as any[])[0];
        if (matchingCat) {
          await supabase.from("claims").update({ deployment_id: matchingCat.id } as any).eq("id", claim.id);
          toast.success(`Claim saved and assigned to ${matchingCat.cat_number}`);
        } else {
          toast.success("Claim saved.");
        }
      } else {
        toast.success("Claim saved.");
      }
      clearDraft();
      navigate({ to: "/claims/$claimId", params: { claimId: claim.id } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  const STEPS: { key: StepKey; label: string }[] = [
    { key: "upload", label: "Upload" },
    { key: "insured", label: "Insured" },
    { key: "claim", label: "Claim" },
    { key: "address", label: "Address" },
    { key: "review", label: "Review" },
  ];

  return (
    <div className="flex flex-col h-full space-y-5" ref={topRef}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New claim</h1>
          <p className="text-sm text-muted-foreground">Snap a photo, drop a <strong>.msg</strong> / .eml / PDF, or upload a zip — we'll fill in the rest.</p>
        </div>
        <Button type="button" variant="ghost" size="sm" className="shrink-0 h-11" onClick={() => { clearDraft(); navigate({ to: "/claims" }); }}>
          Cancel
        </Button>
      </div>

      {draftBanner && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2.5 text-sm">
          <span>You have an unsaved draft from {formatRelative(draftBanner.savedAt)}.</span>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="ghost" className="h-8" onClick={discardDraft}>Discard</Button>
            <Button size="sm" className="h-8" onClick={resumeDraft}>Resume</Button>
          </div>
        </div>
      )}


      <div className="sticky top-0 z-20 -mx-4 px-4 py-2 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center">
          {STEPS.map((step, i) => (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => goToStep(step.key)}
                className="flex flex-col items-center gap-1 shrink-0 py-1"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === step.key ? "bg-primary text-primary-foreground ring-2 ring-primary/30" :
                  stepStatus[step.key] ? "bg-green-500 text-white" : "bg-muted text-muted-foreground border border-border"
                }`}>
                  {stepStatus[step.key] && currentStep !== step.key ? "✓" : i + 1}
                </div>
                <span className={`text-xs whitespace-nowrap ${currentStep === step.key ? "text-primary font-medium" : "text-muted-foreground"}`}>{step.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 mb-3.5 rounded ${stepStatus[step.key] ? "bg-green-500" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {duplicateOf && (
        <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 truncate">
            <CopyX className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-300" />
            <span className="truncate">Duplicate of <strong>{duplicateOf.insured_name}</strong>{duplicateOf.claim_number ? ` · ${duplicateOf.claim_number}` : ""}</span>
          </span>
          <Button type="button" size="sm" variant="ghost" className="h-11 text-xs" onClick={() => setOverrideDup((v) => !v)}>
            {overrideDup ? "Skip" : "Save anyway"}
          </Button>
        </div>
      )}

      <div className={currentStep === "upload" ? "space-y-4" : "hidden"}>
      {/* CAT assignment prompt */}
      {deployments.length > 0 && (
        <div className="rounded-lg border border-orange-300/50 bg-orange-50/50 dark:bg-orange-950/10 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="font-medium">
                {selectedCATId
                  ? `Assigned to ${deployments.find(d => d.id === selectedCATId)?.cat_number}`
                  : deployments.length > 0 ? "⚠ Assign to a CAT event" : "No open CAT events"}
              </span>
            </div>
          </div>
          {deployments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCATId(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  selectedCATId === null
                    ? "bg-muted text-foreground border-border"
                    : "text-muted-foreground border-border hover:text-foreground"
                }`}>
                Regular (no CAT)
              </button>
              {deployments.map(d => (
                <button key={d.id}
                  onClick={() => setSelectedCATId(d.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedCATId === d.id
                      ? "bg-orange-500 text-white border-orange-500"
                      : "text-muted-foreground border-border hover:text-foreground"
                  }`}>
                  {d.cat_number}{d.name ? ` — ${d.name}` : ""}
                </button>
              ))}
            </div>
          )}
          {!selectedCATId && deployments.length > 0 && (
            <p className="text-xs text-orange-500">
              Select a CAT event above, or choose "Regular" if this is not a CAT claim.
            </p>
          )}
        </div>
      )}

      <Button asChild variant="outline" size="sm" className="w-full">
        <a href="/claims/batch" onClick={(e) => { e.preventDefault(); navigate({ to: "/claims/batch" }); }}>
          <Layers className="w-4 h-4 mr-2" /> Got a whole CAT batch? Use batch intake
        </a>
      </Button>

      {/* Skip photo — go straight to manual entry */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full h-11"
        onClick={() => goToStep("insured")}
      >
        Fill manually →
      </Button>

      <div ref={uploadRef} />
      <Card className="p-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf,.pdf,.eml,.msg,.txt,.html,.htm,.zip,application/zip,message/rfc822"
          multiple
          className="hidden"
          onChange={onPickFiles}
        />
        {items.length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {items.map((it, i) => (
                <div key={i} className="rounded-lg border border-border bg-muted/30 p-2 text-xs flex flex-col items-center gap-1 overflow-hidden">
                  {it.kind === "image" ? (
                    <img src={it.dataUrl} alt={it.filename} className="max-h-32 object-contain" />
                  ) : (
                    <FileText className="w-8 h-8 text-muted-foreground my-2" />
                  )}
                  <span className="truncate w-full text-center" title={it.filename}>{it.filename}</span>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" className="w-full" onClick={() => fileRef.current?.click()} disabled={extracting}>
              <Camera className="w-4 h-4 mr-2" /> Replace attachments
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => { setItems([]); setIntakeFiles([]); }}
              disabled={extracting}
            >
              <X className="w-4 h-4 mr-2" /> Clear
            </Button>
          </div>
        ) : (
          <Button type="button" className="w-full h-24 text-base" variant="outline" onClick={() => fileRef.current?.click()}>
            <Camera className="w-5 h-5 mr-2" /> Photo, PDF, .eml, or .zip
          </Button>
        )}
        {extracting && (
          <div className="flex items-center gap-2 text-sm text-primary mt-3">
            <Sparkles className="w-4 h-4 animate-pulse" /> Extracting claim details…
          </div>
        )}
      </Card>
      </div>

      <form onSubmit={onSave} className="space-y-4 pb-24">
        <div className={currentStep === "insured" ? "space-y-4" : "hidden"}>
        <div ref={insuredRef} />
        <Card className="p-4 space-y-3">
          <SectionHeading>Insured</SectionHeading>
          <Field label="Full name" required>
            <Input value={form.insured_name} onChange={(e) => update("insured_name", e.target.value)} required
              className={triedNext.insured && !form.insured_name.trim() ? "border-red-500 ring-1 ring-red-500" : ""} />
            {triedNext.insured && !form.insured_name.trim() && (
              <p className="text-xs text-red-600 mt-1">Full name is required</p>
            )}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone">
              <Input
                type="tel"
                inputMode="tel"
                value={form.insured_phone}
                onChange={(e) => update("insured_phone", formatCaPhone(e.target.value))}
                placeholder="(416) 555-0123"
              />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.insured_email} onChange={(e) => update("insured_email", e.target.value)} />
            </Field>
          </div>
        </Card>
        </div>

        <div className={currentStep === "claim" ? "space-y-4" : "hidden"}>
        <div ref={claimRef} />
        <Card className="p-4 space-y-3">
          <SectionHeading>Claim</SectionHeading>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Claim #" required>
              <Input value={form.claim_number} onChange={(e) => update("claim_number", e.target.value)}
                className={triedNext.claim && !form.claim_number.trim() ? "border-red-500 ring-1 ring-red-500" : ""} />
              {triedNext.claim && !form.claim_number.trim() && (
                <p className="text-xs text-red-600 mt-1">Claim # is required</p>
              )}
            </Field>
            <Field label="Policy #"><Input value={form.policy_number} onChange={(e) => update("policy_number", e.target.value)} /></Field>
            <Field label="Carrier" required>
              <Input value={form.carrier} onChange={(e) => update("carrier", e.target.value)}
                className={triedNext.claim && !form.carrier.trim() ? "border-red-500 ring-1 ring-red-500" : ""} />
              {triedNext.claim && !form.carrier.trim() && (
                <p className="text-xs text-red-600 mt-1">Carrier is required</p>
              )}
            </Field>
            <Field label="Loss type">
              <Select value={form.loss_type} onValueChange={(v) => update("loss_type", v)}>
                <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  {LOSS_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Loss date"><Input type="date" value={form.loss_date} onChange={(e) => update("loss_date", e.target.value)} /></Field>
            <Field label="Date contacted">
              <Input type="date" value={form.date_contacted} onChange={(e) => update("date_contacted", e.target.value)} />
            </Field>
            <Field label="Inspection duration">
              <div className="h-9 flex items-center px-3 rounded-md border border-input bg-muted/50 text-sm text-muted-foreground">
                {effectiveDuration} min {selectedCATId ? "(from CAT config)" : "(from your profile)"}
              </div>
            </Field>
          </div>
        </Card>
        </div>

        <div className={currentStep === "address" ? "space-y-4" : "hidden"}>
        <div ref={addressRef} />
        <Card className="p-4 space-y-3">
          <SectionHeading>Address (Canada)</SectionHeading>
          {triedNext.address && !hasAnyAddressText && (
            <p className="text-xs text-red-600 border border-red-300 bg-red-50 dark:bg-red-950/20 rounded px-2 py-1.5">
              An address is required — type one below or pick a search result.
            </p>
          )}
          <Field label="Search address">
            <AddressAutocomplete
              initialValue={form.formatted_address}
              onResolve={onAddressResolved}
              placeholder="Start typing a Canadian address…"
            />
          </Field>
          <AddressConfidenceBadge level={getAddressConfidence({
            hasText: hasAnyAddressText,
            hasCoords: hasAddressCoords,
            hasPlaceId: !!form.place_id,
          })} />
          {hasAnyAddressText && !hasAddressCoords && (
            <Button type="button" size="sm" variant="outline" className="h-11 text-xs" onClick={verifyAddressNow} disabled={verifyingAddress}>
              {verifyingAddress ? <Loader2 className="w-3 h-3 animate-spin" /> : "Verify address"}
            </Button>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Street"><Input value={form.street} onChange={(e) => update("street", e.target.value)} /></Field>
            <Field label="City"><Input value={form.city} onChange={(e) => update("city", e.target.value)} /></Field>
            <Field label="Province">
              <Input value={form.province} onChange={(e) => update("province", e.target.value.toUpperCase())} maxLength={2} placeholder="ON" />
            </Field>
            <Field label="Postal code">
              <Input
                value={form.postal_code}
                onChange={(e) => update("postal_code", formatPostal(e.target.value))}
                placeholder="A1A 1A1"
                maxLength={7}
              />
            </Field>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <SectionHeading>Notes</SectionHeading>
          <Textarea rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Anything else from the assignment…" />
        </Card>
        </div>

        <div className={currentStep === "review" ? "space-y-4" : "hidden"}>
        <div ref={reviewRef} />
        <Card className={`p-4 space-y-3 ${missingFields.length === 0 ? "border-green-300 bg-green-50/50 dark:bg-green-950/10" : "border-amber-300 bg-amber-50/50 dark:bg-amber-950/10"}`}>
          <SectionHeading>Review & Confirm</SectionHeading>
          {missingFields.length === 0 ? (
            <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1.5">
              <span>✓</span> All required fields filled — ready to save.
            </p>
          ) : (
            <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
              <p className="font-medium">Still missing (tap to fix):</p>
              <div className="flex flex-wrap gap-2">
                {missingFields.map(f => {
                  const stepMap: Record<string, StepKey> = {
                    "Insured name": "insured",
                    "Claim number": "claim",
                    "Address": "address",
                  };
                  return (
                    <button key={f} type="button"
                      onClick={() => goToStep(stepMap[f] ?? "insured")}
                      className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 transition-colors underline underline-offset-2">
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="divide-y divide-border">
            {/* Insured */}
            <div className="py-2 flex items-start justify-between gap-2">
              <div className="space-y-0.5 text-xs flex-1 min-w-0">
                <div className="font-medium text-muted-foreground uppercase tracking-wide">Insured</div>
                <div>{form.insured_name || <span className="text-red-500">Missing</span>}</div>
                {form.insured_phone && <div className="text-muted-foreground">{form.insured_phone}</div>}
                {form.insured_email && <div className="text-muted-foreground truncate">{form.insured_email}</div>}
              </div>
              <button type="button" onClick={() => goToStep("insured")} className="text-xs text-primary underline underline-offset-2 shrink-0">Edit</button>
            </div>
            {/* Claim */}
            <div className="py-2 flex items-start justify-between gap-2">
              <div className="space-y-0.5 text-xs flex-1 min-w-0">
                <div className="font-medium text-muted-foreground uppercase tracking-wide">Claim</div>
                <div>{form.claim_number || <span className="text-red-500">Missing claim #</span>} · {form.carrier || "TD Insurance"}</div>
                {form.loss_type && <div className="text-muted-foreground">{form.loss_type}{form.loss_date ? ` · ${form.loss_date}` : ""}</div>}
              </div>
              <button type="button" onClick={() => goToStep("claim")} className="text-xs text-primary underline underline-offset-2 shrink-0">Edit</button>
            </div>
            {/* Address */}
            <div className="py-2 flex items-start justify-between gap-2">
              <div className="space-y-0.5 text-xs flex-1 min-w-0">
                <div className="font-medium text-muted-foreground uppercase tracking-wide">Address</div>
                <div className={!hasAnyAddressText ? "text-red-500" : ""}>{form.formatted_address || [form.street, form.city, form.province].filter(Boolean).join(", ") || "Missing"}</div>
                {hasAddressCoords && <div className="text-green-600">✓ Coordinates verified</div>}
              </div>
              <button type="button" onClick={() => goToStep("address")} className="text-xs text-primary underline underline-offset-2 shrink-0">Edit</button>
            </div>
            {/* CAT */}
            <div className="py-2 text-xs">
              <span className="text-muted-foreground">Mode: </span>
              {selectedCATId ? (deployments.find(d => d.id === selectedCATId)?.cat_number ?? "CAT") : "Regular (no CAT)"}
            </div>
          </div>
        </Card>
        </div>

      </form>

      <div
        className="fixed left-0 right-0 bg-background/95 backdrop-blur border-t border-border px-4 pt-3 z-40"
        style={{ bottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))", paddingBottom: "0.75rem" }}
      >
        {currentStep === "review" && missingFields.length > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 text-center mb-2">
            Missing required fields: {missingFields.join(", ")} — tap above to fix
          </p>
        )}
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1 h-14" onClick={prevStep} disabled={stepIndex === 0}>
            Back
          </Button>
          {currentStep === "review" ? (
            <Button
              type="submit"
              className={`flex-1 h-14 text-base font-semibold ${missingFields.length === 0 ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
              disabled={saving || !form.insured_name.trim()}
              onClick={onSave}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "✓ Confirm & Save"}
            </Button>
          ) : (
            <Button type="button" className="flex-1 h-14 text-base" onClick={nextStep}>
              Next →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{children}</h2>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}{required && <span className="text-primary"> *</span>}</Label>
      {children}
    </div>
  );
}