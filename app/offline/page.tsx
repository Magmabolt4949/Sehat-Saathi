"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import OfflineAIPanel from "@/components/OfflineAIPanel";
import { getSavedLanguage, type LanguageCode } from "@/lib/i18n";
import { getForceOffline, setForceOffline } from "@/lib/offline";

export default function OfflinePage() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [forceOffline, setForceOfflineState] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLanguage(getSavedLanguage());
    setForceOfflineState(getForceOffline());
  }, []);

  function handleForceOfflineChange(value: boolean) {
    setForceOfflineState(value);
    setForceOffline(value);
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-gradient-to-b from-teal-50 to-white px-4 py-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-bold text-teal-900">🩺 Sehat Saathi</h1>
        <NavBar language={language} />
      </header>

      <OfflineAIPanel language={language} forceOffline={forceOffline} onForceOfflineChange={handleForceOfflineChange} />
    </main>
  );
}
