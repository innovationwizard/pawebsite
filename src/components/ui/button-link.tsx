import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import {
  buttonClassName,
  type ButtonSize,
  type ButtonVariant,
} from "./button-styles";

interface ButtonLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Force a plain <a> (used for wa.me / tel: / external links). */
  external?: boolean;
  children: ReactNode;
}

/**
 * Link styled exactly like <Button>. Internal routes and in-page anchors go
 * through Next <Link>; external/protocol links render a plain <a> with
 * noopener by default.
 */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  external,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  const classes = buttonClassName({ variant, size, className });
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
