"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RotateCcw, X } from "lucide-react";
import Avatar, { AvatarState } from "@/components/Avatar";
import NavBar from "@/components/NavBar";
import UploadPanel from "@/components/UploadPanel";
import ReportView from "@/components/ReportView";
import ReportSkeleton from "@/components/ReportSkeleton";
import Onboarding, { type UserProfile } from "@/components/Onboarding";
import FamilySwitcher from "@/components/FamilySwitcher";
import type { HealthReport, UploadedImage, FamilyMember } from "@/lib/types";
import { LANGUAGES, t, getSavedLanguage, saveLanguage, type LanguageCode } from "@/lib/i18n";
import { getOrMigrateFamily, addFamilyMember, updateFamilyMember, setActiveMemberId as persistActiveMemberId } from "@/lib/family";
import { getHistory, saveHistoryEntry, buildHistoryEntry, summarizeRecentHistory } from "@/lib/history";
import { useOnlineStatus, getForceOffline } from "@/lib/offline";
import { isModelDownloaded, runOfflineDiagnosis } from "@/lib/webllm";

export default function Home() {
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [report, setReport] = useState<HealthReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [locality, setLocality] = useState("");
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [forceOffline, setForceOffline] = useState(false);

  const isOnline = useOnlineStatus();

  useEffect(() => {
    const { members: loadedMembers, activeId } = getOrMigrateFamily();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMembers(loadedMembers);
    setActiveMemberId(activeId);
    setLanguage(getSavedLanguage());
    setForceOffline(getForceOffline());
    setCheckedStorage(true);
  }, []);

  function handleLanguageChange(value: LanguageCode) {
    setLanguage(value);
    saveLanguage(value);
  }

  function handleAppointmentBooked() {
    setAvatarState("celebrating");
  }

  /** The one non-negotiable safety rule: switching members always clears any in-progress
   *  or completed check — a stale report must never remain visible/bookable once the app
   *  is showing a different member's identity and avatar. */
  function resetCheckState() {
    setReport(null);
    setError(null);
    setAvatarState("idle");
  }

  function handleOnboardingComplete(profile: UserProfile) {
    const result = addFamilyMember({
      name: profile.name,
      gender: profile.gender,
      ageGroup: profile.ageGroup,
      personaId: profile.personaId,
      relationship: "self",
    });
    if ("error" in result) return;
    setMembers([result.member]);
    setActiveMemberId(result.member.id);
    persistActiveMemberId(result.member.id);
  }

  function handleSwitchMember(id: string) {
    if (id === activeMemberId) return;
    setActiveMemberId(id);
    persistActiveMemberId(id);
    resetCheckState();
  }

  function handleAddMemberComplete(profile: UserProfile) {
    const result = addFamilyMember({
      name: profile.name,
      gender: profile.gender,
      ageGroup: profile.ageGroup,
      personaId: profile.personaId,
      relationship: profile.relationship ?? "other",
    });
    if ("error" in result) {
      window.alert(t(language, "familyMemberLimitReached"));
      return;
    }
    setMembers((prev) => [...prev, result.member]);
    setActiveMemberId(result.member.id);
    persistActiveMemberId(result.member.id);
    setShowAddMember(false);
    resetCheckState();
  }

  function handlePersonaChange(id: string) {
    if (!activeMember) return;
    setMembers((prev) => prev.map((m) => (m.id === activeMember.id ? { ...m, personaId: id } : m)));
    updateFamilyMember(activeMember.id, { personaId: id });
  }

  const selectedLanguage = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];
  const activeMember = members.find((m) => m.id === activeMemberId) ?? null;
  const effectiveOffline = forceOffline || !isOnline;
  const hasHistory = activeMember ? getHistory(activeMember.id).length > 0 : false;

  async function handleSubmit(images: UploadedImage[], symptoms: string, includeHistory: boolean) {
    if (!activeMember) return;
    setError(null);
    setReport(null);
    setLoading(true);
    setAvatarState("thinking");

    try {
      let healthReport: HealthReport;

      if (effectiveOffline) {
        const ready = await isModelDownloaded();
        if (!ready) throw new Error(t(language, "offlineModelNotReady"));
        healthReport = await runOfflineDiagnosis({ symptomsText: symptoms, language });
      } else {
        const priorHistory = includeHistory ? summarizeRecentHistory(activeMember.id) : undefined;
        const res = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images, symptoms, language, locality, priorHistory }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
        healthReport = data.report as HealthReport;
      }

      setReport(healthReport);
      setAvatarState(healthReport.isEmergency ? "concerned" : "talking");
      saveHistoryEntry(
        buildHistoryEntry({
          memberId: activeMember.id,
          symptoms,
          locality,
          language,
          report: healthReport,
          source: healthReport.source ?? "cloud",
        })
      );
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

  if (!activeMember) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const avatarCaptions: Record<AvatarState, string> = {
    idle: activeMember.name ? `Hi ${activeMember.name}, I'm here whenever you're ready.` : t(language, "avatarIdle"),
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
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-teal-950 sm:text-4xl">
            🩺 Sehat Saathi
          </h1>
          <p className="text-sm text-teal-600 sm:text-base">
            आपका AI स्वास्थ्य साथी · Your AI Health Companion
          </p>
          <NavBar language={language} />
          <FamilySwitcher
            members={members}
            selectedId={activeMemberId}
            onSelect={handleSwitchMember}
            onAddMember={() => setShowAddMember(true)}
            language={language}
          />
        </header>

        {effectiveOffline && (
          <p className="mx-auto flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1.5 text-xs font-medium text-amber-800">
            {forceOffline ? t(language, "offlineForceToggleLabel") : t(language, "offlineBannerReal")}
          </p>
        )}

        <div className="flex flex-col items-start gap-8 lg:flex-row lg:justify-center">
          <div className="flex w-full flex-shrink-0 justify-center lg:sticky lg:top-10 lg:w-80">
            <Avatar
              state={avatarState}
              caption={avatarCaptions[avatarState]}
              personaId={activeMember.personaId}
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
                    patientName={activeMember.name}
                    memberId={activeMember.id}
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
                  offline={effectiveOffline}
                  hasHistory={hasHistory}
                />
              )}
            </div>
          </div>
        </div>

        <p className="relative mx-auto max-w-2xl px-2 text-center text-xs leading-relaxed text-teal-500">
          {t(language, "disclaimerFooter")}
        </p>
      </div>

      {showAddMember && (
        <AddMemberModal language={language} onComplete={handleAddMemberComplete} onClose={() => setShowAddMember(false)} />
      )}
    </main>
  );
}

function AddMemberModal({
  language,
  onComplete,
  onClose,
}: {
  language: LanguageCode;
  onComplete: (profile: UserProfile) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/40 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-slide-up-sheet relative max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-teal-500 shadow-sm transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <X className="h-4 w-4" />
        </button>
        <Onboarding mode="addMember" language={language} onComplete={onComplete} onCancel={onClose} />
      </div>
    </div>,
    document.body
  );
}
