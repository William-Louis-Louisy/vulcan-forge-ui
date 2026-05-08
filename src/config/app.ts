export const appConfig = {
  name: 'VulcanForgeUI',
  technicalName: 'vulcan-forge-ui',
  description:
    'Create accessible, bilingual, AI-ready design systems for web and mobile products.',
  defaultLocale: 'en',
  supportedLocales: ['en', 'fr'],
} as const;

export type AppLocale = (typeof appConfig.supportedLocales)[number];
