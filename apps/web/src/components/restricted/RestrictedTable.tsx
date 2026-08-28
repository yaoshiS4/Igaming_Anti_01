/* ============================================================================
 * RestrictedTable — the frame + the a11y <table> + the frozen name column + the
 * numbered pager for the bonus-restricted list (/game-han-che). It matches the
 * rate table's column set + order — Tên trò chơi · Tỷ lệ được tính · Loại trò
 * chơi · Nhà cung cấp — with the rate as column 2, right after the frozen name.
 * Each row's rate resolves via its category (a title carries no rate); for the
 * curated restricted set every category resolves to a bare "0%", rendered by the
 * SAME RateCell the rate tab uses (never a hardcoded string). It renders WHATEVER
 * ROWS IT IS GIVEN, IN THE ORDER GIVEN — the current page of the list. It holds
 * zero business logic: the island computes the rows and the page slice.
 *
 * FROZEN COLUMN (mirrors RateTable §5):
 *   1. Scroller `freezeFirstColumn` targets the rail's first flex child (the
 *      <table>) — pass it (it also sets scroll-snap-type:none) but the pin comes
 *      from `.rowHead`.
 *   2. EVERY cell sets its own opaque background or the frozen column won't
 *      occlude the scrolling body.
 *   3. No sticky <thead>; no zebra (rows separate on a --border hairline).
 * The Pager AND RestrictedFoot sit INSIDE the frame but OUTSIDE the Scroller —
 * they never scroll sideways. The stamp lives in RestrictedFoot, inside the crop
 * region, so any crop of the table self-dates.
 * ==========================================================================*/

import type { CategoryRate } from "@/lib/mock";
import { Scroller } from "@/ui/Scroller/Scroller";
import { t, vi } from "@/lib/i18n";
import { Pager, RateCell } from "@/components/contribution";
import { RestrictedFoot } from "./RestrictedFoot";
import styles from "./RestrictedTable.module.css";

/** One rendered restricted-game row. The rate always resolves from a category,
 *  never authored on a title (mirrors the rate table). */
export interface RestrictedRow {
  key: string;
  /** column 1 — the frozen <th scope="row"> (the game title) */
  name: string;
  /** column 2 — the rate (via RateCell); the curated set resolves to "0%" */
  rate: CategoryRate;
  /** column 3 — the game type (category name) */
  category: string;
  /** column 4 — the provider */
  provider: string;
}

export function RestrictedTable({
  rows,
  stampDate,
  version,
  page,
  pageCount,
  onPage,
}: {
  /** the CURRENT PAGE of rows, already in display order */
  rows: RestrictedRow[];
  /** effective-from, formatted to the minute (DD/MM/YYYY HH:mm) */
  stampDate: string;
  version: string;
  /** active 1-based page */
  page: number;
  /** total pages across the filtered set */
  pageCount: number;
  /** request a page change */
  onPage: (n: number) => void;
}) {
  return (
    <div className={styles.frame}>
      <Scroller
        freezeFirstColumn
        snap={false}
        peek={false}
        label={vi.restricted.scrollerLabel}
      >
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            {t(vi.restricted.tableCaption, { date: stampDate, version })}
          </caption>
          <thead>
            <tr className={styles.headRow}>
              <th scope="col" className={`${styles.th} ${styles.corner}`}>
                {vi.contribution.colGame}
              </th>
              <th scope="col" className={styles.th}>
                {vi.contribution.colRate}
              </th>
              <th scope="col" className={styles.th}>
                {vi.contribution.colCategory}
              </th>
              <th scope="col" className={styles.th}>
                {vi.contribution.colProvider}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row" className={styles.rowHead}>
                  <span className={styles.rowName}>{row.name}</span>
                </th>
                <td className={styles.td} data-numeric>
                  <RateCell rate={row.rate} />
                </td>
                <td className={`${styles.td} ${styles.meta}`}>{row.category}</td>
                <td className={`${styles.td} ${styles.meta}`}>{row.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Scroller>

      {/* numbered pager — inside the frame, OUTSIDE the Scroller (never scrolls
          sideways). Reused verbatim from the contribution feature. */}
      <Pager page={page} pageCount={pageCount} onPage={onPage} />

      <RestrictedFoot stampDate={stampDate} version={version} />
    </div>
  );
}
