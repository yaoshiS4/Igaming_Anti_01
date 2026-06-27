/* ============================================================================
 * StepExplainer — 4-step "how it works" grid (SPEC-03 §referral StepExplainer;
 * Wave 7.2). Static, truthful copy only (no fabricated bonus %). 2-col grid on
 * desktop, single stack @375. Server-rendered.
 * ==========================================================================*/

import { Icon, type IconName } from "@/ui";
import styles from "./StepExplainer.module.css";

interface Step {
  icon: IconName;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    icon: "copy",
    title: "1. Lấy liên kết",
    body: "Sao chép mã hoặc liên kết giới thiệu của bạn ở phần Công cụ mời.",
  },
  {
    icon: "referral",
    title: "2. Chia sẻ với bạn bè",
    body: "Gửi liên kết cho bạn bè qua mạng xã hội hoặc tin nhắn.",
  },
  {
    icon: "user",
    title: "3. Bạn bè đăng ký",
    body: "Bạn bè đăng ký và tham gia chơi qua liên kết của bạn.",
  },
  {
    icon: "cashback",
    title: "4. Nhận hoa hồng",
    body: "Bạn nhận hoa hồng theo doanh thu phát sinh, theo điều khoản chương trình.",
  },
];

export function StepExplainer() {
  return (
    <section className={styles.section} aria-label="Cách hoạt động">
      <h2 className={styles.title}>Cách hoạt động</h2>
      <ol className={styles.grid}>
        {STEPS.map((s) => (
          <li key={s.title} className={styles.step}>
            <span className={styles.iconWrap} aria-hidden="true">
              <Icon name={s.icon} size={22} />
            </span>
            <div className={styles.copy}>
              <span className={styles.stepTitle}>{s.title}</span>
              <span className={styles.stepBody}>{s.body}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
