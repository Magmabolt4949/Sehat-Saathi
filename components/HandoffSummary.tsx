import { AlertTriangle, ClipboardList, ArrowRight, Stethoscope, ShieldAlert } from "lucide-react";
import type { HandoffPayload, Likelihood } from "@/lib/types";
import { t, LANGUAGES, type LanguageCode } from "@/lib/i18n";

function likelihoodStyles(l: Likelihood): string {
  switch (l) {
    case "high":
      return "bg-rose-100 text-rose-700";
    case "moderate":
      return "bg-amber-100 text-amber-700";
    case "low":
      return "bg-teal-100 text-teal-700";
  }
}

function likelihoodLabel(language: LanguageCode, l: Likelihood): string {
  switch (l) {
    case "high":
      return t(language, "likelihoodHigh");
    case "moderate":
      return t(language, "likelihoodModerate");
    case "low":
      return t(language, "likelihoodLow");
  }
}

function resolveLanguage(code: string): LanguageCode {
  return (LANGUAGES.find((l) => l.code === code)?.code ?? "en") as LanguageCode;
}

interface HandoffSummaryProps {
  payload: HandoffPayload;
}

/**
 * Shared, printable rendering of a HandoffPayload — reused by AppointmentModal's
 * review step and by the real /handoff page a doctor opens, so the preview and the
 * actual shared artifact are pixel-identical, not a divergent stub.
 */
export default function HandoffSummary({ payload }: HandoffSummaryProps) {
  const language = resolveLanguage(payload.language);
  const rtl = LANGUAGES.find((l) => l.code === language)?.rtl;

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className="w-full max-w-2xl space-y-4 rounded-3xl border border-teal-100 bg-white p-6 sm:p-8 print:border-0 print:shadow-none"
    >
      {payload.isEmergency && (
        <div className="rounded-2xl border-2 border-rose-400 bg-rose-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
            <p className="text-sm font-semibold leading-snug text-rose-700">
              {t(language, "reportEmergencyBanner")}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-100 pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-500">
            {t(language, "handoffPreparedFor")}
          </p>
          <p className="text-lg font-bold text-teal-950">{payload.patientName}</p>
        </div>
        {payload.slotLabel && (
          <div className="text-right">
            <p className="text-sm font-medium text-teal-700">{payload.slotLabel}</p>
          </div>
        )}
      </div>

      {(payload.doctorName || payload.requestedSpecialty) && (
        <div className="text-sm text-teal-700">
          {payload.doctorName && (
            <p>
              <span className="font-medium text-teal-950">{payload.doctorName}</span>
              {payload.doctorNote ? ` — ${payload.doctorNote}` : ""}
            </p>
          )}
          {payload.requestedSpecialty && (
            <p className="mt-0.5">
              <span className="font-medium">{t(language, "handoffRequestedSpecialist")}:</span>{" "}
              {payload.requestedSpecialty}
            </p>
          )}
        </div>
      )}

      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-teal-700">
          <Stethoscope className="h-4 w-4" aria-hidden />
          {t(language, "reportSummary")}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-teal-900">{payload.summary}</p>
      </div>

      {payload.redFlags.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-rose-600">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            {t(language, "reportRedFlags")}
          </h3>
          <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-teal-900">
            {payload.redFlags.map((flag, i) => (
              <li key={i}>• {flag}</li>
            ))}
          </ul>
        </div>
      )}

      {payload.possibleConditions.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">
            <ClipboardList className="h-4 w-4" aria-hidden />
            {t(language, "reportConditions")}
          </h3>
          <div className="mt-1.5 space-y-1.5">
            {payload.possibleConditions.map((cond, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-teal-900">{cond.name}</span>
                <span
                  className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${likelihoodStyles(cond.likelihood)}`}
                >
                  {likelihoodLabel(language, cond.likelihood)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {payload.recommendedTreatment.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-600">
            {t(language, "reportTreatment")}
          </h3>
          <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-teal-900">
            {payload.recommendedTreatment.map((step, i) => (
              <li key={i}>• {step}</li>
            ))}
          </ul>
        </div>
      )}

      {payload.nextSteps.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-teal-600">
            <ArrowRight className="h-4 w-4" aria-hidden />
            {t(language, "reportNextSteps")}
          </h3>
          <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-teal-900">
            {payload.nextSteps.map((step, i) => (
              <li key={i}>• {step}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="border-t border-teal-100 pt-3 text-xs italic leading-relaxed text-teal-500">
        {payload.disclaimer}
      </p>
      <p className="rounded-xl bg-amber-50 p-3 text-xs font-medium leading-relaxed text-amber-800">
        {t(language, "handoffDisclaimer")}
      </p>
    </div>
  );
}
