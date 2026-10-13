"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const LEAD_MAP: Record<
  string,
  { content_name: string; content_category: string; form_id: string }
> = {
  servicios: {
    content_name: "Servicios mercadeo y ventas",
    content_category: "Servicios B2B",
    form_id: "form_servicios",
  },
  terrenos: {
    content_name: "Captación de terrenos",
    content_category: "Terrenos",
    form_id: "form_terrenos",
  },
  cotizador: {
    content_name: "Cotizador",
    content_category: "Proyecto inmobiliario",
    form_id: "form_cotizador",
  },
};

export default function LeadEvent() {
  const tipo = (useSearchParams().get("tipo") ?? "").toLowerCase();

  useEffect(() => {
    const data = LEAD_MAP[tipo];
    console.log("[LeadEvent] montado", {
      tipo,
      data,
      fbq: typeof (window as Window & { fbq?: unknown }).fbq,
    });
    if (!data) return;

    const key = `lead_fired_${tipo}`;
    if (sessionStorage.getItem(key)) return;

    let intentos = 0;
    const timer = setInterval(() => {
      intentos++;
      const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
      if (typeof fbq === "function") {
        fbq("track", "Lead", data);
        sessionStorage.setItem(key, "1");
        console.log("[LeadEvent] Lead enviado", data);
        clearInterval(timer);
      } else if (intentos >= 40) {
        console.warn("[LeadEvent] fbq no estuvo disponible");
        clearInterval(timer);
      }
    }, 250);

    return () => clearInterval(timer);
  }, [tipo]);

  return null;
}
