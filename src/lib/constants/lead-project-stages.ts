import type { LeadProjectStage } from "@/lib/types/database";

export interface LeadProjectStageOption {
  value: LeadProjectStage;
  label: string;
}

/** Stage of a developer's project, captured by the /servicios form. */
export const LEAD_PROJECT_STAGES: LeadProjectStageOption[] = [
  { value: "preventa", label: "Preventa" },
  { value: "construccion", label: "En construcción" },
  { value: "entregado", label: "Entregado" },
];

export function getLeadProjectStageLabel(value: string | null | undefined): string {
  return LEAD_PROJECT_STAGES.find((s) => s.value === value)?.label ?? value ?? "";
}
