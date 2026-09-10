"use client";

import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { CounterAnimation } from "@/components/animations/counter-animation";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";

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
    <section className="bg-navy py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <SectionHeading
            tone="dark"
            eyebrow="Puerta Abierta en números"
            title={
              <>
                Lo que hemos construido,
                <br />
                <OutlineText>paso a paso</OutlineText>.
              </>
            }
          />
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/10 pt-10 md:grid-cols-4">
            {highlights.map((item, index) => (
              <div key={index}>
                <div className="font-heading text-4xl font-extrabold text-celeste md:text-5xl lg:text-6xl">
                  <CounterAnimation
                    end={item.value}
                    prefix={item.prefix}
                    suffix={item.suffix}
                    duration={2000}
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-white/60 md:text-base">
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
