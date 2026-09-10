"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS, NAV_CTA } from "@/lib/constants/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { MobileMenu } from "./mobile-menu";

export function Navbar({ solid = false }: { solid?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(solid);
  const pathname = usePathname();
  // The menu remembers the route it was opened on, so a navigation closes it
  // without an effect.
  const [menuOpenedOn, setMenuOpenedOn] = useState<string | null>(null);
  const isMobileMenuOpen = menuOpenedOn === pathname;
  const setIsMobileMenuOpen = (open: boolean) => setMenuOpenedOn(open ? pathname : null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(solid || window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [solid]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-navy/95 backdrop-blur-md shadow-lg shadow-navy/20"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          {/* Logo — 65px tall (ajustes6) so all seven items + CTA fit on one line */}
          <Link href="/" className="shrink-0">
            <Image
              src="/icons/logo-secondary.png"
              alt="Puerta Abierta Inmobiliaria"
              width={320}
              height={100}
              className="h-[65px] w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 xl:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden xl:block">
              <ButtonLink href={NAV_CTA.href} variant="primary" size="sm" className="py-2.5">
                {NAV_CTA.label}
                <span aria-hidden="true">→</span>
              </ButtonLink>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center text-white xl:hidden"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
