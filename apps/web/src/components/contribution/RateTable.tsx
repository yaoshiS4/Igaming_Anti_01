/* ============================================================================
 * RateTable — the frame + the a11y <table> + the frozen name column + the
 * numbered pager (owner conventional-table override, decisions/2026-08-10). It
 * renders WHATEVER ROWS IT IS GIVEN, IN THE ORDER GIVEN — the current page of the
 * flat per-game table (default), or the narrowed set after search / filters. It
 * holds zero business logic: the island computes the rows, filters and the page
 * slice. Column 2 is the rate — right after the frozen name column, never last.
 * Every row's rate resolves via its category (a title carries no rate).
 *
 * FROZEN COLUMN — three pitfalls, per §5:
 *   1. Scroller `freezeFirstColumn` targets the rail's first FLEX child (the
 *      <table>), which is inert for a full-width table — pass it (it also sets
 *      scroll-snap-type:none) but the pin comes from `.rowHead`.
 *   2. Scroller.freeze paints --surface-3 onto the <table>, so EVERY cell sets
 *      its own opaque background or the frozen column won't occlude.
 *   3. No sticky <thead> (a 72px collapsing header would slide under it); no
 *      zebra (rows separate on a --border hairline).
 * The Pager AND TableFoot sit INSIDE the frame but OUTSIDE the Scroller — they
 * never scroll sideways. The freshness stamp lives in TableFoot, inside the crop
 * region, so any crop of the table self-dates.
 * ==========================================================================*/

import type { CategoryRate } from "@/lib/mock";
import { Scroller } from "@/ui/Scroller/Scroller";
import { t, vi } from "@/lib/i18n";
import { RateCell } from "./RateCell";
import { Pager } from "./Pager";
import { TableFoot } from "./TableFoot";
import styles from "./RateTable.module.css";

/** One rendered per-game row. The rate always resolves from a category, never
 *  authored on a title. */
export interface RateRow {
  key: string;
  /** column 1 — the frozen <th scope="row"> (the game title) */
  name: string;
  /** column 2 — the rate (via RateCell) */
  rate: CategoryRate;
  /** column 3 — the game type (category name) */
  category: string;
  /** column 4 — the provider */
  provider: string;
}

export function RateTable({
  rows,
  stampDate,
  version,
  page,
  pageCount,
  onPage,
}: {
  /** the CURRENT PAGE of rows, already in display order */
  rows: RateRow[];
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
    <>
    <div className={styles.frame}>
      <Scroller
        freezeFirstColumn
        snap={false}
        peek={false}
        label={vi.contribution.scrollerLabel}
      >
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            {t(vi.contribution.tableCaption, { date: stampDate, version })}
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
          sideways). Replaces the old "Xem thêm / Xem tất cả" reveal. */}
      <Pager page={page} pageCount={pageCount} onPage={onPage} />

      <TableFoot stampDate={stampDate} version={version} />
    </div>

    {/* legend UNDER the table — explains the one non-standard marker: a bare 0%
        (playable, counts nothing toward valid turnover). */}
    <div className={styles.legend}>
      <p className={styles.legendLine}>{vi.contribution.legendZero}</p>
    </div>
    </>
  );
}
