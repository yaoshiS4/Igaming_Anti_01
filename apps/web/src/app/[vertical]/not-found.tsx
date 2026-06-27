/* ============================================================================
 * Yaobet — [vertical] 404 (App Router not-found boundary). Triggered when the
 * route Server Component calls notFound() for an unknown slug. Renders INSIDE
 * the root layout, so the shared shell (Header + CategoryRail/Sheet +
 * BottomTabBar) is already mounted — this is only the content column.
 *
 * Honest, plain-VN copy + a route back to Home (where the category launcher
 * lists every real vertical). No fabricated "did you mean" suggestions.
 * ==========================================================================*/

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/ui";
import styles from "./Route.module.css";

export default function VerticalNotFound() {
  const router = useRouter();

  return (
    <div className={styles.notFound}>
      <span className={styles.code} aria-hidden="true">
        404
      </span>
      <h1 className={styles.heading}>Không tìm thấy hạng mục</h1>
      <p className={styles.body}>
        Hạng mục bạn tìm không tồn tại hoặc đã được di chuyển. Hãy quay lại trang
        chủ để chọn một hạng mục khác.
      </p>
      <div className={styles.actions}>
        <Button variant="gold" icon="home" onClick={() => router.push("/")}>
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}
