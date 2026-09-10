import { Megaphone, Handshake, Cpu, Check } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";
import { SERVICIOS_PILLARS, type ServiciosPillar } from "@/lib/constants/servicios";

const ICONS: Record<ServiciosPillar["icon"], typeof Megaphone> = {
  marketing: Megaphone,
  sales: Handshake,
  technology: Cpu,
};

/** Marketing · Ventas · Tecnología. */
export function ServiciosPillars() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <SectionHeading
            eyebrow="Qué hacemos"
            title={
              <>
                Marketing, ventas y tecnología en{" "}
                <OutlineText>una sola operación</OutlineText>.
              </>
            }
            lead="Tres frentes que trabajan juntos: llenar el embudo con leads calificados, convertirlos en cierres y sostener todo sobre tecnología propia."
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {SERVICIOS_PILLARS.map((pillar, index) => {
            const Icon = ICONS[pillar.icon];
            return (
              <ScrollReveal key={pillar.title} variant="fade-up" delay={index * 0.1}>
                <div className="flex h-full flex-col rounded-2xl bg-off-white p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-celeste/15 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-heading text-2xl font-bold text-navy">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray">
                    {pillar.description}
                  </p>
                  <ul className="mt-6 space-y-2.5 border-t border-navy/10 pt-6">
                    {pillar.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5 text-sm text-navy">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-celeste" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
