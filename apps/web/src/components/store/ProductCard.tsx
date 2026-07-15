/* ============================================================================
 * ProductCard — one points-store reward at a glance (plan §2/§3/§4 · task D8).
 * A CLEAN, EQUAL-HEIGHT summary card; the full escalation machine lives in the
 * RedeemDialog. Every card in a row is the same height regardless of state and
 * pins its CTA to the floor. The card face is guest-safe: NO per-user data is
 * ever rendered here — only community/catalog facts and (for a logged-in member
 * with a live cooldown) the remaining "thời gian chờ" countdown.
 *
 * Face anatomy, top → bottom:
 *   • top-LEFT category tag ("Voucher tiền" / "Sản phẩm"); on a sold-out card the
 *     tag becomes the single "Tạm hết" sold-out signal
 *   • top-RIGHT gold-P coin badge = the ORIGINAL (base) points price — NEVER the
 *     escalated cost (that is disclosed only inside the RedeemDialog)
 *   • image (real product.imageSrc; on error → branded obsidian fallback tile)
 *   • title — the reward name
 *   • face value + "Rút sau N vòng cược" on ONE row (rolling is VOUCHERS ONLY)
 *   • a live cooldown chip ("Thời gian chờ …") overlaid on the image — shown for a
 *     logged-in member whose cooldown is running (INCLUDING at the redemption cap,
 *     where the CTA reads "Hết lượt đổi"); at zero it flips back to BASE
 *   • a terse per-state CTA, pinned to the bottom
 *
 * Compliance (plan §3 copy guardrails): nothing here implies reduced value —
 * the badge shows a bare base points cost and the face value is constant. The
 * escalated price and early-claim warning are disclosed at claim time in RedeemDialog.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { formatVnd, formatCount } from "@/lib/format";
import { Card, Button, Countdown, Icon } from "@/ui";
import { isCooldownRunning, resolveBranch } from "@/lib/store/escalation";
import styles from "./ProductGrid.module.css";

export interface ProductCardProps {
  product: Product;
  /** member's redeemable points — gates affordability (truthful; 0 for guests). */
  points: number;
  /** whether the viewer is an authenticated member (else CTA = login). */
  allowed: boolean;
  /** program budget breaker paused → card is disabled everywhere (PRD §7.1a). */
  paused?: boolean;
  /** open the redeem dialog (member) or the auth modal (guest). */
  onRedeem: (product: Product) => void;
}

/** Terse per-state CTA descriptor (verbose both-numbers button = dialog only). */
interface Cta {
  label: string;
  variant: "gold" | "ghost";
  disabled: boolean;
}

export function ProductCard({ product, points, allowed, onRedeem }: ProductCardProps) {
  // One client-clock reading per render. Advancing it when the on-screen cooldown
  // hits zero drops `running`, so the timer chip disappears (Countdown onZeroState).
  const [nowMs, setNowMs] = useState(() => Date.now());
  // Image error → swap to the branded obsidian fallback tile (never a dropzone).
  const [imgFailed, setImgFailed] = useState(false);

  // The cooldown chip only shows for an authenticated member mid-cooldown —
  // guests never had a cooldown, so their card shows no timer.
  const running = allowed && isCooldownRunning(product, nowMs);

  // TEMPORARY limit-lock: running AND the next claim is pinned at the escalation
  // cap (currentStep+1 > maxSteps). Guest-safe — resolveBranch reads per-user
  // fields, so we only compute it behind `allowed`; guests always resolve 'base'.
  const branch = allowed ? resolveBranch(product, nowMs) : "base";
  const atLimit = branch === "at_floor";

  // ── BADGE LOCK ──────────────────────────────────────────────────────────
  // The top-right gold-P badge ALWAYS advertises the ORIGINAL (base) points
  // price. The early-redeem surcharge is disclosed ONLY inside the RedeemDialog.
  // DO NOT wire the escalated cost (pointsAtStep) onto the card face — the card
  // is guest-safe and must never front-run the dialog's escalation disclosure.
  const pointCost = product.basePoints;

  // Owner catalog gate (card-face display only — never an in-dialog refusal).
  const soldOut = product.stockRemaining <= 0;

  // Affordability shortfall — member-only. Guests have points=0 (effectivePoints)
  // and are routed to auth BEFORE this branch, so a guest never sees "Thiếu".
  const insufficient = allowed && !soldOut && !atLimit && product.basePoints > points;
  const shortLabel = vi.store.ctaInsufficient.replace(
    "{short}",
    formatCount(Math.max(0, product.basePoints - points)),
  );

  const isVoucher = product.category === "voucher";
  const categoryTag = isVoucher ? vi.store.categoryVoucher : vi.store.categoryProduct;

  const cta = resolveCta({ allowed, soldOut, atLimit, insufficient, shortLabel });

  return (
    <Card variant="product" className={styles.card}>
      <div
        className={[styles.media, soldOut ? styles.mediaSoldOut : ""]
          .filter(Boolean)
          .join(" ")}
      >
        {imgFailed ? (
          <div className={styles.fallbackTile} aria-label={product.name}>
            <Icon name="gift" size={28} className={styles.fallbackGlyph} aria-hidden />
            <span className={styles.fallbackName}>{product.name}</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageSrc}
            alt={product.name}
            className={styles.img}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}

        {/* TOP-LEFT tag — category, OR the single "Tạm hết" sold-out signal. */}
        <span className={styles.categoryTag}>
          {soldOut ? vi.store.soldOutTag : categoryTag}
        </span>

        {/* TOP-RIGHT gold-P coin badge — the BASE points price (never escalated). */}
        <span className={styles.pointsBadge}>
          <span className={styles.pMark} aria-hidden="true">
            P
          </span>
          {formatCount(pointCost)}
        </span>

        {/* Live cooldown — overlaid on the image so the body stays identical
            across every card (equal heights, floored CTAs). Shown for a logged-in
            member whose cooldown is running, INCLUDING at the redemption cap
            (atLimit) — the countdown stays; only the CTA changes to "Hết lượt đổi".
            At zero the timer flips the card back to BASE. Guests never reach it;
            coexists with an insufficient CTA. */}
        {running && product.cooldownEndsAt && (
          <span className={styles.cooldownChip}>
            <Icon name="history" size={13} className={styles.cooldownGlyph} aria-hidden />
            <span className={styles.cooldownLabel}>{vi.store.fullRateAfter}</span>
            <Countdown
              endsAt={product.cooldownEndsAt}
              zeroLabel={vi.store.fullRateReady}
              onZeroState={() => setNowMs(Date.now())}
              className={styles.cooldownClock}
            />
          </span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{product.name}</h3>

        {/* Value + withdrawal condition on ONE row to save vertical space. The
            "Rút sau N vòng cược" is VOUCHERS ONLY (info; physical products omit it). */}
        <div className={styles.valueRow}>
          <span className={styles.value}>{formatVnd(product.faceValue)}</span>
          {isVoucher && (
            <span className={styles.rollingLine}>
              {vi.store.rollingLine.replace("{n}", formatCount(product.rollingRequired))}
            </span>
          )}
        </div>

        <Button
          className={styles.cta}
          variant={cta.variant}
          size="sm"
          fullWidth
          disabled={cta.disabled}
          onClick={() => onRedeem(product)}
        >
          {cta.label}
        </Button>
      </div>
    </Card>
  );
}

/** Card-face CTA. Precedence (first match wins): soldOut > atLimit > guest >
 *  insufficient > redeem. A permanently-gone item must not invite a "come back
 *  later"; a guest routes to auth BEFORE the affordability branch (guest-safe —
 *  a guest never sees "Thiếu N điểm"). `atLimit`/`insufficient` are pre-computed
 *  member-only, so this never touches per-user fields for a guest. */
function resolveCta(s: {
  allowed: boolean;
  soldOut: boolean;
  atLimit: boolean;
  insufficient: boolean;
  shortLabel: string;
}): Cta {
  if (s.soldOut) {
    return { label: vi.store.ctaSoldOut, variant: "ghost", disabled: true };
  }
  if (s.atLimit) {
    return { label: vi.store.ctaLimitReached, variant: "ghost", disabled: true };
  }
  if (!s.allowed) {
    return { label: vi.store.ctaLoginToRedeem, variant: "gold", disabled: false };
  }
  if (s.insufficient) {
    return { label: s.shortLabel, variant: "ghost", disabled: true };
  }
  return { label: vi.store.ctaRedeem, variant: "gold", disabled: false };
}
