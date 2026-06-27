/* ============================================================================
 * PrivilegeTable — the wide privilege-overview matrix (SPEC-03 §vip
 * PrivilegeTable). Built column-per-tier so the Scroller `freezeFirstColumn`
 * mode can pin the row-label column while the tier columns scroll horizontally
 * @375 (SPEC-04 6.1 Done-When). The member's current tier column is highlighted.
 * All figures are truthful fixture values (%-of-play rate + perk list) — no
 * imported J9 rates, no fabricated number.
 * ==========================================================================*/

"use client";

import type { VipTier } from "@/lib/types";
import { useAuth } from "@/lib/auth/session";
import { Icon, Scroller } from "@/ui";
import { vipCopy } from "./copy";
import styles from "./PrivilegeTable.module.css";

export interface PrivilegeTableProps {
  tiers: VipTier[];
}

export function PrivilegeTable({ tiers }: PrivilegeTableProps) {
  const { isAuthenticated, user } = useAuth();
  const currentLevel = isAuthenticated && user ? user.vipLevel : null;

  // union of all perk labels across tiers → the perk rows
  const perkRows = Array.from(new Set(tiers.flatMap((t) => t.perks)));

  return (
    <Scroller
      freezeFirstColumn
      snap={false}
      peek={false}
      label={vipCopy.privilegeHeading}
      className={styles.scroller}
    >
      {/* COLUMN 0 — sticky row labels (pinned by Scroller freezeFirstColumn) */}
      <div className={[styles.col, styles.labelCol].join(" ")}>
          <div className={[styles.cell, styles.headCell].join(" ")}>
            {vipCopy.colTier}
          </div>
          <div className={[styles.cell, styles.rowLabel].join(" ")}>
            {vipCopy.colCashback}
          </div>
          {perkRows.map((p) => (
            <div key={p} className={[styles.cell, styles.rowLabel].join(" ")}>
              {p}
            </div>
          ))}
        </div>

        {/* one column per tier */}
        {tiers.map((t) => {
          const isCurrent = currentLevel != null && t.level === currentLevel;
          return (
            <div
              key={t.id}
              className={[styles.col, isCurrent ? styles.currentCol : ""]
                .filter(Boolean)
                .join(" ")}
            >
              <div className={[styles.cell, styles.headCell, styles.tierHead].join(" ")}>
                <span className={styles.tierName}>{t.name}</span>
                <span className={styles.tierLevel}>{vipCopy.levelLabel(t.level)}</span>
              </div>
              <div className={[styles.cell, styles.rateCell].join(" ")}>
                {vipCopy.cashbackRate(t.cashbackRate)}
              </div>
              {perkRows.map((p) => (
                <div key={p} className={styles.cell}>
                  {t.perks.includes(p) ? (
                    <Icon name="check" size={18} className={styles.yes} label="Có" />
                  ) : (
                    <span className={styles.no} aria-label="Không">
                      —
                    </span>
                  )}
                </div>
              ))}
            </div>
          );
        })}
    </Scroller>
  );
}
