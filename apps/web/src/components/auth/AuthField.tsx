/* ============================================================================
 * AuthField — the auth modal's input (a shell-local TextField analog, SPEC-03
 * A2). Prefix icon + required star + input + reveal (eye) toggle for passwords
 * + a reserved inline error row (no layout shift). Used by AuthModal until the
 * shared ui/TextField primitive lands; mirrors its prop shape so the swap is
 * mechanical. ≥--tap-min height; numeric/tel inputMode opens the right keypad.
 * ==========================================================================*/

"use client";

import { useId, useState, type HTMLInputTypeAttribute } from "react";
import { Icon, type IconName } from "@/ui/Icon/Icon";
import styles from "./AuthField.module.css";

export interface AuthFieldProps {
  label: string;
  type?: HTMLInputTypeAttribute;
  value: string;
  onChange: (v: string) => void;
  prefixIcon?: IconName;
  required?: boolean;
  revealable?: boolean;
  error?: string;
  inputMode?: "text" | "numeric" | "tel";
  maxLength?: number;
  autoComplete?: string;
}

export function AuthField({
  label,
  type = "text",
  value,
  onChange,
  prefixIcon,
  required,
  revealable,
  error,
  inputMode,
  maxLength,
  autoComplete,
}: AuthFieldProps) {
  const id = useId();
  const errId = `${id}-err`;
  const [revealed, setRevealed] = useState(false);
  const effectiveType = revealable ? (revealed ? "text" : "password") : type;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.star} aria-hidden="true"> *</span>}
      </label>
      <div className={[styles.box, error ? styles.boxError : ""].filter(Boolean).join(" ")}>
        {prefixIcon && <Icon name={prefixIcon} size={18} className={styles.prefix} />}
        <input
          id={id}
          className={styles.input}
          type={effectiveType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
        />
        {revealable && (
          <button
            type="button"
            className={styles.eye}
            aria-label={revealed ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            aria-pressed={revealed}
            onClick={() => setRevealed((r) => !r)}
          >
            <Icon name={revealed ? "eyeOff" : "eye"} size={18} />
          </button>
        )}
      </div>
      {/* error row is ALWAYS reserved so there is no layout shift */}
      <p id={errId} className={styles.errorRow} role={error ? "alert" : undefined}>
        {error ?? " "}
      </p>
    </div>
  );
}
