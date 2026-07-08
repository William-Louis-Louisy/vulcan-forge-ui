import type { Locale } from '@/i18n/routing';
import type { MessageObject } from './merge-messages';

export const componentGuidelineMessages = {
  en: {
    ComponentsRegistryPage: {
      editor: {
        accessibility: {
          title: 'Accessibility contract',
        },
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
        collections: {
          title: 'Variants & states',
        },
        description:
          'Edit the localized content and contract rules for this component.',
        localizedContent: {
          contentGuidelines: 'Content guidelines',
          purpose: 'Purpose',
          usageGuidelines: 'Usage guidelines',
        },
        sizes: {
          add: 'Add size',
          title: 'Sizes',
        },
      },
    },
  },
  fr: {
    ComponentsRegistryPage: {
      editor: {
        accessibility: {
          title: 'Contrat d’accessibilité',
        },
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
        collections: {
          title: 'Variantes et états',
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
        sizes: {
          add: 'Ajouter une taille',
          title: 'Tailles',
        },
      },
    },
  },
} satisfies Record<Locale, MessageObject>;
