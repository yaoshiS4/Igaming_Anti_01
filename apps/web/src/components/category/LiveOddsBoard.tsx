/* ============================================================================
 * LiveOddsBoard — inline live-odds board for the sports/esports vertical
 * landing (SPEC-03 §home LiveMatchCard + §F dynamic-data contract). Bound to
 * the SAME truthful Envelope<LiveMatch> the home LiveMatchCard / SportsLifestyle
 * consume — so the truthful-only rule is structural (the island can only render
 * a figure the server handed it).
 *
 * §F state machine (binding):
 *   loading  → Skeleton in the figure footprint (never a placeholder "0").
 *   error    → ErrorState + retry (never a fabricated/stale number as live).
 *   absent   → the board is OMITTED entirely (returns null).
 *   live     → odds rows; phase shows a "TRỰC TIẾP" TEXT label (never color-only)
 *              and an equal-salience up/down GLYPH; past freshnessMs (>10s) the
 *              row shows the stale marker "tạm dừng" — last value never advanced.
 *
 * Odds are rendered via MoneyValue(kind="odds") for tabular alignment; an odds
 * value is a real figure and is NEVER digit-4-massaged.
 * ==========================================================================*/

"use client";

import { useRouter } from "next/navigation";
import type { Envelope, LiveMatch, OddsValue } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { isStale } from "@/lib/format";
import { Card, MoneyValue, Skeleton, ErrorState, Icon } from "@/ui";
import styles from "./LiveOddsBoard.module.css";

export interface LiveOddsBoardProps {
  odds: Envelope<LiveMatch>;
}

export function LiveOddsBoard({ odds }: LiveOddsBoardProps) {
  const router = useRouter();

  // absent → omit the band entirely (truthful posture; never fabricated).
  if (odds.status === "absent") return null;

  return (
    <section className={styles.section} aria-label="Tỷ lệ trực tiếp">
      <h2 className={styles.title}>Trận đấu trực tiếp</h2>

      {odds.status === "loading" && (
        <Card className={styles.board}>
          <Skeleton width="40%" height="1.4em" />
          <Skeleton width="100%" height="2.2em" className={styles.skelRow} />
          <Skeleton width="100%" height="2.2em" className={styles.skelRow} />
        </Card>
      )}

      {odds.status === "error" && (
        <Card className={styles.board}>
          <ErrorState
            message="Không tải được tỷ lệ trực tiếp."
            onRetry={() => router.refresh()}
          />
        </Card>
      )}

      {odds.status === "live" && <Board odds={odds} />}
    </section>
  );
}

function Board({
  odds,
}: {
  odds: Extract<Envelope<LiveMatch>, { status: "live" }>;
}) {
  const m = odds.value;
  const stale = isStale(odds.sourcedAt, odds.freshnessMs);

  return (
    <Card className={styles.board}>
      <div className={styles.head}>
        {m.phase === "live" ? (
          <span className={styles.liveTag}>
            <span className={styles.liveDot} aria-hidden />
            {/* TEXT label, never color-only (equal-salience compliance) */}
            {vi.state.live}
          </span>
        ) : (
          <span className={styles.preTag}>Sắp diễn ra</span>
        )}
      </div>

      <ul className={styles.rows}>
        <OddsRow name={m.home.name} odds={m.homeOdds} stale={stale} />
        <OddsRow name={m.away.name} odds={m.awayOdds} stale={stale} />
      </ul>
    </Card>
  );
}

function OddsRow({
  name,
  odds,
  stale,
}: {
  name: string;
  odds: OddsValue;
  stale: boolean;
}) {
  return (
    <li className={styles.row}>
      <span className={styles.team}>{name}</span>
      {stale ? (
        // past freshnessMs → explicit stale marker; value NOT advanced (F4)
        <span className={styles.stale}>{vi.state.stale.toLowerCase()}</span>
      ) : (
        <span className={styles.oddsVal} data-dir={odds.direction}>
          {odds.direction !== "flat" && (
            <Icon
              name={odds.direction === "up" ? "chevronRight" : "chevronDown"}
              size={14}
              className={odds.direction === "up" ? styles.up : styles.down}
              label={odds.direction === "up" ? "tăng" : "giảm"}
            />
          )}
          <MoneyValue value={{ amount: odds.value, currency: "VND" }} kind="odds" />
        </span>
      )}
    </li>
  );
}
