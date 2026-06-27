/* ============================================================================
 * Yaobet — /ho-tro (Hỗ trợ / Support). Minimal titled stub so the member-menu +
 * account-menu support link resolves (no 404). Shared shell. UI-only; mock.
 * ==========================================================================*/

import styles from "../stub.module.css";

export const metadata = {
  title: "Hỗ trợ — Yaobet",
};

export default function SupportPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Hỗ trợ khách hàng</h1>
      <p className={styles.body}>
        Đội ngũ chăm sóc khách hàng sẽ sớm sẵn sàng hỗ trợ bạn 24/7.
      </p>
    </div>
  );
}
