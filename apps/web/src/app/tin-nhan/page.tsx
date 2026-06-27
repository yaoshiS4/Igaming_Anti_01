/* ============================================================================
 * Yaobet — /tin-nhan (Tin nhắn / Messages). Minimal titled stub so the inbox
 * link resolves (no 404). Mounts inside the shared shell (root AppShell).
 * UI-only; mock — no BE. Decree-174 truthful-only: an honest empty state, no
 * fabricated message counts.
 * ==========================================================================*/

import styles from "../stub.module.css";

export const metadata = {
  title: "Tin nhắn — Yaobet",
};

export default function MessagesPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Tin nhắn</h1>
      <p className={styles.body}>Bạn chưa có tin nhắn nào.</p>
    </div>
  );
}
