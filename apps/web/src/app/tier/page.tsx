/* ============================================================================
 * Yaobet — Tier ladder detail page (route "/tier") — SPEC-03 §vip, SPEC-04
 * Wave 6.1 (the ladder-detail companion to /vip).
 * ----------------------------------------------------------------------------
 * The whale-aspiration deep-dive on the bậc-thang: every tier laid out in full
 * (badge SLOT + level + name + %-of-play rate + the per-tier perk list), the
 * full privilege matrix (frozen-first-column scroll @375), the perk gallery,
 * and the upgrade/rebate rules. Truthful throughout — rates are VIP-BRD fixture
 * marketing copy, never a fabricated ledger figure; the current-tier card's
 * turnover-to-next-tier is §F-gated (Live | loading | error | absent).
 *
 * A Server Component fetching the fixtures + the §F progress envelope; the shell
 * is mounted ONCE by the root layout. Auth-aware via useAuth inside the client
 * feature components (member tier highlight / guest join-prompt).
 * ==========================================================================*/

import Link from "next/link";
import { getVipTiers, getPerks, getVipProgress } from "@/lib/mock";
import { Icon } from "@/ui";
import {
  CurrentTierCard,
  TierLadder,
  PrivilegeTable,
  PerkGallery,
  VipRules,
  VipSection,
  vipCopy,
} from "@/components/vip";
import styles from "@/components/vip/VipPage.module.css";

export default async function TierPage() {
  const [tiers, perks, progress] = await Promise.all([
    getVipTiers(),
    getPerks(),
    getVipProgress(),
  ]);

  return (
    <div className={styles.page}>
      <Link href="/vip" className={styles.backLink}>
        <Icon name="chevronLeft" size={16} /> {vipCopy.backToVip}
      </Link>

      {/* intro */}
      <header className={styles.intro}>
        <h1 className={styles.pageTitle}>
          <Icon name="trophy" size={26} className={styles.titleIcon} />
          {vipCopy.ladderHeading}
        </h1>
        <p className={styles.introCopy}>{vipCopy.pageIntro}</p>
      </header>

      {/* current-tier card — §F-gated turnover-to-next-tier */}
      <CurrentTierCard tiers={tiers} progress={progress} />

      {/* the full ladder (non-compact: shows per-tier perk lines) */}
      <VipSection title={vipCopy.ladderHeading} icon="vip">
        <TierLadder tiers={tiers} />
      </VipSection>

      {/* full privilege matrix */}
      <VipSection title={vipCopy.privilegeHeading} icon="grid">
        <PrivilegeTable tiers={tiers} />
      </VipSection>

      {/* perks */}
      <VipSection title={vipCopy.perksHeading} icon="gift">
        <PerkGallery perks={perks} />
      </VipSection>

      {/* rules */}
      <VipSection title={vipCopy.rulesHeading} icon="info">
        <VipRules />
      </VipSection>
    </div>
  );
}
