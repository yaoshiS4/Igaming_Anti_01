/* ============================================================================
 * InviteTools — referral code + link + copy actions (SPEC-03 §referral
 * InviteTools; Wave 7.2). A client island: copy-to-clipboard with an honest,
 * equal-salience inline confirmation (no win-juice). The QR/poster is a
 * PLACEHOLDER SLOT (token-derived) until a real asset lands — never a fabricated
 * download. Auth-aware: a guest sees a prompt instead of a usable code.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import type { Referral } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import { Card, Button, Icon } from "@/ui";
import styles from "./InviteTools.module.css";

export interface InviteToolsProps {
  referral: Referral;
}

type Copied = "none" | "code" | "link";

export function InviteTools({ referral }: InviteToolsProps) {
  const { allowed, promptAuth } = useRequireAuth();
  const [copied, setCopied] = useState<Copied>("none");

  const copy = async (what: "code" | "link", value: string) => {
    if (!allowed) {
      promptAuth();
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopied(what);
      window.setTimeout(() => setCopied("none"), 2000);
    } catch {
      // clipboard blocked — leave UI honest, no fake success
      setCopied("none");
    }
  };

  return (
    <Card variant="default" className={styles.card}>
      <h2 className={styles.title}>Công cụ mời bạn bè</h2>

      <div className={styles.fields}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Mã giới thiệu</span>
          <div className={styles.inputRow}>
            <span className={styles.code}>{referral.code}</span>
            <Button
              variant="ghost"
              size="sm"
              icon="copy"
              onClick={() => copy("code", referral.code)}
            >
              {copied === "code" ? "Đã sao chép" : "Sao chép"}
            </Button>
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Liên kết giới thiệu</span>
          <div className={styles.inputRow}>
            <span className={styles.link}>{referral.link}</span>
            <Button
              variant="ghost"
              size="sm"
              icon="copy"
              onClick={() => copy("link", referral.link)}
            >
              {copied === "link" ? "Đã sao chép" : "Sao chép"}
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.posterRow}>
        {/* PLACEHOLDER SLOT — token-derived QR/poster, awaiting real asset */}
        <span className={styles.posterSlot} aria-hidden="true">
          <Icon name="grid" size={32} />
        </span>
        <div className={styles.posterCopy}>
          <span className={styles.posterTitle}>Ảnh mời / mã QR</span>
          <span className={styles.posterHint}>
            Ảnh chia sẻ sẽ hiển thị tại đây khi sẵn sàng.
          </span>
        </div>
      </div>

      {!allowed && (
        <p className={styles.guestNote}>
          {vi.auth.login} để lấy mã giới thiệu của riêng bạn.
        </p>
      )}
    </Card>
  );
}
