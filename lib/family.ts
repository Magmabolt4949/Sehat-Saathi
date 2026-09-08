import type { FamilyMember } from "@/lib/types";
import type { AvatarGender, AvatarAgeGroup } from "@/lib/avatars";
import { sortPersonasByPreference } from "@/lib/avatars";

const FAMILY_KEY = "sehat-saathi-family";
const ACTIVE_MEMBER_KEY = "sehat-saathi-active-member-id";
/** Never written to again after migration, and never removed — an inert forever-fallback. */
const LEGACY_PROFILE_KEY = "sehat-saathi-profile";

export const MAX_MEMBERS = 10;
const GENDERS: AvatarGender[] = ["female", "male", "neutral"];
const AGE_GROUPS: AvatarAgeGroup[] = ["young", "adult", "senior"];

function isGender(v: unknown): v is AvatarGender {
  return typeof v === "string" && (GENDERS as string[]).includes(v);
}

function isAgeGroup(v: unknown): v is AvatarAgeGroup {
  return typeof v === "string" && (AGE_GROUPS as string[]).includes(v);
}

function readMembers(): FamilyMember[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAMILY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeMembers(members: FamilyMember[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FAMILY_KEY, JSON.stringify(members));
  } catch {
    // localStorage quota exceeded or unavailable — fail soft, same idiom used elsewhere
    // (clipboard writes, QR generation) rather than throwing and breaking the flow.
  }
}

/**
 * Defensively coerces a legacy `sehat-saathi-profile` value (the pre-family-profiles
 * {name, gender, ageGroup, personaId} shape) into a FamilyMember. Only returns null when
 * `raw` truly isn't a usable object — every individual field gets its own safe fallback
 * rather than rejecting the whole thing, matching lib/handoff.ts's decode idiom.
 */
function sanitizeLegacyProfile(raw: unknown): FamilyMember | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const gender = isGender(obj.gender) ? obj.gender : null;
  const ageGroup = isAgeGroup(obj.ageGroup) ? obj.ageGroup : null;
  const personaId =
    typeof obj.personaId === "string" && obj.personaId
      ? obj.personaId
      : sortPersonasByPreference(gender, ageGroup)[0].id;
  return {
    id: crypto.randomUUID(),
    name: typeof obj.name === "string" ? obj.name : "",
    gender,
    ageGroup,
    personaId,
    relationship: "self",
    createdAt: new Date().toISOString(),
  };
}

export interface FamilyLoadResult {
  members: FamilyMember[];
  activeId: string | null;
}

/**
 * Loads the family member list, migrating the legacy single-profile key exactly once.
 *
 * The idempotency check is the single highest-stakes line in this file: once
 * `sehat-saathi-family` exists at all — even as an empty array — the legacy key is never
 * consulted again. Weakening that check (e.g. re-deriving from the legacy key whenever
 * `members` is empty) would silently resurrect a deleted member on next load.
 */
export function getOrMigrateFamily(): FamilyLoadResult {
  if (typeof window === "undefined") return { members: [], activeId: null };

  const raw = window.localStorage.getItem(FAMILY_KEY);
  if (raw !== null) {
    const members = readMembers();
    const saved = window.localStorage.getItem(ACTIVE_MEMBER_KEY);
    const activeId = saved && members.some((m) => m.id === saved) ? saved : (members[0]?.id ?? null);
    return { members, activeId };
  }

  const legacyRaw = window.localStorage.getItem(LEGACY_PROFILE_KEY);
  if (legacyRaw) {
    try {
      const migrated = sanitizeLegacyProfile(JSON.parse(legacyRaw));
      if (migrated) {
        writeMembers([migrated]);
        window.localStorage.setItem(ACTIVE_MEMBER_KEY, migrated.id);
        return { members: [migrated], activeId: migrated.id };
      }
    } catch {
      // legacyRaw isn't valid JSON — leave it untouched in storage and fall through to
      // a genuine first-run below, rather than writing "[]" and locking out recovery.
    }
  }

  return { members: [], activeId: null };
}

export function getActiveMemberId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_MEMBER_KEY);
}

export function setActiveMemberId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVE_MEMBER_KEY, id);
}

export function addFamilyMember(
  draft: Omit<FamilyMember, "id" | "createdAt">
): { member: FamilyMember } | { error: "limit_reached" } {
  const members = readMembers();
  if (members.length >= MAX_MEMBERS) return { error: "limit_reached" };
  const member: FamilyMember = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  writeMembers([...members, member]);
  return { member };
}

export function updateFamilyMember(id: string, patch: Partial<Omit<FamilyMember, "id" | "createdAt">>) {
  writeMembers(readMembers().map((m) => (m.id === id ? { ...m, ...patch } : m)));
}

/** Storage-layer removal only — deciding the next active member is the caller's job. */
export function removeFamilyMember(id: string) {
  writeMembers(readMembers().filter((m) => m.id !== id));
}

export function getFamilyMembers(): FamilyMember[] {
  return readMembers();
}
