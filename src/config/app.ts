import {
  appLocales,
  defaultAppLocale,
  type AppLocale,
} from '@/domain/i18n/locales';

export const appConfig = {
  name: 'VulcanForgeUI',
  technicalName: 'vulcan-forge-ui',
  description:
    'Create accessible, bilingual, AI-ready design systems for web and mobile products.',
  defaultLocale: defaultAppLocale,
  supportedLocales: appLocales,
} as const;

export type { AppLocale };
