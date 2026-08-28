/* ============================================================================
 * Yaobet — CARD DETAIL overlay (R3.3 / R6.1).
 * ----------------------------------------------------------------------------
 * The card-scoped view. Four facts the feature already captured and never once
 * showed a player: how many copies they hold, which sets the card serves, when
 * they first got it, and — the expensive one — its PUBLISHED DRAW RATE.
 *
 * ⛔ NO MONEY IN THIS FILE. No reward amount, no `Đổi thưởng`, no set reward.
 * Rewards are set-scoped (`CollectionSet.reward`); printing one against a
 * single card puts a price on that card, which is a different economy from the
 * one that was designed. Completion and claiming stay on the rails.
 *
 * ⛔ THE RATE IS NEVER HAND-AUTHORED, AND IT IS ALWAYS SET-SCOPED. It comes
 * from `ratesBySet()` in `epl.ts`, which is derived and dev-time checked to sum
 * to 1 within each set. That apparatus exists because an earlier draft
 * hand-authored both rates, they summed to 163.5%, and the screen advertised
 * 11.5% on a card whose real probability was 7.03%.
 *
 * The set scoping is the SECOND form of that same defect, found later: the
 * engine resolves an allocation and then rolls INSIDE that set, renormalising
 * (`adapters/fixtures.ts`). So the whole-pool weight in `drawTable()` is the
 * probability of no open a player ever receives, and a card in three sets has
 * three rates rather than one. Publishing a single number here would have been
 * false through allocation instead of through arithmetic — which is why this
 * component publishes one line per set and never a headline figure.
 *
 * The overlay is the house `Overlay` at `presentation="auto"` — sheet <640px,
 * dialog ≥640px, focus-trapped, Esc / scrim / swipe dismiss, body-scroll lock.
 * A bespoke modal would lose all five.
 *
 * It is also the first place `CardArt`'s 300×420 face renders at 300+px, so
 * the nameplate the file header has always promised is finally legible.
 * ==========================================================================*/

"use client";

import { useId, useMemo } from "react";
import Link from "next/link";
import { formatPercent } from "@/lib/format";
import type { HeldCard } from "@/lib/collection";
import { ratesBySet, setById, type DemoCard } from "@/lib/collection/fixtures/epl";
import { Overlay } from "@/components/layout/_internal/Overlay";
import { CardArt } from "./CardArt";
// One formatter, one clock reading. `Nhận lần đầu` and a history row must never
// disagree about what "12/08 21:04" means.
import { formatTime } from "./CollectionHistory";
import styles from "./card-detail.module.css";

interface Props {
  card: DemoCard;
  /** absent = the player does not hold this card */
  held: HeldCard | undefined;
  onClose: () => void;
}

export function CardDetail({ card, held, onClose }: Props) {
  const titleId = useId();

  /* The DERIVED rates, looked up — never re-authored, never rounded twice.
     One per set, because that is the grain at which the engine actually rolls. */
  const rates = useMemo(() => ratesBySet(card.id), [card.id]);

  const sets = card.setIds
    .map((id) => setById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const count = held?.count ?? 0;

  return (
    <Overlay open onClose={onClose} presentation="auto" labelledBy={titleId}>
      <div className={styles.panel}>
        <header className={styles.head}>
          <h2 id={titleId} className={styles.name}>
            {card.name}
          </h2>
          <button type="button" className={styles.close} onClick={onClose}>
            Đóng
          </button>
        </header>

        <div className={styles.art}>
          <CardArt card={card} rare={card.tierId === "rare"} ghost={!held} />
        </div>

        <p className={styles.sub}>
          {card.club} · {card.position}
        </p>

        {/* — the holding. `Trong đó N thẻ trùng.` only at count ≥ 2; a card
            held once is not a card with zero duplicates, it is just a card. */}
        {held ? (
          <div className={styles.block}>
            <p className={styles.fact}>
              Đang giữ: <strong>{count} thẻ</strong>
            </p>
            {count >= 2 && (
              <p className={styles.note}>Trong đó {count - 1} thẻ trùng.</p>
            )}
            <p className={styles.fact}>
              Nhận lần đầu: <strong>{formatTime(held.firstAcquiredAt)}</strong>
            </p>
          </div>
        ) : (
          <div className={styles.block}>
            <p className={styles.fact}>Chưa có thẻ này.</p>
          </div>
        )}

        {/* — membership, in full. This is where multi-set membership is stated
            plainly, so the flat grid never has to repeat a card to express it.
            The links land on the catalogue; each rail carries its set id as an
            anchor. */}
        {sets.length > 0 && (
          <p className={styles.fact}>
            Có trong:{" "}
            {sets.map((s, i) => (
              <span key={s.id}>
                {i > 0 && <span className={styles.sep}> · </span>}
                <Link href={`/bo-suu-tap#${s.id}`} className={styles.setLink}>
                  {s.name}
                </Link>
              </span>
            ))}
          </p>
        )}

        {/* — the published rate. The restoration point for L1.
             SET-SCOPED, because that is the only form in which it is true: the
             engine allocates an open to a set and rolls inside it, so a card in
             several sets has several rates and no single one. */}
        {rates.length > 0 && (
          <div className={styles.rate}>
            <p className={styles.rateHead}>Tỷ lệ ra thẻ khi mở cho bộ:</p>
            <ul className={styles.rateList}>
              {rates.map((r) => (
                <li key={r.setId}>
                  {r.name}: <strong>{formatPercent(r.rate * 100, 2)}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className={styles.provisional}>
          Số liệu demo — tỷ lệ là tạm tính, chưa phải tỷ lệ công bố.
        </p>
      </div>
    </Overlay>
  );
}
