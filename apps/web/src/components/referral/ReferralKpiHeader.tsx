/* ============================================================================
 * ReferralKpiHeader — affiliate KPI header (SPEC-03 §referral ReferralKpiHeader;
 * Wave 7.2) [RG]. Renders today's referred turnover + current commission as
 * REAL-OR-OMITTED figures, driven by the §F Envelope contract:
 *   loading → Skeleton (reserved footprint, no layout shift, never a "0")
 *   error   → ErrorState + retry (router.refresh re-issues the server fetch)
 *   absent  → the strip is OMITTED (no fabricated social-proof)
 *   live    → MoneyValue, equal-salience, never massaged
 * A client island so the error retry can re-issue the server fetch.
 * ==========================================================================*/

"use client";

import { useRouter } from "next/navigation";
import type { Envelope, ReferralKpi } from "@/lib/types";
import { Card, MoneyValue, Skeleton, ErrorState } from "@/ui";
import styles from "./ReferralKpiHeader.module.css";

export interface ReferralKpiHeaderProps {
  kpi: Envelope<ReferralKpi>;
}

export function ReferralKpiHeader({ kpi }: ReferralKpiHeaderProps) {
  const router = useRouter();

  // absent → omit the strip entirely (truthful posture, never fabricated)
  if (kpi.status === "absent") return null;

  if (kpi.status === "error") {
    return (
      <Card variant="default" className={styles.card}>
        <ErrorState
          title="Không tải được số liệu giới thiệu"
          onRetry={() => router.refresh()}
        />
      </Card>
    );
  }

  if (kpi.status === "loading") {
    return (
      <Card variant="default" className={styles.card}>
        <div className={styles.row}>
          <div className={styles.stat}>
            <span className={styles.label}>Doanh thu giới thiệu hôm nay</span>
            <Skeleton width="9ch" height="1.6em" />
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Hoa hồng hiện tại</span>
            <Skeleton width="7ch" height="1.6em" />
          </div>
        </div>
      </Card>
    );
  }

  // live — real figures only
  return (
    <Card variant="default" className={styles.card}>
      <div className={styles.row}>
        <div className={styles.stat}>
          <span className={styles.label}>Doanh thu giới thiệu hôm nay</span>
          <MoneyValue
            value={kpi.value.todayTurnover}
            kind="balance"
            size="num-lg"
            className={styles.value}
          />
        </div>
        <div className={styles.divider} aria-hidden="true" />
        <div className={styles.stat}>
          <span className={styles.label}>Hoa hồng hiện tại</span>
          <MoneyValue
            value={kpi.value.currentCommission}
            kind="balance"
            size="num-lg"
            className={styles.value}
          />
        </div>
      </div>
    </Card>
  );
}
