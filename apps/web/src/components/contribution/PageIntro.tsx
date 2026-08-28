/* ============================================================================
 * PageIntro — the h1 + a per-game lifted lead + the "how to read" line + a single
 * plain-language caveats paragraph (owner override, decisions/2026-08-11: the old
 * bordered "Cần biết" fence block is GONE — no box, no heading, no label-dash
 * grid, just muted sentences). The one inline link inside the caveats points at
 * the Game-hạn-chế tab of THIS page (/cuoc-hop-le?tab=han-che).
 * Server-safe, no props: reads the i18n catalog only. NO accordion, NO hero,
 * NO CTA, NO /vip link, NO percentage. The h1 uses --brand-font-body (NEVER
 * --brand-font-display — Cinzel is the /vip warm zone).
 * ==========================================================================*/

import Link from "next/link";
import { vi } from "@/lib/i18n";
import styles from "./PageIntro.module.css";

export function PageIntro() {
  /* The caveats paragraph carries ONE inline link: split its text around the
   * exact link phrase so the phrase renders as a next/link to the restricted tab.
   * If the phrase is ever absent, split returns the whole string as [before] and
   * the link simply does not render (graceful). */
  const [caveatsBefore, caveatsAfter = ""] = vi.contribution.caveats.split(
    vi.contribution.fencePromoLinkText,
  );
  const hasPromoLink =
    caveatsAfter !== "" || caveatsBefore !== vi.contribution.caveats;

  return (
    <header className={styles.intro}>
      <h1 className={styles.title}>{vi.contribution.title}</h1>
      <p className={styles.lead}>{vi.contribution.lead}</p>
      <p className={styles.howToRead}>{vi.contribution.howToRead}</p>

      <p className={styles.caveats}>
        {hasPromoLink ? (
          <>
            {caveatsBefore}
            <Link href="/cuoc-hop-le?tab=han-che" className={styles.caveatLink}>
              {vi.contribution.fencePromoLinkText}
            </Link>
            {caveatsAfter}
          </>
        ) : (
          vi.contribution.caveats
        )}
      </p>
    </header>
  );
}
