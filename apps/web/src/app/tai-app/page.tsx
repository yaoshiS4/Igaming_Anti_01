/* ============================================================================
 * Yaobet — /tai-app (Tải app / App download). Minimal titled stub so the footer
 * link resolves (no 404). Shared shell. UI-only; mock.
 * ==========================================================================*/

import styles from "../stub.module.css";

export const metadata = {
  title: "Tải ứng dụng — Yaobet",
};

export default function AppDownloadPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Tải ứng dụng</h1>
      <p className={styles.body}>Ứng dụng di động sẽ sớm có mặt.</p>
    </div>
  );
}
