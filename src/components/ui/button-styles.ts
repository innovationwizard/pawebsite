/**
 * Single source of truth for button styling, shared by <Button> (real
 * <button>) and <ButtonLink> (Next <Link> / <a>) so every CTA on the site
 * gets the same pill shape, palette and border-sweep hover.
 */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "outline-light"
  | "ghost"
  | "celeste";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "btn-sweep inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 focus-visible:ring-primary/50 [--sweep-color:var(--color-celeste)]",
  secondary:
    "bg-navy text-white hover:bg-navy/90 hover:shadow-lg focus-visible:ring-navy/50 [--sweep-color:var(--color-celeste)]",
  celeste:
    "bg-celeste text-navy hover:bg-celeste/90 hover:shadow-lg hover:shadow-celeste/20 focus-visible:ring-celeste/50 [--sweep-color:var(--color-white)]",
  outline:
    "border-2 border-navy/25 text-navy hover:border-navy/25 hover:bg-navy/5 focus-visible:ring-navy/50 [--sweep-color:var(--color-navy)]",
  "outline-light":
    "border-2 border-white/30 text-white hover:bg-white/10 focus-visible:ring-white/50 [--sweep-color:var(--color-celeste)]",
  ghost: "text-navy hover:bg-navy/5 focus-visible:ring-navy/50 [--sweep-color:var(--color-celeste)]",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function buttonClassName(opts: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  const { variant = "primary", size = "md", className = "" } = opts;
  return `${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`.trim();
}
