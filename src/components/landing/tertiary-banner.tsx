"use client";

import { ParallaxSection } from "@/components/animations/parallax-section";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

interface TertiaryBannerProps {
  imageUrl: string | null;
  title: string;
  ctaText: string;
  ctaLink: string;
}

export function TertiaryBanner({
  imageUrl,
  title,
  ctaText,
  ctaLink,
}: TertiaryBannerProps) {
  return (
    <ParallaxSection
      backgroundImage={imageUrl ?? undefined}
      speed={0.3}
      overlay
      className="min-h-[400px]"
    >
      <div className="mx-auto flex max-w-7xl items-center px-6 py-24 md:py-32">
        <ScrollReveal variant="fade-up">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <div className="mt-8">
              <a
                href={ctaLink}
                className="inline-flex rounded-full bg-celeste px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:bg-celeste/90 hover:shadow-xl hover:shadow-celeste/20"
              >
                {ctaText}
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </ParallaxSection>
  );
}
