"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectStatusBadge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
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
}

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

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
                Nuestros Proyectos
              </h2>
              <p className="mt-3 text-lg text-gray">
                Descubre las mejores opciones de inversión inmobiliaria en Guatemala.
              </p>
            </div>
            <div className="hidden gap-2 md:flex">
              <button
                onClick={() => scroll("left")}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-gray/20 text-navy transition-colors hover:bg-navy hover:text-white"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-gray/20 text-navy transition-colors hover:bg-navy hover:text-white"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div
          ref={scrollRef}
          className="mt-10 flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((project, index) => (
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
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {project.hero_image_url ? (
                    <Image
                      src={project.hero_image_url}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                      sizes="(max-width: 768px) 320px, 400px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-navy/5">
                      <span className="text-sm text-gray/40">
                        [ Imagen del proyecto ]
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute left-4 top-4">
                    <ProjectStatusBadge status={project.status} />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-xl font-bold text-navy">
                    {project.name}
                  </h3>
                  {project.location_description && (
                    <p className="mt-1 text-sm text-gray">
                      {project.location_description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    {project.starting_price_display && (
                      <p className="text-sm font-semibold text-navy">
                        Desde{" "}
                        <span className="text-celeste">
                          {project.starting_price_display}
                        </span>
                      </p>
                    )}
                    {project.bedroom_range && (
                      <p className="text-xs text-gray">
                        {project.bedroom_range} hab.
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile scroll hint */}
        <div className="mt-4 flex justify-center md:hidden">
          <div className="flex gap-1">
            {projects.map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-gray/20"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
