/* ============================================================================
 * Yaobet — ROOT layout (SPEC-04 PART 2 / Wave 3.1)
 * ----------------------------------------------------------------------------
 * <html lang="vi" data-brand="yaobet" data-theme="obsidian"> — Vietnamese-first,
 * default Yaobet brand, OLED-dark. Imports the single global token sheet and
 * wraps the tree in <Providers> (MockAuth + AuthModal).
 *
 * <AppShell> (two-tier Header + CategoryRail/Sheet + BottomTabBar + AuthModal,
 * with Footer/SupportWidget slots owned by their agents) composes BELOW
 * <Providers> so the whole tree sits under one client-context root while the
 * shell itself stays a Server Component that fetches its truthful data (§F).
 * ==========================================================================*/

import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/* CINZEL REMOVED. It was the display face for /vip headings and tier names,
 * and it served `latin` + `latin-ext` only — no `vietnamese` subset — so
 * U+1EA0–1EF1 fell out of the face mid-word. Measured on the running app:
 * `Đồng` lost `ồ`; `Bạc` and `Bạch Kim` lost `ạ`. That is the identical defect
 * that got Outfit rejected under ruling A4, so it could not be shipped.
 *
 * --brand-font-display now points at --font-head (Montserrat), which is both
 * Vietnamese-complete AND the geometric sans the Flat system specifies for
 * display — Cinzel was an inscriptional serif and off-system either way.
 * Dropping the loader removes a webfont that had no remaining consumer. */

/* ---- The two Vietnamese-complete app faces (PM ruling A4) ----------------
 * Both declare subsets: ["latin", "vietnamese"], so Google serves the
 * U+1EA0–1EF9 @font-face slice and every toned vowel (Ộ ổ ậ ư ợ …) resolves
 * INSIDE the face — no mid-word fallback anywhere in the product. Outfit is
 * rejected outright: it ships latin/latin-ext only and skips U+1EA0–1EF1.
 * Consumed through tokens.css → --font-body / --font-head → --brand-font-*. */

/* Body + tabular numerals. Named as the brand body face since SPEC-02 §4;
 * this is the first time it is actually LOADED rather than named and left to
 * fall through to system-ui (which varies per platform). */
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

/* Display / headings / uppercase labels. The design system asks for "a
 * geometric sans-serif that mirrors the shapes of the UI" — that is an intent
 * about form, and Montserrat satisfies it while actually rendering the
 * language. 700/800 only; the tracking treatment lives in typography.css. */
const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});
import { AppShell, Footer } from "@/components/layout";
import { QuickActionRail } from "@/components/layout/QuickActionRail";

export const metadata: Metadata = {
  title: "Yaobet",
  description: "Yaobet — nhà cái trực tuyến.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // mobile-first @375 base; obsidian canvas for the browser chrome (--canvas).
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      data-brand="yaobet"
      data-theme="obsidian"
      className={`${beVietnamPro.variable} ${montserrat.variable}`}
    >
      <body>
        <Providers>
          <AppShell footer={<Footer />}>{children}</AppShell>
          <QuickActionRail />
        </Providers>
      </body>
    </html>
  );
}
