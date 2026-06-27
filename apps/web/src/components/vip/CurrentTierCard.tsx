/* ============================================================================
 * CurrentTierCard — the member's current-tier panel + turnover-to-next-tier
 * (SPEC-03 §vip VipTierDeck/ProgressMeter, §F Dynamic-data contract).
 * ----------------------------------------------------------------------------
 * The truthful centerpiece of the VIP page. It is auth-aware and §F-bound:
 *   • guest        → an honest join prompt (NO fabricated tier/progress number);
 *                    CTA opens the auth modal in register mode.
 *   • member +
 *     progress.absent  → tier identity only; the progress bar is OMITTED
 *                        (never a fabricated 0% / made-up target).
 *   • progress.loading → Skeleton in the bar's reserved footprint (F2).
 *   • progress.error   → ErrorState + retry (F3) — never a stale/fake number.
 *   • progress.live    → a TRUTHFUL fill = real current/target; the remaining
 *                        turnover renders via the Money primitive (balance kind,
 *                        a real ledger figure — never digit-4-massaged). Fill is
 *                        a static CSS width; reduced-motion zeroes the transition
 *                        (no fake 5s climb — A7/F5).
 * The progress NUMBER is gated behind the Live envelope: there is no code path
 * that prints a turnover figure the server did not hand us.
 * ==========================================================================*/

"use client";

import type { Envelope, VipProgress, VipTier } from "@/lib/types";
import { useAuth } from "@/lib/auth/session";
import { useAuthModal } from "@/lib/auth/modal";
import { Card, Button, Badge, Skeleton, ErrorState, Icon, MoneyValue } from "@/ui";
import { vipCopy } from "./copy";
import styles from "./CurrentTierCard.module.css";

export interface CurrentTierCardProps {
  tiers: VipTier[];
  progress: Envelope<VipProgress>;
}

/** Truthful turnover-to-next-tier bar — §F-bound, never a fabricated number. */
function ProgressBar({ progress }: { progress: Envelope<VipProgress> }) {
  // No real source → OMIT the bar entirely (never a fake 0%/target).
  if (progress.status === "absent") return null;

  if (progress.status === "loading") {
    return (
      <div className={styles.progressZone} aria-busy="true">
        <Skeleton width="40%" height="0.9em" />
        <Skeleton width="100%" height="10px" className={styles.skelBar} />
        <Skeleton width="60%" height="0.9em" />
      </div>
    );
  }

  if (progress.status === "error") {
    return (
      <div className={styles.progressZone}>
        <ErrorState title={vipCopy.progressError} />
      </div>
    );
  }

  const { current, target, nextTierName } = progress.value;
  const pct = target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;
  const remaining = Math.max(0, target - current);

  // Max tier: no next target → honest "highest tier" state, no fabricated bar.
  if (!nextTierName) {
    return (
      <div className={styles.progressZone}>
        <p className={styles.maxedCopy}>
          <Icon name="trophy" size={18} className={styles.maxedIcon} />
          {vipCopy.atMaxTier}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.progressZone}>
      <div className={styles.progressHead}>
        <span className={styles.progressLabel}>{vipCopy.turnoverToNext}</span>
        <span className={styles.progressPct}>{Math.round(pct)}%</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={current}
        aria-label={vipCopy.turnoverToNext}
      >
        <span className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.remain}>
        {vipCopy.remainingPrefix}{" "}
        <MoneyValue value={{ amount: remaining, currency: "VND" }} kind="balance" />{" "}
        {vipCopy.remainingSuffix} <strong>{nextTierName}</strong>
      </p>
    </div>
  );
}

export function CurrentTierCard({ tiers, progress }: CurrentTierCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { openAuthModal } = useAuthModal();

  /* GUEST — honest join prompt, NO tier/progress number fabricated. */
  if (!isAuthenticated || !user) {
    return (
      <Card variant="vip" className={styles.guestCard}>
        <span className={styles.badge} aria-hidden>
          <Icon name="vip" size={32} />
        </span>
        <div className={styles.guestBody}>
          <h2 className={styles.guestTitle}>{vipCopy.guestTitle}</h2>
          <p className={styles.guestCopy}>{vipCopy.guestCopy}</p>
        </div>
        <Button
          variant="gold"
          size="lg"
          fullWidth
          onClick={() =>
            openAuthModal({ mode: "register", resumeIntent: { action: "none" } })
          }
        >
          {vipCopy.joinCta}
        </Button>
      </Card>
    );
  }

  /* MEMBER — real tier identity + §F-gated progress. */
  const tier =
    tiers.find((t) => t.level === user.vipLevel) ?? tiers[0];

  return (
    <Card variant="vip" active className={styles.memberCard}>
      <div className={styles.identity}>
        <span className={styles.badge} aria-hidden>
          {/* badge SLOT — token-gradient disc awaiting licensed tier art */}
          <Icon name="vip" size={36} />
        </span>
        <div className={styles.identityText}>
          <span className={styles.tierEyebrow}>{vipCopy.currentTier}</span>
          <span className={styles.tierName}>{tier.name}</span>
          <Badge tone="gold" variant="subtle">
            {vipCopy.cashbackRate(tier.cashbackRate)}
          </Badge>
        </div>
      </div>

      <ProgressBar progress={progress} />
    </Card>
  );
}
