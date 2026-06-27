/* ============================================================================
 * Scroller — the ONE horizontal-scroll primitive (SPEC-03 §E/H5). Every @375
 * strip and wide matrix composes it (no per-component scroll hacks): 16px peek
 * (--gutter), CSS scroll-snap, momentum without scroll-hijack, edge fades.
 * `freezeFirstColumn` pins column 1 while the rest scrolls — for the privilege
 * / club comparison matrices' frozen-first-column @375 (6.1/6.2/8.1).
 *
 * The page body never scrolls horizontally (globals.css overflow-x:hidden);
 * wide content scrolls inside THIS, in its own overflow-x container.
 * ==========================================================================*/

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Scroller.module.css";

export interface ScrollerProps {
  children: ReactNode;
  /** enable scroll-snap on children (default true) */
  snap?: boolean;
  /** show 16px peek of the next item (default true) */
  peek?: boolean;
  /** pin the first column (matrix mode) */
  freezeFirstColumn?: boolean;
  /** aria role/label for the scroll region */
  label?: string;
  className?: string;
}

export function Scroller({
  children,
  snap = true,
  peek = true,
  freezeFirstColumn = false,
  label,
  className,
}: ScrollerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState<{ start: boolean; end: boolean }>({
    start: true,
    end: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const atStart = el.scrollLeft <= 1;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      setEdge({ start: atStart, end: atEnd });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className={[
        styles.outer,
        edge.start ? "" : styles.fadeStart,
        edge.end ? "" : styles.fadeEnd,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        ref={ref}
        className={[
          styles.rail,
          snap ? styles.snap : "",
          peek ? styles.peek : "",
          freezeFirstColumn ? styles.freeze : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role="group"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}
