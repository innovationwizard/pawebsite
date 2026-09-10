"use client";

import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Marquee } from "@/components/animations/marquee";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";

/** Delivered and active projects, rendered as text chips in a single marquee row (ajustes6). */
const PROJECT_NAMES = [
  "Edificio 7-47",
  "Telia",
  "Casa 3",
  "Santeli",
  "Natú",
  "Casa Elisa",
  "Colinas de Castilla",
  "Benestare",
  "Boulevard 5",
  "Bosque Las Tapias",
  "Santa Elena",
];

export function ProjectBadges() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <SectionHeading
            eyebrow="Nuestros proyectos nos respaldan"
            title={
              <>
                Ubicación, diseño y <OutlineText>plusvalía</OutlineText> en cada desarrollo.
              </>
            }
            lead="Trabajamos con algunos de los proyectos más relevantes del mercado inmobiliario en Guatemala, seleccionados por su calidad, propuesta de valor y potencial de crecimiento. Desde apartamentos modernos en la ciudad hasta desarrollos rodeados de naturaleza o proyectos premium, nuestro portafolio ofrece opciones para cada perfil de cliente."
          />
        </ScrollReveal>
      </div>

      <div className="mt-12">
        <Marquee speed={30} pauseOnHover>
          {PROJECT_NAMES.map((name) => (
            <div key={name} className="shrink-0 px-2">
              <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-navy/10 bg-off-white px-5 py-3 text-sm font-semibold text-navy">
                <span className="text-celeste" aria-hidden="true">✦</span>
                {name}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
