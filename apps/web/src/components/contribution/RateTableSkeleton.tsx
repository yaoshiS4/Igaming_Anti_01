/* ============================================================================
 * RateTableSkeleton — the loading shape (BACKLOG ST-13, prototype §4.7). Filter-
 * control placeholders + a head row + 8 rows at the REAL row height, so nothing
 * shifts when data lands (CLS ≈ 0). Built on ui/Skeleton (branded sweep) — there
 * is NO spinner anywhere in this feature. role="status" + aria-busy + a visually-
 * hidden `loadingSr`; the shimmer freezes to a static fill under
 * prefers-reduced-motion (ui/Skeleton + motion.css handle it — no per-component
 * opt-out needed).
 * ==========================================================================*/

import { Skeleton } from "@/ui/Skeleton/Skeleton";
import { vi } from "@/lib/i18n";
import styles from "./RateTableSkeleton.module.css";

export function RateTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className={styles.wrap} role="status" aria-busy="true">
      <span className={styles.srOnly}>{vi.contribution.loadingSr}</span>

      {/* filter-control placeholders */}
      <div className={styles.filters} aria-hidden="true">
        <Skeleton shape="block" height="var(--tap-bar)" width="100%" />
        <div className={styles.rail}>
          {[72, 88, 64, 120, 80].map((w, i) => (
            <Skeleton key={i} shape="pill" height="var(--tap-min)" width={w} />
          ))}
        </div>
      </div>

      {/* table footprint — head row + N rows at the real row height */}
      <div className={styles.frame} aria-hidden="true">
        <div className={`${styles.row} ${styles.head}`}>
          <span className={styles.cellName}>
            <Skeleton width="60%" />
          </span>
          <span className={styles.cellRate}>
            <Skeleton width="50%" />
          </span>
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div className={styles.row} key={i}>
            <span className={styles.cellName}>
              <Skeleton width={`${55 + ((i * 7) % 35)}%`} />
            </span>
            <span className={styles.cellRate}>
              <Skeleton width="40%" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
