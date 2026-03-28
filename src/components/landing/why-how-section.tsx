"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { motion } from "framer-motion";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface WhyHowSectionProps {
  whyTitle: string;
  whyDescription: string;
  howTitle: string;
  steps: ProcessStep[];
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Identificación",
    description: "Encontramos la ubicación y oportunidad ideal para desarrollar.",
  },
  {
    number: "02",
    title: "Diseño",
    description: "Creamos espacios funcionales y estéticamente excepcionales.",
  },
  {
    number: "03",
    title: "Construcción",
    description: "Ejecutamos con los más altos estándares de calidad.",
  },
  {
    number: "04",
    title: "Entrega",
    description: "Entregamos hogares que superan las expectativas.",
  },
  {
    number: "05",
    title: "Acompañamiento",
    description: "Te acompañamos en cada paso de tu experiencia.",
  },
];

export function WhyHowSection({
  whyTitle,
  whyDescription,
  howTitle,
  steps,
}: WhyHowSectionProps) {
  const processSteps = steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <section className="bg-off-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Why */}
        <ScrollReveal variant="fade-up">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
                {whyTitle}
              </h2>
              <p className="mt-6 text-justify text-lg leading-relaxed text-gray">
                {whyDescription}
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/team/team-1.jpg"
                alt="Equipo de Puerta Abierta"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* How — Process Steps */}
        <div className="mt-20">
          <ScrollReveal variant="fade-up" className="mb-12 text-center">
            <h3 className="font-heading text-2xl font-bold text-navy md:text-3xl">
              {howTitle}
            </h3>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-5">
            {processSteps.map((step, index) => (
              <ScrollReveal
                key={step.number}
                variant="fade-up"
                delay={index * 0.1}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative rounded-2xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
                >
                  <span className="font-heading text-4xl font-bold text-celeste/20 transition-colors duration-300 group-hover:text-celeste/40">
                    {step.number}
                  </span>
                  <h4 className="mt-3 font-heading text-lg font-bold text-navy">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray">
                    {step.description}
                  </p>
                  {/* Connector line */}
                  {index < processSteps.length - 1 && (
                    <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-celeste/30 md:block" />
                  )}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* How — Capsules */}
        <div className="mt-20 space-y-16">
          {/* Cápsula 1: texto izquierda, imagen derecha */}
          <ScrollReveal variant="fade-up">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <p className="text-lg leading-relaxed text-gray">
                  Abrimos el camino y te acompañamos en cada paso. Nuestro
                  enfoque combina asesoría personalizada, conocimiento del
                  mercado y herramientas digitales para facilitar cada etapa del
                  proceso.
                </p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="/images/capsulas/capsula-1.png"
                  alt="Sketch arquitectónico Boulevard 5"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Cápsula 2: imagen izquierda, texto derecha */}
          <ScrollReveal variant="fade-up">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:order-1">
                <Image
                  src="/images/capsulas/capsula-2.png"
                  alt="Puerta Abierta — proyectos inmobiliarios"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="md:order-2">
                <p className="text-lg leading-relaxed text-gray">
                  Desde el primer contacto hasta la entrega de tu propiedad, te
                  acompañamos con un equipo experto que entiende tus necesidades
                  y te guía hacia la mejor decisión.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Cápsula 3: texto izquierda, imagen derecha (placeholder) */}
          <ScrollReveal variant="fade-up">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <p className="text-lg leading-relaxed text-gray">
                  Trabajamos con opciones de financiamiento, programas como
                  vivienda accesible y desarrollos con alto potencial de
                  plusvalía.
                </p>
              </div>
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-navy/5">
                <span className="text-sm text-gray/40">[ Imagen pendiente ]</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
