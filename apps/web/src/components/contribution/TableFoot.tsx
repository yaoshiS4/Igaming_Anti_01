/* ============================================================================
 * TableFoot — the settlement sentence + the freshness stamp, rendered INSIDE
 * the table's own border (BACKLOG ST-06, prototype §3.3) so any crop of the
 * table self-dates and self-explains. Carries:
 *   · settleNote  — winnings/losses settle as normal, including 0% types
 *   · sportCaveat — OD-5: a bet can still not count even where the game has a rate
 *   · changeNotice — 30-day change notice
 *   · the stamp = updateStamp with version + effective-from + timestamp-to-minute
 * Stacks (notes then stamp) <768; two columns (notes left, stamp right) ≥768.
 * ==========================================================================*/

import { t, vi } from "@/lib/i18n";
import styles from "./TableFoot.module.css";

export function TableFoot({
  stampDate,
  version,
}: {
  /** effective-from, already formatted to the minute (DD/MM/YYYY HH:mm) */
  stampDate: string;
  version: string;
}) {
  return (
    <div className={styles.foot}>
      <div className={styles.notes}>
        <p className={styles.line}>{vi.contribution.settleNote}</p>
        <p className={styles.line}>{vi.contribution.sportCaveat}</p>
        <p className={styles.line}>{vi.contribution.changeNotice}</p>
      </div>
      <p className={styles.stamp} data-numeric>
        {t(vi.contribution.updateStamp, { date: stampDate, version })}
      </p>
    </div>
  );
}
