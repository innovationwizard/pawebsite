import Link from "next/link";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ArrowDown } from "lucide-react";

export function TerrenosHero() {
  return (
    <section className="relative bg-navy pb-24 pt-40 md:pb-32 md:pt-52">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-celeste/10 px-4 py-1.5 text-sm font-semibold text-celeste">
              Compramos terrenos en Guatemala
            </span>

            <h1 className="mt-6 font-heading text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              ¿Tienes un terreno?{" "}
              <span className="text-celeste">Nosotros lo compramos.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-white/70 md:text-xl">
              Proceso rápido, precio justo y cierre seguro. Evaluación gratuita
              en menos de 72 horas. Más de 22 años de experiencia en el mercado
              inmobiliario guatemalteco.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="#formulario"
                className="rounded-full bg-celeste px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:bg-celeste/90 hover:shadow-celeste/30 hover:shadow-xl"
              >
                Quiero que evalúen mi terreno
              </Link>
              <Link
                href="tel:+50242403164"
                className="rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              >
                Llamar ahora
              </Link>
            </div>

            <div className="mt-14 flex justify-center">
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
