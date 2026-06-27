/* ============================================================================
 * SecurityCenter — "Bảo mật" (J9 安全验证 / security panel). The Bảo mật
 * member-menu item lands here. This panel used to also host the basic-info
 * verification rows (real name / phone / email); those moved OUT to the Hồ sơ
 * section so each menu item shows its own content. What remains is the actual
 * SECURITY surface, which was previously empty:
 *
 *   score      — a security-score bar (0–100, server-issued; the island renders
 *                the figure it was handed, never re-derives or inflates it).
 *   controls   — three collapsible security controls:
 *     1. Đổi mật khẩu đăng nhập   — cũ / mới / xác nhận
 *     2. Mật khẩu rút tiền (fund) — mới / xác nhận (set or change)
 *     3. Mã xác thực động (2FA)   — enable affordance
 *   Each control's status (set / unset) comes from the truthful verification
 *   fixture; opening one reveals a UI-only form that stops at an honest no-BE
 *   notice on submit (no fake success).
 *
 * Truthful-only (§F): the score is server-issued; the fund-pw / 2FA status is a
 * typed fixture. Mobile-first @375 (controls stack); desktop fills the column.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import { vi } from "@/lib/i18n";
import type { SecurityIndex, VerificationItem } from "@/lib/types";
import { Badge, Button, Card, Icon, type BadgeTone } from "@/ui";
import styles from "./SecurityCenter.module.css";

export interface SecurityCenterProps {
  index: SecurityIndex;
  /** verification fixture — read for fund-pw / 2FA status only. */
  verification: VerificationItem[];
}

function scoreBand(score: number): { label: string; tone: BadgeTone } {
  if (score >= 80) return { label: vi.account.securityScoreHigh, tone: "win" };
  if (score >= 40) return { label: vi.account.securityScoreMedium, tone: "info" };
  return { label: vi.account.securityScoreLow, tone: "danger" };
}

type ControlId = "login" | "fund" | "dynamic";

export function SecurityCenter({ index, verification }: SecurityCenterProps) {
  const [open, setOpen] = useState<ControlId | null>(null);
  const band = scoreBand(index.score);

  const fundItem = verification.find((v) => v.id === "fundPassword");
  const dynItem = verification.find((v) => v.id === "dynamicCode");
  const fundSet = fundItem?.status === "verified";
  const dynSet = dynItem?.status === "verified";

  const toggle = (id: ControlId) => setOpen((cur) => (cur === id ? null : id));

  return (
    <section className={styles.wrap} aria-label={vi.account.securityCenter}>
      <Card variant="default" className={styles.panel}>
        {/* header + score bar ----------------------------------------- */}
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <Icon name="shield" size={24} className={styles.titleIcon} />
            <div className={styles.titleText}>
              <h2 className={styles.title}>{vi.account.securityCenter}</h2>
              <p className={styles.subtitle}>{vi.account.securitySubtitle}</p>
            </div>
          </div>

          <div className={styles.score}>
            <div className={styles.scoreTop}>
              <span className={styles.scoreLabel}>{vi.account.securityScore}</span>
              <span className={styles.scoreMeta}>
                <span className={styles.scoreNum}>{index.score}</span>
                <span className={styles.scoreMax}>/ 100</span>
                <Badge tone={band.tone} variant="subtle">
                  {band.label}
                </Badge>
              </span>
            </div>
            <div
              className={styles.bar}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={index.score}
              aria-label={vi.account.securityScore}
            >
              <span className={styles.barFill} style={{ width: `${index.score}%` }} />
            </div>
          </div>
        </header>

        {/* security controls ------------------------------------------ */}
        <ul className={styles.controls}>
          <SecurityControl
            id="login"
            icon="lock"
            title={vi.account.changeLoginPassword}
            sub={vi.account.loginPasswordSub}
            actionLabel={vi.account.change}
            isOpen={open === "login"}
            onToggle={() => toggle("login")}
          >
            <ChangePasswordForm
              fields={[
                vi.account.oldPassword,
                vi.account.newPassword,
                vi.account.confirmPassword,
              ]}
            />
          </SecurityControl>

          <SecurityControl
            id="fund"
            icon="wallet"
            title={vi.account.fundPasswordTitle}
            sub={vi.account.fundPasswordSub}
            status={fundSet ? "verified" : "unset"}
            actionLabel={fundSet ? vi.account.change : vi.account.setupNow}
            isOpen={open === "fund"}
            onToggle={() => toggle("fund")}
          >
            <ChangePasswordForm
              fields={[vi.account.newPassword, vi.account.confirmFundPassword]}
            />
          </SecurityControl>

          <SecurityControl
            id="dynamic"
            icon="shield"
            title={vi.account.dynamicCodeTitle}
            sub={vi.account.dynamicCodeSub}
            status={dynSet ? "verified" : "unset"}
            actionLabel={dynSet ? vi.account.change : vi.account.enable}
            isOpen={open === "dynamic"}
            onToggle={() => toggle("dynamic")}
          >
            <EnableNotice />
          </SecurityControl>
        </ul>
      </Card>
    </section>
  );
}

/* -- one collapsible security control row ---------------------------------- */
function SecurityControl({
  id,
  icon,
  title,
  sub,
  status,
  actionLabel,
  isOpen,
  onToggle,
  children,
}: {
  id: ControlId;
  icon: "lock" | "wallet" | "shield";
  title: string;
  sub: string;
  status?: "verified" | "unset";
  actionLabel: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const panelId = `sec-panel-${id}`;
  return (
    <li className={styles.control}>
      <button
        type="button"
        className={styles.controlHead}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.controlIcon} aria-hidden="true">
          <Icon name={icon} size={20} />
        </span>
        <span className={styles.controlText}>
          <span className={styles.controlTitle}>{title}</span>
          <span className={styles.controlSub}>{sub}</span>
        </span>
        {status && (
          <Badge tone={status === "verified" ? "win" : "neutral"} variant="subtle">
            {status === "verified" ? vi.account.statusVerified : vi.account.statusUnset}
          </Badge>
        )}
        <span className={styles.controlAction}>
          {actionLabel}
          <Icon name="chevronDown" size={14} className={isOpen ? styles.chevOpen : undefined} />
        </span>
      </button>
      {isOpen && (
        <div id={panelId} role="region" className={styles.controlBody}>
          {children}
        </div>
      )}
    </li>
  );
}

/* -- password form (UI-only; honest no-BE notice on submit) ---------------- */
function ChangePasswordForm({ fields }: { fields: string[] }) {
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState(false);

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        setNotice(true);
      }}
    >
      {fields.map((label) => (
        <Field key={label} label={label} type={show ? "text" : "password"} />
      ))}

      <button
        type="button"
        className={styles.reveal}
        onClick={() => setShow((s) => !s)}
        aria-pressed={show}
      >
        <Icon name={show ? "eyeOff" : "eye"} size={16} />
        <span>{show ? vi.account.hidePassword : vi.account.showPassword}</span>
      </button>

      {notice && (
        <p className={styles.notice} role="status">
          {vi.account.uiOnlyNotice}
        </p>
      )}

      <Button variant="gold" size="md" type="submit" fullWidth>
        {vi.account.save}
      </Button>
    </form>
  );
}

/* -- 2FA enable (UI-only) -------------------------------------------------- */
function EnableNotice() {
  const [notice, setNotice] = useState(false);
  return (
    <div className={styles.form}>
      <p className={styles.notice} role="status">
        {notice ? vi.account.uiOnlyNotice : vi.account.dynamicCodeSub}
      </p>
      <Button variant="gold" size="md" fullWidth onClick={() => setNotice(true)}>
        {vi.account.enable}
      </Button>
    </div>
  );
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <input className={styles.input} type={type} autoComplete="off" placeholder={label} />
    </label>
  );
}
