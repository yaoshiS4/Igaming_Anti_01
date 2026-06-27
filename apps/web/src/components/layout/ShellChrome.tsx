/* ============================================================================
 * ShellChrome — the client chrome island (SPEC-03 B1). Holds the interactive
 * shell state and wires the cross-cutting seams:
 *   - Header (two-tier desktop / slim mobile)        — B2/B5
 *   - CategorySheet (mobile category access, UT-3)   — B10/D3
 *   - BottomTabBar (mobile 5 tabs, UT-1)             — B8/D1
 *   - AuthModal + the FTD auth→deposit handoff (UT-2) — D2
 *
 * Server-fetched truthful data (verticals, balance) arrives as props from the
 * AppShell server component (SC-by-default; §F). This island owns ONLY the
 * open/close state for the CategorySheet and the deposit-handoff replay — the
 * auth open/intent state lives in the AuthModalProvider context.
 *
 * FTD handoff (D2): AuthModal calls onResumeDeposit after a successful register
 * carrying a deposit intent → here we route to /vi-tien (the wallet's deposit
 * tab; the DepositSheet is owned by the deposit agent; until it mounts as a
 * sheet, the wallet route IS the first-deposit surface). A member NẠP tap
 * routes there directly.
 * ==========================================================================*/

"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { Envelope, LiveMoney, Vertical } from "@/lib/types";
import { Header } from "./Header";
import { BottomTabBar } from "./BottomTabBar";
import { CategorySheet } from "./CategorySheet";
import { AuthModal } from "../auth/AuthModal";
import styles from "./ShellChrome.module.css";

export interface ShellChromeProps {
  verticals: Vertical[];
  balance: Envelope<LiveMoney>;
  /** the page content column. */
  children: ReactNode;
  /** desktop right rail (server-rendered, ≥1240 only). */
  rightRail?: ReactNode;
  /** Footer slot — rendered below the content frame, full-bleed. */
  footer?: ReactNode;
}

export function ShellChrome({
  verticals,
  balance,
  children,
  rightRail,
  footer,
}: ShellChromeProps) {
  const router = useRouter();
  const [catOpen, setCatOpen] = useState(false);

  const openCategories = () => setCatOpen(true);
  // Deposit intent → the wallet (deposit tab). /vi-tien IS the deposit surface
  // until the DepositSheet mounts; /nap-tien does not exist (would 404).
  const goDeposit = () => router.push("/vi-tien");

  return (
    <>
      <Header
        verticals={verticals}
        balance={balance}
        onOpenCategories={openCategories}
      />

      <div className={styles.frame}>
        <main className={styles.content}>{children}</main>
        {rightRail}
      </div>

      {footer}

      {/* mobile category access — persistent, ≤1-tap from anywhere (UT-3) */}
      <CategorySheet
        open={catOpen}
        onClose={() => setCatOpen(false)}
        verticals={verticals}
      />

      {/* mobile bottom nav (UT-1) */}
      <BottomTabBar onDeposit={goDeposit} onHomeTap={openCategories} />

      {/* the single auth surface + FTD handoff (UT-2). Lazy: not in DOM until
       *  openAuthModal is called. */}
      <AuthModal
        onResumeDeposit={() => {
          // resume-intent replay → present the first-deposit surface.
          goDeposit();
        }}
      />
    </>
  );
}
