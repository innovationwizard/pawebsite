import type { LeadStage } from "@/lib/types/database";

export interface LeadStageOption {
  value: LeadStage;
  label: string;
  color: string;
}

export const LEAD_STAGES: LeadStageOption[] = [
  { value: "new", label: "Nuevo", color: "#04b0d6" },
  { value: "contacted", label: "Contactado", color: "#3b82f6" },
  { value: "interested", label: "Interesado", color: "#8b5cf6" },
  { value: "visit_scheduled", label: "Visita Programada", color: "#f59e0b" },
  { value: "negotiation", label: "Negociación", color: "#ef4444" },
  { value: "closed_won", label: "Cerrado Ganado", color: "#22c55e" },
  { value: "closed_lost", label: "Cerrado Perdido", color: "#6b7280" },
];
