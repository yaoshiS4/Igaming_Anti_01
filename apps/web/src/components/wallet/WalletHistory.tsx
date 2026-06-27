/* ============================================================================
 * WalletHistory — transaction history rows (SPEC-03 §records RecordsList /
 * §wallet) [RG]. A compact recent-activity list for /vi-tien.
 *
 * EQUAL win/loss salience: every signed figure uses DeltaAmount (sign + the
 * luminance-matched pair, loss never dimmer). To make the brief's "hue carries
 * ZERO info" concrete, each row ALSO shows a direction arrow (↑/↓) + a plain
 * Vietnamese type word — so a colour-blind user reads the in/out direction from
 * the sign, arrow and word, not from colour. A type/scope filter is provided;
 * empty + filtered-empty render the honest EmptyState primitive.
 *
 * Auth-aware: a guest sees a prompt instead of fabricated history.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import type { Transaction, TransactionType } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import { Card, DeltaAmount, EmptyState, Tabs, Button } from "@/ui";
import styles from "./WalletHistory.module.css";

export interface WalletHistoryProps {
  records: Transaction[];
  /** show all rows; default trims to a recent slice for the wallet surface. */
  limit?: number;
}

/** plain-VN type word per transaction type (read alongside sign + arrow). */
const TYPE_WORD: Record<TransactionType, string> = {
  deposit: "Nạp tiền",
  withdraw: "Rút tiền",
  win: "Thắng",
  loss: "Thua",
  transfer: "Chuyển quỹ",
  cashback: "Hoàn trả",
};

type Scope = "all" | "in" | "out";

const SCOPES: { id: Scope; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "in", label: "Tiền vào" },
  { id: "out", label: "Tiền ra" },
];

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function WalletHistory({ records, limit = 6 }: WalletHistoryProps) {
  const { allowed, promptAuth } = useRequireAuth();
  const [scope, setScope] = useState<Scope>("all");

  const filtered = records.filter((r) => {
    if (scope === "in") return r.amount.amount >= 0;
    if (scope === "out") return r.amount.amount < 0;
    return true;
  });
  const shown = filtered.slice(0, limit);

  return (
    <Card variant="default" className={styles.card}>
      <div className={styles.head}>
        <h2 className={styles.title}>{vi.wallet.history}</h2>
      </div>

      {!allowed ? (
        <div className={styles.guest}>
          <p className={styles.guestText}>{vi.auth.login} để xem lịch sử giao dịch.</p>
          <Button variant="primary" size="sm" onClick={() => promptAuth()}>
            {vi.auth.login}
          </Button>
        </div>
      ) : (
        <>
          <Tabs
            items={SCOPES.map((s) => ({ id: s.id, label: s.label }))}
            active={scope}
            onChange={(id) => setScope(id as Scope)}
            label="Lọc giao dịch"
          />

          {records.length === 0 ? (
            <EmptyState
              icon="history"
              title="Chưa có giao dịch"
              message="Các giao dịch nạp, rút và cược của bạn sẽ hiển thị tại đây."
            />
          ) : shown.length === 0 ? (
            <EmptyState
              variant="filtered"
              icon="history"
              message="Không có giao dịch khớp với bộ lọc."
              onReset={() => setScope("all")}
            />
          ) : (
            <ul className={styles.list}>
              {shown.map((tx) => {
                const isIn = tx.amount.amount >= 0;
                return (
                  <li key={tx.id} className={styles.row}>
                    <div className={styles.meta}>
                      <span className={styles.type}>
                        <span className={styles.arrow} aria-hidden="true">
                          {isIn ? "↑" : "↓"}
                        </span>
                        {TYPE_WORD[tx.type]}
                      </span>
                      <span className={styles.when}>{formatWhen(tx.at)}</span>
                    </div>
                    <DeltaAmount value={tx.amount} className={styles.amount} />
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </Card>
  );
}
