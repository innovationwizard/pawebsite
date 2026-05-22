"use client";

import { motion } from "framer-motion";

interface HeroVideoProps {
  videoUrl: string | null;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/
  );
  return match?.[1] ?? null;
}

export function HeroVideo({
  videoUrl,
  title,
  subtitle,
  ctaText,
  ctaHref,
}: HeroVideoProps) {
  const videoId = videoUrl ? extractYouTubeId(videoUrl) : null;

  return (
    <section className="relative flex min-h-[100vh] w-full items-center overflow-hidden bg-navy">
      {/* YouTube background — autoplay, muted, loop, no controls */}
      {videoId && (
        <div className="absolute inset-0">
          <div className="relative h-full w-full overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&fs=0`}
              title="Video de Puerta Abierta"
              allow="autoplay; encrypted-media"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-full min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2"
              style={{ border: "none" }}
            />
          </div>
          {/* Overlay to darken video for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy/70" />
        </div>
      )}

      {/* Fallback gradient if no video */}
      {!videoId && (
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-dark" />
      )}

      {/* Content overlay — always visible */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl"
        >
          <h1 className="font-heading text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mt-6 max-w-xl text-lg text-white/70 md:text-xl"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href={ctaHref}
              className="inline-flex rounded-full bg-celeste px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:bg-celeste/90 hover:shadow-xl hover:shadow-celeste/20"
            >
              {ctaText}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
