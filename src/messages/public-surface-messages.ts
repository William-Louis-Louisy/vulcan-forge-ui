export const publicSurfaceMessages = {
  en: {
    PublicHeader: {
      dashboard: 'Dashboard',
      example: 'Example',
      getStarted: 'Start for free',
      homeLabel: 'VulcanForge UI home',
      mobile: {
        close: 'Close navigation menu',
        open: 'Open navigation menu',
      },
      navigationLabel: 'Public navigation',
      pricing: 'Pricing',
      product: 'Product',
      signIn: 'Sign in',
    },
    PublicFooter: {
      copyright: '© {year} VulcanForge UI. Built as a focused product beta.',
      dashboard: 'Dashboard',
      description:
        'Accessible, exportable and AI-ready design systems for technical teams.',
      example: 'Product example',
      navigationLabel: 'Footer navigation',
      pricing: 'Pricing',
      product: 'Product',
      signIn: 'Sign in',
    },
    AuthShell: {
      preview: {
        delivered: 'Delivered',
        export: 'Export',
        label: 'Light preview',
        navigation: {
          accessibility: 'Accessibility',
          brand: 'Brand',
          overview: 'Overview',
          themes: 'Themes',
          tokens: 'Tokens',
        },
        project: 'Create project',
      },
      signup: {
        eyebrow: 'Why VulcanForge',
      },
    },
    HomePage: {
      audiences: {
        eyebrow: 'Built for',
        items: {
          agencies: {
            description:
              'Hand off documented systems in English and French, with implementation rules already included.',
            title: 'Small agencies',
          },
          designers: {
            description:
              'Author design decisions that engineers and AI tools can consume without interpretation drift.',
            title: 'Technical product designers',
          },
          freelancers: {
            description:
              'Build a durable system per client, export it cleanly and stop rebuilding the same foundations.',
            title: 'Freelance developers',
          },
          indieHackers: {
            description:
              'Move beyond manually chosen variables without adopting an oversized enterprise platform.',
            title: 'Indie hackers',
          },
        },
        title: 'For teams who treat design as infrastructure.',
      },
      capabilities: {
        description:
          'One structured project connects visual decisions, implementation contracts, accessibility signals and AI guidance.',
        eyebrow: 'One model',
        items: {
          aiRules: {
            description:
              'Generate strict instructions that prevent assistants from inventing tokens, states or patterns.',
            title: 'AI rules',
          },
          components: {
            description:
              'Describe anatomy, variants, states and accessibility contracts—not only screenshots.',
            title: 'Components',
          },
          themes: {
            description:
              'Map semantic roles across light and dark themes and review the contrast pairs that matter.',
            title: 'Themes',
          },
          tokens: {
            description:
              'Author primitives, semantics and aliases with localized descriptions and resolvable values.',
            title: 'Tokens',
          },
        },
        title: 'One source of truth. No implementation drift.',
      },
      exports: {
        description:
          'Generate implementation assets from the same validated model instead of translating decisions by hand.',
        eyebrow: 'Six formats · MVP',
        items: {
          aiInstructions: {
            fileName: 'rules.md',
            title: 'AI instructions',
          },
          css: {
            fileName: 'tokens.css',
            title: 'CSS variables',
          },
          markdown: {
            fileName: 'README.md',
            title: 'Markdown docs',
          },
          reactNative: {
            fileName: 'theme.native.ts',
            title: 'React Native',
          },
          tailwind: {
            fileName: 'theme.css',
            title: 'Tailwind v4',
          },
          typescript: {
            fileName: 'theme.ts',
            title: 'TypeScript',
          },
        },
        title: 'Exports your build pipeline can actually consume.',
      },
      finalCta: {
        cta: 'Start for free',
        description: 'Free during beta. English and French from day one.',
        title: 'Forge your first system.',
      },
      hero: {
        dashboardCta: 'Open dashboard',
        description:
          'Author your tokens, document your components, verify contrast and ship clean exports for web, mobile and your AI agent—all from one project.',
        eyebrow: 'Beta · Free during preview',
        primaryCta: 'Start a design system',
        reassurance: 'No credit card · English and French',
        secondaryCta: 'View an example',
        titleAccent: 'structured',
        titleAfter: 'not styled.',
        titleBefore: 'Design systems,',
      },
      preview: {
        delivered: 'Delivered',
        export: 'Export',
        label: 'Light preview',
        navigation: {
          accessibility: 'Accessibility',
          brand: 'Brand',
          overview: 'Overview',
          themes: 'Themes',
          tokens: 'Tokens',
        },
        project: 'Create project',
      },
      problems: {
        eyebrow: 'The problem',
        items: {
          aiDrift: {
            description:
              'Your agent invents new colors, spacing and names, ignoring the system you already defined.',
            title: 'AI drift',
          },
          inconsistentUi: {
            description:
              'Tokens drift between mockups, code and documentation until every team ships a different source of truth.',
            title: 'Inconsistent UI',
          },
          weakAccessibility: {
            description:
              'Contrast is checked in screenshots while the actual source values remain unverified and undocumented.',
            title: 'Weak accessibility',
          },
        },
        title: 'Design-system decisions break when they leave the canvas.',
      },
    },
    PricingPage: {
      dashboardCta: 'Open dashboard',
      description:
        'Paid plans are not live yet. This is the direction we are building toward, so the beta commitment stays clear.',
      eyebrow: 'Public beta',
      faq: {
        items: {
          exports: {
            answer:
              'Yes. Tokens are language-neutral; Markdown documentation and AI instructions are generated per locale with explicit fallbacks.',
            question: 'Do exports include English and French content?',
          },
          futurePlans: {
            answer:
              'Pro and Team describe the intended product direction only. They cannot be purchased or joined yet.',
            question: 'Can I subscribe to Pro or Team today?',
          },
          whyFree: {
            answer:
              'Yes. Everything shown in Free beta is available while the core product workflow is being validated.',
            question: 'Is anything actually free?',
          },
        },
        title: 'Frequently asked.',
      },
      tiers: {
        freeBeta: {
          cta: 'Start for free',
          features: {
            feature1: 'Unlimited beta projects',
            feature2: 'English and French content',
            feature3: 'Six export formats',
            feature4: 'AI instructions',
            feature5: 'Community support',
          },
          name: 'Free beta',
          price: '€0',
          priceDescription: 'while the beta runs',
          status: 'Available now',
          unavailable: '',
        },
        proSoon: {
          cta: '',
          features: {
            feature1: 'Everything in Free',
            feature2: 'Version history',
            feature3: 'Private export delivery',
            feature4: 'Component AI hints',
            feature5: 'Priority email support',
          },
          name: 'Pro',
          price: 'Soon',
          priceDescription: 'for solo builders',
          status: 'Coming later',
          unavailable: 'Not available during beta',
        },
        teamSoon: {
          cta: '',
          features: {
            feature1: 'Everything in Pro',
            feature2: 'Multi-workspace support',
            feature3: 'Single sign-on foundations',
            feature4: 'Custom token schemas',
            feature5: 'Review workflow',
          },
          name: 'Team',
          price: 'Soon',
          priceDescription: 'for agencies and startups',
          status: 'Coming later',
          unavailable: 'Not available during beta',
        },
      },
      titleAccent: 'Honest pricing after.',
      titleBefore: 'Free during beta.',
    },
    LoginPage: {
      description: 'Sign in to continue forging your design systems.',
      eyebrow: 'Welcome back',
      title: 'Continue building.',
    },
    SignupPage: {
      benefits: {
        items: {
          accessibility:
            'Review per-theme contrast signals and keep manual accessibility work explicit.',
          ai: 'Generate strict instructions that keep AI assistants inside your real system.',
          exports:
            'Ship CSS, Tailwind, TypeScript, React Native, Markdown and AI-ready outputs.',
          tokens:
            'Author primitives and semantics with localized descriptions and resolvable aliases.',
        },
        title: 'The shortest path from a token to a typed export.',
      },
      description:
        'Create a personal workspace and start a structured design-system project in minutes.',
      eyebrow: 'Create an account',
      title: 'Forge your first system.',
    },
  },
  fr: {
    PublicHeader: {
      dashboard: 'Tableau de bord',
      example: 'Exemple',
      getStarted: 'Commencer gratuitement',
      homeLabel: 'Accueil VulcanForge UI',
      mobile: {
        close: 'Fermer le menu de navigation',
        open: 'Ouvrir le menu de navigation',
      },
      navigationLabel: 'Navigation publique',
      pricing: 'Tarifs',
      product: 'Produit',
      signIn: 'Se connecter',
    },
    PublicFooter: {
      copyright:
        '© {year} VulcanForge UI. Construit comme une bêta produit ciblée.',
      dashboard: 'Tableau de bord',
      description:
        'Des design systems accessibles, exportables et prêts pour l’IA pour les équipes techniques.',
      example: 'Exemple produit',
      navigationLabel: 'Navigation de pied de page',
      pricing: 'Tarifs',
      product: 'Produit',
      signIn: 'Se connecter',
    },
    AuthShell: {
      preview: {
        delivered: 'Livré',
        export: 'Exporter',
        label: 'Aperçu clair',
        navigation: {
          accessibility: 'Accessibilité',
          brand: 'Marque',
          overview: 'Vue d’ensemble',
          themes: 'Thèmes',
          tokens: 'Tokens',
        },
        project: 'Créer un projet',
      },
      signup: {
        eyebrow: 'Pourquoi VulcanForge',
      },
    },
    HomePage: {
      audiences: {
        eyebrow: 'Conçu pour',
        items: {
          agencies: {
            description:
              'Transmettez des systèmes documentés en français et en anglais, avec les règles d’implémentation déjà intégrées.',
            title: 'Petites agences',
          },
          designers: {
            description:
              'Formalisez des décisions que les développeurs et les outils d’IA peuvent exploiter sans dérive d’interprétation.',
            title: 'Designers produit techniques',
          },
          freelancers: {
            description:
              'Construisez un système durable par client, exportez-le proprement et cessez de recréer les mêmes fondations.',
            title: 'Développeurs freelances',
          },
          indieHackers: {
            description:
              'Dépassez les variables choisies à la main sans adopter une plateforme d’entreprise disproportionnée.',
            title: 'Indie hackers',
          },
        },
        title:
          'Pour les équipes qui traitent le design comme une infrastructure.',
      },
      capabilities: {
        description:
          'Un projet structuré relie les décisions visuelles, les contrats d’implémentation, les signaux d’accessibilité et les règles pour l’IA.',
        eyebrow: 'Un seul modèle',
        items: {
          aiRules: {
            description:
              'Générez des instructions strictes qui empêchent les assistants d’inventer des tokens, états ou patterns.',
            title: 'Règles IA',
          },
          components: {
            description:
              'Décrivez l’anatomie, les variantes, les états et les contrats d’accessibilité — pas seulement des captures.',
            title: 'Composants',
          },
          themes: {
            description:
              'Mappez les rôles sémantiques entre thèmes clair et sombre et examinez les contrastes importants.',
            title: 'Thèmes',
          },
          tokens: {
            description:
              'Créez des primitives, des tokens sémantiques et des alias avec des descriptions localisées.',
            title: 'Tokens',
          },
        },
        title: 'Une source de vérité. Aucune dérive à l’implémentation.',
      },
      exports: {
        description:
          'Générez des ressources d’implémentation depuis le même modèle validé au lieu de retraduire les décisions à la main.',
        eyebrow: 'Six formats · MVP',
        items: {
          aiInstructions: {
            fileName: 'rules.md',
            title: 'Instructions IA',
          },
          css: {
            fileName: 'tokens.css',
            title: 'Variables CSS',
          },
          markdown: {
            fileName: 'README.md',
            title: 'Documentation Markdown',
          },
          reactNative: {
            fileName: 'theme.native.ts',
            title: 'React Native',
          },
          tailwind: {
            fileName: 'theme.css',
            title: 'Tailwind v4',
          },
          typescript: {
            fileName: 'theme.ts',
            title: 'TypeScript',
          },
        },
        title: 'Des exports réellement exploitables par votre pipeline.',
      },
      finalCta: {
        cta: 'Commencer gratuitement',
        description:
          'Gratuit pendant la bêta. Français et anglais dès le premier jour.',
        title: 'Forgez votre premier système.',
      },
      hero: {
        dashboardCta: 'Ouvrir le tableau de bord',
        description:
          'Créez vos tokens, documentez vos composants, vérifiez les contrastes et livrez des exports propres pour le web, le mobile et votre agent IA — depuis un seul projet.',
        eyebrow: 'Bêta · Gratuite pendant la phase de test',
        primaryCta: 'Créer un design system',
        reassurance: 'Aucune carte bancaire · Français et anglais',
        secondaryCta: 'Voir un exemple',
        titleAccent: 'structurés',
        titleAfter: 'pas simplement stylisés.',
        titleBefore: 'Des design systems,',
      },
      preview: {
        delivered: 'Livré',
        export: 'Exporter',
        label: 'Aperçu clair',
        navigation: {
          accessibility: 'Accessibilité',
          brand: 'Marque',
          overview: 'Vue d’ensemble',
          themes: 'Thèmes',
          tokens: 'Tokens',
        },
        project: 'Créer un projet',
      },
      problems: {
        eyebrow: 'Le problème',
        items: {
          aiDrift: {
            description:
              'Votre agent invente de nouvelles couleurs, espacements et nomenclatures en ignorant le système déjà défini.',
            title: 'Dérive de l’IA',
          },
          inconsistentUi: {
            description:
              'Les tokens divergent entre les maquettes, le code et la documentation jusqu’à créer plusieurs sources de vérité.',
            title: 'Interface incohérente',
          },
          weakAccessibility: {
            description:
              'Les contrastes sont vérifiés dans des captures tandis que les valeurs sources restent non contrôlées et non documentées.',
            title: 'Accessibilité fragile',
          },
        },
        title: 'Les décisions de design se dégradent en quittant la maquette.',
      },
    },
    PricingPage: {
      dashboardCta: 'Ouvrir le tableau de bord',
      description:
        'Les offres payantes ne sont pas encore disponibles. Cette page présente la direction prévue pour que l’engagement de la bêta reste clair.',
      eyebrow: 'Bêta publique',
      faq: {
        items: {
          exports: {
            answer:
              'Oui. Les tokens sont indépendants de la langue ; la documentation Markdown et les instructions IA sont générées par locale avec des fallbacks explicites.',
            question:
              'Les exports incluent-ils les contenus français et anglais ?',
          },
          futurePlans: {
            answer:
              'Pro et Team décrivent uniquement la direction prévue. Ces offres ne peuvent pas encore être achetées ni rejointes.',
            question: 'Puis-je souscrire à Pro ou Team aujourd’hui ?',
          },
          whyFree: {
            answer:
              'Oui. Tout ce qui est présenté dans la bêta gratuite est disponible pendant la validation du workflow produit principal.',
            question: 'Est-ce réellement gratuit ?',
          },
        },
        title: 'Questions fréquentes.',
      },
      tiers: {
        freeBeta: {
          cta: 'Commencer gratuitement',
          features: {
            feature1: 'Projets bêta illimités',
            feature2: 'Contenus français et anglais',
            feature3: 'Six formats d’export',
            feature4: 'Instructions IA',
            feature5: 'Support communautaire',
          },
          name: 'Bêta gratuite',
          price: '0 €',
          priceDescription: 'pendant la bêta',
          status: 'Disponible maintenant',
          unavailable: '',
        },
        proSoon: {
          cta: '',
          features: {
            feature1: 'Tout le contenu de Free',
            feature2: 'Historique des versions',
            feature3: 'Distribution privée des exports',
            feature4: 'Indications IA pour les composants',
            feature5: 'Support email prioritaire',
          },
          name: 'Pro',
          price: 'Bientôt',
          priceDescription: 'pour les créateurs indépendants',
          status: 'Disponible plus tard',
          unavailable: 'Indisponible pendant la bêta',
        },
        teamSoon: {
          cta: '',
          features: {
            feature1: 'Tout le contenu de Pro',
            feature2: 'Gestion multi-workspace',
            feature3: 'Fondations pour l’authentification unique',
            feature4: 'Schémas de tokens personnalisés',
            feature5: 'Workflow de revue',
          },
          name: 'Team',
          price: 'Bientôt',
          priceDescription: 'pour les agences et startups',
          status: 'Disponible plus tard',
          unavailable: 'Indisponible pendant la bêta',
        },
      },
      titleAccent: 'Une tarification honnête ensuite.',
      titleBefore: 'Gratuit pendant la bêta.',
    },
    LoginPage: {
      description: 'Connectez-vous pour continuer à forger vos design systems.',
      eyebrow: 'Bon retour',
      title: 'Poursuivez votre travail.',
    },
    SignupPage: {
      benefits: {
        items: {
          accessibility:
            'Examinez les contrastes par thème et conservez le travail manuel d’accessibilité explicite.',
          ai: 'Générez des instructions strictes qui maintiennent les assistants IA dans votre véritable système.',
          exports:
            'Livrez du CSS, Tailwind, TypeScript, React Native, Markdown et des sorties prêtes pour l’IA.',
          tokens:
            'Créez des primitives et des tokens sémantiques avec des descriptions localisées et des alias résolvables.',
        },
        title: 'Le chemin le plus court entre un token et un export typé.',
      },
      description:
        'Créez un workspace personnel et démarrez un projet de design system structuré en quelques minutes.',
      eyebrow: 'Créer un compte',
      title: 'Forgez votre premier système.',
    },
  },
} as const;
