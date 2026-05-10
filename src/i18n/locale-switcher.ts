import { routing, type Locale } from './routing';
import { localeLabels, localeShortLabels } from './locales';

export type LocaleSwitcherOption = {
  locale: Locale;
  label: string;
  shortLabel: string;
  isActive: boolean;
};

export function getLocaleSwitcherOptions(
  currentLocale: Locale,
): LocaleSwitcherOption[] {
  return routing.locales.map((locale) => ({
    locale,
    label: localeLabels[locale],
    shortLabel: localeShortLabels[locale],
    isActive: locale === currentLocale,
  }));
}
