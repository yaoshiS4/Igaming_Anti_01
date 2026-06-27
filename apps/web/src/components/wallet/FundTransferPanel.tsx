/* ============================================================================
 * FundTransferPanel — the "Chuyển quỹ" tab (SPEC-03 §wallet, defect-8 split).
 * The non-crypto reading of J9's `balace_list_infos`: move VND between the main
 * wallet and each product quỹ. ONE focused feature per the tabbed-wallet split:
 *
 *  • a Từ (source) / Đến (target) pair — source defaults to the main wallet, the
 *    target to the first product; swap (↕) flips them.
 *  • amount field (inputMode=numeric) clamped to the SOURCE balance; over-balance
 *    is blocked with an honest alert.
 *  • the per-product balance table (the old ProductTransferRows reading) stays
 *    on-panel as a truthful reference list — equal-salience VND figures.
 *
 * Decree-174: a transfer is never client-confirmed "thành công" — it stops at the
 * honest PENDING ("đang chờ xử lý") state. Balances shown are server fixtures and
 * are never fabricated. Auth-aware: a guest sees a prompt, not a usable form.
 * ==========================================================================*/

"use client";

import { useMemo, useState } from "react";
import type { MoneyValue as MoneyVal, ProductWallet } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import { formatVnd } from "@/lib/format";
import { Card, Button, Icon, MoneyValue, EmptyState } from "@/ui";
import styles from "./FundTransferPanel.module.css";

export interface FundTransferPanelProps {
  /** main-wallet available balance (server figure). Null = unknown. */
  available: MoneyVal | null;
  /** per-product VND quỹ balances (server fixtures). */
  products: ProductWallet[];
}

type Phase = "idle" | "pending";

const MAIN_ID = "__main__";

export function FundTransferPanel({ available, products }: FundTransferPanelProps) {
  const { allowed, promptAuth } = useRequireAuth();

  // funds (main wallet + each product) as a flat lookup for the from/to selects.
  const funds = useMemo(
    () => [
      { id: MAIN_ID, name: vi.wallet.balance, amount: available?.amount ?? 0 },
      ...products.map((p) => ({
        id: p.productId,
        name: p.productName,
        amount: p.balance.amount,
      })),
    ],
    [available, products],
  );

  const [fromId, setFromId] = useState(MAIN_ID);
  const [toId, setToId] = useState(products[0]?.productId ?? MAIN_ID);
  const [amount, setAmount] = useState<number | null>(null);
  const [amountText, setAmountText] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  const from = funds.find((f) => f.id === fromId) ?? funds[0];
  const max = from?.amount ?? 0;
  const sameFund = fromId === toId;
  const overBalance = amount != null && amount > max;
  const canSubmit = amount != null && amount > 0 && !overBalance && !sameFund;

  const onAmountChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    setAmountText(digits ? formatVnd(Number(digits)) : "");
    setAmount(digits ? Number(digits) : null);
  };

  const swap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  const submit = () => {
    if (!allowed) {
      promptAuth();
      return;
    }
    if (!canSubmit) return;
    setPhase("pending");
  };

  if (!allowed) {
    return (
      <Card variant="default" className={styles.card}>
        <h2 className={styles.title}>{vi.wallet.transfer}</h2>
        <div className={styles.guest}>
          <p className={styles.guestText}>{vi.auth.login} để chuyển quỹ.</p>
          <Button variant="gold" size="md" onClick={() => promptAuth()}>
            {vi.auth.login}
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === "pending") {
    return (
      <Card variant="default" className={styles.card}>
        <h2 className={styles.title}>{vi.wallet.transfer}</h2>
        <div className={styles.pending} role="status">
          <span className={styles.pendingIcon} aria-hidden="true">
            <Icon name="history" size={28} />
          </span>
          <p className={styles.pendingTitle}>Đang chờ xử lý</p>
          <p className={styles.pendingBody}>
            Yêu cầu chuyển quỹ đã được ghi nhận và đang chờ hệ thống xử lý. Số dư
            từng quỹ sẽ được cập nhật sau khi hoàn tất.
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
      <h2 className={styles.title}>{vi.wallet.transfer}</h2>

      {products.length === 0 ? (
        <EmptyState
          icon="wallet"
          title="Chưa có quỹ sản phẩm"
          message="Khi bạn chơi ở các sản phẩm, số dư từng quỹ sẽ hiển thị tại đây để chuyển."
        />
      ) : (
        <>
          {/* from / swap / to */}
          <div className={styles.route}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="transfer-from">
                Từ quỹ
              </label>
              <select
                id="transfer-from"
                className={styles.select}
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
              >
                {funds.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — {formatVnd(f.amount)} ₫
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className={styles.swap}
              onClick={swap}
              aria-label="Đổi chiều chuyển"
            >
              <Icon name="retry" size={18} />
            </button>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="transfer-to">
                Đến quỹ
              </label>
              <select
                id="transfer-to"
                className={styles.select}
                value={toId}
                onChange={(e) => setToId(e.target.value)}
              >
                {funds.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* amount */}
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="transfer-amount">
              Số tiền chuyển
            </label>
            <input
              id="transfer-amount"
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
                Số tiền vượt quá số dư khả dụng của quỹ nguồn.
              </p>
            )}
            {sameFund && (
              <p className={styles.errorMsg} role="alert">
                Quỹ nguồn và quỹ đích phải khác nhau.
              </p>
            )}
          </div>

          <Button variant="gold" size="lg" fullWidth disabled={!canSubmit} onClick={submit}>
            Chuyển quỹ
          </Button>

          {/* truthful per-product balance reference */}
          <div className={styles.balances}>
            <p className={styles.balancesHead}>Số dư theo quỹ</p>
            <ul className={styles.list}>
              {funds.map((f) => (
                <li key={f.id} className={styles.row}>
                  <span className={styles.name}>{f.name}</span>
                  <MoneyValue
                    value={{ amount: f.amount, currency: "VND" }}
                    className={styles.balance}
                  />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </Card>
  );
}
