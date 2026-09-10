"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";

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
  teamImageUrl?: string | null;
  capsula1Url?: string | null;
  capsula2Url?: string | null;
  capsula3Url?: string | null;
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
  teamImageUrl,
  capsula1Url,
  capsula2Url,
  capsula3Url,
}: WhyHowSectionProps) {
  const processSteps = steps.length > 0 ? steps : DEFAULT_STEPS;
  const resolvedTeamImage = teamImageUrl || "/images/team/team-1.jpg";
  const resolvedCapsula1 = capsula1Url || "/images/capsulas/capsula-1.png";
  const resolvedCapsula2 = capsula2Url || "/images/capsulas/capsula-2.png";
  const resolvedCapsula3 = capsula3Url || "/images/capsulas/capsula-3.jpeg";

  return (
    <section className="bg-off-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Why */}
        <ScrollReveal variant="fade-up">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <SectionHeading
              eyebrow="Nuestro propósito"
              title={whyTitle}
              lead={whyDescription}
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={resolvedTeamImage}
                alt="Equipo de Puerta Abierta"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* How — Process Steps */}
        <div className="mt-24">
          <ScrollReveal variant="fade-up" className="mb-12">
            <SectionHeading
              eyebrow={howTitle}
              title={
                <>
                  Cinco etapas. <OutlineText>Una sola promesa</OutlineText>.
                </>
              }
            />
          </ScrollReveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <ScrollReveal
                key={step.number}
                variant="fade-up"
                delay={index * 0.1}
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group h-full rounded-2xl bg-white p-7 shadow-sm ring-1 ring-navy/5 transition-shadow duration-300 hover:shadow-lg"
                >
                  <span className="font-heading text-xs font-bold tracking-[0.25em] text-celeste">
                    {step.number}
                  </span>
                  <h4 className="mt-4 font-heading text-xl font-bold text-navy">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray">
                    {step.description}
                  </p>
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
                <h4 className="font-heading text-2xl font-extrabold tracking-tight text-navy md:text-3xl">
                  Los mejores en lo que hacemos
                </h4>
                <p className="mt-4 text-lg leading-relaxed text-gray">
                  Abrimos el camino y te acompañamos en cada paso. Nuestro
                  enfoque combina asesoría personalizada, conocimiento del
                  mercado y herramientas digitales para facilitar cada etapa del
                  proceso.
                </p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={resolvedCapsula1}
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
                  src={resolvedCapsula2}
                  alt="Puerta Abierta — proyectos inmobiliarios"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="md:order-2">
                <h4 className="font-heading text-2xl font-extrabold tracking-tight text-navy md:text-3xl">
                  Atención personalizada
                </h4>
                <p className="mt-4 text-lg leading-relaxed text-gray">
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
                <h4 className="font-heading text-2xl font-extrabold tracking-tight text-navy md:text-3xl">
                  Alianzas pensadas para ti
                </h4>
                <p className="mt-4 text-lg leading-relaxed text-gray">
                  Trabajamos con opciones de financiamiento, programas como
                  vivienda accesible y desarrollos con alto potencial de
                  plusvalía.
                </p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={resolvedCapsula3}
                  alt="Puerta Abierta — alianzas y financiamiento"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
