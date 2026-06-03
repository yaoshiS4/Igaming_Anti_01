# Guardrail Hit-Rate Log

> Updated when any anti-pattern guardrail from `anti-patterns.md` §1-§11 fires. Used for quarterly effectiveness review per §12.

| Date | Guardrail | Section | Task Context | Outcome |
|------|-----------|---------|--------------|---------|
| 2026-05-20 | Dark text on dark background | anti-patterns (contrast) | Wolves sponsor banner subtitle used black text on dark bg | Changed to text-text-1 with drop-shadow for readability |
| 2026-05-20 | Meaningless UI statistics | anti-patterns (UX noise) | WinnersTicker showed fake "2,341 DANG CHOI" player count and redundant jackpot stat | Removed both — focused ticker on actual winner data only |
| 2026-05-21 | Absolute positioning overlap | anti-patterns (layout) | WinnersTicker: absolute-positioned label overlapped scrolling text at responsive widths | Redesigned as flexbox siblings — label and marquee are separate containers |
| 2026-05-21 | Misused "Live" label | anti-patterns (semantic) | "Live" badge on Recent Winners section implied livestream content | Removed "Live" label; section renamed to "TIN CHIEN THANG" (Winning News) |
| 2026-05-22 | overflow-x breaking sticky | anti-patterns (CSS) | `overflow-x: hidden` on html/body and App container prevented header/tabs from sticking | Removed overflow-x from html/body and App; contained overflow within decorative sub-containers only |
| 2026-05-22 | Missing card padding | anti-patterns (spacing) | Card content touching border edges with no breathing room | Added consistent p-3/p-4 padding inside all card containers |
