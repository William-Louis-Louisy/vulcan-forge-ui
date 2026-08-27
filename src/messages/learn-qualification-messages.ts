export const learnQualificationMessages = {
  en: {
    LearnPage: {
      curriculum: {
        description:
          'Follow the recommended path from the reason Design Systems exist to the structured context they can provide to AI tools. All seven chapters are now available.',
      },
    },
    LearnDesignSystemsPage: { continue: { status: 'Available' } },
    LearnDesignTokensPage: { continue: { status: 'Available' } },
    LearnThemesPage: { continue: { status: 'Available' } },
    LearnComponentsPage: { continue: { status: 'Available' } },
    LearnAccessibilityPage: { continue: { status: 'Available' } },
    LearnDocumentationDeliveryPage: { continue: { status: 'Available' } },
  },
  fr: {
    LearnPage: {
      metadata: {
        title: 'Apprendre les Design Systems · VulcanForgeUI',
        description:
          'Découvrez les concepts qui structurent un Design System : tokens, thèmes, composants, accessibilité, documentation, livraison et contexte pour l’IA.',
      },
      hero: {
        eyebrow: 'Apprendre · Design Systems',
        description:
          'Un parcours centré sur les concepts pour les développeurs et designers qui veulent comprendre comment des décisions partagées deviennent un système réutilisable, accessible, structuré et exploitable par une machine.',
        reassurance:
          'Aucune expertise préalable en Design System n’est requise.',
      },
      curriculum: {
        eyebrow: 'Parcours',
        title: 'Sept chapitres. Un même modèle mental.',
        description:
          'Parcourez les sept chapitres, depuis les raisons d’être d’un Design System jusqu’au contexte structuré qu’il peut fournir à des outils d’IA. L’ensemble du parcours est désormais disponible.',
        navigationLabel: 'Parcours d’apprentissage',
        chapters: {
          designSystems: {
            title: 'Qu’est-ce qu’un Design System ?',
            description:
              'Comprenez la dérive des choix de design, l’intérêt des décisions partagées et pourquoi un Design System dépasse une simple bibliothèque de composants.',
          },
          designTokens: {
            title: 'Design Tokens',
            description:
              'Passez de valeurs brutes répétées à des tokens primitifs, à une intention sémantique et à des références réutilisables.',
          },
          themes: {
            title: 'Thèmes',
            description:
              'Découvrez comment un même rôle sémantique peut prendre des valeurs visuelles différentes selon le contexte d’apparence.',
          },
          components: {
            title: 'Composants',
            description:
              'Comprenez comment anatomie, variantes, tailles, états, règles d’usage et liaisons de tokens forment un contrat de composant.',
          },
          accessibility: {
            title: 'Accessibilité',
            description:
              'Traitez le contraste, le focus et la sémantique des états comme des décisions du système, et non comme une liste de contrôle finale automatisée.',
          },
          documentationDelivery: {
            title: 'Documentation et livraison',
            description:
              'Comprenez comment une source structurée peut alimenter une documentation lisible et plusieurs formats d’implémentation.',
          },
          aiReady: {
            title: 'Design Systems prêts pour l’IA',
            description:
              'Découvrez pourquoi une structure explicite fournit un meilleur contexte aux assistants IA sans leur donner le contrôle.',
          },
        },
      },
      progression: {
        description:
          'Learn suit un même fil conducteur : rendre les décisions produit explicites, les relier dans un système, puis permettre à plusieurs consommateurs de s’appuyer sur la même source.',
        nodes: {
          system: 'Thèmes et composants',
          delivery: 'Documentation et exports',
        },
      },
      boundary: {
        title: 'Comprenez le concept. Découvrez ensuite le produit.',
        learnTitle: 'Apprendre',
        learnDescription:
          'Des explications centrées sur les concepts pour construire votre compréhension des Design Systems avant d’utiliser un outil particulier.',
        examplesDescription:
          'Une démonstration centrée sur le produit qui montre comment VulcanForgeUI relie une décision de design tout au long de son parcours.',
        examplesCta: 'Voir la démonstration du produit',
      },
    },
    LearnDesignSystemsPage: {
      metadata: {
        title: 'Qu’est-ce qu’un Design System ? · VulcanForgeUI Learn',
      },
      hero: {
        title:
          'Un Design System ne se résume pas à des composants réutilisables.',
        description:
          'C’est un ensemble partagé de décisions, de fondations, de composants et de recommandations qui aide un produit à rester cohérent à mesure que les équipes, les écrans et les technologies se multiplient.',
        learnerQuestion:
          'Pourquoi une équipe aurait-elle besoin d’un Design System plutôt que de simplement réutiliser quelques composants ?',
      },
      openingProblem: {
        title:
          'Des choix raisonnables finissent par diverger lorsque personne ne porte la décision commune.',
        description:
          'Imaginez trois équipes qui conçoivent indépendamment la même action principale. Chaque résultat est cohérent pris isolément. Mis côte à côte, ils révèlent une dérive du système.',
        cards: {
          first: {
            radius: 'Rayon de 14 px',
            padding: 'Espacement intérieur : 12 × 16 px',
            focus: 'Indicateur de focus visible',
          },
          second: {
            radius: 'Rayon de 4 px',
            padding: 'Espacement intérieur : 8 × 24 px',
            focus: 'Indicateur de focus visible',
          },
          third: {
            radius: 'Forme pilule',
            padding: 'Espacement intérieur : 14 × 18 px',
            focus: 'Aucun traitement de focus défini en commun',
          },
        },
        conclusion:
          'Le problème n’est pas qu’une équipe ait choisi une mauvaise valeur. Le problème est que le produit ne dispose pas d’une réponse commune à une même question récurrente.',
      },
      definition: {
        title:
          'Un Design System transforme des choix répétés en connaissances produit partagées.',
        intro:
          'Chaque Design System organise ces connaissances à sa manière, mais les systèmes matures réunissent généralement plusieurs types de ressources partagées au lieu de se limiter à des composants de code.',
        parts: {
          language: {
            description:
              'Des noms et des concepts communs permettent aux designers, développeurs et autres métiers du produit de parler des mêmes décisions sans devoir traduire leurs vocabulaires respectifs.',
          },
          foundations: {
            description:
              'Couleurs, espacements, typographie, animations et autres décisions récurrentes deviennent des fondations explicites plutôt que des valeurs recréées écran par écran.',
          },
          components: {
            description:
              'Des briques d’interface réutilisables regroupent des structures et comportements récurrents afin que les équipes n’aient pas à repartir de zéro pour chaque interaction.',
          },
        },
      },
      distinction: {
        description:
          'Une bibliothèque répond à la question « quelle interface réutilisable puis-je afficher ? ». Un Design System aide aussi à répondre à « quelle décision devons-nous prendre, pourquoi, et comment la maintenir cohérente dans tout le produit ? ».',
        library: {
          items: {
            two: 'API et code d’implémentation',
          },
        },
        system: {
          items: {
            three:
              'Règles d’usage, accessibilité et connaissances d’utilisation',
          },
        },
      },
      whyMatters: {
        title:
          'Le système évite de refaire les mêmes choix, pas seulement d’écrire le même code.',
        description:
          'La cohérence est utile, mais le bénéfice le plus profond est de faire sortir les connaissances importantes des fichiers isolés, des maquettes et de la mémoire de quelques personnes.',
        items: {
          continuity: {
            description:
              'Une décision partagée peut rester valable malgré de nouveaux écrans, de nouvelles équipes ou des changements de personnes, sans devoir être redécouverte à chaque fois.',
          },
          quality: { title: 'Qualité homogène' },
          collaboration: {
            description:
              'Designers et développeurs peuvent discuter de l’intention avec les mêmes concepts au lieu de traiter les maquettes et le code comme deux sources de référence distinctes.',
          },
        },
      },
      demo: {
        bridge:
          'La transformation essentielle est la suivante : valeur brute → décision partagée. Les couches techniques viennent ensuite.',
      },
      systemMap: {
        description:
          'L’architecture exacte varie selon les organisations. Gardez ce modèle simplifié en tête pendant que les chapitres suivants l’enrichissent.',
        nodes: {
          intent: 'Intention produit et marque',
          foundations: 'Fondations et décisions de design',
          guidance: 'Règles et attentes d’accessibilité',
        },
      },
      productBridge: {
        title:
          'VulcanForgeUI organise le système en espaces de travail reliés entre eux.',
        description:
          'Ces espaces ne remplacent pas la réflexion autour du Design System. Ils donnent aux décisions une structure commune afin que les personnes comme les sorties générées puissent s’appuyer sur le même projet.',
        items: {
          brand:
            'L’espace Brand formalise l’intention et la direction du projet.',
          tokens:
            'L’espace Tokens rend explicites les décisions de design réutilisables.',
          themes:
            'L’espace Themes associe des rôles sémantiques à des décisions adaptées à chaque apparence.',
          components:
            'L’espace Components décrit les contrats des composants réutilisables.',
          accessibility:
            'L’espace Accessibility regroupe les vérifications que le produit sait automatiser.',
          delivery:
            'Documentation, Exports et AI Instructions consomment les données structurées du projet.',
        },
        examplesCta: 'Voir le parcours du projet Demo',
      },
      checkpoint: {
        title: 'Vous devriez maintenant pouvoir expliquer :',
      },
      continue: {
        title: 'Ensuite : Design Tokens',
        status: 'Disponible',
      },
    },
    LearnDesignTokensPage: {
      hero: {
        description:
          'Une valeur brute indique ce qu’est une donnée. Un token bien structuré peut aussi préciser ce que signifie la décision, où elle s’inscrit et de quelles autres décisions elle dépend.',
        learnerQuestion:
          'Qu’est-ce qui change lorsque #A94E2F cesse d’être une couleur recopiée pour devenir une décision de design partagée ?',
      },
      openingProblem: {
        cards: {
          checkout: { title: 'Action de validation de commande' },
        },
        conclusion:
          'L’équipe partage une seule décision, mais le produit en contient encore trois copies indépendantes. Un token donne à cette décision un identifiant stable.',
      },
      definition: {
        description:
          'Le Design Tokens Community Group décrit les tokens comme des éléments indivisibles d’un Design System. Le principe à retenir est simple : au lieu de faire circuler des valeurs anonymes, donnez aux décisions importantes un nom stable et une valeur structurée.',
      },
      semantic: {
        description:
          'Un token sémantique répond à une autre question : quel rôle cette décision joue-t-elle dans l’interface ? Cette couche supplémentaire permet à l’intention de rester stable même lorsque l’apparence sous-jacente change.',
        compare: {
          primitive: { question: 'Quelle valeur de fondation est-ce ?' },
          semantic: { question: 'Quel rôle cette décision joue-t-elle ?' },
        },
        boundary:
          'Les notions de token primitif et de token sémantique correspondent à des couches d’architecture courantes ; ce ne sont pas des types universels imposés par la spécification DTCG.',
      },
      references: {
        description:
          'La DTCG emploie « alias » et « référence » comme synonymes pour un token dont la valeur pointe vers un autre token. VulcanForgeUI utilise la même notation entre accolades pour représenter ces relations.',
      },
      naming: {
        title:
          'Un chemin utile indique à quel niveau se rattache une décision.',
        note: 'Aucun des deux noms n’est automatiquement bon ou mauvais : ils répondent à des questions différentes. L’essentiel est d’utiliser chaque couche de manière intentionnelle.',
      },
      categories: {
        title:
          'Les tokens peuvent représenter différents types d’informations de design récurrentes.',
        description:
          'VulcanForgeUI modélise actuellement cinq types de jeux de tokens. Leurs valeurs n’ont pas toutes la même forme et le modèle primitif/sémantique utilisé pour l’édition des couleurs ne doit pas être généralisé aux autres catégories.',
        items: {
          motion: {
            title: 'Animation (motion)',
            example: '150 ms',
            description: 'Décisions de durée et de transition réutilisables.',
          },
        },
      },
      demo: {
        note: 'La page publique Examples conserve le libellé plus court color.brand.600 pour sa présentation générale. Dans l’éditeur de tokens actuel, les couleurs primitives et les références sémantiques utilisent explicitement les chemins color.primitive.* et color.semantic.*.',
      },
      productBridge: {
        items: {
          path: 'Le chemin identifie le token dans le projet.',
          type: 'Le type est color, spacing, radius, typography ou motion.',
          value:
            'La valeur contient soit une donnée simple, soit une valeur typographique structurée.',
          reference:
            'La référence peut pointer vers un autre token avec la syntaxe {token.path}.',
          description:
            'La description peut documenter la décision en anglais et en français.',
          status:
            'Le statut de cycle de vie indique si le token est Draft, Ready ou Deprecated.',
        },
        boundary:
          'Aujourd’hui, VulcanForgeUI propose une création primitive/sémantique dédiée aux tokens de couleur. Il ne faut pas en déduire que toutes les catégories disposent déjà du même parcours d’édition.',
      },
      misconception: {
        description:
          'Une variable CSS peut être une représentation générée d’un token, mais le token représente la décision du Design System elle-même. Les mêmes données projet peuvent ensuite alimenter CSS, TypeScript, React Native, la documentation ou les consignes IA.',
      },
      checkpoint: { title: 'Vous devriez maintenant pouvoir expliquer :' },
      continue: {
        title: 'Ensuite : Thèmes',
        status: 'Disponible',
        description:
          'Maintenant que les tokens expriment des valeurs réutilisables et une intention, le chapitre suivant montre comment les thèmes associent ces décisions à différentes apparences sans obliger les composants à coder leurs valeurs en dur.',
      },
    },
    LearnThemesPage: {
      metadata: {
        description:
          'Comprendre comment les thèmes conservent des rôles d’interface stables tout en faisant varier les tokens qui leur sont associés et leur apparence finale.',
      },
      hero: {
        description:
          'Un thème permet à un même rôle d’interface de prendre des valeurs de design différentes sans obliger chaque composant à connaître toutes les apparences possibles.',
        learnerQuestion:
          'Si le rôle reste le même, pourquoi sa valeur résolue devrait-elle parfois changer ?',
      },
      definition: {
        eyebrow: 'La couche des thèmes',
        title:
          'Un thème associe des rôles stables à des références de tokens pour une apparence donnée.',
        description:
          'Le nom du rôle conserve son sens pour l’interface. Le thème choisit le token qui doit remplir ce rôle dans l’apparence active.',
        lightLabel: 'Association claire',
        darkLabel: 'Association sombre',
        rule: 'Les composants peuvent demander le rôle « content » au lieu de coder eux-mêmes une couleur claire ou sombre.',
      },
      roles: {
        eyebrow: 'Mêmes rôles, associations différentes',
        description:
          'La configuration initiale de VulcanForgeUI emploie les mêmes rôles principaux dans les deux apparences et les associe à des références différentes lorsque c’est nécessaire.',
        statuses:
          'Le produit protège également les rôles intégrés info, success, warning et danger, et permet d’ajouter des rôles de couleur personnalisés dans les thèmes existants.',
      },
      flow: {
        eyebrow: 'Chaîne de dépendance',
        title: 'Le composant consomme un rôle ; le thème fournit l’apparence.',
        description:
          'Cette séparation évite de répéter les choix de présentation dans chaque contrat de composant.',
        mappingLabel: 'Association active',
      },
      accessibility: {
        product:
          'VulcanForgeUI calcule actuellement des paires de contraste pour chaque thème enregistré à partir de ses rôles de couleur résolus. Ce contrôle automatique aide à détecter des problèmes, mais ne constitue pas une certification complète d’accessibilité.',
      },
      broaderConcept: {
        eyebrow: 'Un thème ≠ un mode sombre',
        title:
          'Les apparences claire et sombre sont des exemples de thèmes, pas la définition du concept.',
        description:
          'Un Design System peut utiliser des thèmes pour d’autres contextes d’apparence ou de préférence : contraste élevé, sépia, densité compacte, réduction des animations ou typographie personnalisée. Le modèle exact dépend du produit.',
      },
      productBridge: {
        title:
          'Le modèle de thèmes actuel est volontairement plus limité que le concept général.',
        description:
          'VulcanForgeUI ne persiste actuellement que deux modes de thème : light et dark. Chaque projet peut posséder au maximum un thème pour chacun de ces modes.',
        items: {
          modes: 'Le mode d’un thème est actuellement limité à light ou dark.',
          mapping:
            'Un thème stocke des associations de rôles de couleur sous forme de références de tokens ou de valeurs directes héritées.',
          core: 'Les rôles principaux intégrés sont background, surface, content, muted et accent.',
          custom:
            'Un projet peut ajouter des rôles de couleur personnalisés dans un thème Light ou Dark existant.',
          preview:
            'L’espace de travail affiche un aperçu des composants avec les associations Light et Dark résolues.',
          contrast:
            'L’espace de travail évalue les paires de contraste configurées pour chaque thème.',
          exports:
            'Les données de thème alimentent notamment les variables CSS et les exports de thèmes TypeScript et React Native.',
        },
        boundary:
          'Ajouter un rôle personnalisé ne crée pas un nouveau thème. Il n’existe actuellement ni création arbitraire de thèmes nommés, ni mode sépia, ni modèle d’héritage entre thèmes.',
      },
      demo: {
        description:
          'Le chapitre 01 a établi les décisions partagées. Le chapitre 02 leur a donné des identités de tokens. Le chapitre 03 ajoute une couche d’association afin que l’apparence puisse varier sans changer le vocabulaire utilisé par l’interface.',
        sequence: {
          theme: 'Thème · associer les rôles d’apparence au contexte',
        },
      },
      misconception: {
        title:
          'Un thème n’est pas une deuxième copie complète du Design System.',
        description:
          'Le but n’est pas de dupliquer chaque composant et chaque règle pour Light et Dark. L’intention partagée reste commune ; seules les décisions qui doivent varier prennent une valeur différente dans la couche des thèmes.',
      },
      checkpoint: {
        eyebrow: 'Point de contrôle',
        items: {
          two: 'la différence entre un rôle stable et la référence de token attribuée par un thème,',
          three:
            'pourquoi la gestion des thèmes dépasse, en tant que concept, les seules apparences Light et Dark,',
          four: 'pourquoi VulcanForgeUI reste actuellement limité à deux modes de thème, Light et Dark,',
        },
      },
      continue: {
        status: 'Disponible',
        description:
          'Les thèmes expliquent comment les rôles d’apparence partagés prennent leur valeur. Le chapitre suivant détaille ce que contient un contrat de composant : anatomie, variantes, tailles, états, contenu, accessibilité et liaisons de tokens.',
      },
    },
    LearnComponentsPage: {
      hero: {
        learnerQuestion:
          'Sur quoi une équipe doit-elle s’accorder avant que « Button » désigne la même chose pour le design, le code, la documentation et l’IA ?',
      },
      openingProblem: {
        questions: {
          states:
            'Que se passe-t-il lorsque le composant reçoit le focus, est désactivé ou se trouve en cours de chargement ?',
        },
        conclusion:
          'L’élément réutilisable n’est pas seulement le bouton affiché. C’est l’accord partagé qui définit chaque instance valide de ce bouton.',
      },
      definition: {
        title:
          'Un contrat décrit les règles stables ; une instance choisit parmi les possibilités prévues.',
        description:
          'Le contrat donne au composant une identité partagée et un ensemble défini de choix. Un écran concret crée ensuite une instance en sélectionnant les options pertinentes et l’état courant.',
        items: {
          rules: 'Contenu, accessibilité et usages interdits',
        },
      },
      anatomy: {
        title: 'Nommez les parties avant de chercher à les encadrer.',
        description:
          'L’anatomie fournit aux équipes un vocabulaire commun pour les parties significatives d’un composant. Ces parties peuvent ensuite porter des exigences et des recommandations sans dépendre d’un framework particulier.',
        sampleLabel: 'Configuration initiale du Button dans VulcanForgeUI',
        parts: {
          root: { requirement: 'obligatoire' },
          label: { requirement: 'obligatoire' },
          icon: { requirement: 'obligatoire' },
        },
        boundary:
          'La configuration Demo actuelle marque root, label et icon comme obligatoires. C’est un choix propre à VulcanForgeUI, pas une règle universelle des Design Systems. Le schéma accepte également des parties optionnelles ou dérivées.',
      },
      axes: {
        items: {
          variant: {
            meaning:
              'Quelle version intentionnelle de cette famille de composants est utilisée ?',
          },
          size: {
            meaning: 'Quelle taille prise en charge est utilisée ?',
          },
          state: {
            meaning:
              'Dans quel état temporaire d’interaction ou de fonctionnement le composant se trouve-t-il ?',
          },
        },
        rule: 'L’état « loading » n’est pas une nouvelle variante visuelle du Button dans la configuration actuelle. C’est un état de l’instance ; sa variante et sa taille restent définies séparément.',
      },
      rules: {
        description:
          'Le schéma actuel peut contenir une finalité, des recommandations d’usage et de contenu localisées, ainsi que des contraintes de comportement. La configuration Demo du Button contient déjà des règles concrètes d’accessibilité et des usages interdits.',
        items: {
          purpose: {
            title: 'Finalité',
            description:
              'Dans la configuration actuelle : déclencher une action importante de l’utilisateur.',
          },
          usage: {
            title: 'Recommandations d’usage',
            description:
              'Des recommandations localisées peuvent expliquer où le composant doit ou ne doit pas être utilisé.',
          },
          content: {
            title: 'Recommandations de contenu',
            description:
              'Des recommandations localisées peuvent encadrer les libellés, les textes et les autres contenus visibles.',
          },
          forbidden: {
            title: 'Usages interdits',
          },
        },
      },
      bindings: {
        eyebrow: 'Liaisons de tokens',
        title:
          'Le composant peut dépendre de chemins de tokens plutôt que de posséder ses propres valeurs visuelles brutes.',
        description:
          'Une liaison indique le rôle compris par l’aperçu du composant, le type de token attendu et le chemin du token qui fournit la valeur.',
        roleLabel: 'Liaison',
        boundary:
          'Limite actuelle du produit : les liaisons des composants sont résolues directement depuis les jeux de tokens. Elles ne référencent pas encore les rôles de thème comme accent ou content. Ces deux couches du Design System sont liées, mais ne forment pas encore un graphe de liaisons unique dans VulcanForgeUI.',
      },
      accessibility: {
        title:
          'Les règles d’accessibilité appartiennent au contrat, pas seulement à une liste de contrôle finale.',
        product:
          'VulcanForgeUI conserve les règles d’accessibilité des composants sous forme de données structurées et transmet aussi les contrats de composants à l’Accessibility Center. Le chapitre 05 détaille ce que les contrôles automatisés peuvent ou non démontrer.',
      },
      structuredSource: {
        title:
          'Le contrat gagne en valeur lorsque d’autres fonctionnalités du produit peuvent l’exploiter.',
        description:
          'VulcanForgeUI ne traite pas l’espace Components comme un formulaire isolé. Les données structurées du contrat sont réutilisées en aval.',
        items: {
          preview:
            'L’espace Components construit des aperçus visuels à partir des variantes, tailles, états et liaisons de tokens résolues.',
          documentation:
            'La documentation Markdown inclut la finalité, l’anatomie, les variantes, les états, les règles d’accessibilité et les usages interdits.',
          ai: 'Les instructions IA demandent aux assistants d’utiliser uniquement les composants et variantes documentés et de ne pas inventer d’API, d’états, de slots ou de comportements d’accessibilité.',
          accessibility:
            'L’Accessibility Center peut inspecter les contrats de composants en parallèle des données de tokens et de thèmes.',
        },
      },
      productBridge: {
        eyebrow: 'Comment VulcanForgeUI représente les composants aujourd’hui',
        typesLabel:
          'Types de composants actuellement pris en charge nativement',
        items: {
          identity:
            'La persistance autorise actuellement un contrat de chaque type prédéfini par projet.',
          lifecycle: 'Un contrat peut être brouillon, prêt ou déprécié.',
          localization:
            'La finalité, les recommandations, libellés, descriptions, règles d’accessibilité et usages interdits peuvent être localisés.',
          anatomy:
            'Les parties d’anatomie peuvent être obligatoires, optionnelles ou dérivées.',
          bindings:
            'Les liaisons de tokens stockent une clé de liaison, un type de token et un chemin direct vers le token.',
          workspace:
            'L’espace actuel propose un registre, une édition structurée par formulaire, un aperçu visuel et un aperçu du contrat destiné à l’IA.',
        },
        boundary:
          'Il n’existe actuellement ni création arbitraire de SearchBar ou ProductCard, ni canvas libre, ni modèle général de composition de composants. Ces questions appartiennent à la future phase d’exploration du Components Workspace V2, pas à cette itération Learn.',
      },
      demo: {
        sequence: {
          theme:
            'Thème · associer les rôles d’apparence lorsque le contexte varie',
          component:
            'Composant · définir le contrat réutilisable qui consomme les décisions du système',
        },
      },
      checkpoint: {
        eyebrow: 'Point de contrôle',
        items: {
          three:
            'pourquoi la finalité, le contenu, l’accessibilité et les usages interdits doivent accompagner les règles visuelles,',
          four: 'comment les liaisons de tokens des composants se résolvent actuellement depuis les jeux de tokens plutôt que depuis les rôles de thème,',
          five: 'pourquoi des données de composant structurées peuvent améliorer les aperçus, la documentation, l’analyse d’accessibilité et les consignes IA.',
        },
      },
      continue: {
        status: 'Disponible',
        description:
          'Les composants montrent où vivent les règles d’accessibilité. Le chapitre suivant élargit la réflexion au contraste, au focus, à la sémantique, aux contrôles automatisés, à la validation manuelle et aux limites d’un score d’accessibilité.',
      },
    },
    LearnAccessibilityPage: {
      hero: {
        learnerQuestion:
          'Quelles décisions d’accessibilité le système peut-il rendre visibles tôt, et quelles questions nécessitent encore de tester l’expérience réelle ?',
      },
      openingProblem: {
        eyebrow: 'Partons d’une décision de thème',
        title:
          'Une seule mauvaise association peut affaiblir tous les écrans qui en dépendent.',
        description:
          'Dans le projet Demo, le rôle de contenu secondaire est réutilisé dans plusieurs surfaces. Si le thème clair pointe par erreur vers la valeur prévue pour le thème sombre, tous les consommateurs héritent du même problème de contraste.',
        backgroundLabel: 'Arrière-plan clair',
        correct: {
          label: 'Association claire actuelle',
          ratio: '8,89:1',
        },
        drifted: {
          label: 'Mauvaise association entre thèmes',
          ratio: '1,97:1',
        },
        conclusion:
          'L’accessibilité est déjà une question de système : une seule association de thème modifie l’expérience de chaque composant et écran qui dépend de ce rôle.',
      },
      systemProperty: {
        items: {
          themes: { label: 'Thèmes' },
          components: { label: 'Composants' },
          runtime: {
            description:
              'Transforme l’intention structurée en DOM, contrôles natifs, ordre de focus, contenu et interactions réelles.',
          },
        },
        rule: 'Plus une décision d’accessibilité réutilisable est formalisée tôt, moins chaque écran doit la redécouvrir indépendamment.',
      },
      contrast: {
        description:
          'Une même couleur de premier plan peut respecter le seuil sur un arrière-plan et échouer sur un autre. C’est pourquoi l’Accessibility Center évalue les paires premier plan/arrière-plan configurées dans les thèmes après résolution des références de tokens.',
        productLabel:
          'Règle actuelle des paires de contraste de thème dans VulcanForgeUI',
        rows: {
          pass: { range: '≥ 4,5:1' },
          warning: { range: '3,0–4,49:1' },
          fail: { range: '< 3,0:1' },
        },
        standardContext:
          'WCAG 2.2 fixe à 4,5:1 le minimum AA pour du texte normal et à 3:1 celui de certains grands textes. VulcanForgeUI évalue actuellement chaque paire de thème comme du texte normal : le produit ne déduit donc ni la taille réelle du texte ni le fait qu’une couleur serve à un élément d’interface non textuel.',
        boundary:
          'Une paire de thème validée indique que cette relation de couleurs satisfait la règle actuelle du produit. Cela ne prouve pas que chaque utilisation réelle de ces couleurs respecte les WCAG dans son contexte.',
      },
      focus: {
        manualRule:
          'Il n’inspecte pas une application en cours d’exécution pour vérifier l’indicateur de focus réel, l’ordre au clavier, la gestion du focus dans les dialogues ou le masquage du contrôle focalisé par des éléments fixes.',
      },
      automation: {
        title:
          'Automatiser les signaux déterministes ; tester l’expérience réelle avec des personnes et des technologies d’assistance.',
        automated: {
          bindings:
            'Liaisons de tokens de composants manquantes et incohérences de type de token.',
        },
        manual: {
          responsive:
            'Vérifier que le zoom, la redistribution du contenu, l’orientation et les éléments superposés conservent l’accès au contenu et au focus.',
        },
      },
      score: {
        exampleMeaning:
          'Un problème critique et un avertissement donnent 65/100 : À surveiller.',
      },
      productBridge: {
        description:
          'Le rapport combine l’évaluation des contrastes des thèmes et des contrôles sur les tokens et les contrats de composants. Chaque problème conserve une sévérité, un périmètre et une source afin de revenir vers l’éditeur concerné.',
        items: {
          themes:
            'Les contrôles des thèmes résolvent les références des rôles de couleur configurés et évaluent des paires premier plan/arrière-plan.',
          tokens:
            'Les contrôles des tokens peuvent signaler des jeux invalides, des erreurs de résolution et des descriptions manquantes sur les tokens au statut Ready dans les langues du projet.',
          components:
            'Les contrôles des composants peuvent signaler des contrats invalides, des manques de localisation, l’absence de règles d’accessibilité ou d’état focusVisible, ainsi que des problèmes de liaisons.',
          reports:
            'Un rapport peut être enregistré comme instantané du résultat automatisé actuel afin d’être comparé ultérieurement.',
        },
        boundary:
          'L’Accessibility Center est un audit automatisé des données du Design System. Il ne parcourt ni n’exécute une application en aval, ne lance pas de lecteur d’écran, ne certifie pas la conformité WCAG et ne remplace pas un audit manuel complet.',
      },
      demo: {
        eyebrow: 'Le projet Demo',
        description:
          'La démo montre maintenant pourquoi des décisions de design structurées servent à autre chose qu’à la cohérence visuelle : elles créent des relations et des attentes vérifiables avant même l’implémentation.',
        sequence: {
          theme:
            'Thème · créer des relations de couleurs qui peuvent être vérifiées ensemble',
          component:
            'Composant · préserver les états et les attentes d’accessibilité',
        },
      },
      misconception: {
        description:
          'L’automatisation peut démontrer que certaines conditions testables par une machine sont satisfaites. Elle ne peut pas prouver que l’interface complète est compréhensible, utilisable et robuste pour des personnes réelles. Un rapport sans problème doit ouvrir la voie à une validation humaine, pas marquer la fin du processus.',
      },
      checkpoint: {
        eyebrow: 'Point de contrôle',
        items: {
          one: 'pourquoi l’accessibilité est une propriété des décisions répétées du système plutôt qu’une liste de contrôle finale,',
          two: 'pourquoi le contraste dépend d’une relation premier plan/arrière-plan et peut changer avec les associations de thème,',
          five: 'pourquoi le score d’accessibilité est un signal de priorisation et non un pourcentage de conformité WCAG.',
        },
      },
      continue: {
        status: 'Disponible',
        title: 'Documentation et livraison',
      },
    },
    LearnDocumentationDeliveryPage: {
      metadata: {
        title: 'Documentation et livraison — Apprendre | VulcanForgeUI',
        description:
          'Comprendre comment une source structurée unique peut produire une documentation lisible et plusieurs formats de livraison sans transformer ces sorties en sources de référence concurrentes.',
      },
      hero: {
        chapter: 'Chapitre 06 · Documentation et livraison',
        description:
          'Un token, une association de thème ou un contrat de composant ne devrait pas avoir à être réinterprété manuellement chaque fois qu’une équipe, un document ou une base de code en a besoin. Des données structurées permettent de produire plusieurs sorties à partir des mêmes décisions du projet.',
      },
      openingProblem: {
        description:
          'Imaginez que la couleur de l’action principale soit saisie manuellement dans une note de design, un fichier CSS, un thème TypeScript et un thème mobile. Aujourd’hui, tout correspond. Un mois plus tard, une copie change tandis que les autres restent inchangées.',
        conclusion:
          'Le problème n’est pas qu’un format soit mauvais. Le problème est que chaque copie peut finir par devenir une référence indépendante.',
      },
      canonicalSource: {
        sourceItems:
          'Tokens · Thèmes · Composants · Accessibilité · Contexte de marque',
        consumers: {
          tailwind: 'Thème Tailwind v4',
          typescript: 'Thème TypeScript',
          native: 'Thème React Native',
        },
      },
      oneDecision: {
        description:
          'Les exports de code actuels résolvent les références de tokens avant de produire leur sortie. Un même token sémantique d’action peut donc apparaître sous forme de propriété CSS, de variable de thème Tailwind ou de données TypeScript imbriquées tout en conservant la même valeur résolue.',
        formats: {
          typescript: { label: 'Thème TypeScript' },
          native: { label: 'Thème React Native' },
        },
      },
      documentation: {
        sections: {
          overview: 'Vue d’ensemble · projet et consignes de marque',
          themes: 'Thèmes · associations d’apparence configurées',
          components:
            'Composants · finalité, anatomie, variantes, états et règles',
        },
      },
      diagnostics: {
        description:
          'Les exports de code actuels résolvent les tokens du projet avant de générer leur sortie. Les tokens dépréciés sont exclus par défaut, les références non résolues peuvent être ignorées et les problèmes de résolution des thèmes sont signalés dans les diagnostics.',
        items: {
          themes:
            'Les références des thèmes sont résolues avant l’export et les associations impossibles à résoudre sont signalées.',
        },
        rule: 'Une génération déterministe réduit la dérive liée à la recopie, mais les diagnostics nécessitent toujours une décision humaine sur les données source à corriger.',
      },
      productBridge: {
        title:
          'Documentation et Exports sont deux fonctionnalités construites à partir des mêmes données projet.',
        formats:
          'Variables CSS · Tailwind v4 · Thème TypeScript · Thème React Native · Documentation Markdown',
        items: {
          css: 'Les variables CSS transforment les chemins de tokens résolus en propriétés personnalisées CSS et ajoutent les variables de thème lorsqu’elles sont disponibles.',
          typescript:
            'La sortie TypeScript construit des objets imbriqués de tokens et de thèmes résolus destinés au web ou à des packages partagés.',
          native:
            'La sortie React Native construit des données imbriquées de tokens et de thèmes résolus ainsi que des fonctions utilitaires Light/Dark pour les applications natives.',
        },
      },
      demo: {
        title:
          'Les connaissances du projet peuvent maintenant quitter l’éditeur sans être réécrites à la main.',
      },
      checkpoint: {
        eyebrow: 'Point de contrôle',
      },
      continue: { status: 'Disponible' },
    },
    LearnAiReadyDesignSystemsPage: {
      hero: {
        description:
          'Un assistant IA ne peut raisonner qu’à partir du contexte qu’il reçoit. Lorsque les tokens approuvés, les contrats de composants, les attentes d’accessibilité et le langage produit sont explicites, ce contexte devient plus précis. Cette structure était déjà utile aux humains : l’IA n’est qu’un consommateur supplémentaire.',
        learnerQuestion:
          'Pourquoi les connaissances structurées d’un Design System facilitent-elles le développement assisté par IA, et que ne peuvent-elles jamais garantir ?',
      },
      openingProblem: {
        structuredOutcome:
          'L’assistant reçoit des décisions explicites sur lesquelles il peut s’appuyer au lieu de reconstruire le système à partir de son apparence ou de ses propres suppositions.',
      },
      structure: {
        steps: {
          human: {
            description:
              'L’équipe partage des décisions nommées, des composants pris en charge et des attentes documentées.',
          },
        },
      },
      context: {
        title:
          'Les valeurs seules ne suffisent pas : les contraintes et la sémantique comptent aussi.',
        description:
          'Une couleur peut indiquer à un assistant quelle valeur existe. Elle n’explique pas le rôle de cette valeur, les variantes de composant autorisées, les comportements d’accessibilité attendus ni les usages interdits.',
        items: {
          components: { label: 'Règles des composants' },
        },
      },
      strictness: {
        eyebrow: 'Niveau de contrainte',
        title:
          'Le niveau de contrainte modifie les instructions, pas les permissions de l’assistant.',
        levels: {
          balanced: { label: 'Équilibré (balanced)' },
          strict: { label: 'Strict (strict)' },
          veryStrict: { label: 'Très strict (veryStrict)' },
        },
      },
      productBridge: {
        items: {
          strictness:
            'Choisir balanced, strict ou veryStrict pour définir la formulation employée lorsque certaines décisions sont absentes ou non documentées.',
          sections:
            'Sélectionner les règles de tokens, de composants, d’accessibilité et les usages interdits. Les règles de marque et les consignes anti-hallucination restent incluses dans le contexte généré.',
          diagnostics:
            'Les diagnostics de qualité des données source et de traductions manquantes rendent visibles les faiblesses du contexte avant qu’il ne quitte le produit.',
        },
      },
      boundary: {
        title:
          'Le contexte peut guider un assistant ; il ne peut pas garantir le résultat.',
        items: {
          execution: {
            description:
              'VulcanForgeUI génère du contexte. La fonctionnalité AI Instructions actuelle n’exécute pas elle-même un assistant externe.',
          },
        },
        principle:
          'Considérez le contexte IA généré comme une consigne projet de qualité : une source d’information utile pour l’assistant et un ensemble de contraintes utiles pour la relecture, jamais un substitut à la vérification.',
      },
      demo: {
        description:
          'Le fil rouge du projet Demo boucle maintenant le parcours : un token nommé, un contrat Button, des attentes de focus et un usage interdit peuvent tous être représentés dans un même artefact de contexte généré.',
        sequence: {
          component:
            'Composant · structure du Button et variante primary prises en charge',
        },
      },
      checkpoint: {
        eyebrow: 'Point de contrôle final',
        description:
          'Les sept chapitres décrivent une seule idée : des décisions explicites sont plus faciles à réutiliser, valider, documenter et transmettre à différents consommateurs sans faire de ces consommateurs la source canonique.',
        items: {
          one: 'pourquoi la préparation à l’IA découle d’un Design System explicite au lieu de le remplacer,',
          two: 'ce que le contexte de marque, de tokens, de composants, d’accessibilité et d’usages interdits peut communiquer à un assistant,',
          three:
            'pourquoi le niveau de contrainte modifie les consignes générées sans pouvoir imposer le comportement d’un outil externe,',
          four: 'pourquoi AI Instructions est un instantané généré qu’il faut actualiser lorsque les décisions source changent,',
          five: 'pourquoi une relecture humaine reste nécessaire même lorsque le contexte généré est complet et précis.',
        },
      },
      complete: {
        title: 'Le système est la source ; chaque sortie est un consommateur.',
        description:
          'Vous pouvez maintenant suivre une décision depuis l’intention produit jusqu’aux tokens, thèmes, composants et contrôles d’accessibilité, puis jusqu’à la documentation, aux exports de code et à AI Instructions. Cette relation constitue le modèle mental central de VulcanForgeUI.',
        next: 'Utilisez Examples pour retrouver le parcours produit condensé. Revenez dans Learn lorsque vous avez besoin de comprendre le raisonnement derrière une décision du système.',
      },
    },
  },
} as const;
