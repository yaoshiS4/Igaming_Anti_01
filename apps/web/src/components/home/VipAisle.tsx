/* ============================================================================
 * VipAisle — the VIP "luxury aisle" on Home (SPEC-03 §home → §vip VipTierDeck,
 * scoped to a home teaser). A horizontally-scrolling deck (Scroller) of tier
 * Cards (badge SLOT + tier name + truthful %-of-play cashback rate, bound to the
 * Yaobet VIP-BRD fixture — NOT J9's 0.40–1.00%), plus an auth-aware progress
 * panel:
 *   • guest    → a "join VIP" CTA that opens the auth modal (register intent).
 *   • member   → a truthful turnover-to-next-tier bar bound to the Live<VipProgress>
 *                envelope (fill = real current/target; reduced-motion-safe — the
 *                fill is a static CSS width, no 5s animate, per A7/F5). loading →
 *                Skeleton; error → ErrorState; absent → the panel is omitted.
 * Rates render as static marketing copy (the fixture's rate), never a fabricated
 * ledger figure.
 * ==========================================================================*/

"use client";

import Link from "next/link";
import type { Envelope, VipProgress, VipTier } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { formatVnd } from "@/lib/format";
import { useAuth } from "@/lib/auth/session";
import { useAuthModal } from "@/lib/auth/modal";
import { Card, Button, Scroller, Skeleton, ErrorState, Icon } from "@/ui";
import styles from "./VipAisle.module.css";

export interface VipAisleProps {
  tiers: VipTier[];
  progress: Envelope<VipProgress>;
}

function ProgressPanel({ progress }: { progress: Envelope<VipProgress> }) {
  if (progress.status === "absent") return null;

  if (progress.status === "loading") {
    return (
      <div className={styles.panel}>
        <Skeleton width="50%" height="1.2em" />
        <Skeleton width="100%" height="0.8em" className={styles.skelBar} />
      </div>
    );
  }
  if (progress.status === "error") {
    return (
      <div className={styles.panel}>
        <ErrorState title="Không tải được tiến độ VIP" />
      </div>
    );
  }

  const { current, target, currentTierName, nextTierName } = progress.value;
  // truthful fill — clamped real current/target; static width (no fake animate).
  const pct = target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;
  const remaining = Math.max(0, target - current);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        <span className={styles.curTier}>{currentTierName}</span>
        {nextTierName && (
          <span className={styles.nextTier}>
            {vi.member.nextTier}: {nextTierName}
          </span>
        )}
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={current}
        aria-label="Tiến độ lên hạng"
      >
        <span className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      {nextTierName ? (
        <p className={styles.remain}>
          Còn <strong>{formatVnd(remaining)}</strong> để lên {nextTierName}
        </p>
      ) : (
        <p className={styles.remain}>Bạn đang ở hạng cao nhất</p>
      )}
    </div>
  );
}

export function VipAisle({ tiers, progress }: VipAisleProps) {
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();

  return (
    <section className={styles.aisle} aria-label={vi.member.vip}>
      <div className={styles.head}>
        <h2 className={styles.title}>
          <Icon name="vip" size={20} className={styles.titleIcon} />
          {vi.member.vip}
        </h2>
        <Link href="/vip" className={styles.all}>
          Chi tiết <Icon name="chevronRight" size={16} />
        </Link>
      </div>

      {isAuthenticated ? (
        <ProgressPanel progress={progress} />
      ) : (
        <Card variant="vip" className={styles.joinCard}>
          <p className={styles.joinCopy}>Tham gia VIP để nhận hoàn trả theo hạng.</p>
          <Button
            variant="gold"
            onClick={() => openAuthModal({ mode: "register", resumeIntent: { action: "none" } })}
          >
            {vi.auth.register}
          </Button>
        </Card>
      )}

      <Scroller snap peek label={vi.member.vip}>
        <ul className={styles.deck}>
          {tiers.map((t) => (
            <li key={t.id} className={styles.deckItem}>
              <Card variant="vip" className={styles.tierCard}>
                {/* badge SLOT — token-gradient disc awaiting licensed tier art */}
                <span className={styles.badge} aria-hidden>
                  <Icon name="vip" size={28} />
                </span>
                <span className={styles.tierName}>{t.name}</span>
                <span className={styles.rate}>
                  {/* %-of-play rate — truthful marketing copy from the VIP-BRD fixture */}
                  Hoàn trả {t.cashbackRate.toString().replace(".", ",")}%
                </span>
              </Card>
            </li>
          ))}
        </ul>
      </Scroller>
    </section>
  );
}
