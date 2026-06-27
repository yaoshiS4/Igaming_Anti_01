/* ============================================================================
 * Yaobet — lib/format (SPEC-04 §1.3 / 0.4)
 * ----------------------------------------------------------------------------
 * The SINGLE implementation of: VND formatting (1.234.567 ₫), the lucky-6/8 +
 * digit-4-taboo rules, odds and tabular-numeral display.
 *
 * COMPLIANCE LINE (SPEC-02 §8 / Decree-174): lucky-digit discipline applies to
 * MARKETING numerals ONLY (suggested deposit chips, decorative counters). A
 * ledger / odds / OTP / payout / balance value is NEVER massaged. The two
 * functions are deliberately separated so a caller cannot accidentally launder
 * a real figure through the lucky path.
 * ==========================================================================*/

import type { MoneyValue, LiveMoney, AnyMoney } from "./types";

/** Group digits VN-style: 1234567 → "1.234.567". */
function groupVnd(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const whole = Math.abs(Math.trunc(amount));
  const grouped = whole
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}${grouped}`;
}

/** Format a TRUTHFUL VND figure: "1.234.567 ₫". Never lucky-massaged. */
export function formatVnd(value: AnyMoney | number): string {
  const amount = typeof value === "number" ? value : value.amount;
  return `${groupVnd(amount)} ₫`;
}

/** Signed VND for ledger rows: "+1.234.567 ₫" / "-50.000 ₫". */
export function formatSignedVnd(value: AnyMoney | number): string {
  const amount = typeof value === "number" ? value : value.amount;
  const sign = amount > 0 ? "+" : "";
  return `${sign}${formatVnd(amount)}`;
}

/** Decimal odds, tabular, 2dp: 1.85 → "1.85". Truthful — never massaged. */
export function formatOdds(odds: number): string {
  return odds.toFixed(2);
}

/** Plain grouped count (points, participant counts): 12345 → "12.345". */
export function formatCount(n: number): string {
  return groupVnd(n);
}

/* ----------------------------------------------------------------------------
 * LUCKY DISCIPLINE — MARKETING NUMERALS ONLY.
 * digit-4 taboo (避4) + 6/8 favoured (喜6喜8). Use for suggested-amount chips,
 * decorative counters — NEVER a real ledger/odds/OTP/payout/balance value.
 * --------------------------------------------------------------------------*/

/** True if the integer part contains the taboo digit 4 (for payout-display lint). */
export function hasDigitFour(amount: number): boolean {
  return /4/.test(Math.abs(Math.trunc(amount)).toString());
}

/**
 * Curated lucky deposit-suggestion presets (marketing). Favours 6/8, avoids 4.
 * These are SUGGESTIONS shown as chips; the user's actual entered amount is
 * formatted via formatVnd and never altered.
 */
export const LUCKY_DEPOSIT_PRESETS: readonly number[] = [
  100_000, 188_000, 288_000, 588_000, 688_000, 888_000, 1_688_000, 6_888_000,
] as const;

/** Format a marketing preset for a chip label: 688000 → "688K", 6888000 → "6.888K". */
export function formatPresetChip(amount: number): string {
  return `${groupVnd(Math.round(amount / 1000))}K`;
}

/** Helper: is a marketing numeral "lucky-safe" (no digit-4)? */
export function isLuckySafe(amount: number): boolean {
  return !hasDigitFour(amount);
}

/* ----------------------------------------------------------------------------
 * FRESHNESS — the stale-stop seam (SPEC-03 F4). A live value past its
 * server-declared freshness window must be marked stale, not shown as live.
 * --------------------------------------------------------------------------*/

/** True iff a LiveMoney/Live value is past its freshness window relative to now. */
export function isStale(sourcedAt: string, freshnessMs: number, now: number = Date.now()): boolean {
  const sourced = new Date(sourcedAt).getTime();
  return now - sourced > freshnessMs;
}

/** Re-export the money type guard at the format boundary for convenience. */
export type { MoneyValue, LiveMoney, AnyMoney };
