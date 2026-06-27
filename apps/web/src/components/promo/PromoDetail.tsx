/* ============================================================================
 * PromoDetail — single-promo detail surface (SPEC-03 §promo; Wave 7.3). A
 * client island so the "Tham gia" CTA is auth-aware: a guest tap opens the
 * auth modal (the FTD seam entry via useRequireAuth.promptAuth), a member
 * proceeds. Image is a token-derived SLOT; the Countdown is real-server-bound
 * (HALTS at deadline, never loops). NO hardcoded bonus % — only truthful copy.
 * ==========================================================================*/

"use client";

import Link from "next/link";
import type { Promo } from "@/lib/types";
import { vi } from "@/lib/i18n";
import { useRequireAuth } from "@/lib/auth";
import { Card, Badge, Countdown, Button, Icon } from "@/ui";
import styles from "./PromoDetail.module.css";

export interface PromoDetailProps {
  promo: Promo;
}

export function PromoDetail({ promo }: PromoDetailProps) {
  const { allowed, promptAuth } = useRequireAuth();

  const onJoin = () => {
    if (!allowed) {
      // guest → surface the auth modal (resume-intent: none — promo opt-in)
      promptAuth();
      return;
    }
    // member: UI-only/mock — a real opt-in call would fire here.
  };

  return (
    <article className={styles.detail}>
      <Link href="/khuyen-mai" className={styles.back}>
        <Icon name="chevronLeft" size={18} /> {vi.nav.promo}
      </Link>

      <Card variant="promo" className={styles.hero}>
        {/* PLACEHOLDER SLOT — token-derived gradient, awaiting licensed art */}
        <span className={styles.media} aria-hidden="true" />
        <div className={styles.head}>
          <Badge tone="gold">{promo.category}</Badge>
          <h1 className={styles.title}>{promo.title}</h1>
          {promo.endsAt ? (
            <div className={styles.timer}>
              <span className={styles.timerLabel}>Kết thúc sau</span>
              <Countdown endsAt={promo.endsAt} zeroLabel={vi.state.ended} />
            </div>
          ) : (
            <span className={styles.evergreen}>Đang diễn ra</span>
          )}
        </div>
      </Card>

      <section className={styles.section} aria-label="Nội dung khuyến mãi">
        <h2 className={styles.sectionTitle}>Thông tin chương trình</h2>
        <p className={styles.body}>
          Tham gia chương trình {promo.title.toLowerCase()} của Yaobet. Điều kiện,
          mức thưởng và thời gian áp dụng được công bố minh bạch theo điều khoản
          chương trình. Vui lòng đọc kỹ trước khi tham gia.
        </p>
      </section>

      <section className={styles.section} aria-label="Điều khoản">
        <h2 className={styles.sectionTitle}>Điều khoản & điều kiện</h2>
        <ul className={styles.terms}>
          <li>Chỉ áp dụng cho thành viên đủ 18 tuổi trở lên.</li>
          <li>Mỗi thành viên được tham gia theo quy định của chương trình.</li>
          <li>Yêu cầu vòng cược áp dụng theo điều khoản công bố.</li>
          <li>Yaobet có quyền điều chỉnh hoặc kết thúc chương trình theo quy định.</li>
        </ul>
      </section>

      <div className={styles.cta}>
        <Button variant="gold" size="lg" fullWidth onClick={onJoin}>
          {allowed ? "Tham gia ngay" : `${vi.auth.login} để tham gia`}
        </Button>
      </div>
    </article>
  );
}
