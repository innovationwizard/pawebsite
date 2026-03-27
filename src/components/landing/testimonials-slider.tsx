"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

interface Testimonial {
  id: string;
  client_name: string;
  client_title: string | null;
  content: string;
  rating: number | null;
}

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
}

export function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const scroll = useCallback(
    (direction: "left" | "right") => {
      if (!scrollRef.current) return;
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion]
  );

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (prefersReducedMotion || isPaused || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, prefersReducedMotion, scroll, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-off-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal variant="fade-up">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
                Lo que dicen nuestros clientes
              </h2>
              <p className="mt-3 text-lg text-gray">
                Historias de quienes ya encontraron su hogar ideal.
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
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="mt-10 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-[340px] shrink-0 snap-start md:w-[380px]"
            >
              <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm">
                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating!
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray/20"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Content */}
                <p className="mt-4 flex-1 text-sm leading-relaxed text-gray">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-6 border-t border-gray/10 pt-4">
                  <p className="font-medium text-navy">
                    {testimonial.client_name}
                  </p>
                  {testimonial.client_title && (
                    <p className="mt-0.5 text-xs text-gray">
                      {testimonial.client_title}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
