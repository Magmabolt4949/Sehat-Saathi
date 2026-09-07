import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicClient, DIAGNOSIS_MODEL } from "@/lib/anthropic";
import { buildHealthAnalysisSystemPrompt } from "@/lib/prompts";
import { getLanguage } from "@/lib/i18n";
import type { DiagnoseRequestBody, HealthReport } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGES = 6;
const MAX_BASE64_LENGTH = 7_000_000; // roughly ~5MB image, base64-encoded
const MAX_LOOP_ITERATIONS = 4;

const reportTool: Anthropic.Tool = {
  name: "provide_health_report",
  description:
    "Provide a structured, assistive (non-diagnostic) health report based on uploaded medical images/scans, prescription photos, and reported symptoms.",
  input_schema: {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "Plain-language summary of what the images/symptoms may indicate, 2-4 sentences.",
      },
      isEmergency: {
        type: "boolean",
        description: "True if any plausible red-flag emergency signs are present.",
      },
      redFlags: {
        type: "array",
        items: { type: "string" },
        description: "Specific concerning signs observed, if any. Empty array if none.",
      },
      possibleConditions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            likelihood: { type: "string", enum: ["low", "moderate", "high"] },
            explanation: { type: "string" },
          },
          required: ["name", "likelihood", "explanation"],
        },
      },
      emergencyAdvice: {
        type: "array",
        items: { type: "string" },
        description:
          "Immediate actions using things available at home, only if safe and generic. First item must be to call emergency services when isEmergency is true.",
      },
      recommendedTreatment: {
        type: "array",
        items: { type: "string" },
        description: "General description of what proper medical treatment/evaluation typically involves.",
      },
      medicinesToBuy: {
        type: "array",
        items: { type: "string" },
        description: "Specific OTC product/medicine names to look for at a pharmacy, as printed on packaging.",
      },
      suggestedRoutine: {
        type: "array",
        items: { type: "string" },
        description: "Ordered, concrete step-by-step routine for the patient to follow.",
      },
      homeRemedies: {
        type: "array",
        items: { type: "string" },
        description: "Safe supportive home remedies using common household ingredients.",
      },
      nearbyPharmacies: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            note: { type: "string" },
          },
          required: ["name", "note"],
        },
        description: "Real pharmacies found via web_search near the given locality. Empty if no locality or nothing found.",
      },
      nextSteps: {
        type: "array",
        items: { type: "string" },
        description: "Concrete next actions: which specialist, urgency timeframe.",
      },
      disclaimer: { type: "string" },
    },
    required: [
      "summary",
      "isEmergency",
      "redFlags",
      "possibleConditions",
      "emergencyAdvice",
      "recommendedTreatment",
      "medicinesToBuy",
      "suggestedRoutine",
      "homeRemedies",
      "nearbyPharmacies",
      "nextSteps",
      "disclaimer",
    ],
  },
};

const webSearchTool: Anthropic.WebSearchTool20260209 = {
  type: "web_search_20260209",
  name: "web_search",
  max_uses: 3,
};

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

  let client: Anthropic;
  try {
    client = getAnthropicClient();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI client is not configured." },
      { status: 500 }
    );
  }

  const content: Anthropic.MessageParam["content"] = [];

  for (const img of images) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: img.mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        data: img.base64,
      },
    });
    content.push({ type: "text", text: `The image above is labeled: ${img.label}` });
  }

  content.push({
    type: "text",
    text: symptoms
      ? `Patient-reported symptoms / description: ${symptoms}`
      : "No additional symptom text was provided; rely on the images alone.",
  });

  content.push({
    type: "text",
    text: locality
      ? `Patient's locality: ${locality}`
      : "No locality was provided.",
  });

  const system = buildHealthAnalysisSystemPrompt(language.promptName, locality);
  const messages: Anthropic.MessageParam[] = [{ role: "user", content }];

  try {
    let report: HealthReport | null = null;

    for (let i = 0; i < MAX_LOOP_ITERATIONS; i++) {
      const response = await client.messages.create({
        model: DIAGNOSIS_MODEL,
        max_tokens: 4096,
        system,
        tools: locality ? [reportTool, webSearchTool] : [reportTool],
        messages,
      });

      const toolUse = response.content.find(
        (block): block is Anthropic.ToolUseBlock =>
          block.type === "tool_use" && block.name === "provide_health_report"
      );

      if (toolUse) {
        report = toolUse.input as HealthReport;
        break;
      }

      if (response.stop_reason === "pause_turn") {
        messages.push({ role: "assistant", content: response.content });
        continue;
      }

      break;
    }

    if (!report) {
      return NextResponse.json(
        { error: "The AI did not return a structured report. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ report });
  } catch (err) {
    console.error("Diagnose API error:", err);
    return NextResponse.json(
      { error: "Something went wrong while analyzing your report. Please try again." },
      { status: 500 }
    );
  }
}
