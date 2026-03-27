"use client";

import { ScrollReveal, ScrollRevealChild } from "@/components/animations/scroll-reveal";
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
        <ScrollReveal variant="fade-up" className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
            {whyTitle}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray">
            {whyDescription}
          </p>
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
      </div>
    </section>
  );
}
