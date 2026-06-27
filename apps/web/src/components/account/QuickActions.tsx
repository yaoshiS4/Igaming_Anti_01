/* ============================================================================
 * QuickActions — the /tai-khoan top action cluster (SPEC-03 §account). Three
 * labeled ≥44px actions: Nạp · Rút · Lịch sử — the same money affordances the
 * wallet surface carries, surfaced on the account hub for one-tap reach. They
 * route to the wallet (/vi-tien, where Nạp/Rút live) and history (/lich-su).
 *
 * Guest taps route through the auth modal (resume-intent for Nạp/Rút). A member
 * navigates directly. No fabricated figures here — pure navigation.
 * ==========================================================================*/

"use client";

import { useRouter } from "next/navigation";
import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import { Card, Icon, type IconName } from "@/ui";
import styles from "./QuickActions.module.css";

interface QuickAction {
  id: string;
  label: string;
  icon: IconName;
  href: string;
  intent?: "deposit" | "withdraw";
}

const ACTIONS: QuickAction[] = [
  { id: "deposit", label: vi.wallet.deposit, icon: "deposit", href: "/vi-tien", intent: "deposit" },
  { id: "withdraw", label: vi.wallet.withdraw, icon: "wallet", href: "/vi-tien", intent: "withdraw" },
  { id: "history", label: vi.wallet.history, icon: "history", href: "/lich-su" },
];

export function QuickActions() {
  const router = useRouter();
  const { allowed, promptAuth } = useRequireAuth();

  const onAction = (a: QuickAction) => {
    if (!allowed) {
      promptAuth(a.intent ? { action: a.intent } : undefined);
      return;
    }
    router.push(a.href);
  };

  return (
    <div className={styles.row} role="group" aria-label="Thao tác nhanh">
      {ACTIONS.map((a) => (
        <Card
          key={a.id}
          variant="default"
          interactive
          onClick={() => onAction(a)}
          aria-label={a.label}
          className={styles.action}
        >
          <span className={styles.iconWrap} aria-hidden="true">
            <Icon name={a.icon} size={24} />
          </span>
          <span className={styles.label}>{a.label}</span>
        </Card>
      ))}
    </div>
  );
}
