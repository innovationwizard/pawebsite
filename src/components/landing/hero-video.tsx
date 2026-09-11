"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button-link";
import { HeroBackground } from "./hero-background";

interface HeroVideoProps {
  videoUrl: string | null;
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  /** Short facts rendered under the CTAs, e.g. ["+22 años", "30+ proyectos"]. */
  trustItems?: string[];
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function HeroVideo({
  videoUrl,
  eyebrow,
  title,
  subtitle,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  trustItems = [],
}: HeroVideoProps) {
  return (
    <section
      data-tone="dark"
      className="relative flex min-h-[100vh] w-full items-center overflow-hidden bg-hero-gradient"
    >
      <HeroBackground media={videoUrl ? { type: "video", url: videoUrl } : null} />

      {/* Content overlay — always visible */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-3xl"
        >
          <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
          <h1 className="font-heading text-5xl font-extrabold leading-[1.02] tracking-tight text-white md:text-7xl lg:text-8xl">
            {title}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <ButtonLink href={ctaHref} variant="primary" size="lg">
              {ctaText}
            </ButtonLink>
            {secondaryCtaText && secondaryCtaHref && (
              <ButtonLink href={secondaryCtaHref} variant="outline-light" size="lg">
                {secondaryCtaText}
                <span aria-hidden="true">→</span>
              </ButtonLink>
            )}
          </motion.div>

          {trustItems.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10 text-sm text-white/55"
            >
              {trustItems.join(" · ")}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
