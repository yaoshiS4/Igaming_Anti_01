/* ============================================================================
 * MessageCenter — the "/tin-nhan" inbox island (J9 消息中心 / Message Center).
 * ----------------------------------------------------------------------------
 * The right content column of the (member) area: an outer Card panel with a
 * header row (accent message glyph + "Tin nhắn" + unread-count subtitle on the
 * left; a mark-all-read pill + delete-all pill + a filter Dropdown pinned
 * right) over a vertical stack of message cards.
 *
 * State model mirrors the header NotificationBell EXACTLY: the list + the
 * read/deleted state are CLIENT-only local React state (UI-only / mock — there
 * is NO BE write-back). The server hands the seed in via `initial`; this island
 * renders only what it was given and never fabricates a message or a count.
 *
 * Truthful-only (Decree-174), three honest states:
 *   • guest    → an honest login prompt (the rail shows its own guest prompt);
 *   • empty    → EmptyState 'default' (natural / DEMO_EMPTY / after delete-all);
 *   • filtered → EmptyState 'filtered' with a reset (filter excludes all but
 *                items still exist).
 *
 * Reduced-motion safe; every interactive target is ≥ --tap-min.
 * ==========================================================================*/

"use client";

import { useMemo, useState } from "react";
import type { Message } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { relativeTime } from "@/lib/format";
import { useRequireAuth } from "@/lib/auth";
import { Card, Button, Dropdown, EmptyState, Icon } from "@/ui";
import styles from "./MessageCenter.module.css";

type Filter = "all" | "unread" | "read";

const FILTER_LABEL: Record<Filter, string> = {
  all: vi.messages.filterAll,
  unread: vi.messages.filterUnread,
  read: vi.messages.filterRead,
};

const FILTER_ORDER: readonly Filter[] = ["all", "unread", "read"] as const;

export interface MessageCenterProps {
  initial: Message[];
}

export function MessageCenter({ initial }: MessageCenterProps) {
  const { allowed, promptAuth } = useRequireAuth();
  const [items, setItems] = useState<Message[]>(initial);
  const [filter, setFilter] = useState<Filter>("all");

  const unread = useMemo(() => items.filter((m) => !m.read).length, [items]);

  const filtered = useMemo(() => {
    if (filter === "unread") return items.filter((m) => !m.read);
    if (filter === "read") return items.filter((m) => m.read);
    return items;
  }, [items, filter]);

  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
    );
  const markAllRead = () =>
    setItems((prev) => prev.map((m) => ({ ...m, read: true })));
  const deleteAll = () => setItems([]);

  const subtitle =
    unread > 0
      ? `${unread} ${vi.messages.subtitleUnread}`
      : vi.messages.subtitleAllRead;

  /* ----- header (always rendered for the member/empty/filtered states) ----- */
  // The filter + bulk actions are only meaningful when there is something to
  // act on, so they are suppressed in the zero-items state (and for guests).
  const hasItems = items.length > 0;
  const header = (
    <div className={styles.header}>
      <div className={styles.titleRow}>
        <Icon name="message" size={24} className={styles.titleIcon} />
        <div className={styles.titleText}>
          <h2 className={styles.title}>{vi.messages.title}</h2>
          <span className={styles.subtitle}>{subtitle}</span>
        </div>
      </div>

      {hasItems && (
        <div className={styles.actions}>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon="check"
              className={styles.markAll}
              onClick={markAllRead}
            >
              {vi.notifications.markAllRead}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon="close"
            className={styles.deleteAll}
            onClick={deleteAll}
          >
            {vi.messages.deleteAll}
          </Button>
          <Dropdown
            label={vi.messages.filterLabel}
            placement="bottom-end"
            trigger={
              <button type="button" className={styles.filterTrigger}>
                <span>{FILTER_LABEL[filter]}</span>
                <Icon name="chevronDown" size={16} aria-hidden="true" />
              </button>
            }
          >
            <ul className={styles.filterMenu}>
              {FILTER_ORDER.map((value) => (
                <li key={value}>
                  <button
                    type="button"
                    role="menuitem"
                    aria-current={filter === value || undefined}
                    className={
                      filter === value
                        ? `${styles.filterOption} ${styles.filterOptionActive}`
                        : styles.filterOption
                    }
                    onClick={() => setFilter(value)}
                  >
                    {FILTER_LABEL[value]}
                  </button>
                </li>
              ))}
            </ul>
          </Dropdown>
        </div>
      )}
    </div>
  );

  /* ----- body — exactly one honest branch ----- */
  let body: React.ReactNode;
  if (!allowed) {
    // GUEST: never a message list — an honest login invite.
    body = (
      <EmptyState
        icon="message"
        title={vi.messages.guestPrompt}
        message={
          <Button variant="primary" size="sm" onClick={() => promptAuth()}>
            {vi.auth.login}
          </Button>
        }
      />
    );
  } else if (!hasItems) {
    // No data (natural / DEMO_EMPTY / after delete-all).
    body = (
      <EmptyState
        icon="message"
        title={vi.messages.empty}
        message={vi.messages.emptyHint}
      />
    );
  } else if (filtered.length === 0) {
    // Items exist but the active filter excludes them all.
    body = (
      <EmptyState variant="filtered" onReset={() => setFilter("all")} />
    );
  } else {
    body = (
      <ul className={styles.list}>
        {filtered.map((m) => (
          <MessageItem key={m.id} message={m} onRead={markRead} />
        ))}
      </ul>
    );
  }

  return (
    <Card variant="default" className={styles.panel}>
      {header}
      {body}
    </Card>
  );
}

/* ----------------------------------------------------------------------------
 * One message card. An UNREAD card is a button (clicking it marks it read —
 * the dot + wash + accent edge drop and the subject de-emphasizes). A READ
 * card has no action, so it is a plain non-interactive container.
 * --------------------------------------------------------------------------*/
function MessageItem({
  message,
  onRead,
}: {
  message: Message;
  onRead: (id: string) => void;
}) {
  const { id, subject, body, read, at } = message;

  const inner = (
    <>
      <div className={styles.itemHead}>
        <span className={read ? styles.subjectRead : styles.subject}>
          {subject}
        </span>
        <span className={styles.time}>{relativeTime(at)}</span>
        {!read && <span className={styles.unreadDot} aria-hidden="true" />}
      </div>
      <p className={styles.body}>{body}</p>
    </>
  );

  if (read) {
    return (
      <li className={styles.item}>
        <div className={styles.itemInner}>{inner}</div>
      </li>
    );
  }

  return (
    <li className={`${styles.item} ${styles.itemUnread}`}>
      <button
        type="button"
        className={`${styles.itemInner} ${styles.itemButton}`}
        aria-label={`${vi.notifications.markRead}: ${subject}`}
        onClick={() => onRead(id)}
      >
        {inner}
      </button>
    </li>
  );
}
