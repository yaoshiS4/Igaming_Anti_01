/* ============================================================================
 * Yaobet — lib/i18n (SPEC-04 §1.3) — single source of plain-VN labels.
 * Vietnamese-first, single-locale v1 (no locale segment). No component holds a
 * hardcoded VN string; they read from this catalog.
 * ==========================================================================*/

export const vi = {
  brand: "Yaobet",

  nav: {
    home: "Trang chủ",
    promo: "Khuyến mãi",
    deposit: "Nạp",
    wallet: "Ví",
    account: "Tài khoản",
    categories: "Danh mục",
  },

  auth: {
    register: "Đăng ký",
    login: "Đăng nhập",
    logout: "Đăng xuất",
    registerSuccess: "Đăng ký thành công",
    /* forgot-password flow (reset by email OR phone — no OTP, mock send). */
    forgot: "Quên mật khẩu?",
    forgotTitle: "Đặt lại mật khẩu",
    forgotPrompt:
      "Nhập email hoặc số điện thoại đã đăng ký để nhận liên kết đặt lại mật khẩu.",
    forgotSubmit: "Gửi liên kết",
    forgotSuccess: "Đã gửi hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra email hoặc tin nhắn.",
    backToLogin: "Quay lại đăng nhập",
    /** login identifier accepts phone OR username (icon swaps to match). */
    loginIdentifier: "Số điện thoại / Tên đăng nhập",
    resetIdentifier: "Email / Số điện thoại",
    /* NOTE: the "Mật khẩu / Mã đăng nhập" tab labels were removed with the OTP
     *       tab switcher (defect 3) — the modal is password-only. */
    /** brand-panel tagline + trust bullets (password-only modal, no OTP). */
    brandTag: "Nạp nhanh · Rút nhanh · Hoàn trả mỗi ngày",
    trust: {
      payout: "Rút tiền trong vài phút",
      cashback: "Hoàn trả mỗi ngày, không giới hạn",
      secure: "Bảo mật chuẩn ngân hàng",
      support: "Hỗ trợ 24/7",
    },
  },

  wallet: {
    title: "Ví tiền",
    balance: "Số dư",
    deposit: "Nạp",
    withdraw: "Rút",
    history: "Lịch sử",
    transfer: "Chuyển quỹ",
    zeroBalance: "Số dư: 0 ₫",
  },

  member: {
    cashback: "Hoàn trả",
    history: "Lịch sử",
    messages: "Tin nhắn",
    referral: "Giới thiệu",
    security: "Bảo mật",
    agentClub: "Đại lý/CLB",
    support: "Hỗ trợ",
    vip: "VIP",
    nextTier: "Hạng tiếp theo",
    profile: "Hồ sơ",
    bank: "Ngân hàng",
    crypto: "Ví tiền ảo",
    promo: "Khuyến mãi",
    wallet: "Ví của tôi",
    /* 12-tile hub grid — J9-tile labels mapped to our real routes. */
    yield: "Sinh lời",
    sellCoin: "Bán xu",
    universalUpgrade: "Thăng hạng toàn dân",
    tutorial: "Hướng dẫn",
    honor: "Vinh danh",
  },

  account: {
    points: "Điểm",
    rebate: "Hoàn trả",
    /* ---- member-hub hero + action cards + progress bar (rebuild) ---------- */
    newMember: "Thành viên mới",
    getBadge: "Nhận huy hiệu",
    activated: "Đã kích hoạt",
    notActivated: "Chưa kích hoạt",
    pointsStore: "Cửa hàng điểm",
    taskCenter: "Trung tâm nhiệm vụ",
    myPoints: "Điểm của tôi",
    waitingUnlock: "Chờ mở khóa",
    progressPrefix: "Nạp tích lũy",
    progressSuffix: "để lên thẻ",
    progressUpdating: "Đang cập nhật",
    securityCenter: "Trung tâm an toàn",
    securityScore: "Điểm an toàn",
    securityScoreLow: "Thấp",
    securityScoreMedium: "Trung bình",
    securityScoreHigh: "Cao",
    tabVerify: "Thông tin xác minh",
    tabOther: "Khác",
    basicInfo: "Thông tin cơ bản",
    realName: "Họ tên thật",
    phone: "Số điện thoại",
    email: "Địa chỉ Email",
    fundPassword: "Mật khẩu rút tiền",
    dynamicCode: "Mã xác thực động",
    setupNow: "Thiết lập ngay",
    edit: "Chỉnh sửa",
    statusVerified: "Đã xác minh",
    statusPending: "Đang chờ",
    statusUnset: "Chưa thiết lập",
    changeLoginPassword: "Đổi mật khẩu đăng nhập",
    oldPassword: "Mật khẩu cũ",
    newPassword: "Mật khẩu mới",
    confirmPassword: "Xác nhận mật khẩu mới",
    save: "Lưu thay đổi",
    /* ---- section titles + subtitles (one section per member-menu item) ---- */
    profileTitle: "Hồ sơ cá nhân",
    profileSubtitle: "Thông tin cơ bản của tài khoản",
    bankSubtitle: "Liên kết thẻ ngân hàng để nạp và rút tiền",
    cryptoSubtitle: "Quản lý địa chỉ ví tiền điện tử để rút",
    avatar: "Ảnh đại diện",
    avatarChange: "Đổi ảnh đại diện",
    displayName: "Tên hiển thị",
    memberId: "Mã thành viên",
    /* ---- security section (đổi MK đăng nhập · MK rút tiền · 2FA) ---- */
    securitySubtitle: "Bảo vệ tài khoản bằng mật khẩu mạnh và xác thực động",
    loginPasswordSub: "Dùng để đăng nhập vào tài khoản",
    fundPasswordTitle: "Mật khẩu rút tiền",
    fundPasswordSub: "Yêu cầu khi rút tiền và đổi thông tin nhạy cảm",
    dynamicCodeTitle: "Mã xác thực động (2FA)",
    dynamicCodeSub: "Xác thực hai lớp bằng ứng dụng tạo mã",
    confirmFundPassword: "Xác nhận mật khẩu rút tiền",
    enable: "Bật",
    change: "Thay đổi",
    showPassword: "Hiện mật khẩu",
    hidePassword: "Ẩn mật khẩu",
    uiOnlyNotice: "Đây là bản giao diện mẫu — chưa kết nối hệ thống.",
    bankTitle: "Liên kết thẻ ngân hàng",
    bankAdd: "Thêm thẻ ngân hàng",
    bankEmpty: "Chưa liên kết thẻ ngân hàng",
    bankHolder: "Chủ thẻ",
    cryptoTitle: "Địa chỉ ví",
    cryptoAdd: "Thêm địa chỉ ví",
    cryptoEmpty: "Chưa thêm địa chỉ ví",
    cryptoNetwork: "Mạng",
    default: "Mặc định",
    setDefault: "Đặt mặc định",
    remove: "Gỡ liên kết",
  },

  state: {
    loading: "Đang tải…",
    empty: "Chưa có dữ liệu",
    noResults: "Không có kết quả",
    error: "Đã xảy ra lỗi",
    retry: "Thử lại",
    reset: "Đặt lại",
    stale: "Tạm dừng",
    ended: "Đã kết thúc",
    live: "TRỰC TIẾP",
  },

  /* Points store — card-face gates & micro-copy (plan §3; NEW store.* keys).
   * ITEM analog of the PRD points→cash mechanic: never imply reduced value —
   * only the POINT cost rises for an early redeem; the item/face is unchanged. */
  store: {
    title: "Cửa hàng điểm",
    /** points-required corner badge unit — rendered as `${n} điểm` (COUNT, never ₫). */
    pointsUnit: "điểm",
    /** filter tabs above the grid (client-side, filter by product.category). */
    tabAll: "Tất cả",
    tabVoucher: "Voucher tiền",
    tabProduct: "Sản phẩm",
    /** top-left card tag by family. */
    categoryVoucher: "Voucher tiền",
    categoryProduct: "Sản phẩm",
    /** withdrawal condition (info only): `{n}` = rolling multiplier to wager before withdrawing.
     *  VOUCHER cards only — physical products hide this line. */
    rollingLine: "Rút sau {n} vòng cược",
    /** GLOBAL redemption tally (social proof) — `{n}` = total redeems across all users. */
    redeemedCount: "Đã đổi {n} lượt",
    /** breaker reopen-time value for the paused dialog `{when}` slot (mock). */
    pausedReopen: "ít phút nữa",
    /** RUNNING-cooldown label — precedes the live countdown ("wait FOR full rate"). */
    fullRateAfter: "Thời gian chờ",
    /** cooldown ZERO-state label — only shown once the timer hits zero. */
    fullRateReady: "Có thể đổi ngay",
    /* terse card-face CTAs (verbose both-numbers button lives in the dialog). */
    ctaRedeem: "Đổi ngay",
    /** disabled CTA when cost > balance; `{short}` = formatCount(basePoints − balance). */
    ctaInsufficient: "Thiếu {short} điểm",
    ctaSoldOut: "Tạm hết hàng",
    /** single top-left tag on a sold-out card (ONE sold-out signal set). */
    soldOutTag: "Tạm hết",
    ctaLoginToRedeem: "Đăng nhập để đổi",
    /* TEMPORARY limit-lock (at_floor) card state — distinct from permanent Hết hàng.
     * The member hit the escalation cap; a clean wait returns them to base/100%. */
    ctaLimitReached: "Hết lượt đổi", // disabled CTA at the redemption cap; the cooldown chip stays visible
    /* dialog EARLY-state label for the passive-alternative countdown (frames the
     * timer as the ALTERNATIVE to claiming now, not a promise on this claim). */
    waitForBaseLabel: "Chờ hết giờ để về mức thường",
  },

  /* Claim dialog — VERBATIM from PRD §7.3.1. Compliance-critical: no string may
   * imply reduced value for an early claim (only more points, same item/face);
   * the escalated button shows BOTH points and face; every escalated/at-cap/
   * unlimited/insufficient state carries a "Chờ để được full rate" action. */
  claim: {
    fullRate:
      "Điểm cần dùng {points} · Bạn nhận {cash} · Tỷ lệ 100% ✓ · Thời gian chờ đã đặt lại hoàn toàn.",
    earlyEscalated:
      "⚠️ Bạn đang đổi sớm — trả nhiều điểm hơn cho cùng số tiền. Điểm {points} · Bạn nhận {cash} (không đổi) · Tỷ lệ {pct}% (bước {k}) · Thời gian chờ bắt đầu lại từ đầu.",
    atFloor:
      "⚠️ Tỷ lệ thấp nhất cho gói này — bạn đang trả nhiều điểm nhất cho số tiền này và sẽ không tăng thêm. Điểm {points} · Bạn nhận {cash} (không đổi). Đổi tiếp giữ nguyên mức này và đặt lại thời gian chờ. Chờ hết chu kỳ chờ để về {base_points} điểm.",
    unlimitedDeep:
      "⚠️ Gói này không giới hạn số lần đổi. Mỗi lần đổi sớm tốn nhiều điểm hơn cho cùng {cash} — không có mức sàn. Điểm hiện tại {points} · Bạn đã dùng {cycle_points} điểm trong chu kỳ này. Chờ hết thời gian để đặt lại về {base_points} điểm.",
    insufficient:
      "Bạn không đủ điểm cho lần đổi sớm (tăng cấp) này — nó tốn nhiều điểm hơn. Chờ về full rate để tốn ít điểm hơn ({base_points}).",
    paused:
      "Đổi thưởng tạm dừng và sẽ mở lại sau {when}. Tỷ lệ và thời gian chờ của bạn không thay đổi — vị trí của bạn giữ nguyên trong lúc tạm dừng.",
    resetConfirm:
      "Đã khôi phục full rate ✓ — bạn đã trả {points} điểm cho {cash}.",
    committedEscalated:
      "Đã đổi ✓ — {points} điểm → {cash}. Chờ hết thời gian chờ để lần sau được full rate (ít điểm hơn).",
    /* Buttons, controls (PRD §7.3.1). */
    btnFullRate: "Đổi {cash}",
    btnEscalated: "Đổi ngay ({points} điểm → {cash})",
    btnWait: "Chờ để được full rate",
    btnCancel: "Hủy",
    btnConfirm: "Xác nhận đổi",
    /* gold confirm label in the EARLY dialog (immediate-claim choice vs the wait). */
    btnEarlyConfirm: "Đổi ngay",
    /* ---- dialog copy (extracted from hardcoded JSX + the case-2 disclosure fix) ---- */
    /** modal title (base + early). */
    dialogTitle: "Xác nhận đổi quà",
    /** header muted label before the gold face-value amount. */
    valueLabel: "Trị giá",
    /** hero cost label in the dialog (same base + early). */
    costLabel: "Điểm cần dùng",
    /** small unit beside the hero numeral (styled independently of store.pointsUnit). */
    costUnit: "điểm",
    /** CASE-2 line A — costs-more only (line B owns the reset fact; no overlap). */
    earlyWarn: "Bạn đang đổi sớm nên cần nhiều điểm hơn mức thường.",
    /** CASE-2 line B — the explicit cooldown-RESET fact (the disclosure gap fix). */
    earlyResetWarn: "Đổi bây giờ sẽ đặt lại thời gian chờ về từ đầu.",
    /** honest base-cost comparison under the escalated hero numeral; `{points}` = `N điểm`. */
    /** quiet subline under the hero cost in the BASE dialog only. */
    baseSubline: "Mức thường · Tỷ lệ 100%",
    /* cost-card breakdown rows (under a divider). */
    rowBalanceNow: "Số dư hiện tại",
    rowBalanceAfter: "Sau khi đổi",
    rowRolling: "Điều kiện rút",
    /** rolling row value — `{n}` = rolling multiplier (voucher only). */
    rollingValue: "{n} vòng cược",
    /** amber caution callout in the EARLY dialog — names BOTH point figures + reset.
     *  `{time}` = live countdown to the running cooldown. */
    earlyCallout:
      "Thời gian chờ còn {time}. Nếu đổi ngay, bạn sẽ cần dùng nhiều điểm hơn và thời gian chờ bị đặt lại từ đầu.",
    /** neutral hint under the (red) hero cost when unaffordable (replaces blue banner). */
    insufficientHint: "Chờ về mức thường để cần ít điểm hơn.",
    /* success receipt (extracted from hardcoded JSX). */
    successTitle: "Đổi quà thành công",
    /** success subline — `{name}` = the redeemed product name (bold in JSX). */
    successSub: "{name} đã được thêm vào ví quà của bạn.",
    successPointsRow: "Điểm đã dùng",
    /** remaining-balance pill label after a successful redeem (number = balance − charged). */
    successBalanceLeft: "Số dư còn lại",
    btnClose: "Xong",
  },

  cashback: {
    title: "Hoàn trả",
    claimable: "Có thể nhận",
    accrued: "Đã tích lũy",
    claim: "Nhận hoàn trả",
    claimed: "Đã nhận hoàn trả",
    none: "Chưa có hoàn trả",
  },

  rg: {
    columnTitle: "Chơi game có trách nhiệm",
    ageLimit: "Chỉ dành cho người từ 18 tuổi trở lên",
    selfExclusion: "Tự loại trừ",
    hotline: "Đường dây nóng hỗ trợ",
    limits: "Giới hạn nạp / thua",
    terms: "Điều khoản & Điều kiện",
  },

  deposit: {
    title: "Nạp tiền",
    railBank: "Ngân hàng",
    railMomo: "Momo",
    railViettel: "ViettelPay",
    railCard: "Thẻ cào",
    amount: "Số tiền",
    iHaveTransferred: "Tôi đã chuyển",
    copyMemo: "Sao chép nội dung",
    pending: "Đang chờ xác nhận",
  },

  /* J9-exact header (tier-1 utility cluster + tier-2 category nav). */
  header: {
    vip: "VIP",
    promo: "Khuyến mãi",
    store: "Cửa hàng",
    glamor: "Phong cách",
    club: "CLB",
  },

  /* Header notification bell + dropdown panel. */
  notifications: {
    title: "Thông báo",
    open: "Mở thông báo",
    unreadOne: "1 thông báo chưa đọc",
    unreadMany: "thông báo chưa đọc",
    allRead: "Đã đọc tất cả",
    markAllRead: "Đánh dấu đã đọc tất cả",
    markRead: "Đánh dấu đã đọc",
    empty: "Chưa có thông báo",
    emptyHint: "Các thông báo mới sẽ xuất hiện tại đây.",
    /* relative-time units (plain VN) */
    justNow: "Vừa xong",
    minutesAgo: "phút trước",
    hoursAgo: "giờ trước",
    daysAgo: "ngày trước",
    /* kind labels (the row's category chip) */
    kindPromo: "Khuyến mãi",
    kindDeposit: "Nạp tiền",
    kindEvent: "Sự kiện",
    kindSystem: "Hệ thống",
  },

  /* Member message center (/tin-nhan). Reuses notifications.markAllRead +
   * markRead + the relative-time units above (no duplication). */
  messages: {
    title: "Tin nhắn",
    /** subtitle unit; rendered as `${n} tin nhắn chưa đọc`. */
    subtitleUnread: "tin nhắn chưa đọc",
    subtitleAllRead: "Đã đọc tất cả",
    filterAll: "Tất cả",
    filterUnread: "Chưa đọc",
    filterRead: "Đã đọc",
    filterLabel: "Lọc tin nhắn",
    deleteAll: "Xóa tất cả",
    empty: "Chưa có tin nhắn",
    emptyHint: "Các tin nhắn mới sẽ xuất hiện tại đây.",
    guestPrompt: "Đăng nhập để xem tin nhắn của bạn.",
  },

  /* Referral / Giới thiệu page (/gioi-thieu) + shared Đại lý (/dai-ly) bands.
   * Plain-VN labels for the J9 refer-page rebuild. Truthful-only: no fabricated
   * percent or reward figure lives here — only field/section labels. */
  referral: {
    pageHeading: "Giới thiệu bạn bè",
    kpiPanelTitle: "Tổng quan thưởng",
    /* J9 奖励总览 — exact labels (#1 is a COUNT of valid new referrals). */
    kpiStat1: "Giới thiệu hợp lệ trong tháng",
    kpiStat2: "Cược hợp lệ của tôi hôm nay",
    kpiStat3: "Bạn bè cược tích lũy hôm nay",
    kpiStat4: "Hoa hồng dự kiến ngày mai",
    invitePanelTitle: "Công cụ mời bạn bè",
    inviteCodeLabel: "Mã giới thiệu",
    inviteLinkLabel: "Liên kết giới thiệu",
    inviteCopy: "Sao chép",
    inviteCopied: "Đã sao chép",
    inviteSaveQr: "Lưu mã QR",
    invitePosterTitle: "Ảnh mời / mã QR",
    invitePosterHint: "Ảnh chia sẻ sẽ hiển thị tại đây khi sẵn sàng.",
    inviteGuestNote: "Đăng nhập để lấy mã giới thiệu của riêng bạn.",
    commissionPanelTitle: "Hoa hồng giới thiệu",
    commissionHeldLabel: "Hoa hồng hiện có",
    commissionDetailsLink: "Chi tiết hoạt động",
    commissionRowTurnover: "Doanh thu",
    commissionRowCommission: "Hoa hồng",
    commissionGuestPrompt: "Đăng nhập để xem hoa hồng giới thiệu của bạn.",
    commissionEmptyTitle: "Chưa có hoa hồng",
    commissionEmptyMessage:
      "Khi bạn bè được giới thiệu phát sinh doanh thu, hoa hồng sẽ hiển thị tại đây.",
    stepsHeading: "Cách hoạt động",
    stepsIntro:
      "Bạn chưa có bạn bè được giới thiệu — hãy mời bạn bè hoàn thành các bước để nhận thưởng.",
    step1: "Gửi mã QR hoặc liên kết mời",
    step2: "Bạn bè đăng ký và đăng nhập",
    step3: "Bạn bè tham gia chơi",
    step4: "Nhận hoa hồng theo điều khoản",
  },

  /* J9-exact footer — 3-column band + copyright. */
  footer: {
    partners: "Đối tác",
    aboutUs: "Về chúng tôi",
    brandCol: "Yaobet",
    appDownload: "Tải ứng dụng",
    glamor: "Phong cách Yaobet",
    about: "Giới thiệu",
    helpCenter: "Trung tâm trợ giúp",
    copyright: "Bản quyền © 2026 Tập đoàn Yaobet. Mọi quyền được bảo lưu.",
  },
} as const;

export type Vi = typeof vi;
