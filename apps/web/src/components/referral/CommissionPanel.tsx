/* ============================================================================
 * CommissionPanel — referral earnings list (SPEC-03 §referral CommissionPanel;
 * Wave 7.2) [RG]. Per-referral rows (masked name · turnover · commission ·
 * when), all truthful fixture figures on the money role (equal salience). When
 * there are no commissions the panel shows the honest EmptyState primitive —
 * NEVER fabricated activity. Auth-aware: a guest sees a prompt.
 * ==========================================================================*/

"use client";

import type { Commission } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import { Card, MoneyValue, EmptyState, Button } from "@/ui";
import styles from "./CommissionPanel.module.css";

export interface CommissionPanelProps {
  commissions: Commission[];
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function CommissionPanel({ commissions }: CommissionPanelProps) {
  const { allowed, promptAuth } = useRequireAuth();

  return (
    <Card variant="default" className={styles.card}>
      <h2 className={styles.title}>Hoa hồng giới thiệu</h2>

      {!allowed ? (
        <div className={styles.guest}>
          <p className={styles.guestText}>
            Đăng nhập để xem hoa hồng giới thiệu của bạn.
          </p>
          <Button variant="primary" size="sm" onClick={() => promptAuth()}>
            {vi.auth.login}
          </Button>
        </div>
      ) : commissions.length === 0 ? (
        <EmptyState
          icon="referral"
          title="Chưa có hoa hồng"
          message="Khi bạn bè được giới thiệu phát sinh doanh thu, hoa hồng sẽ hiển thị tại đây."
        />
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
                  Doanh thu <MoneyValue value={c.turnover} />
                </span>
                <span className={styles.commission}>
                  Hoa hồng{" "}
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
