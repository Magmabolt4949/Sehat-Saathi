"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { t, type LanguageCode } from "@/lib/i18n";
import {
  createSymptomRecognizer,
  isVoiceInputSupported,
  type SymptomRecognizer,
  type VoiceRecognitionErrorType,
} from "@/lib/speech";

interface VoiceInputButtonProps {
  language: LanguageCode;
  /** True while the app is in (real or demo-forced) offline mode — recognition needs internet. */
  offline?: boolean;
  onAppendText: (text: string) => void;
}

const ERROR_KEY: Record<VoiceRecognitionErrorType, "voiceErrorPermission" | "voiceErrorNoSpeech" | "voiceErrorNetwork" | "voiceErrorGeneric"> = {
  permission: "voiceErrorPermission",
  "no-speech": "voiceErrorNoSpeech",
  network: "voiceErrorNetwork",
  other: "voiceErrorGeneric",
};

export default function VoiceInputButton({ language, offline, onAppendText }: VoiceInputButtonProps) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognizerRef = useRef<SymptomRecognizer | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(isVoiceInputSupported());
    return () => recognizerRef.current?.stop();
  }, []);

  function handleStart() {
    setError(null);
    setInterim("");
    const recognizer = createSymptomRecognizer(language, {
      onInterim: setInterim,
      onFinal: (text) => {
        onAppendText(text);
        setInterim("");
      },
      onError: (type) => {
        setError(t(language, ERROR_KEY[type]));
        setListening(false);
      },
      onEnd: () => {
        setListening(false);
        setInterim("");
      },
    });
    if (!recognizer) {
      setSupported(false);
      return;
    }
    recognizerRef.current = recognizer;
    recognizer.start();
    setListening(true);
  }

  function handleStop() {
    recognizerRef.current?.stop();
    setListening(false);
  }

  if (offline) {
    return (
      <span className="flex items-center gap-1 text-[11px] font-medium text-teal-400" title={t(language, "voiceOfflineUnavailable")}>
        <Mic className="h-3.5 w-3.5 opacity-50" />
      </span>
    );
  }

  if (!supported) return null;

  return (
    <div className="absolute right-2.5 top-2.5 flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={listening ? handleStop : handleStart}
        aria-label={listening ? t(language, "voiceStop") : t(language, "voiceStart")}
        aria-pressed={listening}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1 ${
          listening
            ? "animate-confirm-pulse-ring bg-rose-500 text-white shadow-sm"
            : "bg-white text-teal-500 shadow-sm hover:bg-teal-50 hover:text-teal-600"
        }`}
      >
        {listening ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-4 w-4" />}
      </button>
      {listening && (
        <span className="max-w-[180px] truncate rounded-full bg-teal-950/80 px-2.5 py-1 text-[11px] italic text-white">
          {interim || t(language, "voiceListening")}
        </span>
      )}
      {error && (
        <span role="alert" className="max-w-[200px] rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] text-rose-600">
          {error}
        </span>
      )}
    </div>
  );
}
