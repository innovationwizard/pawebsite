"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS, NAV_CTA, BLOG_NAV } from "@/lib/constants/navigation";
import { ButtonLink } from "@/components/ui/button-link";

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
          className="fixed inset-0 top-[89px] z-40 overflow-y-auto bg-navy xl:hidden"
        >
          <nav className="flex flex-col px-6 py-6">
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
              href={BLOG_NAV.href}
              onClick={onClose}
              className={`border-b border-white/10 py-4 text-base font-medium transition-colors ${
                pathname.startsWith(BLOG_NAV.href)
                  ? "text-celeste"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {BLOG_NAV.label}
            </Link>
            <ButtonLink
              href={NAV_CTA.href}
              variant="primary"
              onClick={onClose}
              className="mt-6 w-full"
            >
              {NAV_CTA.label}
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
