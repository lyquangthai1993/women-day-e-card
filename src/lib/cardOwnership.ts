/**
 * Quản lý quyền sở hữu thiệp (Card Ownership Guard)
 * Đảm bảo chỉ người tạo trên thiết bị mới có quyền chỉnh sửa/cập nhật thiệp gốc.
 */

const STORAGE_KEY_MY_CARDS = 'ecard_my_created_cards';

/**
 * Lấy danh sách ID các thiệp đã được tạo bởi trình duyệt này
 */
export function getMyCreatedCards(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MY_CARDS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Error reading created cards from storage:', err);
    return [];
  }
}

/**
 * Ghi nhận một thiệp mới thuộc quyền sở hữu của thiết bị này
 */
export function recordCardOwnership(cardId: string): void {
  if (typeof window === 'undefined' || !cardId) return;
  try {
    const currentList = getMyCreatedCards();
    const cleanId = cardId.trim();
    if (!currentList.includes(cleanId)) {
      currentList.push(cleanId);
      localStorage.setItem(STORAGE_KEY_MY_CARDS, JSON.stringify(currentList));
    }
  } catch (err) {
    console.warn('Error recording card ownership:', err);
  }
}

/**
 * Kiểm tra xem cardId có nằm trong danh sách thiệp đã tạo trên máy này không
 */
export function isCardOwnedLocally(cardId: string): boolean {
  if (typeof window === 'undefined' || !cardId) return false;
  const currentList = getMyCreatedCards();
  return currentList.includes(cardId.trim());
}

/**
 * Kiểm tra quyền chỉnh sửa kết hợp giữa Local Storage và Visitor ID từ Google Sheet
 */
export function canEditCard(
  cardId: string,
  currentVisitorId?: string,
  sheetVisitorId?: string
): boolean {
  if (!cardId) return false;

  // 1. Nếu đã lưu trong local storage của máy này -> Được phép
  if (isCardOwnedLocally(cardId)) {
    return true;
  }

  // 2. Nếu khớp visitorId định danh thiết bị -> Được phép và tự động đồng bộ vào local storage
  if (
    currentVisitorId &&
    sheetVisitorId &&
    currentVisitorId !== 'Anonymous' &&
    currentVisitorId !== 'fp_loading' &&
    currentVisitorId === sheetVisitorId
  ) {
    recordCardOwnership(cardId);
    return true;
  }

  return false;
}
