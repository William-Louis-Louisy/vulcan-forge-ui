export const examplesPageMessages = {
  en: {
    ExamplesPage: {
      hero: {
        eyebrow: 'Illustrative product example',
        titleBefore: 'See a design system move from',
        titleAccent: 'source decisions',
        titleAfter: 'to implementation-ready output.',
        description:
          'Aurora System shows how tokens, theme roles, component contracts, accessibility checks and exports stay connected inside one VulcanForge UI project.',
        disclosure:
          'Aurora System is a fictional product example created for this walkthrough. It is not customer data or a customer case study.',
        primaryCta: 'Create your own system',
        dashboardCta: 'Open dashboard',
        secondaryCta: 'Explore the workflow',
      },
      workflow: {
        eyebrow: 'End-to-end workflow',
        title: 'One project, five connected layers.',
        description:
          'The example follows the same product model from authored values to implementation assets, without turning each step into a separate source of truth.',
        items: {
          tokens: {
            title: 'Tokens',
            description:
              'Define reusable color decisions and keep paths, values and intent together.',
          },
          themes: {
            title: 'Themes',
            description:
              'Map semantic roles per mode, including project-specific roles such as border-subtle.',
          },
          components: {
            title: 'Components',
            description:
              'Document anatomy, variants, states, token bindings and accessibility expectations.',
          },
          accessibility: {
            title: 'Accessibility',
            description:
              'Evaluate resolved contrast pairs and keep automated findings separate from manual review.',
          },
          exports: {
            title: 'Exports',
            description:
              'Generate implementation formats and AI guidance from the same structured project.',
          },
        },
      },
      model: {
        eyebrow: 'Structured source',
        title: 'Decisions remain readable before they become code.',
        description:
          'Aurora keeps the authored token layer explicit, then maps those decisions into theme roles. The values below mirror the illustrative editor preview used across the public product surface.',
        tokensTitle: 'Color tokens',
        tokensDescription: 'A small excerpt from the example token set.',
        tokenKinds: {
          primitive: 'Primitive',
          semantic: 'Semantic',
        },
        tokenPurposes: {
          background: 'Application background',
          surface: 'Primary surfaces',
          content: 'Primary content',
          accent: 'Brand accent',
          border: 'Subtle separators',
        },
        rolesTitle: 'Theme role mapping',
        rolesDescription:
          'The Light theme references authored tokens instead of duplicating raw values.',
        customRoleLabel: 'Custom role',
      },
      contracts: {
        eyebrow: 'Component contracts',
        title: 'A component is more than a screenshot.',
        description:
          'The example records the implementation decisions an engineer or AI agent needs to reuse the component without inventing a parallel system.',
        labels: {
          variants: 'Variants',
          states: 'States',
          bindings: 'Token bindings',
          accessibility: 'Accessibility',
        },
        items: {
          button: {
            title: 'Button',
            purpose: 'Primary interactive action with explicit visual states.',
            accessibility: 'keyboard · visible focus · disabled state',
            previewPrimary: 'Primary action',
            previewSecondary: 'Secondary',
          },
          alert: {
            title: 'Alert',
            purpose: 'Status feedback tied to semantic status colors.',
            accessibility:
              'semantic tone · readable content · no color-only meaning',
            previewStatus: 'Success',
            previewMessage: 'Export completed with the current project source.',
          },
        },
      },
      accessibility: {
        eyebrow: 'Accessibility as source data',
        title: 'Checks stay attached to the decisions that created them.',
        description:
          'VulcanForge UI evaluates what can be derived from the structured project while keeping manual accessibility responsibilities explicit.',
        checks: {
          contrast: {
            title: 'Resolved contrast pairs',
            description:
              'Theme foreground and background roles are evaluated from their resolved color values.',
          },
          focus: {
            title: 'Interactive state coverage',
            description:
              'Contracts can make focusVisible and other expected component states explicit.',
          },
          manual: {
            title: 'Manual review remains visible',
            description:
              'Automated checks do not pretend to replace keyboard, screen-reader or contextual review.',
          },
        },
        disclosure:
          'This public walkthrough demonstrates the workflow; it is not presenting a persisted customer accessibility report.',
      },
      delivery: {
        eyebrow: 'Delivery',
        title: 'One source, six implementation outputs.',
        description:
          'Aurora can leave the product in the formats already available during the beta, with documentation and AI instructions generated beside code-oriented exports.',
        formatLabels: {
          css: 'CSS variables',
          tailwind: 'Tailwind v4',
          typescript: 'TypeScript',
          reactNative: 'React Native',
          markdown: 'Markdown docs',
          aiInstructions: 'AI instructions',
        },
      },
      finalCta: {
        title: 'Build the version that belongs to your product.',
        description:
          'Start from your own tokens and decisions. The beta is free and billing is not enabled.',
        cta: 'Start a design system',
        dashboardCta: 'Open dashboard',
      },
    },
  },
  fr: {
    ExamplesPage: {
      hero: {
        eyebrow: 'Exemple produit illustratif',
        titleBefore: 'Voyez un design system passer de',
        titleAccent: 'décisions sources',
        titleAfter: 'à des livrables prêts à implémenter.',
        description:
          'Aurora System montre comment les tokens, les rôles de thème, les contrats de composants, les contrôles d’accessibilité et les exports restent reliés dans un seul projet VulcanForge UI.',
        disclosure:
          'Aurora System est un exemple produit fictif créé pour cette démonstration. Il ne s’agit ni de données client ni d’une étude de cas client.',
        primaryCta: 'Créer votre propre système',
        dashboardCta: 'Ouvrir le tableau de bord',
        secondaryCta: 'Explorer le workflow',
      },
      workflow: {
        eyebrow: 'Workflow de bout en bout',
        title: 'Un projet, cinq couches connectées.',
        description:
          'L’exemple suit le même modèle produit depuis les valeurs créées jusqu’aux ressources d’implémentation, sans transformer chaque étape en une nouvelle source de vérité.',
        items: {
          tokens: {
            title: 'Tokens',
            description:
              'Définissez des décisions couleur réutilisables et conservez chemins, valeurs et intention ensemble.',
          },
          themes: {
            title: 'Thèmes',
            description:
              'Mappez les rôles sémantiques par mode, y compris des rôles propres au projet comme border-subtle.',
          },
          components: {
            title: 'Composants',
            description:
              'Documentez anatomie, variantes, états, bindings de tokens et attentes d’accessibilité.',
          },
          accessibility: {
            title: 'Accessibilité',
            description:
              'Évaluez les contrastes résolus et distinguez les constats automatisés de la revue manuelle.',
          },
          exports: {
            title: 'Exports',
            description:
              'Générez des formats d’implémentation et des consignes IA depuis le même projet structuré.',
          },
        },
      },
      model: {
        eyebrow: 'Source structurée',
        title: 'Les décisions restent lisibles avant de devenir du code.',
        description:
          'Aurora garde la couche de tokens explicite puis mappe ces décisions vers les rôles de thème. Les valeurs ci-dessous reprennent l’aperçu illustratif de l’éditeur utilisé sur la surface publique du produit.',
        tokensTitle: 'Tokens couleur',
        tokensDescription: 'Un petit extrait du jeu de tokens de l’exemple.',
        tokenKinds: {
          primitive: 'Primitive',
          semantic: 'Sémantique',
        },
        tokenPurposes: {
          background: 'Arrière-plan de l’application',
          surface: 'Surfaces principales',
          content: 'Contenu principal',
          accent: 'Accent de marque',
          border: 'Séparateurs discrets',
        },
        rolesTitle: 'Mapping des rôles du thème',
        rolesDescription:
          'Le thème Light référence les tokens créés au lieu de dupliquer leurs valeurs brutes.',
        customRoleLabel: 'Rôle personnalisé',
      },
      contracts: {
        eyebrow: 'Contrats de composants',
        title: 'Un composant est plus qu’une capture d’écran.',
        description:
          'L’exemple enregistre les décisions d’implémentation dont un développeur ou un agent IA a besoin pour réutiliser le composant sans inventer un système parallèle.',
        labels: {
          variants: 'Variantes',
          states: 'États',
          bindings: 'Bindings de tokens',
          accessibility: 'Accessibilité',
        },
        items: {
          button: {
            title: 'Button',
            purpose:
              'Action interactive principale avec des états visuels explicites.',
            accessibility: 'clavier · focus visible · état disabled',
            previewPrimary: 'Action principale',
            previewSecondary: 'Secondaire',
          },
          alert: {
            title: 'Alert',
            purpose:
              'Retour de statut relié aux couleurs sémantiques de statut.',
            accessibility:
              'ton sémantique · contenu lisible · aucune information transmise uniquement par la couleur',
            previewStatus: 'Succès',
            previewMessage: 'Export terminé avec la source actuelle du projet.',
          },
        },
      },
      accessibility: {
        eyebrow: 'L’accessibilité comme donnée source',
        title: 'Les contrôles restent liés aux décisions qui les ont produits.',
        description:
          'VulcanForge UI évalue ce qui peut être déduit du projet structuré tout en laissant explicites les responsabilités d’accessibilité qui nécessitent une revue humaine.',
        checks: {
          contrast: {
            title: 'Paires de contraste résolues',
            description:
              'Les rôles de premier plan et d’arrière-plan du thème sont évalués depuis leurs valeurs couleur résolues.',
          },
          focus: {
            title: 'Couverture des états interactifs',
            description:
              'Les contrats peuvent rendre explicites focusVisible et les autres états attendus des composants.',
          },
          manual: {
            title: 'La revue manuelle reste visible',
            description:
              'Les contrôles automatisés ne prétendent pas remplacer les tests clavier, lecteur d’écran ou contextuels.',
          },
        },
        disclosure:
          'Cette démonstration publique illustre le workflow ; elle ne présente pas le rapport d’accessibilité persistant d’un client.',
      },
      delivery: {
        eyebrow: 'Livraison',
        title: 'Une source, six sorties d’implémentation.',
        description:
          'Aurora peut sortir du produit dans les formats déjà disponibles pendant la bêta, avec documentation et instructions IA aux côtés des exports orientés code.',
        formatLabels: {
          css: 'Variables CSS',
          tailwind: 'Tailwind v4',
          typescript: 'TypeScript',
          reactNative: 'React Native',
          markdown: 'Documentation Markdown',
          aiInstructions: 'Instructions IA',
        },
      },
      finalCta: {
        title: 'Construisez la version qui appartient à votre produit.',
        description:
          'Partez de vos propres tokens et décisions. La bêta est gratuite et aucune facturation n’est activée.',
        cta: 'Créer un design system',
        dashboardCta: 'Ouvrir le tableau de bord',
      },
    },
  },
} as const;
