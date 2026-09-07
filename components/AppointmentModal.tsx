"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Phone, MessageCircle, Copy, Share2, QrCode, FileText, Check } from "lucide-react";
import type { HealthReport, NearbyDoctor, AppointmentRequest, NotifyChannel } from "@/lib/types";
import { t, type LanguageCode } from "@/lib/i18n";
import { buildHandoffPayload, buildHandoffUrl } from "@/lib/handoff";
import { saveAppointment, markNotified, markConfirmed } from "@/lib/appointments";
import { buildTelHref, buildWhatsAppUrl, looksLikePhoneNumber } from "@/lib/share";
import HandoffSummary from "@/components/HandoffSummary";

type Step = "time" | "review" | "celebrate";
type Day = "today" | "tomorrow" | "dayAfter";
type Period = "morning" | "afternoon" | "evening";

interface AppointmentModalProps {
  doctor: NearbyDoctor | null;
  report: HealthReport;
  language: LanguageCode;
  locality: string;
  patientName: string;
  onClose: () => void;
  onBooked: () => void;
}

const DAYS: Day[] = ["today", "tomorrow", "dayAfter"];
const PERIODS: Period[] = ["morning", "afternoon", "evening"];

const DAY_KEY: Record<Day, "bookingToday" | "bookingTomorrow" | "bookingDayAfter"> = {
  today: "bookingToday",
  tomorrow: "bookingTomorrow",
  dayAfter: "bookingDayAfter",
};
const PERIOD_KEY: Record<Period, "bookingMorning" | "bookingAfternoon" | "bookingEvening"> = {
  morning: "bookingMorning",
  afternoon: "bookingAfternoon",
  evening: "bookingEvening",
};

const CONFETTI = [
  { left: "8%", color: "#d97757", delay: "0s" },
  { left: "22%", color: "#22c55e", delay: "0.1s" },
  { left: "38%", color: "#c9a227", delay: "0.05s" },
  { left: "54%", color: "#e0785a", delay: "0.2s" },
  { left: "68%", color: "#8a4530", delay: "0.15s" },
  { left: "82%", color: "#e8a87c", delay: "0.25s" },
  { left: "30%", color: "#d97757", delay: "0.3s" },
  { left: "60%", color: "#22c55e", delay: "0.35s" },
];

function StatusDot({ lit }: { lit: boolean }) {
  return <span aria-hidden className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${lit ? "bg-green-500" : "bg-teal-200"}`} />;
}

export default function AppointmentModal({
  doctor,
  report,
  language,
  locality,
  patientName,
  onClose,
  onBooked,
}: AppointmentModalProps) {
  const [step, setStep] = useState<Step>("time");
  const [day, setDay] = useState<Day | null>(null);
  const [period, setPeriod] = useState<Period | null>(null);
  const [request, setRequest] = useState<AppointmentRequest | null>(null);
  const [notified, setNotified] = useState<NotifyChannel[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  // Portal-render into document.body once mounted: ReportView's parent wrapper carries
  // a (post-animation, non-"none") transform, which would otherwise turn this modal's
  // `fixed` positioning into something scoped to that scrollable card instead of the
  // viewport. Gated on mount so server-render output has no document-dependent branch.
  const [mounted, setMounted] = useState(false);

  const doctorLabel = doctor?.name || t(language, "doctorGenericLabel");
  const slotLabel = day && period ? `${t(language, DAY_KEY[day])} · ${t(language, PERIOD_KEY[period])}` : "";

  const previewPayload = useMemo(
    () => buildHandoffPayload({ report, patientName, language, locality, doctor, slotLabel }),
    [report, patientName, language, locality, doctor, slotLabel]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  function handlePrepare() {
    const payload = buildHandoffPayload({ report, patientName, language, locality, doctor, slotLabel });
    const handoffUrl = buildHandoffUrl(payload);
    const newRequest: AppointmentRequest = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      doctor,
      locality,
      slotLabel,
      patientName,
      handoffUrl,
      notifiedVia: [],
      clinicConfirmed: false,
    };
    saveAppointment(newRequest);
    setRequest(newRequest);
    setStep("celebrate");
    onBooked();
  }

  function handleNotify(channel: NotifyChannel) {
    if (!request) return;
    markNotified(request.id, channel);
    setNotified((prev) => (prev.includes(channel) ? prev : [...prev, channel]));
  }

  function handleConfirm() {
    if (!request) return;
    markConfirmed(request.id);
    setConfirmed(true);
  }

  async function handleCopy() {
    if (!request) return;
    try {
      await navigator.clipboard.writeText(request.handoffUrl);
      setCopied(true);
      handleNotify("copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — other real share paths (Call/WhatsApp) still work.
    }
  }

  async function handleShowQr() {
    if (!request || qrDataUrl) return;
    setQrLoading(true);
    try {
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(request.handoffUrl, { margin: 1, width: 220 });
      setQrDataUrl(dataUrl);
    } catch {
      // QR generation failing is non-critical — Call/WhatsApp/Copy remain available.
    } finally {
      setQrLoading(false);
    }
  }

  async function handleNativeShare() {
    if (!request) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: t(language, "handoffPageTitle"), url: request.handoffUrl });
        handleNotify("share");
      }
    } catch {
      // User cancelled the native share sheet — not an error.
    }
  }

  const whatsappHref = request ? buildWhatsAppUrl(request.handoffUrl, doctor?.phone) : "#";
  const hasPhone = looksLikePhoneNumber(doctor?.phone);
  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/40 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-modal-title"
        className="animate-slide-up-sheet relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-teal-500 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <X className="h-4 w-4" />
        </button>

        {step !== "celebrate" && (
          <div aria-hidden className="mb-5 flex items-center gap-2">
            <span
              className={`h-1.5 w-8 rounded-full transition-colors ${step === "time" ? "bg-teal-600" : "bg-teal-200"}`}
            />
            <span
              className={`h-1.5 w-8 rounded-full transition-colors ${step === "review" ? "bg-teal-600" : "bg-teal-200"}`}
            />
          </div>
        )}

        {step === "time" && (
          <div className="animate-fade-in-up">
            <h2 id="appointment-modal-title" className="pr-6 text-lg font-bold text-teal-950">
              {t(language, "bookingModalTitle", { doctor: doctorLabel })}
            </h2>
            <p className="mt-4 text-sm font-medium text-teal-700">{t(language, "bookingStepTime")}</p>

            <div role="radiogroup" aria-label={t(language, "bookingStepTime")} className="mt-3 flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={day === d}
                  onClick={() => setDay(d)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                    day === d
                      ? "border-teal-500 bg-teal-600 text-white shadow-sm"
                      : "border-teal-200 bg-white text-teal-700 hover:border-teal-400"
                  }`}
                >
                  {t(language, DAY_KEY[d])}
                </button>
              ))}
            </div>

            <div role="radiogroup" aria-label={t(language, "bookingStepTime")} className="mt-2.5 flex flex-wrap gap-2">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={period === p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                    period === p
                      ? "border-teal-500 bg-teal-600 text-white shadow-sm"
                      : "border-teal-200 bg-white text-teal-700 hover:border-teal-400"
                  }`}
                >
                  {t(language, PERIOD_KEY[p])}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!day || !period}
              onClick={() => setStep("review")}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-800 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              {t(language, "bookingStepReview")}
            </button>
          </div>
        )}

        {step === "review" && (
          <div className="animate-fade-in-up">
            <h2 id="appointment-modal-title" className="pr-6 text-lg font-bold text-teal-950">
              {t(language, "bookingStepReview")}
            </h2>
            <div className="mt-4 max-h-[50vh] overflow-y-auto rounded-2xl border border-teal-100">
              <HandoffSummary payload={previewPayload} />
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setStep("time")}
                className="rounded-2xl border border-teal-200 bg-white px-4 py-3 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                {t(language, "bookingBack")}
              </button>
              <button
                type="button"
                onClick={handlePrepare}
                className="flex-1 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-800 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                {t(language, "bookingPrepareRequest")}
              </button>
            </div>
          </div>
        )}

        {step === "celebrate" && request && (
          <div className="animate-fade-in-up flex flex-col items-center text-center">
            <div className="relative mb-1 flex h-20 w-20 items-center justify-center">
              <span aria-hidden className="animate-confirm-pulse-ring absolute inset-0 rounded-full bg-green-500/40" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
                  <path
                    className="animate-check-draw"
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {CONFETTI.map((c, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="animate-confetti-fall absolute h-2 w-2 rounded-sm"
                  style={{ left: c.left, top: "10%", backgroundColor: c.color, animationDelay: c.delay }}
                />
              ))}
            </div>

            <h2 id="appointment-modal-title" className="mt-3 text-lg font-bold text-teal-950">
              {t(language, "bookingCelebrateTitle")}
            </h2>
            <p className="mt-1 text-sm text-teal-600">{slotLabel}</p>

            <p className="mt-4 text-sm leading-relaxed text-teal-700">
              {t(language, "bookingHonestyNote", { doctor: doctorLabel })}
            </p>

            <div className="mt-4 grid w-full grid-cols-2 gap-2">
              {hasPhone && (
                <a
                  href={buildTelHref(doctor!.phone)}
                  onClick={() => handleNotify("call")}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
                >
                  <Phone className="h-4 w-4" /> {t(language, "doctorCallButton")}
                </a>
              )}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleNotify("whatsapp")}
                className={`flex items-center justify-center gap-1.5 rounded-xl bg-green-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 ${!hasPhone ? "col-span-2" : ""}`}
              >
                <MessageCircle className="h-4 w-4" /> {t(language, "bookingShareWhatsapp")}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-teal-200 bg-white px-3 py-2.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t(language, "bookingCopied") : t(language, "bookingCopyLink")}
              </button>
              {canShare && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-teal-200 bg-white px-3 py-2.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50"
                >
                  <Share2 className="h-4 w-4" /> {t(language, "bookingShareNative")}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleShowQr}
              className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-teal-600 underline-offset-2 hover:underline"
            >
              <QrCode className="h-3.5 w-3.5" /> {qrLoading ? "…" : t(language, "bookingShowQr")}
            </button>

            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="" className="mt-3 h-40 w-40 rounded-xl border border-teal-100 p-1" />
            )}

            <a
              href={request.handoffUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-1.5 text-xs font-medium text-teal-600 underline-offset-2 hover:underline"
            >
              <FileText className="h-3.5 w-3.5" /> {t(language, "bookingOpenSummary")}
            </a>

            <div className="mt-5 w-full rounded-2xl border border-teal-100 bg-teal-50/40 p-3.5 text-left">
              <div className="flex items-center gap-2">
                <StatusDot lit /> <span className="text-xs font-medium text-teal-800">{t(language, "bookingStatusPrepared")}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <StatusDot lit={notified.length > 0} />
                <span className="text-xs font-medium text-teal-800">{t(language, "bookingStatusNotified")}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StatusDot lit={confirmed} />
                  <span className="text-xs font-medium text-teal-800">{t(language, "bookingStatusConfirmed")}</span>
                </div>
                {!confirmed && (
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="text-xs font-medium text-teal-600 underline-offset-2 hover:underline"
                  >
                    {t(language, "bookingMarkConfirmed")}
                  </button>
                )}
              </div>
              {confirmed && (
                <p className="mt-1.5 text-[11px] italic text-teal-500">{t(language, "bookingConfirmedSelfReported")}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
