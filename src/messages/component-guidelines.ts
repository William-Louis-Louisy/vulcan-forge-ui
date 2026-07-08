import type { Locale } from '@/i18n/routing';
import type { MessageObject } from './merge-messages';

export const componentGuidelineMessages = {
  en: {
    ComponentsRegistryPage: {
      editor: {
        localizedContent: {
          contentGuidelines: 'Content guidelines',
          purpose: 'Purpose',
          usageGuidelines: 'Usage guidelines',
        },
      },
    },
  },
  fr: {
    ComponentsRegistryPage: {
      editor: {
        localizedContent: {
          contentGuidelines: 'Règles de contenu',
          purpose: 'Objectif',
          usageGuidelines: 'Règles d’usage',
        },
      },
    },
  },
} satisfies Record<Locale, MessageObject>;
