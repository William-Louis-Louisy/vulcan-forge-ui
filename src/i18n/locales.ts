import type { Locale } from './routing';

export const localeLabels = {
  en: 'English',
  fr: 'Français',
} as const satisfies Record<Locale, string>;

export const localeShortLabels = {
  en: 'EN',
  fr: 'FR',
} as const satisfies Record<Locale, string>;
