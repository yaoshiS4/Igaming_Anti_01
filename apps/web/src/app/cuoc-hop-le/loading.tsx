/* ============================================================================
 * /cuoc-hop-le — route-level loading UI (BACKLOG ST-13, prototype §4.7 · S-07).
 * Next shows this instantly on a route transition. It reuses the page shell +
 * the real (static, instant) PageIntro and reserves the table footprint with
 * RateTableSkeleton so there is no layout shift when the data lands. No spinner
 * exists anywhere in this feature — skeletons only.
 * ==========================================================================*/

import { PageIntro, RateTableSkeleton } from "@/components/contribution";
import styles from "./cuoc-hop-le.module.css";

export default function Loading() {
  return (
    <div className={styles.page}>
      <PageIntro />
      <RateTableSkeleton />
    </div>
  );
}
