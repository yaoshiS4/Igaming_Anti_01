/* ============================================================================
 * Luxury VIP — PrivilegeMatrix (guest). Rows = 4 privileges, cols = the 5 TIERS
 * (never 10). Cell unlocked when rowIndex < tier.perks (cumulative). Selected
 * tier column is gold-tinted (criterion 5). Per-tier gem header (tier accent),
 * green ✓ / grey lock cells. Sticky first column for horizontal scroll.
 * ==========================================================================*/
import { getVipCopy, PRIVILEGES, type Lang, type VipTierDef } from "@/lib/vip";
import styles from "./PrivilegeMatrix.module.css";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden focusable="false">
      <path
        d="M5 12.5l4.2 4.2L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden focusable="false">
      <rect
        x="5"
        y="10.5"
        width="14"
        height="9.5"
        rx="1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 10.5V8a4 4 0 018 0v2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PrivilegeMatrix({
  tiers,
  selected,
  lang,
}: {
  tiers: VipTierDef[];
  selected: number;
  lang: Lang;
}) {
  const copy = getVipCopy(lang);

  return (
    <div className={styles.scroller}>
      <table className={styles.table}>
        <caption className={styles.srOnly}>{copy.tierMatrixTitle}</caption>
        <thead>
          <tr>
            <th className={`${styles.th} ${styles.rowHead}`} scope="col">
              <span className={styles.srOnly}>{copy.tierMatrixTitle}</span>
            </th>
            {tiers.map((tier, i) => (
              <th
                key={tier.id}
                scope="col"
                className={`${styles.th} ${styles.tierHead} ${
                  i === selected ? styles.colSelected : ""
                }`}
              >
                <span
                  className={styles.gem}
                  style={{ background: tier.grad }}
                  aria-hidden
                />
                <span className={styles.tierName}>{copy[tier.nameKey]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PRIVILEGES.map((key, rowIdx) => (
            <tr key={key}>
              <th scope="row" className={`${styles.td} ${styles.rowHead}`}>
                {copy[key]}
              </th>
              {tiers.map((tier, i) => {
                const unlocked = rowIdx < tier.perks;
                return (
                  <td
                    key={tier.id}
                    className={`${styles.td} ${styles.cell} ${
                      i === selected ? styles.colSelected : ""
                    }`}
                  >
                    <span
                      className={unlocked ? styles.check : styles.lock}
                      title={
                        unlocked ? copy[key] : `${copy[key]} — ${copy.needWager} ${tier.unlock}`
                      }
                    >
                      {unlocked ? <CheckIcon /> : <LockIcon />}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
