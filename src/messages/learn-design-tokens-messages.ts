export const learnDesignTokensMessages = {
  en: {
    LearnDesignTokensPage: {
      metadata: {
        title: 'Design Tokens explained · VulcanForge UI Learn',
        description:
          'Learn how Design Tokens turn raw values into named, reusable design decisions through primitive tokens, semantic tokens and references.',
      },
      hero: {
        chapter: 'Chapter 02 · Design Tokens',
        title: 'Give recurring design decisions a durable name.',
        description:
          'A raw value tells you what something is. A well-structured token can also tell your team what the decision means, where it belongs and how other decisions depend on it.',
        learnerQuestion:
          'What changes when #A94E2F stops being a copied color and becomes a shared design decision?',
      },
      openingProblem: {
        eyebrow: 'Start with the raw value',
        title: 'A value can be correct and still be difficult to maintain.',
        description:
          'The shared primary-action decision from Chapter 01 is now agreed. But if every screen stores #A94E2F directly, the decision is still repeated as disconnected data.',
        rawLabel: 'Raw value',
        meaningLabel: 'Meaning',
        locationLabel: 'Where it lives',
        cards: {
          checkout: {
            title: 'Checkout action',
            value: '#A94E2F',
            meaning: 'Primary action',
            location: 'checkout.css',
          },
          settings: {
            title: 'Settings action',
            value: '#A94E2F',
            meaning: 'Primary action',
            location: 'settings.tsx',
          },
          mobile: {
            title: 'Mobile action',
            value: '#A94E2F',
            meaning: 'Primary action',
            location: 'theme.native.ts',
          },
        },
        conclusion:
          'The team has one decision in its head, but three independent copies in its product. A token gives that decision an address.',
      },
      definition: {
        eyebrow: 'The concept',
        title: 'A Design Token is a named piece of design information.',
        description:
          'The Design Tokens Community Group describes tokens as indivisible pieces of a Design System. The useful mental model is simple: instead of passing anonymous values around, give important design decisions stable names and structured values.',
        anatomy: {
          path: {
            label: 'Path',
            value: 'color.primitive.brand.600',
            description: 'The stable address used to identify the decision.',
          },
          type: {
            label: 'Type',
            value: 'color',
            description: 'The kind of design information the value represents.',
          },
          value: {
            label: 'Value',
            value: '#A94E2F',
            description: 'The underlying data carried by the token.',
          },
          description: {
            label: 'Description',
            value: 'Primary brand color',
            description:
              'Human context that makes the decision easier to understand.',
          },
        },
      },
      primitive: {
        eyebrow: 'Layer 1 · Primitive',
        title: 'Primitive tokens name reusable foundation values.',
        description:
          'A primitive token stays close to the underlying design scale or palette. Its name usually describes what the value is rather than the UI job it will perform.',
        rawLabel: 'Before',
        tokenLabel: 'Primitive token',
        rawValue: '#A94E2F',
        tokenPath: 'color.primitive.brand.600',
        tokenValue: '#A94E2F',
        benefit:
          'The value now has one stable address. Consumers can stop copying the hexadecimal value itself.',
      },
      semantic: {
        eyebrow: 'Layer 2 · Semantic',
        title: 'Semantic tokens name intent instead of appearance.',
        description:
          'A semantic token answers a different question: what job does this decision perform in the interface? That extra layer lets purpose stay stable even when the underlying appearance changes.',
        primitiveLabel: 'What it is',
        semanticLabel: 'What it does',
        primitivePath: 'color.primitive.brand.600',
        semanticPath: 'color.semantic.action.primary',
        semanticDescription: 'Primary interactive action color',
        compare: {
          primitive: {
            title: 'Primitive',
            question: 'Which foundation value is this?',
            example: 'brand.600',
          },
          semantic: {
            title: 'Semantic',
            question: 'What role does this decision play?',
            example: 'action.primary',
          },
        },
        boundary:
          'Primitive and semantic are common architectural layers, not universal token types imposed by the DTCG specification.',
      },
      references: {
        eyebrow: 'Connect the layers',
        title:
          'A reference keeps the relationship instead of copying the value.',
        description:
          'The DTCG uses “alias” and “reference” interchangeably for a token whose value points to another token. VulcanForgeUI uses the same curly-brace reference shape for token relationships.',
        semanticLabel: 'Semantic token',
        referenceLabel: 'Reference',
        primitiveLabel: 'Primitive token',
        resolvedLabel: 'Resolved value',
        semanticPath: 'color.semantic.action.primary',
        reference: '{color.primitive.brand.600}',
        primitivePath: 'color.primitive.brand.600',
        resolvedValue: '#A94E2F',
        changeTitle: 'Why the relationship matters',
        changeBefore: '#A94E2F',
        changeAfter: '#B85737',
        changeDescription:
          'If the primitive value changes later, the semantic token can keep the same purpose and resolve through the existing reference instead of being rewritten as another hard-coded value.',
      },
      naming: {
        eyebrow: 'Naming carries meaning',
        title: 'A useful path tells you where a decision belongs.',
        description:
          'Names are architecture. A token path should help a team understand the layer and purpose without forcing every consumer to know the raw value.',
        weakLabel: 'Value-shaped thinking',
        weakExample: 'color.orange.600',
        strongLabel: 'Purpose-shaped thinking',
        strongExample: 'color.semantic.action.primary',
        note: 'Neither name is automatically right or wrong: they answer different questions. The important part is using each layer deliberately.',
      },
      categories: {
        eyebrow: 'Beyond color',
        title: 'Tokens can carry many kinds of recurring design information.',
        description:
          'VulcanForgeUI currently models five token-set types. Their values do not all have the same shape, and the current primitive/semantic color authoring model should not be assumed for every category.',
        items: {
          color: {
            title: 'Color',
            example: '#A94E2F',
            description: 'Palette values and semantic color roles.',
          },
          spacing: {
            title: 'Spacing',
            example: '1rem',
            description: 'Reusable distance and layout steps.',
          },
          radius: {
            title: 'Radius',
            example: '0.5rem',
            description: 'Reusable corner-rounding decisions.',
          },
          typography: {
            title: 'Typography',
            example: 'family · size · weight · line height',
            description: 'Composite text-style information.',
          },
          motion: {
            title: 'Motion',
            example: '150ms',
            description: 'Reusable timing decisions.',
          },
        },
      },
      demo: {
        eyebrow: 'The Demo project',
        title:
          'Our shared primary action now becomes an explicit dependency chain.',
        description:
          'Chapter 01 established the shared decision. Chapter 02 gives it structure using the current VulcanForgeUI color-token conventions.',
        conceptualLabel: 'Conceptual shorthand used in the public demo',
        conceptualPath: 'color.brand.600',
        productLabel: 'Current VulcanForgeUI primitive path',
        primitivePath: 'color.primitive.brand.600',
        primitiveValue: '#A94E2F',
        semanticPath: 'color.semantic.action.primary',
        semanticReference: '{color.primitive.brand.600}',
        note: 'The public Examples page keeps the shorter color.brand.600 label for its high-level walkthrough. Inside the current token editor, color primitives and semantic aliases use explicit color.primitive.* and color.semantic.* paths.',
      },
      productBridge: {
        eyebrow: 'How VulcanForgeUI represents this',
        title: 'The token editor stores decisions as structured project data.',
        description:
          'A Design Token in VulcanForgeUI has a path, type, value, optional localized description, optional reference and lifecycle status. Color authoring additionally recognizes primitive and semantic path conventions.',
        items: {
          path: 'Path identifies the token inside the project.',
          type: 'Type is one of color, spacing, radius, typography or motion.',
          value: 'Value stores scalar data or a structured typography value.',
          reference:
            'Reference can point to another token using {token.path} syntax.',
          description:
            'Description can document the decision in English and French.',
          status: 'Status records Draft, Ready or Deprecated lifecycle state.',
        },
        boundary:
          'Today, VulcanForgeUI exposes dedicated primitive/semantic creation for color tokens. Do not infer that every token category already has the same authoring workflow.',
      },
      misconception: {
        eyebrow: 'Common misconception',
        title: 'A token is not just a CSS variable with a fashionable name.',
        description:
          'CSS variables can be one generated representation of tokens, but the token is the design-system decision itself. The same project data can later feed CSS, TypeScript, React Native, documentation or AI instructions.',
      },
      checkpoint: {
        eyebrow: 'Checkpoint',
        title: 'You should now be able to explain:',
        description:
          'If you can describe these relationships without relying on the hexadecimal value, you are ready to use them in the next layer.',
        items: {
          one: 'why replacing repeated raw values with named tokens reduces disconnected copies;',
          two: 'the difference between a primitive value-oriented token and a semantic intent-oriented token;',
          three:
            'why a reference preserves a relationship instead of duplicating the resolved value;',
          four: 'why token architecture is broader than CSS variables or colors.',
        },
      },
      continue: {
        eyebrow: 'Continue learning',
        title: 'Next: Themes',
        description:
          'Now that tokens can express reusable values and intent, the next chapter will show how Themes resolve those decisions into different appearances without forcing components to hard-code them.',
        status: 'Up next',
      },
    },
  },
  fr: {
    LearnDesignTokensPage: {
      metadata: {
        title: 'Comprendre les Design Tokens · VulcanForge UI Learn',
        description:
          'Découvrez comment les Design Tokens transforment des valeurs brutes en décisions de design nommées et réutilisables grâce aux tokens primitifs, sémantiques et aux références.',
      },
      hero: {
        chapter: 'Chapitre 02 · Design Tokens',
        title: 'Donnez un nom durable aux décisions de design récurrentes.',
        description:
          'Une valeur brute vous dit ce qu’est une donnée. Un token bien structuré peut aussi indiquer à votre équipe ce que signifie la décision, où elle appartient et de quelles autres décisions elle dépend.',
        learnerQuestion:
          'Qu’est-ce qui change lorsque #A94E2F cesse d’être une couleur recopiée pour devenir une décision de design partagée ?',
      },
      openingProblem: {
        eyebrow: 'Commençons par la valeur brute',
        title:
          'Une valeur peut être correcte tout en restant difficile à maintenir.',
        description:
          'La décision d’action principale du chapitre 01 est maintenant partagée. Mais si chaque écran stocke directement #A94E2F, cette décision existe toujours sous forme de copies déconnectées.',
        rawLabel: 'Valeur brute',
        meaningLabel: 'Signification',
        locationLabel: 'Emplacement',
        cards: {
          checkout: {
            title: 'Action du checkout',
            value: '#A94E2F',
            meaning: 'Action principale',
            location: 'checkout.css',
          },
          settings: {
            title: 'Action des réglages',
            value: '#A94E2F',
            meaning: 'Action principale',
            location: 'settings.tsx',
          },
          mobile: {
            title: 'Action mobile',
            value: '#A94E2F',
            meaning: 'Action principale',
            location: 'theme.native.ts',
          },
        },
        conclusion:
          'L’équipe possède une seule décision dans sa tête, mais trois copies indépendantes dans le produit. Un token donne une adresse à cette décision.',
      },
      definition: {
        eyebrow: 'Le concept',
        title: 'Un Design Token est une information de design nommée.',
        description:
          'Le Design Tokens Community Group décrit les tokens comme des éléments indivisibles d’un Design System. Le modèle mental utile reste simple : au lieu de faire circuler des valeurs anonymes, donnez aux décisions importantes un nom stable et une valeur structurée.',
        anatomy: {
          path: {
            label: 'Chemin',
            value: 'color.primitive.brand.600',
            description:
              'L’adresse stable utilisée pour identifier la décision.',
          },
          type: {
            label: 'Type',
            value: 'color',
            description:
              'La nature de l’information de design représentée par la valeur.',
          },
          value: {
            label: 'Valeur',
            value: '#A94E2F',
            description: 'La donnée sous-jacente transportée par le token.',
          },
          description: {
            label: 'Description',
            value: 'Couleur principale de marque',
            description:
              'Le contexte humain qui rend la décision plus facile à comprendre.',
          },
        },
      },
      primitive: {
        eyebrow: 'Couche 1 · Primitif',
        title:
          'Les tokens primitifs nomment des valeurs de fondation réutilisables.',
        description:
          'Un token primitif reste proche de l’échelle ou de la palette sous-jacente. Son nom décrit généralement ce qu’est la valeur plutôt que la fonction qu’elle remplira dans l’interface.',
        rawLabel: 'Avant',
        tokenLabel: 'Token primitif',
        rawValue: '#A94E2F',
        tokenPath: 'color.primitive.brand.600',
        tokenValue: '#A94E2F',
        benefit:
          'La valeur possède maintenant une adresse stable. Les consommateurs peuvent cesser de recopier directement la valeur hexadécimale.',
      },
      semantic: {
        eyebrow: 'Couche 2 · Sémantique',
        title:
          'Les tokens sémantiques nomment une intention plutôt qu’une apparence.',
        description:
          'Un token sémantique répond à une autre question : quel rôle cette décision joue-t-elle dans l’interface ? Cette couche supplémentaire permet à l’intention de rester stable même lorsque l’apparence sous-jacente change.',
        primitiveLabel: 'Ce que c’est',
        semanticLabel: 'Ce que ça fait',
        primitivePath: 'color.primitive.brand.600',
        semanticPath: 'color.semantic.action.primary',
        semanticDescription: 'Couleur principale des actions interactives',
        compare: {
          primitive: {
            title: 'Primitif',
            question: 'Quelle valeur de fondation est-ce ?',
            example: 'brand.600',
          },
          semantic: {
            title: 'Sémantique',
            question: 'Quel rôle cette décision joue-t-elle ?',
            example: 'action.primary',
          },
        },
        boundary:
          'Primitif et sémantique sont des couches d’architecture courantes, pas des types universels imposés par la spécification DTCG.',
      },
      references: {
        eyebrow: 'Relions les couches',
        title:
          'Une référence conserve la relation au lieu de recopier la valeur.',
        description:
          'La DTCG utilise « alias » et « référence » comme synonymes pour un token dont la valeur pointe vers un autre token. VulcanForgeUI utilise la même forme de référence entre accolades pour relier ses tokens.',
        semanticLabel: 'Token sémantique',
        referenceLabel: 'Référence',
        primitiveLabel: 'Token primitif',
        resolvedLabel: 'Valeur résolue',
        semanticPath: 'color.semantic.action.primary',
        reference: '{color.primitive.brand.600}',
        primitivePath: 'color.primitive.brand.600',
        resolvedValue: '#A94E2F',
        changeTitle: 'Pourquoi la relation est importante',
        changeBefore: '#A94E2F',
        changeAfter: '#B85737',
        changeDescription:
          'Si la valeur primitive change plus tard, le token sémantique peut conserver le même rôle et se résoudre via la référence existante au lieu d’être réécrit avec une nouvelle valeur en dur.',
      },
      naming: {
        eyebrow: 'Le nom porte du sens',
        title: 'Un chemin utile indique où une décision appartient.',
        description:
          'Les noms font partie de l’architecture. Le chemin d’un token doit aider l’équipe à comprendre sa couche et son rôle sans obliger chaque consommateur à connaître la valeur brute.',
        weakLabel: 'Pensée orientée valeur',
        weakExample: 'color.orange.600',
        strongLabel: 'Pensée orientée intention',
        strongExample: 'color.semantic.action.primary',
        note: 'Aucun des deux noms n’est automatiquement bon ou mauvais : ils répondent à des questions différentes. L’important est d’utiliser chaque couche intentionnellement.',
      },
      categories: {
        eyebrow: 'Au-delà de la couleur',
        title:
          'Les tokens peuvent transporter de nombreux types d’informations de design récurrentes.',
        description:
          'VulcanForgeUI modélise actuellement cinq types de jeux de tokens. Leurs valeurs n’ont pas toutes la même forme et le modèle d’édition primitif/sémantique actuel des couleurs ne doit pas être généralisé à toutes les catégories.',
        items: {
          color: {
            title: 'Couleur',
            example: '#A94E2F',
            description: 'Valeurs de palette et rôles de couleur sémantiques.',
          },
          spacing: {
            title: 'Espacement',
            example: '1rem',
            description: 'Distances et pas de mise en page réutilisables.',
          },
          radius: {
            title: 'Rayon',
            example: '0.5rem',
            description: 'Décisions d’arrondi réutilisables.',
          },
          typography: {
            title: 'Typographie',
            example: 'famille · taille · graisse · interligne',
            description: 'Informations composites de style de texte.',
          },
          motion: {
            title: 'Motion',
            example: '150ms',
            description: 'Décisions de durée réutilisables.',
          },
        },
      },
      demo: {
        eyebrow: 'Le projet Demo',
        title:
          'Notre action principale partagée devient maintenant une chaîne de dépendances explicite.',
        description:
          'Le chapitre 01 a établi la décision partagée. Le chapitre 02 lui donne une structure avec les conventions de tokens couleur actuellement utilisées par VulcanForgeUI.',
        conceptualLabel: 'Raccourci conceptuel utilisé dans la démo publique',
        conceptualPath: 'color.brand.600',
        productLabel: 'Chemin primitif actuel dans VulcanForgeUI',
        primitivePath: 'color.primitive.brand.600',
        primitiveValue: '#A94E2F',
        semanticPath: 'color.semantic.action.primary',
        semanticReference: '{color.primitive.brand.600}',
        note: 'La page publique Examples conserve le libellé plus court color.brand.600 pour sa démonstration générale. Dans l’éditeur de tokens actuel, les couleurs primitives et les alias sémantiques utilisent explicitement les chemins color.primitive.* et color.semantic.*.',
      },
      productBridge: {
        eyebrow: 'Comment VulcanForgeUI représente cela',
        title:
          'L’éditeur de tokens stocke les décisions comme des données structurées du projet.',
        description:
          'Un Design Token dans VulcanForgeUI possède un chemin, un type, une valeur, une description localisée optionnelle, une référence optionnelle et un statut de cycle de vie. L’édition des couleurs reconnaît en plus les conventions de chemins primitifs et sémantiques.',
        items: {
          path: 'Path identifie le token dans le projet.',
          type: 'Type vaut color, spacing, radius, typography ou motion.',
          value:
            'Value stocke une donnée scalaire ou une valeur typographique structurée.',
          reference:
            'Reference peut pointer vers un autre token avec la syntaxe {token.path}.',
          description:
            'Description peut documenter la décision en anglais et en français.',
          status: 'Status indique Draft, Ready ou Deprecated.',
        },
        boundary:
          'Aujourd’hui, VulcanForgeUI expose une création primitive/sémantique dédiée aux tokens de couleur. Il ne faut pas en déduire que toutes les catégories possèdent déjà le même workflow d’édition.',
      },
      misconception: {
        eyebrow: 'Idée reçue fréquente',
        title:
          'Un token n’est pas seulement une variable CSS avec un nom à la mode.',
        description:
          'Les variables CSS peuvent être une représentation générée des tokens, mais le token est la décision du Design System elle-même. Les mêmes données projet peuvent ensuite alimenter CSS, TypeScript, React Native, la documentation ou les consignes IA.',
      },
      checkpoint: {
        eyebrow: 'Point de contrôle',
        title: 'Vous devriez maintenant pouvoir expliquer :',
        description:
          'Si vous pouvez décrire ces relations sans dépendre de la valeur hexadécimale, vous êtes prêt à les utiliser dans la couche suivante.',
        items: {
          one: 'pourquoi remplacer des valeurs brutes répétées par des tokens nommés réduit les copies déconnectées ;',
          two: 'la différence entre un token primitif orienté valeur et un token sémantique orienté intention ;',
          three:
            'pourquoi une référence conserve une relation au lieu de dupliquer la valeur résolue ;',
          four: 'pourquoi l’architecture de tokens va au-delà des variables CSS ou des couleurs.',
        },
      },
      continue: {
        eyebrow: 'Poursuivre le parcours',
        title: 'Ensuite : Themes',
        description:
          'Maintenant que les tokens peuvent exprimer des valeurs réutilisables et une intention, le prochain chapitre montrera comment les Themes résolvent ces décisions en différentes apparences sans forcer les composants à les coder en dur.',
        status: 'Prochainement',
      },
    },
  },
} as const;
