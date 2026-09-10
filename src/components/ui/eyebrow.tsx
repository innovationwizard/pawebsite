import type { HTMLAttributes } from "react";

/** Small uppercase label above a heading — "NUESTROS PROYECTOS", "¿CÓMO LO HACEMOS?" */
export function Eyebrow({ className = "", children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.22em] text-celeste md:text-xs ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}
