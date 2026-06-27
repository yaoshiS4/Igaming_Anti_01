/* ============================================================================
 * Yaobet — /tro-giup (Trung tâm trợ giúp / Help center). Minimal titled stub so
 * the footer link resolves (no 404). Shared shell. UI-only; mock.
 * ==========================================================================*/

import styles from "../stub.module.css";

export const metadata = {
  title: "Trung tâm trợ giúp — Yaobet",
};

export default function HelpCenterPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Trung tâm trợ giúp</h1>
      <p className={styles.body}>Trung tâm trợ giúp sẽ sớm ra mắt.</p>
    </div>
  );
}
