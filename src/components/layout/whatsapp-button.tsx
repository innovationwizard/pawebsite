"use client";

import { MessageCircle } from "lucide-react";

const FALLBACK_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "50224249388";

interface WhatsAppButtonProps {
  /**
   * Per-project WhatsApp line (digits only, full international format). On a
   * project page this routes the floating button to that project's number so
   * the lead lands in the right CRM bucket. Omit elsewhere to use the global
   * company number.
   */
  phoneNumber?: string | null;
}

export function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps = {}) {
  const number = phoneNumber || FALLBACK_NUMBER;
  const href = `https://wa.me/${number}?text=${encodeURIComponent(
    "Hola, me gustaría obtener más información sobre sus proyectos."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contáctenos por WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-xl"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}
