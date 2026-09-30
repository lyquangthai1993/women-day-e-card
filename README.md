# 🌸 Website E-Card 20/10 - Ngày Phụ Nữ Việt Nam

Dự án trang web tạo thiệp điện tử (E-Card) chúc mừng ngày 20/10 dành cho toàn thể nhân viên công ty, tích hợp công nghệ nhận diện thiết bị **FingerprintJS** và lưu trữ/quản lý bằng **Google Sheets**.

---

## ✨ Tính năng nổi bật

1. **Nhận diện thiết bị (FingerprintJS):**
   - Tự động sinh mã định danh duy nhất cho từng thiết bị mà không cần bắt người dùng đăng nhập tài khoản.
   - Quản lý vé nhận kem/quà: Chống gian lận nhận quà nhiều lần trên cùng một máy.

2. **Song ngữ hoàn hảo (VI / EN):**
   - Chuyển đổi ngôn ngữ tức thì với 1 nút bấm ở góc trên.

3. **Giao diện hoa văn thay đổi theo mối quan hệ:**
   - **Mẹ:** Hoa mẫu đơn hồng ấm áp.
   - **Vợ:** Hoa hồng đỏ thẫm nồng nàn.
   - **Chị / Em gái:** Hoa anh đào hồng phấn.
   - **Bạn thân:** Cúc họa mi, nền vàng kem tươi sáng.
   - **Đồng nghiệp:** Hoa tím lilac thanh lịch.
   - **Người yêu:** Hoa mao lương san hô ngọt ngào.
   - **Người tôi muốn nhớ về:** Hoa trắng thanh khiết, trang trọng.

4. **Trải nghiệm nhanh gọn (Dưới 1 phút):**
   - Bộ gợi ý lời chúc có sẵn (Tap-to-insert) giúp người dùng không bị "bí từ".
   - Xem trước thiệp thời gian thực (Live Preview) với khung viền thiệp và chữ sắc nét.

5. **2 Hành động chính:**
   - **Chia sẻ:** Tạo đường link mã hóa thiệp (URL Hash Base64), người nhận mở link trên Zalo/Messenger là thiệp bung ra pop-up đẹp mắt.
   - **Lưu thành file ảnh:** Xuất ảnh PNG độ nét cao (2.5x Retina) bằng `html2canvas` để gửi trực tiếp.

6. **Vé nhận kem điện tử (Ice Cream Pass):**
   - Sau khi tạo/chia sẻ xong, tự động hiện thông điệp vui:  
     🍦 *"Hoàn thành nhiệm vụ! Lời nhắn đã trên đường đến người bạn thương. Giờ thì đi lấy kem thôi nhé!"*
   - Đồng hồ nhảy giây thời gian thực, mã vé định danh `#ICE-2010-XXXX` kèm nút xác nhận tại quầy xe kem.

---

## 🚀 Hướng dẫn thiết lập Google Sheets (Chỉ mất 2 phút)

Để đồng bộ danh sách lời chúc và trạng thái nhận kem vào Google Sheet của HR:

1. Mở [Google Sheets](https://sheets.new) và tạo 1 file mới (ví dụ: `2010_ECard_Wishes`).
2. Trên thanh menu, chọn: **Tiện ích mở rộng (Extensions)** $\rightarrow$ **Apps Script**.
3. Xóa đoạn mã mặc định `function myFunction() {}`, mở file [`google_apps_script.js`](./google_apps_script.js) trong thư mục này, copy toàn bộ nội dung và dán vào.
4. Bấm nút **Triển khai (Deploy)** ở góc trên bên phải $\rightarrow$ Chọn **Triển khai mới (New deployment)**.
5. Cấu hình triển khai:
   - **Chọn loại:** Bấm icon bánh răng $\rightarrow$ Chọn **Ứng dụng web (Web app)**.
   - **Mô tả:** `E-Card 20/10 API`
   - **Thực thi dưới dạng (Execute as):** `Tôi (Me)`
   - **Ai có quyền truy cập (Who has access):** `Bất kỳ ai (Anyone)` *(Rất quan trọng để frontend gọi được không cần đăng nhập Google)*.
6. Bấm **Triển khai (Deploy)** và cấp quyền truy cập khi Google hỏi.
7. Copy đường link **URL ứng dụng web (Web app URL)** thu được (dạng `https://script.google.com/macros/s/AKfy.../exec`).
8. Mở file `index.html`, tìm dòng số 67 và dán URL vào:
   ```javascript
   const GOOGLE_SHEET_API_URL = "DÁN_URL_CỦA_BẠN_VÀO_ĐÂY";
   ```

---

## 🌐 Triển khai Website lên GitHub Pages (Miễn phí 100%)

Vì toàn bộ ứng dụng được đóng gói trong file `index.html` tĩnh độc lập, bạn có thể đưa lên mạng trong vòng 30 giây:

1. Push toàn bộ code lên repo GitHub:
   ```bash
   git add .
   git commit -m "feat: complete e-card web app with fingerprintjs and google sheets"
   git push origin main
   ```
2. Vào trang GitHub của repo: `https://github.com/lyquangthai1993/women-day-e-cart`.
3. Bấm vào tab **Settings** $\rightarrow$ chọn mục **Pages** ở cột menu bên trái.
4. Ở mục **Branch**, chọn branch `main` và thư mục `/ (root)` $\rightarrow$ Bấm **Save**.
5. Đợi khoảng 1 phút, GitHub sẽ cấp cho bạn một đường link HTTPS chính thức:
   `https://lyquangthai1993.github.io/women-day-e-cart/`
6. Lấy đường link này dán vào bất kỳ trang tạo mã QR nào (hoặc dùng QR Code generator) để in ấn poster/standee A3/A4 cho sự kiện 20/10!
