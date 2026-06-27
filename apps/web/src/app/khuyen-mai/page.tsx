/* ============================================================================
 * Yaobet — PROMOTIONS (route "/khuyen-mai") — SPEC-03 §promo, SPEC-04 Wave 7.3.
 * ----------------------------------------------------------------------------
 * A Server Component: it fetches the promo fixtures server-side (truthful, no
 * hardcoded %) and passes them to the band components. The page mounts inside
 * the shared shell (root layout's <AppShell>) — header + category nav + bottom
 * tab bar — so it needs no chrome of its own. Wide canvas (NOT the member rail).
 *
 * Bands: PromoHero (featured + real Countdown) → PromoGrid (category-filterable
 * card grid, image SLOTS, real-or-static countdowns, honest empty states). The
 * engagement layer (wheel/leaderboard/tasks) is NOT rendered — it is gated to
 * real-feed-only and Yaobet does not operate it at v1 (Wave 7.3 Done-When).
 * ==========================================================================*/

import { getPromos } from "@/lib/mock";
import { PromoHero, PromoGrid } from "@/components/promo";
import { vi } from "@/lib/i18n";
import styles from "./khuyen-mai.module.css";

export const metadata = {
  title: "Khuyến mãi — Yaobet",
};

export default async function PromotionsPage() {
  const promos = await getPromos();

  return (
    <div className={styles.page}>
      <PromoHero promos={promos} />

      <section className={styles.gridSection} aria-label={vi.nav.promo}>
        <h2 className={styles.heading}>Tất cả khuyến mãi</h2>
        <PromoGrid promos={promos} />
      </section>
    </div>
  );
}
