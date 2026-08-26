export const learnThemesMessages = {
  en: {
    LearnThemesPage: {
      metadata: {
        title: 'Themes — Learn | VulcanForgeUI',
        description:
          'Learn how themes keep interface roles stable while allowing their token mappings and resolved appearance to change.',
      },
      hero: {
        chapter: 'Chapter 03 · Themes',
        title: 'Keep the intent. Change the appearance.',
        description:
          'A theme lets the same interface roles resolve to different design decisions without forcing every component to learn about each appearance.',
        learnerQuestion:
          'If the role stays the same, why should its resolved value ever change?',
      },
      openingProblem: {
        eyebrow: 'Start with the context',
        title:
          'One correct value can become the wrong value in another appearance.',
        description:
          'Chapter 02 gave shared decisions stable token identities. But a value that works on a light surface may fail completely on a dark one if every screen keeps using the same resolved color.',
        fixedLabel: 'Same fixed content value',
        lightLabel: 'Light surface',
        darkLabel: 'Dark surface',
        fixedValue: '#070707',
        lightBackground: '#F7F3EB',
        darkBackground: '#070707',
        sampleText: 'Primary content',
        conclusion:
          'The problem is no longer naming the decision. The problem is choosing the right decision for the current appearance.',
      },
      definition: {
        eyebrow: 'The theme layer',
        title:
          'A theme maps stable roles to token references for a particular appearance.',
        description:
          'The role name stays meaningful to the interface. The theme decides which token should fulfill that role in the current appearance.',
        roleLabel: 'Stable role',
        role: 'content',
        lightLabel: 'Light mapping',
        lightReference: '{color.primitive.neutral.950}',
        lightValue: '#070707',
        darkLabel: 'Dark mapping',
        darkReference: '{color.primitive.neutral.100}',
        darkValue: '#E2E7EF',
        rule: 'Components can ask for “content” instead of hard-coding a light or dark color themselves.',
      },
      roles: {
        eyebrow: 'Same roles, different mappings',
        title: 'The vocabulary remains stable while the references change.',
        description:
          'The current VulcanForgeUI seed uses the same core role keys in both appearances and maps them to different token references where needed.',
        roleLabel: 'Role',
        lightLabel: 'Light',
        darkLabel: 'Dark',
        items: {
          background: {
            role: 'background',
            lightReference: '{color.primitive.neutral.50}',
            lightValue: '#F7F3EB',
            darkReference: '{color.primitive.neutral.950}',
            darkValue: '#070707',
          },
          surface: {
            role: 'surface',
            lightReference: '{color.primitive.neutral.0}',
            lightValue: '#ffffff',
            darkReference: '{color.primitive.neutral.900}',
            darkValue: '#1E1E1E',
          },
          content: {
            role: 'content',
            lightReference: '{color.primitive.neutral.950}',
            lightValue: '#070707',
            darkReference: '{color.primitive.neutral.100}',
            darkValue: '#E2E7EF',
          },
          muted: {
            role: 'muted',
            lightReference: '{color.primitive.neutral.700}',
            lightValue: '#3A4454',
            darkReference: '{color.primitive.neutral.400}',
            darkValue: '#A0B1CA',
          },
          accent: {
            role: 'accent',
            lightReference: '{color.primitive.accent.secondary}',
            lightValue: '#586644',
            darkReference: '{color.primitive.accent.primary}',
            darkValue: '#FF8731',
          },
        },
        statuses:
          'The current product also protects the built-in info, success, warning and danger roles, and lets a project add custom color roles inside its existing themes.',
      },
      flow: {
        eyebrow: 'Dependency flow',
        title:
          'The component consumes a role; the theme supplies the appearance.',
        description:
          'Keeping these responsibilities separate prevents presentation choices from leaking into every component contract.',
        componentLabel: 'Component intent',
        component: 'Primary action',
        roleLabel: 'Theme role',
        role: 'accent',
        mappingLabel: 'Current mapping',
        mappingLight: 'Light → #586644',
        mappingDark: 'Dark → #FF8731',
        outcome:
          'The component can remain conceptually the same while the active appearance changes the resolved color.',
      },
      accessibility: {
        eyebrow: 'Themes are not color inversion',
        title:
          'Every appearance must still preserve usable contrast and meaning.',
        description:
          'Changing mappings can create new foreground/background relationships. A dark theme is not automatically accessible because it is dark, and a light theme is not automatically accessible because it is light.',
        items: {
          contrast:
            'Re-evaluate text and UI contrast after theme mappings change.',
          semantics:
            'Keep semantic meaning stable even when the visual value changes.',
          states:
            'Check interaction and status states in every supported appearance.',
        },
        product:
          'VulcanForgeUI currently computes contrast pairs for each stored Theme from its resolved color-role mappings. That automated check helps surface problems, but it is not a complete accessibility certification.',
      },
      broaderConcept: {
        eyebrow: 'Theme ≠ dark mode',
        title:
          'Light and Dark are examples of theming, not the definition of theming.',
        description:
          'A Design System can use themes for other appearance or preference contexts such as high contrast, sepia, compact density, reduced motion or custom typography. The exact model depends on the product.',
        caution:
          'This broader concept does not mean VulcanForgeUI currently supports those appearances.',
      },
      productBridge: {
        eyebrow: 'How VulcanForgeUI represents this today',
        title:
          'The current Theme domain is intentionally narrower than the general concept.',
        description:
          'VulcanForgeUI currently persists exactly two Theme modes: Light and Dark. Each project can have at most one Theme for each mode.',
        items: {
          modes: 'Theme mode is currently limited to light or dark.',
          mapping:
            'A Theme stores color-role mappings as token references or legacy direct values.',
          core: 'Built-in core roles are background, surface, content, muted and accent.',
          statuses:
            'Built-in status roles are info, success, warning and danger.',
          custom:
            'Projects can add custom color roles inside an existing Light or Dark Theme.',
          preview:
            'The workspace previews components against the resolved Light and Dark mappings.',
          contrast:
            'The workspace evaluates configured foreground/background contrast pairs per Theme.',
          exports:
            'Theme data is consumed by generated outputs such as CSS variables and TypeScript/React Native theme exports.',
        },
        boundary:
          'Adding a custom role does not create a new Theme. There is currently no arbitrary named Theme creation, no Sepia mode, and no Theme inheritance model.',
      },
      demo: {
        eyebrow: 'The Demo project',
        title:
          'The shared system now has one stable vocabulary for two appearances.',
        description:
          'Chapter 01 established shared decisions. Chapter 02 gave those decisions token identities. Chapter 03 adds a mapping layer so appearance can change without rewriting the vocabulary used by the interface.',
        sequence: {
          decision: 'Shared decision',
          token: 'Token',
          theme: 'Theme role mapping',
          component: 'Component uses the resolved role',
        },
      },
      misconception: {
        eyebrow: 'Common misconception',
        title: 'A Theme is not a second copy of the whole Design System.',
        description:
          'The point is not to duplicate every component and every rule for Light and Dark. Shared intent remains shared; only the decisions that need to vary should resolve differently through the theme layer.',
      },
      checkpoint: {
        eyebrow: 'Checkpoint',
        title: 'Before moving on, you should be able to explain…',
        description:
          'If these statements make sense, the next chapter can safely move from system-wide appearance to component contracts.',
        items: {
          one: 'why the same role may need a different resolved value in another appearance;',
          two: 'the difference between a stable role and the token reference assigned by a Theme;',
          three:
            'why theming is broader than Light and Dark as a general Design System concept;',
          four: 'why VulcanForgeUI currently remains limited to exactly Light and Dark Theme modes;',
          five: 'why every supported appearance still needs its own accessibility review.',
        },
      },
      continue: {
        eyebrow: 'Next chapter',
        status: 'Up next',
        title: 'Components',
        description:
          'Themes explain how shared appearance roles resolve. Next we will define what a component contract actually contains: anatomy, variants, sizes, states, content guidance, accessibility and token bindings.',
      },
    },
  },
  fr: {
    LearnThemesPage: {
      metadata: {
        title: 'Thèmes — Apprendre | VulcanForgeUI',
        description:
          'Comprendre comment les thèmes gardent des rôles d’interface stables tout en faisant varier leurs mappings de tokens et leur apparence résolue.',
      },
      hero: {
        chapter: 'Chapitre 03 · Thèmes',
        title: 'Conservez l’intention. Changez l’apparence.',
        description:
          'Un thème permet aux mêmes rôles d’interface de se résoudre vers des décisions de design différentes sans obliger chaque composant à connaître chaque apparence.',
        learnerQuestion:
          'Si le rôle reste le même, pourquoi sa valeur résolue devrait-elle parfois changer ?',
      },
      openingProblem: {
        eyebrow: 'Commençons par le contexte',
        title:
          'Une valeur correcte peut devenir mauvaise dans une autre apparence.',
        description:
          'Le chapitre 02 a donné une identité stable aux décisions partagées grâce aux tokens. Mais une valeur adaptée à une surface claire peut devenir inutilisable sur une surface sombre si chaque écran continue d’employer la même couleur résolue.',
        fixedLabel: 'Même valeur de contenu fixe',
        lightLabel: 'Surface claire',
        darkLabel: 'Surface sombre',
        fixedValue: '#070707',
        lightBackground: '#F7F3EB',
        darkBackground: '#070707',
        sampleText: 'Contenu principal',
        conclusion:
          'Le problème n’est plus de nommer la décision. Il faut maintenant choisir la bonne décision pour l’apparence active.',
      },
      definition: {
        eyebrow: 'La couche Theme',
        title:
          'Un thème associe des rôles stables à des références de tokens pour une apparence donnée.',
        description:
          'Le nom du rôle conserve son sens pour l’interface. Le thème décide quel token doit remplir ce rôle dans l’apparence active.',
        roleLabel: 'Rôle stable',
        role: 'content',
        lightLabel: 'Mapping clair',
        lightReference: '{color.primitive.neutral.950}',
        lightValue: '#070707',
        darkLabel: 'Mapping sombre',
        darkReference: '{color.primitive.neutral.100}',
        darkValue: '#E2E7EF',
        rule: 'Les composants peuvent demander « content » au lieu de coder eux-mêmes une couleur claire ou sombre.',
      },
      roles: {
        eyebrow: 'Mêmes rôles, mappings différents',
        title:
          'Le vocabulaire reste stable pendant que les références changent.',
        description:
          'Le seed VulcanForgeUI actuel emploie les mêmes clés de rôles cœur dans les deux apparences et les associe à des références différentes lorsque nécessaire.',
        roleLabel: 'Rôle',
        lightLabel: 'Clair',
        darkLabel: 'Sombre',
        items: {
          background: {
            role: 'background',
            lightReference: '{color.primitive.neutral.50}',
            lightValue: '#F7F3EB',
            darkReference: '{color.primitive.neutral.950}',
            darkValue: '#070707',
          },
          surface: {
            role: 'surface',
            lightReference: '{color.primitive.neutral.0}',
            lightValue: '#ffffff',
            darkReference: '{color.primitive.neutral.900}',
            darkValue: '#1E1E1E',
          },
          content: {
            role: 'content',
            lightReference: '{color.primitive.neutral.950}',
            lightValue: '#070707',
            darkReference: '{color.primitive.neutral.100}',
            darkValue: '#E2E7EF',
          },
          muted: {
            role: 'muted',
            lightReference: '{color.primitive.neutral.700}',
            lightValue: '#3A4454',
            darkReference: '{color.primitive.neutral.400}',
            darkValue: '#A0B1CA',
          },
          accent: {
            role: 'accent',
            lightReference: '{color.primitive.accent.secondary}',
            lightValue: '#586644',
            darkReference: '{color.primitive.accent.primary}',
            darkValue: '#FF8731',
          },
        },
        statuses:
          'Le produit actuel protège également les rôles intégrés info, success, warning et danger, et permet au projet d’ajouter des rôles couleur personnalisés dans ses thèmes existants.',
      },
      flow: {
        eyebrow: 'Flux de dépendance',
        title: 'Le composant consomme un rôle, le thème fournit l’apparence.',
        description:
          'Séparer ces responsabilités évite de faire remonter les choix de présentation dans chaque contrat de composant.',
        componentLabel: 'Intention du composant',
        component: 'Action principale',
        roleLabel: 'Rôle de thème',
        role: 'accent',
        mappingLabel: 'Mapping actif',
        mappingLight: 'Clair → #586644',
        mappingDark: 'Sombre → #FF8731',
        outcome:
          'Le composant peut rester conceptuellement identique tandis que l’apparence active modifie la couleur résolue.',
      },
      accessibility: {
        eyebrow: 'Un thème n’est pas une inversion de couleurs',
        title: 'Chaque apparence doit préserver contraste, usage et sens.',
        description:
          'Modifier les mappings crée de nouvelles relations entre premier plan et arrière-plan. Un thème sombre n’est pas automatiquement accessible parce qu’il est sombre, pas plus qu’un thème clair ne l’est parce qu’il est clair.',
        items: {
          contrast:
            'Réévaluez les contrastes texte et interface après chaque changement de mapping.',
          semantics:
            'Conservez le sens sémantique même lorsque la valeur visuelle change.',
          states:
            'Vérifiez les états d’interaction et de statut dans chaque apparence prise en charge.',
        },
        product:
          'VulcanForgeUI calcule actuellement des paires de contraste pour chaque Theme stocké à partir de ses rôles couleur résolus. Ce contrôle automatique aide à détecter des problèmes, mais ne constitue pas une certification d’accessibilité complète.',
      },
      broaderConcept: {
        eyebrow: 'Theme ≠ mode sombre',
        title:
          'Clair et Sombre sont des exemples de theming, pas sa définition.',
        description:
          'Un Design System peut utiliser des thèmes pour d’autres contextes d’apparence ou de préférence : contraste élevé, sépia, densité compacte, réduction des animations ou typographie personnalisée. Le modèle exact dépend du produit.',
        caution:
          'Ce concept plus large ne signifie pas que VulcanForgeUI prend actuellement ces apparences en charge.',
      },
      productBridge: {
        eyebrow: 'Comment VulcanForgeUI représente cela aujourd’hui',
        title:
          'Le domaine Theme actuel est volontairement plus étroit que le concept général.',
        description:
          'VulcanForgeUI ne persiste actuellement que deux modes de Theme : Light et Dark. Chaque projet peut posséder au maximum un Theme de chaque mode.',
        items: {
          modes: 'Le mode Theme est actuellement limité à light ou dark.',
          mapping:
            'Un Theme stocke des mappings de rôles couleur sous forme de références de tokens ou de valeurs directes héritées.',
          core: 'Les rôles cœur intégrés sont background, surface, content, muted et accent.',
          statuses:
            'Les rôles de statut intégrés sont info, success, warning et danger.',
          custom:
            'Les projets peuvent ajouter des rôles couleur personnalisés dans un Theme Light ou Dark existant.',
          preview:
            'Le workspace prévisualise des composants à partir des mappings Light et Dark résolus.',
          contrast:
            'Le workspace évalue les paires de contraste configurées pour chaque Theme.',
          exports:
            'Les données Theme alimentent des sorties générées telles que les variables CSS et les exports de thème TypeScript / React Native.',
        },
        boundary:
          'Ajouter un rôle personnalisé ne crée pas un nouveau Theme. Il n’existe actuellement ni création de Theme nommé arbitraire, ni mode Sepia, ni modèle d’héritage de Themes.',
      },
      demo: {
        eyebrow: 'Le projet Demo',
        title:
          'Le système partagé possède maintenant un vocabulaire stable pour deux apparences.',
        description:
          'Le chapitre 01 a établi les décisions partagées. Le chapitre 02 leur a donné des identités de tokens. Le chapitre 03 ajoute une couche de mapping pour faire varier l’apparence sans réécrire le vocabulaire utilisé par l’interface.',
        sequence: {
          decision: 'Décision partagée',
          token: 'Token',
          theme: 'Mapping de rôle Theme',
          component: 'Le composant utilise le rôle résolu',
        },
      },
      misconception: {
        eyebrow: 'Idée reçue fréquente',
        title:
          'Un Theme n’est pas une deuxième copie complète du Design System.',
        description:
          'Le but n’est pas de dupliquer chaque composant et chaque règle pour Light et Dark. L’intention partagée reste commune, seules les décisions qui doivent varier se résolvent différemment à travers la couche Theme.',
      },
      checkpoint: {
        eyebrow: 'Checkpoint',
        title: 'Avant de continuer, vous devez pouvoir expliquer…',
        description:
          'Si ces affirmations sont claires, le chapitre suivant peut passer de l’apparence globale du système aux contrats de composants.',
        items: {
          one: 'pourquoi un même rôle peut nécessiter une valeur résolue différente dans une autre apparence,',
          two: 'la différence entre un rôle stable et la référence de token attribuée par un Theme,',
          three:
            'pourquoi le theming est, en général, plus large que Light et Dark,',
          four: 'pourquoi VulcanForgeUI reste actuellement limité à exactement deux modes Theme, Light et Dark,',
          five: 'pourquoi chaque apparence prise en charge doit conserver sa propre revue d’accessibilité.',
        },
      },
      continue: {
        eyebrow: 'Chapitre suivant',
        status: 'Prochainement',
        title: 'Composants',
        description:
          'Les Themes expliquent comment les rôles d’apparence partagés se résolvent. Ensuite, nous définirons ce que contient réellement un contrat de composant : anatomie, variantes, tailles, états, contenu, accessibilité et bindings de tokens.',
      },
    },
  },
} as const;
