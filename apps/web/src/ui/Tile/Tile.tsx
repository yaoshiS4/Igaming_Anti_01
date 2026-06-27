/* ============================================================================
 * Tile — image-slot card (SPEC-03 A4 tile variant + Part 5 asset-slot rule).
 * Game/brand/promo thumbnails are PLACEHOLDER SLOTS until licensed art lands:
 * when no `imageSrc` resolves, the slot renders a token-derived gradient + the
 * tile label (never J9 art, never a fabricated thumbnail). One optional corner
 * badge + optional bottom scrim label, per the Card anatomy.
 * ==========================================================================*/

import type { ReactNode } from "react";
import { Card } from "../Card/Card";
import styles from "./Tile.module.css";

export interface TileProps {
  label: string;
  /** real licensed/placeholder asset; falsy → token-gradient slot */
  imageSrc?: string;
  /** alt text when imageSrc resolves */
  alt?: string;
  /** secondary line under the scrim label (e.g. provider) */
  caption?: string;
  /** ONE corner badge (e.g. "MỚI", "HOT") */
  badge?: ReactNode;
  /** image box aspect ratio, e.g. "4 / 5" (J9 game), "16 / 9" (banner), "3 / 2" (landscape art).
   *  Ignored when `fill` is set (the tile then fills a FIXED-height grid cell — J9's 205px li). */
  aspect?: string;
  /** J9 fixed-tile mode: the tile fills its grid cell's fixed height (205px lobby li)
   *  instead of computing height from an aspect ratio. The grid pins the cell size. */
  fill?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function Tile({
  label,
  imageSrc,
  alt,
  caption,
  badge,
  aspect = "4 / 5",
  fill = false,
  href,
  onClick,
  className,
}: TileProps) {
  return (
    <Card
      variant="tile"
      interactive={Boolean(href || onClick)}
      href={href}
      onClick={onClick}
      className={[styles.tile, className].filter(Boolean).join(" ")}
      aria-label={label}
    >
      {/* fixed-tile mode: no aspectRatio — the tile fills the grid cell's pinned height */}
      <div className={styles.media} style={fill ? undefined : { aspectRatio: aspect }}>
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={alt ?? label} className={styles.img} loading="lazy" />
        ) : (
          // PLACEHOLDER SLOT — token-derived gradient + label, awaiting art.
          <span className={styles.slot} aria-hidden="true">
            <span className={styles.slotLabel}>{label}</span>
          </span>
        )}
        {badge != null && <span className={styles.badgeSlot}>{badge}</span>}
        {(label || caption) && (
          <span className={styles.scrim}>
            <span className={styles.name}>{label}</span>
            {caption && <span className={styles.caption}>{caption}</span>}
          </span>
        )}
      </div>
    </Card>
  );
}
