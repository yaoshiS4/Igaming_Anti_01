/* ============================================================================
 * Pager — the client-side numbered pager over the per-game rows (owner
 * conventional-table override, decisions/2026-08-10). It REPLACES the old
 * "Xem thêm / Xem tất cả" progressive-reveal controls. It owns no data: the
 * island computes the filtered rows + the page count and slices the current
 * page; this component only renders the control and forwards a page request.
 *
 *   · a labelled <nav> (aria-label) wrapping Prev / numbered pages / Next.
 *   · aria-current="page" on the active page button; a disabled Prev at page 1
 *     and a disabled Next at the last page (unfocusable, unclickable).
 *   · ellipsis (…) collapses long ranges to first · current±1 · last.
 *   · pages are NOT deep-linkable (no ?page= URL param) — page state lives in the
 *     island only, which limits scrape-addressability per the decision doc.
 * Renders nothing when there is a single page (or none).
 * ==========================================================================*/

"use client";

import { Icon } from "@/ui/Icon/Icon";
import { t, vi } from "@/lib/i18n";
import styles from "./Pager.module.css";

/** The visible page-token list: always page 1, the last page and the current
 *  page ±1; any gap between kept pages collapses to one "ellipsis" token. Pure. */
export function pageTokens(
  page: number,
  pageCount: number,
): (number | "ellipsis")[] {
  const wanted = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const shown = [...wanted]
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of shown) {
    if (p - prev > 1) out.push("ellipsis");
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pager({
  page,
  pageCount,
  onPage,
}: {
  /** the active 1-based page */
  page: number;
  /** total pages (rows / pageSize, ceil) */
  pageCount: number;
  /** request a page change (island clamps + re-slices) */
  onPage: (n: number) => void;
}) {
  if (pageCount <= 1) return null;
  const tokens = pageTokens(page, pageCount);
  const atFirst = page <= 1;
  const atLast = page >= pageCount;

  return (
    <nav className={styles.pager} aria-label={vi.contribution.pagerLabel}>
      <button
        type="button"
        className={styles.step}
        onClick={() => onPage(page - 1)}
        disabled={atFirst}
        aria-label={vi.contribution.pagerPrev}
      >
        <Icon name="chevronLeft" aria-hidden />
      </button>

      <ol className={styles.pages}>
        {tokens.map((tok, i) =>
          tok === "ellipsis" ? (
            <li key={`gap-${i}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={tok}>
              <button
                type="button"
                className={`${styles.page} ${tok === page ? styles.pageOn : ""}`.trim()}
                onClick={() => onPage(tok)}
                aria-label={t(vi.contribution.pagerPage, { n: tok })}
                aria-current={tok === page ? "page" : undefined}
              >
                {tok}
              </button>
            </li>
          ),
        )}
      </ol>

      <button
        type="button"
        className={styles.step}
        onClick={() => onPage(page + 1)}
        disabled={atLast}
        aria-label={vi.contribution.pagerNext}
      >
        <Icon name="chevronRight" aria-hidden />
      </button>
    </nav>
  );
}
