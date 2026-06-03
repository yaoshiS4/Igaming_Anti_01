---
description: Test Strategy - verify test-suite effectiveness via mutation analysis plus risk-based regression selection, planning, and suite maintenance | Consolidates: mutation-testing, regression-strategy
---

# SKILL: TEST STRATEGY

**Trigger:** When @qc assesses how good the test suite actually is at catching bugs, or plans/selects regression tests for a change or release.

---

## When to Use
- After writing tests, to verify their quality (coverage ≠ effectiveness).
- On critical calculation engines (core business logic and critical calculation).
- Before claiming "high test coverage" — mutation score reveals true effectiveness.
- When suspicious that tests pass but don't actually verify correct behavior.
- During `/battle-test` workflow to stress-test test suite quality.
- Selecting which tests to run for a PR or code change.
- Preparing a full regression suite for a release.
- After a bug fix, deciding what else to re-test.
- Reviewing test suite health during sprint reviews.

---

## Mutation Testing

Use mutation testing to verify test-suite effectiveness: introduce small faults ("mutants") into source code and confirm tests catch them.

### Step 1: Identify Mutation Targets
Focus mutation testing on code that matters most:

| Target Priority | Examples | Rationale |
|---|---|---|
| Critical | Calculation engines, date logic, financial formulas | Errors have highest user impact |
| Important | Data transformations, validation logic, business rules | Errors cause incorrect behavior |
| Standard | UI state management, navigation logic | Errors are visible but less damaging |
| Skip | Config files, type definitions, pure UI layout | Mutation testing adds no value |

### Step 2: Apply Mutations
Common mutation operators:

| Mutation Type | Example | Tests Should Catch Via |
|---|---|---|
| **Boundary** | `>` → `>=`, `<` → `<=` | Boundary Value Analysis (BVA) tests |
| **Negation** | `if (x)` → `if (!x)` | Branch coverage tests |
| **Arithmetic** | `+` → `-`, `*` → `/` | Calculation assertion tests |
| **Return value** | `return true` → `return false` | Explicit assertion on return |
| **Remove statement** | Delete a line of logic | Behavioral assertion tests |
| **Constant** | `0` → `1`, `""` → `"x"` | Edge case tests |
| **Conditional** | `&&` → `||`, `===` → `!==` | Logic path tests |

### Step 3: Run and Analyze
```bash
# Using Stryker Mutator (JavaScript/TypeScript)
npx stryker run

# Or manual approach for targeted areas:
# 1. Change one operator/value in source
# 2. Run relevant tests
# 3. Verify at least one test fails
# 4. Revert the change
# 5. Repeat for next mutation
```

**Interpreting results:**
| Result | Meaning | Action |
|---|---|---|
| **Killed** | Test caught the mutation | Test suite is effective for this code path |
| **Survived** | Tests passed despite mutation | **Test gap!** Add a test that catches this |
| **Timed out** | Mutation caused infinite loop | Test may be missing termination check |
| **No coverage** | No test runs this code at all | Write a test first (coverage gap) |

### Step 4: Fix Survived Mutants
For each survived mutant:
1. Understand WHY the test didn't catch it.
2. Write a new test case that specifically targets the mutated behavior.
3. Re-run the mutation to confirm it's now killed.

```markdown
## Mutation Report — [Module/File]
**Date:** YYYY-MM-DD | **QC:** @qc

| Metric | Value |
|---|---|
| Total mutants | N |
| Killed | N (X%) |
| Survived | N (Y%) |
| Mutation score | Z% |

### Survived Mutants (Action Required)
| # | Mutation | Line | Why Survived | Fix |
|---|---|---|---|---|
| 1 | `>` → `>=` | L42 | No BVA test for boundary | Add test for exact boundary |
```

### Target Scores
| Code Category | Target Mutation Score |
|---|---|
| Critical engine code | ≥ 85% |
| Business logic | ≥ 80% |
| Utility functions | ≥ 75% |
| UI logic | ≥ 60% |

### Mutation Testing Rules
- **Focus on business logic**, not UI or config files.
- **Fix survived mutants** by adding targeted test cases, not by weakening the mutation.
- **Mutation testing is expensive** — run on critical code paths, not the entire codebase.
- **Combine with code coverage** — high coverage + high mutation score = confident test suite.
- **Document results** in `.hc/quality/mutation-reports/`.

---

## Regression Strategy

Use risk-based test selection to run the right tests for a given change or release, not the whole suite blindly.

### Step 1: Change Impact Analysis
Before selecting tests, understand what changed:

1. **Read the diff:** Identify all changed files and their types.
2. **Map dependencies:** Which other files import/use the changed code?
3. **Classify the change scope:**

| Change Scope | Risk Level | Test Strategy |
|---|---|---|
| Utility function change | Medium | Unit tests for that function + all callers |
| Component change (UI) | Medium | Component tests + visual regression + E2E for affected flows |
| Shared dependency change | High | Full regression suite |
| CSS/style change | Medium | Visual regression across breakpoints (via `browser-visual-testing` skill) |
| Data file / engine change | High | Data validation + all affected calculation engines |
| Build/config change | High | Full smoke test suite |
| Test file change only | Low | Run only the modified test file |
| Documentation only | Low | No regression needed |

### Step 2: Test Selection (Risk-Based Prioritization)
Select tests from highest to lowest priority:

| Priority | Criteria | Run When | Examples |
|---|---|---|---|
| **P1 — Critical** | Core business logic, data integrity, engine calculations | Every change | Core engines, critical calculations, data processing |
| **P2 — High** | Key user flows, primary features, navigation | Every PR | Chart generation, PDF export, tab switching |
| **P3 — Medium** | Edge cases, secondary features, error handling | Pre-release | Bonus expiry boundaries, timezone edge cases |
| **P4 — Low** | Cosmetic, preferences, settings | Major releases only | Theme switching, font size preferences |

**Quick Selection Guide:**
```
Single utility change → P1 tests for that function + P2 tests for callers
Component change → P1-P2 for the feature area + visual regression
Shared code change → P1-P3 full regression
Release candidate → P1-P4 full suite
```

### Step 3: Execute and Report
```markdown
## Regression Report — [PR/Release]
**Date:** YYYY-MM-DD | **QC:** @qc

### Change Impact
- Files changed: [N]
- Risk level: [Low/Medium/High]

### Tests Selected
| Priority | Tests Run | Passed | Failed | Skipped |
|---|---|---|---|---|
| P1 | N | N | N | N |
| P2 | N | N | N | N |
| P3 | N | N | N | N |

### Findings
- [Any failures or concerns]

### Verdict
[PASS / PASS WITH NOTES / FAIL — details]
```

### Regression Suite Maintenance
Perform quarterly regression suite health checks:

| Check | Action |
|---|---|
| Tests for deleted features | Remove them |
| Tests with changed requirements | Update assertions |
| Flaky tests (fail intermittently) | Investigate root cause (never just skip) — use `test-fixing` skill |
| Coverage gaps (untested critical paths) | Write new tests |
| Slow tests (>30s) | Optimize or move to nightly suite |

### Regression Rules
- **Never skip a failing test.** Fix it or investigate it (skill `test-fixing.md`).
- **P1 tests must always pass.** A failing P1 test blocks the release.
- **Visual regression is mandatory for CSS changes.** Use `browser-visual-testing` skill.
- **Document regression decisions.** "Why didn't we test X?" should always have an answer.
