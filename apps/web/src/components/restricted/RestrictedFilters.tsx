/* ============================================================================
 * RestrictedFilters — the header IA for the bonus-restricted list
 * (/game-han-che). A PRIMARY full-width search on top; a SECONDARY bar with TWO
 * dropdown filters (category · provider) that COMBINE (AND) with search. There
 * is NO rate-% pill group here — this page has no rate.
 *
 * It owns NO business logic — the island owns state; this renders controls +
 * forwards. The SearchField (and its diacritic fold) is reused verbatim from the
 * contribution feature; the dropdown pattern mirrors RateFilters' SelectFilter.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import { Dropdown } from "@/ui/Dropdown/Dropdown";
import { Icon } from "@/ui/Icon/Icon";
import { vi } from "@/lib/i18n";
import { SearchField } from "@/components/contribution";
import styles from "./RestrictedFilters.module.css";

interface Option {
  value: string;
  label: string;
}

/** One dropdown filter (category / provider) — a labelled trigger + a radio
 *  menu. Self-contained open-state; ui/Dropdown owns the a11y (focus-trap, Esc,
 *  outside-click, aria-expanded). Mirrors RateFilters' SelectFilter. */
function SelectFilter({
  small,
  panelLabel,
  value,
  options,
  onPick,
}: {
  small: string;
  panelLabel: string;
  value: string;
  options: Option[];
  onPick: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current =
    options.find((o) => o.value === value)?.label ?? options[0]?.label ?? "";

  return (
    <div className={styles.selectWrap}>
      <Dropdown
        open={open}
        onOpenChange={setOpen}
        label={panelLabel}
        placement="bottom-start"
        trigger={
          <button type="button" className={styles.trigger}>
            <span className={styles.triggerLabel}>{small}</span>
            <span className={styles.triggerValue}>{current}</span>
            <Icon name="chevronDown" aria-hidden className={styles.chevron} />
          </button>
        }
      >
        <ul className={styles.menu}>
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  className={`${styles.option} ${selected ? styles.optionOn : ""}`.trim()}
                  onClick={() => {
                    onPick(opt.value);
                    setOpen(false);
                  }}
                >
                  <span>{opt.label}</span>
                  {selected && <Icon name="check" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      </Dropdown>
    </div>
  );
}

export function RestrictedFilters({
  categories,
  providers,
  categoryId,
  provider,
  rawQuery,
  offline,
  onQueryChange,
  onCommit,
  onCategory,
  onProvider,
}: {
  /** categories present among restricted games, in taxonomy order — {id, name} */
  categories: { id: string; name: string }[];
  /** provider names derived from the restricted games */
  providers: string[];
  categoryId: string;
  provider: string;
  rawQuery: string;
  offline: boolean;
  onQueryChange: (raw: string) => void;
  onCommit: (folded: string) => void;
  onCategory: (id: string) => void;
  onProvider: (name: string) => void;
}) {
  const categoryOptions: Option[] = [
    { value: "all", label: vi.contribution.filterAll },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];
  const providerOptions: Option[] = [
    { value: "all", label: vi.contribution.providerAll },
    ...providers.map((p) => ({ value: p, label: p })),
  ];

  return (
    <div className={styles.filters}>
      {/* PRIMARY — full-width search (reused verbatim, folds + debounces) */}
      <div className={styles.searchWrap}>
        <SearchField
          value={rawQuery}
          onChange={onQueryChange}
          onCommit={onCommit}
          offline={offline}
        />
      </div>

      {/* SECONDARY — the two filters (stack <768, row/wrap ≥768). No rate pills. */}
      <div className={styles.filterBar}>
        <SelectFilter
          small={vi.contribution.categoryFilterLabel}
          panelLabel={vi.contribution.filterCategoryLabel}
          value={categoryId}
          options={categoryOptions}
          onPick={onCategory}
        />
        <SelectFilter
          small={vi.contribution.providerLabel}
          panelLabel={vi.contribution.providerLabel}
          value={provider}
          options={providerOptions}
          onPick={onProvider}
        />
      </div>
    </div>
  );
}
