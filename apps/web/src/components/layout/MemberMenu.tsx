/* ============================================================================
 * MemberMenu — avatar dropdown → ~8-item member menu (SPEC-03 B4, trimmed from
 * J9's 12; crypto/yield/sell-coin dropped). Items: Ví · Hoàn trả · Lịch sử ·
 * Tin nhắn · Giới thiệu · Bảo mật · Đại lý/CLB · Hỗ trợ + Đăng xuất.
 * Tin nhắn carries an unread badge from real data. Opens on click/focus (never
 * hover-only); Esc + outside-click close. Desktop dropdown; AppShell presents
 * it as a sheet on mobile via the BottomTabBar `Tài khoản` tab.
 * ==========================================================================*/

"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import type { User } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { Icon, type IconName } from "@/ui/Icon/Icon";
import styles from "./MemberMenu.module.css";

interface MenuItem {
  href: string;
  label: string;
  icon: IconName;
  badge?: number;
}

export function MemberMenu({ user }: { user: User }) {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items: MenuItem[] = [
    { href: "/vi-tien", label: vi.wallet.title, icon: "wallet" },
    { href: "/hoan-tra", label: vi.member.cashback, icon: "cashback" },
    { href: "/lich-su", label: vi.member.history, icon: "history" },
    { href: "/tin-nhan", label: vi.member.messages, icon: "message", badge: user.unreadMessages },
    { href: "/gioi-thieu", label: vi.member.referral, icon: "referral" },
    { href: "/bao-mat", label: vi.member.security, icon: "shield" },
    { href: "/cau-lac-bo", label: vi.member.agentClub, icon: "trophy" },
  ];

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <button
        type="button"
        className={styles.avatarBtn}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        aria-label={user.displayName}
      >
        <span className={styles.avatar} aria-hidden="true">
          <Icon name="user" size={20} />
        </span>
        {user.unreadMessages > 0 && (
          <span className={styles.dot} aria-hidden="true" />
        )}
      </button>

      {open && (
        <div id={menuId} role="menu" className={styles.menu}>
          {/* user-info header */}
          <div className={styles.head}>
            <span className={styles.avatarLg} aria-hidden="true">
              <Icon name="user" size={24} />
            </span>
            <div className={styles.headText}>
              <span className={styles.name}>{user.displayName}</span>
              <span className={styles.meta}>
                {user.vipTierName} · {user.memberId}
              </span>
            </div>
          </div>

          <ul className={styles.list}>
            {items.map((it) => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  role="menuitem"
                  className={styles.item}
                  onClick={() => setOpen(false)}
                >
                  <Icon name={it.icon} size={18} className={styles.itemIcon} />
                  <span>{it.label}</span>
                  {it.badge ? (
                    <span className={styles.badge}>{it.badge}</span>
                  ) : null}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/"
                role="menuitem"
                className={styles.item}
                onClick={() => setOpen(false)}
              >
                <Icon name="support" size={18} className={styles.itemIcon} />
                <span>{vi.member.support}</span>
              </Link>
            </li>
          </ul>

          <button
            type="button"
            className={styles.logout}
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
          >
            <Icon name="close" size={18} className={styles.itemIcon} />
            <span>{vi.auth.logout}</span>
          </button>
        </div>
      )}
    </div>
  );
}
