export const examplesPageMessages = {
  en: {
    ExamplesPage: {
      hero: {
        eyebrow: 'Guided demo · Aurora System',
        titleBefore: 'Change one decision.',
        titleAccent: 'The whole system follows.',
        description:
          'VulcanForge UI does more than store tokens. It connects the decisions that make a design system usable: themes, component contracts, accessibility, documentation, exports and AI guidance.',
        primaryCta: 'Build my system',
        dashboardCta: 'Open dashboard',
        secondaryCta: 'Follow the decision',
        disclosure:
          'Aurora System is a fictional project built specifically for this walkthrough.',
        flow: {
          token: {
            label: 'Source decision',
            caption: 'Named, typed and documented',
          },
          theme: {
            label: 'Meaning',
            caption: 'Mapped to a theme role',
          },
          component: {
            label: 'Usage',
            caption: 'Bound to a component contract',
          },
          accessibility: {
            label: 'Check',
            caption: 'Resolved before it ships',
          },
          delivery: {
            label: 'Delivery',
            caption: 'Generated from the same source',
          },
        },
      },
      workflow: {
        eyebrow: 'The workflow',
        title: 'Not five tools sitting next to each other. One chain of decisions.',
        description:
          'Follow the same design decision as it moves through Aurora. Nothing is re-entered just to keep another document, export or prompt in sync.',
        steps: {
          token: {
            kicker: '01 · Author',
            title: 'Capture the decision, not just the value.',
            description:
              'A useful token carries a path, a type, a value and intent. That structure is what lets the rest of the system understand what the decision is for.',
            insight: 'One source decision becomes reusable context.',
          },
          theme: {
            kicker: '02 · Give it meaning',
            title: 'Map the same decision to the role it plays.',
            description:
              'Themes reference authored tokens instead of copying raw values. Light and Dark can evolve independently, and project-specific roles stay explicit.',
            insight: 'Roles preserve meaning while values can change.',
          },
          component: {
            kicker: '03 · Connect usage',
            title: 'Components become contracts, not screenshots.',
            description:
              'Variants, states, anatomy, token bindings and accessibility expectations live beside the component. A Button is no longer just how it looks today.',
            insight: 'Implementation choices become part of the system.',
          },
          accessibility: {
            kicker: '04 · Check the consequences',
            title: 'Catch contradictions before they spread.',
            description:
              'Contrast checks use resolved theme values, while component contracts make requirements such as focus-visible states explicit. Automated checks stay separate from manual review.',
            insight: 'Accessibility is connected to the decisions that affect it.',
          },
          delivery: {
            kicker: '05 · Ship',
            title: 'Export the system, not another frozen copy of it.',
            description:
              'CSS, Tailwind, TypeScript, React Native, Markdown and AI instructions are generated from the same structured project, so delivery starts from the same decisions.',
            insight: 'Different outputs. One source of truth.',
          },
        },
      },
      differentiation: {
        eyebrow: 'What changes',
        title:
          'The hard part is not generating more files. It is making sure they all tell the same story.',
        description:
          'VulcanForge UI is built around continuity. The interesting part is not any single editor; it is what becomes possible when each layer understands the others.',
        items: {
          source: {
            title: 'One structured source',
            description:
              'Documentation, exports and AI guidance read from the same project instead of being maintained as parallel artifacts.',
          },
          semantics: {
            title: 'Meaning before implementation',
            description:
              'Theme roles keep intent visible, so a component binds to “accent” or “content” instead of scattering raw colors through the product.',
          },
          contracts: {
            title: 'Component contracts',
            description:
              'States, variants, anatomy and bindings make the implementation rules explicit enough for humans and tools to reuse them.',
          },
          accessibility: {
            title: 'Accessibility in the data model',
            description:
              'Resolved contrast and component requirements can be checked where the underlying design decisions already live.',
          },
          ai: {
            title: 'AI guidance derived from the system',
            description:
              'Instead of rewriting the design system inside every prompt, generate instructions from the same source developers are already using.',
          },
        },
      },
      drift: {
        eyebrow: 'Why it matters',
        title: 'Every manual copy is another place for the system to drift.',
        description:
          'A token file, a wiki page, a component note and an AI prompt can all be correct on day one and disagree a week later. VulcanForge UI reduces the number of places where the same decision has to be rewritten.',
        scatteredTitle: 'When decisions are scattered',
        connectedTitle: 'When decisions stay connected',
        scatteredItems: {
          token: 'Token value changes',
          docs: 'Documentation still shows the old rule',
          component: 'A component keeps a hard-coded exception',
          ai: 'The next AI prompt invents a different answer',
        },
        connectedItems: {
          source: 'Change the source decision',
          theme: 'Theme references resolve the new value',
          component: 'Bindings keep usage explicit',
          outputs: 'Docs, exports and AI guidance regenerate from the project',
        },
        note: 'No magic sync layer. Just fewer decisions copied by hand.',
      },
      delivery: {
        eyebrow: 'One source · multiple consumers',
        title: 'The same system can leave the product in the format your stack needs.',
        description:
          'Code-oriented exports, documentation and AI guidance are different views of the same structured project.',
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
        eyebrow: 'Your turn',
        title: 'Turn your design system into infrastructure, not a folder of notes.',
        description:
          'Start with the decisions you already have. VulcanForge UI gives them a structure the rest of your product can actually use.',
        cta: 'Build my design system',
        dashboardCta: 'Open dashboard',
      },
    },
  },
  fr: {
    ExamplesPage: {
      hero: {
        eyebrow: 'Démo guidée · Aurora System',
        titleBefore: 'Une décision change.',
        titleAccent: 'Tout le système suit.',
        description:
          'VulcanForge UI ne sert pas seulement à stocker des tokens. Il relie les décisions qui font vivre un design system : thèmes, contrats de composants, accessibilité, documentation, exports et consignes pour l’IA.',
        primaryCta: 'Créer mon système',
        dashboardCta: 'Ouvrir le tableau de bord',
        secondaryCta: 'Suivre la décision',
        disclosure:
          'Aurora System est un projet fictif créé spécialement pour cette démonstration.',
        flow: {
          token: {
            label: 'Décision source',
            caption: 'Nommée, typée et documentée',
          },
          theme: {
            label: 'Sens',
            caption: 'Associée à un rôle de thème',
          },
          component: {
            label: 'Usage',
            caption: 'Branchée sur un contrat de composant',
          },
          accessibility: {
            label: 'Contrôle',
            caption: 'Vérifiée avant la livraison',
          },
          delivery: {
            label: 'Livraison',
            caption: 'Générée depuis la même source',
          },
        },
      },
      workflow: {
        eyebrow: 'Le workflow',
        title: 'Pas cinq outils posés côte à côte. Une seule chaîne de décisions.',
        description:
          'Suivez la même décision à travers Aurora. Rien n’est ressaisi juste pour maintenir un autre document, un export ou un prompt à jour.',
        steps: {
          token: {
            kicker: '01 · Créer',
            title: 'Capturez la décision, pas seulement la valeur.',
            description:
              'Un token utile ne se résume pas à un hexadécimal. Il porte un chemin, un type, une valeur et une intention. C’est cette structure qui permet au reste du système de comprendre à quoi il sert.',
            insight: 'Une décision source devient un contexte réutilisable.',
          },
          theme: {
            kicker: '02 · Donner du sens',
            title: 'Associez la décision au rôle qu’elle joue.',
            description:
              'Les thèmes référencent les tokens au lieu de recopier leurs valeurs. Light et Dark peuvent évoluer séparément, et les rôles propres au projet restent visibles et assumés.',
            insight: 'Le rôle garde le sens, même quand la valeur change.',
          },
          component: {
            kicker: '03 · Relier les usages',
            title: 'Un composant devient un contrat, pas une capture d’écran.',
            description:
              'Variantes, états, anatomie, bindings de tokens et attentes d’accessibilité vivent avec le composant. Un Button ne se résume plus à son apparence du moment.',
            insight: 'Les choix d’implémentation font enfin partie du système.',
          },
          accessibility: {
            kicker: '04 · Mesurer les conséquences',
            title: 'Repérez les contradictions avant qu’elles se propagent.',
            description:
              'Les contrastes sont calculés à partir des valeurs réellement résolues dans les thèmes. Les contrats de composants rendent aussi explicites des exigences comme le focus visible, sans confondre contrôles automatiques et revue humaine.',
            insight: 'L’accessibilité reste liée aux décisions qui l’impactent.',
          },
          delivery: {
            kicker: '05 · Livrer',
            title: 'Exportez le système, pas une nouvelle copie figée.',
            description:
              'CSS, Tailwind, TypeScript, React Native, Markdown et instructions IA partent du même projet structuré. Chaque sortie raconte donc la même version du système.',
            insight: 'Des formats différents. Une seule source de vérité.',
          },
        },
      },
      differentiation: {
        eyebrow: 'Ce qui change vraiment',
        title:
          'Le plus difficile n’est pas de générer plus de fichiers. C’est qu’ils racontent tous la même chose.',
        description:
          'VulcanForge UI est construit autour de cette continuité. L’intérêt n’est pas dans un éditeur pris isolément, mais dans ce qui devient possible quand chaque couche comprend les autres.',
        items: {
          source: {
            title: 'Une source structurée',
            description:
              'La documentation, les exports et les consignes IA lisent le même projet au lieu d’être entretenus comme trois artefacts parallèles.',
          },
          semantics: {
            title: 'Le sens avant l’implémentation',
            description:
              'Les rôles de thème gardent l’intention visible : un composant dépend de « accent » ou « content », pas d’une couleur brute disséminée partout.',
          },
          contracts: {
            title: 'Des composants décrits comme des contrats',
            description:
              'États, variantes, anatomie et bindings rendent les règles assez explicites pour être réutilisées aussi bien par un développeur que par un outil.',
          },
          accessibility: {
            title: 'L’accessibilité dans le modèle de données',
            description:
              'Les contrastes résolus et les exigences des composants peuvent être contrôlés là où vivent déjà les décisions qui les influencent.',
          },
          ai: {
            title: 'Des consignes IA dérivées du système',
            description:
              'Au lieu de réexpliquer le design system dans chaque prompt, les instructions sont générées depuis la même source que celle utilisée par les développeurs.',
          },
        },
      },
      drift: {
        eyebrow: 'Pourquoi ça compte',
        title: 'Chaque copie manuelle est un nouvel endroit où le système peut dériver.',
        description:
          'Un fichier de tokens, une page de documentation, une note sur un composant et un prompt peuvent être parfaitement cohérents aujourd’hui, puis se contredire une semaine plus tard. VulcanForge UI réduit le nombre d’endroits où la même décision doit être recopiée.',
        scatteredTitle: 'Quand les décisions sont dispersées',
        connectedTitle: 'Quand les décisions restent reliées',
        scatteredItems: {
          token: 'La valeur d’un token change',
          docs: 'La documentation affiche encore l’ancienne règle',
          component: 'Un composant garde une exception en dur',
          ai: 'Le prochain prompt IA invente une autre réponse',
        },
        connectedItems: {
          source: 'La décision source change',
          theme: 'Les références de thème résolvent la nouvelle valeur',
          component: 'Les bindings gardent l’usage explicite',
          outputs: 'Docs, exports et consignes IA repartent du projet',
        },
        note: 'Pas de synchronisation magique. Juste moins de décisions recopiées à la main.',
      },
      delivery: {
        eyebrow: 'Une source · plusieurs usages',
        title: 'Le même système peut sortir dans le format dont votre stack a besoin.',
        description:
          'Les exports orientés code, la documentation et les consignes IA ne sont que des vues différentes du même projet structuré.',
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
        eyebrow: 'À vous',
        title: 'Faites de votre design system une infrastructure, pas un dossier de notes.',
        description:
          'Partez des décisions que vous avez déjà. VulcanForge UI leur donne une structure que le reste de votre produit peut réellement exploiter.',
        cta: 'Construire mon design system',
        dashboardCta: 'Ouvrir le tableau de bord',
      },
    },
  },
} as const;
