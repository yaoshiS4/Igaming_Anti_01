/* ============================================================================
 * StepExplainer — 4-step "how it works" grid (SPEC-03 §referral StepExplainer;
 * Wave 7.2). Static, truthful copy only (no fabricated bonus %). J9 .step_box:
 * a 2-col grid (centered, fit-content) of image-over-caption cards; single
 * column @375. Server-rendered. Shared by /dai-ly AND /gioi-thieu.
 *
 * On /gioi-thieu this grid IS the honest no-friends onboarding empty state, so
 * an optional `intro` prop (default OFF → /dai-ly unaffected) renders a lead-in
 * headline above it. We own no J9 banner PNGs, so each card is ICON-LED (our own
 * Icon over a token tile) — commissioning real Vietnamese banners is a later
 * asset task; the icon tile is the honest placeholder for that art.
 * ==========================================================================*/

import { Icon, type IconName } from "@/ui";
import { vi } from "@/lib/i18n";
import styles from "./StepExplainer.module.css";

const t = vi.referral;

interface Step {
  icon: IconName;
  body: string;
}

/* The J9 refer-page flow: send → register → play → receive commission. */
const STEPS: Step[] = [
  { icon: "copy", body: t.step1 },
  { icon: "user", body: t.step2 },
  { icon: "referral", body: t.step3 },
  { icon: "cashback", body: t.step4 },
];

export interface StepExplainerProps {
  /** render the lead-in onboarding headline above the grid. Default OFF so
   *  /dai-ly keeps just the "Cách hoạt động" title. */
  intro?: boolean;
}

export function StepExplainer({ intro = false }: StepExplainerProps) {
  return (
    <section className={styles.section} aria-label={t.stepsHeading}>
      {intro ? (
        <p className={styles.intro}>{t.stepsIntro}</p>
      ) : (
        <h2 className={styles.title}>{t.stepsHeading}</h2>
      )}
      <ol className={styles.grid}>
        {STEPS.map((s, i) => (
          <li key={s.body} className={styles.step}>
            {/* colorful gradient banner (J9 .step_img is an illustration; we own
             *  no J9 art, so each step gets a distinct brand-palette gradient +
             *  icon + faded number — a premium, original stand-in). */}
            <span
              className={`${styles.banner} ${styles[`tone${i}`]}`}
              aria-hidden="true"
            >
              <Icon name={s.icon} size={34} className={styles.bannerIcon} />
              <span className={styles.bannerNum}>{i + 1}</span>
            </span>
            <span className={styles.stepBody}>
              <span className={styles.stepNum}>{i + 1}.</span> {s.body}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
