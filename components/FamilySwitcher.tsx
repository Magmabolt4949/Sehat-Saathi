"use client";

import { Plus, Check } from "lucide-react";
import type { FamilyMember } from "@/lib/types";
import { getPersonaAvatarUri, getPersonaAccent } from "@/lib/avatars";
import { t, type LanguageCode } from "@/lib/i18n";

interface FamilySwitcherProps {
  members: FamilyMember[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  language: LanguageCode;
  /** Shows a trailing "+" tile that opens the add-member flow. Omit to render a plain filter row. */
  onAddMember?: () => void;
  /** When set, prepends an "All family" chip with id "" — for filter contexts (history, appointments). */
  showAllOption?: boolean;
}

export default function FamilySwitcher({
  members,
  selectedId,
  onSelect,
  language,
  onAddMember,
  showAllOption,
}: FamilySwitcherProps) {
  return (
    <div role="radiogroup" aria-label={t(language, "familySwitcherLabel")} className="flex flex-wrap items-center gap-2.5">
      {showAllOption && (
        <button
          type="button"
          role="radio"
          aria-checked={selectedId === ""}
          onClick={() => onSelect("")}
          className={`flex h-9 items-center rounded-full border px-3.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1 ${
            selectedId === ""
              ? "border-teal-500 bg-teal-600 text-white shadow-sm"
              : "border-teal-200 bg-white text-teal-700 hover:border-teal-400"
          }`}
        >
          {t(language, "familyAllMembers")}
        </button>
      )}

      {members.map((member) => {
        const selected = member.id === selectedId;
        const accent = getPersonaAccent(member.personaId);
        return (
          <button
            key={member.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={member.name || t(language, "familyMemberUnnamed")}
            onClick={() => onSelect(member.id)}
            className="group relative flex flex-col items-center gap-1 focus-visible:outline-none"
          >
            <span
              className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-2 transition-all ${
                selected ? "ring-white" : "ring-white/60 group-hover:ring-white"
              } group-focus-visible:ring-2 group-focus-visible:ring-teal-500`}
              style={selected ? { boxShadow: `0 0 0 2.5px ${accent}` } : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getPersonaAvatarUri(member.personaId)} alt="" className="h-full w-full object-cover" />
              {selected && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: accent }}
                >
                  <Check className="h-2.5 w-2.5" />
                </span>
              )}
            </span>
            <span className="max-w-[64px] truncate text-[11px] font-medium text-teal-700">
              {member.name || t(language, "familyMemberUnnamed")}
            </span>
          </button>
        );
      })}

      {onAddMember && (
        <button
          type="button"
          onClick={onAddMember}
          aria-label={t(language, "familyAddMember")}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-teal-300 text-teal-400 transition-colors hover:border-teal-400 hover:bg-teal-50 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
