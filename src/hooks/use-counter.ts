"use client";

import { useEffect, useState } from "react";

interface UseCounterOptions {
  end: number;
  duration?: number;
  enabled?: boolean;
}

export function useCounter({
  end,
  duration = 2000,
  enabled = false,
}: UseCounterOptions): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, enabled]);

  return count;
}
