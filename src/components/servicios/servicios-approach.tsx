import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";
import { SERVICIOS_APPROACH } from "@/lib/constants/servicios";

/** "Enfoque integral basado en datos: asesoramos, no presionamos." */
export function ServiciosApproach() {
  return (
    <section className="bg-off-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          <ScrollReveal variant="fade-up">
            <SectionHeading
              eyebrow="Enfoque integral basado en datos"
              title={
                <>
                  Asesoramos, <OutlineText>no presionamos</OutlineText>.
                </>
              }
              lead="Cada decisión comercial parte de un análisis: de la competencia, del perfil del comprador y del rendimiento real de cada canal."
            />
          </ScrollReveal>

          <div className="space-y-4">
            {SERVICIOS_APPROACH.map((step, index) => (
              <ScrollReveal key={step.number} variant="fade-up" delay={index * 0.1}>
                <div className="flex gap-6 rounded-2xl bg-white p-6 shadow-sm">
                  <span className="font-heading text-sm font-bold tracking-[0.2em] text-celeste">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-navy">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray">{step.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
