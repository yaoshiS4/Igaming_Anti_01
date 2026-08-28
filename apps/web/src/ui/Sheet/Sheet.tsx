/* ============================================================================
 * Sheet — the bottom-sheet base for every mobile overlay (SPEC-03 §E/H4): the
 * AuthModal sheet, DepositSheet, CategorySheet. Lazy-mounted (NOT in DOM until
 * `open`); SOLID --scrim (no backdrop-filter:blur — lint); pinned to the bottom
 * edge with --radius-card top corners + a load-bearing gold top hairline (FLAT
 * — no --halo, no depth) + grab-handle; honors safe-area-inset-
 * bottom. Dismiss via Esc + scrim + swipe-down; focus-trapped with return-focus
 * to the trigger. Reduced-motion → instant mount/unmount (no slide).
 * ==========================================================================*/

"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/rg";
import { Icon } from "../Icon/Icon";
import styles from "./Sheet.module.css";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Esc/scrim/swipe can dismiss; false = controlled-only (default true) */
  dismissible?: boolean;
  /** accessible title for the dialog region */
  title?: string;
  /** id of the heading element inside children (overrides title labelling) */
  labelledBy?: string;
  className?: string;
}

export function Sheet({
  open,
  onClose,
  children,
  dismissible = true,
  title,
  labelledBy,
  className,
}: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const dragStart = useRef<number | null>(null);
  const dragNow = useRef<number>(0);

  const close = useCallback(() => {
    if (dismissible) onClose();
  }, [dismissible, onClose]);

  // Capture the trigger so focus returns to it on close.
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      // move focus into the sheet's first control
      const t = setTimeout(() => {
        const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
        (first ?? panelRef.current)?.focus();
      }, 0);
      return () => clearTimeout(t);
    }
    // returning focus on unmount/close
    triggerRef.current?.focus?.();
  }, [open]);

  // Esc + focus-trap.
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

  // ---- swipe-down to dismiss (touch) ----
  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientY;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (dragStart.current == null || !panelRef.current) return;
    const dy = e.touches[0].clientY - dragStart.current;
    dragNow.current = Math.max(0, dy);
    panelRef.current.style.transform = `translateY(${dragNow.current}px)`;
  };
  const onTouchEnd = () => {
    if (!panelRef.current) return;
    const dy = dragNow.current;
    panelRef.current.style.transform = "";
    dragStart.current = null;
    dragNow.current = 0;
    if (dy > 80) close();
  };

  return (
    <div className={styles.root} data-reduced={reduced || undefined}>
      <div className={styles.scrim} onClick={close} aria-hidden="true" />
      <div
        ref={panelRef}
        className={[styles.panel, className].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : title}
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        {dismissible && (
          <div
            className={styles.handle}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <span className={styles.grip} aria-hidden="true" />
            <button type="button" className={styles.closeBtn} onClick={close} aria-label="Đóng">
              <Icon name="close" />
            </button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
