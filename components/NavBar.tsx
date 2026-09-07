"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Health Check" },
  { href: "/yoga", label: "Yoga Corrector" },
  { href: "/appointments", label: "My Requests" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 rounded-full border border-teal-100 bg-white p-1 text-sm shadow-sm">
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
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
