/* ============================================================================
 * HomeFooter — shared footer + the RG compliance column (SPEC-03 B6 / SPEC-04
 * 3.6). The dedicated "Chơi game có trách nhiệm" column is NEVER buried and
 * NEVER English-only: 18+, deposit/loss limits, self-exclusion, support hotline,
 * license line, full T&C — plain Vietnamese. About/links + socials + an 18+ mark
 * round out the columns; desktop columns collapse to a stack @375.
 *
 * (The root layout does not pass a Footer to AppShell; the home page renders
 * this at the foot of its content column. A later footer-agent task may hoist it
 * into AppShell's `footer` slot for every route.)
 * ==========================================================================*/

import Link from "next/link";
import { vi } from "@/lib/i18n";
import { Icon } from "@/ui";
import styles from "./HomeFooter.module.css";

export function HomeFooter() {
  return (
    <footer className={styles.footer} aria-label="Chân trang">
      <div className={styles.cols}>
        {/* about / links */}
        <nav className={styles.col} aria-label="Liên kết">
          <h3 className={styles.colTitle}>{vi.brand}</h3>
          <ul className={styles.links}>
            <li><Link href="/khuyen-mai">{vi.nav.promo}</Link></li>
            <li><Link href="/vip">{vi.member.vip}</Link></li>
            <li><Link href="/hoan-tra">{vi.member.cashback}</Link></li>
            <li><Link href="/gioi-thieu">{vi.member.referral}</Link></li>
          </ul>
        </nav>

        {/* support */}
        <nav className={styles.col} aria-label="Hỗ trợ">
          <h3 className={styles.colTitle}>{vi.member.support}</h3>
          <ul className={styles.links}>
            <li><Link href="/tin-nhan">{vi.member.messages}</Link></li>
            <li><Link href="/bao-mat">{vi.member.security}</Link></li>
            <li><Link href="/lich-su">{vi.member.history}</Link></li>
          </ul>
        </nav>

        {/* RG compliance column — dedicated, never buried, plain VN */}
        <section className={`${styles.col} ${styles.rg}`} aria-label={vi.rg.columnTitle}>
          <h3 className={styles.colTitle}>
            <Icon name="shield" size={18} className={styles.rgIcon} />
            {vi.rg.columnTitle}
          </h3>
          <p className={styles.ageMark}>18+</p>
          <ul className={styles.rgList}>
            <li>{vi.rg.ageLimit}</li>
            <li>{vi.rg.limits}</li>
            <li><Link href="/bao-mat">{vi.rg.selfExclusion}</Link></li>
            <li>{vi.rg.hotline}: 1900 0000</li>
            <li><Link href="/khuyen-mai">{vi.rg.terms}</Link></li>
          </ul>
          <p className={styles.license}>
            Yaobet hoạt động theo giấy phép trò chơi hợp lệ. Vui lòng chơi có trách nhiệm.
          </p>
        </section>
      </div>

      <p className={styles.copyright}>© {new Date().getFullYear()} {vi.brand}. Đã đăng ký bản quyền.</p>
    </footer>
  );
}
