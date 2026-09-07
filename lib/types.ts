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

export interface NearbyDoctor {
  name: string;
  specialty: string;
  note: string;
  /** Empty string unless a real phone number was found via web_search — never invented. */
  phone: string;
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
  /** Plain-language specialist type (e.g. "Dermatologist"); "" if a locality wasn't given. */
  recommendedSpecialty: string;
  nearbyDoctors: NearbyDoctor[];
  nextSteps: string[];
  disclaimer: string;
}

export type NotifyChannel = "call" | "whatsapp" | "share" | "copy";

export type AppointmentStatus = "prepared" | "notified" | "confirmed";

/** A condensed, URL-shippable slice of a HealthReport — the "handoff" a doctor actually opens. */
export interface HandoffPayload {
  v: 1;
  patientName: string;
  language: string;
  locality: string;
  isEmergency: boolean;
  summary: string;
  redFlags: string[];
  possibleConditions: PossibleCondition[];
  recommendedTreatment: string[];
  nextSteps: string[];
  requestedSpecialty: string;
  doctorName: string;
  doctorNote: string;
  slotLabel: string;
  createdAt: string;
  disclaimer: string;
}

export interface AppointmentRequest {
  id: string;
  createdAt: string;
  doctor: NearbyDoctor | null;
  locality: string;
  slotLabel: string;
  patientName: string;
  handoffUrl: string;
  notifiedVia: NotifyChannel[];
  clinicConfirmed: boolean;
}
