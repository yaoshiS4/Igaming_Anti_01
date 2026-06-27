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
