import { routing } from './routing';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

const messagesByLocale = {
  en: () => import('../messages/en.json').then((module) => module.default),
  fr: () => import('../messages/fr.json').then((module) => module.default),
} satisfies Record<
  (typeof routing.locales)[number],
  () => Promise<Record<string, unknown>>
>;

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: await messagesByLocale[locale](),
  };
});
