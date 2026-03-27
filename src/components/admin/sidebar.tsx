"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Building2,
  Newspaper,
  HardHat,
  MessageSquareQuote,
  HelpCircle,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Target,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Proyectos", href: "/admin/proyectos", icon: Building2 },
  { label: "Noticias", href: "/admin/noticias", icon: Newspaper },
  { label: "Avance de Obra", href: "/admin/avance-de-obra", icon: HardHat },
  { label: "Testimonios", href: "/admin/testimonios", icon: MessageSquareQuote },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { label: "Leads", href: "/admin/leads", icon: Target },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings },
  { label: "Usuarios", href: "/admin/usuarios", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const navContent = (
    <>
      <div className="mb-8 flex items-center justify-between">
        <Link href="/admin" className="block">
          <Image
            src="/icons/logo.png"
            alt="Puerta Abierta Admin"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden text-gray"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-celeste/10 text-celeste"
                  : "text-gray hover:bg-navy/5 hover:text-navy"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray/10 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray hover:bg-navy/5 hover:text-navy"
          target="_blank"
        >
          Ver sitio web
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5 text-navy" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray/10 bg-white p-6 transition-transform lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray/10 bg-white p-6 lg:flex">
        {navContent}
      </aside>
    </>
  );
}
