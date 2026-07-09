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
        modelGaps: {
          contentGuidelines:
            'Content guidelines are available in the component contract',
          tokenBindings:
            'Visual token bindings are available in the component contract',
          usageGuidelines:
            'Usage guidelines are available in the component contract',
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
          schemaNotice:
            'Localized purpose, usage and content guidelines are persisted with this component contract.',
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
        matrixPlaceholderDescription:
          'The matrix is generated from documented variants, sizes, states and visual token bindings.',
        matrixPlaceholderTitle: 'Visual matrix',
        noTokenBindingsNotice:
          'No visual token binding is defined for this component yet.',
        state: 'State',
        title: 'Visual matrix',
      },
      states: {
        emptyDescription:
          'This design system does not contain a component contract yet.',
        emptyTitle: 'No components yet',
        errorDescription:
          'The component contracts could not be loaded. Try again to restore this workspace.',
        errorTitle: 'Unable to load components',
        loading: 'Loading component contracts…',
        retry: 'Try again',
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
        modelGaps: {
          contentGuidelines:
            'Les règles de contenu sont disponibles dans le contrat du composant',
          tokenBindings:
            'Les bindings de tokens visuels sont disponibles dans le contrat du composant',
          usageGuidelines:
            'Les règles d’usage sont disponibles dans le contrat du composant',
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
      completeness: {
        noProductWarnings:
          'Aucun avertissement de complétude détecté pour ce composant.',
        productWarningsTitle: 'Avertissements de complétude du composant',
        title: 'Avertissements de complétude',
        warningCount:
          '{count, plural, one {# avertissement} other {# avertissements}}',
        warnings: {
          missingPurpose: {
            description:
              'Ajoutez un objectif localisé afin que la documentation et les instructions IA puissent expliquer quand utiliser ce composant.',
            title: 'Objectif manquant',
          },
        },
      },
      details: {
        accessibilityRules: 'Règles d’accessibilité',
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
        basics: {
          title: 'Informations générales',
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
          schemaNotice:
            'L’objectif et les règles d’usage et de contenu localisés sont enregistrés avec ce contrat de composant.',
          title: 'Contenu localisé',
          usageGuidelines: 'Règles d’usage',
        },
        metadata: {
          title: 'Métadonnées du contrat',
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
        matrixPlaceholderDescription:
          'La matrice est générée à partir des variantes, tailles, états et bindings de tokens visuels documentés.',
        matrixPlaceholderTitle: 'Matrice visuelle',
        noTokenBindingsNotice:
          'Aucun binding de token visuel n’est encore défini pour ce composant.',
        state: 'État',
        title: 'Matrice visuelle',
      },
      list: {
        warningSummary:
          '{count, plural, one {# avertissement} other {# avertissements}}',
      },
      missingFields: {
        purpose: 'Objectif manquant',
      },
      states: {
        emptyDescription:
          'Ce design system ne contient encore aucun contrat de composant.',
        emptyTitle: 'Aucun composant pour le moment',
        errorDescription:
          'Les contrats de composants n’ont pas pu être chargés. Réessayez pour restaurer cet espace de travail.',
        errorTitle: 'Impossible de charger les composants',
        loading: 'Chargement des contrats de composants…',
        retry: 'Réessayer',
      },
    },
  },
} satisfies Record<Locale, MessageObject>;
