/* ============================================================================
 * RedeemDialog — lazy redeem-confirm dialog (SPEC-03 §store RedeemDialog; Wave
 * 7.1). Composes the ONE reusable Modal (lazy-mounted: this component is only
 * rendered when a product is selected, so the modal is never a pre-rendered
 * farm). States: idle · submitting(single-flight) · success · failed. UI-only/
 * mock — the "confirm" simulates a server round-trip then shows an honest,
 * equal-salience result (no win-juice celebration on success).
 * ==========================================================================*/

"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { Modal, Button, Icon } from "@/ui";
import styles from "./RedeemDialog.module.css";

export interface RedeemDialogProps {
  product: Product;
  points: number;
  onClose: () => void;
}

type RedeemState = "idle" | "submitting" | "success" | "failed";

export function RedeemDialog({ product, points, onClose }: RedeemDialogProps) {
  const [state, setState] = useState<RedeemState>("idle");
  const remaining = points - product.pointsPrice;

  const confirm = () => {
    if (state === "submitting") return; // single-flight
    setState("submitting");
    // UI-only/mock: simulate a server-confirmed redemption.
    window.setTimeout(() => {
      setState(remaining >= 0 ? "success" : "failed");
    }, 600);
  };

  return (
    <Modal open onClose={onClose} title="Xác nhận đổi quà" size="sm">
      {state === "success" ? (
        <div className={styles.result}>
          <span className={styles.iconOk} aria-hidden="true">
            <Icon name="check" size={28} />
          </span>
          <p className={styles.resultTitle}>Đổi quà thành công</p>
          <p className={styles.resultBody}>
            Bạn đã đổi {product.name}. Điểm còn lại:{" "}
            <strong>{remaining.toLocaleString("vi-VN")} điểm</strong>.
          </p>
          <Button variant="primary" fullWidth onClick={onClose}>
            Đóng
          </Button>
        </div>
      ) : state === "failed" ? (
        <div className={styles.result}>
          <span className={styles.iconErr} aria-hidden="true">
            <Icon name="warning" size={28} />
          </span>
          <p className={styles.resultTitle}>Đổi quà không thành công</p>
          <p className={styles.resultBody}>
            Số điểm của bạn chưa đủ để đổi sản phẩm này.
          </p>
          <Button variant="ghost" fullWidth onClick={onClose}>
            Đóng
          </Button>
        </div>
      ) : (
        <div className={styles.confirm}>
          <p className={styles.product}>{product.name}</p>
          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt>Giá đổi</dt>
              <dd>{product.pointsPrice.toLocaleString("vi-VN")} điểm</dd>
            </div>
            <div className={styles.row}>
              <dt>Điểm hiện có</dt>
              <dd>{points.toLocaleString("vi-VN")} điểm</dd>
            </div>
            <div className={styles.row}>
              <dt>Điểm còn lại</dt>
              <dd data-low={remaining < 0 ? "true" : undefined}>
                {remaining.toLocaleString("vi-VN")} điểm
              </dd>
            </div>
          </dl>
          <div className={styles.actions}>
            <Button variant="ghost" onClick={onClose}>
              Hủy
            </Button>
            <Button
              variant="gold"
              loading={state === "submitting"}
              disabled={remaining < 0}
              onClick={confirm}
            >
              Xác nhận đổi
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
