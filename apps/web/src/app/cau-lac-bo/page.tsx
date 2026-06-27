/* ============================================================================
 * Yaobet — /cau-lac-bo (Câu lạc bộ đại lý / Agent club). Minimal titled stub so
 * the member-menu agent-club link resolves (no 404). Shared shell. UI-only; mock.
 * ==========================================================================*/

import styles from "../stub.module.css";

export const metadata = {
  title: "Câu lạc bộ đại lý — Yaobet",
};

export default function AgentClubPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Câu lạc bộ đại lý</h1>
      <p className={styles.body}>Chương trình câu lạc bộ đại lý sẽ sớm ra mắt.</p>
    </div>
  );
}
