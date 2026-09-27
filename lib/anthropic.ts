import Anthropic from "@anthropic-ai/sdk";
import type { DiagnosisInput, HealthReport } from "@/lib/types";
import { buildHealthAnalysisSystemPrompt, formatPriorHistory } from "@/lib/prompts";
import { HEALTH_REPORT_JSON_SCHEMA } from "@/lib/reportSchema";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Add it to .env.local to enable AI analysis."
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const DIAGNOSIS_MODEL = "claude-sonnet-5";

const MAX_LOOP_ITERATIONS = 5;

const reportTool: Anthropic.Tool = {
  name: "provide_health_report",
  description:
    "Provide a structured, assistive (non-diagnostic) health report based on uploaded medical images/scans, prescription photos, and reported symptoms.",
  input_schema: HEALTH_REPORT_JSON_SCHEMA as unknown as Anthropic.Tool["input_schema"],
};

const webSearchTool: Anthropic.WebSearchTool20260209 = {
  type: "web_search_20260209",
  name: "web_search",
  max_uses: 5,
};

/**
 * Cloud diagnosis via Claude: multimodal input, a server-side web_search tool for real
 * nearby pharmacies/doctors (locality-gated), and a forced structured tool call for the
 * report. Returns null if the model never produced the structured report.
 */
export async function runAnthropicDiagnosis(input: DiagnosisInput): Promise<HealthReport | null> {
  const { images, symptoms, locality, languageName, priorHistory } = input;
  const anthropic = getAnthropicClient();

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
    text: locality ? `Patient's locality: ${locality}` : "No locality was provided.",
  });

  if (priorHistory.length > 0) {
    content.push({ type: "text", text: formatPriorHistory(priorHistory) });
  }

  const system = buildHealthAnalysisSystemPrompt(languageName, locality);
  const messages: Anthropic.MessageParam[] = [{ role: "user", content }];

  for (let i = 0; i < MAX_LOOP_ITERATIONS; i++) {
    const response = await anthropic.messages.create({
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

    if (toolUse) return toolUse.input as HealthReport;

    if (response.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: response.content });
      continue;
    }

    break;
  }

  return null;
}
