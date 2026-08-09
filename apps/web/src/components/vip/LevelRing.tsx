/* ============================================================================
 * Luxury VIP — LevelRing. SVG track + luxury-gold gradient arc + centered
 * "CẤP {level}" (small-caps word over a large Cinzel numeral). Arc length
 * reflects `percent` (wager progress toward the next tier).
 * ==========================================================================*/
import styles from "./LevelRing.module.css";

export function LevelRing({
  level,
  percent,
  size = 108,
  levelWord = "CẤP",
}: {
  level: number;
  percent: number;
  size?: number;
  /** i18n level word ("CẤP" / "LEVEL"). Optional; defaults to VI. */
  levelWord?: string;
}) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, percent)) / 100) * c;
  const mid = size / 2;

  return (
    <svg
      className={styles.ring}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${levelWord} ${level}`}
    >
      <defs>
        <linearGradient id="vipRingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" className={styles.gradStart} />
          <stop offset="52%" className={styles.gradMid} />
          <stop offset="100%" className={styles.gradEnd} />
        </linearGradient>
      </defs>

      <circle
        className={styles.track}
        cx={mid}
        cy={mid}
        r={r}
        strokeWidth={stroke}
      />
      <circle
        className={styles.arc}
        cx={mid}
        cy={mid}
        r={r}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${c}`}
        transform={`rotate(-90 ${mid} ${mid})`}
      />

      <text
        className={styles.word}
        x="50%"
        y="40%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.13}
      >
        {levelWord}
      </text>
      <text
        className={styles.num}
        x="50%"
        y="60%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.3}
      >
        {level}
      </text>
    </svg>
  );
}
