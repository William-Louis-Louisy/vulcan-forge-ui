export const appLocales = ['en', 'fr'] as const;

export type AppLocale = (typeof appLocales)[number];

export const defaultAppLocale = 'en' satisfies AppLocale;

export const fallbackAppLocale = 'en' satisfies AppLocale;

export function isAppLocale(value: string): value is AppLocale {
  return appLocales.includes(value as AppLocale);
}
