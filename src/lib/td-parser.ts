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
  const t = text.replace(/\r\n/g, "\n");
  const result: ParsedClaim = {};

  // Insured name — catch all TD/Meloche bilingual label variations
  const namePatterns = [
    /(?:Insured\s*name|Nom\s*de\s*l['']assuré(?:e)?|Assuré(?:e)?|Claimant|Insured|Client|Policyholder)[:\s]+([^\n(]+)/i,
    /(?:Name\s*\/\s*Nom)[:\s]+([^\n(]+)/i,
  ];
  for (const p of namePatterns) {
    const m = t.match(p);
    if (m?.[1]?.trim().length > 1) {
      result.insured_name = m[1].trim().replace(/\s*\([A-Z]{2,4}\)\s*$/, "").replace(/[,.]$/, "").trim();
      break;
    }
  }
  if (!result.insured_name) return null;

  // Phone — any labeled phone number, then any phone
  const phonePatterns = [
    /(?:Mobile|Cell|Primary|Home|Principal|Maison|Cellulaire)[^\n]{0,25}?(\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4})/i,
    /(?:Phone|Telephone|Téléphone|Tel)[:\s]+(\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4})/i,
    /(\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4})/,
  ];
  for (const p of phonePatterns) {
    const m = t.match(p);
    if (m) {
      const d = m[1].replace(/\D/g, "");
      if (d.length === 10) { result.insured_phone = `+1${d}`; break; }
    }
  }

  // Email
  const emailMatch = t.match(/[\w.+\-]+@[\w\-]+\.[\w.\-]+/);
  if (emailMatch) result.insured_email = emailMatch[0];

  // Claim number — TD uses 8+ digits or "01-P1234567" format
  const claimPatterns = [
    /(?:Claim\s*(?:Number|#|No\.?)|File\s*Number|Numéro\s*(?:de\s*)?dossier|Dossier)[:\s#]+([A-Z0-9\-]{6,})/i,
    /\b(0[12]-[A-Z]\d{6,})\b/,
    /\b(\d{9,})\b/, // long digit sequence
  ];
  for (const p of claimPatterns) {
    const m = t.match(p);
    if (m) { result.claim_number = m[1].trim(); break; }
  }

  // Policy number
  const policyMatch = t.match(/(?:Policy\s*(?:Number|#|No\.?)|Numéro\s*de\s*police|Police)[:\s]+([A-Za-z0-9\-]{5,})/i);
  if (policyMatch) result.policy_number = policyMatch[1].trim();

  // Carrier / Insurance company
  const carrierMatch = t.match(/(?:Carrier|Company|Insurer|Compagnie|Assureur)[:\s]+([^\n]+)/i);
  if (carrierMatch) result.carrier = carrierMatch[1].trim();

  // Loss type (bilingual)
  const lossMatch = t.match(/(?:Type\s*of\s*[Ll]oss|Loss\s*type|Cause\s*(?:of\s*[Ll]oss)?|Peril|Type\s*de\s*sinistre|Nature)[:\s]+([^\n]+)/i);
  if (lossMatch) result.loss_type = lossMatch[1].trim();

  // Date of loss (multiple date formats: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY, Month DD YYYY)
  const dolPatterns = [
    /(?:Date\s*of\s*[Ll]oss|D\.O\.L|DOL|Date\s*du\s*sinistre)[:\s]+(\d{4}-\d{2}-\d{2})/i,
    /(?:Date\s*of\s*[Ll]oss|D\.O\.L|DOL|Date\s*du\s*sinistre)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(?:Date\s*of\s*[Ll]oss|D\.O\.L|DOL|Date\s*du\s*sinistre)[:\s]+([A-Z][a-z]+\s+\d{1,2},?\s*\d{4})/i,
  ];
  for (const p of dolPatterns) {
    const m = t.match(p);
    if (m) {
      const raw = m[1];
      if (/\d{4}-\d{2}-\d{2}/.test(raw)) { result.loss_date = raw; break; }
      const parts = raw.split(/[\/\-]/);
      if (parts.length === 3) {
        const y = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
        result.loss_date = `${y}-${parts[0].padStart(2,"0")}-${parts[1].padStart(2,"0")}`;
      }
      break;
    }
  }

  // Dates: contacted, inspected
  const contactedMatch = t.match(/(?:Date\s*contacted|Date\s*contacté)[:\s]+(\d{4}-\d{2}-\d{2})/i);
  if (contactedMatch) result.date_contacted = contactedMatch[1];
  const inspectedMatch = t.match(/(?:Date\s*inspected|Date\s*inspectée?)[:\s]+(\d{4}-\d{2}-\d{2})/i);
  if (inspectedMatch) result.date_inspected = inspectedMatch[1];

  // Search/Loss/Property address
  const addrPatterns = [
    /(?:Search\s*address|Loss\s*address|Property\s*address|Adresse\s*(?:du\s*sinistre|de\s*la\s*propriété|de\s*perte)?)[:\s]+([^\n]+)/i,
    /(?:Loss\s*location|Emplacement\s*du\s*sinistre)[:\s]+([^\n]+)/i,
  ];
  for (const p of addrPatterns) {
    const m = t.match(p);
    if (m) {
      let addr = m[1].trim()
        .replace(/\s*https?:\/\/\S+/gi, "")
        .replace(/\s*\(Google Maps[^)]*\)/gi, "")
        .replace(/\s*\(MapQuest[^)]*\)/gi, "")
        .replace(/\s*\(Bing Maps[^)]*\)/gi, "")
        .replace(/\s*\|.*$/, "")
        .trim();
      if (addr) { result.formatted_address = addr; break; }
    }
  }

  // Individual address fields
  const streetMatch = t.match(/^Street[:\s]+([^\n]+)/im);
  if (streetMatch) result.street = streetMatch[1].trim();
  const cityMatch = t.match(/^City[:\s]+([^\n]+)/im);
  if (cityMatch) result.city = cityMatch[1].trim();
  const provinceMatch = t.match(/^Province[:\s]+([^\n]+)/im);
  if (provinceMatch) result.province = provinceMatch[1].trim();
  const postalMatch = t.match(/(?:Postal\s*[Cc]ode|Code\s*postal)[:\s]+([A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d)/i)
    ?? t.match(/\b([A-Z]\d[A-Z]\s?\d[A-Z]\d)\b/i);
  if (postalMatch) result.postal_code = postalMatch[1].toUpperCase().replace(/(.{3})(.{3})/, "$1 $2");

  // CAT / event codes
  const catMatch = t.match(/(?:CAT\s*(?:Code|Name|#)?|Event\s*Code|Code\s*CAT)[:\s]+([A-Za-z0-9\-]{2,15})/i);
  if (catMatch) result.cat_code = catMatch[1].trim();

  // Deductible
  const dedMatch = t.match(/(?:Deductible|Franchise)[:\s$]*\$?([\d,]+)/i);
  if (dedMatch) result.deductible = dedMatch[1].replace(/,/g, "");

  // XA / Xactanalysis ID
  const xaMatch = t.match(/(?:XA\s*Id|Xact(?:analysis)?\s*ID?|XA)[:\s]+([A-Za-z0-9\-]+)/i);
  if (xaMatch) result.xa_id = xaMatch[1].trim();

  const statusMatch = t.match(/(?:Current\s*status|Statut)[:\s]+([^\n]+)/i);
  if (statusMatch) result.status = statusMatch[1].trim();

  const notesMatch = t.match(/NOTES[^\n]*\n([\s\S]+?)(?:\n\s*\n[A-Z][a-z]+ Information:|$)/i);
  if (notesMatch) result.notes = notesMatch[1].trim().slice(0, 2000);

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
