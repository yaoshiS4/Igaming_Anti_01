/* ============================================================================
 * ComingSoonTile — the PREMIUM "Sắp ra mắt" (coming soon) grid filler.
 * ----------------------------------------------------------------------------
 * Replaces the old plain-dashed Tile `comingSoon` pad. Fills a partial/short
 * grid row with a gold-on-obsidian card so the lobby NEVER shows a ragged dark
 * void (defect 4) and reads as an intentional, premium placeholder — not an
 * empty slot or a cloned game.
 *
 * Anatomy (token-derived only — no raw ramp literals, no external asset):
 *   • FLAT solid --tile field with a load-bearing gold hairline (the old gold
 *     radial+linear gradient field, its --glow-gold shadow and its sweeping
 *     diagonal sheen are all removed: cards carry no gradients and no depth,
 *     and an animated gold band is a glow by another name)
 *   • a centred gold lock glyph on a solid 12% accent disc (Icon `lock`)
 *   • "Sắp ra mắt" headline (Vietnamese-first) + a small teaser/date line
 *   • fully static — reduced-motion safe by construction, no opt-out needed
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
