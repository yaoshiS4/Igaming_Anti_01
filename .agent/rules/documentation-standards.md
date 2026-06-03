---
description: Documentation Standards - SDLC output structure, code docs, and architecture diagram requirements
---

# RULE: DOCUMENTATION STANDARDS

**Mode:** Always On
**Scope:** All agents

---

## 1. SDLC Document Output (Binding)

All project documents MUST be written to the `/docs/` directory, organized by category:

```
docs/
  tech/             # Technical docs (SPARC phases P, A, R)
    ARCHITECTURE.md       # System architecture, component diagrams
    API_CONTRACTS.md      # API endpoints, request/response schemas
    TEST_PLAN.md          # Test strategy, coverage targets
    DEPLOYMENT.md         # Deploy process, environments, rollback
    ADR/                  # Architecture Decision Records
      ADR-001-*.md
  biz/              # Business docs (SPARC phase S)
    PRD.md                # Product Requirements Document
    PRODUCT_BRIEF.md      # One-pager product summary
    MARKET_RESEARCH.md    # Market sizing, competitive analysis
    GTM_PLAN.md           # Go-to-market strategy
  log/              # Execution logs (SPARC phase C)
    CHANGELOG.md          # Release changelog (Keep a Changelog)
    SPRINT_LOG.md         # Sprint review summaries
    INCIDENT_LOG.md       # Post-incident reports
```

### SDLC Phase Mapping

| SPARC Phase | Output Type | Target Folder |
|-------------|-------------|---------------|
| S - Specification | PRD, market research, user stories | `docs/biz/` |
| P - Pseudocode | Algorithm docs, ADRs | `docs/tech/ADR/` |
| A - Architecture | Architecture, API contracts | `docs/tech/` |
| R - Refinement | Test plans, deployment guides | `docs/tech/` |
| C - Completion | Changelog, sprint logs, incident reports | `docs/log/` |

### Binding Rules
- NEVER write project documents to the project root. Root is for README.md and framework context files only.
- NEVER write documents to `.temp/` — that is for scratch data only.
- ADRs follow the naming convention: `ADR-NNN-short-title.md`
- Changelog follows [Keep a Changelog](https://keepachangelog.com/) format.
- Sprint logs are appended, not overwritten.

---

## 2. Code Documentation

- **Public functions/APIs:** Must have JSDoc with `@param`, `@returns`, `@throws`.
- **Complex algorithms:** Must have explanatory comments explaining *why*, not *what*.
- **Magic numbers:** Must be extracted to named constants with a comment.
- **Type definitions:** Complex types must have `/** */` descriptions.

## 3. Module Documentation

- Every major module/feature directory should have a brief README or header comment explaining:
  - What it does
  - How it fits in the architecture
  - Key dependencies

## 4. Architecture Documentation

- New components/modules must be reflected in `docs/tech/ARCHITECTURE.md`.
- New API endpoints must be reflected in `docs/tech/API_CONTRACTS.md`.
- Significant design decisions must have an ADR in `docs/tech/ADR/`.

## 5. Style Guide (Voice, Terminology, Formatting)

This is the foundational reference all document writing inherits from. Check it before writing or reviewing any document — project or business-facing.

### Brand Voice — Core Principles

| Principle | Description | Example |
|---|---|---|
| Professional but human | Authoritative without being stiff. Avoid corporate-speak. | "This feature helps you [action] faster." vs "This functionality facilitates optimized [action]." |
| Data-driven | Every claim backed by a number or source. No vague superlatives. | "[X]M users [action] daily." vs "Millions of people use [product]." |
| Culturally respectful | Domain terms used accurately. Never trivialize domain knowledge. | Use established terminology from the project domain. |
| Action-oriented | Every document ends with a clear next step or decision point. | "Next step: @dev implements the API by [date]." vs "Further discussion may be warranted." |

### Voice by Audience

| Audience | Tone | Jargon Level | Language |
|---|---|---|---|
| Internal agents (@dev, @ba, etc.) | Direct, technical | High -- use domain terms freely | English |
| End users (app UI, help docs) | Warm, guiding | Low -- explain all terms | Project's primary locale |
| Business partners | Professional, benefit-focused | Medium -- business terms OK | Match recipient |
| Investors | Concise, data-first | None -- plain language | Match recipient |

### Terminology Standards

1. Define terms on first use. Link to `GLOSSARY.md` if project-wide.
2. Use consistent naming. Pick one term and stick with it throughout a document.
3. Domain terms stay in their original language. Use the established term from the project's domain, not a generic translation.

Term decision pattern: prefer the project brand name over a generic description, the domain-specific term over a generic translation, and a precise descriptor over a vague alternative.

### Bilingual Writing Standards

| Context | Primary Language | Secondary Language |
|---|---|---|
| Technical docs (PRDs, ADRs, architecture) | English | Domain terms in project locale |
| User-facing UI copy | Project's primary locale | English for technical labels |
| Help docs / guides | Project's primary locale | English technical terms in parentheses |
| Business outreach (domestic) | Project's primary locale | -- |
| Business outreach (international) | English | -- |
| Marketing content | Project's primary locale | English keywords for SEO |
| Investor materials | English | Market-specific terms with translation |

Mixed-language rules:
1. Technical terms in English stay in English inside localized text (e.g., "API endpoint", "SDK").
2. Domain terms stay in their original language inside English text (use established terminology).
3. Parenthetical translations for cross-audience docs: "[Term] ([Translation])" on first use.
4. Never auto-translate domain terms without human review -- mistranslation damages credibility.

### Formatting Standards (All Doc Types)

- Date format: `YYYY-MM-DD` everywhere.
- File naming: `kebab-case-document-name.md`.
- Status labels: `Draft → Review → Approved → Final`.
- Headers: H1 for title, H2 for major sections, H3 for sub-sections. Max depth: H4.
- Bold: key terms on first use, metrics, and decision points.
- Code blocks: any file paths, commands, variable names, or API endpoints.
- Tables over prose: for comparisons, structured data, and timelines.
- Paragraphs: 3 sentences max. One idea per paragraph.
- Lists: bullet points for 3+ unordered items. Numbered lists for sequential steps.

Document metadata — every document starts with:
```markdown
# [Document Type]: [Title]
**Version:** X.Y | **Date:** YYYY-MM-DD | **Author:** @role
**Status:** Draft | Review | Approved | Final
```

### Cross-Skill Reference

This style guide is the foundation. Specific skills add domain-specific rules:

| Skill | Adds |
|---|---|
| `technical-writing` | Project doc templates (Brief, Meeting Notes, Research, ADR, CHANGELOG, Help Article) |
| `prd-architect` | PRD structure, acceptance criteria, phase decomposition |
| `business-writing` | External communication templates, stakeholder tone |
| `investor-pitch-writer` | One-pager structure, "no jargon" rule |
| `content-and-brand` | Content pipeline, distribution, SEO structure, CRO microcopy, editorial calendar, content audit methodology |
| `devops-operations` | Incident documentation, blameless language |
| `research-analysis` | Source citation, confidence scoring, serendipity logs |

### Style Guide Principles

- Voice consistency > personal preference. Follow the brand voice table.
- When in doubt, be specific. Vague text wastes everyone's time.
- Date everything. Undated documents are unreliable.
- Link, don't duplicate. Reference existing docs instead of copying content.

---

## 6. Rules

- Never write `// TODO` without a linked issue or ticket.
- Never write `// fix this later` -- either fix it now or create a tracking item.
- Update docs when changing the interface they describe.
- Inline comments explain intent, not mechanics.
