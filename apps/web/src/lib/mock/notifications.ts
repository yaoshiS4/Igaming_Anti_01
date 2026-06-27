/* ============================================================================
 * Yaobet mock — notifications / Thông báo (header bell, SPEC-03 header).
 * ----------------------------------------------------------------------------
 * The bell's dropdown source. Six truthful fixtures across the four kinds
 * (khuyến mãi · nạp tiền · sự kiện · hệ thống). Read/unread state is part of the
 * fixture so the badge count + "đã đọc" affordances are data-bound, never faked.
 * No fabricated money figures: the "nạp thành công" row states the fact, not a
 * massaged amount. UI-only / mock; the real-API migration replaces the body.
 * ==========================================================================*/

import type { Notification } from "../types";
import { DEMO_EMPTY, isoAgo, simulateFetch } from "./helpers";

/* Lucky-6 fixture count; 3 unread → an honest badge that reads "3". */
const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    kind: "promo",
    title: "Khuyến mãi mới: Hoàn trả tăng cuối tuần",
    detail: "Ưu đãi hoàn trả tăng thêm cho 2 ngày cuối tuần. Xem chi tiết.",
    read: false,
    at: isoAgo(18),
    href: "/khuyen-mai",
  },
  {
    id: "n2",
    kind: "deposit",
    title: "Nạp tiền thành công",
    detail: "Yêu cầu nạp tiền của bạn đã được ghi nhận và cộng vào ví.",
    read: false,
    at: isoAgo(96),
    href: "/vi-tien",
  },
  {
    id: "n3",
    kind: "event",
    title: "Sự kiện: Vòng quay may mắn đã mở",
    detail: "Tham gia sự kiện trong tuần để nhận thêm điểm thưởng.",
    read: false,
    at: isoAgo(360),
    href: "/khuyen-mai",
  },
  {
    id: "n4",
    kind: "system",
    title: "Thông báo hệ thống: Bảo trì định kỳ",
    detail: "Hệ thống bảo trì ngắn vào rạng sáng. Một số mục có thể gián đoạn.",
    read: true,
    at: isoAgo(1_680),
  },
  {
    id: "n5",
    kind: "promo",
    title: "Ưu đãi nạp lần đầu",
    detail: "Hoàn tất nạp lần đầu để nhận ưu đãi chào mừng dành riêng cho bạn.",
    read: true,
    at: isoAgo(2_880),
    href: "/khuyen-mai",
  },
  {
    id: "n6",
    kind: "system",
    title: "Cập nhật điều khoản dịch vụ",
    detail: "Chúng tôi đã cập nhật điều khoản. Vui lòng xem để nắm thay đổi.",
    read: true,
    at: isoAgo(8_640),
  },
];

export async function getNotifications(): Promise<Notification[]> {
  return simulateFetch(DEMO_EMPTY ? [] : NOTIFICATIONS);
}
