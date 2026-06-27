/* ============================================================================
 * TierLadder — the VIP bậc-thang (SPEC-03 §vip VipTierDeck). A horizontally
 * scrollable deck (Scroller, 16px peek @375) of tier Cards: badge SLOT + tier
 * name + truthful %-of-play rate (from the Yaobet VIP-BRD fixture — NOT J9's
 * 0.40–1.00% numbers) + a short perk line. Auth-aware highlighting:
 *   • the member's CURRENT tier is marked (active glow + "Hiện tại" badge);
 *   • tiers ABOVE the member's level read as "Chưa mở" (locked) — an honest
 *     status, NOT a fabricated progress promise.
 * Rates are static marketing copy; no ledger figure is fabricated here.
 * The compact variant (home/aisle-style) drops the perk line for density.
 * ==========================================================================*/

"use client";

import type { VipTier } from "@/lib/types";
import { useAuth } from "@/lib/auth/session";
import { Card, Badge, Icon, Scroller } from "@/ui";
import { vipCopy } from "./copy";
import styles from "./TierLadder.module.css";

export interface TierLadderProps {
  tiers: VipTier[];
  /** drop the perk line for a denser deck (default false) */
  compact?: boolean;
}

export function TierLadder({ tiers, compact = false }: TierLadderProps) {
  const { isAuthenticated, user } = useAuth();
  const currentLevel = isAuthenticated && user ? user.vipLevel : null;

  return (
    <Scroller snap peek label={vipCopy.ladderHeading} className={styles.scroller}>
      <ul className={styles.deck}>
        {tiers.map((t) => {
          const isCurrent = currentLevel != null && t.level === currentLevel;
          const isLocked = currentLevel != null && t.level > currentLevel;
          return (
            <li key={t.id} className={styles.item}>
              <Card
                variant="vip"
                active={isCurrent}
                className={[styles.tierCard, isLocked ? styles.locked : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={`${t.name} — ${vipCopy.levelLabel(t.level)}`}
              >
                <span className={styles.cardTop}>
                  {isCurrent && (
                    <Badge tone="gold" variant="solid">
                      {vipCopy.currentBadge}
                    </Badge>
                  )}
                  {isLocked && (
                    <span className={styles.lockChip}>
                      <Icon name="lock" size={13} /> {vipCopy.lockedBadge}
                    </span>
                  )}
                </span>

                {/* badge SLOT — token-gradient disc awaiting licensed tier art */}
                <span className={styles.badge} aria-hidden>
                  <Icon name="vip" size={30} />
                </span>

                <span className={styles.level}>{vipCopy.levelLabel(t.level)}</span>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.rate}>{vipCopy.cashbackRate(t.cashbackRate)}</span>

                {!compact && t.perks.length > 0 && (
                  <ul className={styles.perkLine}>
                    {t.perks.map((p) => (
                      <li key={p} className={styles.perkLineItem}>
                        <Icon name="check" size={13} className={styles.perkTick} />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </li>
          );
        })}
      </ul>
    </Scroller>
  );
}
