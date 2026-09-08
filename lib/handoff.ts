import type { HandoffPayload, HealthReport, NearbyDoctor, PossibleCondition, Likelihood } from "@/lib/types";

const MAX_SUMMARY_CHARS = 400;
const MAX_CONDITIONS = 3;
const MAX_LIST_ITEMS = 4;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Builds the condensed, URL-shippable slice of a report that becomes the "handoff" a
 * doctor actually opens. Deliberately small — the whole payload lives in a query string,
 * so it must stay well under typical URL-length limits even for long AI-generated text.
 */
export function buildHandoffPayload(params: {
  report: HealthReport;
  patientName: string;
  language: string;
  locality: string;
  doctor: NearbyDoctor | null;
  slotLabel: string;
}): HandoffPayload {
  const { report, patientName, language, locality, doctor, slotLabel } = params;
  return {
    v: 1,
    patientName: patientName || "Patient",
    language,
    locality,
    isEmergency: report.isEmergency,
    summary: truncate(report.summary, MAX_SUMMARY_CHARS),
    redFlags: report.redFlags.slice(0, MAX_LIST_ITEMS),
    possibleConditions: report.possibleConditions.slice(0, MAX_CONDITIONS),
    recommendedTreatment: report.recommendedTreatment.slice(0, MAX_LIST_ITEMS),
    nextSteps: report.nextSteps.slice(0, MAX_LIST_ITEMS),
    requestedSpecialty: report.recommendedSpecialty,
    doctorName: doctor?.name ?? "",
    doctorNote: doctor?.note ?? "",
    slotLabel,
    createdAt: new Date().toISOString(),
    disclaimer: report.disclaimer,
    source: report.source ?? "cloud",
  };
}

export function encodeHandoffPayload(payload: HandoffPayload): string {
  return encodeURIComponent(JSON.stringify(payload));
}

const LIKELIHOODS: Likelihood[] = ["low", "moderate", "high"];

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asConditions(value: unknown): PossibleCondition[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      name: asString(item.name, "Unknown"),
      likelihood: LIKELIHOODS.includes(item.likelihood as Likelihood) ? (item.likelihood as Likelihood) : "low",
      explanation: asString(item.explanation),
    }));
}

/**
 * Decodes a `?d=` handoff query param defensively: this is the one artifact a real
 * doctor is expected to open, possibly after it's been copy-pasted, retyped, or
 * truncated by an SMS app's character limit — a malformed shape must fall back to
 * the "invalid link" state, never crash the page.
 */
export function decodeHandoffPayload(raw: string | null): HandoffPayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (!parsed || typeof parsed !== "object" || parsed.v !== 1) return null;

    return {
      v: 1,
      patientName: asString(parsed.patientName, "Patient"),
      language: asString(parsed.language, "en"),
      locality: asString(parsed.locality),
      isEmergency: parsed.isEmergency === true,
      summary: asString(parsed.summary),
      redFlags: asStringArray(parsed.redFlags),
      possibleConditions: asConditions(parsed.possibleConditions),
      recommendedTreatment: asStringArray(parsed.recommendedTreatment),
      nextSteps: asStringArray(parsed.nextSteps),
      requestedSpecialty: asString(parsed.requestedSpecialty),
      doctorName: asString(parsed.doctorName),
      doctorNote: asString(parsed.doctorNote),
      slotLabel: asString(parsed.slotLabel),
      createdAt: asString(parsed.createdAt),
      disclaimer: asString(parsed.disclaimer),
      source: parsed.source === "offline" ? "offline" : "cloud",
    };
  } catch {
    return null;
  }
}

export function buildHandoffUrl(payload: HandoffPayload): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/handoff?d=${encodeHandoffPayload(payload)}`;
}
