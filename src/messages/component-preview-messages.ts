import type { Locale } from '@/i18n/routing';
import type { MessageObject } from './merge-messages';

export const componentPreviewMessages = {
  en: {
    ComponentsRegistryPage: {
      foundationsPreview: {
        missingStatusColorsNotice:
          'Missing semantic status colors: {paths}. The Alert matrix is using fallback colors.',
      },
      workspace: {
        canvasTitle: 'Canvas',
        canvasModes: {
          ariaLabel: 'Canvas view',
          preview: 'Preview',
          anatomy: 'Anatomy',
        },
        anatomy: {
          component: 'Component',
          flatStructure: 'Flat contract structure',
          empty: 'No anatomy parts yet.',
          selectPart: 'Select a part to edit it in the Inspector.',
          untitled: 'Untitled part',
        },
      },
    },
  },
  fr: {
    ComponentsRegistryPage: {
      foundationsPreview: {
        missingStatusColorsNotice:
          'Couleurs sémantiques de statut manquantes : {paths}. La matrice des Alert utilise des couleurs de secours.',
      },
      workspace: {
        canvasTitle: 'Canevas',
        canvasModes: {
          ariaLabel: 'Vue du canevas',
          preview: 'Aperçu',
          anatomy: 'Anatomie',
        },
        anatomy: {
          component: 'Composant',
          flatStructure: 'Structure de contrat à plat',
          empty: "Aucune partie d'anatomie pour le moment.",
          selectPart:
            "Sélectionnez une partie pour la modifier dans l'Inspector.",
          untitled: 'Partie sans titre',
        },
      },
    },
  },
} satisfies Record<Locale, MessageObject>;
