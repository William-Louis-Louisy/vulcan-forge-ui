import type { Locale } from '@/i18n/routing';
import type { MessageObject } from './merge-messages';

export const componentGuidelineMessages = {
  en: {
    ComponentsRegistryPage: {
      editor: {
        anatomy: {
          key: 'Key',
          label: 'Label',
          requirement: 'Required',
          requirements: {
            derived: 'Derived',
            optional: 'Optional',
            required: 'Required',
          },
        },
        description:
          'Edit the localized content and contract rules for this component.',
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
        anatomy: {
          key: 'Clé',
          label: 'Label',
          requirement: 'Obligation',
          requirements: {
            derived: 'Dérivé',
            optional: 'Optionnel',
            required: 'Requis',
          },
        },
        description:
          'Modifiez le contenu localisé et les règles de contrat de ce composant.',
        localizedContent: {
          contentGuidelines: 'Règles de contenu',
          editing: 'Édition :',
          purpose: 'Objectif',
          title: 'Contenu localisé',
          usageGuidelines: 'Règles d’usage',
        },
      },
    },
  },
} satisfies Record<Locale, MessageObject>;
