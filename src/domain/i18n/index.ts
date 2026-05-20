export * from './locales';
export * from './localized-content.schema';
export * from './localized-content';
export {
  collectLocalizedStringFallbackWarnings,
  createLocalizedStringFallbackWarning,
  getAvailableLocalizedStringLocales,
  getMissingLocalizedStringLocales,
  resolveLocalizedString as resolveLocalizedStringWithFallback,
} from './localized-string-fallback';

export type {
  LocalizedStringFallbackStatus,
  LocalizedStringFallbackWarning,
  LocalizedStringFallbackWarningCode,
  ResolveLocalizedStringOptions,
  ResolveLocalizedStringResult,
} from './localized-string-fallback';
