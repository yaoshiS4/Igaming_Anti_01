/* ============================================================================
 * Yaobet VIP page-group barrel (SPEC-03 §vip / §club). Pages import from
 * "@/components/vip". Each component composes ui/ primitives + the shared
 * token layer; turnover-to-next-tier is §F-gated (truthful-only).
 * ==========================================================================*/

export { CurrentTierCard } from "./CurrentTierCard";
export type { CurrentTierCardProps } from "./CurrentTierCard";

export { TierLadder } from "./TierLadder";
export type { TierLadderProps } from "./TierLadder";

export { PrivilegeTable } from "./PrivilegeTable";
export type { PrivilegeTableProps } from "./PrivilegeTable";

export { PerkGallery } from "./PerkGallery";
export type { PerkGalleryProps } from "./PerkGallery";

export { VipRules } from "./VipRules";

export { VipSection } from "./VipSection";
export type { VipSectionProps } from "./VipSection";

export { vipCopy } from "./copy";
