/* ============================================================================
 * LiveMatchCard — home live-match tile (SPEC-03 §home LiveMatchCard [RG] + §F).
 * Crest SLOTS + team names + decimal odds + live state. The "live" state is a
 * TRỰC TIẾP *text* label (never color-only — RG), and the up/down odds movement
 * is shown with EQUAL salience (an arrow glyph + the win/loss luminance-matched
 * pair, loss never dimmer). Past its >10s freshness window the odds render the
 * explicit "tạm dừng" stale marker rather than a silently-stale live figure
 * (F4) — delegated to MoneyValue via freshnessMs.
 *
 * §F: loading → Skeleton; error → omit (non-critical); absent → omit; live/pre
 * → render. Tapping routes to the sports vertical (gated for guests upstream is
 * not required — viewing odds is public; placing a bet is gated on the bet
 * surface).
 * ==========================================================================*/

"use client";

import type { Envelope, LiveMatch, OddsValue } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { isStale } from "@/lib/format";
import { Card, MoneyValue, Skeleton, Icon } from "@/ui";
import styles from "./LiveMatchCard.module.css";

export interface LiveMatchCardProps {
  match: Envelope<LiveMatch>;
}

/** Equal-salience odds cell — an up/down arrow GLYPH (never color-only) on the
 *  luminance-matched win/loss pair, loss never dimmer. Past the envelope's
 *  freshness window the figure shows the explicit "tạm dừng" stale marker (F4)
 *  instead of a silently-stale live odd. */
function OddsCell({ odds, stale }: { odds: OddsValue; stale: boolean }) {
  if (stale) {
    return (
      <span className={styles.oddsCell}>
        <span className={styles.stale} title="Giá trị tạm dừng cập nhật">
          {vi.state.stale.toLowerCase()}
        </span>
      </span>
    );
  }
  const dir = odds.direction;
  return (
    <span className={styles.oddsCell} data-dir={dir}>
      {dir !== "flat" && (
        <Icon
          name={dir === "up" ? "chevronRight" : "chevronDown"}
          size={14}
          className={dir === "up" ? styles.arrowUp : styles.arrowDown}
          label={dir === "up" ? "tăng" : "giảm"}
        />
      )}
      <MoneyValue
        value={{ amount: odds.value, currency: "VND" }}
        kind="odds"
        size="num"
      />
    </span>
  );
}

export function LiveMatchCard({ match }: LiveMatchCardProps) {
  if (match.status === "absent" || match.status === "error") return null;

  if (match.status === "loading") {
    return (
      <Card variant="default" className={styles.card}>
        <Skeleton width="40%" height="1em" />
        <Skeleton width="100%" height="2.4em" className={styles.skelRow} />
      </Card>
    );
  }

  const m = match.value;
  // odds past their freshness window render the explicit stale marker (F4).
  const stale = isStale(match.sourcedAt, match.freshnessMs);

  return (
    <Card variant="default" href="/?v=sports" interactive className={styles.card} aria-label={`${m.home.name} vs ${m.away.name}`}>
      <div className={styles.head}>
        {m.phase === "live" ? (
          <span className={styles.live}>
            <span className={styles.liveDot} aria-hidden />
            {vi.state.live}
          </span>
        ) : (
          <span className={styles.pre}>Sắp diễn ra</span>
        )}
        <Icon name="sports" size={16} className={styles.sportIcon} />
      </div>

      <div className={styles.body}>
        <div className={styles.team}>
          <span className={styles.crest} aria-hidden />
          <span className={styles.teamName}>{m.home.name}</span>
          <OddsCell odds={m.homeOdds} stale={stale} />
        </div>
        <div className={styles.team}>
          <span className={styles.crest} aria-hidden />
          <span className={styles.teamName}>{m.away.name}</span>
          <OddsCell odds={m.awayOdds} stale={stale} />
        </div>
      </div>
    </Card>
  );
}
