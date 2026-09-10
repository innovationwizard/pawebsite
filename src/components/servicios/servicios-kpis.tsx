"use client";

import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { CounterAnimation } from "@/components/animations/counter-animation";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";
import { parseHighlightValue } from "@/lib/utils/parse-highlight-value";
import type { ServiciosKpi } from "@/lib/queries/settings";

interface ServiciosKpisProps {
  kpis: ServiciosKpi[];
}

/** "Hitos y números" — dark band with the three admin-editable indicators. */
export function ServiciosKpis({ kpis }: ServiciosKpisProps) {
  if (kpis.length === 0) return null;

  return (
    <section className="bg-navy py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <SectionHeading
            tone="dark"
            eyebrow="Hitos y números"
            title={
              <>
                Resultados que <OutlineText>respaldan</OutlineText> el método.
              </>
            }
          />
          <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-3">
            {kpis.map((kpi) => {
              const { prefix, end, suffix } = parseHighlightValue(kpi.value);
              return (
                <div key={kpi.label}>
                  <div className="font-heading text-5xl font-extrabold text-celeste md:text-6xl">
                    {Number.isFinite(end) && end > 0 ? (
                      <CounterAnimation end={end} prefix={prefix} suffix={suffix} duration={1800} />
                    ) : (
                      kpi.value
                    )}
                  </div>
                  <p className="mt-3 text-base font-medium text-white">{kpi.label}</p>
                  {kpi.note && <p className="mt-1 text-sm text-white/50">{kpi.note}</p>}
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
