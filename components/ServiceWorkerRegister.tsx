"use client";

import { useEffect } from "react";

/** Registers the minimal runtime-cache service worker (public/sw.js) — feature-detected,
 *  fails silently on browsers without support. Renders nothing. */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failing (e.g. unsupported context) is non-critical — the app
        // works identically without it, just without the offline page-shell cache.
      });
    }
  }, []);
  return null;
}
