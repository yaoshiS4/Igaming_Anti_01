---
description: Penetration Testing - structured pentest methodology, attack playbooks, vulnerability scoring, and an iGaming abuse & integrity playbook (multi-accounting, bonus/promo abuse, collusion, arbitrage, payment/chargeback fraud, affiliate fraud, game-integrity tampering) | Consolidates: attack-simulation, social-engineering-testing
---

# SKILL: Penetration Testing

## When to Use
When @whitehat-hacker conducts structured security assessments — during `/pentest-session` workflow, pre-release security reviews, or on-demand penetration testing.

## The Pentest Methodology (PTES-Aligned)

### Phase 0 — Pre-Engagement
Before any testing begins:
1. **Scope confirmation** — Get explicit scope from @pm:
 - Which features/pages/APIs are in scope?
 - Which environments? (dev, staging — NEVER production)
 - Any out-of-bounds areas? (e.g., third-party services)
 - Time window for testing?
2. **Rules of engagement** — Confirm ethical boundaries per `@whitehat-hacker.md` §7.
3. **Tooling preparation** — Set up browser, intercepting proxy, test accounts.

### Phase 1 — Reconnaissance & Enumeration
Map the complete attack surface:

#### 1.1 Passive Recon
- Review source code (client-side) for exposed endpoints, API keys, debug flags.
- Check `robots.txt`, `sitemap.xml`, `.well-known` for info disclosure.
- Analyze HTTP headers for server/framework fingerprinting.
- Review JavaScript bundles for API routes, auth logic, hidden features.
- Check if source maps are exposed in production builds.

#### 1.2 Active Recon
- Enumerate all API endpoints (documented + undocumented).
- Map all user input vectors: forms, URL params, headers, cookies.
- Identify all authentication/authorization checkpoints.
- Discover all file upload endpoints.
- Map all WebSocket/SSE connections.

#### 1.3 Attack Surface Matrix
Build this matrix for each target:

```markdown
| Input Vector | Type | Auth | Validation | Sanitization | Risk |
|---|---|---|---|---|---|
| Login email field | Text input | No | Client-only? | Unknown | High |
| Profile avatar | File upload | Yes | Size only? | Unknown | Medium |
| Search query | URL param | No | None? | Unknown | High |
| API /user/:id | URL path | JWT | Server-side | N/A | Medium |
```

### Phase 2 — Vulnerability Assessment
Systematically test each attack category from `@whitehat-hacker.md` §2:

#### 2.1 Authentication Testing Playbook
```
1. Test login with SQL injection payloads: ' OR '1'='1, admin'--
2. Test JWT: modify payload, change alg to none, use expired tokens
3. Test session: reuse old tokens, check token rotation on password change
4. Test brute force: attempt 100 rapid logins — is rate limiting enforced?
5. Test password reset: is token predictable? Can it be reused?
6. Test OAuth flow: manipulate redirect_uri, test state parameter
7. Test 2FA: attempt bypass via backup codes, race condition on OTP
```

#### 2.2 Authorization Testing Playbook
```
1. IDOR: Change user IDs in API requests — /api/user/123 → /api/user/456
2. Horizontal escalation: Access another user's data with valid but wrong token
3. Vertical escalation: Access admin endpoints with regular user token
4. Force browsing: Navigate directly to /admin, /dashboard, /api/internal
5. Method tampering: Change GET to POST/PUT/DELETE on protected endpoints
6. Parameter tampering: Add admin=true, role=admin to request bodies
```

#### 2.3 Injection Testing Playbook
```
1. XSS: Test all input fields with <script>alert(1)</script>
2. XSS variants: <img onerror=alert(1)>, javascript:alert(1), SVG-based
3. Stored XSS: Submit XSS in profile fields, check if rendered to others
4. SQL injection: ' OR 1=1--, UNION SELECT, time-based blind
5. NoSQL injection: {$gt: ''}, {$ne: null} in JSON payloads
6. Template injection: {{7*7}}, ${7*7}, #{7*7}
7. Prototype pollution: __proto__.isAdmin = true in JSON bodies
```

#### 2.4 DoS Testing Playbook
```
1. Rate limit test: 1000 requests in 10 seconds — does it throttle?
2. Large payload: Submit 10MB+ JSON body — does it reject?
3. ReDoS: Submit known evil regex inputs to search fields
4. Recursive query: Deeply nested JSON/GraphQL — does it limit depth?
5. Slowloris: Hold connections open with partial headers
6. Resource exhaustion: Request computationally expensive operations rapidly
```

#### 2.5 Client-Side Testing Playbook
```
1. Check localStorage/sessionStorage for tokens, PII, secrets
2. Check all cookies: HttpOnly? Secure? SameSite?
3. Check CORS: Can arbitrary origins read responses?
4. Check CSP: Is Content-Security-Policy header present and strict?
5. Check for clickjacking: Can the page be iframed?
6. Check console output: Are errors/debug logs exposing info?
7. Check network tab: Are any requests sending credentials to third parties?
```

### Phase 3 — Exploitation & PoC
For each vulnerability found:
1. **Craft a minimal PoC** that demonstrates the impact.
2. **Document exact reproduction steps** (copy-pasteable).
3. **Assess real-world impact:**
 - Confidentiality: Can data be read?
 - Integrity: Can data be modified?
 - Availability: Can the service be disrupted?
4. **Score severity** using simplified CVSS:

| Factor | Low (1) | Medium (2) | High (3) |
|---|---|---|---|
| Exploitability | Requires deep knowledge | Moderate skill | Script kiddie level |
| Impact | Info disclosure | Data modification | Full compromise |
| Scope | Single user | Multiple users | All users/system |

**Severity = Average(Exploitability + Impact + Scope):**
- 1.0–1.5 → Low
- 1.6–2.0 → Medium
- 2.1–2.5 → High
- 2.6–3.0 → Critical

### Phase 4 — Reporting
Use the report template from `@whitehat-hacker.md` §5. Include:
- Executive summary for @pm (non-technical)
- Technical details for @devops (with PoCs)
- Remediation recommendations (prioritized)
- Risk matrix (severity × exploitability)

### Phase 5 — Re-Test & Verification
After @devops implements fixes:
1. Re-run the exact same exploit against the patched version.
2. Verify the fix doesn't introduce new vulnerabilities (regression).
3. Test for bypass — can the fix be circumvented with a modified attack?
4. Update the report with re-test results.
5. Mark findings as: Fixed | Partially Fixed | Still Vulnerable

## Common Payload Reference

### XSS Payloads
```
<script>alert(document.cookie)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
javascript:alert(document.domain)
"><script>alert(1)</script>
'-alert(1)-'
```

### SQL Injection Payloads
```
' OR '1'='1
' OR '1'='1' --
' UNION SELECT NULL,NULL,NULL --
1' AND SLEEP(5) --
' OR 1=1#
```

### JWT Bypass
```json
// Algorithm confusion
{"alg": "none", "typ": "JWT"}

// Key confusion (RS256 → HS256)
{"alg": "HS256", "typ": "JWT"}
// Sign with public key as HMAC secret
```

### Header Injection
```
X-Forwarded-For: 127.0.0.1
X-Original-URL: /admin
X-Rewrite-URL: /admin
```

## Attack Simulation Playbook
(Folded from former `attack-simulation` skill.)

**Use when:** designing and executing realistic, multi-stage attack scenarios that model real-world threat actors — testing application resilience against coordinated attacks rather than isolated vulnerabilities. Apply during pre-launch reviews and red-team simulations.

### A.1 Threat Persona System
Think like the attacker. Select the appropriate threat persona based on the target.

#### Script Kiddie — "Hacker Nhí"
| Attribute | Value |
|---|---|
| **Skill Level** | Low — uses pre-made tools and public exploits |
| **Motivation** | Ego, bragging rights, disruption for fun |
| **Tools** | Browser dev tools, automated scanners, copy-pasted payloads |
| **Typical Attacks** | XSS, default credential testing, basic SQL injection, simple DoS |
| **Persistence** | Low — gives up after first few failed attempts |
| **Threat Level** | Medium — still dangerous if defenses are weak |

#### Opportunistic Criminal — "Kẻ Trộm Dữ Liệu"
| Attribute | Value |
|---|---|
| **Skill Level** | Medium — understands web security, uses specialized tools |
| **Motivation** | Financial gain — sell data, ransom, crypto mining |
| **Tools** | Burp Suite, SQLmap, custom scripts, credential databases |
| **Typical Attacks** | Credential stuffing, data exfiltration, payment fraud, account takeover |
| **Persistence** | Medium — will try multiple vectors before moving on |
| **Threat Level** | High — targeted and motivated |

#### Competitor / Corporate Spy — "Đối Thủ"
| Attribute | Value |
|---|---|
| **Skill Level** | Medium-High — has resources, may hire specialists |
| **Motivation** | Business intelligence, user data theft, service disruption |
| **Tools** | Professional pentest tools, social engineering, insider access |
| **Typical Attacks** | API scraping, user database extraction, service cloning, DDoS to disrupt |
| **Persistence** | High — sustained campaign over days/weeks |
| **Threat Level** | Critical — strategic and well-resourced |

#### Disgruntled Insider — "Người Trong Nội Bộ"
| Attribute | Value |
|---|---|
| **Skill Level** | Varies — but has legitimate access and insider knowledge |
| **Motivation** | Revenge, sabotage, data theft for leverage |
| **Tools** | Legitimate credentials, direct DB access, knowledge of architecture |
| **Typical Attacks** | Data deletion, backdoor planting, privilege abuse, data exfiltration |
| **Persistence** | Very High — patient, knows the system intimately |
| **Threat Level** | Critical — hardest to defend against |

#### Persona Selection Guide
| Scenario | Persona(s) |
|---|---|
| General security assessment | Script Kiddie + Opportunistic Criminal |
| Pre-launch security review | All 4 personas |
| Auth system hardening | Opportunistic Criminal + Insider |
| Data protection audit | Corporate Spy + Insider |
| DoS resilience testing | Script Kiddie + Corporate Spy |
| Supply chain review | Corporate Spy |

### A.2 Attack Chain Design
Real attacks aren't single-step — they're chains. Design multi-stage attack scenarios.

#### Attack Chain Template
```markdown
## Attack Chain: [Name]
**Threat Persona:** [Which persona]
**Target:** [Feature/Component]
**Objective:** [What the attacker wants to achieve]

### Stage 1 — Reconnaissance
- Action: [What the attacker does first]
- Expected Result: [What they learn]
- Detection: [Would this be noticed?]

### Stage 2 — Initial Access
- Action: [How they get a foothold]
- Expected Result: [First access achieved]
- Detection: [Would this be noticed?]

### Stage 3 — Escalation
- Action: [How they expand access]
- Expected Result: [Higher privileges or more data]
- Detection: [Would this be noticed?]

### Stage 4 — Objective
- Action: [How they achieve their goal]
- Expected Result: [Data stolen / service disrupted / etc.]
- Detection: [Would this be noticed?]

### Impact Assessment
- Confidentiality: [Impact score]
- Integrity: [Impact score]
- Availability: [Impact score]
- Overall Severity: [Critical/High/Medium/Low]
```

#### Pre-Built Attack Chains

Chain 1: Account Takeover via Password Reset
```
Recon → Find password reset endpoint
 → Test for email enumeration (different responses for existing vs non-existing)
 → Discover predictable reset token pattern
 → Generate valid reset token for target account
 → Reset password → Full account takeover
```

Chain 2: Data Exfiltration via IDOR
```
Recon → Find user data API endpoint
 → Create two test accounts
 → Access Account A's data with Account B's token
 → Enumerate all user IDs (sequential? UUID?)
 → Automate data extraction for all users
 → Exfiltrate user database
```

Chain 3: Privilege Escalation via Mass Assignment
```
Recon → Study API request/response bodies
 → Identify user role field in responses
 → Add role=admin to profile update request
 → Check if role was actually modified
 → Access admin panel with elevated privileges
 → Modify application settings, user data
```

Chain 4: Service Disruption via Resource Exhaustion
```
Recon → Identify computationally expensive endpoints
 → Map rate limiting configuration
 → Find rate limit bypass (header manipulation)
 → Send 10,000 expensive requests
 → Server CPU/memory spikes
 → Service degraded or unavailable for all users
```

Chain 5: Supply Chain Compromise
```
Recon → Analyze package.json for dependency names
 → Check if any package name is available on public npm
 → Create malicious package with same name + higher version
 → Wait for next `npm install` (dependency confusion)
 → Malicious code executes during install
 → Backdoor in build pipeline
```

Chain 6: Phishing → Credential Harvest → Account Takeover
```
OSINT → Harvest user emails from app's public surfaces
 → Clone login page (assess difficulty per Social Engineering Testing Playbook §S.3.1)
 → Craft phishing email mimicking app notifications
 → Victim enters credentials on cloned page
 → Attacker uses credentials on real app
 → Full account takeover + lateral movement
```
*Cialdini levers: Authority (official-looking email), Scarcity (urgent action required)*

Chain 7: Pretext → Info Extraction → Privilege Escalation
```
OSINT → Discover org hierarchy and support processes
 → Impersonate IT support using exposed staff identities
 → Contact target via app's messaging/support channel
 → Extract current password or MFA bypass info
 → Login as target → escalate to admin via mass assignment
 → Full admin access achieved
```
*Cialdini levers: Authority (IT support persona), Commitment (small asks escalating), Reciprocity (offering to "fix" an issue)*

### A.3 Simulation Execution Protocol
When executing an attack simulation:

1. **Select persona** — Pick the most relevant threat persona from §A.1.
2. **Design chain** — Map out the multi-stage attack from §A.2 or create a custom one.
3. **Execute stages** — Run each stage sequentially, documenting results.
4. **Record evidence** — Screenshot every successful step, save payloads.
5. **Assess detection** — For each stage, note: *"Would the current monitoring catch this?"*
6. **Score resilience** — Rate the application's resistance per attack chain:

| Rating | Meaning |
|---|---|
| **Impervious** | Attack chain fails at Stage 1 — no foothold possible |
| **Resilient** | Attack chain fails at Stage 2 — initial access blocked |
| **Moderate** | Attack chain succeeds partially — limited impact |
| **Vulnerable** | Attack chain succeeds — significant impact achievable |
| **Critical** | Full chain completes — maximum impact achieved |

### A.4 Red Team Report Template
```markdown
# Red Team Simulation Report
**Date:** YYYY-MM-DD | **Operator:** @whitehat-hacker
**Threat Persona:** [Selected persona]
**Target Scope:** [Features tested]

## Simulation Summary
| Chain | Target | Result | Detection | Severity |
|---|---|---|---|---|
| Account Takeover | Auth system | Moderate | Partial | Medium |
| Data Exfiltration | User API | Critical | None | Critical |

## Detailed Attack Chains
[Each chain from §A.2 with actual results]

## Detection Gaps
| Stage | Attack | Detected? | Recommended Detection |
|---|---|---|---|
| Recon | Endpoint enumeration | No | Add request rate monitoring |
| Access | IDOR attempt | No | Add ownership validation logging |

## Resilience Score
| Category | Score | Notes |
|---|---|---|
| Authentication | 4/5 | Strong, but 2FA bypass possible |
| Authorization | 2/5 | IDOR found in 3 endpoints |
| Input Validation | 3/5 | XSS blocked, but SQLi possible |
| Rate Limiting | 2/5 | Bypassed via X-Forwarded-For |
| Data Protection | 3/5 | Tokens in localStorage |

## Recommendations (Priority Order)
1. [P0] Fix IDOR in user data endpoints
2. [P1] Move tokens from localStorage to HttpOnly cookies
3. [P2] Implement proper rate limiting
```

### A.5 Continuous Threat Intelligence
After each simulation, update the vulnerability knowledge base:
- Track **emerging attack patterns** relevant to the tech stack (React, Vite, Node.js).
- Monitor **CVE databases** for dependencies.
- Document **new bypass techniques** discovered during testing.
- Update attack playbooks with lessons learned.
- Share threat intelligence with @devops for proactive defense.

## Social Engineering Testing Playbook
(Folded from former `social-engineering-testing` skill.)

**Use when:** assessing an application's resilience against human-factor attacks — phishing, pretexting, information leakage, and trust manipulation. Apply during `/pentest-session` (Steps 2.5 + 7.6) or standalone SE assessments.

> **Scope boundary:** This playbook focuses on what an AI agent CAN directly test (DOM analysis, OSINT exposure, auth flow susceptibility, UI trust indicators). Items that require human execution (phone vishing, physical tailgating) are documented as **advisory findings** for human-led SE testing.

### S.1 Psychological Exploitation Framework
All social engineering exploits one or more of **Cialdini's 7 Principles**. Use this as a lens when designing pretext scenarios and evaluating application defenses:

| # | Principle | Attack Pattern | What to Test |
|---|---|---|---|
| 1 | **Reciprocity** | Offer help → request credentials | Does the app allow impersonation of support staff? |
| 2 | **Scarcity** | Create fake urgency | Can notification text/emails be crafted with urgency language? |
| 3 | **Authority** | Impersonate someone powerful | Does the app display role/title that could be spoofed? |
| 4 | **Commitment** | Small "yes" → escalating requests | Can multi-step auth flows be social-engineered step-by-step? |
| 5 | **Liking** | Build rapport via profile info | How much personal info does the app expose to other users? |
| 6 | **Social Proof** | "Everyone has done this" | Can bulk user actions be faked or displayed misleadingly? |
| 7 | **Unity** | Invoke shared group identity | Does the app expose team/org membership that aids pretexting? |

**Usage:** When scoring SE resilience (§S.6), map each finding to the Cialdini principle it exploits.

### S.2 OSINT Reconnaissance Protocol
Assess what intelligence an attacker can gather from the application's public-facing surfaces.

#### S.2.1 Information Exposure Audit
Test what the application reveals without authentication:

```markdown
| Information Type | Source | Found? | Severity |
|---|---|---|---|
| User email addresses | Registration errors, public profiles | ? | High |
| User real names | Public profiles, comments, shared content | ? | Medium |
| Organization structure | Team pages, about pages, public directories | ? | High |
| Technology stack | HTTP headers, error pages, source maps | ? | Medium |
| API documentation | Swagger/OpenAPI exposed publicly | ? | High |
| Employee count / roles | Public team listings | ? | Medium |
| Internal naming conventions | URL patterns, error messages, JS bundles | ? | Low |
```

#### S.2.2 User Enumeration Assessment
- **Registration endpoint:** Does the response differ for existing vs. non-existing emails?
- **Password reset endpoint:** Does it confirm whether an email exists?
- **Login endpoint:** Does it distinguish "wrong password" from "user not found"?
- **Public profiles:** Can user IDs be enumerated (sequential? predictable?)?

#### S.2.3 Metadata & Error Message Intelligence
- Do error messages reveal internal paths, function names, or stack traces?
- Do API responses include internal IDs, timestamps, or server metadata?
- Do HTTP headers disclose versions (`X-Powered-By`, `Server`)?
- Do source maps exist in production builds?

### S.3 Phishing Resistance Assessment

#### S.3.1 Login Page Clone Difficulty Score
Evaluate how easy it is for an attacker to replicate the login page:

| Factor | Score 1 (Easy) | Score 3 (Hard) |
|---|---|---|
| **Visual complexity** | Simple form, no branding | Complex UI, unique animations |
| **Anti-clone indicators** | No domain verification shown | Domain prominently displayed in UI |
| **CSP protection** | No CSP or weak CSP | Strict CSP prevents resource loading from other origins |
| **Unique identifiers** | Generic design, easily replicated | Custom fonts/graphics requiring specific assets |
| **MFA integration** | No MFA, password-only | Integrated hardware key / biometric |

**Score = Average(all factors).** ≤1.5 = Easily cloned; 1.6–2.0 = Moderate; ≥2.1 = Resistant.

#### S.3.2 Email/Notification Spoofability
- Does the app send emails? Are they DKIM/SPF/DMARC protected?
- Do notification emails contain links? Can link destinations be predicted/forged?
- Do emails display user-controllable content (names, messages) that could inject phishing text?
- Are email templates branded enough that a clone would be obvious?

#### S.3.3 Anti-Phishing UI Indicators
Check if the application helps users detect phishing:
- [ ] Does the app show the domain name prominently on sensitive pages?
- [ ] Are external links clearly marked or warned about?
- [ ] Does the app use custom security indicators (e.g., personalized images/phrases)?
- [ ] Are password inputs protected against autofill on cloned domains?
- [ ] Does the app warn about open redirects in outbound links?

#### S.3.4 Auth Flow Susceptibility to Phishing Proxies
Test whether the auth flow can be intercepted by a real-time phishing proxy (Evilginx-style):
- Can the login flow be transparently proxied (no pinning, no origin checks)?
- Does the session token survive being issued through a proxy?
- Does the app detect suspicious login locations/devices after proxy-based auth?

### S.4 Pretext Scenario Library
Pre-built scenarios to test the application's susceptibility. For each scenario, assess: *"Does the application provide enough information or functionality to make this pretext credible?"*

#### S.4.1 IT Support Impersonation
- **Pretext:** "I'm from IT support, I need to verify your account."
- **Test:** Does the app expose support channels, ticket systems, or staff identities that make this credible?
- **Test:** Can support/help features be abused to impersonate staff?

#### S.4.2 Vendor/Partner Impersonation
- **Pretext:** "I'm from [vendor], we need to update your integration."
- **Test:** Does the app expose third-party integration names or partner logos?
- **Test:** Are partner/vendor communications distinguishable from phishing?

#### S.4.3 Executive Authority Exploitation
- **Pretext:** "The CEO needs this data urgently."
- **Test:** Does the app expose org hierarchy, executive names, or reporting structures?
- **Test:** Can admin actions be triggered via social channels outside the app?

#### S.4.4 New Employee Onboarding Exploit
- **Pretext:** "I'm new, can you help me access the system?"
- **Test:** Does the invite/onboarding flow expose enough process detail to fake it?
- **Test:** Can invitation links be predicted or reused?

### S.5 Application-Level SE Vectors

#### S.5.1 Password Reset Social Engineering
- Can an attacker reset another user's password using only OSINT-gathered info?
- Are security questions guessable from public profile data?
- Does the reset flow leak information (token in URL, timing-based enumeration)?

#### S.5.2 Support/Help Desk Abuse
- Can an attacker submit a support request posing as another user?
- Does the support flow verify identity before taking action?
- Can support tickets inject content visible to other users or staff?

#### S.5.3 Trust Indicator Manipulation
- Can an attacker manipulate displayed names, avatars, or badges?
- Can verified/trusted status be spoofed via profile manipulation?
- Are system messages distinguishable from user-generated content?

#### S.5.4 Notification Channel Hijacking
- Can an attacker trigger notifications to other users with controlled content?
- Can push notifications, emails, or SMS be used as phishing vectors through the app?
- Does the app rate-limit or sanitize user-triggered notifications?

### S.6 SE Resilience Scoring Matrix
After completing the assessment, score each dimension:

| Dimension | Score | Criteria |
|---|---|---|
| **OSINT Exposure** | | How much intelligence can be passively harvested? |
| **Phishing Resistance** | | How hard is it to clone and phish? |
| **Pretext Credibility** | | How much does the app aid pretexting? |
| **Trust Indicator Integrity** | | Can trust signals be spoofed? |
| **Auth Flow SE Resilience** | | Is the auth flow resistant to SE-based attacks? |

**Scores:**
- **Resilient** (4/4) — Minimal exposure, strong anti-SE controls
- **Moderate** (3/4) — Some exposure, basic protections in place
- **Vulnerable** (2/4) — Significant exposure, few SE-specific protections
- **Critical** (1/4) — Extensive exposure, no SE-specific protections

### S.7 SE Findings Report Template
```markdown
## Social Engineering Assessment
**Date:** YYYY-MM-DD | **Tester:** @whitehat-hacker

### OSINT Exposure Summary
| Item | Exposed? | Source | Risk |
|---|---|---|---|
| User emails | Yes/No | [Where found] | High/Med/Low |

### Phishing Resistance Score
| Factor | Score | Notes |
|---|---|---|
| Login clone difficulty | X/3 | [Details] |
| Email spoofability | X/3 | [Details] |
| Anti-phishing UI | X/3 | [Details] |

### Pretext Vulnerability Assessment
| Scenario | Credibility | App-Aided? | Risk |
|---|---|---|---|
| IT Support | High/Med/Low | Yes/No | High/Med/Low |

### SE Resilience Matrix
[From §S.6 above]

### Recommendations
1. [Priority-ordered SE-specific hardening actions]

### Advisory: Human-Led Testing Needed
- [ ] Vishing (voice phishing) — test employee phone response
- [ ] Physical tailgating — test office access controls
- [ ] In-person pretexting — test front-desk/reception protocols
- [ ] USB baiting — test response to found media devices
```

### S.8 SE Rules
- **Ethics first:** All SE assessments are simulated — no real manipulation of real people.
- **Scope boundary:** Only test what the application exposes. Do not conduct SE against individuals.
- **Document everything:** Every finding must include the Cialdini principle exploited and the app-level vector.
- **Advisory items:** Clearly mark findings that require human-led SE testing for full validation.

## iGaming Abuse & Integrity Playbook

**Use when:** assessing abuse, fraud, and game-integrity attack chains specific to a Vietnamese-first online casino + sportsbook. These are not generic web vulns — they exploit the money-in / play / money-out lifecycle, bonus economics, multiplayer game fairness, and bet-settlement logic. Apply during `/pentest-session`, pre-launch reviews, and ongoing fraud-risk assessments.

> **Defensive controls** for every chain below live in `guidelines/igaming-compliance.md` (§4 anti-fraud, §5 game integrity). This playbook is the offensive/detection counterpart; pair findings with the matching control section.
>
> **Impact dimensions used below:** *Player loss* (harm to legitimate players), *Platform liability* (direct financial loss / GGR erosion to the operator), *Regulatory risk* (license, AML/KYC, responsible-gaming, and audit exposure).

### G.1 Multi-Account Bonus Arbitrage (Multi-Accounting)
A single actor (or a "gnoming" ring) creates many accounts to repeatedly farm signup/first-deposit/reload bonuses, then funnels cashout value into one controlled wallet.

**Attack steps:**
1. Register N accounts using disposable emails, virtual numbers, and freshly minted identities (recycled or synthetic KYC docs).
2. Mask the shared origin: rotate IPs (residential proxies / 4G dongles / VPN exit nodes), clear cookies, use incognito or anti-detect browsers (Multilogin/AdsPower) to spoof distinct fingerprints.
3. Claim signup + first-deposit bonus on each account; meet the minimum wagering with low-variance / near-100%-RTP bets to preserve value.
4. Consolidate: chip-dump across accounts at shared poker/live tables (see §G.3), lose to a "collector" account, or withdraw each to bank cards / e-wallets that resolve to the same beneficiary.

**Detection signal(s) / monitoring:**
- **Device fingerprinting** — same canvas/WebGL/font/audio hash, screen + timezone, or anti-detect-browser tells across "different" accounts.
- **Payment-instrument fingerprinting** — same card BIN+last4, e-wallet ID, bank account, or crypto withdrawal address shared across accounts; deposit-from-A / withdraw-to-B beneficiary collisions.
- **Network correlation** — shared IP/ASN, datacenter/VPN ranges, or many signups from one subnet in a short window.
- **Behavioral fingerprinting** — near-identical bet sizing/timing, identical game choices, accounts active in lockstep, login-time clustering.
- **Graph/link analysis** — connect accounts via shared device + instrument + IP into clusters; flag clusters above a size/velocity threshold.

**Impact:** Player loss low (abuse is against the house). Platform liability high — bonus payout drains promo budget and GGR; rings can scale to thousands of accounts. Regulatory risk high — synthetic/duplicate identities defeat KYC, and consolidation flows are textbook AML structuring.

### G.2 Bonus / Promo Abuse & T&C Gaps
Exploits weaknesses in promotion terms so the expected value of claiming a bonus is positive for the player regardless of outcome ("risk-free arbitrage").

**Attack steps:**
1. Audit promo T&Cs for gaps: no max-withdrawal cap on bonus winnings, low or absent wagering/playthrough multiplier, bonus playable on high-RTP / low-variance games, no max-bet-while-bonus-active rule, no game-weighting (e.g., baccarat/blackjack counts 100%).
2. With a deposit-match bonus and weak playthrough, bet large on near-coinflip / low-house-edge games to clear wagering with minimal EV decay.
3. Where two outcomes are hedgeable (e.g., bonus funds on one side, cash on the other, or matched betting across promos), lock in guaranteed profit.
4. With no max-withdrawal cap, withdraw the full inflated balance immediately.

**Detection signal(s) / monitoring:**
- Bonus-clearing pattern: large bets only while bonus is active, then withdrawal and dormancy.
- Game-mix anomaly: concentration on lowest-house-edge / highest-weighting games during wagering.
- Hedging signature: opposite-side bets of correlated size on the same market/event from one or linked accounts.
- Withdrawal-to-deposit ratio and bonus-attributable-balance ratio exceeding modeled norms.
- Promo cost-per-acquisition / bonus-leakage dashboards trending above forecast.

**Impact:** Player loss none. Platform liability high — direct, uncapped promo leakage and negative-margin players. Regulatory risk medium — uncontrolled bonus terms can breach advertising/responsible-gaming rules in regulated markets and create dispute exposure.

### G.3 Collusion at Poker / Live Tables
Multiple players coordinate to extract value from honest players or to move funds, defeating the assumption of independent play.

**Attack steps:**
1. **Chip dumping** — a colluder deliberately loses chips to a target account (intentional all-in folds reversed, or always calling/folding to dump), used for money laundering, bonus consolidation (§G.1), or moving value to a clean account.
2. **Soft play** — colluders avoid betting against each other (checking down, never raising a partner), reducing variance and ganging up on the non-colluding player.
3. **Signaling / hole-card sharing** — out-of-band channels (chat, voice, screen-share) reveal hole cards so colluders play with informational advantage; multi-seating one table with several controlled accounts.

**Detection signal(s) / monitoring:**
- Player-pair association index: two accounts repeatedly seated together far above chance; co-occurrence graph.
- Abnormal fold/raise patterns between specific pairs (one consistently transfers chips to the other — net-flow imbalance per pair).
- VPIP/aggression anomalies when a specific opponent is present vs. absent (soft-play signature).
- Win-rate that is statistically implausible given showdown cards (hole-card knowledge indicator).
- Same device/IP/payment cluster (link to §G.1) among co-seated players.

**Impact:** Player loss high — honest players are directly fleeced; trust/retention damage. Platform liability medium — chargebacks, refunds, and reputational harm. Regulatory risk high — chip dumping is an AML laundering channel and collusion breaches game-fairness obligations.

### G.4 Arbitrage / Sure-Betting & Odds-Stale Exploitation (Sportsbook)
Exploits pricing errors, latency, and settlement timing to place positive-EV or risk-free bets the book did not intend to offer.

**Attack steps:**
1. **Sure-betting / arbing** — place offsetting bets across the operator's own markets and competitor odds so all outcomes yield profit (margin/vig discrepancy); use scanners to find arbs and stake to lock guaranteed return.
2. **Stale-odds / latency exploitation** — exploit slow line movement: when the operator's price lags a sharper market or live feed, hammer the mispriced side before it corrects (also "courtsiding" with a faster live data feed than the book).
3. **Bet-after-event ("post-posting" / late betting)** — exploit live-bet acceptance latency or feed delay to place or confirm a wager after the real-world outcome is effectively known (e.g., bet a goal/point already scored but not yet reflected).

**Detection signal(s) / monitoring:**
- Bet-acceptance-timestamp vs. event-clock / feed-timestamp delta analysis; flag bets landing within the latency-risk window or after the determining event.
- Arb-bettor behavior: stakes that exactly match arb-calculator sizing, betting only at peak odds, line-shopping signature, low turnover-to-stake churn with consistent edge.
- Sharp/winner profiling: accounts whose closing-line value (CLV) is persistently positive.
- Per-market exposure and price-staleness alerts when own odds drift beyond a threshold from reference feed.
- Cross-account correlated staking on the same arb (link to §G.1).

**Impact:** Player loss none. Platform liability high — systematic margin erosion; late betting is direct loss on near-certain outcomes. Regulatory risk medium — voiding such bets invites complaints/disputes, and inadequate controls can be flagged in audits; integrity-monitoring obligations (match-fixing tie-in) may apply.

### G.5 Payment Fraud & Chargeback Abuse
Abuses the deposit/withdrawal rails to extract funds the player never legitimately paid for, or to reverse legitimate losses.

**Attack steps:**
1. **Friendly-fraud chargeback** — deposit with own card, gamble, then (win or lose) file a chargeback/dispute claiming "unauthorized" or "did not recognize," keeping winnings while clawing back the deposit.
2. **Stolen-card / carding deposits** — deposit using stolen card / compromised e-wallet, place minimal-risk bets to convert dirty funds, then withdraw to a clean instrument (cash-out laundering); test cards in bulk via small deposits.
3. **Deposit-then-fast-withdraw** — deposit, do little or no genuine play, request withdrawal to a different beneficiary (value transfer / structuring), then dispute the deposit.

**Detection signal(s) / monitoring:**
- Chargeback rate and dispute-reason-code monitoring per player, BIN, issuer, and geography; rising "unauthorized" codes.
- Deposit-instrument ≠ withdrawal-beneficiary mismatch; rapid deposit→minimal-play→withdraw velocity ("pass-through" ratio).
- Card-testing signature: many low-value deposits, high auth-decline rate, BIN/IP fan-out.
- AVS/CVV/3-D Secure failure and step-up bypass attempts; new-card-on-new-device.
- Geo/velocity anomalies: deposit IP vs. card issuer country vs. KYC address mismatch.

**Impact:** Player loss possible (true cardholders are victims of stolen-card use). Platform liability high — chargeback fees, scheme fines, lost funds, and threshold programs (e.g., excessive-dispute monitoring) raising processing costs or risking acquirer termination. Regulatory risk high — stolen-card cash-out and pass-through withdrawals are money laundering; KYC/CDD and SAR/STR obligations triggered.

### G.6 Affiliate / Agent Fraud
Abuses the affiliate/agent commission program to manufacture commission on traffic or players that generate no real net revenue.

**Attack steps:**
1. **Self-referral** — affiliate signs up under their own (or linked) affiliate link to claim referral CPA/revenue-share on their own play.
2. **Fake sub-accounts / fraudulent player creation** — create many shell player accounts (or incentivized/bot signups) attributed to the affiliate to inflate registration/FTD counts for CPA payout.
3. **Bonus-funded churn** — referred accounts deposit minimally, extract signup bonuses (link to §G.1), and the affiliate collects CPA before the accounts go dormant (negative-value players).
4. **Cookie stuffing / attribution hijack** — force affiliate cookies onto organic traffic to steal commission on players the affiliate did not bring.

**Detection signal(s) / monitoring:**
- Device/IP/payment overlap between affiliate and their referred players (link to §G.1 fingerprinting).
- Cohort quality per affiliate: high FTD count but near-zero post-bonus deposits, low lifetime net revenue, high bonus-attributable share.
- Attribution anomalies: implausibly high conversion, sudden referral spikes, cookie-stuff signatures (impression-to-click ratio, last-click overwrite patterns).
- Self-referral graph: affiliate account linked (KYC, payout bank, device) to its own referred players.
- Commission-to-net-revenue ratio per affiliate exceeding policy thresholds.

**Impact:** Player loss none. Platform liability high — commission paid on revenue that never materializes; compounds with bonus leakage. Regulatory risk medium — fake-account creation undermines KYC integrity and inflates regulated reporting metrics; affiliate marketing compliance (responsible-advertising) exposure.

### G.7 Game Integrity & Bet-Settlement Tampering
Attacks the fairness and correctness of game outcomes and the ledger that settles them — the highest-severity class because it can mint money or invalidate fairness wholesale.

**Attack steps:**
1. **RNG manipulation attempts** — probe for predictable/seedable RNG (non-CSPRNG, exposed/guessable seed, client-influenced seed), replay favorable seeds, or detect a flawed PRNG period to predict outcomes; tamper with provably-fair seed-reveal flows.
2. **Replay / duplicate settlement** — replay a winning bet-settlement or payout request (missing idempotency key/nonce) to credit a win multiple times; resubmit a cashout callback.
3. **Balance / ledger race conditions** — fire concurrent bet/cashout/withdraw requests (TOCTOU) to double-spend a balance, place bets exceeding funds, or withdraw twice before the ledger debits.
4. **Negative-bet / rounding / integer exploits** — submit negative or malformed stake to credit instead of debit, exploit floating-point/rounding so micro-stakes round in the player's favor, or integer overflow/underflow on balance fields.
5. **Settlement tampering** — manipulate client-reported game result, intercept/modify the settlement message, or exploit a market mis-settlement to claim payout on a losing bet.

**Detection signal(s) / monitoring:**
- Outcome-distribution / RTP monitoring per game and per player vs. mathematically certified RTP; chi-square drift alerts; provably-fair seed-audit logs.
- Duplicate-transaction detection: repeated settlement/payout with same round ID or missing/duplicate idempotency key/nonce.
- Ledger invariants and reconciliation: balance must equal sum of signed transactions; alert on negative stakes, balance-after < 0, or debit/credit sign mismatches.
- Concurrency anomaly detection: overlapping bet/withdraw requests within sub-second windows on one account; failed-then-succeeded double submissions.
- Win-rate / payout-per-account outliers beyond statistical bounds; settlement-message integrity (signing/server-authoritative results).

**Impact:** Player loss possible — RNG/settlement compromise undermines fairness for all honest players. Platform liability critical — money can be minted directly via duplicate settlement, race double-spend, or negative-bet credits; unbounded loss. Regulatory risk critical — RNG/game-fairness certification, ledger auditability, and game-integrity obligations are core license conditions; a breach can void certification and trigger license action.
