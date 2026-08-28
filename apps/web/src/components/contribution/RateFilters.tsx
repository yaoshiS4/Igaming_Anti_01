/* ============================================================================
 * RateFilters — the header IA for the conventional table (owner override,
 * decisions/2026-08-10). Category is NO LONGER a primary nav band; it is one of
 * three secondary filters under a PRIMARY, full-width search. This component owns
 * NO business logic — the island owns state; it renders controls + forwards.
 *
 *   1. PRIMARY — SearchField, full-width, on top (ST-05; folds + debounces +
 *      IME-guards a query upward).
 *   2. SECONDARY — a filter bar with THREE filters that COMBINE (AND) with search
 *      and each other:
 *        · category  — a ui/Dropdown (Tất cả + the 8 categories in lobby order).
 *        · provider  — a ui/Dropdown (options DERIVED from the catalogue).
 *        · rate-%    — a segmented ui/Pill group (Tất cả · 100% · Một phần ·
 *          Không tính) in a role="group"; the active pill carries aria-pressed
 *          (Pill sets it from `active`). It filters rows by their category's rate
 *          bucket — the isolate-0% ("Không tính") bucket is an accepted tradeoff.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import { Pill } from "@/ui/Pill/Pill";
import { Dropdown } from "@/ui/Dropdown/Dropdown";
import { Icon } from "@/ui/Icon/Icon";
import type { RateBucket } from "@/lib/mock";
import { vi } from "@/lib/i18n";
import { SearchField } from "./SearchField";
import styles from "./RateFilters.module.css";

/** the rate-bucket filter value: a real bucket or the "all" pass-through */
export type BucketValue = RateBucket | "all";

interface Option {
  value: string;
  label: string;
}

/** One dropdown filter (category / provider) — a labelled trigger + a radio
 *  menu. Self-contained open-state; ui/Dropdown owns the a11y (focus-trap, Esc,
 *  outside-click, aria-expanded). */
function SelectFilter({
  small,
  panelLabel,
  value,
  options,
  onPick,
}: {
  /** the muted label baked into the trigger */
  small: string;
  /** accessible label for the popover panel */
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

export function RateFilters({
  categories,
  providers,
  categoryId,
  provider,
  bucket,
  rawQuery,
  offline,
  onQueryChange,
  onCommit,
  onCategory,
  onProvider,
  onBucket,
}: {
  /** the 8 categories in LOBBY order — {id, name} */
  categories: { id: string; name: string }[];
  /** provider names derived from the catalogue */
  providers: string[];
  categoryId: string;
  provider: string;
  bucket: BucketValue;
  rawQuery: string;
  offline: boolean;
  onQueryChange: (raw: string) => void;
  onCommit: (folded: string) => void;
  onCategory: (id: string) => void;
  onProvider: (name: string) => void;
  onBucket: (b: BucketValue) => void;
}) {
  const categoryOptions: Option[] = [
    { value: "all", label: vi.contribution.filterAll },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];
  const providerOptions: Option[] = [
    { value: "all", label: vi.contribution.providerAll },
    ...providers.map((p) => ({ value: p, label: p })),
  ];
  const buckets: { value: BucketValue; label: string }[] = [
    { value: "all", label: vi.contribution.bucketAll },
    { value: "full", label: vi.contribution.bucketFull },
    { value: "partial", label: vi.contribution.bucketPartial },
    { value: "none", label: vi.contribution.bucketNone },
  ];

  return (
    <div className={styles.filters}>
      {/* PRIMARY — full-width search */}
      <div className={styles.searchWrap}>
        <SearchField
          value={rawQuery}
          onChange={onQueryChange}
          onCommit={onCommit}
          offline={offline}
        />
      </div>

      {/* SECONDARY — the three filters (stack <768, row/wrap ≥768) */}
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

        {/* rate-% quick filter — a segmented Pill group; active = aria-pressed */}
        <div
          className={styles.bucketWrap}
          role="group"
          aria-label={vi.contribution.bucketGroupLabel}
        >
          {buckets.map((b) => (
            <Pill
              key={b.value}
              active={bucket === b.value}
              onClick={() => onBucket(b.value)}
            >
              {b.label}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
}
