import { Percent, Wallet, Calendar, Building, CreditCard } from "lucide-react";
import type { Database } from "@/lib/types/database";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

interface FinancialSummaryProps {
  project: ProjectRow;
}

export function FinancialSummary({ project }: FinancialSummaryProps) {
  const hasFinancialData =
    project.enganche_percent || project.reserva_display || project.max_plazo_years;

  if (!hasFinancialData) return null;

  const terms = [
    project.enganche_percent && {
      icon: Percent,
      label: "Enganche",
      value: `${project.enganche_percent}%`,
    },
    project.reserva_display && {
      icon: Wallet,
      label: "Reserva",
      value: project.reserva_display,
    },
    project.cuotas_enganche && {
      icon: Calendar,
      label: "Cuotas de Enganche",
      value: `${project.cuotas_enganche} meses`,
    },
    project.max_plazo_years && {
      icon: Building,
      label: "Plazo Máximo",
      value: `${project.max_plazo_years} años`,
    },
    project.bank_rate_display && {
      icon: CreditCard,
      label: "Tasa Bancaria",
      value: project.bank_rate_display,
    },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; value: string }[];

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
          Condiciones Financieras
        </h2>
        <p className="mt-2 text-gray">
          Opciones de financiamiento disponibles para este proyecto.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((term) => (
            <div
              key={term.label}
              className="flex items-start gap-4 rounded-2xl border border-gray/10 p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-celeste/10">
                <term.icon className="h-5 w-5 text-celeste" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray">
                  {term.label}
                </p>
                <p className="mt-1 font-heading text-xl font-bold text-navy">
                  {term.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {project.starting_price_display && (
          <div className="mt-8 rounded-2xl bg-navy p-8 text-center">
            <p className="text-sm text-white/60">Desde</p>
            <p className="mt-1 font-heading text-4xl font-bold text-white md:text-5xl">
              {project.starting_price_display}
            </p>
            <p className="mt-2 text-sm text-white/40">
              {project.currency === "USD" ? "Dólares americanos" : "Quetzales guatemaltecos"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
