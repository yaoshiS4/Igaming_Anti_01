/* ============================================================================
 * Luxury VIP — TierDeck (coverflow). 5 fanned cards with the exact per-card
 * transform / zIndex / scale, selected ring + glow, member locked-ahead
 * grayscale, pointer-drag where ONLY the cards move (container stays static)
 * with snap-to-nearest on release, tap-to-select, and 5 pagination dots.
 * Emits the chosen tier index up via onSelect.
 *
 *   o                 = index − effectiveSelected
 *   effectiveSelected = selected − drag/120        (drag in px, live)
 *   translateX        = o*78   translateY = |o|*8   rotate = o*5deg
 *   scale             = max(.55, 1 − |o|*.09)       zIndex = round(40 − |o|*5)
 *   selected (|o|<.5) = full colour + gold ring + glow
 *   back cards        = opacity max(.3, 1 − |o|*.2)
 *   locked-ahead      = grayscale(.92) brightness(.8)   (member only, unselected)
 *
 * currentTierIndex === null → guest (no "Bạn ở đây" marker, no locked-ahead).
 * ==========================================================================*/
"use client";

import { useRef, useState } from "react";
import { getVipCopy, type Lang, type VipTierDef } from "@/lib/vip";
import styles from "./TierDeck.module.css";

/** px of horizontal drag that maps to one whole card step. */
const DRAG_PER_CARD = 120;
/** movement beyond this (px) is a drag, not a tap. */
const TAP_SLOP = 4;

export function TierDeck({
  tiers,
  selected,
  onSelect,
  currentTierIndex,
  lang,
}: {
  tiers: VipTierDef[];
  selected: number;
  onSelect: (index: number) => void;
  currentTierIndex: number | null;
  lang: Lang;
}) {
  const copy = getVipCopy(lang);
  const maxIndex = tiers.length - 1;

  // Live drag offset in px (0 when idle). Container never translates; this
  // only shifts effectiveSelected so each card recomputes its own transform.
  const [drag, setDrag] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const moved = useRef(false);

  const effectiveSelected = selected - drag / DRAG_PER_CARD;

  const clampIndex = (n: number) => Math.min(maxIndex, Math.max(0, n));

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    moved.current = false;
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const d = e.clientX - startX.current;
    if (Math.abs(d) > TAP_SLOP) moved.current = true;
    setDrag(d);
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const snapped = clampIndex(Math.round(selected - drag / DRAG_PER_CARD));
    setDrag(0);
    if (moved.current && snapped !== selected) onSelect(snapped);
  }

  return (
    <div className={styles.deck}>
      <div
        className={styles.stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {tiers.map((tier, i) => {
          const o = i - effectiveSelected;
          const abs = Math.abs(o);
          const isSelected = abs < 0.5;
          const isCurrent =
            currentTierIndex !== null && i === currentTierIndex;
          const lockedAhead =
            currentTierIndex !== null && i > currentTierIndex;
          const grayed = lockedAhead && !isSelected;

          const scale = Math.max(0.55, 1 - abs * 0.09);
          const opacity = isSelected ? 1 : Math.max(0.3, 1 - abs * 0.2);

          const style: React.CSSProperties = {
            backgroundImage: tier.grad,
            transform: `translate(-50%, -50%) translateX(${o * 78}px) translateY(${
              abs * 8
            }px) rotate(${o * 5}deg) scale(${scale})`,
            zIndex: Math.round(40 - abs * 5),
            opacity,
            filter: grayed ? "grayscale(0.92) brightness(0.8)" : undefined,
          };

          return (
            <button
              key={tier.id}
              type="button"
              className={[
                styles.card,
                isSelected ? styles.cardSelected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={style}
              aria-pressed={isSelected}
              aria-label={copy[tier.nameKey]}
              onClick={() => {
                if (moved.current) return; // was a drag, not a tap
                onSelect(i);
              }}
            >
              <span className={styles.sheen} aria-hidden="true" />
              <span className={styles.glyph} aria-hidden="true">
                ♛
              </span>
              {isCurrent && (
                <span className={styles.here}>{copy.youAreHere}</span>
              )}
              <span className={styles.face}>
                <span className={styles.cardName}>{copy[tier.nameKey]}</span>
                <span className={styles.cardLevels}>
                  {copy.levelWord} 1–10
                </span>
                <span className={styles.cardWager}>
                  {copy.needWager} {tier.unlock}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.dots} role="tablist" aria-label={copy.allTiers}>
        {tiers.map((tier, i) => {
          const active = i === Math.round(effectiveSelected);
          return (
            <button
              key={tier.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={copy[tier.nameKey]}
              className={`${styles.dot} ${active ? styles.dotActive : ""}`}
              onClick={() => onSelect(i)}
            />
          );
        })}
      </div>
    </div>
  );
}
