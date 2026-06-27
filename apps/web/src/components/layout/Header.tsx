/* ============================================================================
 * Header — J9-EXACT two-tier desktop header + slim mobile top bar (SPEC-03).
 *
 * Structure mirrors J9's real markup (sources/VIP.html + profile.html):
 *
 *   TIER 1 (.app-header, 72px) — three zones, left→right:
 *     · .logo-box        — brand lockup (J9 main logo 44px). → "/"
 *     · ul.right_nav     — 5 ICON-OVER-LABEL utility items (J9 48×56 cells,
 *                          9px gap): VIP (gold-tinted cell), Khuyến mãi, Cửa
 *                          hàng, Phong cách, CLB. margin-left:auto pushes the
 *                          cluster + identity to the right edge.
 *     · .user_info_box   — guest → Đăng ký / Đăng nhập; member → balance chip
 *                          (→ /vi-tien) + NẠP gold pill + avatar menu.
 *
 *   TIER 2 (.routers-list, 48px) — the gaming-vertical category nav: 152px
 *     cells, gold-gradient active text, the 3px .aa-line active underline.
 *     Each cell is a NavDropdown (hover/focus/tap panel). Hidden <768px.
 *
 *   MOBILE (<768px): slim bar — `Danh mục` launcher + logo + (guest) compact
 *     auth / (member) balance chip + avatar. Tier-2 hidden (the launcher +
 *     BottomTabBar take over).
 *
 * Auth via useAuth; the single auth surface opens via useAuthModal. Member
 * balance is a truthful Envelope (§F) — Skeleton while loading, the live figure
 * when present, an honest zero label otherwise. UI-only / mock; no BE.
 * ==========================================================================*/

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useAuthModal } from "@/lib/auth";
import type { Envelope, LiveMoney, Vertical } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { Button } from "@/ui/Button/Button";
import { Icon, type IconName } from "@/ui/Icon/Icon";
import { Skeleton } from "@/ui/Skeleton/Skeleton";
import { Money } from "./_internal/Money";
import { NavDropdown } from "./_internal/NavDropdown";
import { verticalIcon } from "./_internal/verticalIcon";
import { MemberMenu } from "./MemberMenu";
import { NotificationBell } from "./NotificationBell";
import styles from "./Header.module.css";

export interface HeaderProps {
  /** the verticals taxonomy (Tier-2 + category panels), server-sourced. */
  verticals: Vertical[];
  /** member balance envelope (truthful seam, §F). guest → may be Absent. */
  balance: Envelope<LiveMoney>;
  /** opens the mobile CategorySheet (UT-3). Provided by AppShell. */
  onOpenCategories: () => void;
}

/* J9 .right_nav cluster — the 5 fixed utility verticals (icon over label). The
 * VIP cell carries J9's gold-tinted highlight; the rest are the silver-blue
 * default. Each routes to its surface (never a dead label). */
const RIGHT_NAV: { id: string; href: string; icon: IconName; label: string; vip?: boolean }[] = [
  { id: "vip", href: "/vip", icon: "vip", label: vi.header.vip, vip: true },
  { id: "promo", href: "/khuyen-mai", icon: "gift", label: vi.header.promo },
  { id: "store", href: "/cua-hang", icon: "ticket", label: vi.header.store },
  { id: "glamor", href: "/phong-cach", icon: "trophy", label: vi.header.glamor },
  { id: "club", href: "/dai-ly", icon: "referral", label: vi.header.club },
];

/* Tier-1 balance chip — J9 .user_balance_box analog; links to /vi-tien (UT-1),
 * never a dead label. */
function BalanceChip({ balance }: { balance: Envelope<LiveMoney> }) {
  return (
    <Link href="/vi-tien" className={styles.balanceChip} aria-label={vi.wallet.title}>
      <Icon name="wallet" size={18} className={styles.chipIcon} />
      {balance.status === "loading" ? (
        <Skeleton width="9ch" height="1em" label={vi.state.loading} />
      ) : balance.status === "live" ? (
        <Money value={balance.value} size="num" />
      ) : (
        <span className={styles.chipMuted}>{vi.wallet.zeroBalance}</span>
      )}
    </Link>
  );
}

export function Header({ verticals, balance, onOpenCategories }: HeaderProps) {
  const { authState, user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const router = useRouter();
  const isMember = authState !== "guest";

  return (
    <header className={styles.header}>
      {/* ===================== TIER 1 — identity / utility ===================== */}
      <div className={styles.tier1}>
        <div className={styles.tier1Inner}>
          {/* mobile category launcher (UT-3) — hidden ≥768 */}
          <button
            type="button"
            className={styles.menuBtn}
            aria-label={vi.nav.categories}
            onClick={onOpenCategories}
          >
            <Icon name="grid" size={24} />
          </button>

          {/* J9 .logo-box — brand lockup, main logo 44px. The brand IS the DEBET
           *  logo image (owned asset); no text wordmark. */}
          <Link href="/" className={styles.logo} aria-label={vi.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.svg" alt={vi.brand} className={styles.logoImg} />
          </Link>

          {/* J9 ul.right_nav — 5 icon-over-label utility verticals (desktop) */}
          <ul className={styles.rightNav} aria-label="Tiện ích">
            {RIGHT_NAV.map((item) => (
              <li key={item.id} className={item.vip ? styles.rightNavVip : undefined}>
                <Link href={item.href} className={styles.rightNavLink}>
                  <span className={styles.rightNavIcon}>
                    <Icon name={item.icon} size={24} />
                  </span>
                  <span className={styles.rightNavLabel}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* J9 .user_info_box — balance + NẠP + avatar (member) / auth (guest) */}
          <div className={styles.identity}>
            {isMember ? (
              <>
                <div className={styles.walletGroup}>
                  <BalanceChip balance={balance} />
                  {/* GATE FIX: a member is authenticated — NẠP RUNS the action
                   *  (routes to the deposit surface), it does NOT re-open login.
                   *  J9 .go_pay gold pill, fused to the chip's right edge.
                   *  Routes to the wallet (deposit tab) — /vi-tien. */}
                  <button
                    type="button"
                    className={styles.goPay}
                    onClick={() => router.push("/vi-tien")}
                  >
                    {vi.wallet.deposit}
                  </button>
                </div>
                {/* DEPOSIT-FIRST: the header's "Rút" link was REMOVED here and
                 *  replaced by the NOTIFICATION bell. Rút stays available in the
                 *  wallet/profile (MemberMenu → Ví → /vi-tien), just not in the
                 *  header — keeping NẠP the prominent header money action. */}
                <NotificationBell />
                {user && <MemberMenu user={user} />}
              </>
            ) : (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => openAuthModal({ mode: "register" })}
                >
                  {vi.auth.register}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openAuthModal({ mode: "login" })}
                >
                  {vi.auth.login}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===================== TIER 2 — category nav (desktop) ===================== */}
      <div className={styles.tier2}>
        <nav className={styles.tier2Inner} aria-label="Danh mục trò chơi">
          {verticals.map((v) => (
            <NavDropdown
              key={v.id}
              label={v.label}
              href={v.href}
              icon={verticalIcon(v.iconId)}
              panel={
                <ul className={styles.megaList}>
                  <li>
                    <Link href={v.href} className={styles.megaItem}>
                      <Icon name={verticalIcon(v.iconId)} size={18} />
                      <span>{v.label}</span>
                    </Link>
                  </li>
                </ul>
              }
            />
          ))}
        </nav>
      </div>
    </header>
  );
}
