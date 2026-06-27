/* ============================================================================
 * Yaobet — promo feature barrel (SPEC-03 §promo; SPEC-04 Wave 7.3). The
 * promotions page group (khuyen-mai): hero + filterable grid + single-promo
 * detail. Composes ui/* primitives over the token layer; auth-aware CTAs route
 * guests through openAuthModal. Engagement layer (wheel/leaderboard/tasks) is
 * intentionally NOT built — gated, real-data-only (Wave 7.3 Done-When).
 * ==========================================================================*/

export { PromoHero } from "./PromoHero";
export type { PromoHeroProps } from "./PromoHero";

export { PromoGrid } from "./PromoGrid";
export type { PromoGridProps } from "./PromoGrid";

export { PromoDetail } from "./PromoDetail";
export type { PromoDetailProps } from "./PromoDetail";
