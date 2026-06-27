/* ============================================================================
 * PromoChips — neutral promo chips (SPEC-03 §home PromoChips; SPEC-04 5.5). A
 * horizontally-scrolling row (Scroller, 16px peek @375) of neutral category
 * chips that link to the live promo page — NO hardcoded bonus % (the chip shows
 * only the truthful promo title/category). empty → band omitted.
 * ==========================================================================*/

import Link from "next/link";
import type { Promo } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { Scroller, Icon } from "@/ui";
import styles from "./PromoChips.module.css";

export interface PromoChipsProps {
  promos: Promo[];
}

export function PromoChips({ promos }: PromoChipsProps) {
  if (promos.length === 0) return null;

  return (
    <section className={styles.section} aria-label={vi.nav.promo}>
      <div className={styles.head}>
        <h2 className={styles.title}>{vi.nav.promo}</h2>
        <Link href="/khuyen-mai" className={styles.all}>
          Tất cả <Icon name="chevronRight" size={16} />
        </Link>
      </div>
      <Scroller snap={false} peek label={vi.nav.promo}>
        <ul className={styles.row}>
          {promos.map((p) => (
            <li key={p.id}>
              <Link href={p.href} className={styles.chip}>
                <span className={styles.chipCat}>{p.category}</span>
                <span className={styles.chipTitle}>{p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Scroller>
    </section>
  );
}
