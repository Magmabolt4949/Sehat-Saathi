import type { AppointmentRequest, NotifyChannel } from "@/lib/types";

const APPOINTMENTS_KEY = "sehat-saathi-appointments";
const TTL_DAYS = 14;

function isExpired(req: AppointmentRequest): boolean {
  const ageMs = Date.now() - new Date(req.createdAt).getTime();
  return ageMs > TTL_DAYS * 24 * 60 * 60 * 1000;
}

function readAll(): AppointmentRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(APPOINTMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(requests: AppointmentRequest[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(requests));
}

/** Returns saved appointment requests, newest first, quietly sweeping anything past the TTL. */
export function getAppointments(): AppointmentRequest[] {
  const all = readAll();
  const fresh = all.filter((r) => !isExpired(r));
  if (fresh.length !== all.length) writeAll(fresh);
  return [...fresh].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveAppointment(request: AppointmentRequest) {
  const all = readAll();
  writeAll([request, ...all]);
}

/** Records that the patient actually tapped a real send action — self-reported, never automatic. */
export function markNotified(id: string, channel: NotifyChannel) {
  const all = readAll();
  writeAll(
    all.map((r) =>
      r.id === id && !r.notifiedVia.includes(channel)
        ? { ...r, notifiedVia: [...r.notifiedVia, channel] }
        : r
    )
  );
}

/** Only ever set by the patient's own manual toggle — never inferred or auto-filled. */
export function markConfirmed(id: string) {
  const all = readAll();
  writeAll(all.map((r) => (r.id === id ? { ...r, clinicConfirmed: true } : r)));
}

export function removeAppointment(id: string) {
  writeAll(readAll().filter((r) => r.id !== id));
}

export function clearAppointments() {
  writeAll([]);
}
