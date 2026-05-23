import type { TokenRowData } from './tokens-editor.utils';
import {
  resolveLocalizedStringWithFallback,
  type AppLocale,
} from '@/domain/i18n';

type ResolvableLocalizedString = Parameters<
  typeof resolveLocalizedStringWithFallback
>[0]['localizedString'];

function toResolvableLocalizedString(
  localizedString: NonNullable<TokenRowData['description']>,
): ResolvableLocalizedString {
  const normalizedLocalizedString: ResolvableLocalizedString = {};

  if (localizedString.en) {
    normalizedLocalizedString.en = localizedString.en;
  }

  if (localizedString.fr) {
    normalizedLocalizedString.fr = localizedString.fr;
  }

  return normalizedLocalizedString;
}

export function getTokenDocumentationDescription({
  row,
  locale,
}: {
  row: TokenRowData;
  locale: AppLocale;
}) {
  if (!row.description) {
    return '';
  }

  return resolveLocalizedStringWithFallback({
    localizedString: toResolvableLocalizedString(row.description),
    locale,
  }).value;
}
