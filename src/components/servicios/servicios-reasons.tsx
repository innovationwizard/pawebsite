import { Briefcase, LineChart, Users, Smartphone } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";
import { SERVICIOS_REASONS, type ServiciosReason } from "@/lib/constants/servicios";

const ICONS: Record<ServiciosReason["icon"], typeof Briefcase> = {
  operators: Briefcase,
  performance: LineChart,
  team: Users,
  technology: Smartphone,
};

/** "¿Cómo lo hacemos?" — dark section with four cards, per the client's reference image. */
export function ServiciosReasons() {
  return (
    <section className="bg-hero-gradient py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <SectionHeading
            tone="dark"
            size="lg"
            eyebrow="Por qué trabajar con nosotros"
            title={
              <>
                No contratas una agencia.
                <br />
                Sumas un <OutlineText>equipo que ya vende</OutlineText>.
              </>
            }
            className="max-w-4xl"
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICIOS_REASONS.map((reason, index) => {
            const Icon = ICONS[reason.icon];
            return (
              <ScrollReveal key={reason.title} variant="fade-up" delay={index * 0.1}>
                <div
                  className={`flex h-full flex-col rounded-2xl border p-6 transition-colors duration-300 ${
                    reason.highlighted
                      ? "border-celeste/40 bg-gradient-to-b from-white/10 to-white/[0.03] shadow-[0_0_40px_-12px_rgba(30,200,240,0.35)]"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/25 text-celeste">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-heading text-lg font-bold text-white">
                    {reason.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    {reason.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
