import { Language } from '../types';
import { AppConfig } from './i18n';

const STORAGE_KEY = 'user_language';
const COOKIE_NAME = 'user_lang';

/**
 * Lưu ngôn ngữ đã chọn vào cả localStorage, sessionStorage và Cookie
 */
export function saveUserLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
    sessionStorage.setItem(STORAGE_KEY, lang);
    // Lưu cookie trong 1 năm
    document.cookie = `${COOKIE_NAME}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (e) {
    console.warn('Không thể lưu cài đặt ngôn ngữ:', e);
  }
}

/**
 * Lấy ngôn ngữ đã lưu từ localStorage, sessionStorage hoặc Cookie
 */
export function getSavedUserLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Thử lấy từ sessionStorage
    const session = sessionStorage.getItem(STORAGE_KEY);
    if (session === 'vi' || session === 'en') return session;

    // 2. Thử lấy từ localStorage
    const local = localStorage.getItem(STORAGE_KEY);
    if (local === 'vi' || local === 'en') return local;

    // 3. Thử lấy từ Cookie
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
    if (match && (match[1] === 'vi' || match[1] === 'en')) {
      return match[1] as Language;
    }
  } catch (e) {
    console.warn('Không thể đọc cài đặt ngôn ngữ:', e);
  }
  return null;
}

/**
 * Lấy locale khởi tạo của ứng dụng, ưu tiên giá trị đã lưu và fallback về AppConfig.defaultLocale ('en')
 */
export function getInitialLocale(): Language {
  return getSavedUserLanguage() || AppConfig.defaultLocale;
}
