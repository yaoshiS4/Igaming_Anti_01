/* ============================================================================
 * InviteTools — referral code + link + copy actions (SPEC-03 §referral
 * InviteTools; Wave 7.2). A client island: copy-to-clipboard with an honest,
 * equal-salience inline confirmation (no win-juice). Auth-aware: a guest sees a
 * prompt instead of a usable code. Shared by /dai-ly AND /gioi-thieu.
 *
 * J9 referral-method panel (.top_left, the NARROWER 430px panel): a 2-col layout
 * — code + link stacked LEFT (~71%, J9 .box_left), a white QR tile RIGHT (J9
 * .box_right .QR-code) with a "Lưu mã QR" action beneath. The 2-col grid is
 * gated at the band breakpoint (640px) and collapses to a stack in /dai-ly's
 * narrow column (beside the 304px rail).
 *
 * QR HONESTY: referral.posterSrc is wired through next/image inside the white
 * tile, but ONLY when it is a REAL asset — the current mock points at a dark
 * placeholder SVG (not a scannable QR), so the tile shows the honest placeholder
 * and the save button stays DISABLED. We never ship a blank/fabricated QR or a
 * fake download; the tile lights up automatically when a real QR asset lands.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import Image from "next/image";
import type { Referral } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import { Card, Button, Icon } from "@/ui";
import styles from "./InviteTools.module.css";

const t = vi.referral;

/* The placeholder asset shipped with the mock — a dark "Poster" graphic, NOT a
 * scannable QR. Treat it as absent so we render the honest placeholder and keep
 * the save action disabled until a real QR asset replaces this path. */
const PLACEHOLDER_POSTER = "/assets/placeholders/poster.svg";

export interface InviteToolsProps {
  referral: Referral;
}

type Copied = "none" | "code" | "link";

export function InviteTools({ referral }: InviteToolsProps) {
  const { allowed, promptAuth } = useRequireAuth();
  const [copied, setCopied] = useState<Copied>("none");

  // a REAL QR asset (not the placeholder) → render it + enable save.
  const hasRealPoster =
    Boolean(referral.posterSrc) && referral.posterSrc !== PLACEHOLDER_POSTER;

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
      <h2 className={styles.title}>{t.invitePanelTitle}</h2>

      <div className={styles.layout}>
        {/* LEFT — code + link stacked (J9 .box_left, ~71%) */}
        <div className={styles.fields}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t.inviteCodeLabel}</span>
            <div className={styles.inputRow}>
              <span className={styles.code}>{referral.code}</span>
              <Button
                variant="ghost"
                size="sm"
                icon="copy"
                onClick={() => copy("code", referral.code)}
              >
                {copied === "code" ? t.inviteCopied : t.inviteCopy}
              </Button>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t.inviteLinkLabel}</span>
            <div className={styles.inputRow}>
              <span className={styles.link}>{referral.link}</span>
              <Button
                variant="ghost"
                size="sm"
                icon="copy"
                onClick={() => copy("link", referral.link)}
              >
                {copied === "link" ? t.inviteCopied : t.inviteCopy}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT — white QR tile (J9 .box_right .QR-code) + "Lưu mã QR" beneath */}
        <div className={styles.qrCol}>
          <span className={styles.qrTile}>
            {hasRealPoster ? (
              <Image
                src={referral.posterSrc}
                alt={t.invitePosterTitle}
                width={90}
                height={90}
                className={styles.qrImg}
              />
            ) : (
              // honest placeholder — never a fabricated/blank QR
              <span className={styles.qrPlaceholder} aria-hidden="true">
                <Icon name="grid" size={32} />
              </span>
            )}
          </span>
          <span className={styles.qrTitle}>{t.invitePosterTitle}</span>
          <Button
            variant="ghost"
            size="sm"
            icon="deposit"
            disabled={!hasRealPoster}
          >
            {t.inviteSaveQr}
          </Button>
          {!hasRealPoster && (
            <span className={styles.qrHint}>{t.invitePosterHint}</span>
          )}
        </div>
      </div>

      {!allowed && <p className={styles.guestNote}>{t.inviteGuestNote}</p>}
    </Card>
  );
}
