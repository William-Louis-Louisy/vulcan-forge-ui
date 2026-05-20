import type { LocalizedString } from './localized-content';
import { appLocales, defaultAppLocale, type AppLocale } from './locales';

export type LocalizedStringFallbackStatus =
  | 'resolved'
  | 'fallback_used'
  | 'missing';

export type LocalizedStringFallbackWarningCode =
  | 'localizedStringFallbackUsed'
  | 'localizedStringMissing';

export type LocalizedStringFallbackWarning = {
  code: LocalizedStringFallbackWarningCode;
  requestedLocale: AppLocale;
  resolvedLocale: AppLocale | null;
  fallbackLocale: AppLocale;
  missingLocales: AppLocale[];
};

export type ResolveLocalizedStringResult = {
  value: string;
  requestedLocale: AppLocale;
  resolvedLocale: AppLocale | null;
  fallbackLocale: AppLocale;
  usedFallback: boolean;
  status: LocalizedStringFallbackStatus;
  availableLocales: AppLocale[];
  missingLocales: AppLocale[];
  warning: LocalizedStringFallbackWarning | null;
};

export type ResolveLocalizedStringOptions = {
  localizedString: LocalizedString;
  locale: AppLocale;
  fallbackLocale?: AppLocale;
  missingValue?: string;
};

function hasUsableLocalizedValue(value: string | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function getAvailableLocalizedStringLocales(
  localizedString: LocalizedString,
): AppLocale[] {
  return appLocales.filter((locale) =>
    hasUsableLocalizedValue(localizedString[locale]),
  );
}

export function getMissingLocalizedStringLocales(
  localizedString: LocalizedString,
  requiredLocales: readonly AppLocale[] = appLocales,
): AppLocale[] {
  return requiredLocales.filter(
    (locale) => !hasUsableLocalizedValue(localizedString[locale]),
  );
}

export function resolveLocalizedString({
  localizedString,
  locale,
  fallbackLocale = defaultAppLocale,
  missingValue = '',
}: ResolveLocalizedStringOptions): ResolveLocalizedStringResult {
  const availableLocales = getAvailableLocalizedStringLocales(localizedString);
  const missingLocales = getMissingLocalizedStringLocales(localizedString);

  const requestedValue = localizedString[locale];

  if (hasUsableLocalizedValue(requestedValue)) {
    return {
      value: requestedValue,
      requestedLocale: locale,
      resolvedLocale: locale,
      fallbackLocale,
      usedFallback: false,
      status: 'resolved',
      availableLocales,
      missingLocales,
      warning: null,
    };
  }

  const fallbackValue = localizedString[fallbackLocale];

  if (hasUsableLocalizedValue(fallbackValue)) {
    const warning = createLocalizedStringFallbackWarning({
      code: 'localizedStringFallbackUsed',
      requestedLocale: locale,
      resolvedLocale: fallbackLocale,
      fallbackLocale,
      missingLocales,
    });

    return {
      value: fallbackValue,
      requestedLocale: locale,
      resolvedLocale: fallbackLocale,
      fallbackLocale,
      usedFallback: true,
      status: 'fallback_used',
      availableLocales,
      missingLocales,
      warning,
    };
  }

  const firstAvailableLocale = availableLocales[0];

  if (firstAvailableLocale) {
    const warning = createLocalizedStringFallbackWarning({
      code: 'localizedStringFallbackUsed',
      requestedLocale: locale,
      resolvedLocale: firstAvailableLocale,
      fallbackLocale,
      missingLocales,
    });

    return {
      value: localizedString[firstAvailableLocale] ?? missingValue,
      requestedLocale: locale,
      resolvedLocale: firstAvailableLocale,
      fallbackLocale,
      usedFallback: true,
      status: 'fallback_used',
      availableLocales,
      missingLocales,
      warning,
    };
  }

  const warning = createLocalizedStringFallbackWarning({
    code: 'localizedStringMissing',
    requestedLocale: locale,
    resolvedLocale: null,
    fallbackLocale,
    missingLocales,
  });

  return {
    value: missingValue,
    requestedLocale: locale,
    resolvedLocale: null,
    fallbackLocale,
    usedFallback: false,
    status: 'missing',
    availableLocales,
    missingLocales,
    warning,
  };
}

export function createLocalizedStringFallbackWarning({
  code,
  requestedLocale,
  resolvedLocale,
  fallbackLocale,
  missingLocales,
}: LocalizedStringFallbackWarning): LocalizedStringFallbackWarning {
  return {
    code,
    requestedLocale,
    resolvedLocale,
    fallbackLocale,
    missingLocales,
  };
}

export function collectLocalizedStringFallbackWarnings(
  resolutions: readonly ResolveLocalizedStringResult[],
): LocalizedStringFallbackWarning[] {
  return resolutions
    .map((resolution) => resolution.warning)
    .filter(
      (warning): warning is LocalizedStringFallbackWarning => warning !== null,
    );
}
