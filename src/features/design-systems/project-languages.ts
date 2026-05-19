import type { AppLocale } from '@/domain/i18n';

export const projectLanguageOptions = [
  {
    value: 'en',
    labelKey: 'en',
  },
  {
    value: 'fr',
    labelKey: 'fr',
  },
] as const satisfies readonly {
  value: AppLocale;
  labelKey: AppLocale;
}[];

export type ProjectLanguageOption = (typeof projectLanguageOptions)[number];

export function ensureDefaultLocaleIsSupported({
  defaultLocale,
  supportedLocales,
}: {
  defaultLocale: AppLocale;
  supportedLocales: AppLocale[];
}): AppLocale[] {
  const uniqueLocales = Array.from(new Set(supportedLocales));

  if (uniqueLocales.includes(defaultLocale)) {
    return uniqueLocales;
  }

  return [defaultLocale, ...uniqueLocales];
}

export function toggleSupportedLocale({
  locale,
  defaultLocale,
  supportedLocales,
}: {
  locale: AppLocale;
  defaultLocale: AppLocale;
  supportedLocales: AppLocale[];
}): AppLocale[] {
  if (locale === defaultLocale) {
    return ensureDefaultLocaleIsSupported({
      defaultLocale,
      supportedLocales,
    });
  }

  const nextLocales = supportedLocales.includes(locale)
    ? supportedLocales.filter((supportedLocale) => supportedLocale !== locale)
    : [...supportedLocales, locale];

  return ensureDefaultLocaleIsSupported({
    defaultLocale,
    supportedLocales: nextLocales,
  });
}

export function updateDefaultLocale({
  defaultLocale,
  supportedLocales,
}: {
  defaultLocale: AppLocale;
  supportedLocales: AppLocale[];
}): {
  defaultLocale: AppLocale;
  supportedLocales: AppLocale[];
} {
  return {
    defaultLocale,
    supportedLocales: ensureDefaultLocaleIsSupported({
      defaultLocale,
      supportedLocales,
    }),
  };
}
