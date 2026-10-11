"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  History,
  LayoutGrid,
  QrCode,
  User,
} from "lucide-react";
import clsx from "@/lib/clsx";

const links = [
  { href: "/etudiant/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/etudiant/emploi-du-temps", label: "Emploi", icon: CalendarDays },
  { href: "/etudiant/scanner", label: "Scanner", icon: QrCode, isScan: true },
  { href: "/etudiant/presences", label: "Présences", icon: History },
  { href: "/etudiant/profil", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-end justify-between px-4 py-2">
        {links.map(({ href, label, icon: Icon, isScan }) => {
          const active = pathname.startsWith(href);
          if (isScan) {
            return (
              <li key={href} className="-translate-y-4">
                <Link
                  href={href}
                  aria-label="Scanner ma présence"
                  className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-ink text-paper shadow-lg shadow-ink/30 transition active:scale-95"
                >
                  <Icon size={26} />
                </Link>
              </li>
            );
          }
          return (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  "flex flex-col items-center gap-1 px-2 py-1 text-[11px]",
                  active ? "text-ink" : "text-ink-soft/50"
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
