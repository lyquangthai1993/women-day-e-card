/**
 * GOOGLE APPS SCRIPT CHO HỆ THỐNG E-CARD 20/10
 * Hướng dẫn:
 * 1. Mở Google Sheets mới -> Chọn Tiện ích mở rộng (Extensions) -> Apps Script.
 * 2. Xóa code cũ, dán toàn bộ nội dung file này vào.
 * 3. Bấm Triển khai (Deploy) -> Triển khai mới (New deployment).
 * 4. Loại: Ứng dụng web (Web app).
 * 5. Thực thi dưới dạng (Execute as): "Tôi" (Me).
 * 6. Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone).
 * 7. Copy URL nhận được dán vào biến GOOGLE_SHEET_API_URL trong file index.html.
 */

const SHEET_NAME = "Wishes";

// Hàm xử lý khi Frontend gửi dữ liệu lên (POST)
function doPost(e) {
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName(SHEET_NAME);
    
    // Nếu chưa có sheet, tự động tạo và điền hàng tiêu đề
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Thời gian",
        "Mã thiết bị (Fingerprint)",
        "Người gửi",
        "Người nhận",
        "Mối quan hệ",
        "Lời chúc",
        "Trạng thái nhận kem",
        "Thời gian nhận kem"
      ]);
      // Định dạng dòng tiêu đề
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#fce7f3");
    }

    if (!e || !e.postData || !e.postData.contents) {
      return responseJSON({ status: "error", message: "Không có dữ liệu gửi lên" });
    }

    const data = JSON.parse(e.postData.contents);
    const action = data.action || "create_card";
    const visitorId = data.visitorId || "Unknown";
    const now = new Date();

    // Trường hợp 1: Người dùng xác nhận đã nhận kem tại quầy
    if (action === "claim_icecream") {
      const rows = sheet.getDataRange().getValues();
      let found = false;

      // Tìm dòng tương ứng với mã thiết bị để cập nhật trạng thái nhận kem
      for (let i = rows.length - 1; i >= 1; i--) {
        if (rows[i][1] === visitorId) {
          sheet.getRange(i + 1, 7).setValue("ĐÃ NHẬN KEM");
          sheet.getRange(i + 1, 8).setValue(now.toLocaleString("vi-VN"));
          found = true;
          break;
        }
      }

      if (!found) {
        // Nếu chưa có dòng nào của thiết bị này, thêm một dòng xác nhận nhận kem
        sheet.appendRow([
          now.toLocaleString("vi-VN"),
          visitorId,
          data.sender || "Ẩn danh",
          "",
          "",
          "Chỉ nhận kem trực tiếp",
          "ĐÃ NHẬN KEM",
          now.toLocaleString("vi-VN")
        ]);
      }

      return responseJSON({ status: "success", message: "Đã ghi nhận nhận kem thành công" });
    }

    // Trường hợp 2: Tạo thiệp mới
    sheet.appendRow([
      now.toLocaleString("vi-VN"),
      visitorId,
      data.sender || "Ẩn danh",
      data.receiver || "",
      data.relationship || "",
      data.message || "",
      "Chưa nhận kem",
      ""
    ]);

    return responseJSON({ status: "success", message: "Đã lưu thiệp thành công" });

  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

// Hàm đọc danh sách thiệp (GET) - Nếu cần hiển thị tường lời chúc hoặc thống kê
function doGet(e) {
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return responseJSON([]);
    }

    const rows = sheet.getDataRange().getValues();
    const result = [];

    for (let i = 1; i < rows.length; i++) {
      result.push({
        time: rows[i][0],
        visitorId: rows[i][1],
        sender: rows[i][2],
        receiver: rows[i][3],
        relationship: rows[i][4],
        message: rows[i][5],
        iceCreamStatus: rows[i][6],
        claimedTime: rows[i][7]
      });
    }

    return responseJSON(result.reverse());
  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
