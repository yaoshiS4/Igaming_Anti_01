/* ============================================================================
 * AuthCluster — the home auth/identity strip (SPEC-03 §home; SPEC-04 5.2).
 * Auth-aware:
 *   • guest    → Đăng ký (--cta-accent / gold scarce) + Đăng nhập (primary CTA),
 *                opening the auth modal (register vs login mode).
 *   • member   → a balance CHIP that LINKS to /vi-tien (never a dead label —
 *                UT-1) + a quick-deposit CTA routing to /vi-tien. Balance reads
 *                the server Live envelope (§F): loading → Skeleton; stale →
 *                MoneyValue's "tạm dừng"; absent/error → the chip is omitted but
 *                the deposit CTA stays (the member can always top up).
 *
 * This is a slim home convenience strip; the persistent identity/wallet cluster
 * lives in the TopBar (B2). Both route the balance chip to /vi-tien.
 * ==========================================================================*/

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Envelope, LiveMoney } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { useAuth } from "@/lib/auth/session";
import { useAuthModal } from "@/lib/auth/modal";
import { Button, MoneyValue, Skeleton, Icon } from "@/ui";
import styles from "./AuthCluster.module.css";

export interface AuthClusterProps {
  balance: Envelope<LiveMoney>;
}

export function AuthCluster({ balance }: AuthClusterProps) {
  const { isAuthenticated, user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className={styles.cluster}>
        <div className={styles.greet}>
          <span className={styles.welcome}>Chào mừng đến {vi.brand}</span>
          <span className={styles.sub}>Đăng ký để nhận hoàn trả không giới hạn.</span>
        </div>
        <div className={styles.actions}>
          <Button
            variant="gold"
            onClick={() => openAuthModal({ mode: "register", resumeIntent: { action: "none" } })}
          >
            {vi.auth.register}
          </Button>
          <Button
            variant="primary"
            onClick={() => openAuthModal({ mode: "login", resumeIntent: { action: "none" } })}
          >
            {vi.auth.login}
          </Button>
        </div>
      </div>
    );
  }

  // member
  return (
    <div className={styles.cluster}>
      <div className={styles.greet}>
        <span className={styles.welcome}>
          {user ? `Xin chào, ${user.displayName}` : "Xin chào"}
        </span>
        {/* balance chip → /vi-tien (UT-1: one tap to wallet, never a dead label) */}
        {balance.status !== "absent" && balance.status !== "error" && (
          <Link href="/vi-tien" className={styles.balanceChip} aria-label={`${vi.wallet.balance} — mở ví`}>
            <Icon name="wallet" size={16} className={styles.chipIcon} />
            <span className={styles.chipLabel}>{vi.wallet.balance}:</span>
            {balance.status === "loading" ? (
              <Skeleton width="8ch" height="1.2em" />
            ) : (
              <MoneyValue
                value={balance.value}
                kind="balance"
                freshnessMs={balance.freshnessMs}
                className={styles.chipMoney}
              />
            )}
            <Icon name="chevronRight" size={16} className={styles.chipChevron} />
          </Link>
        )}
      </div>
      <div className={styles.actions}>
        <Button variant="gold" icon="deposit" onClick={() => router.push("/vi-tien")}>
          {vi.wallet.deposit}
        </Button>
      </div>
    </div>
  );
}
