/* ============================================================================
 * NotificationBell — the header bell that REPLACES the "Rút" header link
 * (deposit-first: Rút stays in the wallet, not the header). SPEC-03 header.
 *
 * Trigger: a ≥44px icon button carrying an unread-count BADGE bound to real
 * data (no badge at 0). Click/focus opens an OPAQUE dropdown panel listing the
 * mock notifications (khuyến mãi · nạp tiền · sự kiện · hệ thống) with title +
 * relative time + read/unread state; per-row "Đánh dấu đã đọc" + a panel-level
 * "Đánh dấu đã đọc tất cả"; an honest empty state when there are none.
 *
 * Read state is held locally (UI-only / mock — no BE write-back). Esc +
 * outside-click close; the panel is reduced-motion safe. Mirrors MemberMenu's
 * popover mechanics so the two header popovers behave identically.
 * ==========================================================================*/

"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { getNotifications } from "@/lib/mock";
import type { Notification, NotificationKind } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { relativeTime } from "@/lib/format";
import { Icon, type IconName } from "@/ui/Icon/Icon";
import styles from "./NotificationBell.module.css";

/* Map each truthful kind → an existing own-SVG glyph (no new network asset). */
const KIND_ICON: Record<NotificationKind, IconName> = {
  promo: "gift",
  deposit: "wallet",
  event: "trophy",
  system: "info",
};

const KIND_LABEL: Record<NotificationKind, string> = {
  promo: vi.notifications.kindPromo,
  deposit: vi.notifications.kindDeposit,
  event: vi.notifications.kindEvent,
  system: vi.notifications.kindSystem,
};

function unreadLabel(count: number): string {
  if (count === 0) return vi.notifications.allRead;
  if (count === 1) return vi.notifications.unreadOne;
  return `${count} ${vi.notifications.unreadMany}`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[] | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();

  // mock fetch on mount (mimics the server data seam; replaced by real API).
  useEffect(() => {
    let alive = true;
    getNotifications().then((n) => {
      if (alive) setItems(n);
    });
    return () => {
      alive = false;
    };
  }, []);

  // outside-click + Esc close (mirrors MemberMenu).
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

  const unread = useMemo(
    () => (items ? items.filter((n) => !n.read).length : 0),
    [items],
  );

  const markRead = (id: string) =>
    setItems((prev) =>
      prev ? prev.map((n) => (n.id === id ? { ...n, read: true } : n)) : prev,
    );

  const markAllRead = () =>
    setItems((prev) => (prev ? prev.map((n) => ({ ...n, read: true })) : prev));

  const hasItems = !!items && items.length > 0;
  // badge caps at 9+ so a wide count never blows out the 72px tier-1 row.
  const badgeText = unread > 9 ? "9+" : String(unread);

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <button
        type="button"
        className={styles.bellBtn}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={
          unread > 0
            ? `${vi.notifications.open} — ${unreadLabel(unread)}`
            : vi.notifications.open
        }
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="message" size={24} />
        {unread > 0 && (
          <span className={styles.badge} aria-hidden="true">
            {badgeText}
          </span>
        )}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={vi.notifications.title}
          className={styles.panel}
        >
          <div className={styles.head}>
            <span className={styles.headTitle}>{vi.notifications.title}</span>
            <span className={styles.headMeta}>{unreadLabel(unread)}</span>
            {unread > 0 && (
              <button
                type="button"
                className={styles.markAll}
                onClick={markAllRead}
              >
                {vi.notifications.markAllRead}
              </button>
            )}
          </div>

          {hasItems ? (
            <ul className={styles.list}>
              {items.map((n) => {
                const row = (
                  <>
                    <span
                      className={`${styles.rowIcon} ${styles[`kind_${n.kind}`]}`}
                      aria-hidden="true"
                    >
                      <Icon name={KIND_ICON[n.kind]} size={20} />
                    </span>
                    <span className={styles.rowBody}>
                      <span className={styles.rowTop}>
                        <span className={styles.rowKind}>{KIND_LABEL[n.kind]}</span>
                        <span className={styles.rowTime}>{relativeTime(n.at)}</span>
                      </span>
                      <span className={styles.rowTitle}>{n.title}</span>
                      <span className={styles.rowDetail}>{n.detail}</span>
                    </span>
                    {!n.read && <span className={styles.unreadDot} aria-hidden="true" />}
                  </>
                );

                return (
                  <li
                    key={n.id}
                    className={n.read ? styles.rowRead : styles.rowUnread}
                  >
                    {n.href ? (
                      <Link
                        href={n.href}
                        className={styles.row}
                        onClick={() => {
                          markRead(n.id);
                          setOpen(false);
                        }}
                      >
                        {row}
                      </Link>
                    ) : (
                      <div className={styles.row}>{row}</div>
                    )}
                    {!n.read && (
                      <button
                        type="button"
                        className={styles.rowAction}
                        onClick={() => markRead(n.id)}
                      >
                        {vi.notifications.markRead}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={styles.empty}>
              <span className={styles.emptyIcon} aria-hidden="true">
                <Icon name="message" size={28} />
              </span>
              <span className={styles.emptyTitle}>{vi.notifications.empty}</span>
              <span className={styles.emptyHint}>{vi.notifications.emptyHint}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
