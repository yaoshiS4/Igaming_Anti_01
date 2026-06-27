/* ============================================================================
 * ProfileHeader — the /tai-khoan identity card (SPEC-03 B9 identity / §account).
 * Avatar slot + display name + VIP badge + copyable member id + verified mark.
 * Reads the mock session (useAuth) directly — a client island. A guest sees an
 * honest prompt (no fabricated identity); a level-0 member shows the "new
 * member" tier honestly rather than an aspirational one.
 *
 * Avatar art is a TOKEN-DERIVED PLACEHOLDER SLOT (initial glyph) until a real
 * asset lands — no J9 art. VIP level/tier are truthful session values.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import { vi } from "@/lib/i18n";
import { useAuth, useRequireAuth } from "@/lib/auth";
import { Card, Badge, Button, Icon } from "@/ui";
import styles from "./ProfileHeader.module.css";

export function ProfileHeader() {
  const { user } = useAuth();
  const { allowed, promptAuth } = useRequireAuth();
  const [copied, setCopied] = useState(false);

  if (!allowed || !user) {
    return (
      <Card variant="vip" className={styles.card}>
        <div className={styles.guest}>
          <span className={styles.avatarSlot} aria-hidden="true">
            <Icon name="account" size={32} />
          </span>
          <div className={styles.guestCopy}>
            <p className={styles.guestTitle}>Khách</p>
            <p className={styles.guestText}>{vi.auth.login} để xem tài khoản của bạn.</p>
          </div>
          <Button variant="gold" size="md" onClick={() => promptAuth()}>
            {vi.auth.login}
          </Button>
        </div>
      </Card>
    );
  }

  const initial = user.displayName.trim().charAt(0).toUpperCase() || "Y";

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(user.memberId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card variant="vip" className={styles.card}>
      <span className={styles.avatarSlot} aria-hidden="true">
        <span className={styles.avatarInitial}>{initial}</span>
      </span>

      <div className={styles.identity}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{user.displayName}</span>
          {user.verified && (
            <Badge tone="info" variant="subtle" className={styles.verified}>
              <Icon name="check" size={12} /> Đã xác minh
            </Badge>
          )}
        </div>

        <div className={styles.metaRow}>
          <Badge tone="gold" variant="subtle">
            {user.vipLevel === 0 ? "Thành viên mới" : user.vipTierName}
          </Badge>
        </div>

        <button type="button" className={styles.idChip} onClick={copyId}>
          <span className={styles.idLabel}>ID</span>
          <span className={styles.idValue}>{user.memberId}</span>
          <Icon name="copy" size={14} />
          {copied && <span className={styles.copied}>Đã sao chép</span>}
        </button>
      </div>
    </Card>
  );
}
