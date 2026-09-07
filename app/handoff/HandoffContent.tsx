"use client";

import { useSearchParams } from "next/navigation";
import { Printer } from "lucide-react";
import HandoffSummary from "@/components/HandoffSummary";
import { decodeHandoffPayload } from "@/lib/handoff";
import { t, LANGUAGES, type LanguageCode } from "@/lib/i18n";

function resolveLanguage(code: string | undefined): LanguageCode {
  return (LANGUAGES.find((l) => l.code === code)?.code ?? "en") as LanguageCode;
}

export default function HandoffContent() {
  const searchParams = useSearchParams();
  const payload = decodeHandoffPayload(searchParams.get("d"));

  if (!payload) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-teal-50 px-4 text-center">
        <p className="text-teal-700">{t("en", "handoffNotFound")}</p>
      </main>
    );
  }

  const language = resolveLanguage(payload.language);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-gradient-to-b from-teal-50 to-white px-4 py-10 print:bg-white print:py-0">
      <header className="flex flex-col items-center gap-2 text-center print:hidden">
        <h1 className="text-xl font-bold text-teal-900">🩺 Sehat Saathi</h1>
        <p className="text-sm text-teal-600">{t(language, "handoffPageTitle")}</p>
      </header>

      <HandoffSummary payload={payload} />

      <button
        type="button"
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-2xl border border-teal-200 bg-white px-5 py-2.5 text-sm font-medium text-teal-700 shadow-sm transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 print:hidden"
      >
        <Printer className="h-4 w-4" /> {t(language, "handoffPrint")}
      </button>
    </main>
  );
}
