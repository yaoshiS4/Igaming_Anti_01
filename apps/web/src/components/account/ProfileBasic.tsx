/* ============================================================================
 * ProfileBasic — "Hồ sơ" (J9 个人资料 / profile basic-info panel). The Hồ sơ
 * member-menu item lands here: it shows ONLY the account's basic identity —
 * avatar, display name + masked member ID, real name, phone, email. Bank-card
 * linking and crypto-wallet addresses USED to live under this panel; they were
 * moved OUT to their own member-menu sections (Ngân hàng / Ví) so each menu
 * item now shows its own content.
 *
 * Truthful-only (§F): identity comes from the mock session (useAuth); the
 * contact rows (real name / phone / email) are typed verification fixtures
 * already masked at source. A guest never reaches this island (the rail shows
 * the honest login prompt), so this renders for an authenticated mock user only.
 * "Đổi ảnh đại diện" / row edits are UI-only affordances — no BE.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { vi } from "@/lib/i18n";
import type { VerificationItem } from "@/lib/types";
import { Badge, Button, Card, type BadgeTone } from "@/ui";
import styles from "./ProfileBasic.module.css";

export interface ProfileBasicProps {
  /** real name / phone / email rows (masked at source). */
  contact: VerificationItem[];
}

const ROW_LABEL: Partial<Record<VerificationItem["id"], string>> = {
  realName: vi.account.realName,
  phone: vi.account.phone,
  email: vi.account.email,
};

const STATUS_TONE: Record<VerificationItem["status"], BadgeTone> = {
  verified: "win",
  pending: "info",
  unset: "neutral",
  error: "danger",
};

const STATUS_TEXT: Record<VerificationItem["status"], string> = {
  verified: vi.account.statusVerified,
  pending: vi.account.statusPending,
  unset: vi.account.statusUnset,
  error: vi.state.error,
};

export function ProfileBasic({ contact }: ProfileBasicProps) {
  const { user } = useAuth();
  const [notice, setNotice] = useState(false);

  if (!user) return null;

  /* only basic-info contact rows — bank/crypto moved to their own sections. */
  const rows = contact.filter((c) => c.id === "realName" || c.id === "phone" || c.id === "email");

  return (
    <section className={styles.wrap} aria-label={vi.account.profileTitle}>
      <Card variant="default" className={styles.panel}>
        <header className={styles.header}>
          <h2 className={styles.title}>{vi.account.profileTitle}</h2>
          <p className={styles.subtitle}>{vi.account.profileSubtitle}</p>
        </header>

        {/* avatar + identity ------------------------------------------- */}
        <div className={styles.identity}>
          <span className={styles.avatar} aria-hidden="true">
            <span className={styles.avatarInitial}>
              {user.displayName.trim().charAt(0).toUpperCase() || "Y"}
            </span>
          </span>
          <div className={styles.idText}>
            <span className={styles.name}>{user.displayName}</span>
            <span className={styles.idLine}>
              {vi.account.memberId}: <span className={styles.idValue}>{user.memberId}</span>
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setNotice(true)}>
            {vi.account.avatarChange}
          </Button>
        </div>

        {/* contact rows ------------------------------------------------- */}
        <ul className={styles.list}>
          {rows.map((item) => (
            <li key={item.id} className={styles.row}>
              <div className={styles.rowMain}>
                <span className={styles.rowLabel}>{ROW_LABEL[item.id]}</span>
                <span className={styles.rowValue}>
                  {item.value ?? <span className={styles.rowEmpty}>—</span>}
                </span>
              </div>
              <div className={styles.rowEnd}>
                <Badge tone={STATUS_TONE[item.status]} variant="subtle">
                  {STATUS_TEXT[item.status]}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setNotice(true)}>
                  {item.status === "unset" ? vi.account.setupNow : vi.account.edit}
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {notice && (
          <p className={styles.notice} role="status">
            {vi.account.uiOnlyNotice}
          </p>
        )}
      </Card>
    </section>
  );
}
