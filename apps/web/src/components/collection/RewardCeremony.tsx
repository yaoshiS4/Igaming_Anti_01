/* ============================================================================
 * Yaobet — REWARD CEREMONY: the completed-set exchange.
 * ----------------------------------------------------------------------------
 * WHAT THIS IS, AND WHAT IT DELIBERATELY IS NOT.
 *
 * The house rules ban win-juice: no particle bursts, no coin fountains, no
 * variable-ratio reinforcement. This animation is allowed inside that ban, and
 * the distinction is not a loophole — it is the whole design:
 *
 *   · A DRAW is random. Dressing a random outcome in celebration is exactly the
 *     reinforcement schedule the house rules exist to refuse. That is why the
 *     pack stage stays plain and never learns a reward value.
 *   · A COMPLETION is DETERMINISTIC. The player already holds every card. They
 *     already saw this amount on the rail, before they pressed anything. There
 *     is no outcome to suspend, because nothing is being decided here.
 *
 * So this is a RECEIPT CEREMONY, not a jackpot. Three consequences follow, and
 * each one is a thing this file refuses to do:
 *
 *   1. THE AMOUNT IS NEVER HIDDEN AND NEVER COUNTS UP. It is on screen from the
 *      first frame. A count-up ticker on a number the player already knows
 *      manufactures suspense about a settled quantity — the same manipulation
 *      as a slot reel, applied to a payout that was never in doubt.
 *   2. NOTHING IS REVEALED. What animates is the player's OWN CARDS gathering
 *      and a seal closing over them. The material is what they earned, not a
 *      surprise the house produces.
 *   3. IT ENDS ON THE RECEIPT, not on the money — transaction id, wallet
 *      destination, and the no-wagering statement. The last frame a player
 *      looks at should be the one they would screenshot for support.
 *
 * AND IT OPENS ON A CONFIRMATION, because the exchange is DESTRUCTIVE. Sets are
 * repeatable: exchanging spends one copy of every card in the set, so the set
 * empties and must be collected again. Cards belong to several sets at once, so
 * this can also cut into sets the player has not finished. Every one of those
 * facts is stated before the press, never discovered after it.
 *
 * `R` is an owner parameter. The figure rendered here is the set's provisional
 * demo reward, carrying its provisional label; the GRANT supplies only the
 * transaction id, because the port does not decide what R is.
 * ==========================================================================*/

"use client";

import { useEffect, useId, useReducer } from "react";
import { formatVnd } from "@/lib/format";
import type { ExchangeImpact, RewardGrant } from "@/lib/collection";
import type { DemoCard } from "@/lib/collection/fixtures/epl";
import type { CollectionSet } from "@/lib/collection";
import { Overlay } from "@/components/layout/_internal/Overlay";
import { CardArt } from "./CardArt";
import styles from "./ceremony.module.css";

/* The beats. Bounded and finite — a ceremony that can be waited out is a
   ceremony; one that loops is an attention trap. */
type Beat = "gather" | "seal" | "receipt";

const TIMINGS: Record<Exclude<Beat, "receipt">, number> = {
  gather: 900,
  seal: 700,
};

interface Props {
  set: CollectionSet;
  /** the player's own cards for this set — the material of the animation */
  cards: DemoCard[];
  /** present once the credit succeeded; the receipt waits for it */
  grant: RewardGrant | null;
  /** set when the credit was refused — the ceremony becomes a plain message */
  error: string | null;
  /**
   * What the exchange will cost. Rendered BEFORE anything is spent — see the
   * confirm phase below. Null once the exchange has been authorised.
   */
  impact: ExchangeImpact | null;
  /** names for the collateral rows, resolved by the caller */
  setNameOf: (setId: string) => string;
  /** how many times this set has already been completed and exchanged */
  exchangeCount: number;
  onConfirm: () => void;
  onClose: () => void;
}

export function RewardCeremony({
  set,
  cards,
  grant,
  error,
  impact,
  setNameOf,
  exchangeCount,
  onConfirm,
  onClose,
}: Props) {
  const titleId = useId();
  const [beat, advance] = useReducer(
    (b: Beat): Beat => (b === "gather" ? "seal" : "receipt"),
    "gather",
  );

  /* Reduced motion skips to the receipt. It does not merely disable the
     transitions — a player who asked for less motion should not have to sit
     through the same 1.6s of nothing happening. */
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced || beat === "receipt") return;
    const t = setTimeout(advance, TIMINGS[beat]);
    return () => clearTimeout(t);
  }, [beat, reduced]);

  const settled = reduced || beat === "receipt";

  /* ── CONFIRM. Nothing has been spent yet. ─────────────────────────────────
     The exchange consumes one copy of every card in the set, and cards belong
     to several sets at once — so this can also reduce sets the player has not
     finished. That is a destructive action on something they earned, for real
     money, and it is disclosed before the press rather than explained after. */
  if (impact) {
    const spare = impact.covered.length;
    return (
      <Overlay open onClose={onClose} presentation="auto" labelledBy={titleId}>
        <div className={styles.panel}>
          <p className={styles.eyebrow}>Xác nhận đổi thưởng</p>
          <h2 id={titleId} className={styles.setName}>{set.name}</h2>
          {set.reward && <p className={styles.amount}>{formatVnd(set.reward)}</p>}
          <p className={styles.provisional}>Số liệu demo — chưa phải mức thưởng công bố.</p>

          <div className={styles.cost}>
            <p className={styles.costHead}>
              Đổi thưởng sẽ <strong>dùng hết {set.size} thẻ</strong> của bộ này.
              Bộ trở về <strong>0/{set.size}</strong> và bạn có thể sưu tầm lại từ đầu.
            </p>

            {spare > 0 && (
              <p className={styles.costSpare}>
                Bạn có thẻ dự phòng cho <strong>{spare}</strong> thẻ — những thẻ này
                bạn vẫn giữ lại.
              </p>
            )}

            {impact.collateral.length > 0 && (
              <>
                <p className={styles.costWarn}>Các bộ khác cũng bị ảnh hưởng:</p>
                <ul className={styles.costList}>
                  {impact.collateral.map((c) => (
                    <li key={c.setId}>
                      {setNameOf(c.setId)} — mất <strong>{c.loses}</strong> thẻ
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* NOT "Đổi thưởng" — that is the label of the rail button that
              opened this panel. A confirm step that repeats its trigger's
              wording reads as "did my tap register?" rather than as a decision,
              and it is the destructive half of the pair. */}
          <button type="button" className={styles.done} onClick={onConfirm}>
            Xác nhận · dùng {set.size} thẻ
          </button>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Để sau
          </button>
        </div>
      </Overlay>
    );
  }

  if (error) {
    return (
      <Overlay open onClose={onClose} presentation="auto" labelledBy={titleId}>
        <div className={styles.panel}>
          <h2 id={titleId} className={styles.failTitle}>Chưa đổi được thưởng</h2>
          <p className={styles.failBody}>{error}</p>
          <p className={styles.failHint}>
            Bộ sưu tập của bạn không thay đổi. Vui lòng thử lại.
          </p>
          <button type="button" className={styles.done} onClick={onClose}>
            Đóng
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay open onClose={onClose} presentation="auto" labelledBy={titleId}>
      <div className={styles.panel} data-beat={settled ? "receipt" : beat}>
        {/* ── the player's own cards, gathering ─────────────────────────── */}
        <div className={styles.stage} aria-hidden="true">
          <div className={styles.fan}>
            {cards.map((c, i) => (
              <div
                key={c.id}
                className={styles.card}
                style={{
                  /* Spread before, stacked after. Index drives both, so a
                     5-card set and an 11-card set gather identically. */
                  "--i": i - (cards.length - 1) / 2,
                  "--n": cards.length,
                } as React.CSSProperties}
              >
                <CardArt card={c} rare={c.tierId === "rare"} />
              </div>
            ))}
          </div>

          {/* The seal draws itself closed over the gathered cards. */}
          <svg className={styles.seal} viewBox="0 0 120 120" role="presentation">
            <circle className={styles.sealRing} cx="60" cy="60" r="52" />
            <circle className={styles.sealRingInner} cx="60" cy="60" r="44" />
            <path className={styles.sealTick} d="M42 61 l13 13 l24 -26" />
          </svg>
        </div>

        {/* ── what happened, stated plainly ─────────────────────────────── */}
        <p className={styles.eyebrow}>Hoàn thành bộ sưu tập</p>
        <h2 id={titleId} className={styles.setName}>{set.name}</h2>
        <p className={styles.count}>
          Đủ <strong>{set.size}/{set.size}</strong> thẻ
        </p>

        {/* ── the amount. On screen from the first frame, never counting up.
               It was on the rail before the player pressed anything. ─────── */}
        {set.reward && (
          <p className={styles.amount}>{formatVnd(set.reward)}</p>
        )}
        <p className={styles.provisional}>Số liệu demo — chưa phải mức thưởng công bố.</p>

        {/* ── the receipt: the frame worth screenshotting ───────────────── */}
        <div className={styles.receipt} data-ready={settled && Boolean(grant)}>
          {settled && grant ? (
            <>
              <p className={styles.credited}>Đã cộng vào <strong>ví chính</strong></p>
              <ul className={styles.terms}>
                <li>Dùng được ngay, <strong>không kèm điều kiện cược</strong>.</li>
                {/* The set was SPENT. Stating it on the receipt matters more
                    than stating it in the terms: this is the frame the player
                    is looking at when their collection empties. */}
                <li>
                  Đã dùng <strong>{set.size} thẻ</strong> — bộ này trở về{" "}
                  <strong>0/{set.size}</strong>, sưu tầm lại để đổi tiếp.
                </li>
                <li>
                  Đây là lần đổi thứ <strong>{exchangeCount}</strong> của bộ này.
                </li>
              </ul>
              <p className={styles.txn}>
                Mã giao dịch: <code>{grant.transactionId}</code>
              </p>
              <button type="button" className={styles.done} onClick={onClose}>
                Xong
              </button>
            </>
          ) : (
            <p className={styles.pending}>Đang chuyển vào ví…</p>
          )}
        </div>
      </div>
    </Overlay>
  );
}
