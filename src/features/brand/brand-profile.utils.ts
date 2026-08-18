import type {
  BrandProfile,
  BrandProfileLocalizedContent,
} from '@/domain/design-system';
export {
  defaultBrandProfile,
  parseStoredBrandProfile,
} from '@/domain/design-system';
import {
  getMissingLocalizedStringLocales,
  resolveLocalizedStringWithFallback,
  type AppLocale,
  type LocalizedString,
} from '@/domain/i18n';

export const brandLocalizedFieldKeys = [
  'tagline',
  'shortDescription',
  'personality',
  'audience',
  'toneOfVoice',
] as const;

export type BrandLocalizedFieldKey = (typeof brandLocalizedFieldKeys)[number];

export function resolveBrandLocalizedField({
  profile,
  field,
  locale,
  fallbackLocale,
}: {
  profile: BrandProfile;
  field: BrandLocalizedFieldKey;
  locale: AppLocale;
  fallbackLocale: AppLocale;
}) {
  return resolveLocalizedStringWithFallback({
    localizedString: profile.localizedContent[field] ?? {},
    locale,
    fallbackLocale,
  });
}

export function countMissingBrandTranslations({
  profile,
  supportedLocales,
}: {
  profile: BrandProfile;
  supportedLocales: readonly AppLocale[];
}) {
  return collectBrandLocalizedStrings(profile.localizedContent).reduce(
    (count, localizedString) =>
      count +
      getMissingLocalizedStringLocales(localizedString, supportedLocales)
        .length,
    0,
  );
}

export function collectBrandLocalizedStrings(
  content: BrandProfileLocalizedContent,
): LocalizedString[] {
  const fields = brandLocalizedFieldKeys
    .map((field) => content[field])
    .filter((value): value is LocalizedString => Boolean(value));
  const terminology = content.terminology.flatMap((entry) => [
    entry.preferred,
    ...entry.avoid,
  ]);

  return [...fields, ...terminology, ...content.editorialRules];
}

export function createLocalizedValue(
  value: Partial<Record<AppLocale, string>>,
): LocalizedString | undefined {
  const normalized: Partial<Record<AppLocale, string>> = {};

  for (const locale of ['en', 'fr'] as const) {
    const localizedValue = value[locale]?.trim();

    if (localizedValue) {
      normalized[locale] = localizedValue;
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}
