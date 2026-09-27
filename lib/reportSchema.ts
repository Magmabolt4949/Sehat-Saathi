/**
 * The single source of truth for the structured HealthReport shape, as plain JSON Schema.
 * Both providers consume it: Anthropic as the `provide_health_report` tool's input_schema,
 * Gemini as `responseJsonSchema`. Keep it in sync with `HealthReport` in lib/types.ts.
 */
export const HEALTH_REPORT_JSON_SCHEMA = {
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
      description: "Real pharmacies found via live search near the given locality. Empty if no locality or nothing found.",
    },
    recommendedSpecialty: {
      type: "string",
      description:
        "Plain-language type of doctor best suited to the possible conditions (e.g. 'Dermatologist'). Empty string if no locality was given.",
    },
    nearbyDoctors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          specialty: { type: "string" },
          note: { type: "string" },
          phone: {
            type: "string",
            description:
              "Real phone number ONLY if it appeared directly in a search result for this listing; empty string otherwise. Never invented or guessed.",
          },
        },
        required: ["name", "specialty", "note", "phone"],
      },
      description: "Real doctors/clinics found via live search near the given locality. Empty if no locality or nothing found.",
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
    "recommendedSpecialty",
    "nearbyDoctors",
    "nextSteps",
    "disclaimer",
  ],
} as const;
