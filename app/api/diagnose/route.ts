import { NextRequest, NextResponse } from "next/server";
import { getLanguage } from "@/lib/i18n";
import type { DiagnoseRequestBody, DiagnosisInput, HealthReport } from "@/lib/types";
import { runAnthropicDiagnosis } from "@/lib/anthropic";
import { runGeminiDiagnosis } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGES = 6;
const MAX_BASE64_LENGTH = 7_000_000; // roughly ~5MB image, base64-encoded

type AIProvider = "anthropic" | "gemini";

/**
 * Provider switch. Explicit AI_PROVIDER wins; otherwise Gemini is used whenever a
 * GEMINI_API_KEY is present (the free-tier path), falling back to Anthropic. Flip back to
 * Claude after the demo by setting AI_PROVIDER=anthropic or removing GEMINI_API_KEY.
 */
function resolveProvider(): AIProvider {
  const explicit = process.env.AI_PROVIDER?.toLowerCase();
  if (explicit === "gemini" || explicit === "anthropic") return explicit;
  return process.env.GEMINI_API_KEY ? "gemini" : "anthropic";
}

export async function POST(req: NextRequest) {
  let body: Partial<DiagnoseRequestBody>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const images = Array.isArray(body.images) ? body.images : [];
  const symptoms = typeof body.symptoms === "string" ? body.symptoms.trim() : "";
  const locality = typeof body.locality === "string" ? body.locality.trim() : "";
  const language = getLanguage(body.language);
  const priorHistory = Array.isArray(body.priorHistory) ? body.priorHistory : [];

  if (images.length === 0 && !symptoms) {
    return NextResponse.json(
      { error: "Please add at least one image or describe your symptoms." },
      { status: 400 }
    );
  }

  if (images.length > MAX_IMAGES) {
    return NextResponse.json(
      { error: `Please upload at most ${MAX_IMAGES} images at a time.` },
      { status: 400 }
    );
  }

  for (const img of images) {
    if (!img.base64 || img.base64.length > MAX_BASE64_LENGTH) {
      return NextResponse.json(
        { error: "One of the images is missing or too large (max ~5MB each)." },
        { status: 400 }
      );
    }
  }

  const input: DiagnosisInput = {
    images,
    symptoms,
    locality,
    languageName: language.promptName,
    priorHistory,
  };

  const provider = resolveProvider();

  try {
    let report: HealthReport | null;
    try {
      report = provider === "gemini" ? await runGeminiDiagnosis(input) : await runAnthropicDiagnosis(input);
    } catch (err) {
      // A missing/unset API key is a configuration problem worth surfacing verbatim.
      if (err instanceof Error && /API_KEY is not set/.test(err.message)) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
      // Same for a key the provider rejects — otherwise it looks like a generic outage.
      const status = (err as { status?: number }).status;
      if (status === 401 || status === 403) {
        const keyName = provider === "gemini" ? "GEMINI_API_KEY" : "ANTHROPIC_API_KEY";
        console.error(`Diagnose API auth error (${provider}):`, err);
        return NextResponse.json(
          { error: `The AI provider rejected the API key. Check ${keyName}.` },
          { status: 500 }
        );
      }
      throw err;
    }

    if (!report) {
      return NextResponse.json(
        { error: "The AI did not return a structured report. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ report });
  } catch (err) {
    console.error(`Diagnose API error (${provider}):`, err);
    return NextResponse.json(
      { error: "Something went wrong while analyzing your report. Please try again." },
      { status: 500 }
    );
  }
}
