"use client";

import { useEffect, useState } from "react";
import { WifiOff, Download, Trash2, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { t, type LanguageCode } from "@/lib/i18n";
import {
  isWebGPUSupported,
  isModelDownloaded,
  downloadModel,
  deleteModel,
  OFFLINE_MODEL_SIZE_LABEL,
} from "@/lib/webllm";

interface OfflineAIPanelProps {
  language: LanguageCode;
  forceOffline: boolean;
  onForceOfflineChange: (value: boolean) => void;
}

export default function OfflineAIPanel({ language, forceOffline, onForceOfflineChange }: OfflineAIPanelProps) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [downloaded, setDownloaded] = useState<boolean | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const gpu = isWebGPUSupported();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(gpu);
    if (gpu) {
      isModelDownloaded().then(setDownloaded);
    } else {
      setDownloaded(false);
    }
  }, []);

  async function handleDownload() {
    setError(null);
    setDownloading(true);
    setProgress(0);
    try {
      await downloadModel((p) => setProgress(p));
      setDownloaded(true);
    } catch {
      setError(t(language, "offlineDownloadError"));
    } finally {
      setDownloading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(t(language, "offlineDeleteConfirm"))) return;
    await deleteModel();
    setDownloaded(false);
  }

  return (
    <div className="w-full max-w-2xl rounded-3xl border border-teal-100 bg-white/80 p-6 shadow-lg shadow-teal-900/5 backdrop-blur-sm sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-teal-950">
        <WifiOff className="h-5 w-5 text-amber-600" />
        {t(language, "offlinePageTitle")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-teal-700">{t(language, "offlineExplain")}</p>

      {supported === false && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-rose-50 p-3.5 text-sm text-rose-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {t(language, "offlineNotSupported")}
        </p>
      )}

      {supported && (
        <>
          <p className="mt-3 text-xs text-teal-500">{t(language, "offlineRequiresGpu")}</p>

          {downloaded === false && !downloading && (
            <button
              type="button"
              onClick={handleDownload}
              className="mt-5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <Download className="h-4 w-4" />
              {t(language, "offlineDownloadCta", { size: OFFLINE_MODEL_SIZE_LABEL })}
            </button>
          )}

          {downloading && (
            <div className="mt-5">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-teal-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-700 transition-all"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-teal-600">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t(language, "offlineDownloading", { percent: String(Math.round(progress * 100)) })}
              </p>
            </div>
          )}

          {downloaded === true && (
            <div className="mt-5 space-y-3">
              <p className="flex items-center gap-2 rounded-2xl bg-green-50 p-3.5 text-sm font-medium text-green-700">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                {t(language, "offlineReady")}
              </p>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-xl border border-teal-200 bg-white px-3.5 py-2 text-xs font-medium text-teal-600 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                <Trash2 className="h-3.5 w-3.5" /> {t(language, "offlineDeleteModel")}
              </button>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </p>
          )}
        </>
      )}

      <div className="mt-6 border-t border-teal-100 pt-5">
        <label className="flex items-center gap-2.5 text-sm font-medium text-teal-700">
          <input
            type="checkbox"
            checked={forceOffline}
            onChange={(e) => onForceOfflineChange(e.target.checked)}
            className="h-4 w-4 rounded border-teal-300 text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          />
          {t(language, "offlineForceToggleLabel")}
        </label>
        <p className="mt-1 pl-6 text-xs text-teal-500">{t(language, "offlineForceToggleHint")}</p>
      </div>
    </div>
  );
}
