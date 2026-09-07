"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import Avatar, { AvatarState } from "@/components/Avatar";
import NavBar from "@/components/NavBar";
import UploadPanel from "@/components/UploadPanel";
import ReportView from "@/components/ReportView";
import ReportSkeleton from "@/components/ReportSkeleton";
import Onboarding, { type UserProfile } from "@/components/Onboarding";
import type { HealthReport, UploadedImage } from "@/lib/types";
import { LANGUAGES, t, getSavedLanguage, saveLanguage, type LanguageCode } from "@/lib/i18n";

const PROFILE_STORAGE_KEY = "sehat-saathi-profile";

export default function Home() {
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [report, setReport] = useState<HealthReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [locality, setLocality] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProfile(JSON.parse(saved));
      } catch {
        // ignore corrupt storage
      }
    }
    setLanguage(getSavedLanguage());
    setCheckedStorage(true);
  }, []);

  function handleLanguageChange(value: LanguageCode) {
    setLanguage(value);
    saveLanguage(value);
  }

  function handleAppointmentBooked() {
    setAvatarState("celebrating");
  }

  function handleOnboardingComplete(newProfile: UserProfile) {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    setProfile(newProfile);
  }

  function handlePersonaChange(id: string) {
    if (!profile) return;
    const updated = { ...profile, personaId: id };
    setProfile(updated);
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  }

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

  if (!checkedStorage) {
    return <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50/40" />;
  }

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const avatarCaptions: Record<AvatarState, string> = {
    idle: profile.name ? `Hi ${profile.name}, I'm here whenever you're ready.` : t(language, "avatarIdle"),
    listening: t(language, "avatarIdle"),
    thinking: t(language, "avatarThinking"),
    talking: t(language, "avatarTalking"),
    concerned: t(language, "avatarConcerned"),
    celebrating: t(language, "avatarCelebrating"),
  };

  return (
    <main
      dir={selectedLanguage.rtl ? "rtl" : "ltr"}
      lang={language}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-50 via-white to-teal-100/50 px-4 py-8 sm:py-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-200/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-teal-200/25 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-teal-950 sm:text-4xl">
            🩺 Sehat Saathi
          </h1>
          <p className="text-sm text-teal-600 sm:text-base">
            आपका AI स्वास्थ्य साथी · Your AI Health Companion
          </p>
          <NavBar />
        </header>

        <div className="flex flex-col items-start gap-8 lg:flex-row lg:justify-center">
          <div className="flex w-full flex-shrink-0 justify-center lg:sticky lg:top-10 lg:w-80">
            <Avatar
              state={avatarState}
              caption={avatarCaptions[avatarState]}
              personaId={profile.personaId}
              onPersonaChange={handlePersonaChange}
              language={language}
            />
          </div>

          <div className="flex w-full max-w-2xl flex-col gap-4">
            {error && (
              <div
                role="alert"
                className="animate-fade-in-up w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm"
              >
                {error}
              </div>
            )}

            <div
              className="scroll-box max-h-[75vh] w-full overflow-y-auto rounded-3xl"
              aria-live="polite"
              aria-busy={loading}
            >
              {loading ? (
                <ReportSkeleton />
              ) : report ? (
                <div className="animate-fade-in-up flex w-full flex-col items-center gap-4">
                  <ReportView
                    report={report}
                    language={language}
                    locality={locality}
                    patientName={profile.name}
                    onAppointmentBooked={handleAppointmentBooked}
                  />
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 rounded-2xl border border-teal-200 bg-white px-5 py-2.5 text-sm font-medium text-teal-700 shadow-sm transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
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
                  onLanguageChange={handleLanguageChange}
                  locality={locality}
                  onLocalityChange={setLocality}
                />
              )}
            </div>
          </div>
        </div>

        <p className="relative mx-auto max-w-2xl px-2 text-center text-xs leading-relaxed text-teal-500">
          {t(language, "disclaimerFooter")}
        </p>
      </div>
    </main>
  );
}
