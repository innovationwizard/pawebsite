"use client";

import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { CounterAnimation } from "@/components/animations/counter-animation";

interface HighlightItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

interface BrandHighlightsProps {
  items: HighlightItem[];
}

const DEFAULT_HIGHLIGHTS: HighlightItem[] = [
  { value: 30, prefix: "+", suffix: "", label: "Proyectos Desarrollados" },
  { value: 757, prefix: "", suffix: "", label: "Mil m² Desarrollados" },
  { value: 22, prefix: "+", suffix: "", label: "Años de Experiencia" },
  { value: 650, prefix: "$", suffix: "M", label: "Millones Históricos" },
];

export function BrandHighlights({ items }: BrandHighlightsProps) {
  const highlights = items.length > 0 ? items : DEFAULT_HIGHLIGHTS;

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <h2 className="mb-12 text-center font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
            Puerta Abierta en números
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            {highlights.map((item, index) => (
              <div key={index} className="text-center">
                <div className="font-heading text-4xl font-bold text-navy md:text-5xl lg:text-6xl">
                  <CounterAnimation
                    end={item.value}
                    prefix={item.prefix}
                    suffix={item.suffix}
                    duration={2000}
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-gray md:text-base">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
