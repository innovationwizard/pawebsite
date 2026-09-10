"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectStatusBadge, CategoryTag } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { OutlineText } from "@/components/ui/outline-text";
import type { ProjectStatus } from "@/lib/types/database";

interface ShowcaseProject {
  slug: string;
  name: string;
  hero_image_url: string | null;
  starting_price_display: string | null;
  location_description: string | null;
  status: ProjectStatus;
  bedroom_range: string | null;
  total_units: number;
  category_tag: string | null;
}

/**
 * Static hero images for projects served from public/images/projects/.
 * Used as fallback when Supabase hero_image_url is not set.
 */
const STATIC_HERO_IMAGES: Record<string, string> = {
  "bosque-las-tapias": "/images/projects/bosque-las-tapias.jpg",
  "casa-elisa": "/images/projects/casa-elisa.jpg",
  "boulevard-5": "/images/projects/boulevard-5.jpg",
  "benestare": "/images/projects/benestare.jpg",
  "santa-elena": "/images/projects/santa-elena.jpg",
};

const NUMBER_WORDS: Record<number, string> = {
  1: "Un",
  2: "Dos",
  3: "Tres",
  4: "Cuatro",
  5: "Cinco",
  6: "Seis",
  7: "Siete",
  8: "Ocho",
  9: "Nueve",
};

interface ProjectShowcaseSliderProps {
  projects: ShowcaseProject[];
}

export function ProjectShowcaseSlider({ projects }: ProjectShowcaseSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  if (projects.length === 0) return null;

  const count = projects.length;
  const countWord = NUMBER_WORDS[count] ?? String(count);
  const isSingular = count === 1;

  return (
    <section className="bg-off-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Nuestros proyectos"
              title={
                <>
                  {countWord} {isSingular ? "proyecto" : "proyectos"}.{" "}
                  <OutlineText>
                    {countWord} {isSingular ? "estilo" : "estilos"} de vida
                  </OutlineText>
                  .
                </>
              }
              lead="Descubre las mejores opciones de inversión inmobiliaria en Guatemala, desde hogares accesibles hasta exclusividad colonial."
            />
            <div className="hidden shrink-0 gap-2 md:flex">
              <button
                onClick={() => scroll("left")}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors hover:bg-navy hover:text-white"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors hover:bg-navy hover:text-white"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div
          ref={scrollRef}
          className="mt-12 flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((project, index) => {
            const image = project.hero_image_url || STATIC_HERO_IMAGES[project.slug];
            const meta = [
              project.location_description,
              project.bedroom_range ? `${project.bedroom_range} hab.` : null,
            ]
              .filter(Boolean)
              .join(" · ");
            return (
              <motion.div
                key={project.slug}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-[320px] shrink-0 snap-start md:w-[400px]"
              >
                <Link
                  href={`/proyectos/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-navy/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10"
                >
                  <div className="relative h-[260px] overflow-hidden md:h-[300px]">
                    {image ? (
                      <Image
                        src={image}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        sizes="(max-width: 768px) 320px, 400px"
                      />
                    ) : (
                      <div className="h-full w-full bg-navy/5" />
                    )}
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                      <CategoryTag label={project.category_tag} />
                      <ProjectStatusBadge
                        status={project.status}
                        className="ml-auto bg-white/90 backdrop-blur"
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-2xl font-bold leading-tight text-navy">
                      {project.name}
                    </h3>
                    {meta && <p className="mt-1.5 text-sm text-gray">{meta}</p>}
                    <div className="mt-auto flex items-center justify-between border-t border-navy/10 pt-4">
                      <p className="text-sm font-semibold text-primary">
                        {project.starting_price_display
                          ? `Desde ${project.starting_price_display}`
                          : "Consultar disponibilidad"}
                      </p>
                      <ArrowRight
                        className="h-4 w-4 text-navy transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile scroll hint */}
        <div className="mt-4 flex justify-center md:hidden">
          <div className="flex gap-1">
            {projects.map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-navy/15" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
