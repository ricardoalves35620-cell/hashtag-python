import { parseTdEmail } from "../../src/lib/td-parser";
import { requireAuth, type AuthEnv } from "./_auth";

interface Env extends AuthEnv {
  ANTHROPIC_API_KEY?: string;
  GOOGLE_VISION_API_KEY?: string;
  GOOGLE_MAPS_API_KEY?: string;
}

const LOSS_TYPE_MAP: Record<string, string> = {
  SEWAGE: "sewage_backup", SEWER: "sewage_backup", BACKUP: "sewage_backup",
  FLOOD: "water", WATER: "water", OVERFLOW: "water", LEAK: "water",
  FIRE: "fire", SMOKE: "fire",
  WIND: "wind_hail", HAIL: "wind_hail", HURRICANE: "wind_hail", STORM: "wind_hail",
  THEFT: "theft", BURGLARY: "theft",
  VANDALISM: "vandalism", MALICIOUS: "vandalism",
  VEHICLE: "vehicle_impact",
  EARTHQUAKE: "earthquake",
  FROZEN: "frozen_pipes", ICE: "frozen_pipes",
  MOLD: "mold", MOULD: "mold",
  GLASS: "glass_breakage",
};

function normalizeLossType(raw: string | undefined): string | null {
  if (!raw) return null;
  const upper = raw.toUpperCase();
  for (const [k, v] of Object.entries(LOSS_TYPE_MAP)) {
    if (upper.includes(k)) return v;
  }
  return "other";
}

type ExtractItem = { kind: string; text?: string; dataUrl?: string; filename?: string };

// ── Google Cloud Vision OCR ──────────────────────────────────────────────────
async function ocrWithGoogleVision(dataUrl: string, apiKey: string): Promise<{ text: string | null; error: string | null }> {
  const base64 = dataUrl.split(",")[1];
  if (!base64) return { text: null, error: "No base64 data" };

  try {
    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [{
            image: { content: base64 },
            features: [{ type: "DOCUMENT_TEXT_DETECTION", maxResults: 1 }],
            imageContext: { languageHints: ["en", "fr"] },
          }],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return { text: null, error: `Vision API HTTP ${res.status}: ${err.slice(0, 200)}` };
    }

    const data = await res.json() as {
      responses?: Array<{
        fullTextAnnotation?: { text?: string };
        error?: { message: string };
      }>;
    };

    const response = data.responses?.[0];
    if (response?.error) {
      return { text: null, error: response.error.message };
    }

    return { text: response?.fullTextAnnotation?.text ?? null, error: null };
  } catch (err) {
    return { text: null, error: String(err) };
  }
}

// ── Manual field extraction from OCR text ───────────────────────────────────
function extractFieldsFromOCRText(text: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const t = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Insured name — TD emails use various labels
  const namePatterns = [
    /(?:Insured|Claimant|Client|Assuré|Name)[:\s]+([A-ZÀ-Ÿa-zà-ÿ][A-ZÀ-Ÿa-zà-ÿ\s\-\',.]+?)(?:\s*\n|\s*\(|\s*Phone|\s*Tel)/i,
    /(?:Insured Name|Nom de l'assuré)[:\s]+(.+)/i,
    /(?:Name of Insured)[:\s]+(.+)/i,
  ];
  for (const p of namePatterns) {
    const m = t.match(p);
    if (m?.[1]?.trim().length > 2) {
      result.insured_name = m[1].trim().replace(/\s*\(GEN\d*\)\s*$/i, "").replace(/[,.]$/, "");
      break;
    }
  }

  // Phone — TD uses "Primary Phone:" pattern
  const phonePatterns = [
    /(?:Primary|Home|Cell|Mobile|Phone)[^:\n]*:[^\n]*([\(\d][\d\s\(\)\-\.]{7,})/i,
    /(?:Telephone|Tel)[:\s]+([\(\d][\d\s\(\)\-\.]{7,})/i,
    /((?:\+1)?[\s\-]?\(?[2-9]\d{2}\)?[\s\-]\d{3}[\s\-]\d{4})/,
  ];
  for (const p of phonePatterns) {
    const m = t.match(p);
    if (m) {
      const raw = m[1].replace(/\D/g, "");
      if (raw.length >= 10) { result.insured_phone = `+1${raw.slice(-10)}`; break; }
    }
  }

  // Claim number — TD format: "01-P1234567" or 8+ digit
  const claimPatterns = [
    /(?:Claim\s*(?:Number|#|No\.?)|File\s*(?:Number|#)|Dossier)[:\s#]+([A-Z0-9\-]{6,})/i,
    /\b(0[12]-[A-Z]\d{6,})\b/,
    /(?:Claim)[:\s]+(\d{8,})/i,
  ];
  for (const p of claimPatterns) {
    const m = t.match(p);
    if (m) { result.claim_number = m[1].trim(); break; }
  }

  // Policy number
  const policyMatch = t.match(/(?:Policy\s*(?:Number|#|No\.?)|Polic[ey])[:\s]+([A-Z0-9\-]{5,})/i);
  if (policyMatch) result.policy_number = policyMatch[1].trim();

  // CAT code
  const catMatch = t.match(/CAT\s*(?:Code|#)?[:\s]*([A-Z0-9\-]{2,10})/i);
  if (catMatch) result.cat_code = catMatch[1].trim();

  // Deductible
  const dedMatch = t.match(/(?:Deductible|Franchise)[:\s$]*\$?([\d,]+)/i);
  if (dedMatch) result.deductible = dedMatch[1].replace(/,/g, "");

  // XA ID
  const xaMatch = t.match(/(?:XA|Adjuster\s*ID|Adjustor)[:\s]+([A-Z0-9\-]{3,})/i);
  if (xaMatch) result.xa_id = xaMatch[1].trim();

  // Date of loss
  const dateMatch = t.match(/(?:Date of Loss|Date de sinistre|D\.O\.L|DOL)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
  if (dateMatch) {
    const parts = dateMatch[1].split(/[\/\-]/);
    if (parts.length === 3) {
      const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
      result.loss_date = `${year}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
    }
  }

  // Loss type
  const lossMatch = t.match(/(?:Type of Loss|Cause of Loss|Cause|Peril|Nature du sinistre)[:\s]+([^\n]+)/i);
  if (lossMatch) result.loss_type = normalizeLossType(lossMatch[1]) ?? "other";

  // Postal code — Canadian format, anchor for address
  const postalMatch = t.match(/\b([A-Z]\d[A-Z]\s*\d[A-Z]\d)\b/i);
  if (postalMatch) {
    result.postal_code = postalMatch[1].toUpperCase().replace(/(.{3})(.{3})/, "$1 $2");
    const idx = t.indexOf(postalMatch[1]);
    const before = t.slice(Math.max(0, idx - 300), idx);
    const lines = before.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length > 2 && !/^(?:Insured|Name|Phone|Email|Claim|Policy|Date|CAT|Type)/i.test(l));
    if (lines.length >= 1) {
      result.city = lines[lines.length - 1].replace(/,.*$/, "").trim();
      if (lines.length >= 2) result.street = lines[lines.length - 2].trim();
      const provMatch = t.match(/\b(QC|ON|BC|AB|SK|MB|NB|NS|PE|NL|NT|NU|YT)\b/i);
      result.province = provMatch?.[1]?.toUpperCase() ?? "QC";
      result.formatted_address = [result.street, result.city, result.province, result.postal_code]
        .filter(Boolean).join(", ");
    }
  }

  // Email
  const emailMatch = t.match(/\b([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})\b/);
  if (emailMatch) result.insured_email = emailMatch[1];

  // ── GPS coordinates from Google Maps URL ────────────────────────────────
  // TD emails contain a Google Maps link with the loss property coordinates.
  // Extracting these directly is more accurate than geocoding the address.
  const coordUrl =
    t.match(/maps\.google\.com[^\s"'<>]*[?&]q=([-\d.]{4,}),([-\d.]{4,})/i) ??
    t.match(/google\.com\/maps[^\s"'<>]*query=([-\d.]{4,}),([-\d.]{4,})/i) ??
    t.match(/google\.com\/maps[^\s"'<>]*@([-\d.]{4,}),([-\d.]{4,})/i);
  if (coordUrl) {
    result.latitude = parseFloat(coordUrl[1]);
    result.longitude = parseFloat(coordUrl[2]);
  } else {
    // Bare coordinate pair near address block
    const coordBare = t.match(/\b(4[0-7]\.\d{3,}),\s*([-]?[7-9]\d\.\d{3,})\b/);
    if (coordBare) {
      result.latitude = parseFloat(coordBare[1]);
      result.longitude = parseFloat(coordBare[2]);
    }
  }
}
  return result;
}

// ── Anthropic extraction — TD Insurance specific prompt ──────────────────────
async function extractWithAnthropic(items: ExtractItem[], apiKey: string): Promise<Response> {
  const userContent: unknown[] = [{
    type: "text",
    text: `You are extracting insurance claim data from a TD Insurance (or Meloche Monnex / Primmum) assignment notification email, which may be in English, French, or bilingual.

Common field labels in these emails:
- Insured name / Nom de l'assuré(e) / Assuré(e) / Claimant
- Claim number / Numéro de dossier / Claim # (often 8-13 digits, or format like 01-P1234567)
- Policy number / Numéro de police
- Carrier / Compagnie / Insurer (e.g. TD Insurance, Primmum, Meloche Monnex)
- Search address / Loss address / Adresse du sinistre / Property address
- Date of loss / Date du sinistre / D.O.L
- Type of loss / Cause of loss / Type de sinistre (water, fire, wind, theft, etc.)
- Deductible / Franchise (dollar amount)
- CAT Code / Code CAT / Event code
- XA Id / Xactanalysis ID
- Phone / Telephone / Mobile / Primary (10-digit Canadian number)
- Email address of insured

CRITICAL: Extract EVERY field you can find. Do not leave fields null if the value is visible.
For phone numbers, format as +1XXXXXXXXXX (10 digits after +1).
For dates, use YYYY-MM-DD format.
For province, use 2-letter code (ON, QC, BC, AB, etc.).
For postal code, use Canadian format like "L1K 1M2".
For carrier: if you see TD Insurance, Primmum, Meloche Monnex, capture it exactly.

Return ONLY a valid JSON object with these exact keys (null if not found):
insured_name, insured_phone, insured_email, claim_number, policy_number,
carrier, cat_code, deductible, xa_id,
loss_type (use: fire/water/wind_hail/theft/vandalism/vehicle_impact/earthquake/frozen_pipes/sewage_backup/mold/glass_breakage/other),
loss_date, date_contacted, date_inspected,
street, city, province, postal_code, formatted_address,
status (new/to_call/scheduled/inspected/closed/cancelled), notes.

No markdown, no explanation, just the JSON object.`
  }];

  for (const item of items) {
    if (item.kind === "image" && item.dataUrl) {
      const [meta, b64] = item.dataUrl.split(",");
      const rawType = meta?.match(/data:([^;]+)/)?.[1] ?? "image/jpeg";
      const mtype = (rawType === "image/heic" || rawType === "image/heif") ? "image/jpeg" : rawType;
      userContent.push({ type: "image", source: { type: "base64", media_type: mtype, data: b64 } });
    }
    if (item.kind === "pdf" && item.dataUrl) {
      const [meta, b64] = item.dataUrl.split(",");
      const mtype = meta?.match(/data:([^;]+)/)?.[1] ?? "application/pdf";
      userContent.push({ type: "document", source: { type: "base64", media_type: mtype, data: b64 } });
    }
    if (item.kind === "text" && item.text) {
      userContent.push({ type: "text", text: `Email content:\n${item.text}` });
    }
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 2000, messages: [{ role: "user", content: userContent }] }),
  });

  const data = await res.json() as { content?: Array<{ text?: string }>; error?: { message: string } };
  if (data.error) return Response.json({ error: data.error.message }, { status: 500 });

  const raw = data.content?.[0]?.text ?? "{}";
  const clean = raw.replace(/\`\`\`json|\`\`\`/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  const parsed = match ? JSON.parse(match[0]) : {};
  if (!parsed.carrier) parsed.carrier = "TD Insurance";
  return Response.json({ ...parsed, _source: "anthropic" });
}
// ── Main handler ─────────────────────────────────────────────────────────────
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const authError = await requireAuth(request, env);
  if (authError) return authError;

  try {
    const body = await request.json() as unknown;

    let items: ExtractItem[];
    if (Array.isArray(body)) {
      items = body as ExtractItem[];
    } else if (body && typeof body === "object" && "items" in body && Array.isArray((body as { items: unknown }).items)) {
      items = (body as { items: ExtractItem[] }).items;
    } else if (body && typeof body === "object" && "kind" in body) {
      items = [body as ExtractItem];
    } else {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!items.length) return Response.json({ error: "No items provided" }, { status: 400 });

    // ── 1. TD email text parser — instant, free, most accurate ──────────────
    for (const item of items) {
      if (item.kind !== "text" || !item.text) continue;
      const result = parseTdEmail(item.text);
      if (result?.insured_name) {
        if (result.loss_type) result.loss_type = normalizeLossType(result.loss_type) ?? result.loss_type;
        return Response.json({ ...result, carrier: result.carrier ?? "TD Insurance", _source: "td_parser" });
      }
    }

    const imageItems = items.filter(i => i.kind === "image" && i.dataUrl);
    const pdfItems = items.filter(i => i.kind === "pdf" && i.dataUrl);

    // ── 2. Google Vision OCR — free 1000/month, no Anthropic needed ─────────
    const visionKey = env.GOOGLE_VISION_API_KEY; // Must be set separately from Maps key
    if (imageItems.length > 0 && visionKey) {
      const ocrTexts: string[] = [];
      const ocrErrors: string[] = [];

      for (const item of imageItems) {
        const { text, error } = await ocrWithGoogleVision(item.dataUrl!, visionKey);
        if (text) ocrTexts.push(text);
        if (error) ocrErrors.push(error);
      }

      const combinedText = ocrTexts.join("\n\n");

      if (combinedText.trim()) {
        // Try TD regex parser on OCR text first
        const tdResult = parseTdEmail(combinedText);
        if (tdResult?.insured_name) {
          if (tdResult.loss_type) tdResult.loss_type = normalizeLossType(tdResult.loss_type) ?? tdResult.loss_type;
          return Response.json({ ...tdResult, carrier: tdResult.carrier ?? "TD Insurance", _source: "vision_td_parser" });
        }

        // Manual field extraction
        const extracted = extractFieldsFromOCRText(combinedText);
        if (extracted.insured_name || extracted.claim_number) {
          return Response.json({ ...extracted, carrier: "TD Insurance", _source: "vision_manual" });
        }

        // Regex failed — try Anthropic with image + OCR text as context
        const anthropicKey = env.ANTHROPIC_API_KEY;
        if (anthropicKey) {
          // Inject OCR text as context alongside the image for better accuracy
          const itemsWithContext: ExtractItem[] = [
            { kind: "text", text: `OCR text extracted from image:\n${combinedText}` },
            ...imageItems,
          ];
          return extractWithAnthropic(itemsWithContext, anthropicKey);
        }

        // No Anthropic key — surface raw OCR so user can fill manually
        return Response.json({
          carrier: "TD Insurance",
          notes: combinedText.slice(0, 2000),
          _source: "vision_raw",
        });
      }

      // Vision had errors
      if (ocrErrors.length > 0) {
        return Response.json({
          error: `Google Vision error: ${ocrErrors[0]}. Check that Cloud Vision API is enabled at console.cloud.google.com.`,
        }, { status: 422 });
      }

      return Response.json({ error: "Google Vision returned no text. Try a clearer photo." }, { status: 422 });
    }

    // ── 3. Anthropic — images if Google Vision key NOT configured, or PDFs
    //      always (Vision API doesn't OCR PDFs, only images) ────────────────
    if ((imageItems.length > 0 && !visionKey) || pdfItems.length > 0) {
      if (!env.ANTHROPIC_API_KEY) {
        return Response.json({ error: "ANTHROPIC_API_KEY not configured. Add it in Cloudflare Pages → Settings → Environment variables." }, { status: 422 });
      }
      return await extractWithAnthropic([...imageItems, ...pdfItems], env.ANTHROPIC_API_KEY);
    }

    // No keys configured
    if (imageItems.length > 0) {
      return Response.json({
        error: "GOOGLE_VISION_API_KEY not configured. Add it in Cloudflare Pages → Settings → Environment variables.",
      }, { status: 422 });
    }

    return Response.json({ error: "No extractable content found." }, { status: 422 });

  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
};
