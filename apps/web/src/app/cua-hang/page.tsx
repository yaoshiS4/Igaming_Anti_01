/* ============================================================================
 * Yaobet — POINTS STORE (route "/cua-hang") — SPEC-03 §store, SPEC-04 Wave 7.1.
 * ----------------------------------------------------------------------------
 * A Server Component: fetches the points balance + product catalog server-side
 * (truthful fixtures) and passes them to the store bands. Mounts inside the
 * shared shell (root <AppShell>) — header + category nav + bottom tab bar.
 *
 * Bands: PointsHeader (redeemable points, count kind) → ProductGrid (image
 * SLOTS, points price, redeemed-count, optional REAL countdown, lazy redeem
 * dialog). Guest taps on redeem route through openAuthModal; honest empty when
 * the catalog is empty. Desktop 4-up → @375 2-up grid.
 * ==========================================================================*/

import { getProducts, getPointsBalance } from "@/lib/mock";
import { PointsHeader, ProductGrid } from "@/components/store";
import styles from "./cua-hang.module.css";

export const metadata = {
  title: "Cửa hàng điểm — Yaobet",
};

export default async function StorePage() {
  const [products, points] = await Promise.all([
    getProducts(),
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
    </div>
  );
}
