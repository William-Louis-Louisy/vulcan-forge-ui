import type { Locale } from '@/i18n/routing';
import type { MessageObject } from './merge-messages';

export const componentPreviewMessages = {
  en: {
    ComponentsRegistryPage: {
      foundationsPreview: {
        missingStatusColorsNotice:
          'Missing semantic status colors: {paths}. The Alert matrix is using fallback colors.',
      },
    },
  },
  fr: {
    ComponentsRegistryPage: {
      foundationsPreview: {
        missingStatusColorsNotice:
          'Couleurs sémantiques de statut manquantes : {paths}. La matrice des Alert utilise des couleurs de secours.',
      },
    },
  },
} satisfies Record<Locale, MessageObject>;
