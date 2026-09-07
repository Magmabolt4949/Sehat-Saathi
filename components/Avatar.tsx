"use client";

import { useId, useRef, useState } from "react";
import { Globe, ShieldCheck, Zap, ChevronDown, Check } from "lucide-react";
import {
  AVATAR_PERSONAS,
  DEFAULT_PERSONA_ID,
  getPersona,
  getPersonaAvatarUri,
  getPersonaAccent,
} from "@/lib/avatars";
import { t, type LanguageCode } from "@/lib/i18n";

export type AvatarState = "idle" | "listening" | "thinking" | "talking" | "concerned" | "celebrating";

const STATE_CAPTION: Record<AvatarState, string> = {
  idle: "I'm here whenever you're ready.",
  listening: "Listening...",
  thinking: "Analyzing your reports...",
  talking: "Here's what I found.",
  concerned: "This looks urgent — please read carefully.",
  celebrating: "Wonderful — all set!",
};

const RAINBOW = "#d97757, #e8a87c, #c9a227, #b85c3f, #e0785a, #8a4530, #d97757";

const SPARKLE_DOTS = [
  { top: "2%", left: "48%", color: "#d97757", delay: "0s" },
  { top: "18%", left: "92%", color: "#e8a87c", delay: "0.4s" },
  { top: "78%", left: "94%", color: "#c9a227", delay: "0.8s" },
  { top: "92%", left: "40%", color: "#b85c3f", delay: "1.2s" },
  { top: "70%", left: "0%", color: "#8a4530", delay: "1.6s" },
  { top: "14%", left: "2%", color: "#e0785a", delay: "2s" },
];

const MAX_TILT_DEG = 8;

interface AvatarProps {
  state: AvatarState;
  caption?: string;
  personaId?: string;
  onPersonaChange?: (id: string) => void;
  language?: LanguageCode;
}

export default function Avatar({
  state,
  caption,
  personaId = DEFAULT_PERSONA_ID,
  onPersonaChange,
  language = "en",
}: AvatarProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const pickerId = useId();
  const persona = getPersona(personaId);
  const accent =
    state === "concerned" ? "#e11d48" : state === "celebrating" ? "#22c55e" : getPersonaAccent(personaId);
  const ringSpeed =
    state === "thinking" ? "1.4s" : state === "concerned" ? "2s" : state === "celebrating" ? "1s" : "7s";
  const floatClass = state === "thinking" ? "" : "animate-avatar-float";

  const badges = [
    { icon: Globe, label: t(language, "badgeLanguages"), color: "#d97757" },
    { icon: ShieldCheck, label: t(language, "badgePrivate"), color: "#22c55e" },
    { icon: Zap, label: t(language, "badgeInstant"), color: "#c9a227" },
  ];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * MAX_TILT_DEG * 2, y: px * MAX_TILT_DEG * 2 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="card-tilt w-full max-w-xs rounded-3xl border border-teal-100 bg-white/85 p-5 shadow-xl shadow-teal-900/10 backdrop-blur-sm sm:p-6"
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      <div className="flex flex-col items-center gap-3 select-none">
        <div className="relative flex h-52 w-52 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full opacity-90 blur-xl animate-avatar-spin"
            style={{ background: `conic-gradient(from 0deg, ${RAINBOW})`, animationDuration: ringSpeed }}
          />
          <span
            aria-hidden
            className="absolute inset-2 rounded-full opacity-95 blur-[2px] animate-avatar-spin"
            style={{
              background: `conic-gradient(from 45deg, ${RAINBOW})`,
              animationDuration: ringSpeed,
            }}
          />
          <span
            aria-hidden
            className="absolute inset-5 rounded-full animate-avatar-spin"
            style={{
              background: `conic-gradient(from 200deg, ${RAINBOW})`,
              animationDuration: ringSpeed,
              animationDirection: "reverse",
              opacity: 0.6,
            }}
          />
          <span aria-hidden className="absolute inset-8 rounded-full bg-white shadow-inner" />

          {SPARKLE_DOTS.map((dot, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute h-2.5 w-2.5 rounded-full animate-avatar-float"
              style={{
                top: dot.top,
                left: dot.left,
                backgroundColor: dot.color,
                animationDelay: dot.delay,
                boxShadow: `0 0 8px ${dot.color}`,
              }}
            />
          ))}

          {(state === "thinking" || state === "listening" || state === "concerned" || state === "celebrating") && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full animate-avatar-pulse-ring"
              style={{ backgroundColor: accent, opacity: 0.35 }}
            />
          )}

          <span
            aria-hidden
            className="animate-shadow-float absolute bottom-3 h-6 w-24 rounded-full bg-teal-950 blur-md"
          />

          <div className={`relative h-32 w-32 sm:h-36 sm:w-36 ${floatClass}`}>
            <div
              className={`h-full w-full overflow-hidden rounded-full border-4 border-white shadow-xl transition-transform ${
                state === "talking" || state === "celebrating" ? "animate-avatar-talk-bounce" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPersonaAvatarUri(personaId)}
                alt={`${persona.name}, your AI health companion`}
                className="h-full w-full object-cover"
              />
            </div>

            <span
              aria-hidden
              className="animate-status-pulse absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white bg-green-500"
            />

            {state === "listening" && (
              <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-1" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-3 w-1 rounded-full bg-teal-500 animate-avatar-listen-bar"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <h2 className="text-lg font-bold text-teal-950">{persona.name}</h2>

        <p
          role="status"
          aria-live="polite"
          className={`min-h-10 text-center text-sm font-medium ${
            state === "concerned" ? "text-rose-600" : state === "celebrating" ? "text-green-600" : "text-teal-700"
          }`}
        >
          {caption ?? STATE_CAPTION[state]}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {badges.map((badge, i) => (
            <span
              key={i}
              className="shine-sweep flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium"
              style={{ borderColor: `${badge.color}40`, backgroundColor: `${badge.color}14`, color: badge.color }}
            >
              <badge.icon className="h-3 w-3" aria-hidden />
              {badge.label}
            </span>
          ))}
        </div>

        {onPersonaChange && (
          <div className="w-full pt-1">
            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              aria-expanded={pickerOpen}
              aria-controls={pickerId}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-teal-200 bg-white px-4 py-2 text-xs font-semibold text-teal-700 shadow-sm transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              {t(language, "changeCompanion")}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${pickerOpen ? "rotate-180" : ""}`} />
            </button>

            {pickerOpen && (
              <div
                id={pickerId}
                role="radiogroup"
                aria-label={t(language, "changeCompanion")}
                className="animate-fade-in-up mt-3 grid grid-cols-2 gap-2"
              >
                {AVATAR_PERSONAS.map((p) => {
                  const selected = p.id === personaId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={p.name}
                      onClick={() => {
                        onPersonaChange(p.id);
                        setPickerOpen(false);
                      }}
                      className={`group relative flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1 ${
                        selected ? "border-transparent bg-teal-50" : "border-teal-100 bg-white hover:border-teal-300"
                      }`}
                      style={selected ? { boxShadow: `0 0 0 2px ${p.accent}` } : undefined}
                    >
                      {selected && (
                        <span
                          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-white"
                          style={{ backgroundColor: p.accent }}
                        >
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                      <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <span className="text-[11px] font-medium text-teal-800">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
