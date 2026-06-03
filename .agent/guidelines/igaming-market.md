---
description: Asian iGaming business/market/GTM operator knowledge — load for monetization, market-sizing, competitor, distribution, and financial-model work
---

# RULE: iGaming Market & GTM (Asia)

## When to load this guideline
Load when @biz, @ba, or @pm reason about money, markets, or growth — NOT generic SaaS playbooks. Triggers:
- Monetization, unit economics, pricing, bonus/promo design, financial models.
- TAM/SAM/SOM or market-sizing by country or product.
- Competitor analysis or positioning.
- Distribution: affiliates, agents, KOLs, payment rails.
For licensing/AML/risk detail, cross-reference `igaming-compliance.md` — this file frames compliance as a GTM lever, that file owns the risk mechanics.

---

## 1. Unit Economics

This is a gambling business, not a subscription business. Revenue is the statistical edge over wagering volume, not a recurring fee. Model accordingly.

### Core revenue definitions
| Term | Definition | Notes |
|---|---|---|
| **Handle / turnover** | Total amount wagered | Gross volume, NOT revenue |
| **GGR** | Gross Gaming Revenue = bets − wins paid | The house's gross take |
| **NGR** | Net Gaming Revenue = GGR − bonuses − payment fees − gaming taxes/fees | The real top line for P&L |
| **Hold / margin %** | GGR ÷ handle | Casino slots ~3-6%; sportsbook ~5-8% net hold; live casino ~2-4% |
| **ARPU** | NGR ÷ active players | Blended; skewed by whales |
| **ARPPU** | NGR ÷ paying (depositing) players | Always higher than ARPU |
| **FTD** | First-Time Deposit — the activation event | The single most important conversion milestone |

### Deposit conversion funnel
Track this funnel, not a generic signup funnel. Typical industry ranges (grey-market, paid-traffic):

| Stage | Typical conversion to next |
|---|---|
| Visit → Register | 5-15% |
| Register → FTD | 20-40% |
| FTD → Active (2nd deposit / retained) | 30-50% |

A registered user who never makes an FTD has ~zero value. Optimize aggressively for the register→FTD step (low min-deposit, fast KYC-lite onboarding, welcome bonus).

### Bonus, rakeback, cashback
- **Bonus cost** typically runs **15-35% of NGR**; aggressive acquisition cohorts can spike higher. Watch bonus abuse (multi-accounting, arbitrage).
- **Rakeback / cashback** (returning a % of losses or rake) is a core retention lever, common **5-20%** scaled by VIP tier. It directly reduces NGR but lifts retention/LTV.
- Net bonus efficiency = incremental NGR per bonus dollar. A bonus that only subsidizes existing whales is wasted.

### Whale concentration
Revenue is extremely concentrated. **Top ~5-10% of players typically drive ~60-80% of NGR.** Implications:
- VIP/host programs, personal account managers, and fast withdrawals for high-rollers are not perks — they are core revenue protection.
- A single whale churning can move monthly NGR materially. Track whale-level retention separately.

### Churn & reactivation by VIP tier
| Tier | Behavior | Typical monthly churn | Reactivation lever |
|---|---|---|---|
| Bronze / casual | Low deposit, bonus-hunting | 40-60% | Free spins, reload bonus |
| Silver / regular | Steady play | 20-35% | Cashback, tournaments |
| Gold / VIP | High volume | 10-20% | Personal host, custom limits |
| Whale / diamond | Dominant NGR share | 5-12% | Dedicated VIP manager, bespoke terms, instant withdrawals |

### CAC / LTV for gambling
- **LTV ≈ ARPPU × expected player lifetime (months) × margin**, net of bonus and rakeback. Lifetime is short and front-loaded — most LTV lands in the first weeks post-FTD.
- **CAC** via paid + affiliate is high in restricted markets; aim for **LTV:CAC ≥ 3:1** at cohort maturity, but payback is what kills cashflow — target FTD-revenue payback within the first cohort weeks.

### Worked example
Cohort: 10,000 visits.
- Register 10% → 1,000 registrations.
- FTD 30% → 300 FTDs.
- Avg handle/player/month: $400; blended hold 5% → GGR/player $20/mo.
- Active 3 months avg → GGR/player lifetime $60; 300 players → $18,000 GGR.
- Less bonuses (25% of NGR), payment fees (3%), gaming tax/fees (10%): NGR ≈ GGR × ~0.62 ≈ **$11,160 NGR**.
- If CAC = $25/FTD → spend $7,500; LTV:CAC ≈ 1.5:1 here — too thin. Whale capture in the cohort is what flips it: a single whale at $2,000+ NGR re-rates the whole cohort.

---

## 2. Market & Regulation (Asia)

Compliance posture IS a GTM lever, not an afterthought. See `igaming-compliance.md` for risk mechanics.

- **Grey / offshore reality:** Most Asian markets (Vietnam, Thailand, Indonesia, Malaysia) restrict or ban online gambling for residents. Operators serve these markets from **offshore** under foreign licenses. The Philippines is the notable hub via PAGCOR (with POGO/offshore nuance).
- **Licensing as trust signal:** A visible **PAGCOR**, **Curaçao**, or **Isle of Man** license is a competitive differentiator — players associate it with payout reliability and fair RNG. Higher-tier jurisdictions (IoM, Malta) signal more trust but cost more and impose stricter rules.
- **Geo-domain blocking:** ISPs/regulators block primary domains. Run a **mirror / backup domain** strategy: rotating domains, short-link redirectors, and in-app domain-update mechanisms so users always reach a live site.
- **App-store evasion:** Apple/Google reject real-money gambling apps in restricted regions. Distribute via **direct APK download** (Android) and **PWA** (installable web app) rather than store listings.

---

## 3. Distribution

Acquisition is relationship- and network-driven, not just paid search. **Affiliates + agents typically drive 40-60% of acquisition.**

### Affiliate networks
| Model | How it pays | Best for |
|---|---|---|
| **Revenue-share** | % of player NGR for life (typ. 25-45%) | Long-term, aligns incentives |
| **CPA** | Flat fee per qualified FTD (typ. $20-150) | Volume traffic, fast payback |
| **Hybrid** | Lower CPA + lower rev-share | Balances risk both ways |

### Master-agent / sub-agent hierarchy
Distinct from Western affiliates: a **tiered agent tree**. A master agent recruits sub-agents who recruit players; commissions split down the chain.
- Master agent earns on total downline NGR; passes a **tiered split** to sub-agents (e.g., master keeps 10-15%, sub-agent gets 25-40% rev-share).
- Agents often handle **cash-in/out** locally, blurring distribution and payments. This is dominant in Vietnam, Cambodia, the Philippines.

### KOL, Telegram/Zalo, SEO
- **KOLs / influencers** drive social proof and FTDs, often paid hybrid.
- **Telegram and Zalo** (Zalo is the dominant Vietnamese messenger) are primary channels for promos, mirror-domain updates, and agent coordination — partly because mainstream ad platforms ban gambling.
- **SEO** in restricted markets focuses on brand + mirror-domain terms and affiliate review sites, since paid gambling ads are blocked on Google/Meta.

---

## 4. Payment Rails

Payment friction is a direct, measurable LTV and conversion lever. Slow or failed withdrawals destroy trust faster than any product flaw.

| Rail | Use | Notes |
|---|---|---|
| **Local bank transfer** | Deposits/withdrawals | Ubiquitous, but slow; often via rotating bank accounts |
| **E-wallets (MoMo, ZaloPay)** | Vietnam deposits | Fast, mobile-first, high trust locally |
| **USDT / crypto** | Cross-border, whales, evasion | Avoids banking blocks; growing fast |
| **Agent cash-in/out** | Offline/unbanked | Agent network doubles as payment layer |

- **Friction → conversion:** Every extra step or failed deposit drops the register→FTD rate. Min-deposit size and rail availability gate the funnel.
- **Withdrawal speed is the #1 trust signal.** "Instant" or sub-hour withdrawals are a marketed differentiator and a retention driver — especially for VIPs. Slow withdrawals trigger churn and damaging community reputation (Telegram/forums).

---

## 5. Competitor Set

| Brand | Positioning | License jurisdiction | Payment breadth | Hero products |
|---|---|---|---|---|
| **Stake** | Premium global crypto-first | Curaçao | Crypto-heavy + fiat | Casino, Originals, sportsbook |
| **BK8** | Asia-focused, heavy marketing | Curaçao / PAGCOR | Local bank, e-wallet, crypto | Casino, slots, sportsbook |
| **Fun88** | Established Asia, sports-led | Isle of Man / Curaçao | Local rails broad | Sportsbook, live casino |
| **M88 (Mansion88)** | Veteran Asia sportsbook | Isle of Man / Curaçao | Local rails broad | Sportsbook, live casino |
| **W88** | Mass-market Asia | Curaçao / PAGCOR | Local bank, e-wallet | Sportsbook, casino, lottery |
| **Dafabet** | Premium, sponsorship-driven | PAGCOR / Curaçao | Broad multi-rail | Sportsbook, casino, poker |
| **1xBet** | Aggressive global, huge market breadth | Curaçao | Crypto + very broad fiat | Sportsbook, casino, prematch/live |
| **OKVip** | Vietnam-centric affiliate/agent alliance | Offshore | Local bank, e-wallet, crypto | Casino, sportsbook (multi-brand network) |

Positioning takeaway: Western/crypto players (Stake) compete on transparency and product; Asia incumbents (BK8, W88, Fun88, M88, Dafabet) compete on local payment breadth, agent networks, and withdrawal speed.

---

## 6. Market Segmentation (TAM / SAM / SOM)

Asian markets are NOT homogeneous — regulation, payment habits, and product preference differ sharply by country. Size each separately; never aggregate into one "Asia" number.

### By country (qualitative posture — size each with current data)
| Country | Regulatory posture | Dominant rails | Product lean |
|---|---|---|---|
| **Vietnam** | Banned for residents; large offshore demand | Local bank, MoMo, ZaloPay, USDT | Sportsbook (football), live casino |
| **Philippines** | Regulated hub (PAGCOR); offshore nuance | Local bank, e-wallets | Casino, live |
| **Thailand** | Banned; large grey demand | Local bank, crypto | Sportsbook, casino |
| **Indonesia** | Banned (strict enforcement) | Local bank, e-wallet, crypto | Casino, slots |
| **Malaysia** | Restricted | Local bank, crypto | Casino, sportsbook |

### TAM / SAM / SOM framing
- **TAM:** total adult online-gambling spend (GGR) across target countries.
- **SAM:** the slice reachable given our licenses, language (Vietnamese-first), payment integrations, and product set.
- **SOM:** realistic capture given CAC budget, agent/affiliate reach, and brand maturity — typically a low single-digit % of SAM in year one.

### By product
| Product | Margin profile | Notes |
|---|---|---|
| **Casino / slots** | Higher hold (3-6%) | Volume-driven, RNG, provider-dependent |
| **Sportsbook** | Lower/variable hold (5-8% net) | Event-driven spikes; football dominant in VN |
| **Live casino** | Lower hold (2-4%), high engagement | Streaming cost; strong VIP/whale draw |

Segment GTM by both axes: a Vietnamese football bettor and an Indonesian slots player need different products, rails, and messaging.
