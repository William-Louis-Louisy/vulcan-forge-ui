import { defineRouting } from 'next-intl/routing';
import { appLocales, defaultAppLocale } from '@/domain/i18n/locales';

export const routing = defineRouting({
  locales: appLocales,
  defaultLocale: defaultAppLocale,
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
