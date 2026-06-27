/* ============================================================================
 * CategoryBanner — the vertical landing hero (SPEC-03 §home banner + Part 5
 * asset-slot rule). A token-derived gradient SLOT (NO J9 art) carrying the
 * vertical label + a short plain-VN kicker. The banner is static navigation
 * furniture — it hosts no live figure, so it has no loading/error state of its
 * own (the page's dynamic surfaces own those).
 *
 * The vertical icon resolves from the inline icon sprite; verticals whose
 * fixture iconId has no glyph yet fall back to a safe sprite icon (never a
 * broken/empty glyph, never a network icon-font request — SPEC-04 0.3).
 * ==========================================================================*/

import type { Vertical } from "@/lib/types";
import { Icon, type IconName } from "@/ui";
import styles from "./CategoryBanner.module.css";

export interface CategoryBannerProps {
  vertical: Vertical;
}

/** Plain-VN one-line kicker per vertical (marketing copy, never a number). */
const KICKERS: Record<string, string> = {
  casino: "Sòng bài trực tiếp đẳng cấp",
  slots: "Quay là trúng, nổ hũ mỗi ngày",
  sports: "Kèo bóng đá & thể thao trực tiếp",
  fishing: "Săn cá thưởng lớn",
  card: "Game bài dân gian quen thuộc",
  lottery: "Xổ số & lô đề đa dạng",
  cockfight: "Trường gà trực tiếp",
  table: "Bàn chơi cổ điển",
  arcade: "Game nhanh giải trí tức thì",
};

/** iconId → sprite glyph, with a safe fallback for not-yet-drawn verticals. */
function resolveIcon(iconId: string): IconName {
  const known: Record<string, IconName> = {
    casino: "card",
    slots: "slots",
    sports: "sports",
    fishing: "live",
    card: "card",
    lottery: "grid",
    cockfight: "trophy",
    table: "grid",
    arcade: "slots",
  };
  return known[iconId] ?? "grid";
}

export function CategoryBanner({ vertical }: CategoryBannerProps) {
  return (
    <section
      className={styles.banner}
      data-vertical={vertical.id}
      aria-label={vertical.label}
    >
      {/* token-derived gradient SLOT — awaiting licensed art (Part 5) */}
      <span className={styles.slot} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.iconWrap} aria-hidden="true">
          <Icon name={resolveIcon(vertical.iconId)} size={28} />
        </span>
        <h1 className={styles.title}>{vertical.label}</h1>
        {KICKERS[vertical.id] && (
          <p className={styles.kicker}>{KICKERS[vertical.id]}</p>
        )}
      </div>
    </section>
  );
}
