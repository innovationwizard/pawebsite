"use client";

import { ScrollReveal } from "@/components/animations/scroll-reveal";

export function TechSection() {
  return (
    <section className="bg-off-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Text content */}
          <ScrollReveal variant="fade-up">
            <div>
              <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
                Abrimos las puertas a tecnología de otro nivel
              </h2>
              <p className="mt-4 text-lg font-medium text-celeste">
                Innovación, datos e inteligencia artificial al servicio de
                mejores decisiones
              </p>
              <p className="mt-6 text-lg leading-relaxed text-gray">
                En Puerta Abierta creemos que el futuro de los bienes raíces en
                Guatemala no solo se construye con proyectos, sino con
                inteligencia.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray">
                Por eso integramos tecnología de punta e inteligencia artificial
                (IA) en nuestros procesos comerciales, análisis de mercado y
                estrategias de marketing, permitiéndonos anticiparnos a las
                tendencias y ofrecer soluciones más precisas a nuestros clientes.
              </p>
            </div>
          </ScrollReveal>

          {/* Image placeholder — space reserved for future images */}
          <ScrollReveal variant="fade-up" delay={0.2}>
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-navy/5">
              <span className="text-sm text-gray/40">
                [ Imágenes pendientes ]
              </span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
