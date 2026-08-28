/* ============================================================================
 * App-wide Flat Design compliance sweep.
 * ----------------------------------------------------------------------------
 * Answers one question across EVERY route: did the design system actually land,
 * or only where someone was looking?
 *
 * Every check is POSITIVE and measured. "No shadows found" is also what a page
 * that failed to render says, so each route must first prove it rendered.
 *
 * THE OVERFLOW CHECK IS NOT THE SCROLL CHECK. An element can be 623px wide
 * inside a 390px viewport and cause NO document h-scroll, because an ancestor
 * clips it — and its right-hand contents are then simply unreachable. Two
 * engineers reported opposite results on the header for exactly this reason.
 * Both were right about what they measured; only one was measuring reachability.
 * ==========================================================================*/
import { chromium } from "playwright";

const ROUTES = [
  "/", "/vip", "/tier", "/khuyen-mai", "/hoan-tra", "/cua-hang", "/cau-lac-bo",
  "/lich-su", "/bao-mat", "/ho-tro", "/tro-giup", "/phong-cach", "/tai-app",
  "/cuoc-hop-le", "/game-han-che", "/bo-suu-tap", "/bo-suu-tap/cua-toi",
  "/tai-khoan", "/vi-tien", "/tin-nhan", "/dai-ly", "/gioi-thieu",
];

/* U+1EA0–1EF1 — the toned Vietnamese vowels. The block Outfit and Cinzel skip.
   A face that cannot set these cannot set this product's copy. */
const VN = "ạảấầẫậắằẵặẹẻếềểễệịọỏốồổộớờởợụủứừửữựỳỵỷ";

const fails = [];
let pass = 0;
const ok = (route, label, cond, detail = "") => {
  if (cond) pass++; else fails.push({ route, label, detail });
};

const browser = await chromium.launch();

async function sweep(width) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));

  console.log(`\n${"═".repeat(78)}\n  ${width}px\n${"═".repeat(78)}`);
  console.log("route                    shadow  btnGrad  vnBreak  overflow  burst  hScroll");
  console.log("─".repeat(78));

  for (const route of ROUTES) {
    try {
      const res = await page.goto("http://localhost:3000" + route,
        { waitUntil: "networkidle", timeout: 35000 });
      await page.waitForTimeout(1200);
      const rendered = (res?.status() ?? 0) < 400 &&
        (await page.evaluate(() => document.body.innerText.trim().length)) > 60;
      ok(route, `renders @${width}`, rendered, `HTTP ${res?.status()}`);
      if (!rendered) { console.log(`${route.padEnd(24)} DID NOT RENDER`); continue; }
    } catch {
      ok(route, `renders @${width}`, false, "navigation timeout");
      console.log(`${route.padEnd(24)} TIMEOUT`);
      continue;
    }

    const s = await page.evaluate(async (vn) => {
      /* FONTS MUST BE READY BEFORE ANY check(). `document.fonts.check()` returns
         TRUE when no matching face is registered yet — so probing too early is a
         silent FALSE PASS, not an error. This sweep reported 0 Vietnamese breaks
         on /vip while Cinzel was demonstrably breaking two tier names, purely
         because it asked 600ms in. Never trust check() before fonts.ready. */
      await document.fonts.ready;
      const registered = new Set([...document.fonts].map((f) => f.family));
      const shadows = [], grads = [], vnBreaks = [], overflow = [], bursts = [];
      const vw = document.documentElement.clientWidth;

      for (const el of document.querySelectorAll("*")) {
        const cs = getComputedStyle(el);
        // Depth only. grayscale/brightness/saturate are colour transforms and
        // are legitimate flat devices — the ban is on the Z-axis, not filters.
        if ((cs.boxShadow && cs.boxShadow !== "none") ||
            /drop-shadow/.test(cs.filter || "") ||
            (cs.backdropFilter && cs.backdropFilter !== "none")) {
          shadows.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 26)}`);
        }
        // Reachability, not scrollability.
        /* Wider than the viewport is only a defect if the content is
           UNREACHABLE. A wide table or tab strip inside an `overflow-x: auto`
           scroller is the intended pattern, and a full-bleed decorative SVG is
           clipped on purpose. Walk up for a scrollable ancestor first. */
        const r = el.getBoundingClientRect();
        if (r.width > vw + 1 && r.width > 0 && cs.display !== "none") {
          let scrollable = false;
          for (let a = el.parentElement; a; a = a.parentElement) {
            const ox = getComputedStyle(a).overflowX;
            if (ox === "auto" || ox === "scroll") { scrollable = true; break; }
          }
          if (!scrollable && !(el instanceof SVGElement)) {
            overflow.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 22)}=${Math.round(r.width)}px`);
          }
        }

        /* CONTENT vs ITS OWN CONTAINER — not vs the viewport.
           A 14-digit jackpot burst a 304px rail card inside a 1240px window:
           no viewport overflow, no h-scroll, and this sweep called the route
           clean.

           The signal is the CONTAINER'S OWN scrollWidth, not a child's width
           against the parent's content box. That first formulation produced
           five false positives — flex children legitimately measure wider than
           a parent's computed content box, and every one of them rendered
           correctly inside its card. A parent whose scrollWidth exceeds its
           clientWidth is genuinely holding content it cannot show. */
        // 8px threshold: sub-pixel rounding and 1-2px text-metric slop are not
        // defects, and reporting them buries the ones that are.
        if (cs.overflowX === "visible" && cs.overflowY === "visible" &&
            el.scrollWidth > el.clientWidth + 8 && el.clientWidth > 8) {
          bursts.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 20)} ${el.scrollWidth}>${el.clientWidth}`);
        }
      }

      for (const el of document.querySelectorAll("button, a[role=button]")) {
        if (/gradient/.test(getComputedStyle(el).backgroundImage)) {
          grads.push((el.textContent || "").trim().slice(0, 18) || el.getAttribute("aria-label") || "?");
        }
      }

      /* Generalised font check — by UNICODE-RANGE, not by fonts.check().
         `document.fonts.check(font, text)` answers "must I load anything to draw
         this?", NOT "can this family draw this?". A codepoint outside every
         matching face's unicode-range needs no load, so check() returns TRUE.
         Two earlier versions of this sweep reported 0 breaks on /vip while
         Cinzel was demonstrably failing on "Đồng" and "Bạc". Read the ranges. */
      const covers = (family, cp) => {
        let sawFace = false;
        for (const f of document.fonts) {
          if (f.family !== family) continue;
          sawFace = true;
          for (const part of (f.unicodeRange || "U+0-10FFFF").split(",")) {
            const m = part.trim().match(/^U\+([0-9A-Fa-f?]+)(?:-([0-9A-Fa-f]+))?$/);
            if (!m) continue;
            const lo = parseInt(m[1].replace(/\?/g, "0"), 16);
            const hi = m[2] ? parseInt(m[2], 16)
                            : parseInt(m[1].replace(/\?/g, "F"), 16);
            if (cp >= lo && cp <= hi) return true;
          }
        }
        // No webfont face for this family at all → it is a system/stack name,
        // which we cannot interrogate. Not a finding.
        return !sawFace;
      };

      const re = new RegExp(`[${vn}]`);
      for (const el of document.querySelectorAll("h1,h2,h3,h4,button,a,span,p,li,td,th,label,div")) {
        const own = [...el.childNodes].filter((n) => n.nodeType === 3)
          .map((n) => n.textContent).join("");
        if (!re.test(own)) continue;
        const first = getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim();
        if (!first) continue;
        const missing = [...new Set(own.match(new RegExp(`[${vn}]`, "g")) || [])]
          .filter((ch) => !covers(first, ch.codePointAt(0)));
        if (missing.length) {
          vnBreaks.push(`${first} ✗ ${missing.join("")} in "${own.trim().slice(0, 26)}"`);
        }
      }

      return {
        shadows: [...new Set(shadows)], grads: [...new Set(grads)],
        vnBreaks: [...new Set(vnBreaks)], overflow: [...new Set(overflow)],
        bursts: [...new Set(bursts)],
        sw: document.documentElement.scrollWidth, cw: vw,
      };
    }, VN);

    ok(route, `zero depth @${width}`, s.shadows.length === 0, s.shadows.slice(0, 4).join(" · "));
    ok(route, `no button gradient @${width}`, s.grads.length === 0, s.grads.slice(0, 4).join(" · "));
    ok(route, `Vietnamese sets in one face @${width}`, s.vnBreaks.length === 0, s.vnBreaks.slice(0, 3).join(" · "));
    ok(route, `no element wider than viewport @${width}`, s.overflow.length === 0, s.overflow.slice(0, 3).join(" · "));
    ok(route, `no h-scroll @${width}`, s.sw <= s.cw, `${s.sw}/${s.cw}`);
    ok(route, `nothing bursts its container @${width}`, s.bursts.length === 0, s.bursts.slice(0, 4).join(" · "));

    const n = (a) => (a.length === 0 ? "·" : String(a.length));
    console.log(
      `${route.padEnd(24)} ${n(s.shadows).padEnd(7)} ${n(s.grads).padEnd(8)} ` +
      `${n(s.vnBreaks).padEnd(8)} ${n(s.overflow).padEnd(9)} ${n(s.bursts).padEnd(6)} ${s.sw <= s.cw ? "·" : "YES"}`);
  }

  if (errs.length) {
    console.log(`\n  page errors @${width}: ${[...new Set(errs)].slice(0, 5).join(" | ")}`);
  }
  await ctx.close();
}

await sweep(390);
await sweep(1440);

console.log("\n" + "═".repeat(78));
if (fails.length) {
  console.log(`\n${fails.length} FAILURES\n`);
  const byLabel = {};
  for (const f of fails) (byLabel[f.label] ??= []).push(f);
  for (const [label, list] of Object.entries(byLabel)) {
    console.log(`  ${label}  (${list.length})`);
    for (const f of list.slice(0, 8)) console.log(`      ${f.route}  ${f.detail}`);
  }
}
console.log(`\n=== ${pass} passed, ${fails.length} failed · ${ROUTES.length} routes × 2 widths ===`);
await browser.close();
process.exit(fails.length ? 1 : 0);
