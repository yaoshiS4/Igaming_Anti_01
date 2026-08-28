/* ============================================================================
 * RestrictedIntro — the h1 + lead + the load-bearing "Lưu ý" note for the
 * bonus-restricted games list (/game-han-che). Sibling of the contribution
 * PageIntro but there is NO "Cần biết" fence block and NO rate copy — this page
 * publishes ONE list, not a rate table.
 *
 * The note is compliance-critical: it states the list applies ONLY inside a
 * promotion and that the games are otherwise played normally (it prevents the
 * "I can never play these" misread). Server-safe, no props: reads i18n only. The
 * h1 uses --brand-font-body (never the Cinzel display face — that is the /vip
 * warm zone).
 * ==========================================================================*/

import { vi } from "@/lib/i18n";
import styles from "./RestrictedIntro.module.css";

export function RestrictedIntro() {
  return (
    <header className={styles.intro}>
      <h1 className={styles.title}>{vi.restricted.title}</h1>
      <p className={styles.lead}>{vi.restricted.lead}</p>

      <p className={styles.note}>
        <b className={styles.noteLabel}>{vi.restricted.noteLabel}</b>
        {" — "}
        {vi.restricted.note}
      </p>
    </header>
  );
}
