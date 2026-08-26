export const learnAccessibilityMessages = {
  en: {
    LearnAccessibilityPage: {
      metadata: {
        title: 'Accessibility — Learn | VulcanForgeUI',
        description:
          'Learn why accessibility is a Design System property, how contrast and focus decisions travel through the system, and what automated accessibility signals can and cannot prove.',
      },
      hero: {
        chapter: 'Chapter 05 · Accessibility',
        title: 'Accessibility belongs in the system, not at the end of it.',
        description:
          'A Design System can prevent entire classes of accessibility problems when contrast relationships, interaction states and component expectations are encoded before individual screens are built. Automation helps surface risk, but it never replaces human evaluation.',
        learnerQuestion:
          'Which accessibility decisions can the system make visible early, and which questions still require a person to test the real experience?',
      },
      openingProblem: {
        eyebrow: 'Start with one Theme decision',
        title:
          'A single wrong mapping can weaken every screen that consumes it.',
        description:
          'In the Demo project, the muted content role is reused across product surfaces. If the Light Theme accidentally points that role to the Dark Theme value, every consumer inherits the same contrast problem.',
        roleLabel: 'Semantic role',
        role: 'muted',
        backgroundLabel: 'Light background',
        backgroundValue: '#F7F3EB',
        correct: {
          label: 'Current Light mapping',
          token: 'color.primitive.neutral.700',
          value: '#3A4454',
          ratio: '8.89:1',
          status: 'Pass',
          sample: 'Secondary content stays comfortably readable.',
        },
        drifted: {
          label: 'Wrong cross-theme mapping',
          token: 'color.primitive.neutral.400',
          value: '#A0B1CA',
          ratio: '1.97:1',
          status: 'Fail',
          sample: 'The same content becomes difficult to distinguish.',
        },
        conclusion:
          'Accessibility is already a system concern here: one Theme mapping changes the experience of every component and screen that depends on that role.',
      },
      systemProperty: {
        eyebrow: 'A system property',
        title: 'Accessibility travels through several Design System layers.',
        description:
          'No single accessibility field can make a product accessible. Decisions accumulate from foundations to the real interface, and each layer can either preserve or damage the experience.',
        items: {
          tokens: {
            label: 'Tokens',
            description:
              'Provide values and references that later layers can reuse consistently.',
          },
          themes: {
            label: 'Themes',
            description:
              'Create contextual color relationships whose contrast can be evaluated.',
          },
          components: {
            label: 'Components',
            description:
              'Document interaction states, accessibility expectations and forbidden patterns.',
          },
          runtime: {
            label: 'Real interface',
            description:
              'Turns structured intent into actual DOM, native controls, focus order, copy and interactions.',
          },
          humans: {
            label: 'Human validation',
            description:
              'Checks whether the resulting experience is understandable and operable in context.',
          },
        },
        rule: 'The earlier a reusable accessibility decision is encoded, the fewer screens need to rediscover it independently.',
      },
      contrast: {
        eyebrow: 'Contrast relationships',
        title: 'Contrast is a relationship, not a property of one color.',
        description:
          'The same foreground value can pass on one background and fail on another. That is why the Accessibility Center evaluates configured Theme foreground/background pairs after token references are resolved.',
        productLabel: 'Current VulcanForgeUI Theme-pair rule',
        rows: {
          pass: {
            range: '≥ 4.5:1',
            label: 'Pass',
            meaning: 'Meets the current normal-text target.',
          },
          warning: {
            range: '3.0–4.49:1',
            label: 'Warning',
            meaning:
              'Internal prioritization band: below the current normal-text target.',
          },
          fail: {
            range: '< 3.0:1',
            label: 'Fail',
            meaning: 'Reported as a critical contrast issue.',
          },
        },
        standardContext:
          'WCAG 2.2 uses 4.5:1 as the Level AA minimum for normal text and 3:1 for qualifying large text. VulcanForgeUI currently evaluates every configured Theme pair using its normal-text mode, so the product does not infer font size or whether a color is serving a non-text UI purpose.',
        boundary:
          'A passing Theme pair says that this configured color relationship clears the product’s current contrast rule. It does not prove that every rendered use of those colors satisfies WCAG in context.',
      },
      focus: {
        eyebrow: 'Focus and component states',
        title:
          'Keyboard focus must exist in the contract and remain visible in the real interface.',
        description:
          'A sighted keyboard user needs to know which control will receive the next action. The system can require a focus-visible state, but only the rendered product can prove that the indicator is actually visible, correctly ordered and not obscured.',
        withoutLabel: 'No visible focus cue',
        withLabel: 'Visible focus cue',
        button: 'Save changes',
        contractLabel: 'Current Button contract state',
        contractValue: 'focusVisible',
        productRule:
          'The Accessibility Center flags a missing focusVisible state on interactive Button and TextField contracts as critical, and on Dialog as a warning. It can also flag an interactive contract with no accessibility rules.',
        manualRule:
          'It does not inspect a running application to verify the actual focus ring, keyboard order, focus trapping, or whether sticky content hides the focused control.',
      },
      automation: {
        eyebrow: 'Automation vs human evaluation',
        title:
          'Automate deterministic signals; test lived behavior with people and assistive technology.',
        description:
          'Automated checks are valuable because they are repeatable and can run early. Their usefulness comes from narrowing attention, not from replacing judgement.',
        automatedLabel: 'Current automated signals',
        manualLabel: 'Still needs contextual validation',
        automated: {
          contrast:
            'Configured Theme contrast pairs and missing foreground/background values.',
          tokenResolution:
            'Invalid token sets, unresolved token references and selected documentation gaps.',
          componentStructure:
            'Invalid Component contracts, missing localized contract fields and missing accessibility-rule collections.',
          focusState:
            'Missing focusVisible states on the current interactive component types.',
          bindings:
            'Missing Component token bindings and token-type mismatches.',
        },
        manual: {
          semantics:
            'Whether the rendered control exposes the right semantic role, name and relationships.',
          keyboard:
            'Whether keyboard order, activation, focus movement and composite-widget behavior make sense.',
          assistiveTechnology:
            'How the experience works with screen readers, magnification, voice input and other assistive technology.',
          content:
            'Whether labels, alternatives, errors and instructions are meaningful in their real context.',
          responsive:
            'Whether zoom, reflow, orientation and overlapping UI preserve access to content and focus.',
        },
        principle:
          'W3C guidance is explicit: evaluation tools can identify potential issues, but tools alone cannot determine whether a site is accessible.',
      },
      score: {
        eyebrow: 'The VulcanForgeUI score',
        title:
          'The score prioritizes detected issues; it is not a compliance percentage.',
        description:
          'The Accessibility Center starts at 100 and applies fixed penalties to the automated issues present in the current project data.',
        formula: '100 − (critical issues × 25) − (warnings × 10)',
        baseLabel: 'Starting score',
        baseValue: '100',
        criticalLabel: 'Critical issue',
        criticalValue: '−25',
        warningLabel: 'Warning',
        warningValue: '−10',
        floorLabel: 'Minimum displayed score',
        floorValue: '0',
        statusesLabel: 'Internal status bands',
        statuses: {
          healthy: '90–100 · Healthy',
          attention: '60–89 · Needs attention',
          critical: '0–59 · Critical',
        },
        exampleLabel: 'Example',
        exampleFormula: '100 − 25 − 10 = 65',
        exampleMeaning:
          'One critical issue plus one warning yields 65/100: Needs attention.',
        disclaimer:
          'A project can score 100/100 and still contain accessibility barriers that the current automated rules do not inspect. Conversely, the score is not a percentage of WCAG success criteria passed.',
      },
      productBridge: {
        eyebrow: 'How VulcanForgeUI represents accessibility today',
        title:
          'The Accessibility Center reads structured project data and turns detectable risks into actionable signals.',
        description:
          'The report combines Theme contrast evaluation with checks across Tokens and Component contracts. Issues keep a severity, scope and affected source so the user can return to the relevant editor.',
        items: {
          themes:
            'Theme contrast checks resolve configured color-role references and evaluate foreground/background pairs.',
          tokens:
            'Token checks can surface invalid sets, resolution failures and missing descriptions on Ready tokens for supported project languages.',
          components:
            'Component checks can surface invalid contracts, localization gaps, missing accessibility-rule collections, missing focusVisible states and binding problems.',
          issues:
            'Detected issues are grouped as warning or critical and retain their source context.',
          reports:
            'A report can be saved as a snapshot of the current automated result for later comparison.',
        },
        boundary:
          'The Accessibility Center is an automated design-system-data audit. It does not crawl or execute a downstream application, run a screen reader, certify WCAG conformance, or replace a complete manual accessibility audit.',
      },
      demo: {
        eyebrow: 'The Demo project',
        title:
          'Accessibility connects the decisions from the first four chapters.',
        description:
          'The Demo now shows why structured design decisions matter beyond visual consistency: they create inspectable relationships and expectations before implementation.',
        sequence: {
          token: 'Token · provide stable visual decisions and references',
          theme:
            'Theme · create color relationships that can be checked together',
          component:
            'Component · preserve states and accessibility expectations',
          audit:
            'Accessibility · detect structured risks and direct human review',
        },
      },
      misconception: {
        eyebrow: 'Common misconception',
        title: '“No automated issues” does not mean “accessible.”',
        description:
          'Automation can prove that specific machine-testable conditions passed. It cannot prove that the complete interface is understandable, operable and robust for real users. Treat a clean report as permission to continue validating, not as the end of the accessibility process.',
      },
      checkpoint: {
        eyebrow: 'Checkpoint',
        title: 'Before moving on, you should be able to explain…',
        description:
          'If these ideas are clear, the next chapter can focus on how structured Design System data leaves the editor and serves several downstream consumers.',
        items: {
          one: 'why accessibility is a property of repeated system decisions rather than a final checklist;',
          two: 'why contrast belongs to foreground/background relationships and can change with Theme mappings;',
          three:
            'why a documented focusVisible state is useful but cannot prove the runtime focus experience;',
          four: 'which categories of risk VulcanForgeUI currently detects automatically and why manual validation is still required;',
          five: 'why the Accessibility score is a prioritization signal rather than a WCAG compliance percentage.',
        },
      },
      continue: {
        eyebrow: 'Next chapter',
        status: 'Up next',
        title: 'Documentation & Delivery',
        description:
          'The system now contains structured decisions and validation signals. Next we will see how the same canonical project can feed documentation, code exports and other delivery formats without rebuilding those decisions by hand.',
      },
    },
  },
  fr: {
    LearnAccessibilityPage: {
      metadata: {
        title: 'Accessibilité — Apprendre | VulcanForgeUI',
        description:
          'Comprendre pourquoi l’accessibilité est une propriété du Design System, comment les décisions de contraste et de focus traversent le système, et ce que les contrôles automatisés peuvent ou non démontrer.',
      },
      hero: {
        chapter: 'Chapitre 05 · Accessibilité',
        title:
          'L’accessibilité appartient au système, pas à la fin du processus.',
        description:
          'Un Design System peut prévenir des familles entières de problèmes d’accessibilité lorsque les relations de contraste, les états d’interaction et les attentes des composants sont définis avant la construction des écrans. L’automatisation aide à repérer les risques, mais elle ne remplace jamais l’évaluation humaine.',
        learnerQuestion:
          'Quelles décisions d’accessibilité le système peut-il rendre visibles tôt, et quelles questions nécessitent encore de tester l’expérience réelle ?',
      },
      openingProblem: {
        eyebrow: 'Partons d’une décision de Theme',
        title:
          'Un seul mauvais mapping peut affaiblir tous les écrans qui en dépendent.',
        description:
          'Dans le projet Demo, le rôle de contenu secondaire est réutilisé dans plusieurs surfaces. Si le Theme Light pointe par erreur vers la valeur prévue pour le Theme Dark, tous les consommateurs héritent du même problème de contraste.',
        roleLabel: 'Rôle sémantique',
        role: 'muted',
        backgroundLabel: 'Arrière-plan Light',
        backgroundValue: '#F7F3EB',
        correct: {
          label: 'Mapping Light actuel',
          token: 'color.primitive.neutral.700',
          value: '#3A4454',
          ratio: '8.89:1',
          status: 'Validé',
          sample: 'Le contenu secondaire reste nettement lisible.',
        },
        drifted: {
          label: 'Mauvais mapping entre Themes',
          token: 'color.primitive.neutral.400',
          value: '#A0B1CA',
          ratio: '1.97:1',
          status: 'Échec',
          sample: 'Le même contenu devient difficile à distinguer.',
        },
        conclusion:
          'L’accessibilité est déjà une question de système : un seul mapping de Theme modifie l’expérience de chaque composant et écran qui dépend de ce rôle.',
      },
      systemProperty: {
        eyebrow: 'Une propriété du système',
        title: 'L’accessibilité traverse plusieurs couches du Design System.',
        description:
          'Aucun champ isolé ne peut rendre un produit accessible. Les décisions s’accumulent des fondations jusqu’à l’interface réelle, et chaque couche peut préserver ou dégrader l’expérience.',
        items: {
          tokens: {
            label: 'Tokens',
            description:
              'Fournissent des valeurs et références que les couches suivantes peuvent réutiliser de façon cohérente.',
          },
          themes: {
            label: 'Themes',
            description:
              'Créent des relations de couleurs contextuelles dont le contraste peut être évalué.',
          },
          components: {
            label: 'Components',
            description:
              'Documentent les états d’interaction, les attentes d’accessibilité et les usages interdits.',
          },
          runtime: {
            label: 'Interface réelle',
            description:
              'Transforme l’intention structurée en DOM, contrôles natifs, ordre de focus, contenu et interactions.',
          },
          humans: {
            label: 'Validation humaine',
            description:
              'Vérifie si l’expérience résultante est compréhensible et utilisable dans son contexte réel.',
          },
        },
        rule: 'Plus une décision d’accessibilité réutilisable est encodée tôt, moins chaque écran doit la redécouvrir indépendamment.',
      },
      contrast: {
        eyebrow: 'Relations de contraste',
        title:
          'Le contraste est une relation, pas une propriété d’une couleur isolée.',
        description:
          'Une même couleur de premier plan peut réussir sur un arrière-plan et échouer sur un autre. C’est pourquoi l’Accessibility Center évalue les paires premier plan/arrière-plan configurées dans les Themes après résolution des références de tokens.',
        productLabel: 'Règle actuelle des paires Theme dans VulcanForgeUI',
        rows: {
          pass: {
            range: '≥ 4.5:1',
            label: 'Validé',
            meaning: 'Atteint la cible actuelle pour du texte normal.',
          },
          warning: {
            range: '3.0–4.49:1',
            label: 'Avertissement',
            meaning:
              'Zone interne de priorisation : sous la cible actuelle pour du texte normal.',
          },
          fail: {
            range: '< 3.0:1',
            label: 'Échec',
            meaning: 'Signalé comme problème de contraste critique.',
          },
        },
        standardContext:
          'WCAG 2.2 fixe à 4.5:1 le minimum AA pour du texte normal et à 3:1 celui de certains grands textes. VulcanForgeUI évalue actuellement chaque paire Theme en mode texte normal : le produit ne déduit donc ni la taille réelle du texte ni le fait qu’une couleur serve à un élément d’interface non textuel.',
        boundary:
          'Une paire Theme validée indique que cette relation de couleurs satisfait la règle actuelle du produit. Cela ne prouve pas que chaque utilisation rendue de ces couleurs respecte les WCAG dans son contexte.',
      },
      focus: {
        eyebrow: 'Focus et états de composant',
        title:
          'Le focus clavier doit exister dans le contrat et rester visible dans l’interface réelle.',
        description:
          'Une personne qui navigue au clavier tout en voyant l’écran doit savoir quel contrôle recevra la prochaine action. Le système peut exiger un état focusVisible, mais seule l’interface rendue peut démontrer que l’indicateur est réellement visible, correctement ordonné et non masqué.',
        withoutLabel: 'Aucun indice de focus visible',
        withLabel: 'Indice de focus visible',
        button: 'Enregistrer',
        contractLabel: 'État du contrat Button actuel',
        contractValue: 'focusVisible',
        productRule:
          'L’Accessibility Center signale comme critique l’absence d’un état focusVisible sur les contrats interactifs Button et TextField, et comme avertissement sur Dialog. Il peut aussi signaler un contrat interactif sans aucune règle d’accessibilité.',
        manualRule:
          'Il n’inspecte pas une application en cours d’exécution pour vérifier l’indicateur de focus réel, l’ordre au clavier, la gestion du focus dans les dialogues ou le masquage du contrôle focalisé par des éléments sticky.',
      },
      automation: {
        eyebrow: 'Automatisation et évaluation humaine',
        title:
          'Automatiser les signaux déterministes, tester le comportement vécu avec des personnes et des technologies d’assistance.',
        description:
          'Les contrôles automatisés sont précieux parce qu’ils sont répétables et peuvent intervenir tôt. Leur rôle est de concentrer l’attention, pas de remplacer le jugement.',
        automatedLabel: 'Signaux automatisés actuels',
        manualLabel: 'Validation contextuelle toujours nécessaire',
        automated: {
          contrast:
            'Paires de contraste configurées dans les Themes et valeurs de premier plan/arrière-plan manquantes.',
          tokenResolution:
            'Jeux de tokens invalides, références de tokens non résolues et certains manques de documentation.',
          componentStructure:
            'Contrats de composants invalides, champs localisés incomplets et absence de collection de règles d’accessibilité.',
          focusState:
            'Absence d’état focusVisible sur les types de composants interactifs actuellement pris en charge.',
          bindings:
            'Bindings de tokens de composants introuvables et incohérences de type de token.',
        },
        manual: {
          semantics:
            'Vérifier que le contrôle rendu expose le bon rôle sémantique, le bon nom et les bonnes relations.',
          keyboard:
            'Vérifier que l’ordre au clavier, l’activation, les déplacements du focus et les widgets composites sont cohérents.',
          assistiveTechnology:
            'Tester l’expérience avec lecteurs d’écran, grossissement, commande vocale et autres technologies d’assistance.',
          content:
            'Évaluer si les libellés, alternatives, erreurs et instructions ont du sens dans leur contexte réel.',
          responsive:
            'Vérifier que zoom, reflow, orientation et éléments superposés conservent l’accès au contenu et au focus.',
        },
        principle:
          'La documentation W3C est explicite : les outils d’évaluation peuvent repérer des problèmes potentiels, mais ils ne peuvent pas déterminer à eux seuls si un site est accessible.',
      },
      score: {
        eyebrow: 'Le score VulcanForgeUI',
        title:
          'Le score aide à prioriser les problèmes détectés, ce n’est pas un pourcentage de conformité.',
        description:
          'L’Accessibility Center part de 100 et applique des pénalités fixes aux problèmes automatisés présents dans les données actuelles du projet.',
        formula: '100 − (problèmes critiques × 25) − (avertissements × 10)',
        baseLabel: 'Score de départ',
        baseValue: '100',
        criticalLabel: 'Problème critique',
        criticalValue: '−25',
        warningLabel: 'Avertissement',
        warningValue: '−10',
        floorLabel: 'Score minimum affiché',
        floorValue: '0',
        statusesLabel: 'Niveaux internes',
        statuses: {
          healthy: '90–100 · Sain',
          attention: '60–89 · À surveiller',
          critical: '0–59 · Critique',
        },
        exampleLabel: 'Exemple',
        exampleFormula: '100 − 25 − 10 = 65',
        exampleMeaning:
          'Un problème critique et un avertissement donnent 65/100 : À surveiller.',
        disclaimer:
          'Un projet peut obtenir 100/100 tout en contenant des obstacles que les règles automatisées actuelles n’inspectent pas. Inversement, ce score n’est pas le pourcentage de critères WCAG validés.',
      },
      productBridge: {
        eyebrow: 'Comment VulcanForgeUI représente l’accessibilité aujourd’hui',
        title:
          'L’Accessibility Center lit les données structurées du projet et transforme les risques détectables en signaux exploitables.',
        description:
          'Le rapport combine l’évaluation des contrastes de Themes et des contrôles sur les Tokens et les contrats Components. Chaque problème conserve une sévérité, un périmètre et une source afin de revenir vers l’éditeur concerné.',
        items: {
          themes:
            'Les contrôles Theme résolvent les références des rôles couleur configurés et évaluent des paires premier plan/arrière-plan.',
          tokens:
            'Les contrôles Tokens peuvent signaler des jeux invalides, des erreurs de résolution et des descriptions manquantes sur les tokens Ready dans les langues du projet.',
          components:
            'Les contrôles Components peuvent signaler des contrats invalides, des manques de localisation, l’absence de règles d’accessibilité, d’état focusVisible et des problèmes de bindings.',
          issues:
            'Les problèmes détectés sont classés en avertissement ou critique et conservent le contexte de leur source.',
          reports:
            'Un rapport peut être enregistré comme photographie du résultat automatisé actuel afin d’être comparé ultérieurement.',
        },
        boundary:
          'L’Accessibility Center est un audit automatisé des données du Design System. Il ne parcourt ni n’exécute une application générée, ne lance pas de lecteur d’écran, ne certifie pas la conformité WCAG et ne remplace pas un audit manuel complet.',
      },
      demo: {
        eyebrow: 'Le projet Demo',
        title:
          'L’accessibilité relie les décisions des quatre premiers chapitres.',
        description:
          'Le Demo montre maintenant pourquoi des décisions de design structurées servent à autre chose qu’à la cohérence visuelle : elles créent des relations et attentes inspectables avant même l’implémentation.',
        sequence: {
          token:
            'Token · fournir des décisions visuelles stables et référencées',
          theme: 'Theme · créer des relations de couleurs vérifiables ensemble',
          component:
            'Component · préserver les états et attentes d’accessibilité',
          audit:
            'Accessibilité · détecter les risques structurés et orienter la validation humaine',
        },
      },
      misconception: {
        eyebrow: 'Idée reçue fréquente',
        title: '« Aucun problème automatisé » ne signifie pas « accessible ».',
        description:
          'L’automatisation peut démontrer que certaines conditions testables par une machine sont satisfaites. Elle ne peut pas prouver que l’interface complète est compréhensible, utilisable et robuste pour des personnes réelles. Un rapport sans problème doit être le point de départ de la validation suivante, pas la fin du processus.',
      },
      checkpoint: {
        eyebrow: 'Checkpoint',
        title: 'Avant de continuer, vous devriez pouvoir expliquer…',
        description:
          'Si ces idées sont claires, le chapitre suivant pourra montrer comment les données structurées du Design System quittent l’éditeur pour servir plusieurs consommateurs.',
        items: {
          one: 'pourquoi l’accessibilité est une propriété des décisions répétées du système plutôt qu’une checklist finale,',
          two: 'pourquoi le contraste dépend d’une relation premier plan/arrière-plan et peut changer avec les mappings de Theme,',
          three:
            'pourquoi un état focusVisible documenté est utile sans pour autant prouver l’expérience de focus réelle,',
          four: 'quelles catégories de risques VulcanForgeUI détecte actuellement automatiquement et pourquoi une validation manuelle reste nécessaire,',
          five: 'pourquoi le score Accessibility est un signal de priorisation et non un pourcentage de conformité WCAG.',
        },
      },
      continue: {
        eyebrow: 'Chapitre suivant',
        status: 'À venir',
        title: 'Documentation & Delivery',
        description:
          'Le système contient maintenant des décisions structurées et des signaux de validation. Nous verrons ensuite comment le même projet canonique peut alimenter la documentation, les exports de code et d’autres formats de livraison sans reconstruire ces décisions à la main.',
      },
    },
  },
} as const;