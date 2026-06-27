/* ============================================================================
 * Card — the ONE card chassis every surface inherits (SPEC-03 A4, the
 * .common_box analog). --radius-card box, gold hairline, --surface fill, glow-
 * not-shadow on lit/active. Interactive cards hover → glow + lift on pointer,
 * press scale(.98) on touch; reduced-motion → glow only. Renders as <a> when
 * `href` is set, else <div> (or <button> when interactive + onClick).
 * ==========================================================================*/

import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Card.module.css";

export type CardVariant = "default" | "rail" | "promo" | "product" | "vip" | "tile";

export interface CardProps {
  variant?: CardVariant;
  interactive?: boolean;
  href?: string;
  /** lit/active state — inner gold glow */
  active?: boolean;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  "aria-label"?: string;
}

export function Card({
  variant = "default",
  interactive = false,
  href,
  active = false,
  className,
  children,
  onClick,
  ...rest
}: CardProps) {
  const cls = [
    styles.card,
    styles[variant],
    interactive ? styles.interactive : "",
    active ? styles.active : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  if (interactive && onClick) {
    return (
      <button type="button" className={cls} onClick={onClick} {...rest}>
        {children}
      </button>
    );
  }
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}
