/* ============================================================================
 * RedeemDialog — the redeem-confirm dialog. A lazy-mounted Modal (only rendered
 * when a product is selected). Deliberately SIMPLE and visual:
 *
 *   CONFIRM   gold-P coin + name + "Trị giá {value}"
 *             → COST CARD: hero "Điểm cần dùng" (amber ESCALATED when early),
 *               divider, then "Số dư hiện tại" / "Sau khi đổi" / "Điều kiện rút"
 *             → normal: reassurance line | early: amber caution callout
 *             → [ Hủy | Xác nhận đổi ]
 *
 *   SUCCESS   GOLD check badge → title → "{name} đã được thêm…" → "Số dư còn lại"
 *
 * EARLY-CLAIM MATH (blocker fix): while the cooldown runs, the point cost
 * ESCALATES one step for the SAME voucher. The hero "Điểm cần dùng" shows the
 * ACTUAL escalated charge (amber), with the base as a "Mức thường" comparison;
 * "Sau khi đổi" and "Số dư còn lại" both subtract the ESCALATED cost — the dialog
 * NEVER quotes the base as the charge. The item/face is always paid IN FULL.
 * UI-only/mock: confirm simulates a server round-trip, then a success receipt.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { formatVnd, formatCount } from "@/lib/format";
import { Modal, Button, Icon, Countdown } from "@/ui";
import { isCooldownRunning, pointsAtStep } from "@/lib/store/escalation";
import styles from "./RedeemDialog.module.css";

export interface RedeemDialogProps {
  product: Product;
  /** member's redeemable points (gates affordability). */
  points: number;
  onClose: () => void;
  /** program budget breaker paused — no confirm button. */
  paused?: boolean;
}

type Phase = "idle" | "submitting" | "success";

const pts = (n: number) => `${formatCount(n)} ${vi.claim.costUnit}`;

/** Compact item header — gold-P coin + name + "Trị giá {value}". */
function ItemHeader({ product }: { product: Product }) {
  return (
    <div className={styles.item}>
      <span className={styles.coin} aria-hidden="true">
        P
      </span>
      <div className={styles.itemMeta}>
        <p className={styles.itemName}>{product.name}</p>
        <p className={styles.itemValue}>
          <span className={styles.valueLabel}>{vi.claim.valueLabel}</span>{" "}
          <span className={styles.valueAmount}>{formatVnd(product.faceValue)}</span>
        </p>
      </div>
    </div>
  );
}

/** Success subline with the product name bolded (rest muted). */
function SuccessSub({ name }: { name: string }) {
  const s = vi.claim.successSub;
  const i = s.indexOf("{name}");
  if (i < 0) return <>{s}</>;
  return (
    <>
      <b className={styles.successName}>{name}</b>
      {s.slice(i + "{name}".length)}
    </>
  );
}

export function RedeemDialog({
  product,
  points,
  onClose,
  paused = false,
}: RedeemDialogProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  // One client-clock reading; advancing it when the cooldown hits zero drops the
  // "early" surcharge back to the normal price (Countdown onZeroState contract).
  const [nowMs, setNowMs] = useState(() => Date.now());

  // Redeeming while the cooldown runs = an early redeem → the point cost escalates
  // one step (same voucher). Otherwise it is the normal (base) cost.
  const early = isCooldownRunning(product, nowMs);
  const step = early ? product.currentStep + 1 : 1;
  const pointCost = pointsAtStep(
    product.basePoints,
    product.repeatFraction,
    step,
    product.maxSteps,
  );
  const affordable = points >= pointCost;
  // "Sau khi đổi" / "Số dư còn lại" ALWAYS subtract the ACTUAL charged cost
  // (escalated when early) — never the base.
  const balanceAfter = points - pointCost;

  const isVoucher = product.category === "voucher";

  // Cost emphasis: red when unaffordable, amber when merely escalated (early).
  const costTone = !affordable ? "alert" : early ? "caution" : "normal";

  const confirm = () => {
    if (phase === "submitting" || !affordable) return;
    setPhase("submitting");
    window.setTimeout(() => setPhase("success"), 600); // UI-only/mock round-trip
  };

  // ---- SUCCESS — gold badge + remaining balance ---------------------------
  if (phase === "success") {
    return (
      <Modal open onClose={onClose} size="sm">
        <div className={styles.result}>
          <span className={styles.successBadge} aria-hidden="true">
            <Icon name="check" size={32} />
          </span>
          <div className={styles.successHead}>
            <h3 className={styles.successTitle}>{vi.claim.successTitle}</h3>
            <p className={styles.successSub}>
              <SuccessSub name={product.name} />
            </p>
          </div>

          <span className={styles.successBalance}>
            <span className={styles.successBalanceLabel}>
              {vi.claim.successBalanceLeft}
            </span>{" "}
            <span className={styles.successBalanceValue}>{pts(balanceAfter)}</span>
          </span>

          <Button variant="gold" fullWidth onClick={onClose}>
            {vi.claim.btnClose}
          </Button>
        </div>
      </Modal>
    );
  }

  // ---- PAUSED (breaker) — no confirm button ---------------------------------
  if (paused) {
    return (
      <Modal open onClose={onClose} title={vi.claim.dialogTitle} size="sm">
        <div className={styles.confirm}>
          <ItemHeader product={product} />
          <p className={styles.banner} data-tone="info" role="status">
            Đổi quà đang tạm dừng, sẽ mở lại {vi.store.pausedReopen}.
          </p>
          <div className={styles.actions}>
            <Button variant="ghost" fullWidth onClick={onClose}>
              {vi.claim.btnCancel}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // ---- CONFIRM (normal or early) --------------------------------------------
  return (
    <Modal open onClose={onClose} title={vi.claim.dialogTitle} size="sm">
      <div className={styles.confirm}>
        <ItemHeader product={product} />

        {/* COST CARD — hero "Điểm cần dùng" (ACTUAL charge: escalated amber when
            early, red when unaffordable), then a divider and the breakdown rows. */}
        <div className={styles.cost} data-tone={costTone}>
          <div className={styles.costMain}>
            <span className={styles.costLabel}>{vi.claim.costLabel}</span>
            <span className={styles.costValue}>
              {formatCount(pointCost)}
              <span className={styles.costUnit}>{vi.claim.costUnit}</span>
            </span>
          </div>

          <div className={styles.costDivider} />

          <div className={styles.costRow}>
            <span className={styles.costRowLabel}>{vi.claim.rowBalanceNow}</span>
            <span className={styles.costRowValue}>{pts(points)}</span>
          </div>
          <div className={styles.costRow}>
            <span className={styles.costRowLabel}>{vi.claim.rowBalanceAfter}</span>
            <span className={styles.costRowAfter}>{pts(balanceAfter)}</span>
          </div>
          {/* Rolling row — VOUCHERS only (physical products omit it). */}
          {isVoucher && (
            <div className={styles.costRow}>
              <span className={styles.costRowLabel}>{vi.claim.rowRolling}</span>
              <span className={styles.costRowValue}>
                {vi.claim.rollingValue.replace(
                  "{n}",
                  formatCount(product.rollingRequired),
                )}
              </span>
            </div>
          )}
        </div>

        {/* EARLY: amber caution callout — costs more + the cooldown resets. */}
        {early && product.cooldownEndsAt && (
          <div className={styles.callout}>
            <Icon name="history" size={18} className={styles.calloutGlyph} aria-hidden />
            <p className={styles.calloutLine}>
              <EarlyCallout
                cooldownEndsAt={product.cooldownEndsAt}
                onZero={() => setNowMs(Date.now())}
              />
            </p>
          </div>
        )}

        {/* Unaffordable — one quiet neutral hint under the (red) hero cost. */}
        {!affordable && (
          <p className={styles.insufficientHint}>{vi.claim.insufficientHint}</p>
        )}

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose}>
            {vi.claim.btnCancel}
          </Button>
          <Button
            variant="gold"
            loading={phase === "submitting"}
            disabled={!affordable}
            onClick={confirm}
          >
            {early ? vi.claim.btnEarlyConfirm : vi.claim.btnConfirm}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/** Early-callout copy with a live {time} countdown + both point figures spliced
 *  in. The countdown is a live component, so the string is split around {time}. */
function EarlyCallout({
  cooldownEndsAt,
  onZero,
}: {
  cooldownEndsAt: string;
  onZero: () => void;
}) {
  const [before, after] = vi.claim.earlyCallout.split("{time}");
  return (
    <>
      {before}
      <Countdown
        endsAt={cooldownEndsAt}
        zeroLabel={vi.store.fullRateReady}
        onZeroState={onZero}
        className={styles.calloutClock}
      />
      {after}
    </>
  );
}
