---
description: iGaming Surfaces - product/UX patterns for trustworthy real-money casino & sportsbook screens (lobby, live, odds board, bet slip, wallet, promos) for a Vietnamese-first Asian market.
---

# SKILL: IGAMING SURFACES

**Trigger:** When @designer or @dev-fe builds or iterates on any real-money casino/sportsbook screen, wallet flow, odds/bet surface, or VN-localized engagement feature.

---

## 1. SURFACE PATTERNS

### Game Lobby
- Aggregated tiles from many providers in a responsive grid (2-col mobile, 4-6 desktop). Fixed aspect ratio (3:4 portrait for slots) to prevent layout shift.
- Lazy-load tiles below the fold (IntersectionObserver); paginate or infinite-scroll in batches of ~24-36.
- Filter rails: provider, category (Slots / Live / Table / Crash / Fishing), and sort (Popular / New / A-Z). Filters are sticky and reflect in the URL for deep-linking.
- "Hot Games" / "Trending" row at top, horizontally scrollable, refreshed by real play volume not hardcoded.
- Search: instant fuzzy match on game + provider name; show recent searches; empty-state suggests popular titles.
- RTP micro-badge on the tile corner (e.g. `RTP 96.5%`) — small, low-contrast, never louder than the game art. Only show when the provider supplies a verified value.
- Tile hover/long-press: quick actions Play / Demo / Favorite (heart). Demo must be obviously labeled "Choi thu".

### Live Casino
- Table list as cards: live dealer video preview (muted autoplay loop or poster thumbnail), game type (Baccarat / Roulette / Sic Bo / Dragon Tiger).
- Bet-limit badge per table (`Min 10K - Max 50M ₫`) so players self-select before joining.
- Seat / spectator count chip (`7 dang choi`); disable "Join" and show "Ban day" when full, offer spectate.
- Dealer name + language tag (VN-speaking dealer is a strong draw — surface it).
- Reconnect overlay if the video stream drops; never silently freeze.

### Slots
- Same tile contract as lobby; group by provider and by mechanic (Megaways, Hold & Win, Jackpot).
- Surface jackpot pools live where the provider exposes them, formatted in VND.
- Launch flow: full-screen game iframe with a slim top bar (balance, back, deposit). Lock device to the game's native orientation.

### Sportsbook Odds Board
- Left/collapsible sport > league tree (Football > V.League, Premier League, ...). Persist the user's last-open branches.
- Live matches pinned to top with a `LIVE` pulse, current score, and match clock.
- Odds delta / line-movement indicator: flash green on up, red on down, then settle to neutral within ~1s. Suspend (grey, non-tappable) markets mid-update — never let a stale price be tappable.
- Market groups (1X2, Handicap, Over/Under) as tabs or accordions; default to the most-bet market.

### Bet Slip
- Sticky: bottom sheet on mobile, right rail on desktop. Badge with selection count when collapsed.
- Stake input: numeric keypad, quick-stake chips (50K / 100K / 500K), enforce min/max with inline messaging.
- Parlay (xien) toggle when 2+ selections; auto-detect conflicting legs and block them with a clear reason.
- Potential-win highlight: large, prominent, recalculated live as stake/odds change. Show total stake, total odds, potential payout.
- Odds-change handling: if a price moves before submit, surface "Accept new odds" rather than silently submitting.

### Wallet + Deposit / Withdraw
- Balance always visible in the header; tap opens wallet detail (real / bonus / locked balances split clearly).
- Deposit: method grid (bank transfer, e-wallet/Momo/ZaloPay, card, crypto), preset amounts, then confirmation. Show min/max and any fee before confirm.
- Withdraw: show available-to-withdraw (excluding locked bonus), estimated processing time, fees, and current KYC state up front.
- Transaction history with filter by type and status; pending items clearly badged.

### Promotions / Bonus Center
- Card per promo: art, headline, expiry countdown, CTA. Group Active / Available / Expired.
- Wagering progress bar (`Da cuoc 3.2M / 5M`) on every active bonus; tap reveals terms.
- Expiry urgency only when genuinely near (< 24h); never fake-urgent.

### VIP Club
- Tier ladder (Bronze -> Diamond) with a progress bar to the next tier and the exact points/turnover needed.
- Perks table per tier (cashback %, withdrawal limits, dedicated host, birthday bonus).
- Show current-period progress and what resets when.

### Winners Ticker
- Thin marquee or vertical feed: player handle (masked), game, win amount in VND. Mix real recent wins; throttle updates (see §5).

### Livestream
- Used for live sports / event hosting; player with adaptive bitrate, low-latency mode, and a chat/odds overlay. See §5 for bitrate fallback.

---

## 2. REAL-MONEY UX & TRUST

- **3-tap deposit:** open wallet -> pick method + amount -> confirm. Remember last method/amount. Never bury the deposit CTA.
- **Withdrawal transparency:** always show processing time, fees, and KYC status before the user commits. If KYC is incomplete, route to verification with a clear checklist, not a dead end.
- **Balance prominence + real-time update:** balance updates immediately after bet/win/deposit (optimistic UI + server reconcile). Animate the delta briefly so the change is felt.
- **Trust badges:** RTP and provably-fair / verified-result badges on relevant games; license + payment-partner logos in footer. Keep them factual and understated.
- **Responsible-gaming cues:** deposit-limit, reality-check, self-exclusion, and "play responsibly" surfaces. This skill covers their UX placement and tone; the rules, thresholds, and mandatory copy are owned by `guidelines/igaming-compliance.md` §3 — cross-reference it for any policy detail. Never design a real-money surface without checking that section.

---

## 3. VIETNAMESE LOCALIZATION

- **Currency (VND):** dot as thousands separator, `₫` suffix with a space: `1.500.000 ₫`. Use compact form for tickers/badges: `1,5M`, `250K`, `2,3T` (ty). Never show decimal dong.
- **Odds:** decimal odds are the default (`1.85`), not fractional/American. Allow a format toggle but ship decimal first.
- **Dates/time:** `DD/MM/YYYY` and 24h time (`20:30`). Match clocks and event start times to local VN time (UTC+7).
- **Copy tone:** Vietnamese-first, warm and direct ("Nap tien", "Rut tien", "Cuoc ngay"). Avoid stiff machine-translated phrasing; numbers and amounts read naturally in Vietnamese. English is secondary.

---

## 4. ENGAGEMENT / FOMO MECHANICS

- **Winners ticker:** social proof of real recent wins; keep handles masked, amounts in VND.
- **Jackpot alerts:** live-rising pool counters; a tasteful celebration moment when a big jackpot drops near the user's games.
- **Missions / daily rewards:** login streak, daily check-in, task progress with claimable rewards — drive habitual return without dark patterns.
- **VIP progress nudges:** "Con 200K turnover len Gold" — concrete, attainable next step.
- **Push / Zalo notifications:** Zalo is the primary VN channel; use for deposit confirmations, withdrawal status, bonus expiry, and big-win/jackpot moments. Respect frequency caps and opt-out; never spam loss-chasing prompts. Engagement must align with responsible-gaming rules in `guidelines/igaming-compliance.md` §3.

---

## 5. PERFORMANCE FOR VN MOBILE

- **Game thumbnails:** budget < 80KB each, WebP with `srcset`/`sizes` for DPR. Lazy-load below-fold; set explicit dimensions to avoid CLS.
- **Livestream:** adaptive bitrate with a ~500kbps low-quality fallback for flaky networks; prefer low-latency HLS/WebRTC; auto-step down before buffering, not after.
- **Odds-ticker throttling:** batch DOM updates (~100ms window / requestAnimationFrame) rather than per-message; coalesce multiple price changes per market into one paint. Use keyed diffing so only changed odds repaint.
- **Skeleton loaders:** for lobby grid, odds board, and wallet — never blank screens or full-page spinners.
- **Low-end Android / flaky network:** keep JS bundle lean and code-split per surface; debounce search; cache lobby + odds tree; tolerate dropped websocket frames with reconnect + resync. Test on a throttled 3G / low-RAM device profile.
- **Distribution:** offer a PWA (installable, offline shell) and a native APK side-load for markets where the app store is blocked; gate heavy assets so first paint stays fast on 3G.

---

## Quick Checklist
- [ ] Balance always visible; updates real-time after every money event.
- [ ] Deposit reachable in ≤ 3 taps; fees/limits shown before confirm.
- [ ] Withdrawal shows time, fees, KYC state up front.
- [ ] No stale tappable odds; suspend during line movement.
- [ ] VND formatted `1.500.000 ₫`; odds decimal `1.85`; dates `DD/MM/YYYY` 24h.
- [ ] Thumbnails < 80KB WebP; odds updates throttled ~100ms.
- [ ] Responsible-gaming cues present and cross-checked against `guidelines/igaming-compliance.md` §3.
