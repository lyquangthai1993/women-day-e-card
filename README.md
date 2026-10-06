# 🌸 20/10 E-Card & Ice Cream Pass

> **Website tạo thiệp điện tử chúc mừng Ngày Phụ Nữ Việt Nam 20/10** dành cho toàn thể nhân viên, tích hợp nhận diện thiết bị **FingerprintJS**, xuất ảnh thiệp sắc nét độ phân giải cao, chia sẻ trực tiếp qua link và nhận **Vé kem điện tử (Ice Cream Pass)** bảo mật tại quầy sự kiện.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-success?logo=vercel)](https://women-day-e-card.vercel.app)

🔗 **Website chính thức**: [https://women-day-e-card.vercel.app](https://women-day-e-card.vercel.app)

---

## 📖 Mục lục

- [✨ Tính năng nổi bật](#-tính-năng-nổi-bật)
- [🎨 Bộ sưu tập 7 chủ đề hoa (Botanical Themes)](#-bộ-sưu-tập-7-chủ-đề-hoa-botanical-themes)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [📂 Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [⚙️ Cấu hình biến môi trường (Environment Variables)](#️-cấu-hình-biến-môi-trường-environment-variables)
- [🚀 Hướng dẫn cài đặt & Chạy cục bộ](#-hướng-dẫn-cài-đặt--chạy-cục-bộ)
- [📊 Hướng dẫn kết nối Google Sheets (HR Audit Logging)](#-hướng-dẫn-kết-nối-google-sheets-hr-audit-logging)
- [🌐 Triển khai lên Vercel Production](#-triển-khai-lên-vercel-production)

---

## ✨ Tính năng nổi bật

### 1. Bố cục kép thông minh (Responsive Dual Layout)
- **Desktop (Màn hình rộng)**: Thiết kế 2 cột song song trực quan:
  - *Cột trái*: Biểu mẫu nhập thông tin người nhận, người gửi và chọn gợi ý lời chúc.
  - *Cột phải*: Bản xem trước thiệp thời gian thực (Sticky Live Preview) cập nhật tức thì từng ký tự gõ.
- **Mobile (Smartphone)**: Bố cục cuộn dọc liền mạch, tối ưu tuyệt đối cho thao tác một tay trên điện thoại.

### 2. Hỗ trợ song ngữ tức thì (VI | EN)
- Chuyển đổi ngôn ngữ Tiếng Việt và Tiếng Anh mượt mà với 1 nút bấm góc trên cùng.
- Trạng thái nút hiển thị active rõ nét, tự động lưu lựa chọn ngôn ngữ vào `localStorage`.
- Đồng bộ toàn diện: Giao diện người dùng, danh xưng mẫu, lời chúc mẫu, thông báo lỗi và vé nhận kem.

### 3. Thiết kế thiệp hoa giấy nhiều tầng (Layered Paper-bloom Art)
- Toàn bộ hoa lá và khung viền được thiết kế bằng **SVG vector thuần** sắc sảo, nhẹ nhàng và tải tức thì.
- **Khung viền đôi (Double Frame Border)** thanh lịch theo chuẩn thiệp thủ công cao cấp.
- **Khoảng cách thị giác an toàn (Safe-space Typography)**: Khoảng cách từ mép trên (`padding-top: 144px - 160px`) được căn chỉnh tỉ mỉ, đảm bảo danh xưng người nhận luôn nổi bật và tuyệt đối không bao giờ bị cánh hoa che chữ trên mọi độ phân giải.

### 4. Thư viện gợi ý lời chúc có sẵn (Inspiration Wishes Drawer)
- Tích hợp sẵn hàng chục câu chúc đắt giá, giàu cảm xúc được biên soạn riêng cho từng đối tượng (Mẹ, Vợ, Chị em gái, Bạn thân, Đồng nghiệp, Người yêu, Người nhớ về).
- Người dùng chỉ cần chạm 1 chạm để áp dụng ngay vào thiệp, hoàn thành thiệp trong chưa đầy 1 phút.

### 5. Xuất ảnh độ nét cao (Retina PNG Image Export)
- Tích hợp thư viện `html-to-image` với tỷ lệ điểm ảnh cao (Pixel Ratio 2x - 2.5x), hỗ trợ tải về file ảnh `.png` sắc nét để gửi qua Zalo, Messenger, Email hoặc in ấn lưu niệm.

### 6. Trải nghiệm nhận thiệp tương tác & Lan tỏa yêu thương (`/card?data=...`)
- Chia sẻ thiệp bằng đường link mã hóa Base64 an toàn trên URL, không cần lưu trữ thông tin cá nhân lên server bên ngoài.
- Người nhận mở link sẽ nhận được hiệu ứng thiệp mở ra kèm pháo hoa giấy rực rỡ (`canvas-confetti`).
- Nút **"Tạo thành thiệp mới (gửi người khác)"** cho phép người nhận ngay lập tức chuyển sang chế độ tạo thiệp để tiếp tục gửi trao yêu thương đến những người phụ nữ quan trọng khác.

### 7. Vé nhận kem điện tử (Ice Cream Pass) & Cơ chế bảo mật động
- Nhận diện thiết bị duy nhất thông qua **FingerprintJS** kết hợp **Web Crypto API (SHA-256)**, không yêu cầu người dùng phải đăng nhập tài khoản.
- **Cấu hình động mã lưu trữ LocalStorage**:
  - Hỗ trợ biến môi trường `NEXT_PUBLIC_ICECREAM_CLAIM_KEY` (cấu hình độc lập trên `.env` và Vercel).
  - Vào ngày diễn ra sự kiện chính thức (Go-live), Quản trị viên / Ban tổ chức chỉ cần thay đổi giá trị key (ví dụ: `icecream_claimed_20261020`) là toàn bộ lượt nhận kem thử nghiệm trước đó sẽ được làm mới sạch sẽ 100% mà không ảnh hưởng tới dữ liệu của người dùng.
- Đồng hồ nhảy giây thời gian thực và mã vé định danh cá nhân `#ICE-2010-XXXX` kèm nút xác nhận nhận kem trực tiếp tại quầy xe kem.

---

## 🎨 Bộ sưu tập 8 chủ đề hoa (Botanical Themes)

Mỗi mối quan hệ được thiết kế với một loài hoa, cấu trúc cánh hoa và tone màu nền riêng biệt:

| Đối tượng | Loài hoa & Đặc trưng cánh | Tone màu hoa | Màu nền thiệp | Ý nghĩa dấu ấn |
| :--- | :--- | :--- | :--- | :--- |
| **Mẹ** | **Mẫu Đơn Hồng** (*Peony*)<br>Cánh hoa đa tầng mềm mại uốn lượn | Hồng đào, hồng phấn phớt nhẹ, nhụy vàng hổ phách | `#fcf1f4` (Hồng phấn êm dịu) | *MẪU TỬ TRI ÂN* |
| **Vợ** | **Hồng Đỏ Thẫm** (*Red Rose*)<br>Cánh hoa xoắn ốc xếp lớp kiêu sa | Đỏ nhung thẫm (`#9f1239`), nhụy vàng óng | `#fdf5f5` (Ngà phớt đỏ nồng thắm) | *TRỌN VẸN YÊU THƯƠNG* |
| **Chị / Em gái** | **Anh Đào Hồng Phấn** (*Sakura*)<br>Cánh hoa đào xẻ nhẹ thanh thoát | Hồng phấn tươi sáng (`#f472b6`) | `#fdf2f5` (Baby pink trong trẻo) | *RẠNG RỠ TỎA SÁNG* |
| **Bạn thân** | **Cúc Họa Mi** (*Daisy*)<br>32 cánh trắng thon dài tỏa đều quanh nhụy lớn | Cánh trắng muốt, nhụy vàng chấm hạt nổi bật | `#fefce8` (Vàng kem tươi tắn) | *TRI KỶ BỀN LÂU* |
| **Đồng nghiệp** | **Hoa Tím Lilac** (*Lilac*)<br>Cánh hoa lilac thanh nhã, trang trọng | Tím thạch anh & oải hương (`#9333ea`) | `#fbf6fe` (Tím nhạt thanh lịch) | *TRÂN TRỌNG HỢP TÁC* |
| **Người yêu** | **Mao Lương San Hô** (*Ranunculus*)<br>42 cánh tròn uốn lượn đa tầng đồng tâm | Cam san hô ngọt ngào (`#ea580c`, `#fb923c`) | `#fff5f2` (Đào san hô ấm áp) | *TRÁI TIM CHO EM* |
| **Người nhớ về** | **Hoa Trắng Thanh Khiết** (*White Lily*)<br>Cánh hoa xếp lớp thanh tao viền bóng bạc | Trắng tinh khôi, bóng ngọc trai dịu nhẹ | `#f0f4f8` (Xám xanh nhẹ trang trọng) | *SỐNG MÃI TRONG TIM* |
| **Khác (Others)** | **Cát Tường Nắng Ấm** (*Lisianthus*)<br>Cánh hoa vàng mơ nắng ấm thanh lịch | Vàng hổ phách, vàng mơ nắng ấm, nhụy nâu ấm | `#faf8f5` (Ngà ấm linen thanh nhã) | *VẠN SỰ NHƯ Ý* |

---

## 🛠️ Công nghệ sử dụng

- **Core Framework**: [Next.js 14](https://nextjs.org/) (App Router, Turbopack, SSR/SSG)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Hiệu ứng & Hoạt ảnh**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Kết xuất đồ họa & Xuất ảnh**: [html-to-image](https://www.npmjs.com/package/html-to-image)
- **Định danh thiết bị**: [@fingerprintjs/fingerprintjs](https://github.com/fingerprintjs/fingerprintjs) & Web Crypto API
- **Lưu trữ & Báo cáo dữ liệu**: Google Sheets API thông qua Google Apps Script Web App
- **Nền tảng triển khai**: [Vercel](https://vercel.com/) (Hỗ trợ Edge Network & CI/CD tự động)

---

## 📂 Cấu trúc thư mục

```text
women-day-e-card/
├── public/                     # Tài nguyên tĩnh (favicon, logo, icons)
├── src/
│   ├── app/
│   │   ├── card/               # Trang người nhận xem thiệp (/card?data=...)
│   │   │   └── page.tsx
│   │   ├── globals.css         # Cấu hình Tailwind và font chữ hệ thống
│   │   ├── layout.tsx          # Root Layout & Metadata SEO
│   │   └── page.tsx            # Trang chủ tạo thiệp (Step 1 & Step 2)
│   ├── components/
│   │   ├── CardPreview.tsx     # Component render thiệp hoa SVG, khung viền và typography
│   │   ├── IceCreamModal.tsx   # Modal nhận vé kem điện tử với đồng hồ và mã QR
│   │   ├── SuggestionsModal.tsx# Drawer/Modal gợi ý lời chúc có sẵn cho 7 chủ đề
│   │   └── ViewCardModal.tsx   # Modal xem lại thiệp nhanh
│   ├── lib/
│   │   ├── constants.ts        # Dữ liệu 7 chủ đề hoa, lời chúc mẫu song ngữ, cấu hình key
│   │   ├── fingerprint.ts      # Hàm sinh Device Fingerprint định danh thiết bị
│   │   ├── googleSheet.ts      # Hàm gửi thông tin thiệp & nhận quà về Google Sheets
│   │   └── languageStorage.ts  # Quản lý lưu trữ trạng thái song ngữ VI | EN
│   └── types/
│       └── index.ts            # Định nghĩa kiểu dữ liệu TypeScript
├── google_apps_script.js       # Mã nguồn Apps Script để đồng bộ với Google Sheets
├── .env                        # File biến môi trường mẫu
├── next.config.mjs             # Cấu hình Next.js
├── tailwind.config.ts          # Cấu hình màu sắc, font chữ Tailwind
├── tsconfig.json               # Cấu hình trình biên dịch TypeScript
└── README.md                   # Tài liệu hướng dẫn này
```

---

## ⚙️ Cấu hình biến môi trường (Environment Variables)

Tạo file `.env` hoặc cấu hình trực tiếp trên **Vercel Dashboard** $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**:

| Tên biến | Bắt buộc | Giá trị mặc định / Mẫu | Mô tả |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_ICECREAM_CLAIM_KEY` | **Có** | `icecream_claimed_300926` | Tên key lưu trạng thái nhận kem trong `localStorage`. Thay đổi giá trị này vào ngày Go-live để reset quyền nhận kem hàng loạt cho toàn bộ người dùng. |
| `NEXT_PUBLIC_GOOGLE_SHEET_API_URL` | Tùy chọn | `https://script.google.com/macros/s/AKfycb.../exec` | URL triển khai Web App của Google Apps Script để nhận dữ liệu thống kê. |

---

## 🚀 Hướng dẫn cài đặt & Chạy cục bộ

### Yêu cầu môi trường:
- [Node.js](https://nodejs.org/) phiên bản **18.17.0** trở lên.
- Quản lý gói `npm` hoặc `yarn` / `pnpm`.

### Các bước thực hiện:

1. **Clone mã nguồn về máy**:
   ```bash
   git clone https://github.com/lyquangthai1993/women-day-e-card.git
   cd women-day-e-card
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies)**:
   ```bash
   npm install
   ```

3. **Cấu hình file biến môi trường**:
   - Kiểm tra file `.env` và cập nhật các giá trị phù hợp với nhu cầu thử nghiệm của bạn.

4. **Khởi chạy máy chủ phát triển (Development Server)**:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ khởi chạy tại: [http://localhost:5000](http://localhost:5000)

5. **Kiểm tra bản build sản xuất (Production Build)**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📊 Hướng dẫn kết nối Google Sheets (HR Audit Logging)

Để tự động lưu trữ danh sách lời chúc, thông tin thiệp và lịch sử nhận kem của nhân viên vào bảng tính Google Sheets:

1. Mở [Google Sheets](https://sheets.new) và tạo một bảng tính mới (Ví dụ: `2010_ECard_Wishes_Log`).
2. Trên thanh menu, chọn: **Tiện ích mở rộng (Extensions)** $\rightarrow$ **Apps Script**.
3. Xóa đoạn mã mặc định `function myFunction() {}`, mở file [`google_apps_script.js`](./google_apps_script.js) trong thư mục dự án này, copy toàn bộ nội dung và dán vào.
4. Bấm nút **Triển khai (Deploy)** ở góc trên bên phải $\rightarrow$ Chọn **Triển khai mới (New deployment)**.
5. Cấu hình triển khai:
   - **Loại triển khai:** Bấm icon bánh răng $\rightarrow$ Chọn **Ứng dụng web (Web app)**.
   - **Mô tả:** `E-Card 20/10 API Production`
   - **Thực thi dưới dạng (Execute as):** `Tôi (Me)`
   - **Ai có quyền truy cập (Who has access):** `Bất kỳ ai (Anyone)` *(Bắt buộc để frontend gửi được request mà không bị chặn xác thực Google)*.
6. Bấm **Triển khai (Deploy)** và cấp quyền truy cập tài khoản khi Google yêu cầu.
7. Sao chép **URL ứng dụng web (Web app URL)** (có dạng `https://script.google.com/macros/s/AKfy.../exec`).
8. Cập nhật biến môi trường `NEXT_PUBLIC_GOOGLE_SHEET_API_URL` trong file `.env` và trên Vercel.

---

## 🌐 Triển khai lên Vercel Production

Dự án đã được tối ưu hoàn hảo cho hạ tầng Vercel Serverless:

1. Kết nối kho lưu trữ GitHub `lyquangthai1993/women-day-e-card` với Vercel.
2. Tại mục **Environment Variables**, thêm:
   - `NEXT_PUBLIC_ICECREAM_CLAIM_KEY`: Giá trị key nhận kem của sự kiện.
   - `NEXT_PUBLIC_GOOGLE_SHEET_API_URL`: URL Web App Apps Script của bạn.
3. Bấm **Deploy**. Mỗi khi đẩy code mới lên branch `main`:
   ```bash
   git add .
   git commit -m "feat: your new feature"
   git push origin main
   ```
   Vercel sẽ tự động build và cập nhật phiên bản mới nhất lên domain chính thức: **[https://women-day-e-card.vercel.app](https://women-day-e-card.vercel.app)**.

---

<p align="center">
  Được phát triển với tất cả tình cảm nhân ngày <b>Phụ Nữ Việt Nam 20/10</b> 💐
</p>
