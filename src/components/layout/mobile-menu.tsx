"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS } from "@/lib/constants/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 top-[72px] z-40 bg-navy lg:hidden"
        >
          <nav className="flex flex-col px-6 py-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`border-b border-white/10 py-4 text-lg font-medium transition-colors ${
                  pathname === item.href
                    ? "text-celeste"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/cotizador"
              onClick={onClose}
              className="mt-6 rounded-full bg-celeste px-6 py-3 text-center text-base font-medium text-white transition-all hover:bg-celeste/90"
            >
              Cotiza Ahora
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
