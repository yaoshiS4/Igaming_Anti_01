/* ============================================================================
 * LiveGamesBand — the "live now" band (SPEC-03 §home): the truthful JackpotTicker
 * beside the LiveMatchCard. A Server Component that composes the two client
 * islands; each island self-omits when its §F envelope is absent/error, so this
 * band collapses gracefully (and renders nothing if BOTH are absent — never a
 * fabricated placeholder).
 * ==========================================================================*/

import type { Envelope, Jackpot, LiveMatch } from "@/lib/types";
import { JackpotTicker } from "./JackpotTicker";
import { LiveMatchCard } from "./LiveMatchCard";
import styles from "./LiveGamesBand.module.css";

export interface LiveGamesBandProps {
  jackpot: Envelope<Jackpot>;
  match: Envelope<LiveMatch>;
}

export function LiveGamesBand({ jackpot, match }: LiveGamesBandProps) {
  const showJackpot = jackpot.status !== "absent" && jackpot.status !== "error";
  const showMatch = match.status !== "absent" && match.status !== "error";
  if (!showJackpot && !showMatch) return null;

  return (
    <section className={styles.band} aria-label="Đang diễn ra">
      {showJackpot && (
        <div className={styles.jackpotCell}>
          <JackpotTicker jackpot={jackpot} />
        </div>
      )}
      {showMatch && (
        <div className={styles.matchCell}>
          <LiveMatchCard match={match} />
        </div>
      )}
    </section>
  );
}
