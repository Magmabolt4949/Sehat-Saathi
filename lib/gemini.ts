import { GoogleGenAI, type Part } from "@google/genai";
import type { DiagnosisInput, HealthReport, Likelihood } from "@/lib/types";
import { buildGeminiHealthAnalysisPrompt, formatPriorHistory } from "@/lib/prompts";
import { HEALTH_REPORT_JSON_SCHEMA } from "@/lib/reportSchema";

/**
 * Free-tier provider. `gemini-2.5-flash` is free of charge on the Gemini API free tier, and
 * Google Search grounding is free up to 500 requests/day (verified against the pricing page)
 * — comfortably enough for a demo. Override with GEMINI_MODEL if needed.
 */
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not set. Get a free key at aistudio.google.com/apikey and add it to .env.local."
      );
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

/**
 * Step A — a grounded Google search for real nearby pharmacies and doctors, returned as
 * plain text (plus the grounding sources). Runs only when a locality was given. Fails soft:
 * any error yields "", and the analysis step then leaves the entity arrays empty, which the
 * UI already renders as a generic Maps-search fallback. The analysis step never gets a
 * search tool of its own, so the only entities it can ever name are the ones in this text.
 */
export async function searchNearbyWithGemini(locality: string): Promise<string> {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Use Google Search to find real, currently-operating businesses in or near "${locality}", India, and list them as plain text in two sections:

PHARMACIES — 3 to 5 general pharmacies or medical stores.
DOCTORS — 4 to 6 doctors or clinics: general physicians and multi-specialty clinics, plus common specialists (dermatology, cardiology, orthopedics, pediatrics) where you find them.

For each entry give: the exact business/doctor name as it appears in the search results, the type or specialty, and a phone number ONLY if one appears verbatim in a search result (otherwise write "phone: not listed"). Do not invent, guess, or fill in anything you did not actually find. If you find nothing reliable for a section, write "none found" under it.`,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    const text = response.text?.trim() ?? "";
    if (!text) return "";

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources = chunks
      .map((c) => c.web)
      .filter((w): w is NonNullable<typeof w> => !!w && !!(w.title || w.uri))
      .slice(0, 12)
      .map((w) => `- ${w.title ?? ""}${w.uri ? ` — ${w.uri}` : ""}`);

    return sources.length > 0 ? `${text}\n\nSources:\n${sources.join("\n")}` : text;
  } catch (err) {
    console.error("Gemini grounded search failed (continuing without nearby results):", err);
    return "";
  }
}

// --- defensive normalization of the model's JSON ---------------------------------------

const LIKELIHOODS: Likelihood[] = ["low", "moderate", "high"];

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function asObjects(v: unknown): Record<string, unknown>[] {
  return Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === "object") : [];
}

function stripFences(text: string): string {
  const m = text.match(/^\s*```(?:json)?\s*([\s\S]*?)\s*```\s*$/i);
  return m ? m[1] : text;
}

/**
 * JSON mode with a schema makes malformed output unlikely, but the report is health advice —
 * every field is still individually coerced so a surprising shape degrades to an empty
 * list/string rather than a crash or a mis-typed value reaching the UI.
 */
function normalizeHealthReport(raw: unknown): HealthReport | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const summary = asString(r.summary);
  if (!summary) return null;

  return {
    summary,
    isEmergency: r.isEmergency === true,
    redFlags: asStringArray(r.redFlags),
    possibleConditions: asObjects(r.possibleConditions).map((c) => ({
      name: asString(c.name, "—"),
      likelihood: LIKELIHOODS.includes(c.likelihood as Likelihood) ? (c.likelihood as Likelihood) : "low",
      explanation: asString(c.explanation),
    })),
    emergencyAdvice: asStringArray(r.emergencyAdvice),
    recommendedTreatment: asStringArray(r.recommendedTreatment),
    homeRemedies: asStringArray(r.homeRemedies),
    suggestedRoutine: asStringArray(r.suggestedRoutine),
    medicinesToBuy: asStringArray(r.medicinesToBuy),
    nearbyPharmacies: asObjects(r.nearbyPharmacies)
      .map((p) => ({ name: asString(p.name), note: asString(p.note) }))
      .filter((p) => p.name),
    recommendedSpecialty: asString(r.recommendedSpecialty),
    nearbyDoctors: asObjects(r.nearbyDoctors)
      .map((d) => ({
        name: asString(d.name),
        specialty: asString(d.specialty),
        note: asString(d.note),
        phone: asString(d.phone),
      }))
      .filter((d) => d.name),
    nextSteps: asStringArray(r.nextSteps),
    disclaimer: asString(r.disclaimer),
    source: "cloud",
  };
}

/**
 * Step B — the multimodal analysis, in JSON mode against the shared report schema. No tools
 * are attached: real-world entities can only come from the SEARCH RESULTS text produced by
 * step A, which is what keeps the never-invent rule enforceable with this provider.
 */
export async function runGeminiDiagnosis(input: DiagnosisInput): Promise<HealthReport | null> {
  const { images, symptoms, locality, languageName, priorHistory } = input;
  const ai = getGeminiClient();

  const searchResults = locality ? await searchNearbyWithGemini(locality) : "";

  const parts: Part[] = [];
  for (const img of images) {
    parts.push({ inlineData: { mimeType: img.mediaType, data: img.base64 } });
    parts.push({ text: `The image above is labeled: ${img.label}` });
  }
  parts.push({
    text: symptoms
      ? `Patient-reported symptoms / description: ${symptoms}`
      : "No additional symptom text was provided; rely on the images alone.",
  });
  parts.push({ text: locality ? `Patient's locality: ${locality}` : "No locality was provided." });
  if (priorHistory.length > 0) parts.push({ text: formatPriorHistory(priorHistory) });

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: parts,
    config: {
      systemInstruction: buildGeminiHealthAnalysisPrompt(languageName, locality, searchResults),
      responseMimeType: "application/json",
      responseJsonSchema: HEALTH_REPORT_JSON_SCHEMA,
      temperature: 0.4,
      maxOutputTokens: 8192,
    },
  });

  const text = response.text;
  if (!text) return null;

  try {
    return normalizeHealthReport(JSON.parse(stripFences(text)));
  } catch {
    console.error("Gemini returned non-JSON report output:", text.slice(0, 300));
    return null;
  }
}
