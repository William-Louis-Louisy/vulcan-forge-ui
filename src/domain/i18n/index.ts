export {
  appLocales,
  defaultAppLocale,
  fallbackAppLocale,
  isAppLocale,
} from './locales';
export type { AppLocale } from './locales';

export { hasLocalizedValue, resolveLocalizedString } from './localized-content';
export type {
  LocalizedString,
  ResolvedLocalizedString,
} from './localized-content';

export {
  appLocaleSchema,
  localizedStringSchema,
} from './localized-content.schema';
export type { LocalizedStringInput } from './localized-content.schema';
