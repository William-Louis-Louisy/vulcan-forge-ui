import { routing } from './routing';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { mergeMessages, type MessageObject } from '@/messages/merge-messages';
import { componentGuidelineMessages } from '@/messages/component-guidelines';
import { componentPreviewMessages } from '@/messages/component-preview-messages';
import { themePreviewMessages } from '@/messages/theme-preview-messages';
import { themeEditorMessages } from '@/messages/theme-editor-messages';
import { accessibilityCenterMessages } from '@/messages/accessibility-center-messages';
import { projectOverviewMessages } from '@/messages/project-overview-messages';
import { brandProfileMessages } from '@/messages/brand-profile-messages';
import { brandOverviewMessages } from '@/messages/brand-overview-messages';
import { brandOnboardingMessages } from '@/messages/brand-onboarding-messages';
import { projectSettingsMessages } from '@/messages/project-settings-messages';
import { publicSurfaceMessages } from '@/messages/public-surface-messages';
import { productEditorPreviewMessages } from '@/messages/product-editor-preview-messages';
import { errorSurfaceMessages } from '@/messages/error-surface-messages';
import { journeyPolishMessages } from '@/messages/journey-polish-messages';

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
  const scopedMessages = [
    componentGuidelineMessages[locale],
    componentPreviewMessages[locale],
    themePreviewMessages[locale],
    themeEditorMessages[locale],
    accessibilityCenterMessages[locale],
    projectOverviewMessages[locale],
    brandProfileMessages[locale],
    brandOverviewMessages[locale],
    brandOnboardingMessages[locale],
    projectSettingsMessages[locale],
    publicSurfaceMessages[locale],
    productEditorPreviewMessages[locale],
    errorSurfaceMessages[locale],
    journeyPolishMessages[locale],
  ].reduce<MessageObject>(mergeMessages, {});

  return {
    locale,
    messages: mergeMessages(baseMessages, scopedMessages),
  };
});
