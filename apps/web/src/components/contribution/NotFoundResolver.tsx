/* ============================================================================
 * NotFoundResolver — the only screen that must NOT read as "excluded" (BACKLOG
 * ST-11, prototype §4.6). It renders ABOVE the table so the reader is never left
 * holding a negation with nothing beside it. It leads positive (the subject is
 * OUR matching, no negation), then
 * resolves to an action: all EIGHT categories as tappable chips in lobby order,
 * WRAPPED (never a horizontal scroller — a scroller hides members of a list that
 * must be complete), then a tip, then a help link to /tro-giup.
 *
 * NO chip carries a percentage (§3.1 — the rate lives only in the table). The
 * banned "games not in the list count 100%" banner appears in no wording. There
 * is no position:fixed / visualViewport machinery — keyboard occlusion is solved
 * by placement (the field scrolls to top, the chips sit directly beneath).
 * ==========================================================================*/

import Link from "next/link";
import { Pill } from "@/ui/Pill/Pill";
import { Icon } from "@/ui/Icon/Icon";
import { vi } from "@/lib/i18n";
import styles from "./NotFoundResolver.module.css";

export function NotFoundResolver({
  categories,
  onPick,
}: {
  /** all 8 categories in lobby order — {id, name}; NO rate is passed in */
  categories: { id: string; name: string }[];
  /** apply a category as the filter (and clear the search) */
  onPick: (id: string) => void;
}) {
  return (
    <section className={styles.resolver} aria-label={vi.contribution.notFoundTitle}>
      <p className={styles.title}>{vi.contribution.notFoundTitle}</p>
      <p className={styles.resolve}>{vi.contribution.notFoundResolve}</p>

      <div className={styles.chips}>
        {categories.map((cat) => (
          <Pill key={cat.id} onClick={() => onPick(cat.id)}>
            {cat.name}
          </Pill>
        ))}
      </div>

      <p className={styles.tip}>{vi.contribution.notFoundTip}</p>
      <Link href="/tro-giup" className={styles.help}>
        <span>{vi.contribution.notFoundHelp}</span>
        <Icon name="chevronRight" aria-hidden />
      </Link>
    </section>
  );
}
