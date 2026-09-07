"use client";

import { useEffect, useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import type { AppointmentRequest } from "@/lib/types";
import { t, type LanguageCode } from "@/lib/i18n";
import { getAppointments, clearAppointments } from "@/lib/appointments";

interface AppointmentHistoryProps {
  language: LanguageCode;
}

function StatusDot({ lit }: { lit: boolean }) {
  return <span aria-hidden className={`h-2 w-2 flex-shrink-0 rounded-full ${lit ? "bg-green-500" : "bg-teal-200"}`} />;
}

export default function AppointmentHistory({ language }: AppointmentHistoryProps) {
  const [requests, setRequests] = useState<AppointmentRequest[] | null>(null);

  useEffect(() => {
    // Reads localStorage, so it must run client-side after mount (SSR-safe) rather
    // than as a lazy initial state — mirrors the profile-read pattern in app/page.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRequests(getAppointments());
  }, []);

  function handleClear() {
    if (!window.confirm(t(language, "appointmentsClearConfirm"))) return;
    clearAppointments();
    setRequests([]);
  }

  if (requests === null) return null;

  return (
    <div className="w-full max-w-2xl rounded-3xl border border-teal-100 bg-white/80 p-6 shadow-lg shadow-teal-900/5 backdrop-blur-sm sm:p-8">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-tight text-teal-950">
          {t(language, "appointmentsHistoryTitle")}
        </h2>
        {requests.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-xl border border-teal-200 bg-white px-3 py-1.5 text-xs font-medium text-teal-600 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            <Trash2 className="h-3.5 w-3.5" /> {t(language, "appointmentsClearAll")}
          </button>
        )}
      </div>

      {requests.length === 0 ? (
        <p className="mt-4 text-sm text-teal-500">{t(language, "appointmentsEmpty")}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {requests.map((req) => (
            <li key={req.id} className="rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-teal-950">{req.doctor?.name || t(language, "doctorGenericLabel")}</p>
                  <p className="text-xs text-teal-600">{req.slotLabel}</p>
                </div>
                <a
                  href={req.handoffUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-shrink-0 items-center gap-1 rounded-lg border border-teal-200 bg-white px-2.5 py-1 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1"
                >
                  <FileText className="h-3 w-3" /> {t(language, "bookingOpenSummary")}
                </a>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <StatusDot lit />
                  <span className="text-[11px] font-medium text-teal-700">{t(language, "bookingStatusPrepared")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusDot lit={req.notifiedVia.length > 0} />
                  <span className="text-[11px] font-medium text-teal-700">{t(language, "bookingStatusNotified")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusDot lit={req.clinicConfirmed} />
                  <span className="text-[11px] font-medium text-teal-700">{t(language, "bookingStatusConfirmed")}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
