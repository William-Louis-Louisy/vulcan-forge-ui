import type { Locale } from '@/i18n/routing';

const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;
const ENCODED_PATH_SEPARATOR_PATTERN = /%(?:2f|5c)/i;

export function getDefaultAuthReturnTo(locale: Locale) {
  return `/${locale}/app`;
}

export function getSafeAuthReturnTo({
  locale,
  returnTo,
}: {
  locale: Locale;
  returnTo: string | null | undefined;
}) {
  const fallback = getDefaultAuthReturnTo(locale);

  if (!returnTo || returnTo.length > 2_048) {
    return fallback;
  }

  if (
    CONTROL_CHARACTER_PATTERN.test(returnTo) ||
    ENCODED_PATH_SEPARATOR_PATTERN.test(returnTo) ||
    returnTo.includes('\\') ||
    !returnTo.startsWith('/') ||
    returnTo.startsWith('//')
  ) {
    return fallback;
  }

  let parsed: URL;

  try {
    parsed = new URL(returnTo, 'https://vulcanforge.invalid');
  } catch {
    return fallback;
  }

  if (parsed.origin !== 'https://vulcanforge.invalid') {
    return fallback;
  }

  const applicationRoot = `/${locale}/app`;
  const isApplicationPath =
    parsed.pathname === applicationRoot ||
    parsed.pathname.startsWith(`${applicationRoot}/`);

  if (!isApplicationPath || parsed.hash) {
    return fallback;
  }

  return `${parsed.pathname}${parsed.search}`;
}

export function getLocalizedAuthReturnTo({
  currentLocale,
  nextLocale,
  returnTo,
}: {
  currentLocale: Locale;
  nextLocale: Locale;
  returnTo: string | null | undefined;
}) {
  const safeCurrentReturnTo = getSafeAuthReturnTo({
    locale: currentLocale,
    returnTo,
  });
  const currentPrefix = `/${currentLocale}`;
  const localizedReturnTo = `/${nextLocale}${safeCurrentReturnTo.slice(
    currentPrefix.length,
  )}`;

  return getSafeAuthReturnTo({
    locale: nextLocale,
    returnTo: localizedReturnTo,
  });
}
