/**
 * Cấu hình quốc tế hoá (i18n locale) theo kiến trúc chuẩn tương tự kingshcmc-website
 */

export enum AppLocale {
  En = 'en',
  Vi = 'vi',
}

export const AppConfig = {
  name: "20/10 E-Card",
  locales: [AppLocale.En, AppLocale.Vi] as const,
  defaultLocale: AppLocale.En,
  localePrefix: 'as-needed' as const,
};

export type Locale = (typeof AppConfig.locales)[number];
