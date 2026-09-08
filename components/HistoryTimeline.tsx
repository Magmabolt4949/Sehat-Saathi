"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ShieldAlert, WifiOff, Trash2 } from "lucide-react";
import type { FamilyMember, HistoryEntry } from "@/lib/types";
import { t, getLanguage, type LanguageCode } from "@/lib/i18n";
import { getHistory, clearHistory } from "@/lib/history";
import { getPersonaAccent, getPersonaAvatarUri } from "@/lib/avatars";
import FamilySwitcher from "@/components/FamilySwitcher";
import ReportView from "@/components/ReportView";

interface HistoryTimelineProps {
  language: LanguageCode;
  members: FamilyMember[];
  activeMemberId: string | null;
}

export default function HistoryTimeline({ language, members, activeMemberId }: HistoryTimelineProps) {
  const [filterId, setFilterId] = useState<string>(activeMemberId ?? "");
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(getHistory(filterId || undefined));
  }, [filterId]);

  function handleClear() {
    if (!window.confirm(t(language, "historyClearConfirm"))) return;
    clearHistory(filterId || undefined);
    setEntries(getHistory(filterId || undefined));
  }

  function memberFor(memberId: string): FamilyMember | undefined {
    return members.find((m) => m.id === memberId);
  }

  if (entries === null) return null;

  return (
    <div className="w-full max-w-2xl rounded-3xl border border-teal-100 bg-white/80 p-6 shadow-lg shadow-teal-900/5 backdrop-blur-sm sm:p-8">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-tight text-teal-950">{t(language, "historyTimelineTitle")}</h2>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-xl border border-teal-200 bg-white px-3 py-1.5 text-xs font-medium text-teal-600 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            <Trash2 className="h-3.5 w-3.5" /> {t(language, "historyClearAll")}
          </button>
        )}
      </div>

      {members.length > 1 && (
        <div className="mt-4">
          <FamilySwitcher members={members} selectedId={filterId} onSelect={setFilterId} language={language} showAllOption />
        </div>
      )}

      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-teal-500">{t(language, "historyEmpty")}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {entries.map((entry) => {
            const member = memberFor(entry.memberId);
            const expanded = expandedId === entry.id;
            const accent = member ? getPersonaAccent(member.personaId) : "#14b8a6";
            const entryLanguage = getLanguage(entry.language).code;
            return (
              <li key={entry.id} className="rounded-2xl border border-teal-100 bg-teal-50/30 p-4">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : entry.id)}
                  className="flex w-full items-start justify-between gap-2 text-left focus-visible:outline-none"
                >
                  <div className="flex items-start gap-2.5">
                    {member && (
                      <span
                        className="mt-0.5 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full ring-2"
                        style={{ boxShadow: `0 0 0 2px ${accent}` }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getPersonaAvatarUri(member.personaId)} alt="" className="h-full w-full object-cover" />
                      </span>
                    )}
                    <div>
                      <p className="text-xs font-medium text-teal-500">
                        {new Date(entry.createdAt).toLocaleDateString()} {member ? `· ${member.name}` : ""}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-sm font-medium text-teal-950">
                        {entry.report.possibleConditions[0]?.name || entry.report.summary}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {entry.report.isEmergency && (
                          <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                            <ShieldAlert className="h-2.5 w-2.5" /> {t(language, "historyBadgeEmergency")}
                          </span>
                        )}
                        {entry.source === "offline" && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                            <WifiOff className="h-2.5 w-2.5" /> {t(language, "historyBadgeOffline")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {expanded ? (
                    <ChevronUp className="h-4 w-4 flex-shrink-0 text-teal-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-teal-400" />
                  )}
                </button>

                {expanded && (
                  <div className="animate-fade-in-up mt-4">
                    <ReportView
                      report={entry.report}
                      language={entryLanguage}
                      locality={entry.locality}
                      patientName={member?.name ?? ""}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
