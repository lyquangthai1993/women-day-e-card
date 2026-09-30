/**
 * GOOGLE APPS SCRIPT CHO WOMEN'S DAY E-CARD
 * Hỗ trợ lưu trữ, đọc và cập nhật thiệp trực tuyến thời gian thực (Real-time CRUD)
 * 
 * Hướng dẫn cài đặt vào Google Sheet:
 * 1. Mở Google Sheet của bạn.
 * 2. Chọn menu: Tiện ích mở rộng (Extensions) > Apps Script.
 * 3. Xóa mã cũ trong file Code.gs và dán toàn bộ đoạn mã bên dưới vào.
 * 4. Bấm "Triển khai" (Deploy) > "Quản lý bản triển khai" (Manage deployments) > Bấm icon Bút chì (Edit) > Chọn "Phiên bản mới" (New version) > Bấm "Triển khai" (Deploy).
 *    (Lưu ý: Quyền truy cập - Who has access: Chọn "Bất kỳ ai" - Anyone).
 */

const SHEET_NAME_CARDS = "Cards";
const SHEET_NAME_VOUCHERS = "IceCream_Vouchers";

function getOrCreateSheet(sheetName, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#fdf2f8");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'ping';
  
  if (action === 'get_card') {
    const cardId = (e.parameter.id || e.parameter.cardId || '').trim();
    if (!cardId) {
      return jsonResponse({ status: 'error', message: 'Missing cardId' });
    }
    
    const sheet = getOrCreateSheet(SHEET_NAME_CARDS, [
      "Card ID", "Created At", "Updated At", "Visitor ID", "Sender", "Receiver", "Relationship", "Message", "Language"
    ]);
    
    const data = sheet.getDataRange().getValues();
    // Dò từ dòng 2 (bỏ qua dòng tiêu đề)
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === cardId) {
        return jsonResponse({
          status: 'success',
          data: {
            cardId: data[i][0],
            createdAt: data[i][1],
            updatedAt: data[i][2],
            visitorId: data[i][3],
            sender: data[i][4],
            receiver: data[i][5],
            relationship: data[i][6],
            message: data[i][7],
            language: data[i][8] || 'vi'
          }
        });
      }
    }
    return jsonResponse({ status: 'not_found', message: 'Card not found' });
  }
  
  return jsonResponse({
    status: 'ok',
    message: 'Women Day E-Card API is live',
    timestamp: new Date().toISOString()
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  // Khóa tối đa 10 giây để chống race-condition khi nhiều người lưu cùng lúc
  lock.tryLock(10000);
  
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
    const now = new Date().toISOString();
    
    // 1. LƯU HOẶC CẬP NHẬT THIỆP (SAVE / UPDATE CARD)
    if (action === 'save_card' || action === 'create_card' || action === 'update_card') {
      const cardId = (payload.cardId || '').trim() || ('c_' + Utilities.getUuid().substring(0, 8));
      const visitorId = payload.visitorId || 'anonymous';
      const sender = payload.sender || '';
      const receiver = payload.receiver || '';
      const relationship = payload.relationship || 'mother';
      const message = payload.message || '';
      const language = payload.language || 'vi';
      
      const sheet = getOrCreateSheet(SHEET_NAME_CARDS, [
        "Card ID", "Created At", "Updated At", "Visitor ID", "Sender", "Receiver", "Relationship", "Message", "Language"
      ]);
      
      const data = sheet.getDataRange().getValues();
      let foundRow = -1;
      
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim() === cardId) {
          foundRow = i + 1; // Chỉ số dòng trong Google Sheet (1-indexed)
          break;
        }
      }
      
      if (foundRow > 0) {
        // CẬP NHẬT DÒNG THIỆP HIỆN CÓ
        sheet.getRange(foundRow, 3).setValue(now); // Cột 3: Updated At
        sheet.getRange(foundRow, 5).setValue(sender); // Cột 5: Sender
        sheet.getRange(foundRow, 6).setValue(receiver); // Cột 6: Receiver
        sheet.getRange(foundRow, 7).setValue(relationship); // Cột 7: Relationship
        sheet.getRange(foundRow, 8).setValue(message); // Cột 8: Message
        sheet.getRange(foundRow, 9).setValue(language); // Cột 9: Language
        
        return jsonResponse({
          status: 'success',
          action: 'updated',
          cardId: cardId,
          updatedAt: now
        });
      } else {
        // TẠO DÒNG MỚI NẾU CARD ID CHƯA TỒN TẠI
        sheet.appendRow([
          cardId,
          now, // Created At
          now, // Updated At
          visitorId,
          sender,
          receiver,
          relationship,
          message,
          language
        ]);
        
        return jsonResponse({
          status: 'success',
          action: 'created',
          cardId: cardId,
          createdAt: now
        });
      }
    }
    
    // 2. NHẬN KEM (CLAIM ICE CREAM VOUCHER)
    if (action === 'claim_icecream') {
      const visitorId = payload.visitorId || 'anonymous';
      const sheet = getOrCreateSheet(SHEET_NAME_VOUCHERS, [
        "Visitor ID", "Claimed Status", "Claimed Time"
      ]);
      
      sheet.appendRow([
        visitorId,
        "CLAIMED",
        now
      ]);
      
      return jsonResponse({
        status: 'success',
        action: 'voucher_claimed',
        visitorId: visitorId,
        timestamp: now
      });
    }
    
    return jsonResponse({ status: 'ignored', message: 'Unknown action' });
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
