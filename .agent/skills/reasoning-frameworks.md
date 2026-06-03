---
description: Reasoning Frameworks — sequential thought-chains, structured decomposition (MECE/Issue Tree/Pre-Mortem/Weighted Matrix), and the executive critical-thinking decision gate | Consolidates: sequential-thinking, structured-analysis-frameworks, critical-thinking-models
---

# SKILL: REASONING FRAMEWORKS

**Trigger:** Whenever a task needs disciplined reasoning before action — implementing complex logic, decomposing a multi-variable decision, or gating a feature/architecture delegation. Pick the section that matches the problem: Sequential Thinking for algorithmic logic, Structured Analysis Frameworks for complex decomposition/decisions, Critical Thinking Models for the fast pre-delegation gate.

---

## Choosing a Section

| Situation | Use |
|---|---|
| Complex calculation, non-obvious debugging, multi-step algorithm | Sequential Thinking |
| Complex decision with many variables, competing options, exhaustive decomposition | Structured Analysis Frameworks |
| Pre-delegation gate for a new feature or architecture change | Critical Thinking Models |

Order of escalation: the Critical Thinking Models gate is the fast (< 30s) first pass. When it surfaces a genuinely complex decision, escalate into Structured Analysis Frameworks. Sequential Thinking applies separately, at implementation time, for algorithmic complexity.

---

# Sequential Thinking

Decompose complex logic into verifiable thought chains before implementation.

**Use before** implementing complex calculations, debugging non-obvious logic, or designing multi-step algorithms — especially computations with multiple interacting variables, order-dependent operations, or domain-specific rule engines.

## When to Use

| Scenario | Use Sequential Thinking? | Alternative |
|---|---|---|
| Algorithmic complexity (within one function) | Yes | — |
| Multi-variable calculations (>3 interacting variables) | Yes | — |
| Debugging non-obvious logic failures | Yes | After `systematic-debugging` Phase 1-2 |
| Task-level complexity (multiple files/systems) | No | Use `context-management` skill |
| Both algorithmic AND system complexity | Decompose first, then think | `context-management` → then sequential thinking per sub-task |
| Simple, well-understood operations | No | Just code it |

## The 5-Step Process

### Step 1: Frame the Problem
Before calling the tool, write a clear problem statement:
```markdown
## Problem
**What:** [What computation/logic needs to be implemented?]
**Inputs:** [What data goes in?]
**Expected output:** [What should come out?]
**Known rules:** [What constraints or domain rules apply?]
**Verification:** [How will I know the solution is correct?]
```

### Step 2: Call Sequential Thinking Tool
```
Tool: mcp_sequential-thinking_sequentialthinking
thought: [Your first analytical step]
nextThoughtNeeded: true
thoughtNumber: 1
totalThoughts: [estimated — can adjust]
```

**Tips for effective thought chains:**
- Start with the simplest sub-problem and build up.
- Each thought should produce a **testable intermediate result**.
- When stuck, use `isRevision: true` to reconsider a previous step.
- When a thought branches, use `branchFromThought` and `branchId` to explore alternatives.

### Step 3: Generate Hypothesis
After enough thought steps, form a concrete hypothesis:
```
thought: "Based on steps 1-N, my hypothesis is: [specific algorithm/approach]"
```

### Step 4: Verify Against Known Rules
Before writing code:
1. Check `docs/` reference files for domain rules.
2. Check `src/data/` lookup tables for correctness.
3. Cross-reference with existing engine implementations.
4. If the hypothesis contradicts a trusted source, **the source wins** (Rule `anti-patterns.md`).

### Step 5: Implement Only After Verification
- Write code ONLY after the thinking chain confirms a validated approach.
- Include the thought chain summary as a code comment for future maintainers.

## Domain-Specific Triggers
These types of computations REQUIRE sequential thinking before implementation:

| Category | Example Computation | Why |
|---|---|---|
| Multi-variable algorithms | Calculations with 3+ interacting variables | Complex state interactions |
| Order-dependent operations | Pipelines where step order changes output | Subtle sequencing bugs |
| Lookup-with-exceptions | Mapping tables with edge case overrides | Exception paths hide bugs |
| Precision-critical math | Floating-point, calendar, or financial calculations | Rounding/boundary errors |
| Layered system construction | Multi-layer data structures (e.g., grids, trees) | Inter-layer dependencies |
| Conditional rule engines | Business rules with nested conditions and edge cases | Combinatorial explosion |
| Pattern-based derivation | Input → derived output via historical or mathematical patterns | Pattern-based with variants |

## Integration with Confidence Routing
After completing sequential thinking:
- Include a **confidence score** (Rule `routing.md`) in the final thought.
- If confidence < 60%, re-enter thinking or escalate to @pm.
- Document the verified approach before proceeding to implementation.

## Rules
- **Never skip verification** — thinking without checking sources is just confident guessing.
- **Adjust thought count** — if you reach the estimated total but aren't confident, add more thoughts.
- **Branch, don't force** — if a thought chain hits a wall, branch from an earlier point rather than pushing forward.
- **Keep thoughts focused** — each thought should advance the solution, not restate the problem.

---

# Structured Analysis Frameworks

MECE decomposition, Issue Trees, Pre-Mortem scenarios, and Weighted Decision Matrix for complex decisions.

**Use when** @pm or @sa faces a complex decision with multiple variables, competing options, or a need for exhaustive decomposition. Complements the Critical Thinking Models gate (fast pass) with deeper structured analysis when needed.

## When to Use
- **MECE:** Breaking down a complex problem into non-overlapping, exhaustive categories.
- **Issue Tree:** Diagnosing root causes or mapping all solution paths for a problem.
- **Pre-Mortem:** Deep adversarial analysis of a plan BEFORE implementation (deeper than the quick pre-mortem in Critical Thinking Models §3).
- **Weighted Matrix:** Choosing between 3+ competing options with multiple criteria.

## When to SKIP
- Trivial or Small tasks (see `routing.md`).
- Only 1-2 obvious options → use the Critical Thinking Models quick gate instead.
- Already classified as Cynefin **Clear** → just execute.

## Framework 1: MECE Decomposition
> **M**utually **E**xclusive, **C**ollectively **E**xhaustive

Ensures no overlap and no gaps when breaking down a problem.

### Process
1. **Define the top-level question** in one sentence.
2. **Break into 2-5 categories** that are:
 - **Mutually Exclusive:** No item belongs to two categories.
 - **Collectively Exhaustive:** All possibilities are covered.
3. **Test completeness:** Ask "Is there anything that doesn't fit any category?"
4. **Test exclusivity:** Ask "Does any item fit multiple categories?"

### Template
```markdown
### MECE Decomposition — [Topic]

**Top-level question:** [What are we decomposing?]

| Category | Items | Notes |
|---|---|---|
| [Category A] | [items that belong here] | [why this grouping] |
| [Category B] | [items] | [notes] |
| [Category C] | [items] | [notes] |

**Completeness check:** All items accounted for / Gap: [what's missing]
**Exclusivity check:** No overlaps / Overlap: [where items fit multiple categories]
```

### Common MECE Patterns for Software
| Problem Type | MECE Split |
|---|---|
| User journey | Awareness → Acquisition → Activation → Retention → Revenue → Referral (AARRR) |
| Code architecture | Frontend / Backend / Infrastructure / Data / Security |
| Bug diagnosis | Input / Processing / Output / Environment |
| Performance | Network / Rendering / Computation / Memory / I/O |
| Feature scope | Must-have / Should-have / Could-have / Won't-have (MoSCoW) |

## Framework 2: Issue Tree
> Systematic decomposition of a problem into sub-problems, then sub-sub-problems.

### Process
1. **Root node:** State the problem as a yes/no question or a "how" question.
2. **Level 1 branches:** Break into 2-4 MECE sub-questions.
3. **Level 2 branches:** Break each sub-question further (max 3 levels deep).
4. **Leaves:** Each leaf should be a testable hypothesis or actionable item.

### Template
```markdown
### Issue Tree — [Problem Statement]

[Root Question]
├── [Branch 1: Sub-question]
│ ├── [Leaf 1a: Hypothesis / Action]
│ └── [Leaf 1b: Hypothesis / Action]
├── [Branch 2: Sub-question]
│ ├── [Leaf 2a]
│ └── [Leaf 2b]
└── [Branch 3: Sub-question]
 ├── [Leaf 3a]
 └── [Leaf 3b]

**Prioritized investigation order:** [Leaf X] → [Leaf Y] → [Leaf Z]
```

### When to Use Issue Trees
| Scenario | Root Question Format |
|---|---|
| Bug diagnosis | "Why is [symptom] happening?" |
| Feature design | "How can we achieve [goal]?" |
| Architecture decision | "Should we use [approach A] or [approach B]?" |
| Performance issue | "What is causing [slowness/latency]?" |

## Framework 3: Pre-Mortem (Deep)
> Imagine the project has FAILED. Work backwards to find why.

This is the **deep version** — for significant decisions. For quick checks, use Critical Thinking Models §3 (Inversion).

### Process
1. **Set the scene:** "It's [6 months from now]. The [feature/decision] has failed. It was a disaster."
2. **Individual brainstorm:** Each agent independently writes 2-3 failure scenarios.
3. **Categorize failures** using MECE: Technical / UX / Market / Organizational / External.
4. **Score** each scenario: Probability (1-5) × Impact (1-5) = Risk Score.
5. **Address top 3:** Create mitigations for the highest-scoring scenarios.

### Template
```markdown
### Pre-Mortem — [Decision/Feature Name]

**Premise:** It's [future date]. This has failed completely.

| # | Failure Scenario | Category | Probability | Impact | Risk Score | Mitigation |
|---|---|---|---|---|---|---|
| 1 | [What went wrong] | [Tech/UX/Market/Org/External] | [1-5] | [1-5] | [P×I] | [What we can do now] |
| 2 | ... | ... | ... | ... | ... | ... |
| 3 | ... | ... | ... | ... | ... | ... |

**Top Risks to Address Before Proceeding:**
1. [Highest risk score] → [Action]
2. [Second highest] → [Action]
3. [Third highest] → [Action]
```

## Framework 4: Weighted Decision Matrix
> Systematic comparison of options against weighted criteria.

### Process
1. **List options** (2-5 competing approaches).
2. **Define criteria** (4-7 evaluation dimensions).
3. **Assign weights** (must sum to 100%) — this is where values/priorities are made explicit.
4. **Score** each option against each criterion (1-5 scale).
5. **Calculate** weighted scores and rank.

### Template
```markdown
### Weighted Decision Matrix — [Decision Name]

**Options:** A: [name] | B: [name] | C: [name]

| Criterion | Weight | Option A | Option B | Option C |
|---|---|---|---|---|
| [Criterion 1] | [%] | [1-5] (×W=[X]) | [1-5] (×W=[X]) | [1-5] (×W=[X]) |
| [Criterion 2] | [%] | [score] | [score] | [score] |
| [Criterion 3] | [%] | [score] | [score] | [score] |
| [Criterion 4] | [%] | [score] | [score] | [score] |
| **Total** | **100%** | **[sum]** | **[sum]** | **[sum]** |

**Winner:** [Option X] with [score] — [1-sentence justification]
**Runner-up:** [Option Y] — [why it lost]
**Key differentiator:** [The criterion that swung it]
```

### Common Criteria Sets for Software Decisions
| Decision Type | Recommended Criteria (example weights) |
|---|---|
| Tech stack choice | Performance (25%), DX (20%), Ecosystem (20%), Learning curve (15%), Scalability (20%) |
| Architecture pattern | Maintainability (25%), Performance (20%), Testability (20%), Complexity (15%), Flexibility (20%) |
| Library selection | API quality (25%), Bundle size (20%), Community (20%), TypeScript support (15%), Documentation (20%) |
| Feature prioritization | User impact (30%), Dev effort (25%), Strategic fit (20%), Risk (15%), Dependencies (10%) |

## Integration Points
- **Input from:** Critical Thinking Models (when deeper analysis needed), `requirement-enrichment` (complex requirements), `/party-mode` (brainstorm outputs)
- **Output to:** Auto-Delegation table, `/idea-forge`, `.hc/decisions/`
- **Complements:** Critical Thinking Models (quick 7-model gate), `idea-validation` (DFV scoring), `red-team-ideas` (adversarial analysis)

## Guardrails
- **Match framework to problem:** Don't use a Weighted Matrix for a 2-option choice — that's a quick pros/cons.
- **Time-box:** MECE split ≤ 5 min, Issue Tree ≤ 10 min, Pre-Mortem ≤ 15 min, Matrix ≤ 10 min.
- **Bias check:** After completing any framework, run the Cognitive Bias Scan from Critical Thinking Models §7.
- **Don't stack frameworks.** Use 1-2 per decision. If you need all 4, the problem is probably too big — decompose first.

---

# Critical Thinking Models

Structured executive decision gate for @pm before delegating features or architecture.

**Use before** any feature or architecture delegation (after `requirement-enrichment`, before Auto-Delegation). Skipped for bug fixes, documentation, and trivial changes (≤3 files).

## When to Use
- User requests a new feature, module, or architectural change.
- A brainstorm session concludes and routes to implementation.
- `requirement-enrichment` has clarified the task and it's a feature/architecture scope.

## When to SKIP
- Bug fixes, hotfixes, production incidents.
- Documentation, content, or copy changes.
- Trivial changes (≤3 files, single concern).
- Tasks already classified as **Clear** by Cynefin (§4 below).

## The Seven-Model Checklist

Run through each model in order. Each takes ~1-2 sentences. Total gate: < 30 seconds of reasoning.

### 1. First Principles
> "What are the 2-3 non-negotiable constraints of this feature?"

Strip away assumptions, industry norms, and "how others do it." What MUST be physically, logically, or technically true for this to work?

**Output:** 2-3 bullet points of fundamental constraints.

### 2. Second-Order Effects
> "If we build this, and then what?"

Look beyond the immediate result. Identify downstream consequences:
- **1 negative downstream effect** on codebase, performance, or maintenance.
- **1 negative downstream effect** on UX or user behavior.
- **1 positive compounding effect** (if any — don't force it).

**Output:** 3 bullet points (2 risks, 1 opportunity).

### 3. Inversion (Quick Pre-Mortem)
> "If this feature failed in 3 months, what are the top 2 reasons?"

Assume the feature was built and flopped. Work backward to find the cause. This is NOT a full Pre-Mortem (use the Structured Analysis Frameworks Pre-Mortem or `red-team-ideas` for that on major features) — it's a 2-sentence gut check.

**Output:** 2 failure reasons, each with a 1-line mitigation.

### 4. Cynefin Classification
> "What complexity domain does this problem live in?"

| Domain | Signal | Response Strategy |
|---|---|---|
| **Clear** | Best practice exists, no debate needed | Fast-path → skip remaining models |
| **Complicated** | Needs expert analysis, multiple valid approaches | Route to @sa for architecture review |
| **Complex** | No clear cause-effect, emergent patterns | Probe first: build a spike/experiment, measure, then decide |
| **Chaotic** | Crisis, production down, urgent | Act immediately → analyze later (skip this gate entirely) |

**Output:** Domain classification + response strategy.

### 5. Opportunity Cost
> "What existing priority will be delayed if we do this?"

Check the current roadmap/backlog. Name the specific story, epic, or sprint goal that gets pushed back.
- If nothing gets pushed → capacity is free → proceed.
- If a P1 gets delayed → flag to User with trade-off.

**Output:** Trade-off statement or "No competing priority identified."

### 6. Circle of Competence
> "Is this within our project's core scope?"

| Assessment | Action |
|---|---|
| Core scope (directly serves users) | Proceed |
| Adjacent (related but not core) | Flag to User: "This is adjacent to our scope. Recommend deferring to Phase X." |
| Out of scope (unrelated to product vision) | Recommend Icebox with rationale |

**Output:** Scope assessment + recommendation.

### 7. Cognitive Bias Scan
> "Am I falling into a known thinking trap?"

Quickly scan for 6 common biases that derail agent decisions:

| Bias | Trigger Question | Debiasing Action |
|---|---|---|
| **Confirmation** | Am I only looking at evidence that supports my preferred approach? | Force yourself to list **1 strong argument AGAINST** your choice. |
| **Anchoring** | Am I fixated on the first solution I thought of? | Generate **2 alternative approaches** before proceeding. |
| **Sunk Cost** | Am I continuing because of past effort, not future value? | Ask: "If I started fresh today, would I still choose this?" |
| **Status Quo** | Am I avoiding change because current code "works fine"? | Ask: "Would I design it this way if building from scratch?" |
| **Survivorship** | Am I only considering successful examples? | Ask: "What projects tried this approach and failed?" |
| **Dunning-Kruger** | Am I overconfident about an unfamiliar domain? | Check: Have I consulted docs/context7 for this area? |

**Output:** Flag any bias detected. If >1 bias flagged → reduce confidence score by 10 points and note the specific bias in your reasoning.

## Output Format

```markdown
### Critical Thinking Gate — [Feature Name]

**First Principles:** [2-3 constraints]
**Second-Order:** [risk 1] | [risk 2] | [opportunity]
**Pre-Mortem:** Fail reason 1: [x] → Mitigation: [y]. Fail reason 2: [x] → Mitigation: [y].
**Cynefin:** [Domain] → [Response strategy]
**Opportunity Cost:** [Trade-off or "None"]
**Scope:** [Core / Adjacent / Out of scope] → [Action]
**Bias Check:** [None detected / Bias: [name] → [debiasing action taken]]

**Gate Verdict:** PROCEED / PROCEED WITH CHANGES / PROBE FIRST / DEFER
```

## Integration Points
- **Input:** Enriched requirement from `requirement-enrichment` skill.
- **Output:** Feeds into Auto-Delegation Decision Table (§3.2 of `@pm.md`) or `/idea-forge` if Complex domain.
- **Placement:** After @pm Step 0 (Input Enrichment), before Step 3.2 (Auto-Delegation).
- **Complements:** `red-team-ideas` (deeper adversarial analysis), `idea-validation` (idea comparison), Structured Analysis Frameworks (MECE, Issue Trees, Weighted Matrix for complex decisions).

## Guardrails
- This gate is a **mental checklist**, not a workflow. It should take < 30 seconds.
- Do NOT block on this gate for simple tasks. If Cynefin says **Clear** → skip.
- Do NOT use this gate to justify inaction. The default is **PROCEED**.
- If all seven models agree → there's no reason to delay.
- The Bias Scan is a **check-yourself** mechanism, not a reason to halt. If a bias is detected, address it and move on.
