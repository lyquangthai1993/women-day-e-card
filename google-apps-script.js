/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT CHO HỆ THỐNG THIỆP 20/10 (E-CARD & QUẢN LÝ QUÀ KEM)
 * ==============================================================================
 * Tính năng chính:
 * 1. Ghi nhận đầy đủ thông tin thiệp & LINK XEM THIỆP mà người dùng đã tạo.
 * 2. Hỗ trợ xem lại thiệp theo Card ID theo thời gian thực (Real-time Cloud Sync).
 * 3. Tự động cập nhật nội dung vào cùng một link khi người gửi chỉnh sửa thiệp.
 * 4. Ghi nhận trạng thái đổi quà kem tại quầy theo thiết bị hoặc mã thiệp.
 *
 * HƯỚNG DẪN CÀI ĐẶT NHANH VÀO GOOGLE SHEET:
 * 1. Mở file Google Sheet của bạn.
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) > Apps Script.
 * 3. Xóa sạch toàn bộ mã cũ trong file Code.gs và DÁN TOÀN BỘ MÃ NÀY VÀO.
 * 4. Bấm biểu tượng Lưu (Save / Ctrl+S).
 * 5. Bấm nút "Triển khai" (Deploy) ở góc trên bên phải:
 *    - Chọn "Quản lý bản triển khai" (Manage deployments).
 *    - Bấm vào biểu tượng Bút chì (Chỉnh sửa / Edit).
 *    - Ở mục "Phiên bản" (Version): Chọn "Phiên bản mới" (New version).
 *    - Bấm "Triển khai" (Deploy).
 *    - (Đảm bảo mục "Ai có quyền truy cập" / "Who has access" là "Bất kỳ ai" / "Anyone").
 * 6. Xong! Hệ thống sẽ tự động tạo bảng "Danh Sách Thiệp" với đầy đủ cột Link thiệp.
 */

const SHEET_NAME = "Danh Sách Thiệp";

const HEADERS = [
  "Mã Thiệp (Card ID)",
  "Link Xem Thiệp (Card URL)",
  "Thời Gian Tạo",
  "Cập Nhật Cuối",
  "Người Gửi",
  "Người Nhận",
  "Mối Quan Hệ",
  "Lời Chúc",
  "Ngôn Ngữ",
  "Mã Thiết Bị (Visitor ID)",
  "Trạng Thái Kem",
  "Thời Gian Nhận Kem"
];

// ==============================================================================
// 1. XỬ LÝ GET (Đọc dữ liệu thiệp khi người nhận mở link)
// ==============================================================================
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const cardId = (params.id || params.cardId || '').trim();
    const action = params.action || (cardId ? 'get_card' : 'ping');

    if (action === 'get_card' || cardId) {
      if (!cardId) {
        return createJsonResponse({ status: 'error', message: 'Thiếu mã thiệp (cardId)' });
      }

      const sheet = getOrInitSheet();
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return createJsonResponse({ status: 'not_found', message: 'Chưa có dữ liệu thiệp trong bảng' });
      }

      const map = getHeaderIndexes(data[0]);

      // Dò từ dòng mới nhất lên dòng đầu tiên để lấy dữ liệu cập nhật mới nhất
      for (let i = data.length - 1; i >= 1; i--) {
        const row = data[i];
        const rowCardId = String(row[map.cardId] || '').trim();
        if (rowCardId === cardId) {
          return createJsonResponse({
            status: 'success',
            data: {
              cardId: rowCardId,
              cardUrl: String(row[map.cardUrl] || ''),
              createdAt: String(row[map.createdAt] || ''),
              updatedAt: String(row[map.updatedAt] || ''),
              sender: String(row[map.sender] || ''),
              receiver: String(row[map.receiver] || ''),
              relationship: String(row[map.relationship] || ''),
              message: String(row[map.message] || ''),
              language: String(row[map.language] || 'vi'),
              visitorId: String(row[map.visitorId] || ''),
              iceCreamStatus: String(row[map.iceCreamStatus] || ''),
              claimedTime: String(row[map.claimedTime] || '')
            }
          });
        }
      }

      return createJsonResponse({ status: 'not_found', message: 'Không tìm thấy thiệp với mã: ' + cardId });
    }

    // Ping kiểm tra tình trạng hoạt động của API
    return createJsonResponse({
      status: 'ok',
      message: 'Women Day E-Card API đang hoạt động bình thường',
      timestamp: new Date().toLocaleString('vi-VN')
    });

  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

// ==============================================================================
// 2. XỬ LÝ POST (Lưu thiệp mới, Cập nhật thiệp, Đổi quà kem)
// ==============================================================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // Khóa chống race-condition tối đa 10s

  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action || 'save_card';
    const now = new Date();
    const nowStr = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "HH:mm:ss dd/MM/yyyy");
    const sheet = getOrInitSheet();
    const data = sheet.getDataRange().getValues();
    const map = getHeaderIndexes(data[0]);

    // --------------------------------------------------------------------------
    // Trường hợp A: Xác nhận nhận kem tại quầy
    // --------------------------------------------------------------------------
    if (action === 'claim_icecream') {
      const visitorId = (payload.visitorId || '').trim();
      const cardId = (payload.cardId || '').trim();
      let foundRow = -1;

      for (let i = data.length - 1; i >= 1; i--) {
        const row = data[i];
        if ((cardId && String(row[map.cardId]).trim() === cardId) ||
            (visitorId && String(row[map.visitorId]).trim() === visitorId)) {
          foundRow = i + 1;
          break;
        }
      }

      if (foundRow > 0) {
        sheet.getRange(foundRow, map.iceCreamStatus + 1).setValue("ĐÃ NHẬN KEM 🍦");
        sheet.getRange(foundRow, map.claimedTime + 1).setValue(nowStr);
      } else {
        const newRow = createEmptyRow(data[0].length);
        newRow[map.cardId] = cardId || ('c_' + Utilities.getUuid().substring(0, 8));
        newRow[map.createdAt] = nowStr;
        newRow[map.updatedAt] = nowStr;
        newRow[map.visitorId] = visitorId;
        newRow[map.sender] = payload.sender || "Ẩn danh";
        newRow[map.message] = "Xác nhận nhận kem trực tiếp tại quầy";
        newRow[map.iceCreamStatus] = "ĐÃ NHẬN KEM 🍦";
        newRow[map.claimedTime] = nowStr;
        sheet.appendRow(newRow);
      }

      return createJsonResponse({ status: 'success', message: 'Đã xác nhận nhận kem thành công' });
    }

    // --------------------------------------------------------------------------
    // Trường hợp B: Tạo mới hoặc cập nhật thiệp (Ghi nhận link người dùng đã tạo)
    // --------------------------------------------------------------------------
    const cardId = (payload.cardId || '').trim() || ('c_' + Utilities.getUuid().substring(0, 8));
    const defaultOrigin = "https://women-day-e-card.vercel.app";
    const cardUrl = (payload.cardUrl || '').trim() || (`${defaultOrigin}/#id=${cardId}`);
    const visitorId = payload.visitorId || 'Ẩn danh';
    const sender = payload.sender || 'Ẩn danh';
    const receiver = payload.receiver || '';
    const relationship = payload.relationship || 'mother';
    const message = payload.message || '';
    const language = payload.language || 'vi';

    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][map.cardId]).trim() === cardId) {
        foundRow = i + 1; // Chỉ số dòng thực tế trên Sheet (1-indexed)
        break;
      }
    }

    if (foundRow > 0) {
      // CẬP NHẬT DÒNG THIỆP HIỆN CÓ
      sheet.getRange(foundRow, map.cardUrl + 1).setValue(cardUrl);
      sheet.getRange(foundRow, map.updatedAt + 1).setValue(nowStr);
      sheet.getRange(foundRow, map.sender + 1).setValue(sender);
      sheet.getRange(foundRow, map.receiver + 1).setValue(receiver);
      sheet.getRange(foundRow, map.relationship + 1).setValue(relationship);
      sheet.getRange(foundRow, map.message + 1).setValue(message);
      sheet.getRange(foundRow, map.language + 1).setValue(language);

      return createJsonResponse({
        status: 'success',
        action: 'updated',
        cardId: cardId,
        cardUrl: cardUrl,
        updatedAt: nowStr
      });
    } else {
      // TẠO DÒNG MỚI NẾU THIỆP CHƯA CÓ TRONG BẢNG
      const newRow = createEmptyRow(data[0].length);
      newRow[map.cardId] = cardId;
      newRow[map.cardUrl] = cardUrl;
      newRow[map.createdAt] = nowStr;
      newRow[map.updatedAt] = nowStr;
      newRow[map.sender] = sender;
      newRow[map.receiver] = receiver;
      newRow[map.relationship] = relationship;
      newRow[map.message] = message;
      newRow[map.language] = language;
      newRow[map.visitorId] = visitorId;
      newRow[map.iceCreamStatus] = "Chưa nhận kem";
      newRow[map.claimedTime] = "";

      sheet.appendRow(newRow);

      return createJsonResponse({
        status: 'success',
        action: 'created',
        cardId: cardId,
        cardUrl: cardUrl,
        createdAt: nowStr
      });
    }

  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}

// ==============================================================================
// 3. TIỆN ÍCH QUẢN LÝ BẢNG TÍNH & ĐỊNH DẠNG
// ==============================================================================
function getOrInitSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.getSheetByName("Wishes") || ss.getSheets()[0];
    if (sheet && sheet.getLastRow() > 0) {
      const firstRow = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
      const firstCell = String(firstRow[0] || '').toLowerCase();
      // Nếu sheet cũ chưa có cột Mã Thiệp
      if (!firstCell.includes("mã thiệp") && !firstCell.includes("card id")) {
        // Tạo sheet mới chuẩn hóa
        sheet = ss.insertSheet(SHEET_NAME);
      }
    } else if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    formatHeaderRow(sheet);
  }

  return sheet;
}

function formatHeaderRow(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#fce7f3"); // Hồng đào pastel
  headerRange.setFontColor("#9d174d");
  sheet.setFrozenRows(1);
  for (let c = 1; c <= HEADERS.length; c++) {
    sheet.autoResizeColumn(c);
  }
}

function getHeaderIndexes(headerRow) {
  const map = {
    cardId: 0,
    cardUrl: 1,
    createdAt: 2,
    updatedAt: 3,
    sender: 4,
    receiver: 5,
    relationship: 6,
    message: 7,
    language: 8,
    visitorId: 9,
    iceCreamStatus: 10,
    claimedTime: 11
  };

  headerRow.forEach((h, idx) => {
    const s = String(h).toLowerCase();
    if (s.includes("mã thiệp") || s.includes("card id") || s.includes("cardid")) map.cardId = idx;
    else if (s.includes("link") || s.includes("url")) map.cardUrl = idx;
    else if (s.includes("cập nhật") || s.includes("updated")) map.updatedAt = idx;
    else if (s.includes("tạo") || s.includes("created")) map.createdAt = idx;
    else if (s.includes("gửi") || s.includes("sender")) map.sender = idx;
    else if (s.includes("nhận") && !s.includes("kem")) map.receiver = idx;
    else if (s.includes("quan hệ") || s.includes("mối quan hệ") || s.includes("relationship")) map.relationship = idx;
    else if (s.includes("chúc") || s.includes("lời chúc") || s.includes("message")) map.message = idx;
    else if (s.includes("ngôn ngữ") || s.includes("language")) map.language = idx;
    else if (s.includes("thiết bị") || s.includes("visitor") || s.includes("fingerprint")) map.visitorId = idx;
    else if (s.includes("trạng thái") || s.includes("kem") || s.includes("ice")) map.iceCreamStatus = idx;
    else if (s.includes("giờ nhận") || s.includes("thời gian nhận kem") || s.includes("claimed")) map.claimedTime = idx;
  });

  return map;
}

function createEmptyRow(len) {
  const count = Math.max(len, HEADERS.length);
  const arr = new Array(count);
  for (let i = 0; i < count; i++) arr[i] = "";
  return arr;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
