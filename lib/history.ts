import type { HealthReport, HistoryEntry, AISource, PriorHistoryItem } from "@/lib/types";

const HISTORY_KEY = "sehat-saathi-history";
/** Not a calendar TTL like appointments — a past health record isn't perishable, so we
 *  bound storage by count instead, per member, and never touch other members' entries. */
const MAX_ENTRIES_PER_MEMBER = 20;

function readAll(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // Quota exceeded — fail soft rather than crash the diagnose flow that triggered this.
  }
}

/** Newest first. Omit memberId for a combined, interleaved family feed. */
export function getHistory(memberId?: string): HistoryEntry[] {
  const all = readAll();
  const filtered = memberId ? all.filter((e) => e.memberId === memberId) : all;
  return [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Saves an entry and prunes only that member's oldest entries past the per-member cap. */
export function saveHistoryEntry(entry: HistoryEntry) {
  const all = [entry, ...readAll()];
  const forMember = all.filter((e) => e.memberId === entry.memberId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const keepIds = new Set(forMember.slice(0, MAX_ENTRIES_PER_MEMBER).map((e) => e.id));
  const pruned = all.filter((e) => e.memberId !== entry.memberId || keepIds.has(e.id));
  writeAll(pruned);
}

export function removeHistoryEntry(id: string) {
  writeAll(readAll().filter((e) => e.id !== id));
}

export function clearHistory(memberId?: string) {
  if (!memberId) {
    writeAll([]);
    return;
  }
  writeAll(readAll().filter((e) => e.memberId !== memberId));
}

function buildEntrySummary(report: HealthReport): string {
  const top = report.possibleConditions[0];
  return top ? `${top.name} (${top.likelihood} likelihood)` : report.summary.slice(0, 80);
}

/**
 * Condenses a member's most recent checks into a small, already-summarized slice for a
 * NEW request — never the full past report, never past images (which this app never
 * stores anywhere). Used identically by both the cloud and offline prompts.
 */
export function summarizeRecentHistory(memberId: string, count = 3): PriorHistoryItem[] {
  return getHistory(memberId)
    .slice(0, count)
    .map((entry) => ({
      createdAt: entry.createdAt,
      summary: buildEntrySummary(entry.report),
      possibleConditions: entry.report.possibleConditions
        .slice(0, 3)
        .map((c) => ({ name: c.name, likelihood: c.likelihood })),
    }));
}

export function buildHistoryEntry(params: {
  memberId: string;
  symptoms: string;
  locality: string;
  language: string;
  report: HealthReport;
  source: AISource;
}): HistoryEntry {
  return {
    id: crypto.randomUUID(),
    memberId: params.memberId,
    createdAt: new Date().toISOString(),
    symptoms: params.symptoms,
    locality: params.locality,
    language: params.language,
    report: params.report,
    source: params.source,
  };
}
