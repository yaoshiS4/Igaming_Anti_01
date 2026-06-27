/* ============================================================================
 * AccountMenu — the /tai-khoan menu list (SPEC-03 §account / B4 menu). Vertical
 * list of ≥44px rows: Bảo mật · Giới hạn & Trách nhiệm (RG) · Xác minh (KYC) ·
 * Khuyến mãi · Hỗ trợ. Each row is a labeled Link to its IA destination.
 *
 * RG ROW [RG]: "Giới hạn & Trách nhiệm" links to the responsible-gaming surface
 * where limits/self-exclusion are SERVER-REFLECTED — the UI only reflects state,
 * it never lets the client SET a threshold here (no client-set RG dial). The row
 * carries an honest sub-label saying so. Auth-aware: a guest is routed to auth.
 * ==========================================================================*/

"use client";

import Link from "next/link";
import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import { Card, Icon, type IconName } from "@/ui";
import styles from "./AccountMenu.module.css";

interface MenuItem {
  id: string;
  label: string;
  sub?: string;
  icon: IconName;
  href: string;
  /** member-only — a guest tap routes to auth instead of the destination. */
  gated?: boolean;
}

const ITEMS: MenuItem[] = [
  { id: "security", label: vi.member.security, sub: "Mật khẩu, 2FA, mật khẩu rút tiền", icon: "shield", href: "/bao-mat", gated: true },
  { id: "rg", label: "Giới hạn & Trách nhiệm", sub: "Giới hạn nạp/thua, tự loại trừ — do hệ thống quản lý", icon: "info", href: "/bao-mat#trach-nhiem", gated: true },
  { id: "kyc", label: "Xác minh danh tính (KYC)", sub: "Tên thật, giấy tờ tùy thân", icon: "check", href: "/bao-mat#kyc", gated: true },
  { id: "promo", label: vi.nav.promo, sub: "Ưu đãi & sự kiện", icon: "gift", href: "/khuyen-mai" },
  { id: "support", label: vi.member.support, sub: "Liên hệ chăm sóc khách hàng", icon: "support", href: "/ho-tro" },
];

export function AccountMenu() {
  const { allowed, promptAuth } = useRequireAuth();

  const onGatedClick = (e: React.MouseEvent, item: MenuItem) => {
    if (item.gated && !allowed) {
      e.preventDefault();
      promptAuth();
    }
  };

  return (
    <Card variant="default" className={styles.card}>
      <ul className={styles.list}>
        {ITEMS.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={styles.row}
              onClick={(e) => onGatedClick(e, item)}
            >
              <span className={styles.iconWrap} aria-hidden="true">
                <Icon name={item.icon} size={20} />
              </span>
              <span className={styles.text}>
                <span className={styles.label}>{item.label}</span>
                {item.sub && <span className={styles.sub}>{item.sub}</span>}
              </span>
              <Icon name="chevronRight" size={18} className={styles.chevron} />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
