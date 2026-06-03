---
description: iGaming compliance, risk, player-protection and game-integrity standards for the Vietnamese-first casino + sportsbook platform
---

# RULE: IGAMING COMPLIANCE & RISK

**Mode:** Context-Triggered
**Scope:** @devops, @sa, @whitehat-hacker, @pm

**When to load:** Any feature touching deposits, withdrawals, KYC, player accounts, bonuses, bet placement/settlement, RNG, geo-gating, fund handling, or audit logging. Load alongside `igaming-market.md` (business context) and `penetration-testing.md` (the abuse playbook that tests these controls).

---

This platform operates in grey / offshore-licensed Asian markets (Vietnamese-first). Compliance is not optional polish — it is the license to operate. Controls MUST be enforced server-side. A UI-only control is treated as no control.

---

## §1 KYC & Identity

Tiered KYC. Friction scales with risk; never block signup with full verification, never allow withdrawal without it.

| Tier | Trigger | Data Collected | Gate |
|------|---------|----------------|------|
| Basic | Signup | Email/phone, self-declared DOB, country | Account creation |
| Standard | Before first withdrawal | Legal name, full DOB, address, government ID image | Withdrawal release |
| Enhanced (EDD) | High roller, AML trigger, cumulative threshold | Source-of-funds, proof of address, liveness/selfie match | Continued high-value play |

- **Age gate is mandatory and BEFORE any deposit.** 18+ minimum (21+ where jurisdiction requires). No deposit form renders for an unverified-age account.
- Document verification: validate ID document authenticity, match name/DOB to account, liveness check for EDD. Reject expired documents.
- PII handling:
  - Encrypt at rest (field-level for ID numbers/documents) and in transit (TLS 1.2+).
  - Segregate PII store from game/wager data — different schema/credentials, no JOIN-able link beyond an opaque player ID.
  - PII MUST never appear in logs, metrics, or error payloads (see `observability-standards.md`).
  - Enforce retention/deletion policy per jurisdiction.

## §2 AML & Transaction Monitoring

- **Threshold monitoring:** flag single and cumulative (rolling 24h / 7d / 30d) deposit and withdrawal totals exceeding configured limits.
- **Structuring detection:** rapid deposit-then-withdraw with little/no play ("pass-through"), and multiple sub-threshold deposits aggregating over threshold.
- **Source-of-funds checks:** required at EDD tier and on any AML flag before withdrawal release.
- **Sanctions / PEP screening:** screen at standard KYC and re-screen on list updates. A positive match freezes withdrawals pending manual review.
- **Crypto / USDT source verification:** screen deposit wallet against tainted-address / mixer / sanctioned-address lists; record chain, asset, tx hash; reject from flagged sources.
- **Velocity limits:** cap deposit count/value, withdrawal count/value, and payment-method changes per time window.
- Every flag generates an immutable case record routed to compliance review; never auto-release a flagged withdrawal.

## §3 Responsible Gaming (RG)

RG controls MUST be enforced at the API/server layer. The wager/deposit endpoint rejects the action — the UI hiding a button is insufficient.

- **Limits:** player-set deposit, loss, and session limits, plus operator hard caps. Limit decreases apply immediately; increases apply only after a cooling delay.
- **Self-exclusion & cooling-off:** cooling-off (24-72h) is a short pause; self-exclusion is longer/indefinite. During either, deposit and bet endpoints reject the account, marketing is suppressed, and the block survives logout, new device, and re-login. A self-excluded player attempting a new account MUST be matched (see §4) and blocked.
- **Reality-check / break prompts:** periodic session-duration and net-position prompts; offer a break/timeout action.
- **Messaging:** factual, non-patronizing, neutral tone. State facts and options; do not shame, scold, or guilt the player.

## §4 Anti-Fraud

One detection signal per vector (minimum — combine for confidence):

| Vector | Detection Signal |
|--------|------------------|
| Multi-accounting | Shared device fingerprint, IP/subnet, or payment-wallet across "distinct" accounts |
| Bonus / promo abuse | Deposit-bonus-withdraw with no real play; identical bet patterns claiming the same promo |
| Collusion (poker/casino) | Players consistently co-seated, chip-dumping flow, abnormal fold-to-one-player rates |
| Arbitrage betting | Opposing bets across markets/accounts that lock in a guaranteed margin; sharp line-move timing |
| Chargeback abuse | Deposit-then-dispute pattern; high chargeback ratio per player/method |
| Affiliate fraud (self-referral) | Referrer and referee share device/IP/payment fingerprint; referred accounts never genuinely play |
| Bot detection | Superhuman action cadence, zero input-timing variance, headless-browser/automation signatures |

Fingerprint on **device + wallet + behavioral** signals; a single signal warns, correlated signals act.

## §5 Game Integrity

- **RNG certification:** game RNG MUST be certified by a recognized test lab; store certificate reference and version.
- **Provably-fair audit trail:** for applicable games, persist server seed (hashed pre-round, revealed post-round), client seed, and nonce so outcomes are independently verifiable.
- **RTP transparency:** publish theoretical RTP per game to players.
- **Immutable bet-settlement ledger:** every wager, outcome, and settlement is append-only; corrections are compensating entries, never edits/deletes.
- **Payout audit trail:** each payout links to its originating bet, settlement, and approver/automation actor with timestamps.

## §6 Platform & Regulatory

- **Geo-blocking:** enforce by jurisdiction at the edge AND server; block restricted regions and detect VPN/proxy circumvention. Geo-decision is logged per session.
- **Data residency:** store player/PII data in the jurisdiction-required region; do not replicate restricted data across borders.
- **Player-fund segregation:** player balances are held separate from operating funds — separate ledger and, where required, separate accounts. Operating expenses MUST NOT draw from player-balance funds. Reconcile player-liability total against segregated funds.
- **Immutable audit logs:** append-only, tamper-evident logging for KYC decisions, AML flags, RG actions, fund movements, and admin actions.
- **Licensing posture:** align controls to the operating license (e.g., PAGCOR, Curaçao) — KYC/AML, RG tooling, RNG certification, and segregation requirements follow the strictest applicable jurisdiction.

---

## Compliance Ready Gate

@pm / @devops MUST verify ALL items before any iGaming feature ships:

- [ ] KYC enforced server-side at the correct tier (no withdrawal without standard KYC)
- [ ] Age gate (18+/21+) enforced BEFORE any deposit path
- [ ] RG limits (deposit/loss/session) honored at the API layer
- [ ] Self-excluded and cooling-off players blocked from deposit/bet across device and re-login
- [ ] AML threshold/velocity/sanctions screening active; flagged withdrawals never auto-released
- [ ] Bet-settlement and audit logs are append-only and immutable
- [ ] Geo-blocking and data-residency rules correct for target jurisdictions
- [ ] Player-fund segregation verified (player liabilities reconcile against segregated funds)
- [ ] PII encrypted at rest/in transit and absent from logs
- [ ] Anti-fraud signals (device/wallet fingerprint) wired for the feature's abuse surface

Cross-reference: `igaming-market.md` for market/business context; `penetration-testing.md` for the abuse playbook that exercises these controls.
