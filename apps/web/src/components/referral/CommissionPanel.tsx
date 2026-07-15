/* ============================================================================
 * CommissionPanel — referral earnings list (SPEC-03 §referral CommissionPanel;
 * Wave 7.2) [RG]. Per-referral rows (masked name · turnover · commission ·
 * when), all truthful fixture figures on the money role (equal salience). When
 * there are no commissions the panel shows the honest EmptyState primitive —
 * NEVER fabricated activity. Auth-aware: a guest sees a prompt.
 *
 * Shared by /dai-ly AND /gioi-thieu. Two optional props let /gioi-thieu match
 * the J9 refer page WITHOUT changing the /dai-ly composition:
 *   • showHeldRow — render the J9 held-commission head row (a left "Hoa hồng
 *     hiện có" label + the held total in GOLD + a low-salience "Chi tiết hoạt
 *     động" details link). The gold held figure is derived from the REAL rows
 *     (sum of commissions) and is OMITTED when there are none (no fabricated 0).
 *   • hideEmpty — suppress the EmptyState branch (the page falls through to the
 *     StepExplainer onboarding empty state instead). /dai-ly keeps the default
 *     (EmptyState shown), so this prop is purely additive.
 * ==========================================================================*/

"use client";

import type { Commission, MoneyValue as Money } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import { Card, MoneyValue, EmptyState, Button, Icon } from "@/ui";
import styles from "./CommissionPanel.module.css";

const t = vi.referral;

export interface CommissionPanelProps {
  commissions: Commission[];
  /** render the J9 held-commission head row (label + gold total + details link).
   *  Default OFF → /dai-ly is unaffected. */
  showHeldRow?: boolean;
  /** suppress the EmptyState branch so the page can fall through to a steps
   *  onboarding state. Default OFF → /dai-ly keeps its EmptyState. */
  hideEmpty?: boolean;
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Held total = sum of the REAL commission rows (truthful; never fabricated). */
function sumHeld(commissions: Commission[]): Money | null {
  if (commissions.length === 0) return null;
  return {
    amount: commissions.reduce((acc, c) => acc + c.commission.amount, 0),
    currency: commissions[0].commission.currency,
  };
}

export function CommissionPanel({
  commissions,
  showHeldRow = false,
  hideEmpty = false,
}: CommissionPanelProps) {
  const { allowed, promptAuth } = useRequireAuth();

  // gold held figure: real data only (sum of live rows), omitted when none.
  const held = allowed ? sumHeld(commissions) : null;

  return (
    <Card variant="default" className={styles.card}>
      <h2 className={styles.title}>{t.commissionPanelTitle}</h2>

      {/* J9 held-commission head row — opt-in (/gioi-thieu). The gold held total
          renders ONLY when there is real data; the details link has no route so
          it stays low-salience and non-navigating (never an invented dest). */}
      {showHeldRow && (
        <div className={styles.heldRow}>
          <span className={styles.heldGroup}>
            <span className={styles.heldLabel}>{t.commissionHeldLabel}</span>
            {held && (
              <MoneyValue value={held} className={styles.heldValue} />
            )}
          </span>
          <span className={styles.detailsLink} aria-disabled="true">
            {t.commissionDetailsLink}
            <Icon name="chevronRight" size={14} />
          </span>
        </div>
      )}

      {!allowed ? (
        <div className={styles.guest}>
          <p className={styles.guestText}>{t.commissionGuestPrompt}</p>
          <Button variant="primary" size="sm" onClick={() => promptAuth()}>
            {vi.auth.login}
          </Button>
        </div>
      ) : commissions.length === 0 ? (
        hideEmpty ? null : (
          <EmptyState
            icon="referral"
            title={t.commissionEmptyTitle}
            message={t.commissionEmptyMessage}
          />
        )
      ) : (
        <ul className={styles.list}>
          {commissions.map((c) => (
            <li key={c.id} className={styles.row}>
              <div className={styles.who}>
                <span className={styles.name}>{c.referredName}</span>
                <span className={styles.when}>{formatWhen(c.at)}</span>
              </div>
              <div className={styles.figures}>
                <span className={styles.turnover}>
                  {t.commissionRowTurnover} <MoneyValue value={c.turnover} />
                </span>
                <span className={styles.commission}>
                  {t.commissionRowCommission}{" "}
                  <MoneyValue value={c.commission} className={styles.commissionVal} />
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
