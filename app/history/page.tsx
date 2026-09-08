"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import HistoryTimeline from "@/components/HistoryTimeline";
import { getSavedLanguage, type LanguageCode } from "@/lib/i18n";
import { getOrMigrateFamily } from "@/lib/family";
import type { FamilyMember } from "@/lib/types";

export default function HistoryPage() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLanguage(getSavedLanguage());
    const { members: loadedMembers, activeId } = getOrMigrateFamily();
    setMembers(loadedMembers);
    setActiveMemberId(activeId);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-gradient-to-b from-teal-50 to-white px-4 py-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-bold text-teal-900">🩺 Sehat Saathi</h1>
        <NavBar language={language} />
      </header>

      <HistoryTimeline language={language} members={members} activeMemberId={activeMemberId} />
    </main>
  );
}
