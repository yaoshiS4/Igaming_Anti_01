/* ============================================================================
 * Luxury VIP — VipFaq (STUB). Single-open accordion (openFaq internal, -1=none);
 * chevron rotate + max-height transition; open row gets a faint gold bg.
 * ==========================================================================*/
"use client";

import { useState } from "react";
import type { FaqItem, Lang } from "@/lib/vip";
import styles from "./VipFaq.module.css";

export function VipFaq({ items, lang }: { items: FaqItem[]; lang: Lang }) {
  const [openFaq, setOpenFaq] = useState<number>(-1);

  return (
    <div className={styles.list}>
      {items.map((item, i) => {
        const open = openFaq === i;
        const panelId = `vip-faq-panel-${i}`;
        const buttonId = `vip-faq-button-${i}`;
        return (
          <div
            key={item.q.vi}
            className={`${styles.item} ${open ? styles.itemOpen : ""}`}
          >
            <button
              type="button"
              id={buttonId}
              className={`${styles.question} ${open ? styles.questionOpen : ""}`}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenFaq(open ? -1 : i)}
            >
              <span>{item.q[lang]}</span>
              <span
                aria-hidden="true"
                className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
              >
                ⌄
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`${styles.answer} ${open ? styles.answerOpen : ""}`}
            >
              <div className={styles.answerInner}>{item.a[lang]}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
