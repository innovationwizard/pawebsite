"use client";

import { useCounter } from "@/hooks/use-counter";
import { useIntersection } from "@/hooks/use-intersection";

interface CounterAnimationProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function CounterAnimation({
  end,
  prefix = "",
  suffix = "",
  duration = 2000,
  className = "",
}: CounterAnimationProps) {
  const { ref, isInView } = useIntersection({ threshold: 0.3 });
  const count = useCounter({ end, duration, enabled: isInView });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString("es-GT")}
      {suffix}
    </span>
  );
}
