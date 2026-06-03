# Spawn-Agent Skill Benchmark

> First benchmark entry for the worker delegation system.

## Methodology
- Compare task completion **with** vs **without** spawn-agent delegation
- Measure: token efficiency, context pollution, task accuracy, time

---

## Benchmark Log

| Date | Task | Without Delegation | With Delegation | Token Savings | Quality |
|------|------|-------------------|-----------------|---------------|---------|
| 2026-03-13 | Research: Analyze spawn-agent repo structure | ~4000 tokens consumed in main context for file reads, grep, and analysis | ~800 tokens in main (prompt + review output) + worker handles heavy reads | ~80% context savings | Same accuracy — research summary was equivalent |
| 2026-03-12 | Fix multi-agent spawning pipeline | All debugging in main context — 6 files read, build output, error traces = ~60% context consumed | Worker researched files, main orchestrated fixes — ~25% context consumed | ~58% context savings | Comparable — worker found root causes, orchestrator applied fixes |

---

## Aggregate Metrics

| Metric | Average (n=2) | Notes |
|--------|---------------|-------|
| **Context savings** | ~69% | Main context stays clean for reasoning |
| **Accuracy** | Equivalent | Workers produce same quality as direct execution |
| **Time overhead** | +30s | Script startup + output parsing adds small latency |
| **Best use case** | Read-heavy research tasks | Maximum context savings when task reads many files |

---

## Observations

1. **Research tasks benefit most** — file reads are the biggest context polluters, and workers handle them in isolation.
2. **Implementation tasks have moderate benefit** — context savings depend on how many files need reading vs writing.
3. **Bug fixes benefit least** — tight feedback loops between reading and debugging favor staying in the main context.
4. **Template quality is the bottleneck** — poorly composed prompts waste worker sessions. Template validation would help.

---

## Next Benchmarks Needed

- [ ] Benchmark refactoring delegation (new template)
- [ ] Benchmark parallel workers (multi-worker pattern)
- [ ] Benchmark different timeout values (120s vs 300s vs 600s)
- [ ] Compare Gemini vs Codex worker performance on same task

---

## Auto-Collected Metrics

> Appended automatically by `spawn-agent.ps1` / `spawn-agent.sh` after each delegation.

| Date | Task | Agent | Mode | Prompt Size | Duration | Timeout | Exit | Status |
|------|------|-------|------|-------------|----------|---------|------|--------|
| 2026-03-19 | debug-track-sa | GEMINI | --approval-mode auto_edit | 3089 chars | 61.3s | None (wait forever) | 0 | ✅ |
| 2026-03-19 | debug-track-ba | GEMINI | --approval-mode auto_edit | 3099 chars | 66.3s | None (wait forever) | 0 | ✅ |
| 2026-03-19 | debug-track-qc | GEMINI | --approval-mode auto_edit | 3132 chars | 108.8s | None (wait forever) | 0 | ✅ |
| 2026-03-19 | debug-track-sa | GEMINI | --approval-mode auto_edit | 3089 chars | 152.8s | None (wait forever) | 0 | ✅ |
| 2026-03-19 | debug-track-dev | GEMINI | --approval-mode auto_edit | 3067 chars | 170.3s | None (wait forever) | 0 | ✅ |
| 2026-03-19 | debug-track-sec | GEMINI | --approval-mode auto_edit | 3180 chars | 275.2s | None (wait forever) | 0 | ✅ |
| 2026-03-19 | debug-spawn-scripts | GEMINI | --approval-mode auto_edit | 1845 chars | 245.9s | 300s | 1 | ❌ |
| 2026-03-19 | perf-spawn-scripts | GEMINI | --approval-mode auto_edit | 1180 chars | 139.9s | 120s | 124 | ⏰ |
| 2026-03-19 | inline | NODE | (custom via -ExtraArgs) | 19 chars | 4.1s | None (wait forever) | 0 | ✅ |
| 2026-03-19 | inline | GEMINI | --approval-mode auto_edit | 64 chars | 13.4s | 10s | 0 | ✅ |
| 2026-03-19 | huge_prompt | GEMINI | --approval-mode auto_edit | 40002 chars | 5.4s | None (wait forever) | 1 | ❌ |
| 2026-03-19 | huge_prompt | GEMINI | --approval-mode auto_edit | 40002 chars | 17s | None (wait forever) | 0 | ✅ |
| 2026-03-19 | perf-track-agents | GEMINI | --approval-mode auto_edit | 809 chars | 89.9s | None (wait forever) | 0 | ✅ |
| 2026-03-19 | inline | GEMINI | --approval-mode auto_edit | 42 chars | 1.2s | None (wait forever) | 1 | ❌ |
| 2026-03-19 | inline | GEMINI | --approval-mode auto_edit | 42 chars | 1.7s | None (wait forever) | 1 | ❌ |
| 2026-03-19 | inline | GEMINI | --approval-mode auto_edit | 42 chars | 1.5s | None (wait forever) | 1 | ❌ |
| 2026-03-19 | inline | GEMINI | --approval-mode auto_edit | 42 chars | 1.3s | None (wait forever) | 1 | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 42 chars | 19.7s | None (wait forever) | 1 | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 42 chars | 2.7s | None (wait forever) | 1 | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 42 chars | 19.8s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 12 chars | 19.8s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | C:\USERS\HEOCOP\DOWNLOADS\PROJECTS\ANTIGRAVITY\.AGENT\SCRIPTS\TESTS\GEMINI.CMD | (custom via -ExtraArgs) | 11 chars | 5.1s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | C:\USERS\HEOCOP\DOWNLOADS\PROJECTS\ANTIGRAVITY\.AGENT\SCRIPTS\TESTS\GEMINI.CMD | (custom via -ExtraArgs) | 11 chars | 3.9s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | C:\USERS\HEOCOP\DOWNLOADS\PROJECTS\ANTIGRAVITY\.AGENT\SCRIPTS\TESTS\GEMINI.CMD | (custom via -ExtraArgs) | 11 chars | 3.7s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | C:\USERS\HEOCOP\DOWNLOADS\PROJECTS\ANTIGRAVITY\.AGENT\SCRIPTS\TESTS\GEMINI.CMD | (custom via -ExtraArgs) | 11 chars | 5.5s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | C:\USERS\HEOCOP\DOWNLOADS\PROJECTS\ANTIGRAVITY\.AGENT\SCRIPTS\TESTS\GEMINI.CMD | (custom via -ExtraArgs) | 11 chars | 6.6s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 32.9s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 31.1s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 89.4s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 5.5s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 3.9s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 6.1s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 4.3s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 5.9s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 3.9s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 4.7s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 19 chars | 6s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 3.1s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 19 chars | 4.9s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 3s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 19 chars | 5.5s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 3.2s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 19 chars | 3.6s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 3.3s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 19 chars | 6.1s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 3.3s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 19 chars | 4.9s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 5.2s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 19 chars | 4.2s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 4.8s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 19 chars | 3.1s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 3.9s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 19 chars | 5.6s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 5.3s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 19 chars | 4.2s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 11 chars | 5.2s | None (wait forever) |  | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 19 chars | 5.5s | None (wait forever) | 1 | ❌ |
| 2026-03-20 | inline | GEMINI | --approval-mode auto_edit | 12 chars | 4.9s | 1s | 124 | ⏰ |
| 2026-03-20 | prompt_580187400 | GEMINI | --approval-mode auto_edit | 11 chars | 4.5s | None (wait forever) |  | ❌ |
| 2026-03-20 | prompt_474541768 | GEMINI | --approval-mode auto_edit | 19 chars | 5.3s | None (wait forever) | 1 | ❌ |
| 2026-03-20 | prompt_2128900736 | GEMINI | --approval-mode auto_edit | 12 chars | 4.2s | 1s | 124 | ⏰ |
| 2026-03-20 | prompt_1674528457 | GEMINI | --approval-mode auto_edit | 28 chars | 4.8s | None (wait forever) |  | ❌ |
| 2026-03-21 | prompt_1611821324 | GEMINI | --approval-mode auto_edit | 11 chars | 4.9s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | prompt_1757759175 | GEMINI | --approval-mode auto_edit | 11 chars | 3.4s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | prompt_671630191 | GEMINI | --approval-mode auto_edit | 11 chars | 5.2s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | diag_prompt | GEMINI | --approval-mode auto_edit | 11 chars | 3s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | prompt | GEMINI | --approval-mode auto_edit | 11 chars | 5.4s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | prompt | GEMINI | --approval-mode auto_edit | 11 chars | 5.7s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | prompt_843763795 | GEMINI | --approval-mode auto_edit | 11 chars | 5.5s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | prompt_1751732108 | GEMINI | --approval-mode auto_edit | 11 chars | 7.6s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | prompt_1708876161 | GEMINI | --approval-mode auto_edit | 11 chars | 7s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | prompt_1276064203 | GEMINI | --approval-mode auto_edit | 11 chars | 6.7s | None (wait forever) | 0 | âœ… |
| 2026-03-21 | prompt_468313468 | GEMINI | --approval-mode auto_edit | 19 chars | 6.8s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | prompt_1326794835 | GEMINI | --approval-mode auto_edit | 12 chars | 75.7s | 1s | 124 | â° |
| 2026-03-21 | prompt_1658499193 | GEMINI | --approval-mode auto_edit | 11 chars | 6.1s | None (wait forever) | 0 | âœ… |
| 2026-03-21 | prompt_1053540413 | GEMINI | --approval-mode auto_edit | 19 chars | 7.8s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | prompt_579988682 | GEMINI | --approval-mode auto_edit | 12 chars | 73.8s | 1s | 124 | â° |
| 2026-03-21 | prompt_1887690057 | GEMINI | --approval-mode auto_edit | 28 chars | 7.5s | None (wait forever) | 0 | âœ… |
| 2026-03-21 | prompt_748372274 | GEMINI | --approval-mode auto_edit | 11 chars | 6.2s | None (wait forever) | 0 | âœ… |
| 2026-03-21 | prompt_2072866364 | GEMINI | --approval-mode auto_edit | 19 chars | 7.5s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | prompt_53782837 | GEMINI | --approval-mode auto_edit | 12 chars | 74.2s | 1s | 124 | â° |
| 2026-03-21 | prompt_46990811 | GEMINI | --approval-mode auto_edit | 28 chars | 6.4s | None (wait forever) | 0 | âœ… |
| 2026-03-21 | prompt_25815089 | GEMINI | --approval-mode auto_edit | 11 chars | 5.7s | None (wait forever) | 0 | âœ… |
| 2026-03-21 | prompt_424241664 | GEMINI | --approval-mode auto_edit | 19 chars | 7.5s | None (wait forever) | 1 | âŒ |
| 2026-03-21 | prompt_994049382 | GEMINI | --approval-mode auto_edit | 12 chars | 77.2s | 1s | 124 | â° |
| 2026-03-21 | prompt_616759083 | GEMINI | --approval-mode auto_edit | 28 chars | 7.4s | None (wait forever) | 0 | âœ… |
| 2026-03-21 | prompt_1077381476 | GEMINI | --approval-mode auto_edit | 11 chars | 6.1s | None (wait forever) | 0 | âœ… |
| 2026-03-21 | prompt_1578504574 | GEMINI | --approval-mode auto_edit | 19 chars | 6.8s | None (wait forever) | 1 | âŒ |
| 2026-03-22 | prompt_1276115482 | GEMINI | --approval-mode auto_edit | 11 chars | 6.6s | None (wait forever) | 0 | âœ… |
| 2026-03-22 | prompt_752601867 | GEMINI | --approval-mode auto_edit | 19 chars | 5.8s | None (wait forever) | 1 | âŒ |
| 2026-03-22 | prompt_1290675968 | GEMINI | --approval-mode auto_edit | 12 chars | 78s | 1s | 124 | â° |
| 2026-03-22 | prompt_691106303 | GEMINI | --approval-mode auto_edit | 28 chars | 6.7s | None (wait forever) | 0 | âœ… |
| 2026-03-22 | prompt_1872960183 | GEMINI | --approval-mode auto_edit | 11 chars | 15.3s | None (wait forever) | 0 | âœ… |
| 2026-03-22 | prompt_543891334 | GEMINI | --approval-mode auto_edit | 19 chars | 9.7s | None (wait forever) | 1 | âŒ |
| 2026-03-22 | prompt_1646886030 | GEMINI | --approval-mode auto_edit | 12 chars | 96.7s | 1s | 124 | â° |
| 2026-03-22 | prompt_426411174 | GEMINI | --approval-mode auto_edit | 28 chars | 12.8s | None (wait forever) | 0 | âœ… |
| 2026-05-05 | inline | GEMINI | --approval-mode yolo | 33 chars | 26s | 30s | 0 | + |
| 2026-05-07 | complete-remaining-files | GEMINI | --approval-mode yolo | 7296 chars | 218s | None (wait forever) | 0 | + |
| 2026-05-07 | events-calendar-review-enhance | GEMINI | --approval-mode yolo | 7131 chars | 616s | None (wait forever) | 0 | + |
| 2026-05-07 | final-review | GEMINI | --approval-mode yolo | 5457 chars | 1385s | None (wait forever) | 0 | + |
| 2026-05-07 | consolidate-finalize | GEMINI | --approval-mode yolo | 6709 chars | 307s | None (wait forever) | 0 | + |
| 2026-05-07 | promotion-review | GEMINI | --approval-mode yolo | 9410 chars | 1851s | None (wait forever) | 0 | + |
| 2026-05-07 | rewrite-promotions | GEMINI | --approval-mode yolo | 6558 chars | 6730s | None (wait forever) | 1 | X |
| 2026-05-07 | rewrite-promotions | GEMINI | --approval-mode yolo | 6518 chars | 1968s | None (wait forever) | 1 | X |
| 2026-05-08 | party-mode-budget-review | GEMINI | --approval-mode yolo | 7018 chars | 2954s | None (wait forever) | 1 | X |
| 2026-05-08 | rolling-table-fix | GEMINI | --approval-mode yolo | 5032 chars | 2011s | None (wait forever) | 0 | + |
| 2026-05-08 | party-mode-rolling-review | GEMINI | --approval-mode yolo | 5434 chars | 937s | None (wait forever) | 0 | + |
| 2026-05-08 | party-mode-promo-handbook | GEMINI | --approval-mode yolo | 9837 chars | 2566s | None (wait forever) | 1 | X |
| 2026-05-08 | adjust-vip-handbook | GEMINI | --approval-mode yolo | 3643 chars | 142s | None (wait forever) | 0 | + |
| 2026-05-08 | review-handbook | GEMINI | --approval-mode yolo | 4988 chars | 547s | None (wait forever) | 0 | + |
| 2026-05-08 | party-review-handbook | GEMINI | --approval-mode yolo | 4127 chars | 705s | None (wait forever) | 0 | + |
| 2026-05-09 | redo-handbook-partymode | GEMINI | --approval-mode yolo | 6704 chars | 1105s | None (wait forever) | 0 | + |
| 2026-05-09 | promo-economics-partymode | GEMINI | --approval-mode yolo | 8031 chars | 469s | None (wait forever) | 0 | + |
| 2026-05-09 | economic-framework-proposal | GEMINI | --approval-mode yolo | 10591 chars | 268s | None (wait forever) | 0 | + |
| 2026-05-09 | economic-framework-proposal-v2 | GEMINI | --approval-mode yolo | 10611 chars | 151s | None (wait forever) | 0 | + |
| 2026-05-09 | review-economic-proposal | GEMINI | --approval-mode yolo | 5713 chars | 428s | None (wait forever) | 0 | + |
| 2026-05-09 | discuss-fix-proposal | GEMINI | --approval-mode yolo | 5951 chars | 983s | None (wait forever) | 0 | + |
| 2026-05-11 | wc-critique-review | GEMINI | --approval-mode yolo | 7613 chars | 69s | 600s | 0 | + |
| 2026-05-11 | wc-critique-review | GEMINI | --approval-mode yolo | 10536 chars | 87s | None (wait forever) | 0 | + |
| 2026-05-11 | wc-rewrite-proposal | GEMINI | --approval-mode yolo | 9370 chars | 110s | None (wait forever) | 0 | + |
| 2026-05-11 | wc-expand-promos | GEMINI | --approval-mode yolo | 7020 chars | 76s | None (wait forever) | 0 | + |
| 2026-05-11 | wc-hub-wireframe-v1 | GEMINI | --approval-mode yolo | 6145 chars | 77s | None (wait forever) | 0 | + |
| 2026-05-11 | wc-hub-wireframe-critique | GEMINI | --approval-mode yolo | 4375 chars | 66s | None (wait forever) | 0 | + |
| 2026-05-11 | wc-hub-ba-feedback | GEMINI | --approval-mode yolo | 4312 chars | 62s | None (wait forever) | 0 | + |
| 2026-05-11 | wc-hub-wireframe-final | GEMINI | --approval-mode yolo | 4480 chars | 72s | None (wait forever) | 0 | + |
| 2026-05-11 | wc-hub-wireframe-v3 | GEMINI | --approval-mode yolo | 8476 chars | 62s | None (wait forever) | 0 | + |
| 2026-05-11 | wc-hub-critique-v3 | GEMINI | --approval-mode yolo | 2328 chars | 57s | None (wait forever) | 0 | + |
| 2026-05-11 | wc-hub-wireframe-fix | GEMINI | --approval-mode yolo | 3510 chars | 191s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-designer-review | GEMINI | --approval-mode yolo | 5705 chars | 73s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-pm-ba-review | GEMINI | --approval-mode yolo | 5606 chars | 68s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-hub-wireframe-v4 | GEMINI | --approval-mode yolo | 4493 chars | 111s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-pm-sketch-review | GEMINI | --approval-mode yolo | 6746 chars | 96s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-pm-designer-v5 | GEMINI | --approval-mode yolo | 4070 chars | 70s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-team-review-r2 | GEMINI | --approval-mode yolo | 4378 chars | 79s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-prediction-game-design | GEMINI | --approval-mode yolo | 7933 chars | 95s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-prediction-critique | GEMINI | --approval-mode yolo | 5552 chars | 60s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-prediction-fix | GEMINI | --approval-mode yolo | 4089 chars | 58s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-prediction-v3-review-fix | GEMINI | --approval-mode yolo | 7999 chars | 104s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-prediction-v3-verdict | GEMINI | --approval-mode yolo | 3829 chars | 72s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-prediction-final | GEMINI | --approval-mode yolo | 6740 chars | 107s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-reward-redemption | GEMINI | --approval-mode yolo | 5973 chars | 97s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-currency-correction | GEMINI | --approval-mode yolo | 7208 chars | 73s | None (wait forever) | 0 | + |
| 2026-05-12 | wc-prediction-definitive | GEMINI | --approval-mode yolo | 7681 chars | 87s | None (wait forever) | 0 | + |
| 2026-05-13 | wc-prediction-comprehensive | GEMINI | --approval-mode yolo | 10501 chars | 117s | None (wait forever) | 0 | + |
| 2026-05-13 | wc-prediction-deep-review | GEMINI | --approval-mode yolo | 8119 chars | 236s | None (wait forever) | 0 | + |
| 2026-05-13 | wc-prediction-quality-gate | GEMINI | --approval-mode yolo | 4942 chars | 476s | None (wait forever) | 0 | + |
| 2026-05-16 | wc-promo-redesign | GEMINI | --approval-mode yolo | 6875 chars | 86s | None (wait forever) | 0 | + |
| 2026-05-16 | wc-promo-redesign | GEMINI | --approval-mode yolo | 6910 chars | 104s | None (wait forever) | 0 | + |
| 2026-05-17 | wc-promo-biz-review | GEMINI | --approval-mode yolo | 6789 chars | 380s | None (wait forever) | 0 | + |
| 2026-05-17 | wc-promo-crossvert-review | GEMINI | --approval-mode yolo | 7132 chars | 91s | None (wait forever) | 0 | + |
| 2026-05-17 | wc-promo-quality-gate | GEMINI | --approval-mode yolo | 5611 chars | 72s | None (wait forever) | 0 | + |
| 2026-05-17 | wc-promo-final-deep | GEMINI | --approval-mode yolo | 6254 chars | 295s | None (wait forever) | 0 | + |
| 2026-05-17 | wc-promo-stage-fomo | GEMINI | --approval-mode yolo | 7902 chars | 102s | None (wait forever) | 0 | + |
| 2026-05-17 | wc-promo-split-restore | GEMINI | --approval-mode yolo | 5761 chars | 600s | None (wait forever) | 0 | + |
| 2026-05-20 | homepage-v6-revamp | GEMINI | --approval-mode auto_edit | 7638 chars | 246s | 600s | 0 | + |
| 2026-05-20 | visual-polishing | GEMINI | --approval-mode auto_edit | 4250 chars | 99s | 600s | 0 | + |
| 2026-05-20 | visual-polishing | GEMINI | --approval-mode auto_edit | 4231 chars | 57s | 600s | 0 | + |
| 2026-05-20 | visual-polishing | GEMINI | --approval-mode auto_edit | 5225 chars | 289s | 600s | 0 | + |
| 2026-05-20 | visual-polishing | GEMINI | --approval-mode auto_edit | 8121 chars | 599s | 600s | 0 | + |
| 2026-05-20 | visual-polishing | GEMINI | --approval-mode auto_edit | 11245 chars | 235s | 600s | 0 | + |
| 2026-05-20 | visual-polishing | GEMINI | --approval-mode auto_edit | 5165 chars | 244s | 600s | 0 | + |
| 2026-05-20 | visual-polishing | GEMINI | --approval-mode auto_edit | 7515 chars | 129s | 600s | 0 | + |
| 2026-05-21 | visual-polishing | GEMINI | --approval-mode auto_edit | 7509 chars | 106s | 600s | 0 | + |
| 2026-05-21 | visual-polishing | GEMINI | --approval-mode auto_edit | 4307 chars | 163s | 600s | 0 | + |
| 2026-05-21 | redesign-winners-ticker | GEMINI | --approval-mode auto_edit | 6380 chars | 231s | 300s | 0 | + |
| 2026-05-26 | docs-uiux-constitution | GEMINI | --approval-mode auto_edit | 9284 chars | 69s | 300s | 0 | + |
| 2026-05-26 | docs-arch-changelog-guardrails | GEMINI | --approval-mode auto_edit | 8905 chars | 77s | 300s | 0 | + |
| 2026-05-26 | fix-uiux-doc-alignment | GEMINI | --approval-mode auto_edit | 7114 chars | 82s | 300s | 0 | + |
| 2026-05-28 | implement-profile-page | GEMINI | --approval-mode auto_edit | 10782 chars | 137s | 600s | 0 | + |
| 2026-05-28 | implement-vip-club-page | GEMINI | --approval-mode auto_edit | 10107 chars | 221s | 600s | 0 | + |
| 2026-05-28 | task1-navigation-homepage | GEMINI | --approval-mode auto_edit | 8366 chars | 176s | 600s | 0 | + |
| 2026-05-28 | task3-wallet-page | GEMINI | --approval-mode auto_edit | 16629 chars | 196s | 600s | 0 | + |
| 2026-05-28 | task4-game-lobby | GEMINI | --approval-mode auto_edit | 13338 chars | 200s | 600s | 0 | + |
| 2026-05-28 | task2-account-redesign | GEMINI | --approval-mode auto_edit | 7057 chars | 269s | 600s | 0 | + |
| 2026-05-28 | full-rebuild-core-layout | GEMINI | --approval-mode auto_edit | 27429 chars | 152s | 600s | 0 | + |
| 2026-05-28 | premium-visual-polish | GEMINI | --approval-mode auto_edit | 7073 chars | 594s | 600s | 0 | + |
| 2026-06-01 | inline | GEMINI | --approval-mode yolo | 63 chars | 23s | 90s | 0 | + |
| 2026-06-01 | inline | GEMINI | --approval-mode yolo | 41 chars | 28s | 60s | 0 | + |
| 2026-06-01 | inline | GEMINI | --approval-mode yolo | 30 chars | 23s | 60s | 0 | + |
| 2026-06-02 | inline | GEMINI | --approval-mode yolo | 37 chars | 25s | 60s | 0 | + |
| 2026-06-03 | inline | GEMINI | --approval-mode yolo | 756 chars | 66s | 150s | 0 | + |
