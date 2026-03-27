import type { LeadSource } from "@/lib/types/database";

export interface LeadSourceOption {
  value: LeadSource;
  label: string;
}

export const LEAD_SOURCES: LeadSourceOption[] = [
  { value: "facebook", label: "Facebook" },
  { value: "meta", label: "Meta" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "pagina_web", label: "Página Web" },
  { value: "inbox", label: "Inbox" },
  { value: "mailing", label: "Mailing" },
  { value: "wati", label: "Wati (WhatsApp)" },
  { value: "referido", label: "Referido" },
  { value: "visita_inedita", label: "Visita Inédita" },
  { value: "senaletica", label: "Señalética" },
  { value: "valla", label: "Valla" },
  { value: "pbx", label: "PBX" },
  { value: "prospeccion", label: "Prospección" },
  { value: "activacion", label: "Activación" },
  { value: "evento", label: "Evento" },
  { value: "friends_and_family", label: "Friends & Family" },
  { value: "other", label: "Otro" },
];
