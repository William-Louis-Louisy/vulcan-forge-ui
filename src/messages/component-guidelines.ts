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
        delete: {
          ariaLabel: 'Delete {name}',
          cancel: 'Cancel',
          description:
            'Delete {name} and its full component contract. This action cannot be undone.',
          errors: {
            componentAlreadyExists: 'This component already exists.',
            componentNotFound: 'This component no longer exists.',
            invalidPayload: 'The deletion request is invalid.',
            projectNotFound: 'The design system could not be found.',
            unauthorized: 'You must be signed in to delete this component.',
            unexpected: 'Unable to delete this component. Try again.',
          },
          submit: 'Delete component',
          submitting: 'Deleting…',
          title: 'Delete component?',
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
        visualTokens: {
          description:
            'Map design system tokens to the supported preview roles: background, foreground, border, radius, padding, paddingX, paddingY, duration or motion.',
          tokenTypes: {
            color: 'Color',
            spacing: 'Spacing',
            radius: 'Radius',
            typography: 'Typography',
            motion: 'Motion',
          },
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
      list: {
        create: {
          ariaLabel: 'Add a component',
          cancel: 'Cancel',
          description:
            'Choose one of the component types that is not yet part of this design system.',
          errors: {
            componentAlreadyExists:
              'This component type already exists in the design system.',
            componentNotFound: 'The component template could not be found.',
            invalidPayload: 'Choose a valid component type.',
            projectNotFound: 'The design system could not be found.',
            unauthorized: 'You must be signed in to add a component.',
            unexpected: 'Unable to add this component. Try again.',
          },
          submit: 'Add component',
          submitting: 'Adding…',
          title: 'Add a component',
          type: 'Component type',
          unavailable: 'All supported component types are already present.',
        },
        filterSubmit: 'Filter components',
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
        delete: {
          ariaLabel: 'Supprimer {name}',
          cancel: 'Annuler',
          description:
            'Supprimez {name} et l’intégralité de son contrat de composant. Cette action est irréversible.',
          errors: {
            componentAlreadyExists: 'Ce composant existe déjà.',
            componentNotFound: 'Ce composant n’existe plus.',
            invalidPayload: 'La demande de suppression est invalide.',
            projectNotFound: 'Le design system est introuvable.',
            unauthorized:
              'Vous devez être connecté pour supprimer ce composant.',
            unexpected:
              'Impossible de supprimer ce composant. Veuillez réessayer.',
          },
          submit: 'Supprimer le composant',
          submitting: 'Suppression…',
          title: 'Supprimer le composant ?',
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
        visualTokens: {
          description:
            'Associez les tokens du design system aux rôles de preview pris en charge : background, foreground, border, radius, padding, paddingX, paddingY, duration ou motion.',
          tokenTypes: {
            color: 'Couleur',
            spacing: 'Espacement',
            radius: 'Rayon',
            typography: 'Typographie',
            motion: 'Mouvement',
          },
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
        create: {
          ariaLabel: 'Ajouter un composant',
          cancel: 'Annuler',
          description:
            'Choisissez un type de composant qui ne fait pas encore partie de ce design system.',
          errors: {
            componentAlreadyExists:
              'Ce type de composant existe déjà dans le design system.',
            componentNotFound: 'Le modèle de composant est introuvable.',
            invalidPayload: 'Choisissez un type de composant valide.',
            projectNotFound: 'Le design system est introuvable.',
            unauthorized: 'Vous devez être connecté pour ajouter un composant.',
            unexpected:
              'Impossible d’ajouter ce composant. Veuillez réessayer.',
          },
          submit: 'Ajouter le composant',
          submitting: 'Ajout…',
          title: 'Ajouter un composant',
          type: 'Type de composant',
          unavailable:
            'Tous les types de composants pris en charge sont déjà présents.',
        },
        filterSubmit: 'Filtrer les composants',
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
