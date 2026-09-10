import type { ReactNode } from "react";
import { Eyebrow } from "./eyebrow";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** `dark` = white heading on navy; `light` = navy heading on white. */
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
  size?: "md" | "lg";
  className?: string;
}

/** Eyebrow + heading + lead paragraph, laid out per the ajustes6 mockup. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "light",
  align = "left",
  as: Tag = "h2",
  size = "md",
  className = "",
}: SectionHeadingProps) {
  const titleColor = tone === "dark" ? "text-white" : "text-navy";
  const leadColor = tone === "dark" ? "text-white/70" : "text-gray";
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  const titleSize =
    size === "lg"
      ? "text-4xl md:text-5xl lg:text-6xl"
      : "text-3xl md:text-4xl lg:text-[2.75rem]";

  return (
    <div className={`max-w-3xl ${alignment} ${className}`}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <Tag
        className={`font-heading font-extrabold leading-[1.08] tracking-tight ${titleSize} ${titleColor}`}
      >
        {title}
      </Tag>
      {lead && (
        <p className={`mt-5 text-base leading-relaxed md:text-lg ${leadColor} ${align === "center" ? "mx-auto" : ""} max-w-2xl`}>
          {lead}
        </p>
      )}
    </div>
  );
}
