"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useIntersection } from "@/hooks/use-intersection";

interface ProgressIndicatorProps {
  percent: number;
  label?: string;
}

export function ProgressIndicator({ percent, label }: ProgressIndicatorProps) {
  const { ref, isInView } = useIntersection({ threshold: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const clampedPercent = Math.max(0, Math.min(100, percent));

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-center justify-between mb-2">
        {label && <span className="text-sm font-medium text-navy">{label}</span>}
        <span className="text-sm font-bold text-celeste">{clampedPercent}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-celeste to-celeste/70"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${clampedPercent}%` } : { width: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>
    </div>
  );
}
