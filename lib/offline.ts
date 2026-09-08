import { useEffect, useState } from "react";

const FORCE_OFFLINE_KEY = "sehat-saathi-force-offline";

/** Reads the demo "force offline" flag, persisted so it survives navigating between routes. */
export function getForceOffline(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(FORCE_OFFLINE_KEY) === "1";
}

export function setForceOffline(value: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FORCE_OFFLINE_KEY, value ? "1" : "0");
}

/** Tracks navigator.onLine, updated live via the online/offline window events. */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return online;
}
