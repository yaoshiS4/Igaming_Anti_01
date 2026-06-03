# Product Constitution

> Immutable architectural principles governing all specification, planning, and implementation work.
> Amendments require explicit rationale, maintainer approval, and backwards-compatibility assessment.

---

## Article I — Casino UI-First Architecture
Every visual component MUST achieve a premium, luxury casino aesthetic. No "placeholder" or "MVP-looking" UI elements are acceptable. Use the established design token system (gold palette, glassmorphism, micro-animations) for all new components.

**Rationale:** This is a high-stakes iGaming platform competing with Stake.com and OKVip. Visual quality directly impacts user trust and deposit conversion rates.

## Article II — Mobile-First, Vietnamese-First
All UI decisions prioritize **mobile viewport** (86.6% of users) and **Vietnamese language** as the primary design target. Desktop is an enhancement, not the baseline. All user-facing text defaults to Vietnamese with English as secondary.

## Article III — Specification Before Code
No feature implementation shall begin without a written specification that defines:
1. **WHAT** the feature does (user stories with acceptance criteria)
2. **WHY** it exists (business value / user need)
3. All ambiguities marked with `[NEEDS CLARIFICATION]`

The specification is the **source of truth**. Code serves the specification.

## Article IV — Visual Regression Testing
All UI components MUST be verified visually after implementation:
1. Check for text contrast violations (no dark text on dark backgrounds)
2. Verify z-index stacking for sticky/fixed elements
3. Confirm responsive behavior at mobile (375px), tablet (768px), and desktop (1280px)
4. Validate that scrolling content never overlaps fixed labels

## Article V — Simplicity Gate
Before any implementation plan is approved:
- [ ] Using minimal number of new dependencies?
- [ ] No speculative "might need" features?
- [ ] No premature abstraction layers?
- [ ] Could this be simpler and still meet acceptance criteria?

Complexity MUST be justified in writing. Default to the simplest approach.

## Article VI — Theme Token Discipline
Every visual change MUST:
- Use design tokens from `index.css` (@theme block) — never hardcode hex colors
- Use the gold spectrum (gold, gold-bright, gold-glow, gold-dim) for all accent elements
- Use the established surface classes (section-rich, premium-card, glass-morphism)
- Maintain the dark-mode-only aesthetic (no light mode support needed)

## Article VII — Layout Integrity
CSS layout decisions MUST follow proven patterns:
- Sticky elements require their nearest scrolling ancestor to have NO overflow-x/overflow-y/overflow set to anything other than `visible`
- Scrolling content and static labels MUST be flexbox siblings, never absolute-positioned overlays
- Z-index stacking must follow the established hierarchy: Modals (z-100) > Header/BottomNav (z-50) > CatTabs (z-40) > WinnersTicker (z-30) > Content (z-0)
- All game/card containers must have adequate internal padding (minimum p-3 or p-4)

## Article VIII — Security by Default
- Zero hardcoded secrets or API keys
- All user inputs validated and sanitized
- CSP policies enforced in all builds
- Environment-specific configuration via env vars only

## Article IX — Component Independence
Each UI section (HotGamesGrid, LivestreamSection, WinnersTicker, etc.) should be independently renderable and testable. No circular component imports. Shared data from `mockData.js`, shared utilities from reusable hooks.

---

## Article X — Real-Money Transaction Integrity
Every balance-affecting operation (deposit, bet, settlement, bonus grant, withdrawal) MUST be **atomic, idempotent, and recorded in an immutable, auditable ledger**. Balances are authoritative on the server only — never trust client-supplied balances or outcomes.

**Rationale:** Real money and regulatory exposure make silent ledger drift or double-settlement existential, not cosmetic.

## Article XI — Identity & Age Gate
No deposit or wager is permitted before **18+ age verification** and the appropriate **KYC tier** (see `.agent/guidelines/igaming-compliance.md` §1). Withdrawals require at least standard KYC. The gate is enforced server-side.

## Article XII — Player-Fund Segregation
Player balances MUST be accounted **separately from operating funds**, and withdrawable cash MUST be tracked distinctly from bonus/locked funds. Wagering-requirement state is explicit, never inferred at display time.

## Article XIII — Provably-Fair & RTP Transparency
Game outcomes derive from **certified RNG**; RTP/odds and a fairness-verification path MUST be surfaced to the player before they wager. Bet settlement is deterministic and auditable.

## Article XIV — Responsible Gaming by Default
Deposit/loss/session limits, self-exclusion, and cooling-off MUST be **enforced server-side** (not UI-only), per `.agent/guidelines/igaming-compliance.md` §3. Responsible-gaming messaging is clear and non-patronizing.

## Article XV — Jurisdiction & Data Residency
Access is gated by **geo/licensing posture**; out-of-jurisdiction and self-excluded players are blocked. Player PII follows data-residency rules and all financial events are retained in immutable audit logs.

---

## Amendment Log

| Date | Article | Change | Rationale |
|------|---------|--------|-----------|
| 2026-03-27 | All | Initial constitution created | Adopted spec-kit governance pattern for product-level principles |
| 2026-05-26 | All | Rewritten for iGaming platform | Original lich-viet calendar constitution replaced with iGaming-specific architectural principles |
| 2026-06-02 | X-XV | Added real-money integrity, identity/age gate, fund segregation, provably-fair/RTP, responsible gaming, and jurisdiction/data-residency articles | Encode operator-grade iGaming compliance into product principles |
