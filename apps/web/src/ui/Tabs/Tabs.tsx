/* ============================================================================
 * Tabs — accessible tab strip (SPEC-03 A12). Active = gold; strips scroll
 * horizontally with peek @375 via the Scroller primitive. Roving-tabindex
 * keyboard nav (Arrow/Home/End); proper role="tablist"/"tab" semantics. The
 * consumer renders the active panel from the returned `active` id.
 * ==========================================================================*/

"use client";

import { useRef, type ReactNode } from "react";
import { Scroller } from "../Scroller/Scroller";
import styles from "./Tabs.module.css";

export interface TabItem {
  id: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  /** scroll the strip horizontally (default true for @375 peek) */
  scrollable?: boolean;
  label?: string;
  className?: string;
}

export function Tabs({
  items,
  active,
  onChange,
  scrollable = true,
  label,
  className,
}: TabsProps) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, idx: number) => {
    const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);
    const pos = enabled.indexOf(idx);
    let nextPos = pos;
    if (e.key === "ArrowRight") nextPos = (pos + 1) % enabled.length;
    else if (e.key === "ArrowLeft") nextPos = (pos - 1 + enabled.length) % enabled.length;
    else if (e.key === "Home") nextPos = 0;
    else if (e.key === "End") nextPos = enabled.length - 1;
    else return;
    e.preventDefault();
    const nextIdx = enabled[nextPos];
    btnRefs.current[nextIdx]?.focus();
    onChange(items[nextIdx].id);
  };

  const strip = (
    <div className={styles.list} role="tablist" aria-label={label}>
      {items.map((it, i) => {
        const selected = it.id === active;
        return (
          <button
            key={it.id}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${it.id}`}
            aria-selected={selected}
            aria-controls={`panel-${it.id}`}
            tabIndex={selected ? 0 : -1}
            disabled={it.disabled}
            className={[styles.tab, selected ? styles.active : ""].filter(Boolean).join(" ")}
            onClick={() => onChange(it.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={[styles.tabs, className].filter(Boolean).join(" ")}>
      {scrollable ? (
        <Scroller snap={false} peek label={label}>
          {strip}
        </Scroller>
      ) : (
        strip
      )}
    </div>
  );
}
