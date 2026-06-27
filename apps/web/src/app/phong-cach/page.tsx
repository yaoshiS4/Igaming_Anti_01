/* ============================================================================
 * Yaobet — /phong-cach (Phong cách / Glamor). Minimal titled stub so the
 * utility-nav + footer link resolves (no 404). Shared shell. UI-only; mock.
 * ==========================================================================*/

import styles from "../stub.module.css";

export const metadata = {
  title: "Phong cách — Yaobet",
};

export default function GlamorPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Phong cách</h1>
      <p className={styles.body}>Chuyên mục phong cách sẽ sớm ra mắt.</p>
    </div>
  );
}
