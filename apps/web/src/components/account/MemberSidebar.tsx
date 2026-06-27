/* ============================================================================
 * MemberSidebar — the LEFT member rail hosted ONCE by (member)/layout.tsx so
 * every member surface (/tai-khoan, /vi-tien, …) shares it (J9 .user_info_box +
 * .memberMenu, profile.html). A client island: reads the mock session (useAuth)
 * and the active route (usePathname) for menu highlighting.
 *
 * Composition (top → bottom) — the J9-signature premium member stack:
 *   1. PROFILE CARD — identity + membership progress (J9 .user_info_box):
 *                     · identity     — avatar initial · displayName · tier
 *                       ribbon Badge · verified/activation status chip ·
 *                       copyable ID chip · "Nhận huy hiệu" link (→ /vip)
 *                     · progress bar — membership track (J9 header anchor):
 *                       groove + brand-accent fill + glowing dot + next-tier
 *                       pill + caption. Envelope-gated (live only).
 *   2. WALLET CARD  — its OWN card (NOT fused into the profile, per J9): the
 *                     "Ví của tôi" title + near-white balance + Nạp/Rút.
 *   3. ACTION CARDS — 2-up J9-style cards: Cửa hàng điểm (→ /cua-hang) ·
 *                     Trung tâm nhiệm vụ (→ /hoan-tra).
 *   4. ICON GRID  — 12 tiles, 3-col × 4-row (J9 .menu_box reconciled to real
 *                   routes). Tin nhắn carries a red unread dot; Bảo mật is a
 *                   persistent gold-active tile when user.verified.
 *   5. LOGOUT ROW — <LogoutButton/> full-width, OUTSIDE the grid.
 *
 * Truthful-only (§F): a guest sees an honest login prompt (no fabricated
 * identity/balance/points/progress); the live balance arrives as a §F Envelope,
 * the membership progress as its OWN §F Envelope, and the account summary as a
 * typed fixture — the island cannot invent a figure it was never handed. The
 * progress bar renders a fill ONLY when progress.status==='live'; loading → a
 * neutral skeleton groove; absent/error → a quiet "đang cập nhật" with an empty
 * track and NO fabricated fill. Money renders on the equal-salience role.
 * ==========================================================================*/

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useRequireAuth } from "@/lib/auth";
import { vi } from "@/lib/i18n";
import { formatVnd, formatCount } from "@/lib/format";
import type {
  AccountSummary,
  Envelope,
  LiveMoney,
  VipProgress,
} from "@/lib/types";
import { Badge, Button, Icon, type IconName } from "@/ui";
import { LogoutButton } from "./LogoutButton";
import styles from "./MemberSidebar.module.css";

export interface MemberSidebarProps {
  /** live balance envelope (server-issued) — never a client guess. */
  balance: Envelope<LiveMoney>;
  /** points + accrued rebate (truthful fixture). */
  summary: AccountSummary;
  /** membership turnover-to-next-tier (server-issued §F envelope). The bar
   *  renders a live fill ONLY when status==='live'. */
  progress: Envelope<VipProgress>;
}

interface MenuItem {
  id: string;
  label: string;
  icon: IconName;
  href: string;
}

/* The 12-tile grid: J9's .menu_box reconciled to our REAL routes (no invented
 * destinations). Two mappings are approximate by design — Sinh lời → /hoan-tra
 * and Bán xu → /cua-hang reuse the nearest real economic surface. Bảo mật is
 * an in-page hash section on /tai-khoan (native <a> so hashchange fires). */
const MENU: MenuItem[] = [
  { id: "wallet", label: vi.member.wallet, icon: "wallet", href: "/vi-tien" },
  { id: "cashback", label: vi.member.cashback, icon: "cashback", href: "/hoan-tra" },
  { id: "yield", label: vi.member.yield, icon: "yield", href: "/hoan-tra" },
  { id: "sellCoin", label: vi.member.sellCoin, icon: "card", href: "/cua-hang" },
  { id: "history", label: vi.member.history, icon: "history", href: "/lich-su" },
  { id: "messages", label: vi.member.messages, icon: "message", href: "/tin-nhan" },
  { id: "referral", label: vi.member.referral, icon: "referral", href: "/gioi-thieu" },
  { id: "security", label: vi.member.security, icon: "shield", href: "/tai-khoan#bao-mat" },
  { id: "universalUpgrade", label: vi.member.universalUpgrade, icon: "vip", href: "/vip" },
  { id: "promo", label: vi.member.promo, icon: "gift", href: "/khuyen-mai" },
  { id: "tutorial", label: vi.member.tutorial, icon: "info", href: "/tro-giup" },
  { id: "honor", label: vi.member.honor, icon: "trophy", href: "/cau-lac-bo" },
];

/* ----------------------------------------------------------------------------
 * ProgressBar — the membership track inside the hero (J9 header anchor).
 * Takes the FULL §F envelope and gates rendering on its status: a fill is drawn
 * ONLY for status==='live'. This is the single place the rebuild could regress
 * truthfulness (§F), so the gate lives here, explicit and total.
 * --------------------------------------------------------------------------*/
function ProgressBar({ progress }: { progress: Envelope<VipProgress> }) {
  /* loading → a neutral skeleton groove (no dot, no fill, no caption). */
  if (progress.status === "loading") {
    return (
      <div className={styles.progress}>
        <div className={`${styles.track} ${styles.trackSkeleton}`} aria-hidden="true" />
      </div>
    );
  }

  /* absent / error → an empty track + a quiet "đang cập nhật". NEVER a fill. */
  if (progress.status !== "live") {
    return (
      <div className={styles.progress}>
        <div className={styles.track} />
        <p className={styles.caption}>{vi.account.progressUpdating}</p>
      </div>
    );
  }

  const { current, target, currentTierName, nextTierName } = progress.value;

  /* max tier (nextTierName === null): a full lit track labelled by the current
   * tier; no next-tier tag, no goal caption. */
  if (nextTierName === null) {
    return (
      <div className={styles.progress}>
        <div className={styles.progressHead}>
          <span className={styles.progressSpacer} aria-hidden="true" />
          <span className={styles.nextTag}>{currentTierName}</span>
        </div>
        <div className={styles.track}>
          <span className={styles.fill} style={{ width: "100%" }} />
          <span className={styles.dot} style={{ left: "100%" }} aria-hidden="true" />
        </div>
      </div>
    );
  }

  /* clamped live percentage — the ONLY inline style; everything else is class
   * driven. Guard target<=0 so a malformed seam never divides by zero. */
  const pct =
    target > 0 ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;
  const remaining = Math.max(0, target - current);

  return (
    <div className={styles.progress}>
      <div className={styles.progressHead}>
        <span className={styles.progressSpacer} aria-hidden="true" />
        <span className={styles.nextTag}>
          {nextTierName}
          <Icon name="chevronRight" size={12} />
        </span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label={`${currentTierName} → ${nextTierName}`}
      >
        <span className={styles.fill} style={{ width: `${pct}%` }} />
        <span className={styles.dot} style={{ left: `${pct}%` }} aria-hidden="true" />
      </div>
      <p className={styles.caption}>
        {vi.account.progressPrefix} {formatVnd(remaining)} {vi.account.progressSuffix}{" "}
        <span className={styles.captionTier}>{nextTierName}</span>
      </p>
    </div>
  );
}

export function MemberSidebar({ balance, summary, progress }: MemberSidebarProps) {
  const { user } = useAuth();
  const { allowed, promptAuth } = useRequireAuth();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [hash, setHash] = useState("");

  /* track the active member-section hash so the right tile highlights (the
   * content column swaps by hash; pathname alone can't tell sections apart). */
  useEffect(() => {
    const sync = () => setHash(window.location.hash.replace(/^#/, ""));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  /* ---- guest: honest prompt, no fabricated identity/balance/progress ---- */
  if (!allowed || !user) {
    return (
      <aside className={styles.rail} aria-label={vi.nav.account}>
        <div className={styles.guest}>
          <span className={styles.avatar} aria-hidden="true">
            <Icon name="user" size={28} />
          </span>
          <p className={styles.guestTitle}>Khách</p>
          <p className={styles.guestText}>
            {vi.auth.login} để xem tài khoản của bạn.
          </p>
          <Button variant="gold" size="md" fullWidth onClick={() => promptAuth()}>
            {vi.auth.login}
          </Button>
        </div>
      </aside>
    );
  }

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(user.memberId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const tierLabel = user.vipLevel === 0 ? vi.account.newMember : user.vipTierName;

  return (
    <aside className={styles.rail} aria-label={vi.nav.account}>
      {/* 1. PROFILE CARD — identity + membership progress (J9 .user_info_box).
       *  Wallet is a SEPARATE card (below), not fused here. */}
      <section className={styles.hero}>
        {/* corner sheen — the J9 ice-white upper-right glow */}
        <span className={styles.heroSheen} aria-hidden="true" />

        {/* top-right corner — "Nhận huy hiệu" on its OWN row (never the name
         *  line, per J9: the medal link sits in the card's top-right corner). */}
        <div className={styles.cardTop}>
          <Link href="/vip" className={styles.badgeLink}>
            <Icon name="trophy" size={14} />
            <span>{vi.account.getBadge}</span>
            <Icon name="chevronRight" size={14} />
          </Link>
        </div>

        {/* identity — avatar (with a verified check overlay) + name·tier on one
         *  line + plain-text ID (no chip), per J9 .user_info. */}
        <div className={styles.identity}>
          <span className={styles.avatarWrap}>
            <span className={styles.avatar} aria-hidden="true">
              <span className={styles.avatarInitial}>
                {user.displayName.trim().charAt(0).toUpperCase() || "Y"}
              </span>
            </span>
            {user.verified && (
              <span
                className={styles.verifiedBadge}
                title={vi.account.statusVerified}
              >
                <Icon name="check" size={11} />
              </span>
            )}
          </span>

          <div className={styles.idMain}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{user.displayName}</span>
              <Badge tone="gold" variant="subtle" className={styles.tierBadge}>
                {tierLabel}
              </Badge>
            </div>

            <button type="button" className={styles.idLine} onClick={copyId}>
              <span className={styles.idLabel}>ID</span>
              <span className={styles.idValue}>{user.memberId}</span>
              <Icon name="copy" size={13} />
              {copied && <span className={styles.copied}>Đã sao chép</span>}
            </button>
          </div>
        </div>

        {/* membership progress (envelope-gated) */}
        <ProgressBar progress={progress} />
      </section>

      {/* 2. WALLET CARD — its OWN card, separate from the profile (J9 keeps
       *  .user_info_box and the wallet box distinct). Title + balance + Nạp/Rút. */}
      <section className={styles.walletCard}>
        <span className={styles.walletSheen} aria-hidden="true" />
        <span className={styles.walletTitle}>{vi.member.wallet}</span>
        <span className={styles.balance}>
          {balance.status === "live"
            ? formatVnd(balance.value)
            : vi.wallet.zeroBalance}
        </span>
        {/* shortcuts: deep-link to /vi-tien and select the matching WalletTabs
         * tab via #hash — never a second set of action buttons. */}
        <div className={styles.walletActions}>
          <Link href="/vi-tien#deposit" className={`${styles.actBtn} ${styles.actGold}`}>
            <Icon name="deposit" size={16} />
            <span>{vi.wallet.deposit}</span>
          </Link>
          <Link href="/vi-tien#withdraw" className={`${styles.actBtn} ${styles.actGhost}`}>
            <Icon name="wallet" size={16} />
            <span>{vi.wallet.withdraw}</span>
          </Link>
        </div>
      </section>

      {/* 3. ACTION CARDS — Cửa hàng điểm · Trung tâm nhiệm vụ ---------- */}
      <div className={styles.actionCards}>
        <Link href="/cua-hang" className={styles.actionCard}>
          <span className={styles.cardSheen} aria-hidden="true" />
          <span className={styles.actionHead}>
            <Icon name="gift" size={18} className={styles.actionIcon} />
            <Icon name="info" size={14} className={styles.actionHelp} />
          </span>
          <span className={styles.actionTitle}>{vi.account.pointsStore}</span>
          <span className={styles.actionMeta}>
            <span className={styles.actionMetaLabel}>{vi.account.myPoints}</span>
            <span className={styles.actionMetaValue}>{formatCount(summary.points)}</span>
          </span>
        </Link>

        <Link href="/hoan-tra" className={styles.actionCard}>
          <span className={styles.cardSheen} aria-hidden="true" />
          <span className={styles.actionHead}>
            <Icon name="cashback" size={18} className={styles.actionIcon} />
          </span>
          <span className={styles.actionTitle}>{vi.account.taskCenter}</span>
          <span className={styles.actionMeta}>
            <span className={styles.actionMetaLabel}>{vi.account.waitingUnlock}</span>
            <span className={styles.actionMetaValue}>0</span>
          </span>
        </Link>
      </div>

      {/* 4. ICON GRID — 12 tiles (J9 .menu_box) ----------------------- */}
      <nav className={styles.menu} aria-label={vi.nav.account}>
        <ul className={styles.menuGrid}>
          {MENU.map((m) => {
            const [mPath, mHash = ""] = m.href.split("#");
            const isSection = mPath === "/tai-khoan" && mHash !== "";
            const onAccount = pathname === "/tai-khoan";

            let active: boolean;
            if (isSection && onAccount) {
              active = mHash === hash;
            } else {
              active = m.href === pathname;
            }

            /* Bảo mật is persistently gold-active when the member is verified
             * (J9's lit shield tile), independent of the current route. */
            const lit = m.id === "security" && user.verified;

            const className = [
              styles.tile,
              active ? styles.tileActive : "",
              lit ? styles.tileActiveGold : "",
            ]
              .filter(Boolean)
              .join(" ");

            const showUnread = m.id === "messages" && user.unreadMessages > 0;

            /* In-page section switch while already on /tai-khoan: use a native
             * anchor. next/link does a soft history.pushState for same-page hash
             * targets and never fires `hashchange`, so the content column + tile
             * highlight (both hash-driven islands) would stay stuck. A native
             * <a href="#…"> mutates the hash through the browser, which DOES fire
             * hashchange. Path-changing tiles keep next/link. */
            const inner = (
              <>
                <span className={styles.tileIconWrap}>
                  <Icon name={m.icon} size={24} className={styles.tileIcon} />
                  {showUnread && <span className={styles.unreadDot} aria-hidden="true" />}
                </span>
                <span className={styles.tileLabel}>{m.label}</span>
              </>
            );

            return (
              <li key={m.id}>
                {isSection && onAccount ? (
                  <a
                    href={`#${mHash}`}
                    className={className}
                    aria-current={active ? "page" : undefined}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    href={m.href}
                    className={className}
                    aria-current={active ? "page" : undefined}
                  >
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 5. LOGOUT ROW — full-width, OUTSIDE the grid ----------------- */}
      <div className={styles.logoutRow}>
        <LogoutButton />
      </div>
    </aside>
  );
}
