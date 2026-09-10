import type { HTMLAttributes } from "react";

/**
 * Outlined italic accent word inside a heading (mockup: "Tu hogar *ideal*").
 * Stroke colour is celeste; browsers without text-stroke fall back to solid celeste.
 */
export function OutlineText({ className = "", children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`text-outline font-black italic ${className}`} {...props}>
      {children}
    </span>
  );
}
