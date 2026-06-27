/* ============================================================================
 * RightRail — desktop right rail (SPEC-03 §home RightRail, [RG]). Appears only
 * ≥1240px (max-frame); below that the host page folds these figures inline at
 * their authored positions, so the rail simply renders nothing on mobile.
 *
 * Three truthful-bound surfaces, each governed by the §F dynamic-data contract:
 *   - member-day Countdown (Deadline envelope) — halts at the server deadline.
 *   - super-jackpot pool (Live<Jackpot>)       — the resting server value; no
 *     extrapolation past it.
 *   - opt-in leaderboard (Live<LeaderRow[]>)   — real ranks or omitted.
 * Per surface: loading → Skeleton (F2); error → honest ErrorState (F3); absent
 * → the card is OMITTED (never fabricated). If ALL three are absent the rail
 * renders nothing.
 * ==========================================================================*/

import type {
  DeadlineEnvelope,
  Envelope,
  Jackpot,
  LeaderRow,
} from "@/lib/types";
import { vi } from "@/lib/i18n";
import { formatVnd } from "@/lib/format";
import { Skeleton } from "@/ui/Skeleton/Skeleton";
import { Money } from "./_internal/Money";
import { Countdown } from "./_internal/Countdown";
import styles from "./RightRail.module.css";

export interface RightRailProps {
  memberDay: DeadlineEnvelope;
  jackpot: Envelope<Jackpot>;
  leaderboard: Envelope<LeaderRow[]>;
}

function ErrorLine() {
  return <p className={styles.errorLine}>{vi.state.error}</p>;
}

export function RightRail({ memberDay, jackpot, leaderboard }: RightRailProps) {
  const showMemberDay = memberDay.status !== "absent";
  const showJackpot = jackpot.status !== "absent";
  const showLeaderboard = leaderboard.status !== "absent";

  if (!showMemberDay && !showJackpot && !showLeaderboard) return null;

  return (
    <aside className={styles.rail} aria-label="Thông tin trực tiếp">
      {/* ---- member-day countdown ---- */}
      {showMemberDay && (
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Ngày hội viên</h3>
          {memberDay.status === "loading" && <Skeleton width="60%" height="1.6em" />}
          {memberDay.status === "error" && <ErrorLine />}
          {memberDay.status === "live" && <Countdown deadlineAt={memberDay.deadlineAt} />}
        </section>
      )}

      {/* ---- super-jackpot ---- */}
      {showJackpot && (
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>
            {jackpot.status === "live" ? jackpot.value.label : "Hũ vàng"}
          </h3>
          {jackpot.status === "loading" && <Skeleton width="80%" height="2em" />}
          {jackpot.status === "error" && <ErrorLine />}
          {jackpot.status === "live" && (
            <Money value={jackpot.value.pool} size="num-lg" className={styles.jackpot} />
          )}
        </section>
      )}

      {/* ---- opt-in leaderboard ---- */}
      {showLeaderboard && (
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Bảng xếp hạng</h3>
          {leaderboard.status === "loading" && (
            <>
              <Skeleton width="100%" height="1.4em" className={styles.row} />
              <Skeleton width="100%" height="1.4em" className={styles.row} />
              <Skeleton width="100%" height="1.4em" className={styles.row} />
            </>
          )}
          {leaderboard.status === "error" && <ErrorLine />}
          {leaderboard.status === "live" && (
            <ol className={styles.board}>
              {leaderboard.value.map((r) => (
                <li key={r.rank} className={styles.boardRow}>
                  <span className={styles.rank}>{r.rank}</span>
                  <span className={styles.player}>{r.displayName}</span>
                  <span className={styles.amount}>{formatVnd(r.amount)}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </aside>
  );
}
