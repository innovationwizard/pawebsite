import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";

/** Dark full-bleed band: "Es así como Puerta Abierta lleva tu operación y tus ventas a otro nivel." */
export function ServiciosMethodBanner() {
  return (
    <section className="bg-navy py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <SectionHeading
            tone="dark"
            size="lg"
            eyebrow="El método Puerta Abierta"
            title={
              <>
                Así es como Puerta Abierta lleva tu operación y tus ventas a{" "}
                <OutlineText>otro nivel</OutlineText>.
              </>
            }
            lead="Performance marketing, fuerza de ventas optimizada y tecnología, operando como una sola unidad dentro de tu proyecto."
            className="max-w-4xl"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
