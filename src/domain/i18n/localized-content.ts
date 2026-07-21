import type { AppLocale } from './locales';

export type LocalizedString = Partial<
  Record<AppLocale, string | undefined>
>;

export type ResolvedLocalizedString = {
  value: string;
  locale: AppLocale;
  requestedLocale: AppLocale;
  fallbackUsed: boolean;
  missing: boolean;
};

export function resolveLocalizedString({
  value,
  locale,
  fallbackLocale,
}: {
  value: LocalizedString;
  locale: AppLocale;
  fallbackLocale?: AppLocale;
}): ResolvedLocalizedString {
  const effectiveFallbackLocale = fallbackLocale ?? 'en';

  const localizedValue = value[locale];

  if (localizedValue && localizedValue.trim().length > 0) {
    return {
      value: localizedValue,
      locale,
      requestedLocale: locale,
      fallbackUsed: false,
      missing: false,
    };
  }

  const fallbackValue = value[effectiveFallbackLocale];

  if (fallbackValue && fallbackValue.trim().length > 0) {
    return {
      value: fallbackValue,
      locale: effectiveFallbackLocale,
      requestedLocale: locale,
      fallbackUsed: true,
      missing: false,
    };
  }

  return {
    value: '',
    locale: effectiveFallbackLocale,
    requestedLocale: locale,
    fallbackUsed: true,
    missing: true,
  };
}

export function hasLocalizedValue(
  value: LocalizedString,
  locale: AppLocale,
): boolean {
  return Boolean(value[locale]?.trim());
}
