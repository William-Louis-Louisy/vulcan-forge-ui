export const examplesPageMessages = {
  en: {
    ExamplesPage: {
      hero: {
        eyebrow: 'Guided product demo',
        titleBefore: 'Define one rule.',
        titleAccent: 'Reuse it everywhere.',
        description:
          'VulcanForge UI keeps the rules of your interface in one place: tokens, themes, components, accessibility, documentation, exports and guidance for your coding assistant. You stop rewriting the same decision at every step.',
        secondaryCta: 'See the workflow',
        disclosure: 'All data shown in this demo is fictional.',
        flow: {
          token: {
            label: 'Token',
            caption: 'The value and its purpose are documented',
          },
          theme: {
            label: 'Theme',
            caption: 'The token is mapped to a role',
          },
          component: {
            label: 'Component',
            caption: 'The role is used by the component',
          },
          accessibility: {
            label: 'Accessibility',
            caption: 'The resolved values are checked',
          },
          delivery: {
            label: 'Outputs',
            caption: 'Code, docs and AI instructions',
          },
        },
      },
      demo: {
        projectLabel: 'Demo project',
        deliveryLabel: 'outputs',
        connectedLayers: '5 connected steps',
        source: 'Source',
        resolvedContrast: 'Resolved contrast',
        outputs: 'Outputs',
        formats: '6 formats',
        primitiveColor: 'Primitive · Color',
        value: 'Value',
        intent: 'Purpose',
        primaryBrandAction: 'Primary brand action',
        description: 'Description',
        tokenDescription:
          'Main brand color used for emphasized actions and selected states.',
        activeTheme: 'Active theme',
        independentMapping: 'Independent mapping',
        componentContract: 'Interactive component rules',
        states: 'States',
        tokenBindings: 'Token bindings',
        primaryAction: 'Primary action',
        contractChecks: 'Checks',
        checks: {
          focus: 'focusVisible state is documented',
          foreground: 'Foreground and background both resolve',
          status: 'Status meaning does not rely on color alone',
        },
        manualReview:
          'Keyboard and screen-reader testing still require manual review.',
        generatedFromProject: 'Generated from project',
      },
      workflow: {
        eyebrow: 'From token to code',
        title: 'Define a rule once, then reuse it at every step.',
        description:
          'Watch one brand color become a theme role, feed a button, pass accessibility checks and end up in code, documentation and AI instructions.',
        steps: {
          token: {
            kicker: '01 · Define',
            title: 'Give the value a name and a purpose.',
            description:
              'Instead of keeping only #A94E2F, create a token such as color.brand.600 and document what it is for. The rest of the project can reference it without copying the raw value.',
            insight: 'The value is defined in one place.',
          },
          theme: {
            kicker: '02 · Use it in a theme',
            title: 'The theme references the token.',
            description:
              'The accent role can point to one token in Light and another in Dark. Change the mapping without editing every component that uses the role.',
            insight: 'Components use a role instead of a hard-coded color.',
          },
          component: {
            kicker: '03 · Describe the component',
            title: 'The button knows which roles and states to use.',
            description:
              'Document its variants, states and token bindings. A developer or coding assistant can start from those rules instead of guessing how the component should behave.',
            insight: 'The implementation rules are explicit.',
          },
          accessibility: {
            kicker: '04 · Check',
            title: 'Problems are visible before export.',
            description:
              'VulcanForge UI checks contrast from the values actually resolved by the theme and keeps manual requirements visible instead of pretending everything can be automated.',
            insight:
              'You can see what is automated and what still needs review.',
          },
          delivery: {
            kicker: '05 · Use it',
            title: 'The same project feeds your code, docs and AI context.',
            description:
              'Generate CSS, Tailwind, TypeScript, React Native, Markdown and instructions for your coding assistant. Every output starts from the same project data.',
            insight: 'You maintain one set of rules instead of several copies.',
          },
        },
      },
      differentiation: {
        eyebrow: 'Why it helps',
        title: 'One place for the rules your code, docs and AI need to share.',
        description:
          'Keep the tools you already use. VulcanForge UI gives them a common source instead of making you maintain the same rules in several places.',
        items: {
          source: {
            title: 'One source to maintain',
            description:
              'Tokens, themes, components, documentation, exports and AI instructions all start from the same project data.',
          },
          semantics: {
            title: 'Roles instead of hard-coded values',
            description:
              'A component can use a role such as accent or content instead of carrying a raw color that becomes difficult to replace later.',
          },
          contracts: {
            title: 'Components described clearly',
            description:
              'Variants, states and token bindings record how a component should be used instead of leaving those rules in someone’s memory.',
          },
          accessibility: {
            title: 'Checks based on real values',
            description:
              'Contrast is calculated from the values resolved by the theme, while checks that still need a human remain clearly identified.',
          },
          ai: {
            title: 'Reusable context for AI development',
            description:
              'Generate instructions from the project so your coding assistant receives the same tokens, component rules and constraints as the rest of the team.',
          },
        },
      },
      aiDevelopment: {
        eyebrow: 'AI-assisted development',
        title: 'Give your coding assistant the same rules your team uses.',
        description:
          'A coding assistant does not know your design system by default. Without context it can invent a color, miss a state or rebuild a component that already exists. VulcanForge UI generates reusable instructions from your project so you can add those rules to its context.',
        boundary:
          'VulcanForge UI does not run your assistant. It prepares the context file you give to the tools you already use.',
        contextLabel: 'Generated AI context',
        rulesTitle: 'rules.md',
        rules: {
          tokens: 'Use theme roles before hard-coded color values.',
          components:
            'Button.primary supports default, hover, focusVisible and disabled.',
          accessibility:
            'Keep documented text/background pairs at WCAG AA or higher.',
          reuse:
            'Reuse existing component contracts before creating new variants.',
        },
        promptLabel: 'Then your prompt can stay about the feature',
        promptExample: 'Build the settings panel with the existing components.',
        promptNote: 'The UI rules are already provided in rules.md.',
      },
      drift: {
        eyebrow: 'The problem this avoids',
        title: 'Copy a rule everywhere and eventually the copies disagree.',
        description:
          'You update a token, but the documentation, a component or the instructions sent to AI can keep the old version. Starting from one project means fewer places to update by hand.',
        scatteredTitle: 'When every tool has its own copy',
        connectedTitle: 'When everything starts from the same project',
        scatteredItems: {
          token: 'You change a token',
          docs: 'The documentation keeps the old value',
          component: 'A component still uses a hard-coded exception',
          ai: 'The coding assistant receives outdated instructions',
        },
        connectedItems: {
          source: 'You change the rule in the project',
          theme: 'Theme references use the new value',
          component: 'Component bindings still point to the same roles',
          outputs: 'You regenerate docs, exports and AI instructions',
        },
        note: 'Fewer copies to maintain means fewer chances for them to drift.',
      },
      delivery: {
        eyebrow: 'One project · several outputs',
        title: 'Generate the format your stack or coding assistant needs.',
        description:
          'CSS, Tailwind, TypeScript, React Native, Markdown and AI instructions all start from the same project data.',
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
        eyebrow: 'Start with what you already have',
        title: 'Put your design-system rules in one place.',
        description:
          'Create a project, add your existing tokens and connect them to themes, components, exports and AI instructions as you go.',
        cta: 'Create my project',
        dashboardCta: 'Open dashboard',
      },
    },
  },
  fr: {
    ExamplesPage: {
      hero: {
        eyebrow: 'Démo guidée du produit',
        titleBefore: 'Définissez une règle.',
        titleAccent: 'Réutilisez-la partout.',
        description:
          'VulcanForge UI rassemble les règles de votre interface au même endroit : tokens, thèmes, composants, accessibilité, documentation, exports et consignes pour votre assistant IA. Vous évitez de recopier la même décision à chaque étape.',
        secondaryCta: 'Voir le workflow',
        disclosure: 'Toutes les données de cette démo sont fictives.',
        flow: {
          token: {
            label: 'Token',
            caption: 'La valeur et son usage sont documentés',
          },
          theme: {
            label: 'Thème',
            caption: 'Le token est associé à un rôle',
          },
          component: {
            label: 'Composant',
            caption: 'Le rôle est utilisé par le composant',
          },
          accessibility: {
            label: 'Accessibilité',
            caption: 'Les valeurs utilisées sont vérifiées',
          },
          delivery: {
            label: 'Sorties',
            caption: 'Code, documentation et consignes IA',
          },
        },
      },
      demo: {
        projectLabel: 'Projet de démo',
        deliveryLabel: 'sorties',
        connectedLayers: '5 étapes reliées',
        source: 'Source',
        resolvedContrast: 'Contraste calculé',
        outputs: 'Sorties',
        formats: '6 formats',
        primitiveColor: 'Primitif · Couleur',
        value: 'Valeur',
        intent: 'Usage',
        primaryBrandAction: 'Action principale de la marque',
        description: 'Description',
        tokenDescription:
          'Couleur principale de la marque utilisée pour les actions importantes et les états sélectionnés.',
        activeTheme: 'Thème actif',
        independentMapping: 'Mapping indépendant',
        componentContract: 'Règles du composant interactif',
        states: 'États',
        tokenBindings: 'Tokens utilisés',
        primaryAction: 'Action principale',
        contractChecks: 'Contrôles',
        checks: {
          focus: 'L’état focusVisible est documenté',
          foreground: 'Le texte et le fond utilisent des valeurs résolues',
          status: 'Le statut ne repose pas uniquement sur la couleur',
        },
        manualReview:
          'Les tests au clavier et au lecteur d’écran restent à faire manuellement.',
        generatedFromProject: 'Généré depuis le projet',
      },
      workflow: {
        eyebrow: 'Du token au code',
        title: 'Une règle définie une fois, puis réutilisée à chaque étape.',
        description:
          'Voici comment une couleur de marque devient un rôle de thème, alimente un bouton, passe les contrôles d’accessibilité puis arrive dans le code, la documentation et les consignes IA.',
        steps: {
          token: {
            kicker: '01 · Définir',
            title: 'Donnez un nom et un usage à la valeur.',
            description:
              'Au lieu de garder seulement #A94E2F, créez un token comme color.brand.600 et indiquez à quoi il sert. Le reste du projet peut ensuite le référencer sans recopier la valeur.',
            insight: 'La valeur n’est définie qu’à un seul endroit.',
          },
          theme: {
            kicker: '02 · Utiliser dans un thème',
            title: 'Le thème référence le token.',
            description:
              'Le rôle accent peut pointer vers une valeur en Light et une autre en Dark. Vous changez le mapping sans modifier chaque composant qui utilise ce rôle.',
            insight:
              'Les composants utilisent un rôle, pas une couleur en dur.',
          },
          component: {
            kicker: '03 · Décrire le composant',
            title: 'Le bouton sait quels rôles et quels états utiliser.',
            description:
              'Vous documentez ses variantes, ses états et ses tokens. Un développeur ou un assistant IA peut partir de ces règles au lieu de deviner comment le composant doit fonctionner.',
            insight: 'Les règles d’implémentation sont explicites.',
          },
          accessibility: {
            kicker: '04 · Vérifier',
            title: 'Les problèmes sont visibles avant l’export.',
            description:
              'VulcanForge UI calcule les contrastes à partir des valeurs réellement utilisées par le thème et garde visibles les contrôles qui demandent encore une vérification manuelle.',
            insight:
              'Vous voyez ce qui est vérifié automatiquement et ce qui ne l’est pas.',
          },
          delivery: {
            kicker: '05 · Utiliser',
            title: 'Le même projet alimente votre code, vos docs et votre IA.',
            description:
              'Générez du CSS, Tailwind, TypeScript, React Native, du Markdown et un fichier de consignes pour votre assistant IA. Toutes ces sorties partent des mêmes données.',
            insight:
              'Vous maintenez un seul jeu de règles au lieu de plusieurs copies.',
          },
        },
      },
      differentiation: {
        eyebrow: 'Pourquoi c’est utile',
        title:
          'Une seule base pour les règles que votre code, votre documentation et votre IA doivent partager.',
        description:
          'Vous gardez vos outils habituels. VulcanForge UI leur fournit une source commune au lieu de vous obliger à maintenir les mêmes règles à plusieurs endroits.',
        items: {
          source: {
            title: 'Une seule base à maintenir',
            description:
              'Tokens, thèmes, composants, documentation, exports et consignes IA partent des mêmes données du projet.',
          },
          semantics: {
            title: 'Des rôles au lieu de valeurs en dur',
            description:
              'Un composant peut utiliser un rôle comme accent ou content au lieu d’embarquer une couleur brute difficile à remplacer ensuite.',
          },
          contracts: {
            title: 'Des composants décrits clairement',
            description:
              'Variantes, états et tokens utilisés indiquent comment un composant doit fonctionner au lieu de laisser ces règles dans la tête de quelqu’un.',
          },
          accessibility: {
            title: 'Des contrôles basés sur les vraies valeurs',
            description:
              'Les contrastes sont calculés avec les valeurs du thème. Les vérifications qui demandent encore un humain restent clairement indiquées.',
          },
          ai: {
            title: 'Un contexte réutilisable pour développer avec l’IA',
            description:
              'Générez des consignes depuis le projet pour que votre assistant IA reçoive les mêmes tokens, règles de composants et contraintes que votre équipe.',
          },
        },
      },
      aiDevelopment: {
        eyebrow: 'Développer avec l’IA',
        title:
          'Donnez à votre assistant IA les mêmes règles qu’à votre équipe.',
        description:
          'Un assistant IA ne connaît pas votre design system par défaut. Sans contexte, il peut inventer une couleur, oublier un état ou recréer un composant qui existe déjà. VulcanForge UI génère des consignes réutilisables depuis votre projet pour que vous puissiez les ajouter à son contexte.',
        boundary:
          'VulcanForge UI ne pilote pas votre assistant IA. Il prépare le fichier de contexte que vous fournissez aux outils que vous utilisez déjà.',
        contextLabel: 'Contexte IA généré',
        rulesTitle: 'rules.md',
        rules: {
          tokens: 'Utiliser les rôles de thème avant toute couleur en dur.',
          components:
            'Button.primary gère default, hover, focusVisible et disabled.',
          accessibility:
            'Conserver les paires texte/fond documentées au niveau WCAG AA ou supérieur.',
          reuse:
            'Réutiliser les contrats de composants existants avant de créer de nouvelles variantes.',
        },
        promptLabel: 'Votre prompt peut alors rester centré sur la feature',
        promptExample:
          'Crée le panneau des paramètres avec les composants existants.',
        promptNote: 'Les règles d’interface sont déjà fournies dans rules.md.',
      },
      drift: {
        eyebrow: 'Le problème que ça évite',
        title:
          'Quand une règle est copiée partout, les copies finissent par se contredire.',
        description:
          'Vous modifiez un token, mais la documentation, un composant ou les consignes envoyées à l’IA peuvent garder l’ancienne version. En partant d’un seul projet, vous avez moins d’endroits à mettre à jour à la main.',
        scatteredTitle: 'Quand chaque outil garde sa propre copie',
        connectedTitle: 'Quand tout repart du même projet',
        scatteredItems: {
          token: 'Vous modifiez un token',
          docs: 'La documentation garde l’ancienne valeur',
          component: 'Un composant utilise encore une exception en dur',
          ai: 'L’assistant IA reçoit des consignes dépassées',
        },
        connectedItems: {
          source: 'Vous modifiez la règle dans le projet',
          theme: 'Les références du thème utilisent la nouvelle valeur',
          component: 'Les composants gardent les mêmes rôles',
          outputs: 'Vous régénérez les docs, les exports et les consignes IA',
        },
        note: 'Moins de copies à maintenir, donc moins de risques qu’elles divergent.',
      },
      delivery: {
        eyebrow: 'Un projet · plusieurs sorties',
        title:
          'Générez le format dont votre stack ou votre assistant IA a besoin.',
        description:
          'CSS, Tailwind, TypeScript, React Native, Markdown et consignes IA partent tous des mêmes données du projet.',
        formatLabels: {
          css: 'Variables CSS',
          tailwind: 'Tailwind v4',
          typescript: 'TypeScript',
          reactNative: 'React Native',
          markdown: 'Documentation Markdown',
          aiInstructions: 'Consignes IA',
        },
      },
      finalCta: {
        eyebrow: 'Partez de ce que vous avez déjà',
        title: 'Rassemblez les règles de votre design system au même endroit.',
        description:
          'Créez un projet, ajoutez vos tokens existants puis reliez-les progressivement à vos thèmes, composants, exports et consignes IA.',
        cta: 'Créer mon projet',
        dashboardCta: 'Ouvrir le tableau de bord',
      },
    },
  },
} as const;
