"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Script from "next/script";

/**
 * Full-bleed hero background used by the home, Servicios and Terrenos heroes.
 *
 * Priority: YouTube video → direct video file (mp4/webm) → image → nothing
 * (the parent's brand gradient shows through). A YouTube embed sits under an
 * opaque brand-gradient cover that is only lifted once the IFrame API reports
 * PLAYING, so YouTube's play/next chrome is never visible.
 */
export interface HeroMedia {
  type: "image" | "video";
  url: string;
}

interface HeroBackgroundProps {
  media: HeroMedia | null;
  /** Gradient painted over the media for text readability. */
  overlayClassName?: string;
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

export function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([^&?#]+)/
  );
  return match?.[1] ?? null;
}

const DEFAULT_OVERLAY = "bg-gradient-to-b from-navy-deep/70 via-navy/45 to-navy/80";

const subscribeNoop = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "";

export function HeroBackground({ media, overlayClassName = DEFAULT_OVERLAY }: HeroBackgroundProps) {
  if (!media || !media.url.trim()) return null;

  if (media.type === "image") {
    return (
      <div className="absolute inset-0">
        <Image src={media.url} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className={`absolute inset-0 ${overlayClassName}`} />
      </div>
    );
  }

  const videoId = extractYouTubeId(media.url);
  if (videoId) {
    return <YouTubeBackground videoId={videoId} overlayClassName={overlayClassName} />;
  }

  return (
    <div className="absolute inset-0">
      <video
        src={media.url}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}

function YouTubeBackground({ videoId, overlayClassName }: { videoId: string; overlayClassName: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // If the IFrame API script cannot load (blocked network/extension), the
  // player state is unknowable — reveal the video rather than hide it forever.
  const [apiFailed, setApiFailed] = useState(false);
  const showVideo = isPlaying || apiFailed;
  // The embed URL carries the page origin (required by the IFrame API), which
  // is only known in the browser — "" during SSR/hydration, so the iframe
  // mounts once the client has rendered.
  const origin = useSyncExternalStore(subscribeNoop, getOrigin, getServerOrigin);

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
    if (!origin) return;
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
  }, [origin, attachPlayer]);

  if (!origin) return null;

  const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&fs=0&enablejsapi=1&origin=${encodeURIComponent(origin)}`;

  return (
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
      <div className={`absolute inset-0 ${overlayClassName}`} />
      {/* Brand-gradient cover: opaque until the player reports PLAYING */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-hero-gradient transition-opacity duration-1000 ease-out ${
          showVideo ? "opacity-0" : "opacity-100"
        }`}
      />
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="lazyOnload"
        onLoad={attachPlayer}
        onError={() => setApiFailed(true)}
      />
    </div>
  );
}
