/* ============================================================================
 * RestrictedFoot — the freshness stamp rendered INSIDE the table's own border
 * (sibling of the contribution TableFoot) so any crop of the list self-dates.
 * The restricted list has no settlement/rate notes — only the update stamp
 * (effective-from, to the minute) + the published version. Reuses the generic
 * contribution.updateStamp template.
 * ==========================================================================*/

import { t, vi } from "@/lib/i18n";
import styles from "./RestrictedFoot.module.css";

export function RestrictedFoot({
  stampDate,
  version,
}: {
  /** effective-from, already formatted to the minute (DD/MM/YYYY HH:mm) */
  stampDate: string;
  version: string;
}) {
  return (
    <div className={styles.foot}>
      <p className={styles.stamp} data-numeric>
        {t(vi.contribution.updateStamp, { date: stampDate, version })}
      </p>
    </div>
  );
}
