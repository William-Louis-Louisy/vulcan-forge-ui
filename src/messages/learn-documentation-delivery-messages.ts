export const learnDocumentationDeliveryMessages = {
  en: {
    LearnDocumentationDeliveryPage: {
      metadata: {
        title: 'Documentation & Delivery — Learn | VulcanForgeUI',
        description:
          'Learn why one structured Design System source can generate human-readable documentation and several code-oriented delivery formats without turning those outputs into competing sources of truth.',
      },
      hero: {
        chapter: 'Chapter 06 · Documentation & Delivery',
        title:
          'Structure pays off when the same decision can serve more than one consumer.',
        description:
          'A token, Theme mapping or Component contract should not need to be manually reinterpreted every time another team, document or codebase needs it. Structured source data lets different outputs derive from the same project decisions.',
        learnerQuestion:
          'What changes when documentation and code outputs are generated from the same source instead of maintained independently?',
      },
      openingProblem: {
        eyebrow: 'Start with duplicated knowledge',
        title:
          'Copying one decision into several places creates several places that can drift.',
        description:
          'Imagine the primary action color is written manually in a design note, a CSS file, a TypeScript theme and a mobile theme. They agree today. A month later, one copy changes and the others do not.',
        sourceLabel: 'Original decision',
        sourcePath: 'color.semantic.action.primary',
        sourceValue: '#FF8731',
        copiesLabel: 'Four manually maintained copies',
        copies: {
          documentation: 'Documentation · #FF8731',
          css: 'CSS · #FF8731',
          typescript: 'TypeScript · #FF8731',
          native: 'React Native · #FF8731',
        },
        driftLabel: 'After one local edit',
        driftValue: 'CSS · #E66F20',
        conclusion:
          'The problem is not that any format is wrong. The problem is that each copy can become an independent authority.',
      },
      canonicalSource: {
        eyebrow: 'Canonical source',
        title:
          'Keep the decision in one structured project; let outputs become consumers.',
        description:
          'A canonical source is the place where the Design System decision is authored and governed. Generated files and documentation can then represent that decision for different audiences without becoming separate masters.',
        sourceLabel: 'Structured project source',
        sourceItems:
          'Tokens · Themes · Components · Accessibility · Brand context',
        consumerLabel: 'Generated consumers',
        consumers: {
          documentation: 'Markdown documentation',
          css: 'CSS variables',
          tailwind: 'Tailwind v4 theme',
          typescript: 'TypeScript theme',
          native: 'React Native theme',
        },
        rule: 'Different outputs may use different syntax, but they should derive from the same project decisions whenever the product supports that mapping.',
      },
      oneDecision: {
        eyebrow: 'One decision, several representations',
        title: 'The syntax changes; the resolved meaning can stay the same.',
        description:
          'The current exporters resolve token references before emitting code-oriented outputs. The same semantic action token can therefore appear as a CSS custom property, a Tailwind theme variable or nested TypeScript data while preserving the resolved value.',
        tokenLabel: 'Canonical token',
        tokenPath: 'color.semantic.action.primary',
        tokenValue: '#FF8731',
        formats: {
          css: {
            label: 'CSS variables',
            file: 'project-tokens.css',
            snippet: '--color-semantic-action-primary: #FF8731;',
          },
          tailwind: {
            label: 'Tailwind v4',
            file: 'project-tailwind.css',
            snippet:
              '--color-semantic-action-primary: var(--color-semantic-action-primary);',
          },
          typescript: {
            label: 'TypeScript theme',
            file: 'project-theme.ts',
            snippet: "color.semantic.action.primary → '#FF8731'",
          },
          native: {
            label: 'React Native theme',
            file: 'project-react-native-theme.ts',
            snippet: "color.semantic.action.primary → '#FF8731'",
          },
        },
        boundary:
          'These snippets explain the relationship between outputs. File names are generated from the project name, and the complete files contain more structure than the teaching excerpt shown here.',
      },
      documentation: {
        eyebrow: 'Human-readable output',
        title:
          'Generated documentation turns structured fields into a readable system reference.',
        description:
          'VulcanForgeUI can generate Markdown from project data rather than asking a team to recreate the same knowledge in a separate document. The current documentation profile lets the user select a locale and choose which supported sections to include.',
        sectionsLabel: 'Current Markdown sections',
        sections: {
          overview: 'Overview · project and Brand guidance',
          tokens: 'Tokens · paths, values and localized descriptions',
          themes: 'Themes · configured appearance mappings',
          components:
            'Components · purpose, anatomy, variants, states and rules',
          accessibility:
            'Accessibility · current structured validation summary',
        },
        localization:
          'When localized content is missing, the generator can use the configured fallback locale and report which translations were missing instead of silently pretending the requested locale was complete.',
      },
      diagnostics: {
        eyebrow: 'Generation is not blind copying',
        title:
          'A useful exporter should surface what it could not represent safely.',
        description:
          'Current code exporters resolve project tokens before generating output. Deprecated tokens are excluded by default, unresolved token references can be skipped and Theme-resolution problems are reported as diagnostics.',
        items: {
          resolution:
            'Unresolved token references are not emitted as if they were valid resolved values.',
          deprecated:
            'Deprecated tokens are excluded by default, with an explicit option to include them.',
          themes:
            'Theme references are resolved before export and unresolved Theme mappings are reported.',
          translations:
            'Documentation reports missing localized content when a fallback language is used.',
        },
        rule: 'Deterministic generation reduces transcription drift, but diagnostics still require a person to decide whether the source data itself needs correction.',
      },
      snapshot: {
        eyebrow: 'Important delivery boundary',
        title:
          'An export is a generated snapshot, not a live synchronization channel.',
        description:
          'Copying or downloading a generated file gives another system a representation of the project at that moment. If the canonical project changes later, an already copied downstream file does not update itself automatically.',
        flow: {
          source: 'VulcanForgeUI project changes',
          regenerate: 'Generate a new output',
          integrate: 'Review and integrate downstream',
        },
        notSync:
          'VulcanForgeUI does not currently push updates into arbitrary repositories, merge changes into consuming applications or keep exported files synchronized in both directions.',
      },
      productBridge: {
        eyebrow: 'How VulcanForgeUI delivers the system today',
        title:
          'Documentation and Exports are separate product surfaces built from shared project data.',
        description:
          'The Documentation profile controls the generated Markdown view, while the Export Center exposes downloadable/copyable representations and diagnostics for the current project.',
        formatsLabel: 'Formats taught in this chapter',
        formats:
          'CSS Variables · Tailwind v4 · TypeScript Theme · React Native Theme · Markdown Documentation',
        items: {
          css: 'CSS variables flatten resolved token paths into CSS custom properties and include Theme variables when available.',
          tailwind:
            'Tailwind v4 output builds on the generated CSS variables and adds an @theme block.',
          typescript:
            'TypeScript output builds nested resolved token and Theme objects for web/shared-package consumption.',
          native:
            'React Native output builds nested resolved token/Theme data and light/dark Theme helpers for native applications.',
          markdown:
            'Markdown documentation transforms selected structured sections into localized human-readable documentation.',
        },
        deferred:
          'AI Instructions also appear in the Export Center, but they are intentionally deferred to Chapter 07 so AI remains a consumer of a well-structured Design System rather than the reason to structure it.',
      },
      demo: {
        eyebrow: 'The Demo project',
        title:
          'The same project knowledge can now leave the editor without being rewritten by hand.',
        description:
          'The previous chapters created structured decisions. Delivery is where those decisions become useful to people and implementation environments beyond the authoring workspace.',
        sequence: {
          source: '01 · Author the Design System decision once',
          validate: '02 · Validate the structured project data',
          generate: '03 · Generate the representation a consumer needs',
          integrate: '04 · Review and integrate that snapshot downstream',
        },
      },
      misconception: {
        eyebrow: 'Common misconception',
        title:
          '“Generated from one source” does not mean “every consumer is permanently in sync.”',
        description:
          'A canonical source reduces the number of places where a decision must be authored. It does not remove the need to regenerate, review, version and integrate outputs when downstream systems change independently.',
      },
      checkpoint: {
        eyebrow: 'Checkpoint',
        title: 'Before moving on, you should be able to explain…',
        description:
          'If these ideas are clear, the final chapter can treat AI Instructions as one more generated consumer of explicit Design System knowledge.',
        items: {
          one: 'why maintaining the same Design System decision manually in several formats creates drift risk;',
          two: 'why generated documentation and code exports should be consumers rather than competing canonical sources;',
          three:
            'how the same resolved token decision can be represented differently in CSS, Tailwind, TypeScript and React Native;',
          four: 'why export diagnostics matter when references, deprecated tokens or translations are incomplete;',
          five: 'why an exported file is a snapshot and not automatic two-way synchronization.',
        },
      },
      continue: {
        eyebrow: 'Next chapter',
        status: 'Up next',
        title: 'AI-ready Design Systems',
        description:
          'Structured project knowledge is useful to humans and deterministic exporters first. Next we will see why the same explicit semantics can also provide stronger context to AI-assisted development without implying control over an external assistant.',
      },
    },
  },
  fr: {
    LearnDocumentationDeliveryPage: {
      metadata: {
        title: 'Documentation & Delivery — Apprendre | VulcanForgeUI',
        description:
          'Comprendre comment une source structurée unique peut produire de la documentation lisible et plusieurs formats de livraison sans transformer ces sorties en sources de vérité concurrentes.',
      },
      hero: {
        chapter: 'Chapitre 06 · Documentation & Delivery',
        title:
          'La structure prend toute sa valeur lorsqu’une même décision peut servir plusieurs consommateurs.',
        description:
          'Un token, un mapping de Theme ou un contrat Component ne devrait pas devoir être réinterprété manuellement chaque fois qu’une équipe, un document ou une base de code en a besoin. Des données structurées permettent de dériver plusieurs sorties à partir des mêmes décisions projet.',
        learnerQuestion:
          'Qu’est-ce qui change lorsque la documentation et les sorties de code sont générées depuis la même source au lieu d’être maintenues séparément ?',
      },
      openingProblem: {
        eyebrow: 'Partons d’une connaissance dupliquée',
        title:
          'Recopier une décision à plusieurs endroits crée autant d’endroits susceptibles de dériver.',
        description:
          'Imaginez que la couleur de l’action principale soit saisie manuellement dans une note de design, un fichier CSS, un Theme TypeScript et un Theme mobile. Aujourd’hui, tout correspond. Un mois plus tard, une seule copie change.',
        sourceLabel: 'Décision d’origine',
        sourcePath: 'color.semantic.action.primary',
        sourceValue: '#FF8731',
        copiesLabel: 'Quatre copies maintenues manuellement',
        copies: {
          documentation: 'Documentation · #FF8731',
          css: 'CSS · #FF8731',
          typescript: 'TypeScript · #FF8731',
          native: 'React Native · #FF8731',
        },
        driftLabel: 'Après une modification locale',
        driftValue: 'CSS · #E66F20',
        conclusion:
          'Le problème n’est pas qu’un format soit mauvais. Le problème est que chaque copie peut devenir une autorité indépendante.',
      },
      canonicalSource: {
        eyebrow: 'Source canonique',
        title:
          'Conserver la décision dans un projet structuré, puis laisser les sorties jouer le rôle de consommateurs.',
        description:
          'Une source canonique est l’endroit où la décision du Design System est définie et gouvernée. Les fichiers générés et la documentation peuvent ensuite représenter cette décision pour différents usages sans devenir des références concurrentes.',
        sourceLabel: 'Source structurée du projet',
        sourceItems:
          'Tokens · Themes · Components · Accessibilité · Contexte de marque',
        consumerLabel: 'Consommateurs générés',
        consumers: {
          documentation: 'Documentation Markdown',
          css: 'Variables CSS',
          tailwind: 'Theme Tailwind v4',
          typescript: 'Theme TypeScript',
          native: 'Theme React Native',
        },
        rule: 'Les sorties peuvent employer des syntaxes différentes tout en dérivant des mêmes décisions projet lorsque le produit prend en charge cette transformation.',
      },
      oneDecision: {
        eyebrow: 'Une décision, plusieurs représentations',
        title:
          'La syntaxe change, mais la signification résolue peut rester identique.',
        description:
          'Les exports de code actuels résolvent les références de tokens avant de produire leur sortie. Un même token sémantique d’action peut donc apparaître sous forme de propriété CSS, de variable de Theme Tailwind ou de données TypeScript imbriquées tout en conservant la même valeur résolue.',
        tokenLabel: 'Token canonique',
        tokenPath: 'color.semantic.action.primary',
        tokenValue: '#FF8731',
        formats: {
          css: {
            label: 'Variables CSS',
            file: 'project-tokens.css',
            snippet: '--color-semantic-action-primary: #FF8731;',
          },
          tailwind: {
            label: 'Tailwind v4',
            file: 'project-tailwind.css',
            snippet:
              '--color-semantic-action-primary: var(--color-semantic-action-primary);',
          },
          typescript: {
            label: 'Theme TypeScript',
            file: 'project-theme.ts',
            snippet: "color.semantic.action.primary → '#FF8731'",
          },
          native: {
            label: 'Theme React Native',
            file: 'project-react-native-theme.ts',
            snippet: "color.semantic.action.primary → '#FF8731'",
          },
        },
        boundary:
          'Ces extraits illustrent la relation entre les sorties. Les noms de fichiers sont générés à partir du nom du projet et les fichiers complets contiennent davantage de structure que ces extraits pédagogiques.',
      },
      documentation: {
        eyebrow: 'Sortie lisible par les humains',
        title:
          'La documentation générée transforme les champs structurés en référence lisible du système.',
        description:
          'VulcanForgeUI peut générer du Markdown à partir des données du projet plutôt que de demander à une équipe de recréer la même connaissance dans un document séparé. Le profil de documentation actuel permet de choisir une langue et les sections à inclure.',
        sectionsLabel: 'Sections Markdown actuelles',
        sections: {
          overview: 'Vue d’ensemble · projet et guidance de marque',
          tokens: 'Tokens · chemins, valeurs et descriptions localisées',
          themes: 'Themes · mappings d’apparence configurés',
          components: 'Components · rôle, anatomie, variantes, états et règles',
          accessibility:
            'Accessibilité · synthèse de la validation structurée actuelle',
        },
        localization:
          'Lorsqu’un contenu localisé manque, le générateur peut utiliser la langue de repli configurée et signaler les traductions manquantes au lieu de laisser croire que la langue demandée est complète.',
      },
      diagnostics: {
        eyebrow: 'La génération n’est pas une copie aveugle',
        title:
          'Un export utile doit signaler ce qu’il ne peut pas représenter de manière sûre.',
        description:
          'Les exports de code actuels résolvent les tokens du projet avant de générer leur sortie. Les tokens dépréciés sont exclus par défaut, les références non résolues peuvent être ignorées et les problèmes de résolution des Themes sont remontés dans les diagnostics.',
        items: {
          resolution:
            'Une référence de token non résolue n’est pas exportée comme si elle constituait une valeur valide.',
          deprecated:
            'Les tokens dépréciés sont exclus par défaut, avec une option explicite pour les inclure.',
          themes:
            'Les références des Themes sont résolues avant l’export et les mappings impossibles à résoudre sont signalés.',
          translations:
            'La documentation signale les contenus localisés manquants lorsqu’une langue de repli est utilisée.',
        },
        rule: 'Une génération déterministe réduit la dérive liée à la recopie, mais les diagnostics nécessitent toujours une décision humaine sur les données sources à corriger.',
      },
      snapshot: {
        eyebrow: 'Limite importante de la livraison',
        title:
          'Un export est un instantané généré, pas un canal de synchronisation permanent.',
        description:
          'Copier ou télécharger un fichier généré fournit à un autre système une représentation du projet à cet instant. Si le projet canonique change ensuite, un fichier déjà intégré ailleurs ne se met pas à jour automatiquement.',
        flow: {
          source: 'Le projet VulcanForgeUI évolue',
          regenerate: 'Générer une nouvelle sortie',
          integrate: 'Relire et intégrer en aval',
        },
        notSync:
          'VulcanForgeUI ne pousse actuellement pas les mises à jour dans des dépôts arbitraires, ne fusionne pas les changements dans les applications consommatrices et ne maintient pas de synchronisation bidirectionnelle des fichiers exportés.',
      },
      productBridge: {
        eyebrow: 'Comment VulcanForgeUI livre le Design System aujourd’hui',
        title:
          'Documentation et Exports sont deux surfaces produit construites à partir de données projet partagées.',
        description:
          'Le profil Documentation configure la sortie Markdown, tandis que l’Export Center expose des représentations à copier ou télécharger ainsi que leurs diagnostics pour le projet courant.',
        formatsLabel: 'Formats enseignés dans ce chapitre',
        formats:
          'Variables CSS · Tailwind v4 · Theme TypeScript · Theme React Native · Documentation Markdown',
        items: {
          css: 'Les variables CSS aplatissent les chemins de tokens résolus en propriétés personnalisées CSS et ajoutent les variables de Theme lorsqu’elles sont disponibles.',
          tailwind:
            'La sortie Tailwind v4 s’appuie sur les variables CSS générées et ajoute un bloc @theme.',
          typescript:
            'La sortie TypeScript construit des objets imbriqués de tokens et de Themes résolus destinés au web ou à des packages partagés.',
          native:
            'La sortie React Native construit des données imbriquées de tokens et de Themes résolus ainsi que des helpers Light/Dark pour les applications natives.',
          markdown:
            'La documentation Markdown transforme les sections structurées sélectionnées en documentation lisible et localisée.',
        },
        deferred:
          'AI Instructions apparaît également dans l’Export Center, mais reste volontairement réservé au chapitre 07 afin que l’IA demeure un consommateur d’un Design System bien structuré, et non la raison de le structurer.',
      },
      demo: {
        eyebrow: 'Le projet Demo',
        title:
          'La connaissance du projet peut maintenant quitter l’éditeur sans être réécrite à la main.',
        description:
          'Les chapitres précédents ont créé des décisions structurées. La livraison est le moment où ces décisions deviennent utiles aux personnes et aux environnements d’implémentation situés hors de l’espace d’édition.',
        sequence: {
          source: '01 · Définir une fois la décision du Design System',
          validate: '02 · Valider les données structurées du projet',
          generate:
            '03 · Générer la représentation dont le consommateur a besoin',
          integrate: '04 · Relire et intégrer cet instantané en aval',
        },
      },
      misconception: {
        eyebrow: 'Idée reçue fréquente',
        title:
          '« Généré depuis une source unique » ne signifie pas « tous les consommateurs restent synchronisés ».',
        description:
          'Une source canonique réduit le nombre d’endroits où une décision doit être définie. Elle ne supprime pas le besoin de régénérer, relire, versionner et intégrer les sorties lorsque les systèmes en aval évoluent indépendamment.',
      },
      checkpoint: {
        eyebrow: 'Checkpoint',
        title: 'Avant de continuer, vous devriez pouvoir expliquer…',
        description:
          'Si ces idées sont claires, le dernier chapitre pourra présenter AI Instructions comme un consommateur supplémentaire de connaissances explicites du Design System.',
        items: {
          one: 'pourquoi maintenir manuellement la même décision du Design System dans plusieurs formats crée un risque de dérive,',
          two: 'pourquoi la documentation générée et les exports de code doivent rester des consommateurs plutôt que des sources canoniques concurrentes,',
          three:
            'comment une même décision de token résolue peut être représentée différemment en CSS, Tailwind, TypeScript et React Native,',
          four: 'pourquoi les diagnostics d’export sont importants lorsque des références, des tokens dépréciés ou des traductions sont incomplets,',
          five: 'pourquoi un fichier exporté est un instantané et non une synchronisation bidirectionnelle automatique.',
        },
      },
      continue: {
        eyebrow: 'Chapitre suivant',
        status: 'À venir',
        title: 'Design Systems prêts pour l’IA',
        description:
          'Les connaissances structurées du projet sont d’abord utiles aux humains et aux exports déterministes. Nous verrons ensuite pourquoi ces mêmes informations explicites peuvent fournir un meilleur contexte au développement assisté par IA sans impliquer le contrôle d’un assistant externe.',
      },
    },
  },
} as const;
