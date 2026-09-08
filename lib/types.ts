import type { AvatarGender, AvatarAgeGroup } from "@/lib/avatars";

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

/** A short, already-condensed slice of a member's own past checks — never raw images or full reports. */
export interface PriorHistoryItem {
  createdAt: string;
  summary: string;
  possibleConditions: { name: string; likelihood: string }[];
}

export interface DiagnoseRequestBody {
  images: UploadedImage[];
  symptoms: string;
  language: string;
  locality: string;
  /** Optional, per-check, patient-revocable — only sent when the user opts in. */
  priorHistory?: PriorHistoryItem[];
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

/** Which AI pipeline produced a report — threaded everywhere a report's provenance matters. */
export type AISource = "cloud" | "offline";

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
  /** Absent/undefined means "cloud" (every pre-existing report was cloud-generated). */
  source?: AISource;
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
  /** True provenance of the report this handoff was built from — a doctor must always see this. */
  source?: AISource;
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
  /** Which family member this was booked for. Absent on appointments saved before family profiles existed. */
  memberId?: string;
  /** Inherited from the report the handoff was built from. */
  source?: AISource;
}

// ---------------------------------------------------------------------------
// Family profiles
// ---------------------------------------------------------------------------

export type FamilyRelationship = "self" | "spouse" | "parent" | "child" | "other";

export interface FamilyMember {
  id: string;
  name: string;
  gender: AvatarGender | null;
  ageGroup: AvatarAgeGroup | null;
  personaId: string;
  relationship: FamilyRelationship;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Health history
// ---------------------------------------------------------------------------

export interface HistoryEntry {
  id: string;
  memberId: string;
  createdAt: string;
  symptoms: string;
  locality: string;
  language: string;
  report: HealthReport;
  source: AISource;
}
