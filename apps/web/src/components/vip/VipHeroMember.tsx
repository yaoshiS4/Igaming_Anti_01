/* ============================================================================
 * Luxury VIP — VipHeroMember. Gold-tinted hero panel with radial glow:
 *   • LEFT  — SVG level ring ("CẤP {level}") + name (Cinzel) + tier pill w/ crown
 *   • RIGHT — points (gold Cinzel), no sub-metrics
 *   • ROW 2 — "Tiến độ cược lên hạng sau" + {pct}% (gold), gold progress bar
 *             with a knob, a next-tier chevron chip pinned at the end, and the
 *             "{pointsToNextTier} điểm để lên {nextTier}" caption.
 * ==========================================================================*/
import { getVipCopy, type CurrentUser, type Lang, type VipTierDef } from "@/lib/vip";
import { LevelRing } from "./LevelRing";
import styles from "./VipHeroMember.module.css";

export function VipHeroMember({
  user,
  tiers,
  lang,
}: {
  user: CurrentUser;
  tiers: VipTierDef[];
  lang: Lang;
}) {
  const copy = getVipCopy(lang);
  const tier = tiers[user.currentTierIndex];
  const nextTier = tiers[user.nextTierIndex];
  const tierName = copy[tier.nameKey];
  const nextName = nextTier ? copy[nextTier.nameKey] : "";

  const pct = Math.max(0, Math.min(100, user.wagerProgressPctToNextTier));

  return (
    <section className={styles.hero}>
      <div className={styles.top}>
        <div className={styles.identity}>
          <LevelRing
            level={user.currentLevel}
            percent={pct}
            levelWord={copy.levelWord}
          />
          <div className={styles.who}>
            <h1 className={styles.name}>{user.name}</h1>
            {/* SOLID tier accent — tier.grad is a 3-stop metallic gradient and
                the flat system bans gradients on chips/buttons/cards. tier.acc
                is the same tier's flat accent; --vip-gold-ink stays legible on
                every one of the five accents. */}
            <span
              className={styles.tierPill}
              style={{ background: tier.acc }}
            >
              <span className={styles.crown} aria-hidden>
                ♛
              </span>
              {tierName}
            </span>
          </div>
        </div>

        <div className={styles.points}>
          <div className={styles.pointsLabel}>{copy.statPoints}</div>
          <div className={styles.pointsValue}>
            {user.points.toLocaleString("en-US")}
          </div>
        </div>
      </div>

      {nextTier && (
        <div className={styles.progressBlock}>
          <div className={styles.progressHead}>
            <span className={styles.progressLabel}>{copy.progressLabel}</span>
            <span className={styles.progressPct}>{pct}%</span>
          </div>

          <div className={styles.trackRow}>
            <div
              className={styles.track}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={copy.progressLabel}
            >
              <div className={styles.fill} style={{ width: `${pct}%` }} />
              <span className={styles.knob} style={{ left: `${pct}%` }} />
            </div>

            <span
              className={styles.nextChip}
              style={{
                borderColor: `color-mix(in srgb, ${nextTier.acc} 55%, transparent)`,
                color: nextTier.acc,
              }}
            >
              {nextName}
              <span className={styles.chevron} aria-hidden>
                ›
              </span>
            </span>
          </div>

          <div className={styles.caption}>
            {user.pointsToNextTier.toLocaleString("en-US")}{" "}
            {copy.pointsToNextSuffix} {nextName}
          </div>
        </div>
      )}
    </section>
  );
}
