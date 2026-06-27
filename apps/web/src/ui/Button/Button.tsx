/* ============================================================================
 * Button — every actionable button (SPEC-03 A1). Variants gold / primary /
 * ghost (+ a `danger` CTA reading --cta-accent — red is CTA/true-error ONLY,
 * never an outcome). ≥--tap-min (44px) enforced; bottom-bar callers pass
 * size="bar" for ≥48px. Loading is single-flight: blocks re-submit + shows a
 * spinner. Reads --brand-* / semantic vars only (lint A2).
 * ==========================================================================*/

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "../Icon/Icon";
import styles from "./Button.module.css";

export type ButtonVariant = "gold" | "primary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "bar";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** leading icon name from the Icon sprite */
  icon?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  fullWidth = false,
  disabled,
  type = "button",
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const blocked = disabled || loading;
  return (
    <button
      type={type}
      disabled={blocked}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.full : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      // single-flight: a loading button never re-fires its handler
      onClick={loading ? undefined : onClick}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && icon && <Icon name={icon} className={styles.icon} />}
      {children != null && <span className={styles.label}>{children}</span>}
    </button>
  );
}
