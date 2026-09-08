import type { HealthReport } from "@/lib/types";
import { buildOfflineHealthAnalysisPrompt } from "@/lib/prompts";
import { t, getLanguage, type LanguageCode } from "@/lib/i18n";

/** Fixed, small instruct model — chosen for demo-safe download size over raw capability. */
export const OFFLINE_MODEL_ID = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
export const OFFLINE_MODEL_SIZE_LABEL = "~880 MB";

export function isWebGPUSupported(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

// The full @mlc-ai/web-llm package (and the WebGPU runtime it drives) is loaded lazily,
// only once the user explicitly opts into Offline Mode — never on initial page load.
type WebLLMModule = typeof import("@mlc-ai/web-llm");
type MLCEngine = import("@mlc-ai/web-llm").MLCEngine;

let modulePromise: Promise<WebLLMModule> | null = null;
function loadWebLLM(): Promise<WebLLMModule> {
  if (!modulePromise) modulePromise = import("@mlc-ai/web-llm");
  return modulePromise;
}

let enginePromise: Promise<MLCEngine> | null = null;

export async function isModelDownloaded(): Promise<boolean> {
  if (!isWebGPUSupported()) return false;
  try {
    const webllm = await loadWebLLM();
    return await webllm.hasModelInCache(OFFLINE_MODEL_ID);
  } catch {
    return false;
  }
}

/** Explicit, user-triggered download only — never called automatically. */
export async function downloadModel(onProgress: (progress: number, text: string) => void): Promise<void> {
  const webllm = await loadWebLLM();
  enginePromise = webllm.CreateMLCEngine(OFFLINE_MODEL_ID, {
    initProgressCallback: (report) => onProgress(report.progress, report.text),
  });
  await enginePromise;
}

export async function deleteModel(): Promise<void> {
  const webllm = await loadWebLLM();
  await webllm.deleteModelAllInfoInCache(OFFLINE_MODEL_ID);
  enginePromise = null;
}

async function getEngine(): Promise<MLCEngine> {
  if (!enginePromise) {
    const webllm = await loadWebLLM();
    // Resolves near-instantly if the model is already cached from an earlier download.
    enginePromise = webllm.CreateMLCEngine(OFFLINE_MODEL_ID);
  }
  return enginePromise;
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function asConditions(v: unknown): { name: string; explanation: string }[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map((x) => ({ name: asString(x.name, "—"), explanation: asString(x.explanation) }));
}

function buildFallbackReport(language: LanguageCode, rawText: string): HealthReport {
  return {
    summary: rawText || t(language, "offlineFallbackNoResponse"),
    isEmergency: false,
    redFlags: [],
    possibleConditions: [],
    emergencyAdvice: [],
    recommendedTreatment: [t(language, "offlineGenericTreatmentLine")],
    homeRemedies: [],
    suggestedRoutine: [],
    medicinesToBuy: [],
    nearbyPharmacies: [],
    recommendedSpecialty: "",
    nearbyDoctors: [],
    nextSteps: [t(language, "offlineSafetyNetLine"), t(language, "offlineTryAgainOnline")],
    disclaimer: t(language, "offlineDisclaimerFallback"),
    source: "offline",
  };
}

/**
 * Runs offline symptom triage entirely on-device via WebLLM. This function's signature
 * has NO images parameter at all — a compile-time guarantee, not just a UI/prompt
 * convention, that a photo can never reach the on-device model. Doctors, pharmacies,
 * specialties, and specific medicines are hard-coded empty below regardless of what the
 * model outputs, and a fixed, non-model safety line is always prepended to nextSteps
 * regardless of the model's own isEmergency judgment — small local models are less
 * reliable at flagging emergencies than Claude, so the app's safety scaffolding must not
 * depend on it getting that call right.
 */
export async function runOfflineDiagnosis(params: {
  symptomsText: string;
  language: LanguageCode;
}): Promise<HealthReport> {
  const { symptomsText, language } = params;
  const engine = await getEngine();
  const system = buildOfflineHealthAnalysisPrompt(getLanguage(language).promptName);

  const completion = await engine.chat.completions.create({
    messages: [
      { role: "system", content: system },
      { role: "user", content: symptomsText || "(no symptoms described)" },
    ],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return buildFallbackReport(language, raw);
  }

  const isEmergency = parsed.isEmergency === true;
  const possibleConditions = asConditions(parsed.possibleConditions).map((c) => ({
    ...c,
    // The model isn't asked for, or trusted with, confidence calibration — a fixed
    // neutral value avoids implying a precision the model doesn't have.
    likelihood: "moderate" as const,
  }));

  return {
    summary: asString(parsed.summary, raw.slice(0, 300)),
    isEmergency,
    redFlags: asStringArray(parsed.redFlags),
    possibleConditions,
    emergencyAdvice: isEmergency
      ? [t(language, "offlineEmergencyCallLine"), t(language, "offlineSafetyNetLine")]
      : [],
    recommendedTreatment: [t(language, "offlineGenericTreatmentLine")],
    homeRemedies: asStringArray(parsed.homeRemedies),
    suggestedRoutine: asStringArray(parsed.suggestedRoutine),
    medicinesToBuy: [],
    nearbyPharmacies: [],
    recommendedSpecialty: "",
    nearbyDoctors: [],
    nextSteps: [t(language, "offlineSafetyNetLine"), ...asStringArray(parsed.nextSteps)],
    disclaimer: asString(parsed.disclaimer, t(language, "offlineDisclaimerFallback")),
    source: "offline",
  };
}
