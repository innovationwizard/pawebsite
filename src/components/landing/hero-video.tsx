"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = videoUrl ? extractYouTubeId(videoUrl) : null;

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  return (
    <section className="relative flex min-h-[50vh] items-center overflow-hidden bg-navy md:min-h-[60vh]">
      {/* Video / Thumbnail background */}
      {videoId && !isPlaying && (
        <div className="absolute inset-0">
          <Image
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy/80" />
        </div>
      )}

      {videoId && isPlaying && (
        <div className="absolute inset-0">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
            title="Video de Puerta Abierta"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      )}

      {/* Fallback gradient if no video */}
      {!videoId && (
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-dark" />
      )}

      {/* Content overlay — hidden when video is playing */}
      {!isPlaying && (
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
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-6 max-w-xl text-lg text-white/70 md:text-xl"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href={ctaHref}
                className="inline-flex rounded-full bg-celeste px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:bg-celeste/90 hover:shadow-xl hover:shadow-celeste/20"
              >
                {ctaText}
              </a>

              {videoId && (
                <button
                  onClick={handlePlay}
                  className="group inline-flex items-center gap-3 text-white/80 transition-colors hover:text-white"
                  aria-label="Reproducir video"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 transition-all duration-300 group-hover:border-white/60 group-hover:bg-white/10">
                    <Play className="h-6 w-6 fill-current" />
                  </span>
                  <span className="text-sm font-medium">Ver Video</span>
                </button>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
