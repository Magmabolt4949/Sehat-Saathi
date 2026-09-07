import {
  AlertTriangle,
  Stethoscope,
  ClipboardList,
  HeartHandshake,
  ArrowRight,
  Phone,
  ShieldAlert,
  Leaf,
  ListChecks,
  Pill,
  MapPin,
  ExternalLink,
} from "lucide-react";
import type { HealthReport, Likelihood } from "@/lib/types";
import { t, type LanguageCode } from "@/lib/i18n";
import { buildMapsSearchUrl } from "@/lib/maps";

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

function Section({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-teal-100 pt-5">
      <h3
        className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide"
        style={{ color }}
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}1a` }}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function BulletList({ color, items }: { color: string; items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-teal-500">None noted.</p>;
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-teal-900">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span
            aria-hidden
            className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

interface ReportViewProps {
  report: HealthReport;
  language: LanguageCode;
  locality: string;
}

const COLORS = {
  redFlags: "#e11d48",
  conditions: "#6366f1",
  careUrgent: "#e11d48",
  careNormal: "#0d9488",
  treatment: "#0ea5e9",
  routine: "#8b5cf6",
  remedies: "#22c55e",
  pharmacy: "#f59e0b",
  nextSteps: "#14b8a6",
};

export default function ReportView({ report, language, locality }: ReportViewProps) {
  return (
    <div className="animate-fade-in-up w-full max-w-2xl space-y-1 rounded-3xl border border-teal-100 bg-white/90 p-6 shadow-lg shadow-teal-900/5 backdrop-blur-sm sm:p-8">
      {report.isEmergency && (
        <div className="mb-5 rounded-2xl border-2 border-rose-400 bg-rose-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-6 w-6 flex-shrink-0 text-rose-600" />
            <p className="font-semibold leading-snug text-rose-700">
              {t(language, "reportEmergencyBanner")}
            </p>
          </div>
          <div className="mt-3.5 flex gap-2">
            <a
              href="tel:112"
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              <Phone className="h-3.5 w-3.5" /> 112
            </a>
            <a
              href="tel:108"
              className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            >
              <Phone className="h-3.5 w-3.5" /> 108
            </a>
          </div>
        </div>
      )}

      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-teal-950">
          <Stethoscope className="h-5 w-5 text-teal-600" />
          {t(language, "reportSummary")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-teal-800">{report.summary}</p>
      </div>

      {report.redFlags.length > 0 && (
        <Section title={t(language, "reportRedFlags")} icon={AlertTriangle} color={COLORS.redFlags}>
          <BulletList color={COLORS.redFlags} items={report.redFlags} />
        </Section>
      )}

      <Section title={t(language, "reportConditions")} icon={ClipboardList} color={COLORS.conditions}>
        {report.possibleConditions.length === 0 ? (
          <p className="text-sm text-teal-500">{t(language, "reportConditionsEmpty")}</p>
        ) : (
          <div className="space-y-2.5">
            {report.possibleConditions.map((cond, i) => (
              <div
                key={i}
                className="rounded-2xl border p-3.5 transition-colors"
                style={{ borderColor: `${COLORS.conditions}33`, backgroundColor: `${COLORS.conditions}0d` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-teal-950">{cond.name}</span>
                  <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${likelihoodStyles(cond.likelihood)}`}
                  >
                    {likelihoodLabel(language, cond.likelihood)}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-teal-700">{cond.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section
        title={report.isEmergency ? t(language, "reportCareUrgent") : t(language, "reportCareNormal")}
        icon={HeartHandshake}
        color={report.isEmergency ? COLORS.careUrgent : COLORS.careNormal}
      >
        <BulletList
          color={report.isEmergency ? COLORS.careUrgent : COLORS.careNormal}
          items={report.emergencyAdvice}
        />
      </Section>

      <Section title={t(language, "reportTreatment")} icon={Stethoscope} color={COLORS.treatment}>
        <BulletList color={COLORS.treatment} items={report.recommendedTreatment} />
      </Section>

      {report.suggestedRoutine.length > 0 && (
        <Section title={t(language, "reportRoutine")} icon={ListChecks} color={COLORS.routine}>
          <ol className="space-y-2 text-sm leading-relaxed text-teal-900">
            {report.suggestedRoutine.map((step, i) => (
              <li key={i} className="flex gap-2.5">
                <span
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                  style={{ backgroundColor: COLORS.routine }}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {report.homeRemedies.length > 0 && (
        <Section title={t(language, "reportHomeRemedies")} icon={Leaf} color={COLORS.remedies}>
          <BulletList color={COLORS.remedies} items={report.homeRemedies} />
        </Section>
      )}

      {(report.medicinesToBuy.length > 0 || locality) && (
        <Section title={t(language, "reportPharmacy")} icon={MapPin} color={COLORS.pharmacy}>
          {!locality ? (
            <p className="text-sm text-teal-500">{t(language, "reportPharmacyEmpty")}</p>
          ) : (
            <div className="space-y-2">
              {report.nearbyPharmacies.length > 0 ? (
                report.nearbyPharmacies.map((pharmacy, i) => (
                  <a
                    key={i}
                    href={buildMapsSearchUrl(`${pharmacy.name} ${locality}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-2xl border p-3.5 transition-colors hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                    style={{ borderColor: `${COLORS.pharmacy}33`, backgroundColor: `${COLORS.pharmacy}0d` }}
                  >
                    <div>
                      <p className="font-medium text-teal-950">{pharmacy.name}</p>
                      <p className="mt-0.5 text-xs text-teal-600">{pharmacy.note}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 flex-shrink-0" style={{ color: COLORS.pharmacy }} />
                  </a>
                ))
              ) : (
                <a
                  href={buildMapsSearchUrl(`pharmacy near ${locality}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-2xl border p-3.5 transition-colors hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  style={{ borderColor: `${COLORS.pharmacy}33`, backgroundColor: `${COLORS.pharmacy}0d` }}
                >
                  <span className="font-medium text-teal-950">{t(language, "reportPharmacyGeneric")}</span>
                  <ExternalLink className="h-4 w-4 flex-shrink-0" style={{ color: COLORS.pharmacy }} />
                </a>
              )}

              {report.medicinesToBuy.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {report.medicinesToBuy.map((medicine, i) => (
                    <a
                      key={i}
                      href={buildMapsSearchUrl(`${medicine} medical store near ${locality}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs font-medium transition-colors hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
                      style={{ borderColor: `${COLORS.pharmacy}55`, color: COLORS.pharmacy }}
                    >
                      <Pill className="h-3 w-3" />
                      {medicine}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </Section>
      )}

      <Section title={t(language, "reportNextSteps")} icon={ArrowRight} color={COLORS.nextSteps}>
        <BulletList color={COLORS.nextSteps} items={report.nextSteps} />
      </Section>

      <p className="mt-5 border-t border-teal-100 pt-4 text-xs italic leading-relaxed text-teal-500">
        {report.disclaimer}
      </p>
    </div>
  );
}
