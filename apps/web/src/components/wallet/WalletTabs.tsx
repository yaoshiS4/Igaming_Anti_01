/* ============================================================================
 * WalletTabs — the /vi-tien client orchestrator (SPEC-03 §wallet / D1).
 * DEFECT-8 FIX: the wallet is no longer one all-in-one scroll. The balance
 * header stays pinned at the top; below it a J9 card-style tab strip switches
 * between FOUR focused, single-purpose panels — ONE feature per view:
 *
 *   Nạp tiền   → DepositPanel       (VN rails: Ngân hàng/Momo/ViettelPay/Thẻ cào)
 *   Rút tiền   → WithdrawPanel       (bank target + amount + fund-password gate)
 *   Lịch sử    → WalletHistory       (equal win/loss DeltaAmount rows + filters)
 *   Chuyển quỹ → FundTransferPanel   (from/to product + amount + honest pending)
 *
 * This card-style strip is the SINGLE control for switching wallet views — the
 * balance header no longer carries its own chips, and the member sidebar's
 * Nạp / Rút are plain `/vi-tien#deposit|#withdraw` deep-links that this strip
 * honours (initial tab + live `hashchange`) instead of adding more buttons. One
 * clear path per action. The strip mirrors J9's `el-tabs--card` look — a
 * gold-active, card-bg tab row — built from our tokens.
 *
 * Owns NO data — only the in-page tab state. All figures are server fixtures
 * handed down as typed props (Decree-174 truthful-only).
 * ==========================================================================*/

"use client";

import { useEffect, useState } from "react";
import type {
  DepositOffer,
  Envelope,
  LiveMoney,
  MoneyValue as MoneyVal,
  ProductWallet,
  Transaction,
} from "@/lib/types";
import { vi } from "@/lib/i18n";
import { Icon, type IconName } from "@/ui";
import { WalletBalanceHeader } from "./WalletBalanceHeader";
import { DepositPanel } from "./DepositPanel";
import { WithdrawPanel } from "./WithdrawPanel";
import { WalletHistory } from "./WalletHistory";
import { FundTransferPanel } from "./FundTransferPanel";
import styles from "./WalletTabs.module.css";

export interface WalletTabsProps {
  balance: Envelope<LiveMoney>;
  available: MoneyVal | null;
  products: ProductWallet[];
  records: Transaction[];
  bankMemo: { account: string; bank: string; memo: string };
  offer: DepositOffer | null;
  isFirstDeposit: boolean;
  withdrawDestination: { bank: string; account: string } | null;
}

type WalletTab = "deposit" | "withdraw" | "history" | "transfer";

const TABS: { id: WalletTab; label: string; icon: IconName }[] = [
  { id: "deposit", label: vi.deposit.title, icon: "deposit" },
  { id: "withdraw", label: "Rút tiền", icon: "wallet" },
  { id: "history", label: vi.wallet.history, icon: "history" },
  { id: "transfer", label: vi.wallet.transfer, icon: "chip" },
];

/** map a `/vi-tien#…` hash to a tab (sidebar deep-links), else null. */
function tabFromHash(hash: string): WalletTab | null {
  const id = hash.replace(/^#/, "");
  return TABS.some((t) => t.id === id) ? (id as WalletTab) : null;
}

export function WalletTabs({
  balance,
  available,
  products,
  records,
  bankMemo,
  offer,
  isFirstDeposit,
  withdrawDestination,
}: WalletTabsProps) {
  const [tab, setTab] = useState<WalletTab>("deposit");

  /* sidebar Nạp / Rút are `/vi-tien#deposit|#withdraw` deep-links — adopt the
   * arriving hash and follow later in-page hash changes (when already on the
   * page) so those global shortcuts switch this strip, not add more buttons. */
  useEffect(() => {
    const sync = () => {
      const next = tabFromHash(window.location.hash);
      if (next) setTab(next);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <div className={styles.surface}>
      <WalletBalanceHeader balance={balance} />

      {/* J9 el-tabs--card style strip — gold-active, one focused feature each */}
      <div className={styles.strip} role="tablist" aria-label="Mục ví tiền">
        {TABS.map((t) => {
          const selected = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`wallet-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`wallet-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              className={[styles.tab, selected ? styles.active : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setTab(t.id)}
            >
              <Icon name={t.icon} size={18} />
              <span className={styles.tabLabel}>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div
        className={styles.panel}
        role="tabpanel"
        id={`wallet-panel-${tab}`}
        aria-labelledby={`wallet-tab-${tab}`}
      >
        {tab === "deposit" && (
          <DepositPanel bankMemo={bankMemo} offer={offer} isFirstDeposit={isFirstDeposit} />
        )}
        {tab === "withdraw" && (
          <WithdrawPanel available={available} destination={withdrawDestination} />
        )}
        {tab === "history" && <WalletHistory records={records} limit={50} />}
        {tab === "transfer" && (
          <FundTransferPanel available={available} products={products} />
        )}
      </div>
    </div>
  );
}
