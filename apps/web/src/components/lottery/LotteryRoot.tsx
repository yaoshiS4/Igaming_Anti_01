/* ============================================================================
 * Yaobet — VÉ SỐ · composition root.
 * ----------------------------------------------------------------------------
 * The hub: one card per lottery type, plus the published-odds strip. Exactly
 * one type is live today (vé số cào); the rest are declared, dimmed and
 * disabled rather than hidden, so the shelf reads as a shelf and not as a
 * one-item page pretending to be a category.
 *
 * WHAT THIS FILE DOES NOT DO: it does not build the scratch-card game. It owns
 * the `playing` flag and the mount point (search GAME MOUNT POINT below) and
 * nothing else. The game is a child of this root, wired by its own owner.
 *
 * NAMING: "Vé số" ≠ "Xổ số". The lobby vertical is provider lottery GAMES on a
 * schedule; this is a ticket you hold and open. The copy below leans on the
 * hold-and-open idea in every line so the two never blur.
 *
 * NO TIME-DEPENDENT RENDER. Nothing here reads Date, Math.random or `window`
 * while rendering — the tree is identical on the server and on first paint.
 * ==========================================================================*/

"use client";

import { useCallback, useState } from "react";
/* Published odds live in the fixture layer, never as literals in a component:
 * a rate typed into JSX is a rate nobody can diff against the maths. The three
 * arrive as BARE VN numerals derived from the same ladder the game deals from
 * (hit rate / top-prize chance / the identical per-rung house cost); the labels
 * around them are this strip's job, which is why they slot straight into a
 * value cell below. */
import { SCRATCH_ODDS } from "@/lib/mock/lottery";
import { ScratchCardStage } from "./ScratchCardGame";
import styles from "./LotteryRoot.module.css";

/* ---------------------------------------------------------------------------
 * The shelf. `live` is a single-item set today and that is deliberate: the
 * coming-soon rows are declarations of intent, not stubs waiting for a flag —
 * each carries the sentence a player needs to tell it apart from the others.
 * No brand names, no mascots.
 * ------------------------------------------------------------------------ */

type ComingSoon = {
  readonly id: string;
  readonly name: string;
  readonly blurb: string;
};

const COMING_SOON: readonly ComingSoon[] = [
  {
    id: "quay-so-nhanh",
    name: "Quay số nhanh",
    blurb: "Chọn số của bạn, quay một lượt, biết kết quả sau vài giây.",
  },
  {
    id: "lo-to",
    name: "Lô tô",
    blurb: "Dò số trên bảng của bạn, khớp càng nhiều hàng thì thưởng càng lớn.",
  },
  {
    id: "ve-so-truyen-thong",
    name: "Vé số truyền thống",
    blurb: "Giữ vé trước, chờ tới kỳ mở thưởng cố định trong ngày.",
  },
  {
    id: "boc-tham-may-man",
    name: "Bốc thăm may mắn",
    blurb: "Mỗi lượt tham gia là một lá thăm trong hộp, mở thăm theo đợt.",
  },
] as const;

export function LotteryRoot() {
  /* True from the moment `Cào ngay` is pressed until the game hands control
   * back. Held here, not in the card, so the game can be a sibling of the hub
   * instead of a child of a button. */
  const [playing, setPlaying] = useState(false);
  const onPlay = useCallback(() => setPlaying(true), []);

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Vé số</h1>
        <p className={styles.lede}>
          Vé bạn giữ trong tay và tự mở. Mua một tấm, mở ra, biết kết quả ngay —
          không phải chờ tới lượt quay nào.
        </p>
      </header>

      <ul className={styles.grid}>
        {/* ── the live type · the anchor of the page ─────────────────────── */}
        <li className={styles.featuredCell}>
          <article className={styles.featured}>
            <div className={styles.featuredArt} aria-hidden="true">
              <ScratchTicketArt />
            </div>
            <div className={styles.featuredBody}>
              <p className={styles.liveBadge}>Đang mở</p>
              <h2 className={styles.featuredName}>Vé số cào</h2>
              <p className={styles.featuredBlurb}>
                Cào lớp phủ bằng chính tay bạn. Kết quả hiện ra ngay trên vé,
                không chờ kỳ mở thưởng.
              </p>
              <button
                type="button"
                className={styles.playCta}
                onClick={onPlay}
                aria-expanded={playing}
              >
                Cào ngay
              </button>
            </div>
          </article>
        </li>

        {/* ── declared, not yet open ─────────────────────────────────────── */}
        {COMING_SOON.map((type) => (
          <li key={type.id} className={styles.cell}>
            {/* A disabled BUTTON, not a dead div: it is a control that will
                work later, so it announces itself as unavailable rather than
                as decoration, and it stays out of the tab order meanwhile. */}
            <button type="button" className={styles.soonCard} disabled aria-disabled="true">
              <span className={styles.soonBadge}>Sắp ra mắt</span>
              <span className={styles.soonName}>{type.name}</span>
              <span className={styles.soonBlurb}>{type.blurb}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* ══════════════════════════════════════════════════════════════════
        * GAME MOUNT POINT — owned by the scratch-card agent. EMPTY BY DESIGN.
        * ------------------------------------------------------------------
        * `playing` is true from the press of `Cào ngay` until the game calls
        * back. Mount the stage inside this wrapper and change nothing else in
        * this file:
        *
        *   {playing ? <ScratchCardStage onExit={() => setPlaying(false)} /> : null}
        *
        * The wrapper is `display: contents`, so while it is empty it costs the
        * layout nothing and the hub above sits exactly where it does now.
        * ════════════════════════════════════════════════════════════════ */}
      <div className={styles.gameMount} data-playing={playing}>
        {playing ? <ScratchCardStage onExit={() => setPlaying(false)} /> : null}
      </div>

      {/* ── published odds ─────────────────────────────────────────────────
          On the hub, not behind a terms link. The third figure is the one a
          player never gets told anywhere else: every prize level costs the
          house the same, so no level is the cheap one the system quietly
          steers toward. */}
      <section className={styles.fairness} aria-labelledby="veso-odds">
        <h2 id="veso-odds" className={styles.fairnessHead}>
          Tỷ lệ công bố
        </h2>
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Tỷ lệ trúng</dt>
            <dd className={styles.statBody}>
              <span className={styles.statValue}>{SCRATCH_ODDS.hitRate}</span>
              <span className={styles.statNote}>số vé có thưởng trên tổng số vé phát hành</span>
            </dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Giải cao nhất</dt>
            <dd className={styles.statBody}>
              <span className={styles.statValue}>{SCRATCH_ODDS.topPrize}</span>
              <span className={styles.statNote}>cơ hội chạm mức thưởng lớn nhất của bậc thang</span>
            </dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Mỗi bậc giải</dt>
            <dd className={styles.statBody}>
              <span className={styles.statValue}>{SCRATCH_ODDS.rungCost}</span>
              <span className={styles.statNote}>
                mọi bậc đều tốn của nhà cái đúng số tiền này — không bậc nào rẻ hơn để hệ
                thống ưu tiên
              </span>
            </dd>
          </div>
        </dl>
        <p className={styles.fairnessNote}>
          Tỷ lệ được công bố trước và không thay đổi trong lúc bạn chơi. Đây là
          bản demo — số liệu hiển thị là dữ liệu mẫu, chưa phải điều khoản công
          bố chính thức.
        </p>
      </section>
    </main>
  );
}

/* ---- inline art (no external requests; currentColor follows the card) ---- */

/** A scratch ticket: perforated left edge, a coin lifting the foil corner. */
function ScratchTicketArt() {
  return (
    <svg viewBox="0 0 64 48" width="64" height="48" fill="none" aria-hidden="true">
      <path
        d="M10 8h44a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* perforated tear-off edge */}
      <path
        d="M10 8v4M10 16v4M10 24v4M10 32v4M10 40v-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* the foil panel, one corner peeled back */}
      <path
        d="M20 16h22v16H20z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M42 16l-7 7 7 2z" fill="currentColor" />
      {/* the coin doing the scratching */}
      <circle cx="46" cy="34" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M46 31v6M44 34h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
