/* ============================================================================
 * Luxury VIP — VipHeroGuest (STUB). Badge + H1 + sub + two CTAs. NO stat
 * numbers. onRegister/onLogin surface the auth modal (wired by the parent).
 * ==========================================================================*/
import { getVipCopy, type Lang } from "@/lib/vip";
import styles from "./VipHeroGuest.module.css";

export function VipHeroGuest({
  lang,
  onRegister,
  onLogin,
}: {
  lang: Lang;
  onRegister: () => void;
  onLogin: () => void;
}) {
  const copy = getVipCopy(lang);

  return (
    <section className={styles.hero}>
      <span className={styles.badge}>
        <span className={styles.badgeGem} aria-hidden />
        {copy.guestBadge}
      </span>
      <h1 className={styles.title}>{copy.guestH1}</h1>
      <p className={styles.sub}>{copy.guestSub}</p>
      <div className={styles.ctas}>
        <button type="button" className={styles.ctaPrimary} onClick={onRegister}>
          {copy.ctaRegister}
        </button>
        <button type="button" className={styles.ctaGhost} onClick={onLogin}>
          {copy.ctaLogin}
        </button>
      </div>
    </section>
  );
}
