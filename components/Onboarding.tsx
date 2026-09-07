"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import {
  sortPersonasByPreference,
  type AvatarGender,
  type AvatarAgeGroup,
} from "@/lib/avatars";

export interface UserProfile {
  name: string;
  gender: AvatarGender | null;
  ageGroup: AvatarAgeGroup | null;
  personaId: string;
}

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const GENDER_OPTIONS: { value: AvatarGender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "neutral", label: "Prefer not to say" },
];

const AGE_OPTIONS: { value: AvatarAgeGroup; label: string }[] = [
  { value: "young", label: "Under 18" },
  { value: "adult", label: "18–59" },
  { value: "senior", label: "60+" },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<"details" | "avatar">("details");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<AvatarGender | null>(null);
  const [ageGroup, setAgeGroup] = useState<AvatarAgeGroup | null>(null);
  const [personaId, setPersonaId] = useState<string | null>(null);

  const orderedPersonas = sortPersonasByPreference(gender, ageGroup);

  function handleFinish() {
    onComplete({
      name: name.trim(),
      gender,
      ageGroup,
      personaId: personaId ?? orderedPersonas[0].id,
    });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-teal-50 via-white to-teal-100/50 px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-teal-200/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-1/3 h-64 w-64 rounded-full bg-amber-200/25 blur-3xl"
      />

      <div className="relative w-full max-w-lg rounded-3xl border border-teal-100 bg-white/85 p-7 shadow-xl shadow-teal-900/10 backdrop-blur-sm sm:p-9">
        <p className="sr-only" role="status">
          Step {step === "details" ? "1" : "2"} of 2: {step === "details" ? "Your details" : "Choose your companion"}
        </p>
        <div aria-hidden className="mb-6 flex items-center justify-center gap-2">
          <span
            className={`h-1.5 w-8 rounded-full transition-colors ${step === "details" ? "bg-teal-600" : "bg-teal-200"}`}
          />
          <span
            className={`h-1.5 w-8 rounded-full transition-colors ${step === "avatar" ? "bg-teal-600" : "bg-teal-200"}`}
          />
        </div>

        {step === "details" ? (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center gap-2 text-center">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h1 className="text-2xl font-bold tracking-tight text-teal-950">
                Let&apos;s get to know you
              </h1>
            </div>
            <p className="mt-2 text-center text-sm text-teal-600">
              🩺 Sehat Saathi · Your AI Health Companion — a couple of quick details help us
              personalize your experience.
            </p>

            <div className="mt-7 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-teal-700">
                  What should we call you?
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-teal-100 bg-teal-50/30 p-3.5 text-sm text-teal-900 placeholder:text-teal-400 transition-colors focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-100"
                />
              </div>

              <div role="radiogroup" aria-label="Gender">
                <label className="mb-1.5 block text-sm font-medium text-teal-700">Gender</label>
                <div className="flex flex-wrap gap-2">
                  {GENDER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={gender === opt.value}
                      onClick={() => setGender(opt.value)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                        gender === opt.value
                          ? "border-teal-500 bg-teal-600 text-white shadow-sm"
                          : "border-teal-200 bg-white text-teal-700 hover:border-teal-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div role="radiogroup" aria-label="Age group">
                <label className="mb-1.5 block text-sm font-medium text-teal-700">Age group</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={ageGroup === opt.value}
                      onClick={() => setAgeGroup(opt.value)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                        ageGroup === opt.value
                          ? "border-teal-500 bg-teal-600 text-white shadow-sm"
                          : "border-teal-200 bg-white text-teal-700 hover:border-teal-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep("avatar")}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-800 py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all hover:shadow-lg hover:shadow-teal-600/30 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <h1 className="text-center text-2xl font-bold tracking-tight text-teal-950">
              Choose your companion
            </h1>
            <p className="mt-2 text-center text-sm text-teal-600">
              Pick the AI health companion you&apos;d like by your side. You can change this
              anytime.
            </p>

            <div role="radiogroup" aria-label="Choose your companion" className="mt-7 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              {orderedPersonas.map((persona) => {
                const selected = (personaId ?? orderedPersonas[0].id) === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={persona.name}
                    onClick={() => setPersonaId(persona.id)}
                    className={`group relative flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                      selected
                        ? "border-transparent bg-teal-50 shadow-lg"
                        : "border-teal-100 bg-white hover:border-teal-300"
                    }`}
                    style={
                      selected
                        ? { boxShadow: `0 0 0 2px ${persona.accent}, 0 8px 20px -6px ${persona.accent}66` }
                        : undefined
                    }
                  >
                    {selected && (
                      <span
                        className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-white shadow"
                        style={{ backgroundColor: persona.accent }}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-white sm:h-20 sm:w-20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={persona.image} alt={persona.name} className="h-full w-full object-cover" />
                    </div>
                    <span className="text-xs font-medium text-teal-800">{persona.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex gap-2">
              <button
                type="button"
                onClick={() => setStep("details")}
                className="rounded-2xl border border-teal-200 bg-white px-5 py-3.5 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-800 py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all hover:shadow-lg hover:shadow-teal-600/30 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                Let&apos;s go
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
