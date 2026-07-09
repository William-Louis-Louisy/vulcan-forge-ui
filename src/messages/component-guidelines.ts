import type { Locale } from '@/i18n/routing';
import type { MessageObject } from './merge-messages';

export const componentGuidelineMessages = {
  en: {
    ComponentsRegistryPage: {
      aiContract: {
        incomplete: {
          description:
            'Complete these fields before treating this preview as a strict implementation contract.',
          title: 'Incomplete source data',
        },
        missingSourceData: {
          contentGuidelines: 'Missing content guidelines',
          purpose: 'Missing purpose',
          sizes: 'Missing sizes',
          tokenBindings: 'Missing visual token bindings',
          usageGuidelines: 'Missing usage guidelines',
        },
        ruleLabels: {
          accessibility: 'Accessibility',
          anatomy: 'Use only anatomy parts',
          contentGuidelines: 'Content',
          forbidden: 'Never',
          purpose: 'Purpose',
          sizes: 'Use only sizes',
          states: 'Support only states',
          strictRules: 'strict rules',
          tokenBindings: 'Use only token bindings',
          usageGuidelines: 'Usage',
          variants: 'Use only variants',
        },
      },
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
          editDetails: 'Edit localized labels and descriptions',
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
          axis: 'size',
          title: 'Sizes',
        },
        states: {
          axis: 'states',
        },
        variants: {
          axis: 'intent',
        },
      },
      foundationsPreview: {
        baseState: 'Base',
        description:
          'Preview documented variants across the available component sizes.',
        eyebrow: 'Visual matrix',
        incompleteMatrixNotice:
          'This matrix uses a fallback axis because this component does not document variants or sizes yet.',
        noTokenBindingsNotice:
          'No visual token binding is defined for this component yet.',
        state: 'State',
        title: 'Visual matrix',
      },
    },
  },
  fr: {
    ComponentsRegistryPage: {
      aiContract: {
        incomplete: {
          description:
            'Complétez ces champs avant de considérer cet aperçu comme un contrat d’implémentation strict.',
          title: 'Données sources incomplètes',
        },
        missingSourceData: {
          contentGuidelines: 'Règles de contenu manquantes',
          purpose: 'Objectif manquant',
          sizes: 'Tailles manquantes',
          tokenBindings: 'Bindings de tokens visuels manquants',
          usageGuidelines: 'Règles d’usage manquantes',
        },
        ruleLabels: {
          accessibility: 'Accessibilité',
          anatomy: 'Utiliser uniquement les parties anatomiques',
          contentGuidelines: 'Contenu',
          forbidden: 'Ne jamais',
          purpose: 'Objectif',
          sizes: 'Utiliser uniquement les tailles',
          states: 'Prendre en charge uniquement les états',
          strictRules: 'règles strictes',
          tokenBindings: 'Utiliser uniquement les bindings de tokens',
          usageGuidelines: 'Usage',
          variants: 'Utiliser uniquement les variantes',
        },
      },
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
          editDetails: 'Modifier les labels et descriptions localisés',
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
          axis: 'taille',
          title: 'Tailles',
        },
        states: {
          axis: 'états',
        },
        variants: {
          axis: 'intention',
        },
      },
      foundationsPreview: {
        baseState: 'Base',
        description:
          'Prévisualisez les variantes documentées pour chaque taille disponible.',
        eyebrow: 'Matrice visuelle',
        incompleteMatrixNotice:
          'Cette matrice utilise un axe de secours car ce composant ne documente pas encore ses variantes ou ses tailles.',
        noTokenBindingsNotice:
          'Aucun binding de token visuel n’est encore défini pour ce composant.',
        state: 'État',
        title: 'Matrice visuelle',
      },
    },
  },
} satisfies Record<Locale, MessageObject>;
