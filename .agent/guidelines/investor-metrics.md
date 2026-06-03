---
description: Always On — every milestone must produce quantifiable metrics for progress tracking and pitch data
---

# RULE: INVESTOR METRICS

**Mode:** Always On
**Scope:** @pm and all agents reporting task completion

---

## Core Mandate

Every milestone, sprint, and completed task MUST produce **quantifiable metrics**. Vague progress statements like "made good progress" or "mostly done" are FORBIDDEN. Numbers tell the story.

---

## Binding Constraints

### 1. Mandatory Metrics per Milestone
When reporting any milestone completion, include at least 3 metrics from this list:

| Metric Category | Examples | Format |
|----------------|---------|--------|
| **MVP Completion** | Features shipped vs. planned | "8/12 features complete (67%)" |
| **Code Quality** | Test coverage, type safety | "Coverage: 85%, 0 type errors" |
| **Performance** | Load time, bundle size | "First paint: 1.2s, Bundle: 280KB" |
| **Feature Count** | Components, pages, modules | "12 components, 4 pages, 3 engines" |
| **Bug Rate** | Bugs found vs. fixed | "14 bugs found, 14 fixed, 0 open" |
| **Velocity** | Stories completed per sprint | "Sprint 3: 8 stories (24 points)" |
| **Lines of Code** | Functional code written | "4,200 lines across 32 files" |
| **Data Coverage** | Games, markets, providers | "500+ games across 30 providers; 200+ betting markets" |

### 2. Progress Tracking Format
Maintain a running progress tracker in `.hc/metrics/progress.md`:

```markdown
# Project Metrics — [Project Name]
**Last Updated:** YYYY-MM-DD

## MVP Progress
| Phase | Planned | Completed | % |
|-------|---------|-----------|---|
| Phase 1 | 12 features | 8 | 67% |
| Phase 2 | 8 features | 0 | 0% |

## Sprint Velocity
| Sprint | Stories | Points | Duration |
|--------|---------|--------|----------|
| Sprint 1 | 5 | 13 | 2 weeks |
| Sprint 2 | 7 | 21 | 2 weeks |

## Quality Metrics
| Metric | Current | Target |
|--------|---------|--------|
| Test Coverage | 85% | 80% |
| Type Errors | 0 | 0 |
| Open Bugs | 2 | 0 |

## Performance
| Metric | Current | Target |
|--------|---------|--------|
| First Paint | 1.2s | < 2s |
| Bundle Size | 280KB | < 500KB |
```

### 3. Sprint Review Metrics
Every `/sprint-review` MUST include:
- Features completed this sprint (count + names)
- Bugs found and fixed (count)
- Test coverage delta (+/- %)
- Velocity trend (improving, stable, declining)
- MVP completion percentage

### 4. Pitch-Ready Data
Metrics must be formatted so @ba can directly extract them for investor materials:
- Use concrete numbers, not percentages alone ("2M active users in target segment" not "large market")
- Track "traction" metrics: features live, data coverage, code maturity
- Maintain before/after comparisons for performance improvements

### 5. Completion Reporting
When any agent reports a task as "Done", the report MUST include:
```
 DONE: [Task Name]
- Files changed: [count]
- Tests: [pass/total] ([coverage]%)
- Type check: PASS/FAIL
- Key metric: [one quantifiable outcome]
```

---

### 6. iGaming Business KPIs (when reporting business/traction milestones)
Use the operator metrics that actually describe an iGaming business (definitions in Guideline `igaming-market.md`):

| KPI | Format | Note |
|-----|--------|------|
| GGR / NGR | "GGR ₫4.2B, NGR ₫2.8B (Jun)" | NGR = GGR − bonuses − payment fees − gaming fees |
| Hold % | "Hold 4.1%" | margin on handle/turnover |
| ARPPU | "ARPPU ₫1.6M/mo" | revenue per *paying* player |
| FTD + Deposit conversion | "1,250 FTD, register→FTD 22%" | acquisition quality |
| Bonus cost ratio | "Bonus 24% of NGR" | promo efficiency |
| Churn / reactivation by VIP tier | "VIP3 churn 8%, reactivation 31%" | retention health |
| Whale concentration | "Top 7% = 68% of NGR" | revenue risk concentration |

### 7. Compliance Metrics (iGaming)
| Metric | Format | Target |
|--------|--------|--------|
| KYC coverage | "% players KYC-verified before withdrawal" | 100% pre-withdrawal |
| AML flags reviewed | "# flagged txns / false-positive %" | review SLA met, FP < target |
| Active self-exclusions | "# active, honored at login/deposit" | 100% honored |
| RTP variance | "actual vs theoretical RTP" | within ±2% |
| Deposit-limit enforcement | "% over-limit deposits rejected" | 100% |

---

## Enforcement
Any completion report without quantifiable metrics should be flagged as ` METRICS MISSING — add numbers before closing`.
