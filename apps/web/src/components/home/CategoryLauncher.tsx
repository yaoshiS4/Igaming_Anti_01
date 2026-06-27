/* ============================================================================
 * CategoryLauncher — mobile round-icon vertical launcher (SPEC-03 §home
 * CategoryLauncherInline / B10 inline presentation). The primary MOBILE
 * category entry on Home: a round-icon grid (Ø64 target + plain-VN label), one
 * tap per vertical. Hidden ≥768 where the desktop CategoryRail (Tier-2) takes
 * over (SPEC-03 B5/B10).
 *
 * Verticals are public game categories — NOT auth-gated; tapping routes to the
 * vertical. The same content also drives the pinned `Danh mục` CategorySheet in
 * the shell chrome (UT-3) — this is the inline twin.
 * ==========================================================================*/

import Link from "next/link";
import type { Vertical } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { Icon } from "@/ui";
import { verticalIcon } from "@/components/layout/_internal/verticalIcon";
import styles from "./CategoryLauncher.module.css";

export interface CategoryLauncherProps {
  verticals: Vertical[];
}

export function CategoryLauncher({ verticals }: CategoryLauncherProps) {
  if (verticals.length === 0) return null;

  return (
    <nav className={styles.launcher} aria-label={vi.nav.categories}>
      <ul className={styles.grid}>
        {verticals.map((v) => (
          <li key={v.id}>
            <Link href={v.href} className={styles.item}>
              <span className={styles.iconWrap} aria-hidden>
                <Icon name={verticalIcon(v.iconId)} size={26} />
              </span>
              <span className={styles.label}>{v.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
