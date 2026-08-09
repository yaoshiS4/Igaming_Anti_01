/* ============================================================================
 * Luxury VIP — LevelTable. 6 metric rows × levels 1..10 of the SELECTED tier,
 * every value single-sourced from formulas.ts. Sticky first col + header + corner,
 * horizontal scroll on narrow screens.
 *
 * Member highlight (currentTierIndex !== null):
 *   - selected tier === current tier → spotlight the currentLevel column
 *     (gold band, bold), dim + lock levels ABOVE currentLevel;
 *   - selected tier ABOVE current tier → dim ALL cells (unreached);
 *   - selected tier BELOW current tier → plain.
 * Guest (currentTierIndex === null) → plain, bare "CẤP n" headers, no highlight.
 * ==========================================================================*/
import {
  fmtCash,
  fmtGift,
  fmtRate,
  getVipCopy,
  giftAt,
  rate,
  type Lang,
  type VipTierDef,
} from "@/lib/vip";
import styles from "./LevelTable.module.css";

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function LevelTable({
  tier,
  selectedTierIndex,
  currentTierIndex,
  currentLevel,
  lang,
}: {
  tier: VipTierDef;
  selectedTierIndex: number;
  currentTierIndex: number | null;
  currentLevel: number | null;
  lang: Lang;
}) {
  const copy = getVipCopy(lang);

  const isOwnTier =
    currentTierIndex !== null && selectedTierIndex === currentTierIndex;
  const isAboveCurrent =
    currentTierIndex !== null && selectedTierIndex > currentTierIndex;

  const rows: { key: string; label: string; cell: (level: number) => string }[] =
    [
      { key: "gift", label: copy.rbGift, cell: (l) => fmtGift(giftAt(selectedTierIndex, l)) },
      { key: "live", label: copy.rbLive, cell: (l) => fmtRate(rate(tier.rebate.live, l)) },
      { key: "sports", label: copy.rbSports, cell: (l) => fmtRate(rate(tier.rebate.sports, l)) },
      { key: "slots", label: copy.rbSlots, cell: (l) => fmtRate(rate(tier.rebate.slots, l)) },
      { key: "table", label: copy.rbTable, cell: (l) => fmtRate(rate(tier.rebate.table, l)) },
      { key: "cash", label: copy.rbCashback, cell: (l) => fmtCash(rate(tier.cash, l)) },
    ];

  /** true → gold spotlight column (only the member's own current level). */
  const isSpotlight = (level: number) =>
    isOwnTier && currentLevel !== null && level === currentLevel;

  /** true → locked-ahead within own tier (dim + lock glyph in header). */
  const isLockedAhead = (level: number) =>
    isOwnTier && currentLevel !== null && level > currentLevel;

  /** true → value should render in the disabled/unreached colour. */
  const isDimmed = (level: number) => isAboveCurrent || isLockedAhead(level);

  const cellClasses = (level: number, base: string) => {
    const cls = [base];
    if (isSpotlight(level)) cls.push(styles.spot);
    else if (isDimmed(level)) cls.push(styles.dim);
    return cls.join(" ");
  };

  return (
    <div className={styles.scroller}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            <th
              className={`${styles.th} ${styles.rowHead} ${styles.corner}`}
              scope="col"
            />
            {LEVELS.map((level) => (
              <th
                key={level}
                scope="col"
                className={cellClasses(level, styles.th)}
              >
                <span className={styles.levelWord}>{copy.levelWord}</span>
                <span className={styles.levelNum}>{level}</span>
                {isLockedAhead(level) && (
                  <span className={styles.lock} aria-hidden="true">
                    &#128274;
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row" className={`${styles.td} ${styles.rowHead}`}>
                {row.label}
              </th>
              {LEVELS.map((level) => (
                <td key={level} className={cellClasses(level, styles.td)}>
                  {row.cell(level)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
