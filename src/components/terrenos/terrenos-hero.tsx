import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ArrowDown } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { OutlineText } from "@/components/ui/outline-text";
import { ButtonLink } from "@/components/ui/button-link";
import { HeroBackground, type HeroMedia } from "@/components/landing/hero-background";

interface TerrenosHeroProps {
  media: HeroMedia | null;
}

export function TerrenosHero({ media }: TerrenosHeroProps) {
  return (
    <section
      data-tone="dark"
      className="relative overflow-hidden bg-hero-gradient pb-24 pt-40 md:pb-32 md:pt-52"
    >
      <HeroBackground
        media={media}
        overlayClassName="bg-gradient-to-br from-navy-deep/90 via-navy/75 to-navy/60"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <div className="max-w-3xl">
            <Eyebrow className="mb-5">Compramos terrenos en Guatemala</Eyebrow>

            <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              ¿Tienes un terreno?{" "}
              <OutlineText>Nosotros lo compramos</OutlineText>.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
              Proceso rápido, precio justo y cierre seguro. Evaluación gratuita
              en menos de 72 horas. Más de 22 años de experiencia en el mercado
              inmobiliario guatemalteco.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink href="#formulario" variant="primary" size="lg">
                Quiero que evalúen mi terreno
                <span aria-hidden="true">→</span>
              </ButtonLink>
              <ButtonLink href="tel:+50224249388" variant="outline-light" size="lg">
                Llamar ahora
              </ButtonLink>
            </div>

            <div className="mt-14">
              <a
                href="#formulario"
                aria-label="Ir al formulario"
                className="flex h-10 w-10 animate-bounce items-center justify-center rounded-full border border-white/20 text-white/50 hover:text-white"
              >
                <ArrowDown className="h-5 w-5" />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
