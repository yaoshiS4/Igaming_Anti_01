/* ============================================================================
 * Card — the ONE card chassis every surface inherits (SPEC-03 A4, the
 * .common_box analog). FLAT: --radius-card box, load-bearing gold hairline,
 * solid --surface fill; ZERO depth (no shadow/glow/gradient). Lit/active = a
 * solid 8% accent film + solid accent border. Interactive cards hover →
 * uniform scale(1.02) + border colour shift on pointer (icons inside ride at
 * 1.10), press scale(.98) on touch; reduced-motion → colour shift only.
 * Renders as <a> when `href` is set, else <div> (or <button> when interactive
 * + onClick).
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
