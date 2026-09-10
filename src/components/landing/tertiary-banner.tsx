"use client";

import { ParallaxSection } from "@/components/animations/parallax-section";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ButtonLink } from "@/components/ui/button-link";

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
      backgroundImage={imageUrl || "/images/banners/banner-secundario.jpeg"}
      speed={0.3}
      overlay
      className="min-h-[400px]"
    >
      <div className="mx-auto flex max-w-7xl items-center px-6 py-24 md:py-32">
        <ScrollReveal variant="fade-up">
          <div className="max-w-2xl">
            <h2 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
              {title}
            </h2>
            <div className="mt-8">
              <ButtonLink href={ctaLink} variant="primary" size="lg">
                {ctaText}
                <span aria-hidden="true">→</span>
              </ButtonLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </ParallaxSection>
  );
}
