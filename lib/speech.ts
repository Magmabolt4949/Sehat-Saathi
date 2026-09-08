import type { LanguageCode } from "@/lib/i18n";

/** BCP-47 recognition locales for each supported app language. */
const RECOGNITION_LOCALE: Record<LanguageCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  te: "te-IN",
  ta: "ta-IN",
  gu: "gu-IN",
  ur: "ur-IN",
  kn: "kn-IN",
  or: "or-IN",
  ml: "ml-IN",
  pa: "pa-IN",
};

export function speechLocaleFor(lang: LanguageCode): string {
  return RECOGNITION_LOCALE[lang] ?? "en-IN";
}

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isVoiceInputSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export type VoiceRecognitionErrorType = "permission" | "no-speech" | "network" | "other";

interface SymptomRecognizerCallbacks {
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onError: (type: VoiceRecognitionErrorType) => void;
  onEnd: () => void;
}

export interface SymptomRecognizer {
  start: () => void;
  stop: () => void;
}

/**
 * Push-to-talk, single-utterance recognizer (continuous = false) — deliberate, not an
 * oversight: a shared, loud hackathon hall is exactly the acoustic environment where
 * always-on listening would pick up crowd noise or a neighboring team's pitch into a
 * health-symptom field. The caller decides when to start(); recognition ends on its own
 * after one utterance, or via stop().
 */
export function createSymptomRecognizer(
  lang: LanguageCode,
  { onInterim, onFinal, onError, onEnd }: SymptomRecognizerCallbacks
): SymptomRecognizer | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;

  const recognition = new Ctor();
  recognition.lang = speechLocaleFor(lang);
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let finalText = "";
    let interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) finalText += result[0].transcript;
      else interimText += result[0].transcript;
    }
    if (interimText) onInterim(interimText);
    if (finalText) onFinal(finalText);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    if (event.error === "not-allowed" || event.error === "service-not-allowed") onError("permission");
    else if (event.error === "no-speech") onError("no-speech");
    else if (event.error === "network") onError("network");
    else onError("other");
  };

  recognition.onend = () => onEnd();

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
  };
}
