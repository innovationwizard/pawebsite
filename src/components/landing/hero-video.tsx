"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button-link";

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

/* Minimal typing for the YouTube IFrame Player API (loaded from youtube.com/iframe_api). */
interface YTPlayer {
  getPlayerState: () => number;
}
interface YTPlayerEvent {
  data: number;
  target: YTPlayer;
}
interface YTNamespace {
  Player: new (
    element: HTMLIFrameElement,
    options: {
      events: {
        onReady: (e: YTPlayerEvent) => void;
        onStateChange: (e: YTPlayerEvent) => void;
      };
    }
  ) => YTPlayer;
  PlayerState: { PLAYING: number };
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/
  );
  return match?.[1] ?? null;
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
  const videoId = videoUrl ? extractYouTubeId(videoUrl) : null;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // The embed URL carries the page origin (required by the IFrame API), which
  // is only known in the browser — so the iframe mounts after hydration.
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Attach to the iframe through the IFrame API so the brand-gradient cover
  // is only lifted once the player is actually PLAYING. While YouTube is
  // loading, buffering, or autoplay is blocked, its own play/next chrome
  // stays hidden behind the cover.
  const attachPlayer = useCallback(() => {
    const YT = window.YT;
    const iframe = iframeRef.current;
    if (!YT || !iframe || playerRef.current) return;
    playerRef.current = new YT.Player(iframe, {
      events: {
        // If autoplay already started before the API attached, onStateChange
        // will not fire again until the next transition — read the state once.
        onReady: (e) => {
          setIsPlaying(e.target.getPlayerState() === YT.PlayerState.PLAYING);
        },
        onStateChange: (e) => {
          setIsPlaying(e.data === YT.PlayerState.PLAYING);
        },
      },
    });
  }, []);

  useEffect(() => {
    if (!videoId || !origin) return;
    if (window.YT?.Player) {
      attachPlayer();
    } else {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        attachPlayer();
      };
    }
    return () => {
      playerRef.current = null;
    };
  }, [videoId, origin, attachPlayer]);

  const embedSrc =
    videoId && origin
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&fs=0&enablejsapi=1&origin=${encodeURIComponent(origin)}`
      : null;

  return (
    <section className="relative flex min-h-[100vh] w-full items-center overflow-hidden bg-hero-gradient">
      {embedSrc && (
        <div className="absolute inset-0">
          <div className="relative h-full w-full overflow-hidden">
            <iframe
              ref={iframeRef}
              src={embedSrc}
              title="Video de Puerta Abierta"
              allow="autoplay; encrypted-media"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-full min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2"
              style={{ border: "none" }}
            />
          </div>
          {/* Readability overlay on top of the playing video */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy/45 to-navy/80" />
          {/* Brand-gradient cover: opaque until the player reports PLAYING */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-hero-gradient transition-opacity duration-1000 ease-out ${
              isPlaying ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      )}

      {videoId && (
        <Script src="https://www.youtube.com/iframe_api" strategy="lazyOnload" onLoad={attachPlayer} />
      )}

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
