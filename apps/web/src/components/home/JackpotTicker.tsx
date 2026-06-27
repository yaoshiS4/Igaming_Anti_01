/* ============================================================================
 * JackpotTicker — home jackpot pool (SPEC-03 §home JackpotTicker [RG] + §F).
 * The structural Decree-174 guard in practice: the live pool figure renders
 * through the `Odometer` primitive, which MOUNTS ONLY on a server-issued
 * `LiveMoney` and runs a one-shot reel that STOPS at the server value (never
 * extrapolates past it — F4/F6).
 *
 * §F envelope states:
 *   loading → Skeleton in the figure footprint (F2) — never a "0"/last-known #.
 *   error   → for this non-critical decorative band the compliant fallback is
 *             OMISSION (F3) — the band is simply absent on failure.
 *   absent  → band OMITTED (no feed → never fabricated).
 *   live    → Odometer reel toward the real pool; stale → "tạm dừng" (handled
 *             inside Odometer/MoneyValue via freshnessMs).
 * reduced-motion → static final figure, no reel (F5, inside Odometer).
 * ==========================================================================*/

"use client";

import type { Envelope, Jackpot } from "@/lib/types";
import { Odometer, Skeleton } from "@/ui";
import styles from "./JackpotTicker.module.css";

export interface JackpotTickerProps {
  jackpot: Envelope<Jackpot>;
}

export function JackpotTicker({ jackpot }: JackpotTickerProps) {
  // absent / error → OMIT the band (non-critical decorative position, F3).
  if (jackpot.status === "absent" || jackpot.status === "error") return null;

  return (
    <div className={styles.ticker}>
      <span className={styles.label}>
        {jackpot.status === "live" ? jackpot.value.label : "Hũ vàng"}
      </span>
      {jackpot.status === "loading" ? (
        <Skeleton width="9ch" height="1.4em" className={styles.skel} />
      ) : (
        <Odometer
          value={jackpot.value.pool}
          freshnessMs={jackpot.freshnessMs}
          size="num-lg"
          className={styles.pool}
        />
      )}
    </div>
  );
}
