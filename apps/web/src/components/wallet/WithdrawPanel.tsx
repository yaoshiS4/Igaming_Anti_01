/* ============================================================================
 * WithdrawPanel — VND withdrawal request (SPEC-03 §wallet / Wave 6.3). The Rút
 * surface the UT-1 chip routes to. Amount field (inputMode=numeric) bound to the
 * available balance, a server-reflected payout destination (read-only — the user
 * does not set it here), and a request submit that stops at an honest PENDING /
 * awaiting-confirmation state.
 *
 * Decree-174: a withdrawal is never client-confirmed "thành công"; it stops at
 * "đang chờ xử lý". The available balance is the server figure passed in — it is
 * never fabricated, and an over-balance request is blocked. Auth-aware.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import type { MoneyValue as MoneyVal } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import { formatVnd } from "@/lib/format";
import { Card, Button, Icon, MoneyValue } from "@/ui";
import styles from "./WithdrawPanel.module.css";

export interface WithdrawPanelProps {
  /** available balance (server figure) — the request ceiling. Null = unknown. */
  available: MoneyVal | null;
  /** server-reflected payout destination (read-only here). */
  destination: { bank: string; account: string } | null;
}

type Phase = "idle" | "pending";

export function WithdrawPanel({ available, destination }: WithdrawPanelProps) {
  const { allowed, promptAuth } = useRequireAuth();
  const [amount, setAmount] = useState<number | null>(null);
  const [amountText, setAmountText] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  const max = available?.amount ?? 0;
  const overBalance = amount != null && amount > max;
  const canSubmit = amount != null && amount > 0 && !overBalance;

  const onAmountChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    setAmountText(digits ? formatVnd(Number(digits)) : "");
    setAmount(digits ? Number(digits) : null);
  };

  const submit = () => {
    if (!allowed) {
      promptAuth({ action: "withdraw" });
      return;
    }
    if (!canSubmit) return;
    setPhase("pending");
  };

  if (!allowed) {
    return (
      <Card variant="default" className={styles.card}>
        <h2 className={styles.title}>{vi.wallet.withdraw}</h2>
        <div className={styles.guest}>
          <p className={styles.guestText}>{vi.auth.login} để rút tiền.</p>
          <Button variant="primary" size="md" onClick={() => promptAuth({ action: "withdraw" })}>
            {vi.auth.login}
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === "pending") {
    return (
      <Card variant="default" className={styles.card}>
        <h2 className={styles.title}>{vi.wallet.withdraw}</h2>
        <div className={styles.pending} role="status">
          <span className={styles.pendingIcon} aria-hidden="true">
            <Icon name="history" size={28} />
          </span>
          <p className={styles.pendingTitle}>Đang chờ xử lý</p>
          <p className={styles.pendingBody}>
            Yêu cầu rút tiền đã được ghi nhận và đang chờ hệ thống xử lý. Bạn sẽ
            nhận được thông báo khi hoàn tất.
          </p>
          <Button variant="ghost" size="md" onClick={() => setPhase("idle")}>
            Quay lại
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" className={styles.card}>
      <h2 className={styles.title}>{vi.wallet.withdraw}</h2>

      <p className={styles.available}>
        Số dư khả dụng:{" "}
        {available ? (
          <MoneyValue value={available} className={styles.availableVal} />
        ) : (
          <span className={styles.availableVal}>—</span>
        )}
      </p>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="withdraw-amount">
          Số tiền rút
        </label>
        <input
          id="withdraw-amount"
          className={styles.amountInput}
          inputMode="numeric"
          autoComplete="off"
          placeholder="0 ₫"
          value={amountText}
          onChange={(e) => onAmountChange(e.target.value)}
          aria-invalid={overBalance || undefined}
        />
        {overBalance && (
          <p className={styles.errorMsg} role="alert">
            Số tiền vượt quá số dư khả dụng.
          </p>
        )}
      </div>

      <div className={styles.dest}>
        <span className={styles.destLabel}>Tài khoản nhận</span>
        {destination ? (
          <span className={styles.destValue}>
            {destination.bank} · {destination.account}
          </span>
        ) : (
          <span className={styles.destEmpty}>
            Chưa có tài khoản nhận — thêm trong mục Bảo mật trước khi rút.
          </span>
        )}
      </div>

      <Button variant="primary" size="lg" fullWidth disabled={!canSubmit || !destination} onClick={submit}>
        Yêu cầu rút tiền
      </Button>
    </Card>
  );
}
