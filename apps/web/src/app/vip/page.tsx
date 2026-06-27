/* ============================================================================
 * Yaobet — VIP page (route "/vip") — SPEC-03 §vip, SPEC-04 Wave 6.1.
 * ----------------------------------------------------------------------------
 * A Server Component: it fetches the VIP fixtures server-side (tiers, perks)
 * AND the turnover-to-next-tier as a typed §F envelope (Live<VipProgress> |
 * loading | error | absent), then passes them as props to the client feature
 * components. The progress NUMBER is gated behind that envelope — there is no
 * code path that prints a turnover figure the server did not hand us
 * (Decree-174 truthful-only; SPEC-03 §F). Economics are Yaobet-canonical
 * (VIP-BRD %-of-play rates), NOT J9's 0.40–1.00%.
 *
 * The shell (two-tier Header + CategoryRail/Sheet + BottomTabBar + AuthModal)
 * is mounted ONCE by the root layout; this page is the swapped content column.
 * Auth-aware differences (guest join-prompt vs member tier/progress) resolve
 * inside the client components via useAuth.
 *
 * Section order (mobile-first @375 → desktop):
 *   intro → current-tier card (the §F centerpiece) → tier ladder →
 *   privilege table (frozen-first-column scroll @375) → perks → rules.
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

export default async function VipPage() {
  // server-side truthful fetches (§F). The real-API swap replaces these bodies.
  const [tiers, perks, progress] = await Promise.all([
    getVipTiers(),
    getPerks(),
    getVipProgress(),
  ]);

  return (
    <div className={styles.page}>
      {/* intro */}
      <header className={styles.intro}>
        <h1 className={styles.pageTitle}>
          <Icon name="vip" size={26} className={styles.titleIcon} />
          {vipCopy.pageTitle}
        </h1>
        <p className={styles.introCopy}>{vipCopy.pageIntro}</p>
      </header>

      {/* current-tier card — the auth-aware, §F-gated centerpiece */}
      <CurrentTierCard tiers={tiers} progress={progress} />

      {/* tier ladder */}
      <VipSection
        title={vipCopy.ladderHeading}
        icon="trophy"
        action={
          <Link href="/tier" className={styles.detailLink}>
            {vipCopy.detailLink} <Icon name="chevronRight" size={16} />
          </Link>
        }
      >
        <TierLadder tiers={tiers} />
      </VipSection>

      {/* wide privilege table — frozen first column @375 (Scroller) */}
      <VipSection title={vipCopy.privilegeHeading} icon="grid">
        <PrivilegeTable tiers={tiers} />
      </VipSection>

      {/* perks */}
      <VipSection title={vipCopy.perksHeading} icon="gift">
        <PerkGallery perks={perks} />
      </VipSection>

      {/* upgrade + rebate rules */}
      <VipSection title={vipCopy.rulesHeading} icon="info">
        <VipRules />
      </VipSection>
    </div>
  );
}
