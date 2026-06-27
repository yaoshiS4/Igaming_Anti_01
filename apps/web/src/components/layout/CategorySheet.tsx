/* ============================================================================
 * CategorySheet — the mobile category spine (SPEC-03 B10 / UT-3). A round-icon
 * grid of the verticals presented in the Overlay sheet. Opened from the
 * persistent `Danh mục` trigger in the sticky chrome on EVERY mobile page AND
 * from a `Trang chủ`-tap-when-already-home — so any vertical is reachable in
 * ≤1 tap from anywhere on mobile, WITHOUT scrolling a page to its top or
 * routing through Home. Focus-trapped, swipe-down/Esc/scrim dismiss (Overlay).
 * ==========================================================================*/

"use client";

import Link from "next/link";
import { useId } from "react";
import type { Vertical } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { Icon } from "@/ui/Icon/Icon";
import { Overlay } from "./_internal/Overlay";
import { verticalIcon } from "./_internal/verticalIcon";
import styles from "./CategorySheet.module.css";

export interface CategorySheetProps {
  open: boolean;
  onClose: () => void;
  verticals: Vertical[];
}

export function CategorySheet({ open, onClose, verticals }: CategorySheetProps) {
  const titleId = useId();
  return (
    <Overlay open={open} onClose={onClose} presentation="sheet" labelledBy={titleId}>
      <div className={styles.body}>
        <h2 id={titleId} className={styles.title}>
          {vi.nav.categories}
        </h2>
        <ul className={styles.grid}>
          {verticals.map((v) => (
            <li key={v.id}>
              <Link href={v.href} className={styles.tile} onClick={onClose}>
                <span className={styles.iconCircle} aria-hidden="true">
                  <Icon name={verticalIcon(v.iconId)} size={28} />
                </span>
                <span className={styles.label}>{v.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Overlay>
  );
}
