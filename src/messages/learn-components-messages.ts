export const learnComponentsMessages = {
  en: {
    LearnComponentsPage: {
      metadata: {
        title: 'Components — Learn | VulcanForgeUI',
        description:
          'Learn how a component contract turns a reusable interface element into a shared, structured agreement about purpose, anatomy, variation, behavior, tokens and accessibility.',
      },
      hero: {
        chapter: 'Chapter 04 · Components',
        title: 'A component is more than the thing you can see.',
        description:
          'A reusable component needs shared rules for what it is, how it can vary, how it behaves and which design decisions it depends on. A screenshot alone cannot carry that contract.',
        learnerQuestion:
          'What must a team agree on before “Button” means the same thing to design, code, documentation and AI?',
      },
      openingProblem: {
        eyebrow: 'Start with the missing information',
        title: 'A polished screenshot can still leave the component undefined.',
        description:
          'Imagine receiving only the visual below. You can see a button, but you still do not know the rules that make it reusable and predictable.',
        visualLabel: 'What the screenshot shows',
        buttonLabel: 'Save changes',
        questionLabel: 'What the screenshot does not tell you',
        questions: {
          anatomy: 'Which parts are required, optional or derived?',
          variants: 'Which variants and sizes are actually allowed?',
          states: 'What happens in focus, disabled or loading states?',
          behavior:
            'What content, accessibility and usage rules must implementations respect?',
        },
        conclusion:
          'The reusable asset is not only the rendered button. It is the shared agreement behind every valid instance of that button.',
      },
      definition: {
        eyebrow: 'The component contract',
        title:
          'A component contract describes the stable rules; an instance chooses among them.',
        description:
          'The contract gives the component a shared identity and a bounded set of choices. A concrete screen then creates one instance by selecting the relevant options and current state.',
        contractLabel: 'Shared contract',
        contractName: 'Button',
        items: {
          purpose: 'Purpose and usage intent',
          anatomy: 'Anatomy and structural parts',
          axes: 'Variants, sizes and states',
          rules: 'Content, accessibility and forbidden patterns',
        },
        instanceLabel: 'One valid instance',
        instanceName: 'Button',
        instanceMeta: 'primary · md · loading',
        rule: 'The instance can change from screen to screen. The contract is the common source that keeps those instances coherent.',
      },
      anatomy: {
        eyebrow: 'Anatomy',
        title: 'Name the parts before you try to govern them.',
        description:
          'Anatomy gives teams a vocabulary for the meaningful parts of a component. Those parts can then carry requirements and guidance without relying on a particular implementation framework.',
        sampleLabel: 'Current VulcanForgeUI Button seed',
        parts: {
          root: {
            label: 'root',
            requirement: 'required',
          },
          label: {
            label: 'label',
            requirement: 'required',
          },
          icon: {
            label: 'icon',
            requirement: 'required',
          },
        },
        boundary:
          'The current Demo seed marks root, label and icon as required. That is a VulcanForgeUI seed decision, not a universal rule for every Design System. The schema itself also supports optional and derived anatomy parts.',
      },
      axes: {
        eyebrow: 'Variation axes',
        title: 'Variant, size and state answer different questions.',
        description:
          'Keeping these axes separate prevents a component model from turning every combination into a new component name.',
        items: {
          variant: {
            label: 'Variant',
            values: 'primary · secondary',
            meaning:
              'Which intentional version of the same component family is being used?',
          },
          size: {
            label: 'Size',
            values: 'sm · md · lg',
            meaning: 'Which supported scale of the component is being used?',
          },
          state: {
            label: 'State',
            values: 'focusVisible · disabled · loading',
            meaning:
              'What transient interaction or system condition is the component currently in?',
          },
        },
        instanceLabel: 'Selected instance',
        instance: 'Button / primary / md / loading',
        rule: '“Loading” is not another visual variant of Button in the current seed. It is a state of an instance whose variant and size remain independently defined.',
      },
      rules: {
        eyebrow: 'Rules beyond appearance',
        title: 'A useful component contract records intent as well as shape.',
        description:
          'The current schema can hold localized purpose, usage and content guidance alongside behavioral constraints. The Demo Button seed already contains concrete accessibility and forbidden-pattern rules.',
        items: {
          purpose: {
            title: 'Purpose',
            description: 'Current seed: triggers an important user action.',
          },
          usage: {
            title: 'Usage guidance',
            description:
              'Optional localized guidance can explain where the component should or should not be used.',
          },
          content: {
            title: 'Content guidance',
            description:
              'Optional localized guidance can constrain labels, copy and other user-facing content.',
          },
          accessibility: {
            title: 'Accessibility rules',
            description:
              'Current seed requires an accessible name and keyboard activation with Enter and Space.',
          },
          forbidden: {
            title: 'Forbidden patterns',
            description:
              'Current seed explicitly says not to use a button as a navigation link.',
          },
        },
      },
      bindings: {
        eyebrow: 'Token bindings',
        title:
          'The component can depend on token paths instead of owning raw visual values.',
        description:
          'A binding names the role that the component preview understands, the expected token type and the project token path that supplies the value.',
        roleLabel: 'Binding',
        pathLabel: 'Token path',
        valueLabel: 'Resolved value',
        items: {
          background: {
            role: 'background',
            path: 'color.semantic.action.primary',
            value: '#FF8731',
          },
          foreground: {
            role: 'foreground',
            path: 'color.primitive.neutral.950',
            value: '#070707',
          },
          radius: {
            role: 'radius',
            path: 'radius.md',
            value: '0.5rem',
          },
          paddingX: {
            role: 'paddingX',
            path: 'spacing.4',
            value: '1rem',
          },
        },
        boundary:
          'Important current-product boundary: Component bindings are resolved directly from Token Sets. They do not currently reference Theme roles such as accent or content. Themes and Component bindings are therefore related Design System layers, but they are not yet one shared binding graph in VulcanForgeUI.',
      },
      accessibility: {
        eyebrow: 'Behavior is part of the component',
        title:
          'Accessibility rules belong in the contract, not in a final QA checklist only.',
        description:
          'For an interactive component, the shared model needs to preserve the behavior that makes the control understandable and operable—not just the colors and spacing that make it recognizable.',
        items: {
          accessibleName:
            'The current Button seed requires an accessible name.',
          keyboard:
            'The current Button seed requires activation with Enter and Space.',
          semantics:
            'The current forbidden pattern distinguishes an action button from navigation behavior.',
        },
        product:
          'VulcanForgeUI carries component accessibility rules as structured data and also feeds component-contract data into its Accessibility Center. Chapter 05 will examine what automated checks can and cannot prove.',
      },
      structuredSource: {
        eyebrow: 'One structured source, several consumers',
        title:
          'The contract becomes more valuable when other product surfaces can read it.',
        description:
          'VulcanForgeUI does not treat the Component editor as an isolated form. Structured contract data is reused by downstream surfaces.',
        items: {
          preview:
            'The Components workspace builds visual previews from variants, sizes, states and resolved token bindings.',
          documentation:
            'Markdown documentation includes component purpose, anatomy, variants, states, accessibility rules and forbidden patterns.',
          ai: 'AI instructions tell downstream assistants to use only documented components and variants and not invent APIs, states, slots or accessibility behavior.',
          accessibility:
            'The Accessibility Center can inspect component-contract sources alongside token and Theme data.',
        },
      },
      productBridge: {
        eyebrow: 'How VulcanForgeUI represents Components today',
        title:
          'The current contract model is rich, but the component identity model is still intentionally narrow.',
        description:
          'This chapter teaches the real structure already present in the product without pretending that the future Components Workspace V2 already exists.',
        typesLabel: 'Current first-class component types',
        types: 'button · textField · card · alert · dialog',
        items: {
          identity:
            'Persistence currently allows one ComponentContract of each predefined type per project.',
          lifecycle: 'A contract can be draft, ready or deprecated.',
          localization:
            'Purpose, guidance, labels, descriptions, accessibility rules and forbidden patterns can carry localized content.',
          anatomy: 'Anatomy parts can be required, optional or derived.',
          axes: 'Variants, sizes and states are stored as separate structured collections.',
          bindings:
            'Token bindings store a binding key, token type and direct token path.',
          workspace:
            'The current workspace is a structured editor with registry, form-oriented authoring, visual preview and AI contract preview.',
          downstream:
            'Component contracts feed generated documentation, AI instructions and accessibility analysis.',
        },
        boundary:
          'There is currently no arbitrary SearchBar or ProductCard creation, no freeform component canvas and no general component-composition model. Those questions belong to the later Components Workspace V2 discovery, not this Learn slice.',
      },
      demo: {
        eyebrow: 'The Demo project',
        title: 'Four chapters now form one dependency story.',
        description:
          'The learner can now follow a decision from system intent down to a reusable component contract without confusing each layer with the next.',
        sequence: {
          decision: 'Design System · agree on the shared decision',
          token: 'Token · give the decision a stable identity',
          theme: 'Theme · map appearance roles where context must vary',
          component:
            'Component · define the reusable contract that consumes system decisions',
        },
      },
      misconception: {
        eyebrow: 'Common misconception',
        title:
          'A component contract is neither a screenshot nor a framework component API.',
        description:
          'A screenshot captures one appearance. A React, Vue or native API captures one implementation. The Design System contract sits above both: it records the shared intent and constraints that implementations should preserve.',
      },
      checkpoint: {
        eyebrow: 'Checkpoint',
        title: 'Before moving on, you should be able to explain…',
        description:
          'If these statements are clear, Chapter 05 can focus on accessibility as a system property rather than introducing component semantics from scratch.',
        items: {
          one: 'why a rendered component instance is not the same thing as its reusable contract;',
          two: 'how anatomy, variants, sizes and states describe different dimensions of a component;',
          three:
            'why purpose, content, accessibility and forbidden patterns belong beside visual rules;',
          four: 'how current VulcanForgeUI Component token bindings resolve directly from Token Sets rather than Theme roles;',
          five: 'why structured component data can improve previews, documentation, accessibility analysis and AI guidance.',
        },
      },
      continue: {
        eyebrow: 'Next chapter',
        status: 'Up next',
        title: 'Accessibility',
        description:
          'Components expose where accessibility rules live. Next we will widen the lens to contrast, focus, semantics, automated checks, manual validation and the limits of an accessibility score.',
      },
    },
  },
  fr: {
    LearnComponentsPage: {
      metadata: {
        title: 'Composants — Apprendre | VulcanForgeUI',
        description:
          'Comprendre comment un contrat de composant transforme un élément d’interface réutilisable en accord partagé et structuré sur son rôle, son anatomie, ses variations, son comportement, ses tokens et son accessibilité.',
      },
      hero: {
        chapter: 'Chapitre 04 · Composants',
        title: 'Un composant est plus que ce que vous voyez.',
        description:
          'Un composant réutilisable a besoin de règles partagées sur ce qu’il est, la manière dont il peut varier, son comportement et les décisions de design dont il dépend. Une capture d’écran ne peut pas porter ce contrat à elle seule.',
        learnerQuestion:
          'Sur quoi une équipe doit-elle s’accorder avant que « Button » signifie la même chose pour le design, le code, la documentation et l’IA ?',
      },
      openingProblem: {
        eyebrow: 'Commençons par les informations manquantes',
        title:
          'Une capture soignée peut tout de même laisser le composant indéfini.',
        description:
          'Imaginez ne recevoir que le visuel ci-dessous. Vous voyez un bouton, mais vous ne connaissez toujours pas les règles qui le rendent réutilisable et prévisible.',
        visualLabel: 'Ce que montre la capture',
        buttonLabel: 'Enregistrer',
        questionLabel: 'Ce que la capture ne vous dit pas',
        questions: {
          anatomy: 'Quelles parties sont requises, optionnelles ou dérivées ?',
          variants: 'Quelles variantes et tailles sont réellement autorisées ?',
          states: 'Que se passe-t-il en focus, désactivé ou chargement ?',
          behavior:
            'Quelles règles de contenu, d’accessibilité et d’usage les implémentations doivent-elles respecter ?',
        },
        conclusion:
          'L’actif réutilisable n’est pas seulement le bouton rendu. C’est l’accord partagé qui se trouve derrière chaque instance valide de ce bouton.',
      },
      definition: {
        eyebrow: 'Le contrat de composant',
        title:
          'Un contrat décrit les règles stables ; une instance choisit parmi elles.',
        description:
          'Le contrat donne au composant une identité partagée et un ensemble borné de choix. Un écran concret crée ensuite une instance en sélectionnant les options pertinentes et l’état courant.',
        contractLabel: 'Contrat partagé',
        contractName: 'Button',
        items: {
          purpose: 'Rôle et intention d’usage',
          anatomy: 'Anatomie et parties structurelles',
          axes: 'Variantes, tailles et états',
          rules: 'Contenu, accessibilité et patterns interdits',
        },
        instanceLabel: 'Une instance valide',
        instanceName: 'Button',
        instanceMeta: 'primary · md · loading',
        rule: 'L’instance peut changer d’un écran à l’autre. Le contrat est la source commune qui maintient leur cohérence.',
      },
      anatomy: {
        eyebrow: 'Anatomie',
        title: 'Nommez les parties avant d’essayer de les gouverner.',
        description:
          'L’anatomie fournit aux équipes un vocabulaire pour les parties significatives d’un composant. Ces parties peuvent ensuite porter des exigences et de la guidance sans dépendre d’un framework d’implémentation particulier.',
        sampleLabel: 'Seed Button actuel de VulcanForgeUI',
        parts: {
          root: {
            label: 'root',
            requirement: 'required',
          },
          label: {
            label: 'label',
            requirement: 'required',
          },
          icon: {
            label: 'icon',
            requirement: 'required',
          },
        },
        boundary:
          'Le seed Demo actuel marque root, label et icon comme requis. C’est une décision du seed VulcanForgeUI, pas une règle universelle pour tous les Design Systems. Le schéma accepte aussi des parties d’anatomie optional et derived.',
      },
      axes: {
        eyebrow: 'Axes de variation',
        title:
          'Variante, taille et état répondent à des questions différentes.',
        description:
          'Séparer ces axes évite de transformer chaque combinaison en un nouveau nom de composant.',
        items: {
          variant: {
            label: 'Variante',
            values: 'primary · secondary',
            meaning:
              'Quelle version intentionnelle de la même famille de composant est utilisée ?',
          },
          size: {
            label: 'Taille',
            values: 'sm · md · lg',
            meaning:
              'Quelle échelle prise en charge du composant est utilisée ?',
          },
          state: {
            label: 'État',
            values: 'focusVisible · disabled · loading',
            meaning:
              'Dans quelle condition transitoire d’interaction ou de système le composant se trouve-t-il ?',
          },
        },
        instanceLabel: 'Instance sélectionnée',
        instance: 'Button / primary / md / loading',
        rule: '« Loading » n’est pas une nouvelle variante visuelle de Button dans le seed actuel. C’est l’état d’une instance dont la variante et la taille restent définies indépendamment.',
      },
      rules: {
        eyebrow: 'Des règles au-delà de l’apparence',
        title: 'Un contrat utile enregistre l’intention autant que la forme.',
        description:
          'Le schéma actuel peut contenir un purpose, de la guidance d’usage et de contenu localisés ainsi que des contraintes comportementales. Le seed Demo Button contient déjà des règles concrètes d’accessibilité et de patterns interdits.',
        items: {
          purpose: {
            title: 'Purpose',
            description:
              'Seed actuel : déclenche une action importante de l’utilisateur.',
          },
          usage: {
            title: 'Guidance d’usage',
            description:
              'Une guidance localisée optionnelle peut expliquer où le composant doit ou ne doit pas être utilisé.',
          },
          content: {
            title: 'Guidance de contenu',
            description:
              'Une guidance localisée optionnelle peut encadrer les libellés, la copie et les autres contenus visibles.',
          },
          accessibility: {
            title: 'Règles d’accessibilité',
            description:
              'Le seed actuel exige un nom accessible et une activation clavier avec Entrée et Espace.',
          },
          forbidden: {
            title: 'Patterns interdits',
            description:
              'Le seed actuel indique explicitement de ne pas utiliser un bouton comme lien de navigation.',
          },
        },
      },
      bindings: {
        eyebrow: 'Bindings de tokens',
        title:
          'Le composant peut dépendre de chemins de tokens au lieu de posséder des valeurs visuelles brutes.',
        description:
          'Un binding nomme le rôle compris par la preview du composant, le type de token attendu et le chemin de token projet qui fournit la valeur.',
        roleLabel: 'Binding',
        pathLabel: 'Chemin de token',
        valueLabel: 'Valeur résolue',
        items: {
          background: {
            role: 'background',
            path: 'color.semantic.action.primary',
            value: '#FF8731',
          },
          foreground: {
            role: 'foreground',
            path: 'color.primitive.neutral.950',
            value: '#070707',
          },
          radius: {
            role: 'radius',
            path: 'radius.md',
            value: '0.5rem',
          },
          paddingX: {
            role: 'paddingX',
            path: 'spacing.4',
            value: '1rem',
          },
        },
        boundary:
          'Frontière produit importante : les bindings de Components sont actuellement résolus directement depuis les Token Sets. Ils ne référencent pas les rôles Theme comme accent ou content. Themes et bindings de Components sont donc des couches liées du Design System, mais ne forment pas encore un graphe de binding unique dans VulcanForgeUI.',
      },
      accessibility: {
        eyebrow: 'Le comportement fait partie du composant',
        title:
          'Les règles d’accessibilité appartiennent au contrat, pas seulement à une checklist de QA finale.',
        description:
          'Pour un composant interactif, le modèle partagé doit préserver les comportements qui rendent le contrôle compréhensible et utilisable, pas seulement les couleurs et espacements qui le rendent reconnaissable.',
        items: {
          accessibleName: 'Le seed Button actuel exige un nom accessible.',
          keyboard:
            'Le seed Button actuel exige une activation avec Entrée et Espace.',
          semantics:
            'Le pattern interdit actuel distingue une action de bouton d’un comportement de navigation.',
        },
        product:
          'VulcanForgeUI conserve les règles d’accessibilité des composants sous forme de données structurées et transmet également les données ComponentContract à son Accessibility Center. Le chapitre 05 examinera ce que les contrôles automatisés peuvent et ne peuvent pas prouver.',
      },
      structuredSource: {
        eyebrow: 'Une source structurée, plusieurs consommateurs',
        title:
          'Le contrat gagne en valeur lorsque d’autres surfaces produit peuvent le lire.',
        description:
          'VulcanForgeUI ne traite pas l’éditeur Components comme un formulaire isolé. Les données structurées du contrat sont réutilisées par plusieurs surfaces en aval.',
        items: {
          preview:
            'Le workspace Components construit des previews visuelles à partir des variantes, tailles, états et bindings de tokens résolus.',
          documentation:
            'La documentation Markdown inclut le purpose, l’anatomie, les variantes, les états, les règles d’accessibilité et les patterns interdits.',
          ai: 'Les instructions IA imposent aux assistants en aval d’utiliser uniquement les composants et variantes documentés et de ne pas inventer d’API, d’états, de slots ou de comportements d’accessibilité.',
          accessibility:
            'L’Accessibility Center peut inspecter les sources ComponentContract en parallèle des données Tokens et Themes.',
        },
      },
      productBridge: {
        eyebrow: 'Comment VulcanForgeUI représente les Components aujourd’hui',
        title:
          'Le modèle de contrat actuel est riche, mais le modèle d’identité des composants reste volontairement étroit.',
        description:
          'Ce chapitre enseigne la structure réellement présente dans le produit sans prétendre que le futur Components Workspace V2 existe déjà.',
        typesLabel: 'Types de composants first-class actuels',
        types: 'button · textField · card · alert · dialog',
        items: {
          identity:
            'La persistence autorise actuellement un ComponentContract de chaque type prédéfini par projet.',
          lifecycle: 'Un contrat peut être draft, ready ou deprecated.',
          localization:
            'Purpose, guidance, labels, descriptions, règles d’accessibilité et patterns interdits peuvent porter du contenu localisé.',
          anatomy:
            'Les parties d’anatomie peuvent être required, optional ou derived.',
          axes: 'Variantes, tailles et états sont stockés dans des collections structurées séparées.',
          bindings:
            'Les bindings de tokens stockent une clé de binding, un type de token et un chemin de token direct.',
          workspace:
            'Le workspace actuel est un éditeur structuré avec registre, authoring orienté formulaire, preview visuelle et preview du contrat IA.',
          downstream:
            'Les contrats de composants alimentent la documentation générée, les instructions IA et l’analyse d’accessibilité.',
        },
        boundary:
          'Il n’existe actuellement ni création arbitraire de SearchBar ou ProductCard, ni canvas de composant libre, ni modèle général de composition de composants. Ces questions appartiennent à la future discovery du Components Workspace V2, pas à cette itération Learn.',
      },
      demo: {
        eyebrow: 'Le projet Demo',
        title:
          'Quatre chapitres forment maintenant une seule histoire de dépendances.',
        description:
          'L’apprenant peut désormais suivre une décision depuis l’intention du système jusqu’au contrat d’un composant réutilisable sans confondre chaque couche avec la suivante.',
        sequence: {
          decision: 'Design System · convenir de la décision partagée',
          token: 'Token · donner une identité stable à la décision',
          theme:
            'Theme · mapper les rôles d’apparence lorsque le contexte doit varier',
          component:
            'Component · définir le contrat réutilisable qui consomme les décisions du système',
        },
      },
      misconception: {
        eyebrow: 'Idée reçue fréquente',
        title:
          'Un contrat de composant n’est ni une capture d’écran ni l’API d’un composant de framework.',
        description:
          'Une capture fige une apparence. Une API React, Vue ou native fige une implémentation. Le contrat de Design System se situe au-dessus des deux : il enregistre l’intention et les contraintes partagées que les implémentations doivent préserver.',
      },
      checkpoint: {
        eyebrow: 'Checkpoint',
        title: 'Avant de continuer, vous devez pouvoir expliquer…',
        description:
          'Si ces affirmations sont claires, le chapitre 05 pourra traiter l’accessibilité comme une propriété du système plutôt que de réintroduire la sémantique des composants depuis zéro.',
        items: {
          one: 'pourquoi une instance de composant rendue n’est pas la même chose que son contrat réutilisable ;',
          two: 'comment anatomie, variantes, tailles et états décrivent des dimensions différentes d’un composant ;',
          three:
            'pourquoi purpose, contenu, accessibilité et patterns interdits doivent accompagner les règles visuelles ;',
          four: 'comment les bindings de tokens Components actuels de VulcanForgeUI se résolvent directement depuis les Token Sets plutôt que depuis les rôles Theme ;',
          five: 'pourquoi des données de composant structurées peuvent améliorer les previews, la documentation, l’analyse d’accessibilité et la guidance IA.',
        },
      },
      continue: {
        eyebrow: 'Chapitre suivant',
        status: 'Prochainement',
        title: 'Accessibilité',
        description:
          'Les Components montrent où vivent les règles d’accessibilité. Ensuite, nous élargirons la focale au contraste, au focus, à la sémantique, aux contrôles automatisés, à la validation manuelle et aux limites d’un score d’accessibilité.',
      },
    },
  },
} as const;
