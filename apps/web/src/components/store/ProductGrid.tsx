/* ============================================================================
 * ProductGrid — points-redemption catalog (SPEC-03 §store ProductGrid; Wave
 * 7.1). A client island: it owns the redeem-dialog state and the auth gate. A
 * product card = image SLOT + name + points price + redeemed-count + optional
 * REAL Countdown (limited offers). Desktop 4-up → @375 2-up. Tapping "Đổi" on a
 * card opens the lazy RedeemDialog for a member, or the auth modal for a guest.
 * States: populated · empty(honest). NO fabricated stock/figures.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import { Card, Tile, Badge, Countdown, Button, EmptyState } from "@/ui";
import { RedeemDialog } from "./RedeemDialog";
import styles from "./ProductGrid.module.css";

export interface ProductGridProps {
  products: Product[];
  /** member's redeemable points — gates affordability (truthful) */
  points: number;
}

export function ProductGrid({ products, points }: ProductGridProps) {
  const { allowed, promptAuth } = useRequireAuth();
  const [selected, setSelected] = useState<Product | null>(null);

  const onRedeem = (p: Product) => {
    if (!allowed) {
      promptAuth();
      return;
    }
    setSelected(p);
  };

  if (products.length === 0) {
    return (
      <EmptyState
        icon="gift"
        title="Cửa hàng trống"
        message="Hiện chưa có sản phẩm nào để đổi điểm."
      />
    );
  }

  return (
    <>
      <ul className={styles.grid}>
        {products.map((p) => {
          const affordable = allowed && points >= p.pointsPrice;
          return (
            <li key={p.id} className={styles.cell}>
              <Card variant="product" className={styles.card}>
                <Tile
                  label={p.name}
                  imageSrc={p.imageSrc}
                  aspect="1 / 1"
                  badge={p.endsAt ? <Badge tone="gold">Có hạn</Badge> : undefined}
                />
                <div className={styles.meta}>
                  <span className={styles.name}>{p.name}</span>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>
                      {p.pointsPrice.toLocaleString("vi-VN")}
                      <span className={styles.unit}> điểm</span>
                    </span>
                    <span className={styles.redeemed}>
                      Đã đổi {p.redeemedCount.toLocaleString("vi-VN")}
                    </span>
                  </div>
                  {p.endsAt && (
                    <div className={styles.timer}>
                      <span className={styles.timerLabel}>Còn</span>
                      <Countdown endsAt={p.endsAt} zeroLabel={vi.state.ended} />
                    </div>
                  )}
                  <Button
                    variant={affordable ? "gold" : "ghost"}
                    size="sm"
                    fullWidth
                    onClick={() => onRedeem(p)}
                  >
                    {!allowed
                      ? "Đăng nhập để đổi"
                      : affordable
                        ? "Đổi điểm"
                        : "Chưa đủ điểm"}
                  </Button>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>

      {/* lazy-mounted: only present when a product is selected */}
      {selected && (
        <RedeemDialog
          product={selected}
          points={points}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
