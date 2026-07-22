export type ImageLabel =
  | "X-Ray"
  | "ECG"
  | "Skin / Injury Photo"
  | "Other Scan"
  | "Prescription";

export interface UploadedImage {
  label: ImageLabel;
  mediaType: string;
  base64: string;
}

export interface DiagnoseRequestBody {
  images: UploadedImage[];
  symptoms: string;
  language: string;
  locality: string;
}

export type Likelihood = "low" | "moderate" | "high";

export interface PossibleCondition {
  name: string;
  likelihood: Likelihood;
  explanation: string;
}

export interface NearbyPharmacy {
  name: string;
  note: string;
}

export interface HealthReport {
  summary: string;
  isEmergency: boolean;
  redFlags: string[];
  possibleConditions: PossibleCondition[];
  emergencyAdvice: string[];
  recommendedTreatment: string[];
  homeRemedies: string[];
  suggestedRoutine: string[];
  medicinesToBuy: string[];
  nearbyPharmacies: NearbyPharmacy[];
  nextSteps: string[];
  disclaimer: string;
}
