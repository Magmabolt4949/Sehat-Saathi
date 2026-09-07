"use client";

import { Phone, ExternalLink, CalendarPlus } from "lucide-react";
import type { NearbyDoctor } from "@/lib/types";
import { t, type LanguageCode } from "@/lib/i18n";
import { buildMapsSearchUrl } from "@/lib/maps";
import { buildTelHref, looksLikePhoneNumber } from "@/lib/share";

interface DoctorCardProps {
  doctor: NearbyDoctor;
  locality: string;
  language: LanguageCode;
  color: string;
  onBook: (doctor: NearbyDoctor) => void;
}

export default function DoctorCard({ doctor, locality, language, color, onBook }: DoctorCardProps) {
  const hasPhone = looksLikePhoneNumber(doctor.phone);

  return (
    <div
      className="rounded-2xl border p-3.5 transition-colors"
      style={{ borderColor: `${color}33`, backgroundColor: `${color}0d` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-teal-950">{doctor.name}</p>
        {doctor.specialty && (
          <span
            className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${color}1a`, color }}
          >
            {doctor.specialty}
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs text-teal-600">{doctor.note}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {hasPhone ? (
          <a
            href={buildTelHref(doctor.phone)}
            className="flex items-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-xs font-semibold transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ borderColor: `${color}55`, color }}
          >
            <Phone className="h-3.5 w-3.5" />
            {t(language, "doctorCallButton")}
          </a>
        ) : (
          <a
            href={buildMapsSearchUrl(`${doctor.name} ${locality}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-xs font-semibold transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ borderColor: `${color}55`, color }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t(language, "doctorViewOnMaps")}
          </a>
        )}
        <button
          type="button"
          onClick={() => onBook(doctor)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          style={{ backgroundColor: color }}
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          {t(language, "bookAppointment")}
        </button>
      </div>
    </div>
  );
}
