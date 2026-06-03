# Feature Specification: [FEATURE_NAME]

> **Created:** [DATE]
> **Author:** @ba
> **Status:** Draft | Clarified | Approved
> **Branch:** [NNN]-[feature-slug]

---

## 1. Overview

### Problem Statement
<!-- What problem does this solve? Who has this problem? -->

### Business Value
<!-- Why does this matter? What metric does it improve? -->

### Success Criteria
<!-- How do we know this feature is successful? Measurable outcomes. -->

---

## 2. User Stories

### US-1: [Story Title]
**As a** [user type], **I want** [action], **so that** [benefit].

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [expected result]
- [ ] Given [context], when [action], then [expected result]

### US-2: [Story Title]
<!-- Repeat as needed -->

---

## 3. Functional Requirements

### 3.1 Core Behavior
<!-- WHAT the feature does. Focus on behavior, not implementation. -->
<!-- Use [NEEDS CLARIFICATION: specific question] for anything ambiguous -->

### 3.2 Error Handling
<!-- What happens when things go wrong? -->

### 3.3 Edge Cases
<!-- Empty data, huge data, special characters, timezone/calendar quirks, etc. -->

---

## 4. Non-Functional Requirements

- **Performance:** [e.g., renders within 200ms on mobile]
- **Accessibility:** [WCAG AA minimum]
- **Localization:** [Vietnamese primary, English secondary]
- **Theme:** [Must support light + dark mode]
- **Compliance:** [KYC/age-gate/responsible-gaming/audit needs for real-money features — see `guidelines/igaming-compliance.md`; mark N/A if non-real-money]

---

## 5. Out of Scope
<!-- Explicitly state what this feature does NOT include -->

---

## 6. Open Questions
<!-- Items that need clarification before planning can begin -->
<!-- Each item must use: [NEEDS CLARIFICATION: specific question] -->

---

## 7. Review Checklist

### Requirement Completeness
- [ ] No `[NEEDS CLARIFICATION]` markers remain
- [ ] Every user story has testable acceptance criteria
- [ ] Success criteria are measurable
- [ ] Error and edge cases addressed
- [ ] Non-functional requirements specified

### Specification Quality
- [ ] Focuses on WHAT/WHY, not HOW (no tech stack mentions)
- [ ] No speculative or "might need" features
- [ ] No vague requirements — each item is specific
- [ ] Consistent terminology throughout

### Constitutional Compliance
- [ ] Article III satisfied (spec before code)
- [ ] Article V satisfied (simplicity — minimal scope)
- [ ] Article VII satisfied (data integrity for engine features)
- [ ] Articles X-XV satisfied for real-money features (ledger integrity, KYC/age gate, fund segregation, provably-fair/RTP, responsible gaming, jurisdiction)

### Compliance & Responsible Gaming (iGaming — mark N/A for non-real-money features)
- [ ] KYC / 18+ age gate enforced before this feature touches deposits or wagers
- [ ] AML / source-of-funds impact considered
- [ ] Responsible-gaming limits + self-exclusion honored server-side
- [ ] RTP / provably-fair disclosure surfaced where the player wagers
- [ ] Real-money actions atomic and written to the immutable audit ledger
- [ ] Self-excluded / out-of-jurisdiction players blocked
> Detail in `guidelines/igaming-compliance.md`.

---

> **Instructions for @ba / LLM:**
> - Focus on WHAT users need and WHY
> - Do NOT include technology choices, APIs, or code structure
> - Mark ALL ambiguities with `[NEEDS CLARIFICATION: specific question]`
> - Do NOT guess — if the user prompt doesn't specify something, mark it
> - Complete the Review Checklist before submitting for @pm review
