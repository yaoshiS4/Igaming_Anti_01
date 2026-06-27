/* ============================================================================
 * TileSkeleton — a game-tile-SHAPED placeholder pinned to the canonical J9 tile
 * height (--tile-h, 205px), radius 8, tile bg #262833. Two jobs (both keep a
 * game grid from ever showing ragged trailing space — defect 4):
 *   • loading  — a branded sweep while real tiles stream in (aria-busy)
 *   • filler   — a quiet, inert pad-tile that completes a partial last row so
 *                the grid always lands on full rows (aria-hidden, no sweep)
 * Same footprint as a real <Tile fill> so the swap-in causes zero layout shift.
 * ==========================================================================*/

import styles from "./TileSkeleton.module.css";

export interface TileSkeletonProps {
  /** loading = animated branded sweep (default); filler = inert quiet pad-tile */
  variant?: "loading" | "filler";
  className?: string;
  /** accessible busy label for the loading variant */
  label?: string;
}

export function TileSkeleton({
  variant = "loading",
  className,
  label = "Đang tải",
}: TileSkeletonProps) {
  const isFiller = variant === "filler";
  return (
    <div
      className={[styles.tile, isFiller ? styles.filler : styles.loading, className]
        .filter(Boolean)
        .join(" ")}
      {...(isFiller
        ? { "aria-hidden": true }
        : { role: "status", "aria-busy": true, "aria-label": label })}
    />
  );
}
