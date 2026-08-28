/* ============================================================================
 * Luxury VIP — PrivilegeComparison (member). Two benefit cards:
 * current tier → cmpT. cmpT = (selected===currentTierIndex && cur<4)
 * ? cur+1 : selected  → the right card is ALWAYS an upgrade on own tier
 * (criterion 6). Privileges are per-tier & cumulative (rowIndex < tier.perks);
 * newly-gained rows on the target card get a gold "MỚI/NEW" badge, and an
 * unlock-wager footer note shows when the target sits above the current tier.
 * ==========================================================================*/
"use client";

import { getVipCopy, PRIVILEGES, type Lang, type VipTierDef } from "@/lib/vip";
import styles from "./PrivilegeComparison.module.css";

export function PrivilegeComparison({
  tiers,
  selected,
  currentTierIndex,
  currentLevel,
  lang,
}: {
  tiers: VipTierDef[];
  selected: number;
  currentTierIndex: number;
  currentLevel: number;
  lang: Lang;
}) {
  const copy = getVipCopy(lang);
  void currentLevel; // per-tier privileges are level-independent

  const cmpT =
    selected === currentTierIndex && currentTierIndex < tiers.length - 1
      ? currentTierIndex + 1
      : selected;

  const left = tiers[currentTierIndex];
  const right = tiers[cmpT];
  const targetAboveCurrent = cmpT > currentTierIndex;

  const renderRows = (tier: VipTierDef, comparedTo?: VipTierDef) =>
    PRIVILEGES.map((key, idx) => {
      const unlocked = idx < tier.perks;
      const isNew = comparedTo ? idx >= comparedTo.perks && unlocked : false;
      return (
        <li
          key={key}
          className={`${styles.row} ${unlocked ? "" : styles.rowLocked} ${
            isNew ? styles.rowNew : ""
          }`}
        >
          <span
            className={`${styles.marker} ${
              unlocked ? styles.check : styles.lock
            }`}
            aria-hidden
          >
            {unlocked ? "✓" : "🔒"}
          </span>
          <span className={styles.rowLabel}>{copy[key]}</span>
          {isNew && <span className={styles.newTag}>{copy.newTag}</span>}
        </li>
      );
    });

  return (
    <div className={styles.wrap}>
      <article className={styles.card}>
        <header className={styles.head}>
          <span className={styles.gem} style={{ background: left.acc }} aria-hidden />
          <h3 className={styles.cardTitle} style={{ color: left.acc }}>
            {copy[left.nameKey]}
          </h3>
        </header>
        <ul className={styles.rows}>{renderRows(left)}</ul>
      </article>

      <div className={styles.arrow} aria-hidden>
        →
      </div>

      <article className={`${styles.card} ${styles.cardTarget}`}>
        <header className={styles.head}>
          <span className={styles.gem} style={{ background: right.acc }} aria-hidden />
          <h3 className={styles.cardTitle} style={{ color: right.acc }}>
            {copy[right.nameKey]}
          </h3>
        </header>
        <ul className={styles.rows}>{renderRows(right, left)}</ul>
        {targetAboveCurrent && (
          <footer className={styles.footer}>
            <span className={styles.lock} aria-hidden>
              🔒
            </span>
            {copy.needWager} {right.unlock}
          </footer>
        )}
      </article>
    </div>
  );
}
