"use client";

import { useRef, useState } from "react";
import {
  Bone,
  HeartPulse,
  Scan,
  FileText,
  Plus,
  X,
  Loader2,
  UploadCloud,
  MapPin,
  Globe,
} from "lucide-react";
import type { ImageLabel, UploadedImage } from "@/lib/types";
import { t, LANGUAGES, type LanguageCode, type TranslationKey } from "@/lib/i18n";

const LABELS: ImageLabel[] = ["X-Ray", "ECG", "Skin / Injury Photo", "Other Scan", "Prescription"];
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 6;

const LABEL_ICON: Record<ImageLabel, React.ElementType> = {
  "X-Ray": Bone,
  ECG: HeartPulse,
  "Skin / Injury Photo": Scan,
  "Other Scan": Scan,
  Prescription: FileText,
};

const LABEL_TRANSLATION_KEY: Record<ImageLabel, TranslationKey> = {
  "X-Ray": "labelXray",
  ECG: "labelEcg",
  "Skin / Injury Photo": "labelSkin",
  "Other Scan": "labelOther",
  Prescription: "labelPrescription",
};

interface PendingImage {
  id: string;
  file: File;
  previewUrl: string;
  label: ImageLabel;
}

interface UploadPanelProps {
  onSubmit: (images: UploadedImage[], symptoms: string) => void;
  loading: boolean;
  language: LanguageCode;
  onLanguageChange: (value: LanguageCode) => void;
  locality: string;
  onLocalityChange: (value: string) => void;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UploadPanel({
  onSubmit,
  loading,
  language,
  onLanguageChange,
  locality,
  onLocalityChange,
}: UploadPanelProps) {
  const [images, setImages] = useState<PendingImage[]>([]);
  const [symptoms, setSymptoms] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    setError(null);
    const incoming = Array.from(fileList);

    if (images.length + incoming.length > MAX_IMAGES) {
      setError(`You can add up to ${MAX_IMAGES} images.`);
      return;
    }

    for (const file of incoming) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are supported (JPG, PNG, WEBP).");
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setError(`"${file.name}" is larger than 5MB. Please use a smaller image.`);
        continue;
      }
      setImages((prev) => [
        ...prev,
        {
          id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          label: "Other Scan",
        },
      ]);
    }
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  }

  function updateLabel(id: string, label: ImageLabel) {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, label } : img)));
  }

  async function handleSubmit() {
    if (loading) return;
    if (images.length === 0 && !symptoms.trim()) {
      setError("Add a photo or describe your symptoms to continue.");
      return;
    }
    setError(null);
    const uploaded: UploadedImage[] = await Promise.all(
      images.map(async (img) => ({
        label: img.label,
        mediaType: img.file.type,
        base64: await fileToBase64(img.file),
      }))
    );
    onSubmit(uploaded, symptoms.trim());
  }

  return (
    <div className="w-full max-w-2xl rounded-3xl border border-teal-100 bg-white/80 p-6 shadow-lg shadow-teal-900/5 backdrop-blur-sm sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-teal-950">{t(language, "formTitle")}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-teal-600">{t(language, "formSubtitle")}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`mt-5 grid grid-cols-2 gap-3 rounded-2xl p-1 transition-colors sm:grid-cols-3 ${
          dragActive ? "bg-teal-50 ring-2 ring-teal-300" : ""
        }`}
      >
        {images.map((img) => {
          const Icon = LABEL_ICON[img.label];
          return (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-24 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.previewUrl} alt={img.label} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-1.5">
                  <span className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    <Icon className="h-3 w-3" />
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-rose-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <select
                value={img.label}
                onChange={(e) => updateLabel(img.id, e.target.value as ImageLabel)}
                aria-label="Image type"
                className="w-full cursor-pointer truncate border-t border-teal-100 bg-teal-50/50 px-2 py-1.5 text-[11px] font-medium text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"
              >
                {LABELS.map((l) => (
                  <option key={l} value={l}>
                    {t(language, LABEL_TRANSLATION_KEY[l])}
                  </option>
                ))}
              </select>
            </div>
          );
        })}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-[104px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-teal-200 text-teal-500 transition-colors hover:border-teal-400 hover:bg-teal-50/50 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            {dragActive ? (
              <UploadCloud className="h-6 w-6" />
            ) : (
              <Plus className="h-6 w-6" strokeWidth={1.75} />
            )}
            <span className="text-xs font-medium">{t(language, "addPhoto")}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <textarea
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        placeholder={t(language, "symptomsPlaceholder")}
        rows={4}
        className="mt-5 w-full resize-none rounded-2xl border border-teal-100 bg-teal-50/30 p-3.5 text-sm text-teal-900 placeholder:text-teal-400 transition-colors focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-100"
      />

      <div className="mt-3">
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-teal-600">
          <MapPin className="h-3.5 w-3.5" />
          {t(language, "localityLabel")}
        </label>
        <input
          type="text"
          value={locality}
          onChange={(e) => onLocalityChange(e.target.value)}
          placeholder={t(language, "localityPlaceholder")}
          className="w-full rounded-2xl border border-teal-100 bg-teal-50/30 p-3 text-sm text-teal-900 placeholder:text-teal-400 transition-colors focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-100"
        />
      </div>

      {error && (
        <p role="alert" className="mt-2.5 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {error}
        </p>
      )}

      <div className="mt-5">
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-teal-600">
          <Globe className="h-3.5 w-3.5" />
          {t(language, "languageLabel")}
        </label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
          className="w-full cursor-pointer rounded-2xl border border-teal-100 bg-teal-50/30 p-3 text-sm font-medium text-teal-900 transition-colors focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-100"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeLabel} ({l.label})
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-800 bg-[length:200%_auto] py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-700/20 transition-all hover:bg-right hover:shadow-lg hover:shadow-teal-700/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? t(language, "analyzing") : t(language, "analyze")}
      </button>
    </div>
  );
}
