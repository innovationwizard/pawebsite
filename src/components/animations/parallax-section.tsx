"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  backgroundImage?: string;
  speed?: number;
  className?: string;
  overlay?: boolean;
}

export function ParallaxSection({
  children,
  backgroundImage,
  speed = 0.3,
  className = "",
  overlay = true,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 scale-110"
          style={prefersReducedMotion ? {} : { y }}
        >
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {overlay && (
            <div className="absolute inset-0 bg-navy/60" />
          )}
        </motion.div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
