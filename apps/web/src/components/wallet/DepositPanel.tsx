/* ============================================================================
 * DepositPanel — VN-rail deposit (SPEC-03 §deposit DepositPanel / Wave 6.4) [RG].
 * Vietnamese rails FIRST: Ngân hàng · Momo · ViettelPay · Thẻ cào.
 *
 *  • rail selector (Tabs) → amount field (inputMode=numeric) + lucky 6/8 preset
 *    chips that AVOID digit-4 (LUCKY_DEPOSIT_PRESETS, marketing numerals only —
 *    the user's typed amount is never massaged).
 *  • rail-specific surface:
 *      bank        = dest account + COPYABLE transfer memo (tap-to-copy) +
 *                    "Tôi đã chuyển" → PENDING (returnable, server-confirmed).
 *      momo/viettel= QR/deep-link placeholder slot → pending.
 *      thẻ cào     = provider/denomination + serial + PIN (inputMode=numeric).
 *
 * Decree-174: `success` is only ever server-confirmed — this UI stops at the
 * honest PENDING ("đang chờ xác nhận") state; no client-side "thành công".
 * Auth-aware: a guest sees a prompt instead of a usable form.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import type { DepositOffer, DepositRail } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import {
  LUCKY_DEPOSIT_PRESETS,
  formatPresetChip,
  formatVnd,
} from "@/lib/format";
import { Card, Button, Tabs, Pill, Icon, MoneyValue } from "@/ui";
import styles from "./DepositPanel.module.css";

export interface DepositPanelProps {
  /** copyable bank-transfer destination (server-sourced). */
  bankMemo: { account: string; bank: string; memo: string };
  /** first-deposit T&C offer — server-sourced, no hardcoded %; null = none. */
  offer: DepositOffer | null;
  /** zero-balance member → present the first-deposit variant copy. */
  isFirstDeposit?: boolean;
}

const RAILS: { id: DepositRail; label: string }[] = [
  { id: "bank", label: vi.deposit.railBank },
  { id: "momo", label: vi.deposit.railMomo },
  { id: "viettelpay", label: vi.deposit.railViettel },
  { id: "card", label: vi.deposit.railCard },
];

type Phase = "idle" | "pending";

export function DepositPanel({ bankMemo, offer, isFirstDeposit }: DepositPanelProps) {
  const { allowed, promptAuth } = useRequireAuth();
  const [rail, setRail] = useState<DepositRail>("bank");
  const [amount, setAmount] = useState<number | null>(null);
  const [amountText, setAmountText] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [copied, setCopied] = useState(false);
  // thẻ cào fields
  const [serial, setSerial] = useState("");
  const [pin, setPin] = useState("");

  const onAmountChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    setAmountText(digits ? formatVnd(Number(digits)) : "");
    setAmount(digits ? Number(digits) : null);
  };

  const pickPreset = (preset: number) => {
    setAmount(preset);
    setAmountText(formatVnd(preset));
  };

  const copyMemo = async () => {
    try {
      await navigator.clipboard.writeText(bankMemo.memo);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false); // clipboard blocked — stay honest, no fake confirm
    }
  };

  // "Tôi đã chuyển" / submit → returnable PENDING (NOT a client success).
  const submit = () => {
    if (!allowed) {
      promptAuth({ action: "deposit", isFirstDeposit });
      return;
    }
    setPhase("pending");
  };

  if (!allowed) {
    return (
      <Card variant="default" className={styles.card}>
        <h2 className={styles.title}>{vi.deposit.title}</h2>
        <div className={styles.guest}>
          <p className={styles.guestText}>{vi.auth.login} để nạp tiền.</p>
          <Button variant="gold" size="md" onClick={() => promptAuth({ action: "deposit", isFirstDeposit })}>
            {vi.auth.login}
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === "pending") {
    return (
      <Card variant="default" className={styles.card}>
        <h2 className={styles.title}>{vi.deposit.title}</h2>
        <div className={styles.pending} role="status">
          <span className={styles.pendingIcon} aria-hidden="true">
            <Icon name="history" size={28} />
          </span>
          <p className={styles.pendingTitle}>{vi.deposit.pending}</p>
          <p className={styles.pendingBody}>
            Yêu cầu nạp đang chờ hệ thống xác nhận. Số dư sẽ được cập nhật sau khi
            xác nhận — bạn có thể quay lại màn hình nạp bất cứ lúc nào.
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
      <h2 className={styles.title}>{vi.deposit.title}</h2>

      {/* first-deposit offer — server-sourced T&C, no hardcoded % */}
      {isFirstDeposit && offer && (
        <div className={styles.offer}>
          <p className={styles.offerTitle}>{offer.title}</p>
          <p className={styles.offerBody}>{offer.body}</p>
          <p className={styles.offerMin}>
            Tối thiểu để đủ điều kiện:{" "}
            <MoneyValue value={offer.minToQualify} className={styles.offerMinVal} />
          </p>
        </div>
      )}

      {/* VN rails FIRST */}
      <Tabs
        items={RAILS.map((r) => ({ id: r.id, label: r.label }))}
        active={rail}
        onChange={(id) => setRail(id as DepositRail)}
        label="Chọn hình thức nạp"
      />

      {/* amount field + lucky 6/8 presets (marketing chips; avoid 4) */}
      <div className={styles.amountBlock}>
        <label className={styles.fieldLabel} htmlFor="deposit-amount">
          {vi.deposit.amount}
        </label>
        <input
          id="deposit-amount"
          className={styles.amountInput}
          inputMode="numeric"
          autoComplete="off"
          placeholder="0 ₫"
          value={amountText}
          onChange={(e) => onAmountChange(e.target.value)}
        />
        <div className={styles.presets} role="group" aria-label="Số tiền gợi ý">
          {LUCKY_DEPOSIT_PRESETS.map((p) => (
            <Pill key={p} active={amount === p} onClick={() => pickPreset(p)}>
              {formatPresetChip(p)}
            </Pill>
          ))}
        </div>
      </div>

      {/* rail-specific surface */}
      {rail === "bank" && (
        <div className={styles.railSurface}>
          <div className={styles.bankRow}>
            <span className={styles.bankLabel}>Ngân hàng</span>
            <span className={styles.bankValue}>{bankMemo.bank}</span>
          </div>
          <div className={styles.bankRow}>
            <span className={styles.bankLabel}>Số tài khoản</span>
            <span className={styles.bankValue}>{bankMemo.account}</span>
          </div>
          <div className={styles.bankRow}>
            <span className={styles.bankLabel}>Nội dung chuyển khoản</span>
            <span className={styles.memoRow}>
              <span className={styles.memo}>{bankMemo.memo}</span>
              <Button variant="ghost" size="sm" icon="copy" onClick={copyMemo}>
                {copied ? "Đã sao chép" : vi.deposit.copyMemo}
              </Button>
            </span>
          </div>
          <p className={styles.hint}>
            Chuyển khoản đúng nội dung trên để hệ thống tự động đối soát.
          </p>
          <Button variant="gold" size="lg" fullWidth onClick={submit}>
            {vi.deposit.iHaveTransferred}
          </Button>
        </div>
      )}

      {(rail === "momo" || rail === "viettelpay") && (
        <div className={styles.railSurface}>
          {/* QR/deep-link PLACEHOLDER SLOT — token-derived, awaiting real asset */}
          <div className={styles.qrSlot} aria-hidden="true">
            <Icon name="grid" size={40} />
          </div>
          <p className={styles.hint}>
            Quét mã QR hoặc mở ứng dụng {rail === "momo" ? "Momo" : "ViettelPay"} để
            hoàn tất. Mã sẽ hiển thị tại đây khi sẵn sàng.
          </p>
          <Button variant="gold" size="lg" fullWidth onClick={submit}>
            {vi.deposit.iHaveTransferred}
          </Button>
        </div>
      )}

      {rail === "card" && (
        <div className={styles.railSurface}>
          <label className={styles.fieldLabel} htmlFor="card-serial">
            Số seri
          </label>
          <input
            id="card-serial"
            className={styles.amountInput}
            inputMode="numeric"
            autoComplete="off"
            placeholder="Nhập số seri"
            value={serial}
            onChange={(e) => setSerial(e.target.value.replace(/\D/g, ""))}
          />
          <label className={styles.fieldLabel} htmlFor="card-pin">
            Mã thẻ
          </label>
          <input
            id="card-pin"
            className={styles.amountInput}
            inputMode="numeric"
            autoComplete="off"
            placeholder="Nhập mã thẻ"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          />
          <Button
            variant="gold"
            size="lg"
            fullWidth
            disabled={!serial || !pin}
            onClick={submit}
          >
            Nạp thẻ cào
          </Button>
        </div>
      )}
    </Card>
  );
}
