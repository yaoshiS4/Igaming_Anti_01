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
import { Cinzel } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/* Luxury display serif for the /vip rebuild (headings / tier names / hero
 * numerals). Exposed as the CSS var --font-cinzel and consumed via the
 * --brand-font-display token (tokens.css), which carries a Georgia/serif
 * fallback so runtime degrades gracefully if the font can't load.
 * NOTE: next/font/google fetches at BUILD time — this reintroduces a network
 * dependency to fonts.googleapis.com and WILL break a truly-offline build.
 * Self-hosting via next/font/local is the fallback plan if CI must be offline. */
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-cinzel",
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
  // mobile-first @375 base; dark UI surface for the browser chrome.
  themeColor: "#171a21",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      data-brand="yaobet"
      data-theme="obsidian"
      className={cinzel.variable}
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
