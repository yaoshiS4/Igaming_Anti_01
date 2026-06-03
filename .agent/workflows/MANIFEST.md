# Workflows Manifest

> Lazy-load index for workflows. Workflows load ONLY when the user invokes a `/slash-command`. Find the file here, then `view_file .agent/workflows/<name>.md`. See `instructions.md` §Context Optimization Protocol.
> Auto-generated from each workflow's `description:` frontmatter.

| Command | Description |
|---|---|
| `/battle-test` | Stress-test a feature with edge cases, boundary conditions, and adversarial inputs |
| `/cleanup-state` | Automated garbage collection for aged telemetry and debug reports |
| `/close-phase` | Close Phase - cleanup workspace and sync SOT after completing a phase |
| `/code-review` | PR-level code review — quality check with structured feedback |
| `/codebase-review` | Review an entire codebase against framework best practices and generate a prioritized improvement plan |
| `/consistency-check` | Cross-artifact consistency check — validate spec, plan, and tasks are aligned before implementation |
| `/delegate-task` | Delegate Task - streamlined pipeline for delegating scoped work to CLI worker agents via spawn-agent |
| `/design-to-code` | Full design-to-code pipeline — from mockup/brief to coded components with visual verification |
| `/discuss-assumptions` | Codebase-first discussion mode — shows assumptions instead of asking questions for faster intake on brownfield projects |
| `/forensics` | Post-mortem investigation of failed workflow runs — diagnoses stuck loops, missing artifacts, and git anomalies |
| `/framework-lint` | Validate .agent/ framework integrity — reference checks, manifest accuracy, and structural consistency |
| `/handoff` | Generate a structured handoff artifact for cross-model delegation between PM and Dev conversations |
| `/hc-sdlc` | HC Software Development Life Cycle - sequential pipeline aligned with SDLC, Waterfall, and SPARC |
| `/idea-forge` | Idea Forge - full dialectical development cycle from brainstorm through adversarial validation to implementation and review |
| `/idea-to-prd` | Raw idea to structured PRD — from brainstorm to formal requirements document |
| `/implementation-review` | Implementation Review - post-build roundtable to evaluate approach quality and surface tech debt before shipping |
| `/new-endpoint` | Sequential workflow for adding a new backend endpoint — from contract to tested implementation |
| `/next` | Auto-detect project state and route to the next logical workflow step in the SDLC pipeline |
| `/party-mode` | Party Mode - multi-agent brainstorming, collaboration, and dialectical idea development |
| `/pentest-session` | Full penetration testing session — adversarial security testing with attack simulations and structured vulnerability reporting |
| `/plant-seed` | Capture forward-looking ideas with trigger conditions that auto-surface at the right milestone |
| `/prebuild-clean` | Clean build artifacts, bundler caches, and TS incremental files before a fresh build |
| `/propose` | Spec-driven feature proposal — creates a structured change folder with proposal, specs, design, and tasks |
| `/qa-responsive-check` | Automated responsive QA — screenshots and DOM checks at mobile, tablet, and desktop breakpoints |
| `/receive-handoff` | Bootstrap a new conversation from a handoff artifact — verify freshness, load context, and begin execution |
| `/refactor-be` | Safe backend refactoring workflow — coverage-first, green-stays-green, security re-scan |
| `/retrospective` | Retrospective - post-phase reflection and self-improvement analysis |
| `/review-backlog` | Review, promote, or prune parked ideas from the seeds backlog |
| `/run-e2e-qa` | Automated E2E QA — Browser Subagent simulates real user flows, captures failures |
| `/scaffold-feature` | Scaffold a new feature — types/models → business logic → UI components with review artifacts |
| `/spawn-base-template` | Shared 6-phase structure for all /spawn-* swarm workflows. Individual spawn workflows inherit and customize. |
| `/spawn-biz` | Business & Usability Swarm - spawn parallel agents to audit market fit, user flows, conversion, and real-user simulation |
| `/spawn-debug` | Debug Swarm - spawn parallel debug agents across architecture, code, tests, infra, and security to exhaustively diagnose issues |
| `/spawn-performance` | Performance & Scale Swarm - spawn parallel agents to audit bundle size, runtime, Core Web Vitals, database, caching, and scale readiness |
| `/spawn-research` | Research Swarm - spawn parallel research agents with self-critique, cross-discussion, and critical-thinking synthesis |
| `/spawn-security` | Security Hardening Swarm - spawn parallel agents for offensive + defensive security audit covering pen testing, CVEs, secrets, CSP, and input sanitization |
| `/spawn-ui` | UI/UX & Business Flow Swarm - spawn parallel agents to audit visual design, accessibility, responsiveness, design system, and business flow UX |
| `/sprint-review` | End-of-sprint review — scan commit history and closed tasks, generate CHANGELOG and progress summary |
| `/swarm-execute` | Swarm Execute - coordinated multi-agent wave pipeline for complex tasks requiring parallel execution |
| `/sync-docs` | Automated Documentation Sync — Detects code changes and automatically updates drifting documentation like ARCHITECTURE.md, AGENTS.md, and KIs. |
| `/test-all-be` | Full backend test suite regression sweep — discover tests, run all, file bug records for failures, enforce PR pass gate |
| `/thread` | Persistent context threads for cross-session knowledge on specific topics |
| `/token-check` | Context audit and token-burn mitigation workflow. Use when approaching complexity tier token limits. |
| `/user-test-session` | Full user testing session — simulate end-users testing all features and generate structured feedback report |
| `/ux-audit` | Proactive UX audit — evaluate existing screens, identify improvements, implement, and verify the full cycle |
| `/visual-redesign` | Visual Redesign Workflow — Upgrade existing "boring" UI and escalate visual quality without changing business logic or UX functional structure. |
