/* ============================================================================
 * FilterNotice — one inline strip, two variants (owner conventional-table
 * override). It NEVER takes over the page — the table frame below it stays
 * mounted (ui/ErrorState is a block surface and is deliberately NOT used here).
 * Variants:
 *   · "empty" — the active filter combo (no search) matched nothing; a neutral
 *     info strip with a "clear filters" reset. Never reads "excluded / banned".
 *   · "error" — the client search index failed to build; --caution (amber
 *     "attention", NOT a loss / not red) with a retry.
 * The icon is an aria-hidden <Icon> sibling, never a glyph baked into a string.
 * Carries no percentage, no banned string.
 * ==========================================================================*/

import { Icon } from "@/ui/Icon/Icon";
import { Button } from "@/ui/Button/Button";
import styles from "./FilterNotice.module.css";

export type FilterNoticeVariant = "empty" | "error";

export function FilterNotice({
  variant,
  message,
  action,
}: {
  variant: FilterNoticeVariant;
  message: string;
  /** optional reset (S-09) / retry (S-08) — a 44px ghost button */
  action?: { label: string; onClick: () => void };
}) {
  const isError = variant === "error";
  return (
    <div className={`${styles.notice} ${isError ? styles.error : ""}`.trim()}>
      <span className={styles.icon} aria-hidden="true">
        <Icon name={isError ? "warning" : "info"} />
      </span>
      <div className={styles.body}>
        <p className={styles.message}>{message}</p>
        {action && (
          <div className={styles.action}>
            <Button variant="ghost" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
