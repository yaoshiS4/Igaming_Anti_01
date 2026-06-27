/* ============================================================================
 * AgentTiers — affiliate tier ladder (SPEC-03 §referral; Wave 7.2). The Đại lý
 * dashboard's tier overview. Tier NAMES + qualitative criteria are program
 * structure (not live numbers); commission rates are intentionally described as
 * "theo điều khoản chương trình" rather than fabricated %, so no false payout
 * figure is shown (RG / Decree-174). The member's CURRENT tier is highlighted.
 * Server-rendered; the current-tier highlight comes from a passed level.
 * ==========================================================================*/

import { Card, Badge, Icon } from "@/ui";
import styles from "./AgentTiers.module.css";

export interface AgentTiersProps {
  /** the member's current affiliate level (0 = not yet an agent) */
  currentLevel: number;
}

interface AgentTier {
  level: number;
  name: string;
  criteria: string;
}

// Program structure — names + criteria only. NO fabricated commission %.
const TIERS: AgentTier[] = [
  { level: 1, name: "Đại lý Đồng", criteria: "Bắt đầu khi có thành viên giới thiệu hoạt động." },
  { level: 2, name: "Đại lý Bạc", criteria: "Đạt mốc thành viên hoạt động theo điều khoản." },
  { level: 3, name: "Đại lý Vàng", criteria: "Mở rộng mạng lưới giới thiệu ổn định." },
  { level: 5, name: "Đại lý Bạch kim", criteria: "Mạng lưới giới thiệu quy mô lớn, hoa hồng cao nhất." },
];

export function AgentTiers({ currentLevel }: AgentTiersProps) {
  return (
    <section className={styles.section} aria-label="Cấp đại lý">
      <h2 className={styles.title}>Cấp đại lý</h2>
      <ul className={styles.list}>
        {TIERS.map((t) => {
          const isCurrent = t.level === currentLevel;
          return (
            <li key={t.level}>
              <Card
                variant="vip"
                active={isCurrent}
                className={styles.tier}
              >
                <span className={styles.badge} aria-hidden="true">
                  <Icon name="trophy" size={22} />
                </span>
                <div className={styles.body}>
                  <div className={styles.head}>
                    <span className={styles.name}>{t.name}</span>
                    {isCurrent && <Badge tone="gold">Cấp hiện tại</Badge>}
                  </div>
                  <span className={styles.criteria}>{t.criteria}</span>
                  <span className={styles.rate}>
                    Hoa hồng theo điều khoản chương trình
                  </span>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
