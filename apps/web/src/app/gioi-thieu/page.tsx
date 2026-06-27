/* ============================================================================
 * Yaobet — /gioi-thieu (Giới thiệu / Referral). Minimal titled stub so the
 * referral link resolves (no 404). Mounts inside the shared shell (root
 * AppShell). UI-only; mock — no BE. Decree-174 truthful-only: no fabricated
 * figures, only an honest "coming soon" notice.
 * ==========================================================================*/

import styles from "../stub.module.css";

export const metadata = {
  title: "Giới thiệu bạn bè — Yaobet",
};

export default function ReferralPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Giới thiệu bạn bè</h1>
      <p className={styles.body}>
        Chương trình giới thiệu bạn bè sẽ sớm ra mắt. Mời bạn bè cùng tham gia để
        nhận thưởng khi tính năng được mở.
      </p>
    </div>
  );
}
