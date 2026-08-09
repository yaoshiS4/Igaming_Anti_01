/* ============================================================================
 * Yaobet — LUXURY VIP program — root client island (FOUNDATION SCAFFOLD).
 * ----------------------------------------------------------------------------
 * Owns the shared runtime state (vipSel / vipLvl / lang) and the auth-driven
 * member↔guest split (useRequireAuth().allowed — NO member/guest toggle). Wires
 * tier selection so it drives BOTH the comparison target AND the level table
 * (criterion 3). Renders the STUB child components by direct path (the shared
 * components/vip/index.ts barrel is intentionally untouched — /tier depends on
 * it). Child stubs render placeholder text; the rest of the team fleshes them
 * out against these exact prop contracts.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import { useRequireAuth } from "@/lib/auth";
import {
  TIERS,
  CURRENT_USER,
  CUR,
  CUR_LEVEL,
  FAQ_ITEMS,
  getVipCopy,
  type Lang,
} from "@/lib/vip";
import { VipSectionHeading } from "./VipSectionHeading";
import { VipHeroMember } from "./VipHeroMember";
import { VipHeroGuest } from "./VipHeroGuest";
import { TierDeck } from "./TierDeck";
import { PrivilegeComparison } from "./PrivilegeComparison";
import { PrivilegeMatrix } from "./PrivilegeMatrix";
import { LevelTable } from "./LevelTable";
import { VipFaq } from "./VipFaq";
import styles from "./VipProgram.module.css";

export function VipProgram() {
  const { allowed, promptAuth } = useRequireAuth();

  const [vipSel, setVipSel] = useState<number>(CUR); // default Gold
  const [vipLvl, setVipLvl] = useState<number>(Math.min(CUR_LEVEL + 1, 10));
  const [lang, setLang] = useState<Lang>("vi");

  const copy = getVipCopy(lang);

  /** Selecting a tier: set target + reset the level cursor (criterion 3). */
  const onSelect = (i: number) => {
    setVipSel(i);
    setVipLvl(i === CUR ? Math.min(CUR_LEVEL + 1, 10) : 1);
  };

  return (
    <div className={styles.vipPalette}>
      <div className={styles.inner}>
        {/* deferrable VI/EN toggle (criterion 8 — a lang state is required) */}
        <div className={styles.langToggle} role="group" aria-label="Language">
          {(["vi", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              className={`${styles.langBtn} ${
                lang === l ? styles.langBtnActive : ""
              }`}
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* hero — auth drives the variant, not a toggle */}
        {allowed ? (
          <VipHeroMember user={CURRENT_USER} tiers={TIERS} lang={lang} />
        ) : (
          <VipHeroGuest
            lang={lang}
            onRegister={() => promptAuth()}
            onLogin={() => promptAuth()}
          />
        )}

        {/* tier deck (both variants) */}
        <section className={styles.section}>
          <VipSectionHeading>{copy.allTiers}</VipSectionHeading>
          <TierDeck
            tiers={TIERS}
            selected={vipSel}
            onSelect={onSelect}
            currentTierIndex={allowed ? CUR : null}
            lang={lang}
          />
        </section>

        {/* privileges — comparison (member) vs matrix (guest) */}
        {allowed ? (
          <section className={styles.section}>
            <VipSectionHeading>{copy.tierSectionTitle}</VipSectionHeading>
            <PrivilegeComparison
              tiers={TIERS}
              selected={vipSel}
              currentTierIndex={CUR}
              currentLevel={CUR_LEVEL}
              lang={lang}
            />
          </section>
        ) : (
          <section className={styles.section}>
            <VipSectionHeading>{copy.tierMatrixTitle}</VipSectionHeading>
            <PrivilegeMatrix tiers={TIERS} selected={vipSel} lang={lang} />
          </section>
        )}

        {/* level table — driven by the selected tier + level cursor */}
        <section className={styles.section}>
          <VipSectionHeading>{copy.lvlSectionTitle}</VipSectionHeading>
          <LevelTable
            tier={TIERS[vipSel]}
            selectedTierIndex={vipSel}
            currentTierIndex={allowed ? CUR : null}
            currentLevel={allowed ? CUR_LEVEL : null}
            lang={lang}
          />
          {/* vipLvl is consumed by the fleshed-out table/comparison; referenced
              here so the scaffold state is wired end-to-end. */}
          <span hidden aria-hidden>
            {vipLvl}
          </span>
        </section>

        {/* FAQ (both variants) */}
        <section className={styles.section}>
          <VipSectionHeading>{copy.faqTitle}</VipSectionHeading>
          <VipFaq items={FAQ_ITEMS} lang={lang} />
        </section>
      </div>
    </div>
  );
}
