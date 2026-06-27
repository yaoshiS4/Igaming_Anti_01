/* ============================================================================
 * ComingSoonTile — the PREMIUM "Sắp ra mắt" (coming soon) grid filler.
 * ----------------------------------------------------------------------------
 * Replaces the old plain-dashed Tile `comingSoon` pad. Fills a partial/short
 * grid row with a gold-on-obsidian card so the lobby NEVER shows a ragged dark
 * void (defect 4) and reads as an intentional, premium placeholder — not an
 * empty slot or a cloned game.
 *
 * Anatomy (token-derived only — no raw ramp literals, no external asset):
 *   • obsidian → gold radial+linear gradient field (Lucky Obsidian language)
 *   • a centred gold lock glyph in a soft ring (Icon `lock`, currentColor)
 *   • "Sắp ra mắt" headline (Vietnamese-first) + a small teaser/date line
 *   • a gentle diagonal sheen that sweeps once on a long loop — reduced-motion
 *     SAFE: motion rides the global --dur-* / prefers-reduced-motion contract
 *     (motion.css zeroes it) AND the keyframe is additionally gated by a local
 *     @media (prefers-reduced-motion: reduce) so the sheen holds still.
 *
 * It is sized EXACTLY like a regular 1×1 game tile (fills the grid cell's fixed
 * --tile-h height) so appending it never shifts the layout on a tab switch.
 * Inert + aria-hidden by default: it is layout/teaser only, never interactive,
 * never announced. Truthful: the date is a generic "Sắp có thêm trò chơi" teaser
 * with NO fabricated game name, count, or hard launch date unless a caller
 * passes a real one.
 * ==========================================================================*/

import { Icon } from "../Icon/Icon";
import styles from "./ComingSoonTile.module.css";

export interface ComingSoonTileProps {
  /** headline — defaults to the Vietnamese "Sắp ra mắt" */
  label?: string;
  /** small teaser line under the headline (no fabricated count/date) */
  teaser?: string;
  className?: string;
}

export function ComingSoonTile({
  label = "Sắp ra mắt",
  teaser = "Thêm trò chơi mới",
  className,
}: ComingSoonTileProps) {
  return (
    <div
      className={[styles.tile, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {/* the single diagonal sheen — reduced-motion safe (gated below) */}
      <span className={styles.sheen} aria-hidden="true" />

      <span className={styles.inner}>
        <span className={styles.lockRing}>
          <Icon name="lock" size={22} className={styles.lockIcon} />
        </span>
        <span className={styles.copy}>
          <span className={styles.label}>{label}</span>
          {teaser && <span className={styles.teaser}>{teaser}</span>}
        </span>
      </span>
    </div>
  );
}
