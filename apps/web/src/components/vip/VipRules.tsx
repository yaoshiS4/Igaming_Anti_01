/* ============================================================================
 * VipRules — upgrade + rebate rules copy (SPEC-03 §vip VipRules). Static,
 * truthful explanatory cards: how a tier is reached (real turnover, no dressed
 * numbers), how %-of-play cashback works (equal win/loss salience), and the RG
 * line (18+, set limits, support). A Server-Component-safe presentational
 * component — no client state, no fabricated figures.
 * ==========================================================================*/

import { Card, Icon } from "@/ui";
import { vipCopy } from "./copy";
import styles from "./VipRules.module.css";

export function VipRules() {
  return (
    <ol className={styles.list}>
      {vipCopy.rules.map((rule, i) => (
        <li key={rule.title} className={styles.item}>
          <Card variant="default" className={styles.ruleCard}>
            <span className={styles.num} aria-hidden>
              {i + 1}
            </span>
            <div className={styles.ruleBody}>
              <h3 className={styles.ruleTitle}>{rule.title}</h3>
              <p className={styles.ruleText}>{rule.body}</p>
            </div>
            <Icon name="info" size={18} className={styles.ruleIcon} aria-hidden />
          </Card>
        </li>
      ))}
    </ol>
  );
}
