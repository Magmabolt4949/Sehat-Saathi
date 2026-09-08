"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type LanguageCode, type TranslationKey } from "@/lib/i18n";

const LINKS: { href: string; key: TranslationKey }[] = [
  { href: "/", key: "navHealthCheck" },
  { href: "/yoga", key: "navYoga" },
  { href: "/appointments", key: "navRequests" },
  { href: "/history", key: "navHistory" },
  { href: "/offline", key: "navOffline" },
];

interface NavBarProps {
  language?: LanguageCode;
}

export default function NavBar({ language = "en" }: NavBarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap justify-center gap-2 rounded-full border border-teal-100 bg-white p-1 text-sm shadow-sm">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
              active ? "bg-teal-600 text-white" : "text-teal-700 hover:bg-teal-50"
            }`}
          >
            {t(language, link.key)}
          </Link>
        );
      })}
    </nav>
  );
}
