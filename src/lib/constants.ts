import { RelationshipTheme } from '../types';

// Tiền tố / Key định danh trạng thái nhận kem trong localStorage (cấu hình động qua .env / Vercel)
export const ICECREAM_CLAIM_KEY_PREFIX = process.env.NEXT_PUBLIC_ICECREAM_CLAIM_KEY || 'icecream_claimed';

export const getIceCreamClaimStorageKey = (visitorId: string): string => {
  const prefix = process.env.NEXT_PUBLIC_ICECREAM_CLAIM_KEY || 'icecream_claimed';
  return `${prefix}_${visitorId}`;
};

export const RELATIONSHIPS: RelationshipTheme[] = [
  {
    id: 'mother',
    icon: '🌺',
    nameVi: 'Mẹ',
    nameEn: 'Mother',
    flowerVi: 'Mẫu Đơn Vương Giả',
    flowerEn: 'Royal Peony',
    bgClass: 'bg-[#faf9f6]',
    bgColor: '#faf9f6',
    gradientClass: 'bg-gradient-to-b from-[#fcfbf9] via-[#faf9f6] to-[#f4f1ea]',
    borderClass: 'border-2 border-[#d4a843]',
    dividerSymbol: '❦ 👑 ❦',
    stampBadgeVi: 'MẪU TỬ TRI ÂN · DÀNH TẶNG MẸ KÍNH YÊU',
    stampBadgeEn: 'LOVE & GRATITUDE · DEAREST MOTHER',
    stampStyle: 'wax-seal',
    salutationColor: 'text-[#06214c]',
    titleColor: 'text-[#06214c]',
    bodyColor: 'text-[#1b2a47]',
    senderColor: 'text-[#06214c]',
    strokeColor: '#d4a843',
    petalColor: '#06214c',
    defaultReceiverVi: 'Mẹ Yêu Quý',
    defaultReceiverEn: 'Dearest Mother',
    defaultSalutationVi: 'Kính gửi',
    defaultSalutationEn: 'To My Loving',
    wishesVi: [
      "Cảm ơn mẹ vì cả một đời hy sinh và luôn là chỗ dựa vững chãi nhất của con. Chúc mẹ 20/10 nhiều sức khỏe và luôn an yên.",
      "Điều con ngưỡng mộ nhất ở mẹ là sự dịu dàng và kiên cường. Mong mẹ mỗi ngày đều tìm thấy niềm vui bình dị.",
      "Có một điều con ít khi nói thành lời: Con yêu mẹ rất nhiều và cảm ơn vì đã là mẹ của con.",
      "Chúc mẹ ngày 20/10 rạng rỡ như những đóa hoa mẫu đơn, luôn vui vẻ và hạnh phúc bên con cháu."
    ],
    wishesEn: [
      "Thank you, Mom, for your endless love, sacrifices, and warmth. Wishing you a peaceful and joyful Vietnamese Women's Day.",
      "What I admire most about you is your graceful strength. May every day bring you health and gentle happiness.",
      "Something I don't say often enough: I love you deeply and am eternally grateful to be your child.",
      "Wishing you a day as blooming and beautiful as royal peonies. Always stay cheerful and healthy!"
    ]
  },
  {
    id: 'wife',
    icon: '🌹',
    nameVi: 'Vợ',
    nameEn: 'Wife',
    flowerVi: 'Hoa Hồng Nhung Hoàng Gia',
    flowerEn: "Royal Velvet Rose",
    bgClass: 'bg-[#faf6f7]',
    bgColor: '#faf6f7',
    gradientClass: 'bg-gradient-to-b from-[#fdfafb] via-[#faf6f7] to-[#f7eef0]',
    borderClass: 'border-2 border-[#d4a843]',
    dividerSymbol: '~ ❦ 👑 ❧ ~',
    stampBadgeVi: "TRỌN VẸN YÊU THƯƠNG · GỬI VỢ YÊU",
    stampBadgeEn: "FOREVER YOURS · DEAREST WIFE",
    stampStyle: 'ruby-ribbon',
    salutationColor: 'text-[#7f1d3a]',
    titleColor: 'text-[#7f1d3a]',
    bodyColor: 'text-[#0f2240]',
    senderColor: 'text-[#06214c]',
    strokeColor: '#be123c',
    petalColor: '#06214c',
    defaultReceiverVi: 'Vợ Yêu Của Anh',
    defaultReceiverEn: 'My Beloved Wife',
    defaultSalutationVi: 'Thương gửi',
    defaultSalutationEn: 'With all my love to',
    wishesVi: [
      "Cảm ơn em vì đã cùng anh vun vén mái ấm và luôn bên cạnh anh qua mọi thăng trầm. 20/10 chúc vợ luôn xinh đẹp và hạnh phúc!",
      "Nếu không có em, cuộc sống của anh chắc chắn sẽ rất tẻ nhạt. Cảm ơn vì em đã là người bạn đồng hành tuyệt vời nhất.",
      "Hôm nay anh chỉ muốn nói với em rằng: Với anh, nụ cười của em luôn là điều quý giá nhất.",
      "Chúc bà xã 20/10 ngập tràn niềm vui, bớt lo toan và luôn cảm nhận được tình yêu thương của anh."
    ],
    wishesEn: [
      "Thank you for building our home with love and being my constant anchor. Happy Women's Day to my wonderful wife!",
      "Life would be dull without you by my side. Thank you for being the most loving partner I could ever ask for.",
      "Today I just want to remind you: Your smile is, and will always be, my greatest treasure.",
      "Wishing my dearest wife a day full of sweet moments, laughter, and relaxation."
    ]
  },
  {
    id: 'sister',
    icon: '🌸',
    nameVi: 'Chị / Em gái',
    nameEn: 'Sister',
    flowerVi: 'Hoa Anh Đào Thanh Xuân',
    flowerEn: 'Cherry Blossom of Youth',
    bgClass: 'bg-[#f4f8fb]',
    bgColor: '#f4f8fb',
    gradientClass: 'bg-gradient-to-b from-[#f8fbfd] via-[#f4f8fb] to-[#e8f1f7]',
    borderClass: 'border-2 border-[#d4a843]',
    dividerSymbol: '🌸 ✦ 🌸',
    stampBadgeVi: 'RẠNG RỠ TỎA SÁNG · CHỊ EM THÂN THƯƠNG',
    stampBadgeEn: 'SWEET & SHINING · DEAREST SISTER',
    stampStyle: 'airmail-stamp',
    salutationColor: 'text-[#0d3674]',
    titleColor: 'text-[#0d3674]',
    bodyColor: 'text-[#1e293b]',
    senderColor: 'text-[#06214c]',
    strokeColor: '#3b6998',
    petalColor: '#234b82',
    defaultReceiverVi: 'Chị / Em Gái',
    defaultReceiverEn: 'My Dear Sister',
    defaultSalutationVi: 'Thân gửi',
    defaultSalutationEn: 'Dearest',
    wishesVi: [
      "Chúc người chị/em gái tuyệt vời luôn tự tin tỏa sáng và đạt được mọi ước mơ của mình nhé!",
      "Cảm ơn vì đã luôn là nơi để chia sẻ và tíu tít đủ thứ chuyện trên đời. 20/10 vui vẻ và rực rỡ nha!",
      "Chúc em/chị luôn giữ nụ cười tươi tắn trên môi và luôn được yêu thương trọn vẹn.",
      "Mong mọi điều tốt lành, may mắn và hạnh phúc nhất sẽ đến với chị/em trong ngày hôm nay."
    ],
    wishesEn: [
      "Wishing my amazing sister a vibrant day! Keep shining brightly and chasing your dreams.",
      "Thank you for all the shared laughter and memories. Happy Vietnamese Women's Day!",
      "May your smile stay radiant, and may you always be surrounded by love and kindness.",
      "Sending warm hugs and wishing you endless success and joy!"
    ]
  },
  {
    id: 'friend',
    icon: '🌼',
    nameVi: 'Bạn thân',
    nameEn: 'Best Friend',
    flowerVi: 'Cúc Họa Mi Ánh Kim',
    flowerEn: 'Sunlit Daisy of Companionship',
    bgClass: 'bg-[#fcfaf2]',
    bgColor: '#fcfaf2',
    gradientClass: 'bg-gradient-to-b from-[#fdfbf6] via-[#fcfaf2] to-[#f7f2df]',
    borderClass: 'border-2 border-[#d4a843]',
    dividerSymbol: '✦ 🌼 ✦',
    stampBadgeVi: 'TRI KỶ BỀN LÂU · TÌNH BẠN DIỆU KỲ',
    stampBadgeEn: 'BESTIE FOREVER · CHERISHED FRIENDSHIP',
    stampStyle: 'bestie-badge',
    salutationColor: 'text-[#78350f]',
    titleColor: 'text-[#78350f]',
    bodyColor: 'text-[#0a1f44]',
    senderColor: 'text-[#06214c]',
    strokeColor: '#f9b31e',
    petalColor: '#06214c',
    defaultReceiverVi: 'Bạn Thân Của Tôi',
    defaultReceiverEn: 'My Best Friend',
    defaultSalutationVi: 'Gửi bạn',
    defaultSalutationEn: 'To My Buddy',
    wishesVi: [
      "Chúc bạn thân ngày 20/10 luôn xinh đẹp rạng ngời, tự tin làm chủ cuộc sống và gặt hái thật nhiều thành công rực rỡ nhé!",
      "Cảm ơn bạn vì luôn lắng nghe và đồng hành những lúc vui buồn. 20/10 thật hạnh phúc nhé người bạn tuyệt vời!",
      "Chúc bạn luôn xinh đẹp, tự tin làm chủ cuộc sống và luôn yêu thương chính mình.",
      "Hôm nay xứng đáng nhận hoa, quà và thật nhiều niềm vui. Happy Women's Day!"
    ],
    wishesEn: [
      "Wishing my wonderful bestie a fabulous 20/10! Stay beautiful, confident, and chase your dreams with pride!",
      "Thanks for always being there through thick and thin. Have a truly wonderful 20/10!",
      "Wishing you confidence, success, and tons of love. You deserve the best!",
      "Go treat yourself to something nice today—you truly rock!"
    ]
  },
  {
    id: 'colleague',
    icon: '💜',
    nameVi: 'Đồng nghiệp',
    nameEn: 'Colleague',
    flowerVi: 'Hoa Tím Lilac Trí Tuệ',
    flowerEn: 'Academic Lilac & Deco',
    bgClass: 'bg-[#f3f6fa]',
    bgColor: '#f3f6fa',
    gradientClass: 'bg-gradient-to-b from-[#f7f9fc] via-[#f3f6fa] to-[#e8edf5]',
    borderClass: 'border-2 border-[#d4a843]',
    dividerSymbol: '◆ 👑 ◆',
    stampBadgeVi: 'TRÂN TRỌNG HỢP TÁC · ĐỒNG NGHIỆP TUYỆT VỜI',
    stampBadgeEn: 'VALUED COLLEAGUE · INSPIRING PARTNERSHIP',
    stampStyle: 'modern-foil',
    salutationColor: 'text-[#1e1b4b]',
    titleColor: 'text-[#1e1b4b]',
    bodyColor: 'text-[#1e293b]',
    senderColor: 'text-[#06214c]',
    strokeColor: '#7c3aed',
    petalColor: '#06214c',
    defaultReceiverVi: 'Chị / Em Đồng Nghiệp',
    defaultReceiverEn: 'Dear Colleague',
    defaultSalutationVi: 'Thân chúc',
    defaultSalutationEn: 'Wishing',
    wishesVi: [
      "Cảm ơn bạn vì sự hợp tác và năng lượng tích cực luôn mang lại cho team. Chúc bạn 20/10 thật nhiều niềm vui!",
      "Chúc đồng nghiệp tài năng công việc luôn thuận lợi, deadline luôn êm đẹp và luôn xinh tươi!",
      "Rất may mắn vì được làm việc cùng một đồng nghiệp tận tâm và dễ thương như bạn. Chúc bạn 20/10 tuyệt vời!",
      "Chúc toàn thể chị em đồng nghiệp ngày 20/10 ngập tràn hoa, quà và những lời chúc tốt đẹp nhất."
    ],
    wishesEn: [
      "Thank you for your fantastic teamwork and positive energy. Happy Vietnamese Women's Day!",
      "Wishing you great success, stress-free deadlines, and continued growth in everything you do!",
      "It's a pleasure collaborating with someone as dedicated and inspiring as you. Have a great 20/10!",
      "Wishing all our female colleagues a joyful day filled with flowers and appreciation!"
    ]
  },
  {
    id: 'lover',
    icon: '🧡',
    nameVi: 'Người yêu',
    nameEn: 'Girlfriend',
    flowerVi: 'Mao Lương San Hô Quý Phái',
    flowerEn: 'Coral Ranunculus & Silk',
    bgClass: 'bg-[#faf5f2]',
    bgColor: '#faf5f2',
    gradientClass: 'bg-gradient-to-b from-[#fdf9f7] via-[#faf5f2] to-[#f6ece6]',
    borderClass: 'border-2 border-[#d4a843]',
    dividerSymbol: '~ ♡ 👑 ♡ ~',
    stampBadgeVi: 'TRÁI TIM CHO EM · NGỌT NGÀO YÊU THƯƠNG',
    stampBadgeEn: 'MY SWEETHEART · WITH ALL MY HEART',
    stampStyle: 'coral-heart',
    salutationColor: 'text-[#7c2d12]',
    titleColor: 'text-[#7c2d12]',
    bodyColor: 'text-[#0d2347]',
    senderColor: 'text-[#06214c]',
    strokeColor: '#ea580c',
    petalColor: '#06214c',
    defaultReceiverVi: 'Em Yêu Của Anh',
    defaultReceiverEn: 'My Sweetheart',
    defaultSalutationVi: 'Dành tặng',
    defaultSalutationEn: 'Forever with',
    wishesVi: [
      "Chúc cô gái của anh ngày 20/10 luôn nở nụ cười rạng rỡ nhất. Yêu em nhiều hơn mỗi ngày!",
      "Cảm ơn em đã đến và mang theo muôn vàn ấm áp vào thế giới của anh. 20/10 ngọt ngào nha em!",
      "Anh không giỏi nói lời hoa mỹ, chỉ mong em luôn an yên và hạnh phúc khi ở bên anh.",
      "Hôm nay hãy để anh lo tất cả nhé. Chúc em một ngày 20/10 ngập tràn sự cưng chiều!"
    ],
    wishesEn: [
      "Wishing the sweetest girl a very Happy Women's Day! You bring so much sunshine into my world.",
      "Thank you for being my favorite person and best blessing. Loving you more each day!",
      "I might not always find poetic words, but I promise to always care for you and make you smile.",
      "Today is your day to be pampered! Happy 20/10 my love."
    ]
  },
  {
    id: 'memorial',
    icon: '🕊️',
    nameVi: 'Người tôi muốn nhớ về',
    nameEn: 'In Loving Memory',
    flowerVi: 'Bách Hợp Trắng Thanh Khiết',
    flowerEn: 'Sovereign White Lily',
    bgClass: 'bg-[#f0f4f8]',
    bgColor: '#f0f4f8',
    gradientClass: 'bg-gradient-to-b from-[#f8fafc] via-[#f0f4f8] to-[#e2e8f0]',
    borderClass: 'border-2 border-[#94a3b8]',
    dividerSymbol: '🪶 ✧ 🪶',
    stampBadgeVi: 'SỐNG MÃI TRONG TIM · PEACE & REMEMBRANCE',
    stampBadgeEn: 'FOREVER IN MEMORY · PEACE & REMEMBRANCE',
    stampStyle: 'memorial-halo',
    salutationColor: 'text-[#0f172a]',
    titleColor: 'text-[#0f172a]',
    bodyColor: 'text-[#334155]',
    senderColor: 'text-[#06214c]',
    strokeColor: '#94a3b8',
    petalColor: '#06214c',
    defaultReceiverVi: 'Người Phụ Nữ Trong Tim Tôi',
    defaultReceiverEn: 'Forever In My Heart',
    defaultSalutationVi: 'Tưởng nhớ',
    defaultSalutationEn: 'Remembering',
    wishesVi: [
      "Dù ở đâu, hình bóng và sự ấm áp của người vẫn luôn sống mãi trong trái tim và từng ký ức của con/tôi.",
      "Cảm ơn vì những yêu thương dịu dàng đã từng để lại. Hôm nay con nhớ về người với lòng biết ơn vô hạn.",
      "Gửi một lời tri ân bình yên đến nơi xa. Người sẽ luôn là ngọn hải đăng soi sáng cho con.",
      "Nhớ về người với tất cả sự kính trọng, yêu thương và lòng trân quý sâu sắc nhất."
    ],
    wishesEn: [
      "Wherever you are, your warmth and gentle presence will forever stay alive in my heart.",
      "Thank you for all the precious love you left behind. Remembering you today with endless gratitude.",
      "Sending peaceful thoughts to you. You remain my guiding light always.",
      "Cherishing your memory today with all my love, respect, and admiration."
    ]
  },
  {
    id: 'other',
    icon: '💐',
    nameVi: 'Khác',
    nameEn: 'Others',
    flowerVi: 'Cát Tường Hoàng Gia',
    flowerEn: "Lisianthus & Gold Crest",
    bgClass: 'bg-[#faf9f6]',
    bgColor: '#faf9f6',
    gradientClass: 'bg-gradient-to-b from-[#fcfbf9] via-[#faf9f6] to-[#f4f0e6]',
    borderClass: 'border-2 border-[#d4a843]',
    dividerSymbol: '✦ 👑 ✦',
    stampBadgeVi: "VẠN SỰ NHƯ Ý · TRÂN QUÝ & BÌNH AN",
    stampBadgeEn: "BEST WISHES · PEACE & JOY",
    stampStyle: 'modern-foil',
    salutationColor: 'text-[#06214c]',
    titleColor: 'text-[#06214c]',
    bodyColor: 'text-[#1c283d]',
    senderColor: 'text-[#06214c]',
    strokeColor: '#d4a843',
    petalColor: '#06214c',
    defaultReceiverVi: 'Người Phụ Nữ Tuyệt Vời',
    defaultReceiverEn: 'Someone Special',
    defaultSalutationVi: 'Thân gửi',
    defaultSalutationEn: 'To',
    wishesVi: [
      "Nhân ngày Phụ nữ Việt Nam 20/10, chúc bạn luôn ngập tràn niềm vui, xinh đẹp, duyên dáng và gặt hái thật nhiều hạnh phúc trong cuộc sống.",
      "Cảm ơn vì đã luôn mang đến nguồn năng lượng tích cực và sự ấm áp. Chúc bạn có một ngày 20/10 thật trọn vẹn và rạng rỡ!",
      "Chúc bạn luôn tự tin tỏa sáng theo cách riêng của mình, mỗi khoảnh khắc trôi qua đều đong đầy yêu thương và nụ cười rạng rỡ.",
      "Gửi ngàn lời chúc tốt đẹp và chân thành nhất nhân ngày 20/10. Chúc bạn mãi tươi vui, yêu đời và luôn được nâng niu, trân trọng."
    ],
    wishesEn: [
      "Wishing you a joyful and wonderful Vietnamese Women's Day! May your life be filled with endless smiles, peace, and happiness.",
      "Thank you for bringing warmth and positive energy everywhere you go. Have a delightful and memorable 20/10!",
      "Stay bright, confident, and inspiring in your own special way. May every day bring you good fortune and laughter.",
      "Sending my warmest thoughts and heartfelt wishes to you. May you always be cherished, happy, and radiant."
    ]
  }
];

export const I18N = {
  vi: {
    pageTitle: "Thiệp Chúc Mừng 20/10 - E-Card",
    subHeader: "Trao gửi yêu thương · 20/10",
    privacyNotice: "🔒 <strong>Riêng tư tuyệt đối:</strong> Thiệp tạo trực tiếp trên máy của bạn.",
    labelRelationship: "1. Người phụ nữ bạn muốn gửi gắm:",
    labelReceiverName: "Tên người nhận (ví dụ: Mẹ yêu, Chị Mai, Em Thảo...):",
    receiverPlaceholder: "Gửi đến ai đó...",
    labelMessage: "Lời nhắn chân thành từ bạn:",
    btnOpenSuggestions: "Gợi ý lời chúc hay",
    quickOpenPrompt: "Chạm để mở khung xem kho lời chúc mẫu",
    suggestionsModalTitle: "Kho Lời Chúc Ý Nghĩa",
    suggestionsModalSubtitle: "Chạm vào câu bạn thích để tự động điền vào thiệp",
    btnCloseSuggestions: "Đóng",
    toastWishSelected: "Đã điền lời chúc vào thiệp!",
    messagePlaceholder: "Viết những điều bạn chưa kịp nói...",
    labelSenderName: "Tên người gửi (hoặc để trống nếu gửi ẩn danh):",
    senderPlaceholder: "Tên của bạn...",
    labelPreview: "2. Xem trước tấm thiệp của bạn:",
    livePreviewHint: "Cập nhật theo thời gian thực",
    btnShareText: "Chia sẻ thiệp",
    btnSaveImgText: "Lưu thành file ảnh",
    footerMadeWith: "Được tạo với tấm lòng dành cho ngày Phụ nữ Việt Nam 20/10",
    claimedBannerText: "Bạn đã có vé nhận kem tại quầy!",
    btnViewTicket: "Xem vé",
    modalTag: "Nhiệm vụ hoàn thành!",
    modalTitle: "Giờ thì đi lấy kem thôi! 🍦",
    modalDesc: "Thiệp đã gửi đi! Hãy đưa màn hình này tại quầy để nhận kem nhé!",
    btnClaim: "Xác nhận đã nhận kem tại quầy",
    btnClaimed: "ĐÃ NHẬN KEM 🍦 (XONG)",
    btnClose: "Đóng và quay lại",
    viewModalTitle: "Tấm thiệp dành tặng bạn",
    btnDownload: "Tải ảnh về máy",
    btnCreateOwn: "Tạo thiệp của bạn",
    btnEditCard: "Chỉnh sửa thiệp",
    editingBannerTitle: "Đang chỉnh sửa thiệp đã lưu",
    editingBannerSubtitle: "Mọi thay đổi sẽ được cập nhật đồng bộ vào cùng liên kết này.",
    btnCancelEditText: "Tạo mới",
    defaultAnonymous: "Từ: Một người thầm trân quý",
    toastCopied: "Đã sao chép liên kết thiệp vào bộ nhớ tạm!",
    toastImageSaved: "Ảnh thiệp đã được tạo thành công!",
    toastClaimed: "Chúc mừng bạn đã nhận kem thành công!",
    toastCardLoading: "Đang tải dữ liệu thiệp từ Google Sheet...",
    toastCardLoaded: "Đã tải xong nội dung thiệp!",
    toastCardUpdated: "Đã đồng bộ cập nhật lên Google Sheet!",
    toastCardNotFound: "Không tìm thấy thiệp trên Google Sheet!",
    viewCardGreetingBadge: "💌 Tấm thiệp dành tặng riêng cho bạn",
    viewCardHeading: "Chúc mừng ngày Phụ nữ Việt Nam 20/10",
    btnCreateOwnCardAction: "Tự tạo thiệp của riêng bạn ngay 🌸",
    btnEditCurrentCardAction: "Chỉnh sửa thiệp này",
    btnUpdateCurrentCard: "Cập nhật thiệp này",
    btnCreateAsNewCard: "Tạo thành thiệp mới (gửi người khác)",
    toastNewCardCreated: "Đã tạo thiệp mới thành công! Link thiệp cũ vẫn được giữ nguyên.",
    btnSharingText: "Đang tạo liên kết...",
    btnSavingText: "Đang xuất ảnh...",
    unauthorizedEditNotice: "Bạn không phải là người tạo tấm thiệp này nên không thể chỉnh sửa bản gốc. Hệ thống đã mở nội dung để bạn tạo một tấm thiệp mới của riêng mình! 🌸",
    toastPermissionDenied: "Bạn không có quyền chỉnh sửa thiệp này!"
  },
  en: {
    pageTitle: "Happy Vietnamese Women's Day 20/10 - E-Card",
    subHeader: "Send Love & Gratitude · 20/10",
    privacyNotice: "🔒 <strong>Strictly Private:</strong> Generated locally on your device.",
    labelRelationship: "1. The special woman in your story:",
    labelReceiverName: "Recipient's Name (e.g. Mom, Sarah, Sister...):",
    receiverPlaceholder: "To someone special...",
    labelMessage: "Your heartfelt message:",
    btnOpenSuggestions: "Inspiration Wishes",
    quickOpenPrompt: "Tap to browse sample wishes",
    suggestionsModalTitle: "Heartfelt Wishes Library",
    suggestionsModalSubtitle: "Tap any wish to auto-fill into your e-card",
    btnCloseSuggestions: "Close",
    toastWishSelected: "Wish inserted into card!",
    messagePlaceholder: "Words you haven't said yet...",
    labelSenderName: "Sender's Name (or leave blank for anonymous):",
    senderPlaceholder: "Your name...",
    labelPreview: "2. Live Card Preview:",
    livePreviewHint: "Updates in real-time",
    btnShareText: "Share E-Card",
    btnSaveImgText: "Save as Image",
    footerMadeWith: "Crafted with love for Vietnamese Women's Day 20/10",
    claimedBannerText: "You have an ice cream ticket ready!",
    btnViewTicket: "View Ticket",
    modalTag: "Mission Complete!",
    modalTitle: "Now Go Pick Up Your Ice Cream! 🍦",
    modalDesc: "Card sent! Show this screen at the counter to get your ice cream!",
    btnClaim: "Confirm Ice Cream Claimed",
    btnClaimed: "ICE CREAM CLAIMED 🍦 (DONE)",
    btnClose: "Close & Return",
    viewModalTitle: "An E-Card For You",
    btnDownload: "Download Image",
    btnCreateOwn: "Create Your Own Card",
    btnEditCard: "Edit E-Card",
    editingBannerTitle: "Editing saved e-card",
    editingBannerSubtitle: "All changes will automatically sync to this same link.",
    btnCancelEditText: "New card",
    defaultAnonymous: "From: Someone who cherishes you",
    toastCopied: "Card link copied to clipboard!",
    toastImageSaved: "Card image rendered successfully!",
    toastClaimed: "Ice cream claimed successfully! Enjoy!",
    toastCardLoading: "Loading e-card from Google Sheet...",
    toastCardLoaded: "E-card loaded successfully!",
    toastCardUpdated: "E-card updated on Google Sheet!",
    toastCardNotFound: "E-card not found on Google Sheet!",
    viewCardGreetingBadge: "💌 A heartfelt e-card for you",
    viewCardHeading: "Happy Vietnamese Women's Day 20/10",
    btnCreateOwnCardAction: "Create your own e-card now 🌸",
    btnEditCurrentCardAction: "Edit this card",
    btnUpdateCurrentCard: "Update Current Card",
    btnCreateAsNewCard: "Save as New Card (for someone else)",
    toastNewCardCreated: "New card created! Previous card link remains intact.",
    btnSharingText: "Creating link...",
    btnSavingText: "Rendering image...",
    unauthorizedEditNotice: "You are not the creator of this card and cannot edit the original. The content has been loaded so you can create a new card of your own! 🌸",
    toastPermissionDenied: "You do not have permission to edit this card!"
  }
};

export function isDefaultReceiver(rec: string | undefined | null, rel?: RelationshipTheme): boolean {
  if (!rec || !rec.trim()) return true;
  const r = rec.trim().toLowerCase();

  const genericDefaults = [
    'mother', 'mẹ', 'dearest mother', 'mẹ yêu quý',
    'wife', 'vợ', 'vợ yêu', 'vợ yêu của anh', 'my beloved wife',
    'sister', 'chị / em gái', 'chị / em', 'chị gái', 'em gái', 'my dear sister',
    'friend', 'bạn thân', 'bạn thân của tôi', 'my best friend',
    'colleague', 'đồng nghiệp', 'chị / em đồng nghiệp', 'dear colleague',
    'lover', 'girlfriend', 'người yêu', 'em yêu của anh', 'my sweetheart',
    'memorial', 'người tôi muốn nhớ về', 'người phụ nữ trong tim tôi', 'in loving memory', 'forever in my heart',
    'other', 'others', 'khác', 'người phụ nữ tuyệt vời', 'someone special', 'special someone'
  ];

  if (genericDefaults.includes(r)) return true;

  if (rel) {
    if (
      r === rel.nameVi.toLowerCase() ||
      r === rel.nameEn.toLowerCase() ||
      r === rel.defaultReceiverVi.toLowerCase() ||
      r === rel.defaultReceiverEn.toLowerCase()
    ) {
      return true;
    }
  }

  return RELATIONSHIPS.some(
    (item) =>
      item.nameVi.toLowerCase() === r ||
      item.nameEn.toLowerCase() === r ||
      item.defaultReceiverVi.toLowerCase() === r ||
      item.defaultReceiverEn.toLowerCase() === r
  );
}

export function isAnonymousSender(sender: string | undefined | null): boolean {
  if (!sender || !sender.trim()) return true;
  const s = sender.trim().toLowerCase();
  const anonList = [
    'ẩn danh', '— ẩn danh', '- ẩn danh',
    'anonymous', '— anonymous', '- anonymous',
    'một người thầm trân quý', '— một người thầm trân quý', '- một người thầm trân quý',
    'từ: một người thầm trân quý',
    'someone who cherishes you', '— someone who cherishes you', '- someone who cherishes you',
    'from: someone who cherishes you'
  ];
  return anonList.includes(s);
}
