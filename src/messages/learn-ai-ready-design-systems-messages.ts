export const learnAiReadyDesignSystemsMessages = {
  en: {
    LearnAiReadyDesignSystemsPage: {
      metadata: {
        title: 'AI-ready Design Systems — Learn | VulcanForgeUI',
        description:
          'Learn why structured Design System knowledge can provide better context to AI-assisted development without becoming AI control or orchestration.',
      },
      hero: {
        chapter: 'Chapter 07 · AI-ready Design Systems',
        title: 'Good AI context starts with good system structure.',
        description:
          'AI assistants can only reason from the context they receive. When approved tokens, Component contracts, accessibility expectations and product language are explicit, that context can become more precise. The structure was already valuable to humans; AI is another consumer of it.',
        learnerQuestion:
          'Why does structured Design System knowledge help AI-assisted development, and what can that context never guarantee?',
      },
      openingProblem: {
        eyebrow: 'Start with the same request',
        title: 'A vague request forces the missing decisions into guesswork.',
        description:
          '“Make a primary button that matches the app.” sounds clear to a person who already knows the project. An external assistant does not automatically know which token is approved, which Button variant exists, how focus should behave or which patterns the team forbids.',
        weakLabel: 'Request alone',
        structuredLabel: 'Request + structured context',
        requestLabel: 'Request',
        contextLabel: 'Known system constraints',
        weakOutcome:
          'The assistant must infer missing decisions from whatever context happens to be available.',
        structuredOutcome:
          'The assistant receives explicit decisions it can reference instead of reconstructing the system from appearance or assumptions.',
        conclusion:
          'AI readiness is not about writing a longer prompt. It is about making the system knowledge that already matters to people explicit enough to be reused as context.',
      },
      structure: {
        eyebrow: 'Structure before AI',
        title:
          'Machine-readable context is a consequence of a well-structured Design System.',
        description:
          'Nothing in the first six chapters existed only for AI. Names, references, contracts, accessibility rules and guidance first make the Design System clearer and more maintainable. Their explicit structure also makes them easier to transform into machine-readable instructions.',
        steps: {
          human: {
            label: 'Useful to people',
            description:
              'The team agrees on named decisions, supported Components and documented expectations.',
          },
          structured: {
            label: 'Explicit structure',
            description:
              'Those decisions live as data rather than remaining only in screenshots, memory or conversation.',
          },
          generated: {
            label: 'Generated context',
            description:
              'A consumer can select and format relevant system knowledge for another tool.',
          },
          assistant: {
            label: 'AI-assisted work',
            description:
              'An assistant can use that supplied context while producing an implementation or explanation.',
          },
        },
        rule: 'AI readiness is an outcome of explicit product knowledge, not a replacement for Design System discipline.',
      },
      context: {
        eyebrow: 'What useful context contains',
        title:
          'Values alone are not enough; constraints and semantics matter too.',
        description:
          'A color value can tell an assistant what pigment exists. It cannot explain which role that value serves, which Component variants are supported, which accessibility behavior matters or which usage is forbidden.',
        items: {
          brand: {
            label: 'Brand and voice',
            description:
              'Product personality, audience, tone, terminology and editorial rules can shape user-facing choices.',
          },
          tokens: {
            label: 'Token rules',
            description:
              'Approved token paths expose reusable visual decisions and discourage invented hard-coded values.',
          },
          components: {
            label: 'Component rules',
            description:
              'Component purpose, anatomy, variants and states describe the supported contract instead of an imagined API.',
          },
          accessibility: {
            label: 'Accessibility rules',
            description:
              'Documented requirements keep important behavioral constraints in the same context as visual decisions.',
          },
          forbidden: {
            label: 'Forbidden patterns',
            description:
              'Explicit “do not” guidance communicates boundaries that cannot be inferred reliably from component names alone.',
          },
        },
        antiHallucination:
          'VulcanForgeUI also generates anti-hallucination guidance that tells the consumer not to invent missing system information and to report gaps instead of guessing.',
      },
      strictness: {
        eyebrow: 'Guidance strength',
        title:
          'Strictness changes the instructions, not the assistant’s permissions.',
        description:
          'VulcanForgeUI currently offers three instruction profiles. They change how the generated Markdown describes acceptable behavior when the project model is incomplete.',
        levels: {
          balanced: {
            label: 'Balanced',
            description:
              'Prefer documented decisions while allowing careful implementation choices when the model is incomplete.',
          },
          strict: {
            label: 'Strict',
            description:
              'Do not invent tokens, Components, variants or accessibility behavior; ask for clarification when required.',
          },
          veryStrict: {
            label: 'Very strict',
            description:
              'Use only explicit model data and stop to report missing Design System information instead of filling gaps.',
          },
        },
        boundary:
          'These levels are text inside the generated instructions. VulcanForgeUI does not grant or revoke capabilities in an external AI tool and cannot force that tool to obey them.',
      },
      productBridge: {
        eyebrow: 'How VulcanForgeUI represents this today',
        title:
          'AI Instructions turns selected project knowledge into a Markdown context file.',
        description:
          'The authenticated workspace generates a preview from the current project model and lets the user choose what context to include before copying or downloading the result.',
        items: {
          locale:
            'Choose a supported project language; missing localized content can use the fallback locale and is reported as a diagnostic.',
          strictness:
            'Choose balanced, strict or veryStrict wording for how missing or undocumented decisions should be handled.',
          sections:
            'Select Token rules, Component rules, Accessibility rules and Forbidden patterns. Brand guidance and anti-hallucination rules remain part of the generated context.',
          diagnostics:
            'Source-data quality and missing-translation diagnostics surface weaknesses in the context before it leaves the product.',
          delivery:
            'Preview the generated Markdown, then copy it or download it as a file. AI Instructions is also exposed as an Export Center format.',
        },
        snapshot:
          'Like the exports from Chapter 06, AI Instructions is generated from the project state at that moment. Regenerate it after meaningful Design System changes when you want fresh context.',
      },
      boundary: {
        eyebrow: 'The boundary matters',
        title:
          'Context can guide an assistant; it cannot guarantee the result.',
        description:
          'A generated instruction file improves what an assistant can know about the Design System. It does not turn VulcanForgeUI into an AI runtime or a policy enforcement layer.',
        items: {
          execution: {
            label: 'No assistant execution',
            description:
              'VulcanForgeUI generates context. It does not run an external assistant as part of the current AI Instructions workflow.',
          },
          sync: {
            label: 'No live synchronization',
            description:
              'Changing a project does not automatically update a previously copied file, prompt or external conversation.',
          },
          monitoring: {
            label: 'No monitoring or control',
            description:
              'VulcanForgeUI does not observe what an external assistant does with the generated instructions or enforce compliance afterward.',
          },
          guarantee: {
            label: 'No correctness guarantee',
            description:
              'Even strong, current context cannot guarantee that generated code is correct, accessible, secure or faithful without review.',
          },
        },
        principle:
          'Treat generated AI context as high-quality project guidance: useful evidence for the assistant and useful constraints for the reviewer, never a substitute for verification.',
      },
      demo: {
        eyebrow: 'The Demo project, end to end',
        title:
          'The same decisions taught throughout Learn can become AI context without being re-described by hand.',
        description:
          'The Demo thread now closes the loop: a named token, a Button contract, focus expectations and a forbidden usage pattern can all be represented in one generated context artifact.',
        sequence: {
          token: 'Token · approved primary-action decision',
          component:
            'Component · supported Button structure and primary variant',
          accessibility:
            'Accessibility · focus and other documented expectations',
          guidance:
            'Guidance · forbidden patterns and missing-information rules',
          context:
            'AI Instructions · selected system knowledge formatted for another tool',
        },
      },
      misconception: {
        eyebrow: 'Common misconception',
        title: '“AI-ready” does not mean “AI-controlled.”',
        description:
          'VulcanForgeUI can make Design System knowledge easier to hand to an AI assistant. The assistant remains an external consumer. Generated context does not create two-way synchronization, orchestration, enforcement or guaranteed adherence.',
      },
      checkpoint: {
        eyebrow: 'Final checkpoint',
        title:
          'You should now be able to explain the complete Learn mental model.',
        description:
          'The seven chapters describe one connected idea: explicit system decisions become easier to reuse, validate, document and hand to different consumers without pretending those consumers become the source of truth.',
        items: {
          one: 'why AI readiness follows from explicit Design System structure rather than replacing it',
          two: 'what Brand, Token, Component, accessibility and forbidden-pattern context can communicate to an assistant',
          three:
            'why strictness changes generated guidance but cannot enforce behavior in an external tool',
          four: 'why AI Instructions is a generated snapshot that must be refreshed when source decisions change',
          five: 'why human review remains necessary even when the generated context is complete and precise',
        },
      },
      complete: {
        eyebrow: 'Curriculum complete',
        title: 'The system is the source; every output is a consumer.',
        description:
          'You can now trace a decision from raw product intent through Tokens, Themes, Components and accessibility into Documentation, code exports and AI Instructions. That relationship is the core mental model behind VulcanForgeUI.',
        next: 'Use Examples when you want the compressed product workflow. Use Learn when you need to return to the reasoning behind a system decision.',
      },
    },
  },
  fr: {
    LearnAiReadyDesignSystemsPage: {
      metadata: {
        title: 'Design Systems prêts pour l’IA — Apprendre | VulcanForgeUI',
        description:
          'Comprendre pourquoi un Design System structuré peut fournir un meilleur contexte au développement assisté par IA sans devenir un système de contrôle ou d’orchestration de l’IA.',
      },
      hero: {
        chapter: 'Chapitre 07 · Design Systems prêts pour l’IA',
        title: 'Un bon contexte IA commence par un système bien structuré.',
        description:
          'Un assistant IA ne peut raisonner qu’à partir du contexte qu’il reçoit. Lorsque les tokens approuvés, les contrats Components, les attentes d’accessibilité et le langage produit sont explicites, ce contexte peut devenir plus précis. Cette structure était déjà utile aux humains : l’IA n’est qu’un consommateur supplémentaire.',
        learnerQuestion:
          'Pourquoi les connaissances structurées d’un Design System facilitent-elles le développement assisté par IA, et que ne peuvent-elles jamais garantir ?',
      },
      openingProblem: {
        eyebrow: 'Partons de la même demande',
        title:
          'Une demande vague transforme les décisions absentes en suppositions.',
        description:
          '« Crée un bouton principal cohérent avec l’application. » semble clair pour une personne qui connaît déjà le projet. Un assistant externe ne sait pas automatiquement quel token est approuvé, quelle variante de Button existe, comment le focus doit se comporter ni quels usages l’équipe interdit.',
        weakLabel: 'Demande seule',
        structuredLabel: 'Demande + contexte structuré',
        requestLabel: 'Demande',
        contextLabel: 'Contraintes connues du système',
        weakOutcome:
          'L’assistant doit déduire les décisions manquantes à partir du contexte disponible, quel qu’il soit.',
        structuredOutcome:
          'L’assistant reçoit des décisions explicites qu’il peut référencer au lieu de reconstruire le système depuis son apparence ou ses propres suppositions.',
        conclusion:
          'Être prêt pour l’IA ne consiste pas à écrire un prompt plus long. Il s’agit de rendre les connaissances du système, déjà importantes pour les humains, suffisamment explicites pour être réutilisées comme contexte.',
      },
      structure: {
        eyebrow: 'La structure avant l’IA',
        title:
          'Le contexte exploitable par une machine découle d’un Design System bien structuré.',
        description:
          'Aucun concept des six premiers chapitres n’existe uniquement pour l’IA. Les noms, références, contrats, règles d’accessibilité et consignes rendent d’abord le Design System plus clair et plus maintenable. Leur structure explicite permet aussi de les transformer plus facilement en instructions exploitables par une machine.',
        steps: {
          human: {
            label: 'Utile aux humains',
            description:
              'L’équipe partage des décisions nommées, des Components pris en charge et des attentes documentées.',
          },
          structured: {
            label: 'Structure explicite',
            description:
              'Ces décisions existent sous forme de données plutôt que seulement dans des captures, des souvenirs ou des conversations.',
          },
          generated: {
            label: 'Contexte généré',
            description:
              'Un consommateur peut sélectionner et mettre en forme les connaissances pertinentes pour un autre outil.',
          },
          assistant: {
            label: 'Travail assisté par IA',
            description:
              'Un assistant peut utiliser le contexte fourni lorsqu’il produit une implémentation ou une explication.',
          },
        },
        rule: 'La capacité à fournir du contexte à l’IA est une conséquence de connaissances produit explicites, pas un substitut à la discipline d’un Design System.',
      },
      context: {
        eyebrow: 'Ce qu’un contexte utile contient',
        title:
          'Les valeurs seules ne suffisent pas : les contraintes et la sémantique comptent aussi.',
        description:
          'Une couleur peut indiquer à un assistant quelle valeur existe. Elle n’explique pas le rôle de cette valeur, les variantes Component autorisées, les comportements d’accessibilité attendus ni les usages interdits.',
        items: {
          brand: {
            label: 'Marque et voix',
            description:
              'La personnalité du produit, son audience, son ton, sa terminologie et ses règles éditoriales peuvent guider les choix visibles par l’utilisateur.',
          },
          tokens: {
            label: 'Règles de tokens',
            description:
              'Les chemins de tokens approuvés exposent les décisions visuelles réutilisables et limitent l’invention de valeurs codées en dur.',
          },
          components: {
            label: 'Règles Components',
            description:
              'La finalité, l’anatomie, les variantes et les états décrivent le contrat pris en charge au lieu d’une API imaginée.',
          },
          accessibility: {
            label: 'Règles d’accessibilité',
            description:
              'Les exigences documentées conservent les contraintes comportementales importantes dans le même contexte que les décisions visuelles.',
          },
          forbidden: {
            label: 'Usages interdits',
            description:
              'Les consignes explicites « à ne pas faire » expriment des limites qu’un nom de composant ne permet pas de déduire de façon fiable.',
          },
        },
        antiHallucination:
          'VulcanForgeUI génère également des règles anti-hallucination demandant de ne pas inventer les informations absentes du système et de signaler les lacunes plutôt que de deviner.',
      },
      strictness: {
        eyebrow: 'Niveau de contrainte',
        title:
          'Le niveau de strictness modifie les instructions, pas les permissions de l’assistant.',
        description:
          'VulcanForgeUI propose actuellement trois profils. Ils modifient la manière dont le Markdown généré décrit le comportement attendu lorsque le modèle du projet est incomplet.',
        levels: {
          balanced: {
            label: 'Balanced',
            description:
              'Privilégier les décisions documentées tout en autorisant des choix prudents lorsque le modèle est incomplet.',
          },
          strict: {
            label: 'Strict',
            description:
              'Ne pas inventer de tokens, de Components, de variantes ni de comportements d’accessibilité ; demander une clarification lorsque c’est nécessaire.',
          },
          veryStrict: {
            label: 'Very strict',
            description:
              'Utiliser uniquement les données explicites du modèle et signaler les informations manquantes plutôt que de combler les lacunes.',
          },
        },
        boundary:
          'Ces niveaux ne sont que du texte dans les instructions générées. VulcanForgeUI n’accorde ni ne retire de capacités à un outil IA externe et ne peut pas le contraindre à les respecter.',
      },
      productBridge: {
        eyebrow: 'Comment VulcanForgeUI représente cela aujourd’hui',
        title:
          'AI Instructions transforme une sélection de connaissances du projet en fichier de contexte Markdown.',
        description:
          'L’espace authentifié génère un aperçu depuis le modèle actuel du projet et permet de choisir le contexte à inclure avant de copier ou télécharger le résultat.',
        items: {
          locale:
            'Choisir une langue prise en charge par le projet ; les contenus localisés manquants peuvent utiliser la langue de repli et sont alors signalés dans les diagnostics.',
          strictness:
            'Choisir balanced, strict ou veryStrict pour définir la formulation utilisée lorsque certaines décisions sont absentes ou non documentées.',
          sections:
            'Sélectionner les règles de Tokens, de Components, d’accessibilité et les usages interdits. Les règles de marque et les consignes anti-hallucination restent incluses dans le contexte généré.',
          diagnostics:
            'Les diagnostics de qualité des données sources et de traductions manquantes rendent visibles les faiblesses du contexte avant sa sortie du produit.',
          delivery:
            'Prévisualiser le Markdown généré, puis le copier ou le télécharger. AI Instructions est également disponible comme format dans l’Export Center.',
        },
        snapshot:
          'Comme les exports du chapitre 06, AI Instructions est généré à partir de l’état du projet à un instant donné. Après une modification importante du Design System, il faut le régénérer pour obtenir un contexte à jour.',
      },
      boundary: {
        eyebrow: 'La frontière est essentielle',
        title:
          'Le contexte peut guider un assistant ; il ne peut pas garantir le résultat.',
        description:
          'Un fichier d’instructions généré améliore ce qu’un assistant peut connaître du Design System. Il ne transforme pas VulcanForgeUI en moteur d’IA ni en couche d’application de règles.',
        items: {
          execution: {
            label: 'Aucune exécution d’assistant',
            description:
              'VulcanForgeUI génère du contexte. Le workflow AI Instructions actuel n’exécute pas lui-même un assistant externe.',
          },
          sync: {
            label: 'Aucune synchronisation en temps réel',
            description:
              'Modifier un projet ne met pas automatiquement à jour un fichier déjà copié, un prompt ou une conversation externe.',
          },
          monitoring: {
            label: 'Aucun suivi ni contrôle',
            description:
              'VulcanForgeUI n’observe pas ce qu’un assistant externe fait des instructions générées et n’impose pas leur respect après coup.',
          },
          guarantee: {
            label: 'Aucune garantie de justesse',
            description:
              'Même un contexte complet et récent ne garantit pas qu’un code généré soit correct, accessible, sécurisé ou fidèle sans relecture.',
          },
        },
        principle:
          'Considérez le contexte IA généré comme une consigne projet de grande qualité : une source utile pour l’assistant et des contraintes utiles pour la relecture, jamais un substitut à la vérification.',
      },
      demo: {
        eyebrow: 'Le projet Demo, de bout en bout',
        title:
          'Les décisions enseignées dans Learn peuvent devenir du contexte IA sans être reformulées manuellement.',
        description:
          'Le fil rouge du Demo boucle maintenant le parcours : un token nommé, un contrat Button, les attentes de focus et un usage interdit peuvent tous être représentés dans un même artefact de contexte généré.',
        sequence: {
          token: 'Token · décision approuvée pour l’action principale',
          component:
            'Component · structure du Button et variante primary prises en charge',
          accessibility: 'Accessibilité · focus et autres attentes documentées',
          guidance:
            'Consignes · usages interdits et règles sur les informations manquantes',
          context:
            'AI Instructions · connaissances sélectionnées et formatées pour un autre outil',
        },
      },
      misconception: {
        eyebrow: 'Idée reçue fréquente',
        title: '« Prêt pour l’IA » ne signifie pas « contrôlé par l’IA ».',
        description:
          'VulcanForgeUI peut faciliter la transmission des connaissances du Design System à un assistant IA. Cet assistant reste un consommateur externe. Le contexte généré ne crée ni synchronisation bidirectionnelle, ni orchestration, ni application forcée des règles, ni garantie de respect.',
      },
      checkpoint: {
        eyebrow: 'Checkpoint final',
        title:
          'Vous devriez maintenant pouvoir expliquer le modèle mental complet de Learn.',
        description:
          'Les sept chapitres décrivent une seule idée connectée : des décisions explicites sont plus faciles à réutiliser, valider, documenter et transmettre à différents consommateurs sans faire de ces consommateurs la source de vérité.',
        items: {
          one: 'pourquoi la préparation à l’IA découle d’un Design System explicite au lieu de le remplacer',
          two: 'ce que le contexte de marque, de Tokens, de Components, d’accessibilité et d’usages interdits peut communiquer à un assistant',
          three:
            'pourquoi le niveau de strictness modifie les consignes générées sans pouvoir imposer le comportement d’un outil externe',
          four: 'pourquoi AI Instructions est un instantané généré qu’il faut actualiser lorsque les décisions sources changent',
          five: 'pourquoi une relecture humaine reste nécessaire même lorsque le contexte généré est complet et précis',
        },
      },
      complete: {
        eyebrow: 'Parcours terminé',
        title: 'Le système est la source ; chaque sortie est un consommateur.',
        description:
          'Vous pouvez maintenant suivre une décision depuis l’intention produit jusqu’aux Tokens, Themes, Components et contrôles d’accessibilité, puis jusqu’à la Documentation, aux exports de code et à AI Instructions. Cette relation constitue le modèle mental central de VulcanForgeUI.',
        next: 'Utilisez Examples pour retrouver le workflow produit condensé. Revenez dans Learn lorsque vous avez besoin de comprendre le raisonnement derrière une décision du système.',
      },
    },
  },
} as const;
