/* ============================================================================
 * Yaobet — BỘ SƯU TẬP · D2 "Tủ Kính" (The Cabinet). THE SHIPPED SURFACE.
 * ----------------------------------------------------------------------------
 * WHAT IS ACTUALLY ON THIS PAGE, top to bottom:
 *
 *   Zone 1 · <PackStage>   — chance. A lit stage, five foil packs, one CTA and
 *                            one number (opens remaining), plus a terms button
 *                            that fires a ZERO-ARGUMENT callback.
 *   · the entry row        — `Thẻ của tôi · N thẻ ›` → the inventory page.
 *   Zone 2 · the rails     — contract. One horizontal rail per set: every card
 *                            in the set at 104px, owned in colour and unowned
 *                            ghosted; the set's `owned/size`, a progress bar,
 *                            its reward, and one `Đổi thưởng` button.
 *   · the demo controls, and a toast that carries the payout transaction id.
 *
 * THE FIREWALL. Money exists in Zone 2 and nowhere else, and that is enforced
 * by props, not by discipline: `PackStage` receives `{ opens, last, busy,
 * onOpen, onOpenInfo }` and no reward value can reach it. The terms overlay is
 * rendered HERE, as a sibling of the stage, for the same reason.
 *
 * Rules this is built to, not decorated with:
 *   · Cards are on screen at arrival. Nothing is hidden behind a tap.
 *   · No `???` card, ever. The rails are the CATALOGUE and every card in them
 *     is named and ghosted rather than hidden. (They are not the inventory —
 *     that is /bo-suu-tap/cua-toi, and it is a different question.)
 *   · Ownership is a TREATMENT on one tile, not a separate view — and it is
 *     also in the tile's accessible name, because a CSS filter is invisible to
 *     a screen reader.
 *   · Copies show as a `×N` badge and NOTHING else. Completion is
 *     distinct-only; duplicates must never appear to advance a set.
 *   · One reveal, one duration, for every card. No rarity-differentiated
 *     ceremony — that is win-juice by another name.
 *   · The reward is prominent by POSITION AND REPETITION, never by size.
 *     The card art always outranks the number.
 *   · No bet CTA. No "best value" badge. No sort-by-reward. Ranking sets by
 *     return is a spend recommendation.
 *
 * NOT here, deliberately: aggregate stat tiles (`3/18` and `17%` are one fact
 * printed twice, and `/18` publishes a universe size BR-04 has not ruled), and
 * the history log (it is unbounded, it is what support reads, and it needs a
 * URL — it lives on the inventory page).
 * ==========================================================================*/

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { formatVnd } from "@/lib/format";
import type {
  CollectionPorts,
  CollectionState,
  HeldCard,
  ExchangeImpact,
  OpenOutcome,
  RewardGrant,
} from "@/lib/collection";
import { exchangeImpact, meanOpensForRemaining } from "@/lib/collection";
import {
  DEMO_SETS,
  DEMO_TIERS,
  cardById,
  cardsInSet,
  type DemoCard,
} from "@/lib/collection/fixtures/epl";
import { Icon } from "@/ui/Icon/Icon";
import { Overlay } from "@/components/layout/_internal/Overlay";
import { CardArt } from "./CardArt";
import { PackStage } from "./PackStage";
import { CollectionTerms } from "./CollectionTerms";
import { CollectionHistory } from "./CollectionHistory";
import { RewardCeremony } from "./RewardCeremony";
import styles from "./collection.module.css";

const PLAYER = "demo-player";

/** Mean opens still needed to finish a set, given what is already held. */
function opensToFinish(setId: string, held: ReadonlySet<string>): number {
  const missing = cardsInSet(setId).filter((c) => !held.has(c.id));
  if (missing.length === 0) return 0;
  return Math.ceil(
    meanOpensForRemaining(
      missing.map((c) => DEMO_TIERS.find((t) => t.id === c.tierId)!.drawRate),
    ),
  );
}

/**
 * Rail order, decided ONCE per session from the holding at arrival: least
 * additional effort first. Frozen thereafter, because a rail that changes
 * position at the exact moment it is being highlighted is a rail the player
 * was reaching for. Ordering by reward would be an inducement in any order.
 */
function railOrderFor(heldCards: HeldCard[]): string[] {
  const held = new Set(heldCards.map((h) => h.cardId));
  return DEMO_SETS.map((s) => ({ id: s.id, opens: opensToFinish(s.id, held) }))
    .sort((a, b) => a.opens - b.opens)
    .map((r) => r.id);
}

interface Props {
  ports: CollectionPorts;
  onFireActivity: () => void;
  /** DEV — grant every card in one set so the exchange case is reachable */
  onCompleteSet: () => void;
  onReset: () => void;
}

export function CollectionApp({ ports, onFireActivity, onCompleteSet, onReset }: Props) {
  const [state, setState] = useState<CollectionState | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [last, setLast] = useState<OpenOutcome | null>(null);
  const [pulsed, setPulsed] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [railOrder, setRailOrder] = useState<string[] | null>(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  /** the exchange in progress — null when no ceremony is on screen */
  const [ceremony, setCeremony] = useState<{
    setId: string;
    grant: RewardGrant | null;
    error: string | null;
    /** non-null = the confirm phase; nothing has been spent yet */
    impact: ExchangeImpact | null;
  } | null>(null);
  const timers = useRef<number[]>([]);

  const refresh = useCallback(async () => {
    const env = await ports.state.get(PLAYER);
    if (env.status === "live") {
      setState(env.value);
      // Frozen at the FIRST successful load and never recomputed (H6).
      setRailOrder((prev) => prev ?? railOrderFor(env.value.heldCards));
      setStatus("ready");
    } else if (env.status === "error") {
      setStatus("error");
    }
  }, [ports]);

  useEffect(() => {
    const pending = timers.current;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    return () => pending.forEach(clearTimeout);
  }, [refresh]);

  /* THE HOLDING, as objects. `count` and `firstAcquiredAt` are carried, not
     collapsed away on the first line of derived state — a card is an object
     here, and the `×N` badge, the accessible name and the whole inventory page
     all hang off that one decision. */
  const heldById = useMemo(
    () => new Map((state?.heldCards ?? []).map((h) => [h.cardId, h] as const)),
    [state],
  );
  const vested = useMemo(
    () => state?.entitlements.filter((e) => e.state === "vested") ?? [],
    [state],
  );

  const rails = useMemo(() => {
    const built = DEMO_SETS.map((s) => {
      const cards = cardsInSet(s.id);
      // DISTINCT cards held, never copies. Duplicates do not advance a set and
      // must not appear to: `heldById.has()` is the whole guarantee.
      const missing = cards.filter((c) => !heldById.has(c.id));
      return {
        set: s,
        cards,
        owned: cards.length - missing.length,
        remaining: missing.length,
      };
    });
    if (!railOrder) return built;
    return built.sort(
      (a, b) => railOrder.indexOf(a.set.id) - railOrder.indexOf(b.set.id),
    );
  }, [heldById, railOrder]);

  const openOne = useCallback(async () => {
    if (busy || vested.length === 0) return;
    setBusy(true);
    const ent = vested[0];
    const res = await ports.outcome.draw(PLAYER, ent.id, `draw-${ent.id}`);
    if (res.status === "applied" || res.status === "duplicate") {
      const outcome = res.value;
      setLast(outcome);
      await refresh();
      // The rails this card belongs to pulse in a stagger — that teaches
      // multi-set membership without a word of copy.
      const card = cardById(outcome.cardId);
      (card?.setIds ?? []).forEach((sid, i) => {
        timers.current.push(
          window.setTimeout(() => setPulsed((p) => [...p, sid]), i * 80),
        );
      });
      timers.current.push(
        window.setTimeout(() => setPulsed([]), 900),
      );
    } else {
      setToast(res.reason);
    }
    setBusy(false);
  }, [busy, vested, ports, refresh]);

  /**
   * Exchange. The ceremony OPENS FIRST, on the click, and the credit runs
   * underneath it — the player is looking at their own completed set while the
   * wallet call is in flight, and the receipt fills in when it lands. Waiting
   * on the network before showing anything would put a dead half-second on the
   * one action in this feature that is a payout.
   */
  /**
   * PHASE 1 — ask. Nothing is spent yet.
   *
   * The exchange is destructive: it consumes a copy of every card in the set,
   * and cards belong to several sets at once. The cost is computed from the
   * holding and shown before the player commits.
   */
  const proposeClaim = useCallback(
    (setId: string) => {
      if (busy) return;
      const counts = new Map([...heldById].map(([id, h]) => [id, h.count]));
      const impact = exchangeImpact(
        cardsInSet(setId).map((c) => c.id),
        counts,
        DEMO_SETS.filter((s) => s.id !== setId).map((s) => ({
          setId: s.id,
          cardIds: cardsInSet(s.id).map((c) => c.id),
        })),
      );
      setCeremony({ setId, grant: null, error: null, impact });
    },
    [busy, heldById],
  );

  /**
   * PHASE 2 — spend. The ceremony plays while the credit is in flight; waiting
   * on the network first would put a dead half-second on a payout.
   */
  const confirmClaim = useCallback(async () => {
    if (busy || !ceremony) return;
    const { setId } = ceremony;
    setBusy(true);
    // Drops `impact`, which is what switches the overlay from ask to ceremony.
    setCeremony({ setId, grant: null, error: null, impact: null });

    /* The key carries the exchange COUNT. Sets are repeatable now, so a key of
       `claim-<setId>` would make every exchange after the first a replay of the
       first one — the player would collect the set again and be handed the
       original receipt with no new credit. */
    const n = state?.progress.find((p) => p.setId === setId)?.exchangeCount ?? 0;
    const res = await ports.wallet.credit(
      PLAYER,
      setId,
      "cash-like",
      `claim-${setId}-${n}`,
    );

    if (res.status === "rejected") {
      setCeremony({ setId, grant: null, error: res.reason, impact: null });
    } else {
      setCeremony({ setId, grant: res.value, error: null, impact: null });
      // Re-read: the set has just emptied and every rail it touches moved.
      await refresh();
    }
    setBusy(false);
  }, [busy, ceremony, ports, refresh, state]);

  if (status === "loading") {
    return <div className={styles.page}><p className={styles.muted}>Đang tải…</p></div>;
  }
  if (status === "error") {
    return (
      <div className={styles.page}>
        <p className={styles.muted}>Không tải được bộ sưu tập.</p>
        <button className={styles.btn} onClick={() => void refresh()}>Thử lại</button>
      </div>
    );
  }


  return (
    <div className={styles.page}>
      {/* ══ ZONE 1 · the pack stage — chance. No reward value is passed in.
             `onOpenInfo` carries no argument: the stage asks, this component
             answers, and the terms render as a SIBLING below. ══ */}
      <PackStage
        opens={vested.length}
        last={last}
        busy={busy}
        onOpen={openOne}
        onOpenInfo={() => setTermsOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      <Overlay
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        presentation="auto"
        labelledBy="collection-terms-title"
      >
        <div className={styles.sheetHead}>
          <h2 id="collection-terms-title" className={styles.sheetTitle}>
            Điều khoản
          </h2>
          <button
            type="button"
            className={styles.sheetClose}
            onClick={() => setTermsOpen(false)}
            aria-label="Đóng"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className={styles.sheetBody}>
          <CollectionTerms />
        </div>
      </Overlay>

      {/* ══ ZONE 2 · BỘ SƯU TẬP — contract. Rewards live only here. ══ */}
      <section className={styles.zone2} aria-label="Bộ sưu tập">
        <div className={styles.plate}>
          <span className={styles.plateWing} aria-hidden />
          <h2 className={styles.plateText}>BỘ SƯU TẬP</h2>
          <span className={styles.plateWing} aria-hidden />
        </div>
        {/* The section header line: what the rails are, and the way into the
            player's own inventory. The entry was a full-width row here, which
            put a heavy block between the note and the rails; as a compact pill
            it shares the line instead of interrupting it.

            It stays a LINK to a page, not a modal. An inventory needs a URL, a
            sort control, a scroll position and a back button — a modal has none
            of those, and the page already exists with all four. The count is
            DISTINCT cards; no denominator, because the universe size is BR-04
            and unruled. */}
        <div className={styles.zone2Head}>
          <p className={styles.note}>
            Đủ toàn bộ thẻ trong bộ mới đổi được thưởng. Số liệu demo — tỷ lệ và
            phần thưởng là tạm tính, chưa phải tỷ lệ công bố.
          </p>
          <Link className={styles.entryPill} href="/bo-suu-tap/cua-toi">
            <Icon name="card" size={16} />
            <span>Thẻ của tôi</span>
            <span className={styles.entryCount}>{heldById.size}</span>
            <Icon name="chevronRight" size={14} />
          </Link>
        </div>

        {rails.map(({ set, cards, owned, remaining }) => {
          const complete = remaining === 0;
          /* How many times this set has already paid. Sets are REPEATABLE, so
             this is a history line, never a reason to disable the button —
             exchanging empties the set and `complete` goes false by itself. */
          const times =
            state?.progress.find((p) => p.setId === set.id)?.exchangeCount ?? 0;
          const pct = Math.round((owned / set.size) * 100);
          return (
            <article
              key={set.id}
              /* The anchor `CardDetail`'s `Có trong:` links target. Without it
                 those links land at the top of this page instead of the rail. */
              id={set.id}
              className={`${styles.rail} ${pulsed.includes(set.id) ? styles.pulse : ""}`}
            >
              <header className={styles.railHead}>
                <div className={styles.railTop}>
                  <h2 className={styles.railName}>{set.name}</h2>
                  <span className={styles.railCount}>
                    {owned}/{set.size}
                  </span>
                </div>

                <div className={styles.bar} aria-hidden>
                  <span style={{ width: `${pct}%` }} />
                </div>

                {/* Same five fields, same order, same x-offset on every rail —
                    scanning the right edge IS the comparison. */}
                <div className={styles.railFacts}>
                  <span className={styles.dist}>
                    {complete ? "Sẵn sàng đổi" : ""}
                  </span>
                  <span className={styles.reward}>
                    Thưởng{" "}
                    <strong>
                      {set.reward ? formatVnd(set.reward.amount) : "—"}
                    </strong>
                  </span>
                </div>
              </header>

              <div className={styles.scroll}>
                <ul className={styles.tiles}>
                  {cards.map((c) => (
                    <Tile key={c.id} card={c} held={heldById.get(c.id)} />
                  ))}
                </ul>
              </div>

              {/* One action per set. Enabled only once every card is held —
                  a set you cannot exchange says so by being unavailable, not
                  by explaining itself. */}
              <div className={styles.railActions}>
                <button
                  className={styles.primary}
                  onClick={() => proposeClaim(set.id)}
                  disabled={busy || !complete}
                >
                  Đổi thưởng
                </button>
                {times > 0 && (
                  <span className={styles.times}>Đã đổi {times} lần</span>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <div className={styles.dev}>
        <span className={styles.devLabel}>Demo</span>
        <button className={styles.btn} onClick={onFireActivity}>+1 lượt mở</button>
        {/* Reaches the completed/claimable case in one click instead of ~60
            opens. It grants CARDS, never the reward — the exchange is still a
            deliberate action the player takes. */}
        <button className={styles.btn} onClick={onCompleteSet}>Hoàn thành 1 bộ</button>
        <button className={styles.btn} onClick={onReset}>Đặt lại</button>
      </div>

      {/* History, opened by the stage's zero-argument callback. It carries a
          link to its own URL: support asks for one, and a modal has none. */}
      <Overlay
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        presentation="auto"
        labelledBy="collection-history-title"
      >
        <div className={styles.sheetHead}>
          <h2 id="collection-history-title" className={styles.sheetTitle}>
            Lịch sử
          </h2>
          <button
            type="button"
            className={styles.sheetClose}
            onClick={() => setHistoryOpen(false)}
            aria-label="Đóng"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className={styles.sheetBody}>
          {/* Mounted only while open, so it re-reads the trace on every open
              rather than serving a page cached before the last few draws. */}
          {historyOpen && (
            <CollectionHistory ports={ports} nonce={state?.heldCards.length ?? 0} />
          )}
          <p className={styles.sheetFooter}>
            <Link
              className={styles.sheetLink}
              href="/bo-suu-tap/cua-toi?tab=lich-su"
              onClick={() => setHistoryOpen(false)}
            >
              Mở trang lịch sử →
            </Link>
          </p>
        </div>
      </Overlay>

      {/* The exchange ceremony. A SIBLING of the rails, holding the grant — the
          rail button only calls `claim`, exactly as the pack stage only calls
          `onOpenInfo`. */}
      {ceremony && (
        <RewardCeremony
          set={DEMO_SETS.find((s) => s.id === ceremony.setId)!}
          cards={cardsInSet(ceremony.setId)}
          grant={ceremony.grant}
          error={ceremony.error}
          impact={ceremony.impact}
          setNameOf={(id) => DEMO_SETS.find((s) => s.id === id)?.name ?? id}
          exchangeCount={
            state?.progress.find((p) => p.setId === ceremony.setId)?.exchangeCount ?? 0
          }
          onConfirm={() => void confirmClaim()}
          onClose={() => setCeremony(null)}
        />
      )}

      {/* The receipt carries the payout transaction id — a payout-proof moment
          assistive tech never heard. Polite, never assertive: interrupting the
          reveal to read a transaction id is its own defect. */}
      <div className={styles.toastLive} role="status" aria-live="polite">
        {toast && (
          <button type="button" className={styles.toast} onClick={() => setToast(null)}>
            {toast}
          </button>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * One tile. Ownership is a treatment, not a separate view — never a `???`.
 *
 * Three states, and the silence in the middle one is deliberate:
 *   no row   → ghost art, NO badge. A `×0` reads as a stock-out and makes an
 *              empty catalogue feel like a failure rather than a start.
 *   count 1  → colour, NO badge. A `×1` on every card turns the catalogue into
 *              a spreadsheet and makes "one" look deficient.
 *   count ≥2 → `×N`, top-left. A fact, stated once, in the smallest legible
 *              form — and never in the corner the `N bộ` set badge occupies.
 * --------------------------------------------------------------------------*/

function Tile({ card, held }: { card: DemoCard; held: HeldCard | undefined }) {
  const multi = card.setIds.length > 1;
  const copies = held?.count ?? 0;
  return (
    <li className={styles.tile}>
      <div className={styles.tileArt}>
        <CardArt
          card={card}
          rare={card.tierId === "rare"}
          ghost={!held}
          label={ownershipLabel(card.name, copies)}
        />
        {copies >= 2 && (
          // aria-hidden: the count is already in the art's accessible name, and
          // announcing it twice is worse than not announcing it at all.
          <span className={styles.qty} aria-hidden>
            ×{copies}
          </span>
        )}
        {multi && <span className={styles.multi}>{card.setIds.length} bộ</span>}
      </div>
    </li>
  );
}

/** Ownership carried in the accessible name — it is CSS-only otherwise. */
function ownershipLabel(name: string, copies: number): string {
  if (copies === 0) return `${name} — chưa có`;
  if (copies === 1) return `${name} — đang giữ`;
  return `${name} — đang giữ ${copies} thẻ`;
}
