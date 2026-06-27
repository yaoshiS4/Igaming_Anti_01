/* ============================================================================
 * Modal (the Dialog primitive) — ONE reusable, LAZY-MOUNTED overlay (SPEC-03
 * A5). Replaces J9's pre-rendered el-dialog farm: NOT in DOM until `open`.
 * SOLID --scrim (no blur — lint) → dialog box (--radius-card, --halo) → header
 * + content. Focus-trapped; Esc + scrim close; returns focus to trigger.
 * Centered on desktop; presents as a bottom Sheet <640 (responsive — the CSS
 * pins it to the bottom edge below the breakpoint, matching A5).
 * ==========================================================================*/

"use client";

import { useCallback, useEffect, useId, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/rg";
import { Icon } from "../Icon/Icon";
import styles from "./Modal.module.css";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  /** hide the built-in close button (e.g. forced-choice dialogs) */
  hideClose?: boolean;
  children: ReactNode;
  /** sticky footer action row */
  footer?: ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  size = "md",
  hideClose = false,
  children,
  footer,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const titleId = useId();

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      const t = setTimeout(() => {
        const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
        (first ?? panelRef.current)?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
    triggerRef.current?.focus?.();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className={styles.root} data-reduced={reduced || undefined}>
      <div className={styles.scrim} onClick={close} aria-hidden="true" />
      <div
        ref={panelRef}
        className={[styles.panel, styles[size], className].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        {(title || !hideClose) && (
          <header className={styles.header}>
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            {!hideClose && (
              <button type="button" className={styles.closeBtn} onClick={close} aria-label="Đóng">
                <Icon name="close" />
              </button>
            )}
          </header>
        )}
        <div className={styles.content}>{children}</div>
        {footer != null && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>
  );
}
