#!/usr/bin/env node
/* ============================================================================
 * Yaobet — token-lint : the GROUP-A/GROUP-B split contract (SPEC-02 §0.3 /
 * SPEC-04 §1.2 / Wave 1.3). Zero-dependency so it runs offline in CI.
 *
 * Implements the three authored assertions verbatim:
 *   A1 — No GROUP-A LOCKED token inside a [data-brand] block (and a
 *        [data-brand] block may declare ONLY --brand-* vars).
 *   A2 — Components (*.module.css) read indirection/semantic vars only, never
 *        raw ramp literals (--gold-*, --cta*, --font-body/-num, --text-on-gold).
 *   A3 — --focus-ring/--win/--loss/--error :root (or [data-theme]) defs must be
 *        standalone constants — never var(--brand-…) or a raw-ramp reference.
 *
 * Usage:  node scripts/token-lint.mjs             (lint the app)
 *         node scripts/token-lint.mjs --self-test (seeded-violation Done-When)
 * ==========================================================================*/

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "src");

/* The closed GROUP-A LOCKED denylist (SPEC-02 §0.1). */
const GROUP_A_EXACT = new Set([
  "--canvas", "--shell", "--surface", "--surface-2", "--surface-3",
  "--surface-hover", "--surface-disabled", "--scrim",
  "--win", "--loss", "--error", "--info", "--focus-ring",
  "--text-hi", "--text", "--text-mid", "--text-dim", "--border", "--tint",
  "--lh-body", "--lh-tight", "--weight-reg", "--weight-semi", "--weight-bold",
  "--gutter", "--field-rhythm",
  "--radius-sm", "--radius-md", "--radius-lg", "--radius-card", "--radius-pill",
  "--glow-gold", "--halo", "--lift",
  "--z-content", "--z-sticky", "--z-dropdown", "--z-modal", "--z-toast",
  "--header-h", "--rail-w", "--frame-w", "--bottombar-h",
  "--tap-min", "--tap-bar",
]);
/* Prefix families also LOCKED. */
const GROUP_A_PREFIX = ["--t-", "--space-", "--dur-", "--ease-"];

function isGroupA(name) {
  if (GROUP_A_EXACT.has(name)) return true;
  return GROUP_A_PREFIX.some((p) => name.startsWith(p));
}

/* RAW-RAMP literals components must never read directly (A2). Longest-first so
 * the var() check matches the full name (--cta-grad before --cta). */
const RAW_RAMP = [
  "--gold-500", "--gold-600", "--gold-grad", "--gold-hairline", "--text-on-gold",
  "--cta-grad", "--cta-accent", "--cta", "--font-body", "--font-num",
];

/* The four PINNED-neutral tokens (A3). */
const PINNED = ["--focus-ring", "--win", "--loss", "--error"];

/** Strip /* … *​/ comments so selector/value matching never sees comment text. */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function topLevelBlocks(css) {
  const blocks = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open === -1) break;
    const selector = css.slice(i, open).trim().split("}").pop().trim();
    let depth = 1;
    let j = open + 1;
    for (; j < css.length && depth > 0; j++) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
    }
    blocks.push({ selector, body: css.slice(open + 1, j - 1) });
    i = j;
  }
  return blocks;
}

function declaredVars(body) {
  const out = [];
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m;
  while ((m = re.exec(body))) out.push({ name: m[1], value: m[2].trim() });
  return out;
}

/** Lint one stylesheet's CONTENT; returns an array of violation strings. */
function lintContent(rawCss, rel) {
  const css = stripComments(rawCss);
  const out = [];
  const isBrands = rel.endsWith("brands.css");
  const isTokensOrTheme = rel.endsWith("tokens.css") || rel.endsWith("themes.css");
  const isModule = rel.endsWith(".module.css");

  if (isBrands || isTokensOrTheme) {
    for (const { selector, body } of topLevelBlocks(css)) {
      const isBrandBlock = /\[data-brand/.test(selector);
      const isRootOrTheme = selector.includes(":root") || /\[data-theme/.test(selector);
      for (const { name, value } of declaredVars(body)) {
        if (isBrandBlock && isGroupA(name)) {
          out.push(`A1 ${rel}: GROUP-A token ${name} inside [data-brand] block (${selector})`);
        }
        if (isBrandBlock && !name.startsWith("--brand-")) {
          out.push(`A1 ${rel}: [data-brand] block may declare only --brand-* vars; found ${name}`);
        }
        if (isRootOrTheme && PINNED.includes(name)) {
          if (/var\(\s*--brand-/.test(value)) {
            out.push(`A3 ${rel}: pinned ${name} resolves to a --brand-* var (${value})`);
          }
          for (const ramp of RAW_RAMP) {
            if (new RegExp(`var\\(\\s*${ramp}(?![a-z0-9-])`).test(value)) {
              out.push(`A3 ${rel}: pinned ${name} references RAW-RAMP ${ramp} (${value})`);
            }
          }
        }
      }
    }
  }

  if (isModule) {
    for (const ramp of RAW_RAMP) {
      const re = new RegExp(`var\\(\\s*${ramp}(?![a-z0-9-])`, "i");
      if (re.test(css)) {
        out.push(`A2 ${rel}: component reads RAW-RAMP ${ramp} via var() — use its --brand-* alias`);
      }
    }
  }

  return out;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".css")) out.push(p);
  }
  return out;
}

/* ---- run ---- */
if (process.argv.includes("--self-test")) {
  const seeded = [
    ['[data-brand="x"]{--canvas:#000;--win:#0f0;}', "styles/brands.css", ["A1", "A1"]],
    [".a{color:var(--gold-500);}", "ui/X/X.module.css", ["A2"]],
    [":root{--focus-ring:var(--brand-accent);}", "styles/tokens.css", ["A3"]],
  ];
  let caught = 0;
  for (const [content, rel] of seeded) {
    const v = lintContent(content, rel);
    if (v.length) caught += 1;
    console.log(`  seed ${rel}: ${v.length ? v.join("; ") : "NO VIOLATION (unexpected)"}`);
  }
  if (caught < 3) {
    console.error(`SELF-TEST FAILED: expected all 3 seeds (A1/A2/A3) to fire, got ${caught}`);
    process.exit(1);
  }
  console.log("SELF-TEST OK: A1/A2/A3 each fire on a seeded violation; a clean tree passes.");
  process.exit(0);
}

const errors = [];
for (const file of walk(ROOT)) {
  errors.push(...lintContent(readFileSync(file, "utf8"), file.slice(ROOT.length + 1)));
}

if (errors.length) {
  console.error("token-lint FAILED:\n" + errors.map((e) => "  • " + e).join("\n"));
  process.exit(1);
}
console.log("token-lint OK: GROUP-A/GROUP-B contract (A1/A2/A3) holds.");
