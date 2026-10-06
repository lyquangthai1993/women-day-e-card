import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

export enum AppLocale {
  En = 'en',
  Vi = 'vi',
}

export const AppConfig = {
  name: "20/10 E-Card",
  locales: [AppLocale.En, AppLocale.Vi] as const,
  defaultLocale: AppLocale.En,
  localePrefix,
};

export type Locale = (typeof AppConfig.locales)[number];
