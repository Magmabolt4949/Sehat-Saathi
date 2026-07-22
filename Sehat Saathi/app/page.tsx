"use client";

import { useState } from "react";
import { RotateCcw, Globe } from "lucide-react";
import Avatar, { AvatarState } from "@/components/Avatar";
import NavBar from "@/components/NavBar";
import UploadPanel from "@/components/UploadPanel";
import ReportView from "@/components/ReportView";
import ReportSkeleton from "@/components/ReportSkeleton";
import type { HealthReport, UploadedImage } from "@/lib/types";
import { LANGUAGES, t, type LanguageCode } from "@/lib/i18n";

export default function Home() {
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [report, setReport] = useState<HealthReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [locality, setLocality] = useState("");

  const selectedLanguage = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  async function handleSubmit(images: UploadedImage[], symptoms: string) {
    setError(null);
    setReport(null);
    setLoading(true);
    setAvatarState("thinking");

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, symptoms, language, locality }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      const healthReport = data.report as HealthReport;
      setReport(healthReport);
      setAvatarState(healthReport.isEmergency ? "concerned" : "talking");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setAvatarState("idle");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setReport(null);
    setError(null);
    setAvatarState("idle");
  }

  const avatarCaptions: Record<AvatarState, string> = {
    idle: t(language, "avatarIdle"),
    listening: t(language, "avatarIdle"),
    thinking: t(language, "avatarThinking"),
    talking: t(language, "avatarTalking"),
    concerned: t(language, "avatarConcerned"),
  };

  return (
    <main
      dir={selectedLanguage.rtl ? "rtl" : "ltr"}
      className="relative flex min-h-screen flex-col items-center gap-8 overflow-hidden bg-gradient-to-b from-teal-50 via-white to-white px-4 py-10 sm:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-teal-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-64 h-56 w-56 rounded-full bg-amber-100/40 blur-3xl"
      />

      <header className="relative flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-teal-950 sm:text-4xl">
          🩺 Sehat Saathi
        </h1>
        <p className="text-sm text-teal-600 sm:text-base">
          आपका AI स्वास्थ्य साथी · Your AI Health Companion
        </p>
        <NavBar />

        <label className="flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3.5 py-1.5 text-sm text-teal-700 shadow-sm">
          <Globe className="h-3.5 w-3.5 text-teal-500" />
          <span className="sr-only">{t(language, "languageLabel")}</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="cursor-pointer bg-transparent font-medium outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeLabel}
              </option>
            ))}
          </select>
        </label>
      </header>

      <Avatar state={avatarState} caption={avatarCaptions[avatarState]} />

      {error && (
        <div className="animate-fade-in-up w-full max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="relative flex w-full max-w-2xl flex-col items-center gap-4">
        {loading ? (
          <ReportSkeleton />
        ) : report ? (
          <div className="animate-fade-in-up flex w-full flex-col items-center gap-4">
            <ReportView report={report} language={language} locality={locality} />
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-2xl border border-teal-200 bg-white px-5 py-2.5 text-sm font-medium text-teal-700 shadow-sm transition-colors hover:bg-teal-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t(language, "startNewCheck")}
            </button>
          </div>
        ) : (
          <UploadPanel
            onSubmit={handleSubmit}
            loading={loading}
            language={language}
            locality={locality}
            onLocalityChange={setLocality}
          />
        )}
      </div>

      <p className="relative max-w-2xl px-2 text-center text-xs leading-relaxed text-teal-400">
        {t(language, "disclaimerFooter")}
      </p>
    </main>
  );
}
