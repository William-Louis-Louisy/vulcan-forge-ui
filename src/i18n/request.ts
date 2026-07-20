import { routing } from './routing';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { mergeMessages } from '@/messages/merge-messages';
import { componentGuidelineMessages } from '@/messages/component-guidelines';
import { componentPreviewMessages } from '@/messages/component-preview-messages';
import { themePreviewMessages } from '@/messages/theme-preview-messages';
import { themeEditorMessages } from '@/messages/theme-editor-messages';
import { accessibilityCenterMessages } from '@/messages/accessibility-center-messages';

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

  const baseMessages = await messagesByLocale[locale]();
  const scopedMessages = mergeMessages(
    mergeMessages(
      mergeMessages(
        mergeMessages(
          componentGuidelineMessages[locale],
          componentPreviewMessages[locale],
        ),
        themePreviewMessages[locale],
      ),
      themeEditorMessages[locale],
    ),
    accessibilityCenterMessages[locale],
  );

  return {
    locale,
    messages: mergeMessages(baseMessages, scopedMessages),
  };
});
