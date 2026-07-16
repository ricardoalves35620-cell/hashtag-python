/**
 * td-parser.ts
 *
 * Deterministic, no-AI-call parsers used as a fast/free first pass by
 * functions/api/extract.ts and functions/api/extract-batch.ts, before
 * falling back to the Anthropic vision/text extraction.
 *
 * This file previously existed and was deleted as "unused" in an earlier
 * cleanup pass — but extract.ts and extract-batch.ts both import from it,
 * so that deletion silently broke both extraction endpoints (any call
 * fails at the module-import step, before any of their logic runs). This
 * is a working reconstruction covering the two documented use cases:
 * TD/Meloche-style assignment text, and the backup JSON/CSV/TSV format
 * described in IMPORT_BACKUP_FORMAT.md.
 *
 * parseTdEmail — pulls a single claim's fields out of one assignment
 * email/page of text via regex. Returns null if it doesn't look like a
 * claim (no insured name found), so the caller can fall back to AI.
 *
 * parseClaimNavigatorReport — parses a whole backup/report file (JSON
 * array, `{claims:[...]}` object, or CSV/TSV with flexible header
 * aliases) into an array of claims. Returns [] if the text doesn't look
 * like one of those formats, so the caller falls back to AI.
 */

type ParsedClaim = Record<string, string | null | undefined>;

const FIELD_ALIASES: Record<string, string[]> = {
  insured_name:      ["insured_name", "insured name", "insured", "name", "policyholder", "claimant",
                      "insuredname"],
  insured_phone:     ["insured_phone", "phone", "telephone", "mobile", "contact phone", "cell",
                      "insuredphone", "primaryphone", "primary phone", "primary_phone"],
  insured_email:     ["insured_email", "email", "insuredemail"],
  claim_number:      ["claim_number", "claim number", "claim #", "claim no", "file number", "claim#",
                      "claimnumber"],
  policy_number:     ["policy_number", "policy number", "policy #", "policy no", "policy#",
                      "policynumber"],
  carrier:           ["carrier", "company", "insurer", "carriername"],
  loss_type:         ["loss_type", "loss type", "type of loss", "peril", "cause", "losstype"],
  loss_date:         ["loss_date", "date of loss", "dol", "lossdate"],
  date_contacted:    ["date_contacted", "date contacted", "contacted", "datecontacted"],
  date_inspected:    ["date_inspected", "date inspected", "inspected", "dateinspected",
                      "inspectiondate", "inspection date", "inspection_date",
                      "dateinspected", "inspected_at"],
  formatted_address: ["formatted_address", "loss address", "loss location", "property address",
                      "address", "search address", "addresssearch", "address_search"],
  street:            ["street"],
  city:              ["city"],
  province:          ["province", "prov"],
  postal_code:       ["postal_code", "postal code", "postal", "postalcode"],
  cat_code:          ["cat_code", "cat code", "cat", "event code", "deployment code",
                      "catcode", "catname", "cat name", "cat_name"],
  deductible:        ["deductible"],
  xa_id:             ["xa_id", "xa id", "xactanalysis id", "xaid"],
  scheduled_at:      ["scheduled_at", "appointment date", "appointment time",
                      "inspection date", "inspection time", "appointment",
                      "inspectiontime", "inspection_time",
                      "plannedinspectiondate", "planned inspection date", "planned_inspection_date"],
  first_contacted_at: ["first_contacted_at", "firstcontactedat", "first contacted at",
                       "first contact", "customer contacted"],
  status:            ["status", "inspection status", "claim status", "call status", "current status",
                      "currentstatus", "inspectionstatus", "current_status", "inspection_status",
                      "call_status"],
  notes:             ["notes", "note", "comments", "circumstances"],
};

/** Convert camelCase to snake_case: "insuredName" → "insured_name" */
function camelToSnake(s: string): string {
  return s.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
}

function normalizeRow(row: Record<string, unknown>): ParsedClaim {
  const flat: Record<string, unknown> = {};

  for (const [k, v] of Object.entries(row)) {
    if (v === undefined || v === null || v === "") continue;

    // Nested address object: { street, city, province, postalCode, search/formatted_address }
    if (k === "address" && typeof v === "object" && !Array.isArray(v)) {
      const addr = v as Record<string, unknown>;
      if (addr.street)   flat["street"]   = addr.street;
      if (addr.city)     flat["city"]     = addr.city;
      if (addr.province) flat["province"] = addr.province;
      if (addr.postalCode || addr.postal_code)
        flat["postal_code"] = addr.postalCode ?? addr.postal_code;
      // Use the "search" field as formatted_address — that's the geocodeable string
      if (addr.search)             flat["formatted_address"] = addr.search;
      else if (addr.formatted_address) flat["formatted_address"] = addr.formatted_address;
      continue;
    }

    // phones array: [{ type, number, primary }] — pick the primary, fall back to first
    if (k === "phones" && Array.isArray(v)) {
      const phones = v as Array<{ number?: string; primary?: boolean }>;
      const primary = phones.find(p => p.primary) ?? phones[0];
      if (primary?.number) flat["insured_phone"] = primary.number;
      continue;
    }

    // allPhones CSV column: "Home: (514) 910-5548 | Mobile: (514) 910-5548 [PRIMARY]"
    // Skip — primaryPhone column handles it
    if (k === "allPhones" || k === "all_phones") continue;

    // Flatten scalar values; convert camelCase keys to snake_case so aliases match
    const key = camelToSnake(k);
    flat[key] = typeof v === "object" ? JSON.stringify(v) : v;
  }

  // Map to canonical field names using FIELD_ALIASES
  const out: ParsedClaim = {};
  for (const [rawKey, rawVal] of Object.entries(flat)) {
    if (rawVal === undefined || rawVal === null || rawVal === "") continue;
    const val = String(rawVal).trim();
    const norm = rawKey.toLowerCase().replace(/\s+/g, " ");
    let matched = false;
    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      if (aliases.includes(norm)) {
        if (!out[field]) out[field] = val; // first match wins
        matched = true;
        break;
      }
    }
    // Pass through unrecognized keys as-is (e.g. xa_id already canonical)
    if (!matched && !(rawKey in out)) out[rawKey] = val;
  }

  // Extract deductible and xa_id from notes if not set directly
  if (!out.deductible && out.notes) {
    const m = out.notes.match(/Deductible:\s*\$?([\d,]+)/i);
    if (m) out.deductible = m[1].replace(/,/g, "");
  }
  if (!out.xa_id && out.notes) {
    const m = out.notes.match(/XA\s*Id:\s*([A-Za-z0-9]+)/i);
    if (m) out.xa_id = m[1];
  }

  return out;
}

// ── TD/Meloche-style assignment text parser ────────────────────────────────
export function parseTdEmail(text: string): ParsedClaim | null {
  // Normalize line endings
  const t = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // ── Tab-field extractor ──────────────────────────────────────────────────
  // XactAnalysis emails use: "Label: \t Value\t " format.
  // Values may be followed by trailing tabs, spaces, dashes, or suffixes.
  function field(...labels: string[]): string | null {
    for (const label of labels) {
      const esc = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`${esc}\\s*:\\s*\\t?\\s*([^\\t\\n]+?)\\s*(?:\\t|\\s*$)`, "im");
      const m = t.match(re);
      const v = m?.[1]?.trim();
      if (v && v.length > 0) return v;
    }
    return null;
  }

  // ── Insured name ─────────────────────────────────────────────────────────
  // Format: "Name: \t Melody Tiedeman (GEN)\t "
  // Strip classification codes: (GEN), (SEN), (COM), etc.
  const rawName = field("Name", "Insured name", "Insured / Assuré", "Claimant", "Assuré", "Client");
  if (!rawName) return null; // not a claim email
  const result: ParsedClaim = {
    insured_name: rawName.replace(/\s*\([A-Z]{2,4}\)\s*$/, "").replace(/[,.]$/, "").trim(),
  };

  // ── Phone ─────────────────────────────────────────────────────────────────
  // Format: "Mobile Phone: \t (780) 916-8685 - Primary\t "
  // Multiple phone fields; prefer the one labeled "- Primary"
  const phoneLabels = ["Mobile Phone", "Home Phone", "Business Phone", "Other Phone", "Phone"];
  let primaryPhone: string | null = null;
  for (const label of phoneLabels) {
    const raw = field(label);
    if (!raw) continue;
    // Strip "- Primary" suffix and other qualifiers
    const digits = raw.replace(/\s*-\s*(?:Primary|Home|Cell|Mobile|Business|Autre|Domicile)[^(]*/gi, "").replace(/\D/g, "");
    if (digits.length === 10) {
      const formatted = `+1${digits}`;
      if (!primaryPhone || raw.toLowerCase().includes("primary")) primaryPhone = formatted;
    }
  }
  if (primaryPhone) result.insured_phone = primaryPhone;

  // ── Address ──────────────────────────────────────────────────────────────
  // "Address: \t 11843 92 ST NW Edmonton, AB T5G 1A4 Canada\t "
  // Also appears on the continuation line (tab-indented)
  const addrRaw = field("Address", "Loss Address", "Search address", "Property address") ??
    // Fall back to first tab-indented line that contains a postal code
    (t.match(/^\s+\t\s+([A-Za-z0-9 ,]+,\s*[A-Z]{2}\s+[A-Z]\d[A-Z]\s*\d[A-Z]\d[^<\t\n]*)/m)?.[1]?.trim());
  if (addrRaw) {
    const cleaned = addrRaw
      .replace(/\s*https?:\/\/\S+/gi, "")
      .replace(/\s*Google Maps\s*/gi, "")
      .replace(/\s*MapQuest\s*/gi, "")
      .replace(/\s*<[^>]+>/g, "")
      .replace(/\s*\|.*$/, "")
      .replace(/\s+Canada\s*$/i, "")
      .trim();
    if (cleaned) result.formatted_address = cleaned;

    // Parse city, province, postal code from address
    const provPostal = cleaned.match(/([A-Z]{2})\s+([A-Z]\d[A-Z]\s*\d[A-Z]\d)/i);
    if (provPostal) {
      result.province = provPostal[1].toUpperCase();
      result.postal_code = provPostal[2].toUpperCase().replace(/(.{3})(.{3})/, "$1 $2");
    }
    const cityMatch = cleaned.match(/,\s*([^,]+?),?\s+[A-Z]{2}\s+[A-Z]\d/i);
    if (cityMatch) result.city = cityMatch[1].trim();
    const streetMatch = cleaned.match(/^([^,]+)/);
    if (streetMatch) result.street = streetMatch[1].trim();
  }

  // ── Claim, policy, deductible, CAT code, XA ID ───────────────────────────
  result.claim_number = field("Claim #", "Claim Number", "Numéro de dossier") ?? undefined;
  result.policy_number = field("Policy #", "Policy Number") ?? undefined;
  const dedRaw = field("Deductible", "Franchise");
  if (dedRaw) result.deductible = dedRaw.replace(/[$,\s]/g, "");
  result.cat_code = field("CAT Code", "CAT", "Event Code") ?? undefined;
  result.xa_id = field("XA Id", "XA ID", "Xactanalysis ID") ?? undefined;

  // ── Carrier — prefer Contractor over "TDI - Staff" ───────────────────────
  const contractor = field("Contractor");
  const carrier = field("Carrier");
  result.carrier = contractor ?? carrier ?? "TD Insurance";

  // ── Date of Loss — MM/DD/YYYY → YYYY-MM-DD ───────────────────────────────
  const dolRaw = field("Date of Loss", "Date du sinistre", "D.O.L", "DOL");
  if (dolRaw) {
    const m = dolRaw.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (m) {
      const yr = m[3].length === 2 ? `20${m[3]}` : m[3];
      result.loss_date = `${yr}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
    } else if (/\d{4}-\d{2}-\d{2}/.test(dolRaw)) {
      result.loss_date = dolRaw.match(/\d{4}-\d{2}-\d{2}/)![0];
    }
  }

  // ── Type of Loss ──────────────────────────────────────────────────────────
  const lossTypeRaw = field("Type of Loss", "Type de sinistre", "Cause of Loss", "Cause", "Peril");
  if (lossTypeRaw) result.loss_type = lossTypeRaw.toLowerCase().trim();

  // ── Description of Loss and/or Instructions → notes ──────────────────────
  const descMatch = t.match(/Description of Loss[^\n]*:\s*\n+([\s\S]+?)(?:\n\s*\n(?:Coverage|View detailed|Policy Inception)|$)/i);
  if (descMatch?.[1]?.trim()) {
    result.notes = descMatch[1].trim().slice(0, 2000);
  }

  // ── DMS coordinates — best effort ────────────────────────────────────────
  // Format: "53º 34.29678' N, 113º 28.92942' W" but leading degree may be
  // on a different line. Try full DMS first, then partial.
  const dmsMatch = t.match(/(\d{1,3})º\s+(\d{1,2}\.?\d*)['']?\s*N[,\s]+(\d{1,3})º\s+(\d{1,2}\.?\d*)['']?\s*W/i);
  if (dmsMatch) {
    result.latitude = String(parseInt(dmsMatch[1]) + parseFloat(dmsMatch[2]) / 60);
    result.longitude = String(-(parseInt(dmsMatch[3]) + parseFloat(dmsMatch[4]) / 60));
  } else {
    // Only longitude available in decimal: ", 113.482157º W"
    const lngMatch = t.match(/[,\t\s](1[01]\d\.\d{3,})º\s*W/i);
    if (lngMatch) result.longitude = String(-parseFloat(lngMatch[1]));
  }

  return result;
}

// ── Backup JSON / CSV / TSV report parser ──────────────────────────────────
export function parseClaimNavigatorReport(text: string, filename: string): ParsedClaim[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  // Backup JSON format: bare array, or { claims: [...] } / { records: [...] }
  // Also handles our generated { schemaVersion, claims: [...] } format.
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      const claims = Array.isArray(parsed)
        ? parsed
        : Array.isArray((parsed as Record<string, unknown>)?.claims)
          ? (parsed as Record<string, unknown>).claims as unknown[]
          : Array.isArray((parsed as Record<string, unknown>)?.records)
            ? (parsed as Record<string, unknown>).records as unknown[]
            : null;
      if (claims) return claims.map((c) => normalizeRow((c ?? {}) as Record<string, unknown>));
    } catch {
      // Not valid JSON — fall through to CSV/TSV attempt.
    }
  }

  // CSV / TSV / semicolon / pipe-delimited with a header row.
  const firstLine = trimmed.split("\n")[0] ?? "";
  const looksTabular =
    /\.(csv|tsv)$/i.test(filename) ||
    /[,;\t|]/.test(firstLine) ||
    // Our generated CSV has a BOM + starts with "externalId" or "insuredName"
    /externalId|insuredName|claimNumber/i.test(firstLine);
  if (!looksTabular) return [];

  // Strip BOM if present
  const clean = trimmed.replace(/^\uFEFF/, "");
  const delimiter = [",", "\t", ";", "|"].find((d) => clean.includes(d)) ?? ",";
  const lines = splitCsvRows(clean, delimiter);
  if (lines.length < 2) return [];
  const headers = splitDelimitedLine(lines[0], delimiter).map(h => h.trim());

  const rows: ParsedClaim[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitDelimitedLine(lines[i], delimiter);
    const raw: Record<string, unknown> = {};
    headers.forEach((h, idx) => {
      const val = cells[idx]?.trim();
      if (val) raw[h] = val;
    });
    // normalizeRow handles camelCase + nested flattening + alias mapping
    const claim = normalizeRow(raw);
    if (claim.insured_name) rows.push(claim);
  }
  return rows;
}

/** Split a complete CSV/TSV text into rows, correctly handling quoted fields
 *  that contain embedded newlines (RFC 4180). */
function splitCsvRows(text: string, delimiter: string): string[] {
  if (delimiter !== ",") {
    // TSV/semicolon/pipe — these formats rarely embed newlines, simple split is fine
    return text.split(/\r?\n/).filter(l => l.trim().length > 0);
  }
  // For comma CSV, walk character by character to respect quoted newlines
  const rows: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      // Escaped quote ""
      if (inQuotes && text[i + 1] === '"') { cur += '"'; i++; continue; }
      inQuotes = !inQuotes;
      cur += ch;
    } else if ((ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) && !inQuotes) {
      if (ch === "\r") i++; // consume \n of \r\n
      if (cur.trim()) rows.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) rows.push(cur);
  return rows;
}

function splitDelimitedLine(line: string, delimiter: string): string[] {
  // Minimal quoted-field support — handles the common "value with, comma"
  // case in CSV exports without pulling in a full CSV parser dependency.
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // Escaped quote ""
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; continue; }
      inQuotes = !inQuotes;
      continue; // don't include the quote character itself
    }
    if (ch === delimiter && !inQuotes) { cells.push(cur); cur = ""; continue; }
    cur += ch;
  }
  cells.push(cur);
  return cells;
}
