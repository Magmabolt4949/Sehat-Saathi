"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import AppointmentHistory from "@/components/AppointmentHistory";
import { getSavedLanguage, type LanguageCode } from "@/lib/i18n";

export default function AppointmentsPage() {
  const [language, setLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLanguage(getSavedLanguage());
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-gradient-to-b from-teal-50 to-white px-4 py-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-bold text-teal-900">🩺 Sehat Saathi</h1>
        <NavBar />
      </header>

      <AppointmentHistory language={language} />
    </main>
  );
}
