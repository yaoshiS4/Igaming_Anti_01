/* ============================================================================
 * StoreTerms — the "Điều khoản & điều kiện" accordion on the points store.
 * A small client island: a titled panel (§ sigil + subtitle + last-updated) over
 * a list of expand/collapse Q&A items, closed with a short program note. Content
 * is fixed Vietnamese copy (owner-approved); tokens only, matches the gold-on-dark
 * store surface. One item open at a time.
 * ==========================================================================*/

"use client";

import { useState } from "react";
import { Icon } from "@/ui";
import styles from "./StoreTerms.module.css";

/** Owner-approved T&C copy (Vietnamese). Order matches the store screenshot. */
const ITEMS: { q: string; a: string }[] = [
  {
    q: "Làm sao để có điểm thưởng?",
    a: "Bạn nhận điểm thưởng từ các hoạt động trên Yaobet như thăng cấp, thưởng tuần và thưởng tháng. Điểm sẽ được cộng tự động vào tài khoản để bạn đổi quà.",
  },
  {
    q: "Đổi quà như thế nào?",
    a: "Chọn phần quà bạn muốn và nhấn Xác nhận đổi, quà sẽ được ghi nhận ngay. Lưu ý: điểm đã đổi sẽ không được hoàn lại, bạn hãy kiểm tra kỹ trước khi xác nhận nhé.",
  },
  {
    q: "Thời gian chờ là gì?",
    a: "Mỗi vật phẩm đều có một khoảng thời gian chờ nhất định tùy theo giá trị. Sau khi bạn đổi, thời gian chờ sẽ bắt đầu tính. Chỉ cần đợi hết khoảng thời gian này, số điểm cần để đổi sẽ trở về mức thấp nhất.",
  },
  {
    q: "Đổi sớm là gì?",
    a: "Khi vật phẩm đang trong thời gian chờ, bạn vẫn có thể bỏ qua bằng cách đổi sớm. Tuy nhiên, đổi sớm sẽ cần mức quy đổi cao hơn bình thường, và càng đổi sớm liên tiếp, mức quy đổi sẽ càng tăng. Số điểm cụ thể luôn hiển thị trên nút đổi để bạn cân nhắc trước khi quyết định.",
  },
  {
    q: "Tại sao lại hết lượt đổi?",
    a: "Mỗi vật phẩm có số lần quy đổi nhất định cho mỗi tài khoản. Khi đã đổi hết số lần tối đa, bạn chỉ cần đợi thời gian chờ trở về 0 là có thể đổi tiếp.",
  },
];

export function StoreTerms() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.terms} aria-label="Điều khoản & điều kiện">
      <header className={styles.header}>
        <span className={styles.sigil} aria-hidden="true">
          §
        </span>
        <div className={styles.headText}>
          <h2 className={styles.title}>Điều khoản &amp; điều kiện</h2>
          <p className={styles.subtitle}>
            Quy định về việc tích lũy và sử dụng điểm thưởng
          </p>
        </div>
        <span className={styles.updated}>Cập nhật lần cuối · —</span>
      </header>

      <ul className={styles.list}>
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          const panelId = `terms-panel-${i}`;
          return (
            <li key={item.q} className={styles.item} data-open={isOpen}>
              <button
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className={styles.num} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.q}>{item.q}</span>
                <Icon
                  name="chevronDown"
                  size={18}
                  className={styles.chevron}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <p id={panelId} className={styles.answer}>
                  {item.a}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <p className={styles.note}>
        <Icon name="info" size={16} className={styles.noteIcon} aria-hidden="true" />
        <span>
          Chương trình có thể thay đổi hoặc kết thúc mà không cần báo trước; quyết
          định cuối cùng thuộc về ban quản trị. Nếu cần hỗ trợ, vui lòng liên hệ bộ
          phận chăm sóc khách hàng.
        </span>
      </p>
    </section>
  );
}
