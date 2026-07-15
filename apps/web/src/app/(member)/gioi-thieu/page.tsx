/* ============================================================================
 * Yaobet — GIỚI THIỆU / REFERRAL (route "/gioi-thieu") — SPEC-03 §referral.
 * ----------------------------------------------------------------------------
 * The J9 refer-page rebuild. A Server Component in the (member) route group:
 * fetches the referral fixtures server-side as typed values/§F envelopes (KPI
 * is real-or-omitted) and hands them to the referral bands. Mounts inside the
 * shared shell (root <AppShell>) and the (member) layout, which already renders
 * the MemberSidebar rail (the rail tile id 'referral' lights here) + the .column
 * content area — so this page is just the content column.
 *
 * J9-faithful composition (differs from /dai-ly — NO AgentTiers tier ladder):
 *   1. ReferralKpiHeader — reward-overview band (titled, 2 stats, §F real-or-omit)
 *   2. InviteTools       — referral-method panel (code + link + 2 copy chips +
 *                          white QR tile; auth-gated copy)
 *   3. CommissionPanel   — held-commission head row + details link, then the
 *                          earnings LIST only when commissions exist; when EMPTY
 *                          its EmptyState is SUPPRESSED (page-level) so the steps
 *                          below become the honest onboarding empty state.
 *   4. StepExplainer     — 4-card how-it-works grid; on /gioi-thieu it carries a
 *                          lead-in headline and IS the no-friends empty state.
 *
 * Truthful-only (Decree-174): guests get honest prompts + openAuthModal; the KPI
 * band is omitted when absent; no friends → the 4-step onboarding grid, never a
 * fabricated commission row.
 *
 * NOTE on render states: DEMO_EMPTY is currently false, so the DEFAULT render is
 * the LIVE state (KPI band + 2 masked rows). Flip DEMO_EMPTY to true to see the
 * J9-screenshot empty view (KPI omitted via absent→null + steps-only). Both are
 * correct by construction.
 * ==========================================================================*/

import { getReferral, getReferralKpi, getCommissions } from "@/lib/mock";
import {
  ReferralKpiHeader,
  InviteTools,
  CommissionPanel,
  StepExplainer,
} from "@/components/referral";
import styles from "./gioi-thieu.module.css";

export const metadata = {
  title: "Giới thiệu bạn bè — Yaobet",
};

export default async function ReferralPage() {
  const [referral, kpi, commissions] = await Promise.all([
    getReferral(),
    getReferralKpi(),
    getCommissions(),
  ]);

  const hasCommissions = commissions.length > 0;

  return (
    <div className={styles.page}>
      {/* J9 TOP ROW — reward overview (left) + referral method/QR (right) side
          by side, equal height; stacks on mobile. */}
      <div className={styles.topRow}>
        {/* reward overview — 4 KPIs (2×2), real-or-omitted (§F). KPI near-white. */}
        <ReferralKpiHeader kpi={kpi} />

        {/* referral method — code/link/copy + white QR tile (auth-gated copy) */}
        <InviteTools referral={referral} />
      </div>

      {/* earnings — held-commission head row + details link; the EmptyState is
          suppressed page-level (hideEmpty) so the steps below carry the empty
          onboarding state. Masked rows render only when commissions exist. */}
      <CommissionPanel commissions={commissions} hideEmpty showHeldRow />

      {/* how it works — the honest no-friends empty state with a lead-in intro
          line. Always rendered (also shown beneath the rows when they exist). */}
      <StepExplainer intro={!hasCommissions} />
    </div>
  );
}
