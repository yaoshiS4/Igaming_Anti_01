/* ============================================================================
 * BankAccounts + CryptoAddresses — the member-menu money surfaces (J9 钱包设置
 * "wallet settings"). Both are anchored sections in the member account area so
 * the rail's "Ngân hàng" / "Ví tiền ảo" tiles scroll to them.
 *
 *   BankAccounts   — Liên kết thẻ ngân hàng: each linked card shows bank, masked
 *                    number (masked at source), holder, and a Mặc định badge.
 *   CryptoAddresses— Địa chỉ ví: each address shows asset · network · masked
 *                    address + Mặc định badge.
 *
 * Truthful-only (§F): values are typed fixtures already masked at source; an
 * empty list renders an honest empty-state (never a fabricated card). Add/remove
 * are UI-only affordances (no BE) — "Thêm" surfaces an honest no-BE notice.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import { vi } from "@/lib/i18n";
import type { BankCard, CryptoAddress } from "@/lib/types";
import { Badge, Button, Card, Icon } from "@/ui";
import styles from "./LinkedAccounts.module.css";

function NoBackendNotice() {
  return (
    <p className={styles.notice} role="status">
      Đây là bản giao diện mẫu — chưa kết nối hệ thống.
    </p>
  );
}

export function BankAccounts({ cards }: { cards: BankCard[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <section className={styles.wrap} id="ngan-hang" aria-label={vi.account.bankTitle}>
      <Card variant="default" className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <Icon name="card" size={20} className={styles.titleIcon} />
            <div className={styles.titleText}>
              <h2 className={styles.title}>{vi.account.bankTitle}</h2>
              <p className={styles.subtitle}>{vi.account.bankSubtitle}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" icon="check" onClick={() => setAdding(true)}>
            {vi.account.bankAdd}
          </Button>
        </header>

        {cards.length === 0 ? (
          <p className={styles.empty}>{vi.account.bankEmpty}</p>
        ) : (
          <ul className={styles.list}>
            {cards.map((c) => (
              <li key={c.id} className={styles.item}>
                <span className={styles.itemIcon} aria-hidden="true">
                  <Icon name="card" size={22} />
                </span>
                <div className={styles.itemMain}>
                  <div className={styles.itemTop}>
                    <span className={styles.itemName}>{c.bankName}</span>
                    {c.isDefault && (
                      <Badge tone="gold" variant="subtle">
                        {vi.account.default}
                      </Badge>
                    )}
                  </div>
                  <span className={styles.itemNum}>{c.maskedNumber}</span>
                  <span className={styles.itemSub}>
                    {vi.account.bankHolder}: {c.holderName}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {adding && <NoBackendNotice />}
      </Card>
    </section>
  );
}

export function CryptoAddresses({ addresses }: { addresses: CryptoAddress[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <section className={styles.wrap} id="vi-tien-ao" aria-label={vi.account.cryptoTitle}>
      <Card variant="default" className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <Icon name="chip" size={20} className={styles.titleIcon} />
            <div className={styles.titleText}>
              <h2 className={styles.title}>{vi.account.cryptoTitle}</h2>
              <p className={styles.subtitle}>{vi.account.cryptoSubtitle}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" icon="check" onClick={() => setAdding(true)}>
            {vi.account.cryptoAdd}
          </Button>
        </header>

        {addresses.length === 0 ? (
          <p className={styles.empty}>{vi.account.cryptoEmpty}</p>
        ) : (
          <ul className={styles.list}>
            {addresses.map((a) => (
              <li key={a.id} className={styles.item}>
                <span className={styles.itemIcon} aria-hidden="true">
                  <Icon name="chip" size={22} />
                </span>
                <div className={styles.itemMain}>
                  <div className={styles.itemTop}>
                    <span className={styles.itemName}>
                      {a.asset} · {a.network}
                    </span>
                    {a.isDefault && (
                      <Badge tone="gold" variant="subtle">
                        {vi.account.default}
                      </Badge>
                    )}
                  </div>
                  <span className={styles.itemNum}>{a.maskedAddress}</span>
                  <span className={styles.itemSub}>
                    {vi.account.cryptoNetwork}: {a.network}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {adding && <NoBackendNotice />}
      </Card>
    </section>
  );
}
