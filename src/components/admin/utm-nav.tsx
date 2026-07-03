"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/utm", label: "Panel", exact: true },
  { href: "/admin/utm/generador", label: "Generador" },
  { href: "/admin/utm/historial", label: "Historial" },
  { href: "/admin/utm/qa", label: "QA" },
  { href: "/admin/utm/datos-maestros", label: "Datos Maestros" },
];

export function UtmNav() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="mb-6 flex flex-wrap gap-1 border-b border-gray/10">
      {TABS.map((t) => {
        const active = isActive(t.href, t.exact);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "border-celeste text-navy"
                : "border-transparent text-gray hover:text-navy"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
