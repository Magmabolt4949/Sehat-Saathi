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
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-teal-100 pt-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-teal-500">
        <Icon className="h-4 w-4" />
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-teal-400">None noted.</p>;
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-teal-900">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-400" />
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
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
            >
              <Phone className="h-3.5 w-3.5" /> 112
            </a>
            <a
              href="tel:108"
              className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
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
        <Section title={t(language, "reportRedFlags")} icon={AlertTriangle}>
          <BulletList items={report.redFlags} />
        </Section>
      )}

      <Section title={t(language, "reportConditions")} icon={ClipboardList}>
        {report.possibleConditions.length === 0 ? (
          <p className="text-sm text-teal-400">{t(language, "reportConditionsEmpty")}</p>
        ) : (
          <div className="space-y-2.5">
            {report.possibleConditions.map((cond, i) => (
              <div
                key={i}
                className="rounded-2xl border border-teal-100 bg-teal-50/40 p-3.5 transition-colors hover:bg-teal-50"
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
      >
        <BulletList items={report.emergencyAdvice} />
      </Section>

      <Section title={t(language, "reportTreatment")} icon={Stethoscope}>
        <BulletList items={report.recommendedTreatment} />
      </Section>

      {report.suggestedRoutine.length > 0 && (
        <Section title={t(language, "reportRoutine")} icon={ListChecks}>
          <ol className="space-y-2 text-sm leading-relaxed text-teal-900">
            {report.suggestedRoutine.map((step, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-[11px] font-semibold text-teal-700">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {report.homeRemedies.length > 0 && (
        <Section title={t(language, "reportHomeRemedies")} icon={Leaf}>
          <BulletList items={report.homeRemedies} />
        </Section>
      )}

      {(report.medicinesToBuy.length > 0 || locality) && (
        <Section title={t(language, "reportPharmacy")} icon={MapPin}>
          {!locality ? (
            <p className="text-sm text-teal-400">{t(language, "reportPharmacyEmpty")}</p>
          ) : (
            <div className="space-y-2">
              {report.nearbyPharmacies.length > 0 ? (
                report.nearbyPharmacies.map((pharmacy, i) => (
                  <a
                    key={i}
                    href={buildMapsSearchUrl(`${pharmacy.name} ${locality}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-2xl border border-teal-100 bg-teal-50/40 p-3.5 transition-colors hover:bg-teal-50"
                  >
                    <div>
                      <p className="font-medium text-teal-950">{pharmacy.name}</p>
                      <p className="mt-0.5 text-xs text-teal-600">{pharmacy.note}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 flex-shrink-0 text-teal-500" />
                  </a>
                ))
              ) : (
                <a
                  href={buildMapsSearchUrl(`pharmacy near ${locality}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-2xl border border-teal-100 bg-teal-50/40 p-3.5 transition-colors hover:bg-teal-50"
                >
                  <span className="font-medium text-teal-950">{t(language, "reportPharmacyGeneric")}</span>
                  <ExternalLink className="h-4 w-4 flex-shrink-0 text-teal-500" />
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
                      className="flex items-center gap-1 rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-50"
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

      <Section title={t(language, "reportNextSteps")} icon={ArrowRight}>
        <BulletList items={report.nextSteps} />
      </Section>

      <p className="mt-5 border-t border-teal-100 pt-4 text-xs italic leading-relaxed text-teal-400">
        {report.disclaimer}
      </p>
    </div>
  );
}
