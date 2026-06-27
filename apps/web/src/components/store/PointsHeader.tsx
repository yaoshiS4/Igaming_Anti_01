/* ============================================================================
 * PointsHeader — points-balance header (SPEC-03 §store PointsHeader; Wave 7.1).
 * Renders the member's redeemable points as a count-kind MoneyValue (tabular,
 * no ₫ — points, not currency-symbol money). Auth-aware: a guest sees an honest
 * prompt instead of a fabricated balance. Server-rendered shell with a small
 * client island for the guest/member split.
 * ==========================================================================*/

"use client";

import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import { Card, Icon, Button } from "@/ui";
import styles from "./PointsHeader.module.css";

export interface PointsHeaderProps {
  /** redeemable points balance (truthful fixture; count kind, never massaged) */
  points: number;
}

export function PointsHeader({ points }: PointsHeaderProps) {
  const { allowed, promptAuth } = useRequireAuth();

  return (
    <Card variant="default" className={styles.header}>
      <span className={styles.iconWrap} aria-hidden="true">
        <Icon name="gift" size={24} />
      </span>
      <div className={styles.col}>
        <span className={styles.label}>Điểm tích lũy của bạn</span>
        {allowed ? (
          <span className={styles.value} data-truthful="true">
            {/* points are a count, not VND — render with VN grouping, no ₫ */}
            {points.toLocaleString("vi-VN")} <span className={styles.unit}>điểm</span>
          </span>
        ) : (
          <span className={styles.guest}>
            Đăng nhập để xem điểm và đổi quà
          </span>
        )}
      </div>
      {!allowed && (
        <Button variant="primary" size="sm" onClick={() => promptAuth()}>
          {vi.auth.login}
        </Button>
      )}
    </Card>
  );
}
