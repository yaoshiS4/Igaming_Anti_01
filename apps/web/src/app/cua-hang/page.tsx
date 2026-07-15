/* ============================================================================
 * Yaobet — POINTS STORE (route "/cua-hang") — plan §2 tree · task G13.
 * ----------------------------------------------------------------------------
 * A Server Component: fetches the points balance + product catalog server-side
 * (truthful MOCK fixtures) and passes them to the store bands. Mounts inside the
 * shared shell (root <AppShell>) — header + category nav + bottom tab bar.
 *
 * Bands: PointsHeader (redeemable points, count kind) → ProductGrid (a client
 * island: image SLOTS, the restart-cooldown escalation summary per card, and a
 * lazy claim-decision RedeemDialog). Each Product carries the full plan §1.1
 * shape (face / basePoints / repeatFraction / cooldown / maxSteps / per-user
 * runtime row); the escalation math lives in lib/store/escalation.ts and the
 * grid owns loading · error(onRetry) · empty · populated. A guest tap on a
 * card CTA routes through the auth modal; honest empty when the catalog is empty.
 * ==========================================================================*/

import { getProducts, getPointsBalance } from "@/lib/mock";
import type { Product } from "@/lib/types";
import { PointsHeader, ProductGrid, StoreTerms } from "@/components/store";
import styles from "./cua-hang.module.css";

export const metadata = {
  title: "Cửa hàng điểm — Yaobet",
};

export default async function StorePage() {
  // The RSC fetch is kept (server-first). A catalog-fetch failure does not crash
  // the route: the island is seeded empty and owns the error/retry surface.
  const [products, points] = await Promise.all([
    getProducts().catch((): Product[] => []),
    getPointsBalance(),
  ]);

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Cửa hàng điểm</h1>
      <PointsHeader points={points} />
      <section className={styles.catalog} aria-label="Danh sách quà đổi điểm">
        <h2 className={styles.subheading}>Quà đổi điểm</h2>
        <ProductGrid products={products} points={points} />
      </section>
      <StoreTerms />
    </div>
  );
}
