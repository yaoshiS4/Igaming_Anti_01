/* ============================================================================
 * PartnerBand — provider / partner logo strip (SPEC-03 §home BrandShowcase).
 * A horizontally-scrolling row of provider logo SLOTS (token-gradient disc +
 * provider name until a licensed logo lands — Part 5). Decorative trust strip;
 * empty → omitted. No fabricated partner.
 * ==========================================================================*/

import type { Provider } from "@/lib/types";
import styles from "./PartnerBand.module.css";

export interface PartnerBandProps {
  providers: Provider[];
}

export function PartnerBand({ providers }: PartnerBandProps) {
  if (providers.length === 0) return null;

  return (
    <section className={styles.band} aria-label="Nhà cung cấp & đối tác">
      <h2 className={styles.title}>Nhà cung cấp</h2>
      {/* J9 fixed 128px chip grid — wraps to multiple rows (no horizontal scroll) */}
      <ul className={styles.row}>
        {providers.map((p) => (
          <li key={p.id} className={styles.item}>
            <span className={styles.logo} aria-hidden>
              {p.name.slice(0, 2).toUpperCase()}
            </span>
            <span className={styles.name}>{p.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
