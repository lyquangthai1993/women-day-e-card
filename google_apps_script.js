/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT FOR WOMEN'S DAY 20/10 E-CARD & REWARD MANAGEMENT
 * ==============================================================================
 * Key Features:
 * 1. Store full card details & CARD SHARE URL created by users.
 * 2. Real-time Cloud Sync for viewing cards by Card ID.
 * 3. Seamlessly updates existing card records upon edits.
 * 4. Track ice cream reward redemption status by visitor device ID or card ID.
 *
 * QUICK SETUP GUIDE IN GOOGLE SHEETS:
 * 1. Open your Google Sheet.
 * 2. In the top menu, select: Extensions > Apps Script.
 * 3. Delete any existing code in Code.gs and PASTE THIS ENTIRE SCRIPT.
 * 4. Click Save (Ctrl+S / Cmd+S).
 * 5. Click "Deploy" (top right) > "Manage deployments".
 *    - Click the Pencil icon (Edit).
 *    - In "Version", choose "New version".
 *    - Click "Deploy".
 *    - (Ensure "Who has access" is set to "Anyone").
 * 6. Done! The system will automatically use or create the "Cards" sheet.
 */

const SHEET_NAME = "Cards";

const HEADERS = [
  "Card ID",
  "Card URL",
  "Created At",
  "Updated At",
  "Sender",
  "Receiver",
  "Relationship",
  "Message",
  "Language",
  "Visitor ID",
  "Ice Cream Status",
  "Claimed Time"
];

// ==============================================================================
// 1. GET HANDLER (Read card data when recipient opens share link)
// ==============================================================================
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const cardId = (params.id || params.cardId || '').trim();
    const action = params.action || (cardId ? 'get_card' : 'ping');

    if (action === 'get_card' || cardId) {
      if (!cardId) {
        return createJsonResponse({ status: 'error', message: 'Missing card ID (cardId)' });
      }

      const sheet = getOrInitSheet();
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return createJsonResponse({ status: 'not_found', message: 'No card data found in sheet' });
      }

      const map = getHeaderIndexes(data[0]);

      // Scan from bottom to top to get the latest updated record
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

      return createJsonResponse({ status: 'not_found', message: 'Card not found with ID: ' + cardId });
    }

    // Ping check for API health
    return createJsonResponse({
      status: 'ok',
      message: 'Women Day E-Card API is running normally',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

// ==============================================================================
// 2. POST HANDLER (Save new card, Update card, Claim ice cream reward)
// ==============================================================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // 10s anti race-condition lock

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
    // Case A: Confirm ice cream redemption at counter
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
        sheet.getRange(foundRow, map.iceCreamStatus + 1).setValue("CLAIMED 🍦");
        sheet.getRange(foundRow, map.claimedTime + 1).setValue(nowStr);
      } else {
        const newRow = createEmptyRow(data[0].length);
        newRow[map.cardId] = cardId || ('c_' + Utilities.getUuid().substring(0, 8));
        newRow[map.createdAt] = nowStr;
        newRow[map.updatedAt] = nowStr;
        newRow[map.visitorId] = visitorId;
        newRow[map.sender] = payload.sender || "Anonymous";
        newRow[map.message] = "Direct counter ice cream redemption";
        newRow[map.iceCreamStatus] = "CLAIMED 🍦";
        newRow[map.claimedTime] = nowStr;
        sheet.appendRow(newRow);
      }

      return createJsonResponse({ status: 'success', message: 'Ice cream claimed successfully' });
    }

    // --------------------------------------------------------------------------
    // Case B: Create new card or update existing card
    // --------------------------------------------------------------------------
    const cardId = (payload.cardId || '').trim() || ('c_' + Utilities.getUuid().substring(0, 8));
    const defaultOrigin = "https://women-day-e-card.vercel.app";
    const cardUrl = (payload.cardUrl || '').trim() || (`${defaultOrigin}/card?id=${cardId}`);
    const visitorId = payload.visitorId || 'Anonymous';
    const sender = payload.sender || 'Anonymous';
    const receiver = payload.receiver || '';
    const relationship = payload.relationship || 'mother';
    const message = payload.message || '';
    const language = payload.language || 'vi';

    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][map.cardId]).trim() === cardId) {
        foundRow = i + 1;
        break;
      }
    }

    if (foundRow > 0) {
      // UPDATE EXISTING CARD ROW
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
      // APPEND NEW CARD ROW
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
      newRow[map.iceCreamStatus] = "Not claimed";
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
// 3. SPREADSHEET UTILITIES & FORMATTING
// ==============================================================================
function getOrInitSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // 1. Look for "Cards" first, or fallback to "Danh Sách Thiệp" or "Wishes"
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheetByName("Danh Sách Thiệp") || ss.getSheetByName("Wishes");

  if (!sheet) {
    sheet = ss.getSheets()[0];
    if (sheet && sheet.getLastRow() > 0) {
      const firstRow = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
      const firstCell = String(firstRow[0] || '').toLowerCase();
      if (!firstCell.includes("card id") && !firstCell.includes("mã thiệp")) {
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
  headerRange.setBackground("#fce7f3"); // Soft pastel pink
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
    if (s.includes("card id") || s.includes("cardid") || s.includes("mã thiệp")) map.cardId = idx;
    else if (s.includes("card url") || s.includes("url") || s.includes("link")) map.cardUrl = idx;
    else if (s.includes("updated") || s.includes("cập nhật")) map.updatedAt = idx;
    else if (s.includes("created") || s.includes("tạo")) map.createdAt = idx;
    else if (s.includes("sender") || s.includes("gửi")) map.sender = idx;
    else if (s.includes("receiver") || s.includes("recipient") || (s.includes("nhận") && !s.includes("kem"))) map.receiver = idx;
    else if (s.includes("relationship") || s.includes("quan hệ") || s.includes("mối quan hệ")) map.relationship = idx;
    else if (s.includes("message") || s.includes("wish") || s.includes("lời chúc") || s.includes("chúc")) map.message = idx;
    else if (s.includes("language") || s.includes("ngôn ngữ")) map.language = idx;
    else if (s.includes("visitor") || s.includes("device") || s.includes("fingerprint") || s.includes("thiết bị")) map.visitorId = idx;
    else if (s.includes("ice cream") || s.includes("trạng thái") || (s.includes("kem") && !s.includes("thời gian")) || s.includes("ice")) map.iceCreamStatus = idx;
    else if (s.includes("claimed") || s.includes("giờ nhận") || s.includes("thời gian nhận kem")) map.claimedTime = idx;
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
