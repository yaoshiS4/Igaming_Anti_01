"use client";

/* ============================================================================
 * QuickActionRail — J9 floating right-edge QUICK-ACTION RAIL (the `.service` /
 * `toTop` suspended column on j9.com). Fixed to the viewport's right edge on
 * desktop; on mobile (<1024px) it collapses to the bare icon stack only (no
 * promo cards), staying out of the BottomTabBar's way.
 *
 * COMPACT (J9-exact): a narrow column the width of one icon button + small
 * promo cards — NOT a wide marketing panel.
 *
 * Stack, top → bottom (J9 order):
 *   1. World-Cup promo thumbnail — DISMISSABLE via a corner × (session-persisted).
 *   2. Super-jackpot promo card  — a LUCKY-SAFE jackpot figure (6/8, no 4) + a
 *      gold "Quay ngay" CTA. The figure is DATA-BOUND (passed in / mock), never
 *      animated/extrapolated — Decree-174 truthful-only. Also DISMISSABLE.
 *   3. Icon stack: trophy (giải đấu), QR (tải app), CSKH headset (hỗ trợ),
 *      back-to-top (^).
 *
 * UI-ONLY: no network, mock data. Opaque surfaces, reduced-motion safe,
 * z-index strictly below --z-modal so dialogs always cover it.
 * ==========================================================================*/

import { useCallback, useEffect, useState } from "react";
import { formatVnd, isLuckySafe } from "@/lib/format";
import styles from "./QuickActionRail.module.css";

/* ---- mock, truthful-shaped data (would arrive via §F Envelope in real BE) ---- */

/** Super-jackpot pool — a resting, lucky-safe figure (888… favours 6/8, no 4). */
const JACKPOT_POOL = 8_688_888_000;

/** sessionStorage keys — dismissals persist for the browser session only. */
const SS_PROMO = "yb.rail.promo.dismissed";
const SS_JACKPOT = "yb.rail.jackpot.dismissed";

/** Read a session dismissal flag (SSR-safe; defaults to "not dismissed"). */
function readDismissed(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/** Persist a session dismissal flag (best-effort; storage may be unavailable). */
function persistDismissed(key: string): void {
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {
    /* ignore — private mode / quota; dismissal still holds for this mount */
  }
}

export function QuickActionRail() {
  // Start shown on both server + first client paint (avoids hydration mismatch),
  // then reconcile from sessionStorage after mount.
  const [showPromo, setShowPromo] = useState(true);
  const [showJackpot, setShowJackpot] = useState(true);
  const [openPanel, setOpenPanel] = useState<"qr" | "cskh" | null>(null);

  useEffect(() => {
    if (readDismissed(SS_PROMO)) setShowPromo(false);
    if (readDismissed(SS_JACKPOT)) setShowJackpot(false);
  }, []);

  const dismissPromo = useCallback(() => {
    setShowPromo(false);
    persistDismissed(SS_PROMO);
  }, []);

  const dismissJackpot = useCallback(() => {
    setShowJackpot(false);
    persistDismissed(SS_JACKPOT);
  }, []);

  const backToTop = useCallback(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, []);

  // Jackpot figure is a marketing numeral → must be lucky-safe; fall back to a
  // safe constant rather than ever rendering a taboo (digit-4) display value.
  const jackpot = isLuckySafe(JACKPOT_POOL) ? JACKPOT_POOL : 8_888_888_000;

  return (
    <aside className={styles.rail} aria-label="Thao tác nhanh">
      {/* ---------- 1 · World-Cup promo thumbnail (dismissable) ---------- */}
      {showPromo && (
        <div className={styles.promoThumb}>
          <button
            type="button"
            className={styles.promoClose}
            aria-label="Đóng quảng cáo World Cup"
            onClick={dismissPromo}
          >
            ×
          </button>
          <a className={styles.promoLink} href="/khuyen-mai" aria-label="Khuyến mãi World Cup">
            <img
              src="/assets/banners/pc-hero-banner-UCLfinal.jpg"
              alt="Khuyến mãi mùa giải lớn"
              className={styles.promoImg}
              width={64}
              height={48}
              loading="lazy"
            />
            <span className={styles.promoTag}>World Cup</span>
          </a>
        </div>
      )}

      {/* ---------- 2 · Super-jackpot promo card (dismissable) ---------- */}
      {showJackpot && (
        <section className={styles.jackpotCard} aria-label="Hũ vàng siêu cấp">
          <button
            type="button"
            className={styles.promoClose}
            aria-label="Đóng hũ vàng siêu cấp"
            onClick={dismissJackpot}
          >
            ×
          </button>
          <p className={styles.jackpotKicker}>Hũ vàng</p>
          <p className={styles.jackpotFigure}>{formatVnd(jackpot)}</p>
          <a className={styles.jackpotCta} href="/khuyen-mai">
            Quay ngay
          </a>
        </section>
      )}

      {/* ---------- 3 · Icon stack ---------- */}
      <nav className={styles.iconStack} aria-label="Tiện ích nhanh">
        {/* trophy / tournaments */}
        <a className={styles.iconBtn} href="/tier" aria-label="Giải đấu">
          <TrophyIcon />
          <span className={styles.iconLabel}>Giải đấu</span>
        </a>

        {/* QR / app download (popover) */}
        <div
          className={styles.iconGroup}
          onMouseEnter={() => setOpenPanel("qr")}
          onMouseLeave={() => setOpenPanel((p) => (p === "qr" ? null : p))}
        >
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Tải ứng dụng"
            aria-expanded={openPanel === "qr"}
            onClick={() => setOpenPanel((p) => (p === "qr" ? null : "qr"))}
          >
            <QrIcon />
            <span className={styles.iconLabel}>Tải app</span>
          </button>
          {openPanel === "qr" && (
            <div className={styles.popover} role="dialog" aria-label="Tải ứng dụng">
              <div className={styles.qrBox} aria-hidden="true">
                <QrGlyph />
              </div>
              <p className={styles.popoverText}>Quét mã để tải ứng dụng</p>
            </div>
          )}
        </div>

        {/* CSKH / headset support (popover) */}
        <div
          className={styles.iconGroup}
          onMouseEnter={() => setOpenPanel("cskh")}
          onMouseLeave={() => setOpenPanel((p) => (p === "cskh" ? null : p))}
        >
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Chăm sóc khách hàng"
            aria-expanded={openPanel === "cskh"}
            onClick={() => setOpenPanel((p) => (p === "cskh" ? null : "cskh"))}
          >
            <HeadsetIcon />
            <span className={styles.iconLabel}>CSKH</span>
          </button>
          {openPanel === "cskh" && (
            <div className={styles.popover} role="dialog" aria-label="Chăm sóc khách hàng">
              <p className={styles.popoverHead}>Hỗ trợ 24/7</p>
              <p className={styles.popoverText}>Trực tuyến mọi lúc, mọi nơi</p>
            </div>
          )}
        </div>

        {/* back-to-top */}
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Lên đầu trang"
          onClick={backToTop}
        >
          <CaretUpIcon />
          <span className={styles.iconLabel}>Lên đầu</span>
        </button>
      </nav>
    </aside>
  );
}

/* ---- inline glyphs (no external requests; currentColor = gold/dim per state) ---- */

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M7 4h10v3a5 5 0 0 1-10 0V4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M10 13h4M9 20h6M12 14v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 14h2v2M20 14v6h-6M18 18h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M5 13v-1a7 7 0 0 1 14 0v1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="3" y="12" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="17" y="12" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M19 18v1a3 3 0 0 1-3 3h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CaretUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="m6 14 6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QrGlyph() {
  // Decorative QR placeholder (no real payload) — pure CSS-grid blocks.
  return (
    <svg viewBox="0 0 40 40" width="96" height="96" aria-hidden="true">
      <rect width="40" height="40" fill="#fff" />
      <g fill="#171a21">
        <path d="M4 4h10v10H4zM6 6v6h6V6z" />
        <rect x="7" y="7" width="4" height="4" />
        <path d="M26 4h10v10H26zM28 6v6h6V6z" />
        <rect x="29" y="7" width="4" height="4" />
        <path d="M4 26h10v10H4zM6 28v6h6v-6z" />
        <rect x="7" y="29" width="4" height="4" />
        <rect x="18" y="4" width="3" height="3" />
        <rect x="18" y="10" width="3" height="3" />
        <rect x="18" y="18" width="3" height="3" />
        <rect x="26" y="18" width="3" height="3" />
        <rect x="33" y="18" width="3" height="3" />
        <rect x="18" y="26" width="3" height="3" />
        <rect x="26" y="26" width="3" height="3" />
        <rect x="33" y="33" width="3" height="3" />
        <rect x="26" y="33" width="3" height="3" />
      </g>
    </svg>
  );
}
