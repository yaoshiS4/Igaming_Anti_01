/* ============================================================================
 * DevAuthToggle — a DEV-ONLY mock-auth state switcher (SPEC-04 §4.2). Lets QA
 * flip guest → level-0 → tiered to exercise every auth-aware home surface
 * without a backend. Collapsed by default, pinned top-left, and kept clear of
 * the sticky header / TopBar so it never overlaps real chrome. Not a product
 * surface — it renders only in development.
 *
 * Uses the mock session's `cycleDevState` (guest → level-0 → tiered → guest).
 * ==========================================================================*/

"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/session";
import styles from "./DevAuthToggle.module.css";

const STATE_LABEL: Record<string, string> = {
  guest: "Khách",
  "level-0": "Cấp 0",
  tiered: "Hội viên",
};

export function DevAuthToggle() {
  const { authState, cycleDevState } = useAuth();
  const [open, setOpen] = useState(false);

  // dev-only: never ship to production chrome (hooks run unconditionally above).
  if (process.env.NODE_ENV === "production") return null;

  if (!open) {
    return (
      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen(true)}
        aria-label="Mở bảng chuyển trạng thái đăng nhập (dev)"
        title="Dev: auth state"
      >
        DEV
      </button>
    );
  }

  return (
    <div className={styles.panel} role="group" aria-label="Trạng thái đăng nhập (dev)">
      <div className={styles.row}>
        <span className={styles.tag}>DEV · AUTH</span>
        <button
          type="button"
          className={styles.close}
          onClick={() => setOpen(false)}
          aria-label="Đóng"
        >
          ×
        </button>
      </div>
      <button type="button" className={styles.cycle} onClick={cycleDevState}>
        <span className={styles.stateLabel}>{STATE_LABEL[authState] ?? authState}</span>
        <span className={styles.hint}>chạm để đổi</span>
      </button>
    </div>
  );
}
