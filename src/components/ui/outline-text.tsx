import type { HTMLAttributes } from "react";

/**
 * Italic accent word inside a heading (mockup: "Tu hogar *ideal*").
 * Solid celeste by default; rendered as a celeste outline when inside an
 * element with data-tone="dark" (dark heroes and bands).
 */
export function OutlineText({ className = "", children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`text-outline font-black italic ${className}`} {...props}>
      {children}
    </span>
  );
}
