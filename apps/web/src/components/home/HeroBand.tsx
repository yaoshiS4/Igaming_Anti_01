/* ============================================================================
 * HeroBand — J9-EXACT hero/banner block (defect-2 rebuild).
 * ----------------------------------------------------------------------------
 * A pixel-faithful rebuild of J9's `.banner-box` swiper. Three full-bleed
 * banner slides (the user's licensed /assets/banners/* JPGs, native ~2.5:1)
 * rendered `object-fit:cover`. The banner art is SELF-CONTAINED — the slide is
 * JUST the image (defect-2: no overlay title/category/CTA, only an invisible
 * full-bleed link). Then — INSIDE the same block — J9's two below-the-banner
 * surfaces, kept SNUG to the banner (defect-3) and EDGE-ALIGNED to it
 * (defect-4):
 *
 *   (a) ANIMATED PROGRESS-LINE indicator (J9 swiper pagination, theme #007aff):
 *       a thin full-width track with one NODE DOT per slide; the active node is
 *       a larger filled BLUE dot and a BLUE SEGMENT advances rightward over the
 *       autoplay dwell toward the next node. Each node is also the navigation —
 *       a clickable tab (arrows removed, defect 2).
 *
 *   (b) SWIPEABLE: pointer/touch drag on the viewport flicks between slides
 *       (J9 swiper drag); a short throw past a threshold commits the turn.
 *
 *   (c) PROMO NAVIGATOR row (J9 below-hero items): the under-hero items ARE the
 *       hero slides (1:1 — 3 banners → 3 items), NOT a separate card list.
 *       Each item is a de-carded thumb + short title in a horizontal row on the
 *       track (no border/box/background). Tapping item i navigates the hero to
 *       slide i; the active item syncs with the current slide + progress node.
 *
 * Reduced-motion (A11/F5): autoplay OFF, the blue segment renders STATIC
 * (filled only up to the active node, no advancing animation), drag still
 * works, nodes remain clickable. Never blocks LCP (first banner eager, rest
 * lazy).
 *
 * Slides carry a real promo `href`; tapping routes to the live promo page.
 * UI-only / mock — no BE, no fabricated stats. The navigator row is derived
 * 1:1 from the same `slides` array (no separate fixture).
 * ==========================================================================*/

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Promo } from "@/lib/types";
import { usePrefersReducedMotion } from "@/lib/rg";
import styles from "./HeroBand.module.css";

/** Autoplay dwell per slide — drives BOTH the timer and the fill duration. */
const DWELL_MS = 6000;
/** Drag distance (px) past which a release commits to the next/prev slide. */
const SWIPE_THRESHOLD = 48;

export interface HeroBandProps {
  slides: Promo[];
}

export function HeroBand({ slides }: HeroBandProps) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /** Re-mount key for the fill animation so it restarts cleanly each turn. */
  const [tick, setTick] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // pointer-drag state (J9 swiper drag)
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const [dragDX, setDragDX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const count = slides.length;
  const go = useCallback(
    (i: number) => {
      setIndex(((i % count) + count) % count);
      setTick((t) => t + 1); // restart the progress fill from 0
    },
    [count],
  );

  // autoplay — OFF under reduced-motion / paused / while dragging / single slide.
  useEffect(() => {
    if (reduced || paused || dragging || count <= 1) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
      setTick((t) => t + 1);
    }, DWELL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduced, paused, dragging, count, tick]);

  /* ---- pointer/touch drag ----------------------------------------------- */
  const onPointerDown = (e: React.PointerEvent) => {
    if (count <= 1) return;
    dragStartX.current = e.clientX;
    setDragging(true);
    setPaused(true);
    viewportRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    setDragDX(e.clientX - dragStartX.current);
  };
  const endDrag = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    setDragging(false);
    setDragDX(0);
    setPaused(false);
    if (dx <= -SWIPE_THRESHOLD) go(index + 1);
    else if (dx >= SWIPE_THRESHOLD) go(index - 1);
    else setTick((t) => t + 1); // snap back, restart dwell
  };

  // empty → one honest branded placeholder slide (never blank/fabricated).
  if (count === 0) {
    return (
      <section className={styles.hero} aria-label="Khuyến mãi nổi bật">
        <div className={styles.viewport}>
          <div className={`${styles.slide} ${styles.slotEmpty}`} aria-hidden>
            <span className={styles.slotLabel}>Yaobet</span>
          </div>
        </div>
      </section>
    );
  }

  // live drag offset layered onto the base per-cell translate. The drag delta
  // is a raw pixel value (no ref read during render — A11/react-hooks/refs).
  const trackStyle: React.CSSProperties = {
    transform: `translateX(calc(-${index * 100}% + ${dragging ? dragDX : 0}px))`,
    transition: dragging ? "none" : undefined,
  };

  return (
    <section
      className={styles.hero}
      aria-label="Khuyến mãi nổi bật"
      aria-roledescription="carousel"
    >
      <div
        ref={viewportRef}
        className={styles.viewport}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ul className={styles.track} style={trackStyle}>
          {slides.map((s, i) => (
            <li
              key={s.id}
              className={styles.cell}
              aria-hidden={i !== index}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
            >
              {/* The banner art is self-contained (defect-2): the slide is JUST
               *  the full-bleed image. No overlay title/category/CTA — only an
               *  invisible full-bleed link routing to the promo. aria-label
               *  carries the promo title for screen readers (no visible text). */}
              <a
                href={s.href}
                className={`${styles.slide} ${s.imageSrc ? "" : styles.slot}`}
                aria-label={s.title}
                tabIndex={i === index ? 0 : -1}
                draggable={false}
                onClick={(e) => {
                  // a real drag suppresses the click-through navigation
                  if (Math.abs(dragDX) > 4) e.preventDefault();
                }}
              >
                {s.imageSrc && (
                  <img
                    className={styles.slideImg}
                    src={s.imageSrc}
                    alt=""
                    aria-hidden
                    draggable={false}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* (a) J9 PROGRESS-LINE indicator — a thin full-width track with one node
       *  dot per slide; the ACTIVE node is a larger filled BLUE dot whose blue
       *  segment ADVANCES rightward over the autoplay dwell toward the next
       *  node (J9 swiper #007aff). Each node is the clickable navigation
       *  (defect-2: no arrows). Static under reduced-motion. */}
      {count > 1 && (
        <div
          className={styles.progress}
          role="tablist"
          aria-label="Chọn khuyến mãi"
          style={{ "--n": count } as React.CSSProperties}
        >
          {/* the continuous base track behind the nodes (spans first→last node
           *  center; CSS resolves the endpoints from --n on each layout). */}
          <span className={styles.rail} aria-hidden />
          {/* the advancing blue fill anchored at the first node's center. Its
           *  width = the active node's center offset; over the dwell it grows
           *  one more inter-node span toward the next node. The endpoints are
           *  derived from the SAME N-column grid as the nodes/thumbs (FIX 2),
           *  so the active fill always lands under the active node. */}
          <span
            key={`seg-${index}-${tick}`}
            className={[styles.railFill, reduced ? styles.railFillStatic : ""].join(" ")}
            aria-hidden
            style={{
              // --seg-i = active column index; --seg-dur drives the advance.
              // CSS turns --seg-i into the node's center x via the grid math.
              "--seg-i": index,
              "--seg-dur": reduced ? "0ms" : `${DWELL_MS}ms`,
            } as React.CSSProperties}
          />
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Khuyến mãi ${i + 1}`}
              className={[styles.node, i <= index ? styles.nodeOn : ""].join(" ")}
              onClick={() => go(i)}
            >
              <span className={styles.dot} aria-hidden />
            </button>
          ))}
        </div>
      )}

      {/* (c) Promo NAVIGATOR row — the under-hero items ARE the hero slides
       *  (1:1, same promotions), derived from the SAME `slides` array. J9-style:
       *  a de-carded thumb + short title in a horizontal row on the track (NO
       *  border/box/background). Tapping item i navigates the hero to slide i;
       *  the active item syncs with the current slide + the progress-line node.
       *  Horizontally scrollable on narrow viewports so the page never scrolls
       *  sideways. */}
      {count > 1 && (
        <ul
          className={styles.nav}
          aria-label="Chọn khuyến mãi"
          role="tablist"
          style={{ "--n": count } as React.CSSProperties}
        >
          {slides.map((s, i) => (
            <li key={s.id} className={styles.navCell}>
              <button
                type="button"
                role="tab"
                aria-selected={i === index}
                className={[styles.navItem, i === index ? styles.navItemOn : ""].join(" ")}
                onClick={() => go(i)}
              >
                <span className={styles.navThumb}>
                  {s.imageSrc && (
                    <img src={s.imageSrc} alt="" aria-hidden loading="lazy" />
                  )}
                </span>
                <span className={styles.navTitle}>{s.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
