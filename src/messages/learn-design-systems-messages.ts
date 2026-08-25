export const learnDesignSystemsMessages = {
  en: {
    LearnDesignSystemsPage: {
      metadata: {
        title: 'What is a Design System? · VulcanForge UI Learn',
        description:
          'Learn why Design Systems exist, how they differ from component libraries, and how shared decisions help teams build coherent digital products.',
      },
      hero: {
        chapter: 'Chapter 01 · Design Systems',
        title: 'A Design System is more than reusable UI.',
        description:
          'It is a shared system of decisions, foundations, components and guidance that helps a product stay coherent as more people, screens and technologies are added.',
        learnerQuestion:
          'Why would a team need a Design System instead of simply reusing some components?',
      },
      openingProblem: {
        eyebrow: 'Start with the problem',
        title:
          'Small differences become expensive when nobody owns the decision.',
        description:
          'Imagine three teams building the same primary action independently. Each result is reasonable on its own. Together, they create drift.',
        screenLabel: 'Screen {number}',
        buttonLabel: 'Continue',
        cards: {
          first: {
            color: '#A94E2F',
            radius: '14 px radius',
            padding: '12 × 16 px padding',
            focus: 'Visible focus state',
          },
          second: {
            color: '#A34B31',
            radius: '12 px radius',
            padding: '10 × 16 px padding',
            focus: 'Visible focus state',
          },
          third: {
            color: '#A94E2F',
            radius: '14 px radius',
            padding: '12 × 16 px padding',
            focus: 'No agreed focus treatment',
          },
        },
        conclusion:
          'The problem is not that one team chose the wrong value. The problem is that the product has no shared answer to the same question.',
      },
      definition: {
        eyebrow: 'The concept',
        title:
          'A Design System turns repeated choices into shared product knowledge.',
        intro:
          'Different Design Systems organize that knowledge differently, but mature systems usually combine several kinds of shared material rather than stopping at code components.',
        parts: {
          language: {
            title: 'Shared language',
            description:
              'Names and concepts let designers, developers and other product roles discuss the same decisions without translating between private vocabularies.',
          },
          foundations: {
            title: 'Foundations',
            description:
              'Color, spacing, typography, motion and other recurring decisions become deliberate building blocks instead of values recreated screen by screen.',
          },
          components: {
            title: 'Components',
            description:
              'Reusable interface building blocks capture recurring structure and behavior so teams do not solve the same interaction from scratch every time.',
          },
          guidance: {
            title: 'Guidance',
            description:
              'Usage rules, accessibility expectations and examples explain when a building block fits, how it should behave and which mistakes to avoid.',
          },
        },
      },
      distinction: {
        eyebrow: 'A useful distinction',
        title:
          'A component library can be part of a Design System. It is not the whole system.',
        description:
          'A library answers “what reusable UI can I render?” A Design System also helps answer “which decision should we make, why, and how should that decision stay consistent across the product?”',
        library: {
          title: 'Component library',
          items: {
            one: 'Reusable UI building blocks',
            two: 'Implementation APIs and code',
            three: 'A faster starting point for screens',
          },
        },
        system: {
          title: 'Design System',
          items: {
            one: 'Shared foundations and design decisions',
            two: 'Reusable components plus behavior expectations',
            three: 'Guidance, accessibility and usage knowledge',
            four: 'A common language across disciplines',
          },
        },
      },
      whyMatters: {
        eyebrow: 'Why it matters',
        title: 'The system reduces repeated reasoning, not just repeated code.',
        description:
          'Consistency is useful, but the deeper benefit is that important product knowledge stops living only in individual files, mockups or people’s memories.',
        items: {
          continuity: {
            title: 'Continuity',
            description:
              'A shared decision can survive new screens, new teams and staff changes without being rediscovered from scratch.',
          },
          speed: {
            title: 'Faster decisions',
            description:
              'Teams can start from an agreed answer to common problems and spend more time on the parts that are truly specific to the user need.',
          },
          quality: {
            title: 'Coherent quality',
            description:
              'Visual behavior, interaction patterns and accessibility expectations can evolve together instead of drifting independently.',
          },
          collaboration: {
            title: 'Shared understanding',
            description:
              'Design and engineering can discuss intent using the same concepts instead of treating design files and code as separate sources of truth.',
          },
        },
      },
      demo: {
        eyebrow: 'The Demo project',
        title: 'Systemization starts before the token or component exists.',
        description:
          'Our recurring Demo project begins with one primary-action color. In this chapter, the important step is not yet how to encode it. It is deciding that the product should have one shared answer for the primary action.',
        beforeLabel: 'Before the system',
        beforeDescription:
          'Three screens repeat similar choices independently. A future change means finding and reasoning about each implementation again.',
        afterLabel: 'Shared product decision',
        afterDescription:
          'The team agrees that the primary action is a named product decision. Later chapters will show how tokens, themes and component contracts make that decision explicit and reusable.',
        decisionLabel: 'Primary action decision',
        decisionValue: '#A94E2F',
        bridge:
          'The important transformation is raw choice → shared meaning. The technical layers come next.',
      },
      systemMap: {
        eyebrow: 'The wider system',
        title:
          'A Design System connects decisions to the experiences people actually use.',
        description:
          'The exact architecture varies by organization. Keep this beginner model in mind as the rest of Learn adds detail.',
        nodes: {
          intent: 'Product & brand intent',
          foundations: 'Foundations & design decisions',
          components: 'Reusable components',
          guidance: 'Guidance & accessibility expectations',
          experience: 'Coherent product experiences',
        },
      },
      productBridge: {
        eyebrow: 'How VulcanForgeUI represents this',
        title: 'VulcanForgeUI separates the system into connected workspaces.',
        description:
          'These workspaces do not replace Design System thinking. They give the decisions a structured place to live so humans and generated outputs can refer to the same project.',
        items: {
          brand: 'Brand captures project intent and direction.',
          tokens: 'Tokens make reusable design decisions explicit.',
          themes: 'Themes map semantic roles to appearance-specific decisions.',
          components: 'Components describe reusable component contracts.',
          accessibility:
            'Accessibility consolidates checks the product can evaluate.',
          delivery:
            'Documentation, Exports and AI Instructions consume structured project data.',
        },
        examplesCta: 'See the Demo project workflow',
      },
      misconception: {
        eyebrow: 'Common misconception',
        title: 'Consistency does not mean every product must look identical.',
        description:
          'A useful Design System standardizes the decisions that benefit from being shared while leaving room for real product needs. The goal is coherent intent, not sameness for its own sake.',
      },
      checkpoint: {
        eyebrow: 'Checkpoint',
        title: 'You should now be able to explain:',
        description:
          'If these ideas make sense in your own words, you have the foundation needed for the next chapter.',
        items: {
          one: 'why repeated reasonable choices can still create design drift;',
          two: 'why a component library is only one part of a broader Design System;',
          three:
            'why shared product knowledge matters to both designers and developers.',
        },
      },
      continue: {
        eyebrow: 'Continue learning',
        title: 'Next: Design Tokens',
        description:
          'Now that the need for shared decisions is clear, the next chapter will show how Design Tokens give those decisions durable names, values and relationships.',
        status: 'Up next',
      },
    },
  },
  fr: {
    LearnDesignSystemsPage: {
      metadata: {
        title: 'Qu’est-ce qu’un Design System ? · VulcanForge UI Learn',
        description:
          'Découvrez pourquoi les Design Systems existent, en quoi ils diffèrent des bibliothèques de composants et comment des décisions partagées aident les équipes à construire des produits numériques cohérents.',
      },
      hero: {
        chapter: 'Chapitre 01 · Design Systems',
        title: 'Un Design System va au-delà d’une interface réutilisable.',
        description:
          'C’est un système partagé de décisions, de fondations, de composants et de règles qui aide un produit à rester cohérent quand les équipes, les écrans et les technologies se multiplient.',
        learnerQuestion:
          'Pourquoi une équipe aurait-elle besoin d’un Design System plutôt que de simplement réutiliser quelques composants ?',
      },
      openingProblem: {
        eyebrow: 'Commençons par le problème',
        title:
          'De petites différences deviennent coûteuses quand personne ne porte la décision.',
        description:
          'Imaginez trois équipes qui construisent indépendamment la même action principale. Chaque résultat est raisonnable pris séparément. Ensemble, ils créent de la dérive.',
        screenLabel: 'Écran {number}',
        buttonLabel: 'Continuer',
        cards: {
          first: {
            color: '#A94E2F',
            radius: 'Rayon de 14 px',
            padding: 'Padding 12 × 16 px',
            focus: 'État de focus visible',
          },
          second: {
            color: '#A34B31',
            radius: 'Rayon de 12 px',
            padding: 'Padding 10 × 16 px',
            focus: 'État de focus visible',
          },
          third: {
            color: '#A94E2F',
            radius: 'Rayon de 14 px',
            padding: 'Padding 12 × 16 px',
            focus: 'Aucun traitement de focus convenu',
          },
        },
        conclusion:
          'Le problème n’est pas qu’une équipe ait choisi la mauvaise valeur. Le problème est que le produit ne possède pas de réponse partagée à la même question.',
      },
      definition: {
        eyebrow: 'Le concept',
        title:
          'Un Design System transforme des choix répétés en connaissance produit partagée.',
        intro:
          'Les Design Systems organisent cette connaissance de différentes façons, mais les systèmes matures combinent généralement plusieurs types de ressources partagées au lieu de s’arrêter aux composants de code.',
        parts: {
          language: {
            title: 'Langage partagé',
            description:
              'Des noms et concepts permettent aux designers, développeurs et autres métiers produit de parler des mêmes décisions sans traduire entre des vocabulaires privés.',
          },
          foundations: {
            title: 'Fondations',
            description:
              'Couleur, espacement, typographie, motion et autres décisions récurrentes deviennent des briques délibérées plutôt que des valeurs recréées écran par écran.',
          },
          components: {
            title: 'Composants',
            description:
              'Des briques d’interface réutilisables capturent des structures et comportements récurrents afin de ne pas résoudre la même interaction depuis zéro à chaque fois.',
          },
          guidance: {
            title: 'Règles et recommandations',
            description:
              'Les règles d’usage, attentes d’accessibilité et exemples expliquent quand une brique est adaptée, comment elle doit se comporter et quelles erreurs éviter.',
          },
        },
      },
      distinction: {
        eyebrow: 'Une distinction utile',
        title:
          'Une bibliothèque de composants peut faire partie d’un Design System. Elle n’est pas le système entier.',
        description:
          'Une bibliothèque répond à « quelle UI réutilisable puis-je afficher ? ». Un Design System aide aussi à répondre à « quelle décision devons-nous prendre, pourquoi, et comment la garder cohérente dans le produit ? ».',
        library: {
          title: 'Bibliothèque de composants',
          items: {
            one: 'Briques d’interface réutilisables',
            two: 'API d’implémentation et code',
            three: 'Un point de départ plus rapide pour les écrans',
          },
        },
        system: {
          title: 'Design System',
          items: {
            one: 'Fondations et décisions de design partagées',
            two: 'Composants réutilisables avec attentes de comportement',
            three: 'Règles d’usage, accessibilité et connaissance métier',
            four: 'Un langage commun entre disciplines',
          },
        },
      },
      whyMatters: {
        eyebrow: 'Pourquoi c’est important',
        title:
          'Le système réduit le raisonnement répété, pas seulement le code répété.',
        description:
          'La cohérence est utile, mais le bénéfice plus profond est que la connaissance produit importante cesse de vivre uniquement dans des fichiers, des maquettes ou la mémoire de quelques personnes.',
        items: {
          continuity: {
            title: 'Continuité',
            description:
              'Une décision partagée peut survivre à de nouveaux écrans, de nouvelles équipes et des changements de personnes sans être redécouverte depuis zéro.',
          },
          speed: {
            title: 'Décisions plus rapides',
            description:
              'Les équipes partent d’une réponse convenue aux problèmes courants et consacrent davantage de temps aux besoins réellement spécifiques des utilisateurs.',
          },
          quality: {
            title: 'Qualité cohérente',
            description:
              'Comportement visuel, interactions et attentes d’accessibilité peuvent évoluer ensemble plutôt que dériver séparément.',
          },
          collaboration: {
            title: 'Compréhension partagée',
            description:
              'Design et développement peuvent discuter de l’intention avec les mêmes concepts au lieu de traiter les maquettes et le code comme deux vérités séparées.',
          },
        },
      },
      demo: {
        eyebrow: 'Le projet Demo',
        title:
          'La mise en système commence avant même le token ou le composant.',
        description:
          'Notre projet Demo récurrent part d’une couleur d’action principale. Dans ce chapitre, l’étape importante n’est pas encore de savoir comment l’encoder. Il s’agit de décider que le produit doit avoir une réponse partagée pour cette action principale.',
        beforeLabel: 'Avant le système',
        beforeDescription:
          'Trois écrans répètent des choix proches indépendamment. Un futur changement impose de retrouver et de réévaluer chaque implémentation.',
        afterLabel: 'Décision produit partagée',
        afterDescription:
          'L’équipe convient que l’action principale est une décision produit nommée. Les prochains chapitres montreront comment tokens, thèmes et contrats de composants rendent cette décision explicite et réutilisable.',
        decisionLabel: 'Décision d’action principale',
        decisionValue: '#A94E2F',
        bridge:
          'La transformation importante est choix brut → signification partagée. Les couches techniques viennent ensuite.',
      },
      systemMap: {
        eyebrow: 'Le système dans son ensemble',
        title:
          'Un Design System relie les décisions aux expériences réellement utilisées.',
        description:
          'L’architecture exacte varie selon les organisations. Gardez ce modèle débutant en tête pendant que les autres chapitres ajoutent progressivement du détail.',
        nodes: {
          intent: 'Intention produit & marque',
          foundations: 'Fondations & décisions de design',
          components: 'Composants réutilisables',
          guidance: 'Règles & attentes d’accessibilité',
          experience: 'Expériences produit cohérentes',
        },
      },
      productBridge: {
        eyebrow: 'Comment VulcanForgeUI représente cela',
        title:
          'VulcanForgeUI sépare le système en espaces de travail connectés.',
        description:
          'Ces espaces ne remplacent pas la réflexion Design System. Ils donnent aux décisions un endroit structuré où vivre afin que les humains et les sorties générées puissent se référer au même projet.',
        items: {
          brand: 'Brand capture l’intention et la direction du projet.',
          tokens:
            'Tokens rend les décisions de design réutilisables explicites.',
          themes:
            'Themes associe des rôles sémantiques à des décisions propres à une apparence.',
          components:
            'Components décrit des contrats de composants réutilisables.',
          accessibility:
            'Accessibility regroupe les vérifications que le produit peut évaluer.',
          delivery:
            'Documentation, Exports et AI Instructions consomment les données structurées du projet.',
        },
        examplesCta: 'Voir le workflow du projet Demo',
      },
      misconception: {
        eyebrow: 'Idée reçue fréquente',
        title:
          'La cohérence ne signifie pas que tous les produits doivent être identiques.',
        description:
          'Un Design System utile standardise les décisions qui gagnent à être partagées tout en laissant de la place aux vrais besoins produit. L’objectif est une intention cohérente, pas l’uniformité pour elle-même.',
      },
      checkpoint: {
        eyebrow: 'Point de contrôle',
        title: 'Vous devriez maintenant pouvoir expliquer :',
        description:
          'Si ces idées ont du sens avec vos propres mots, vous avez la base nécessaire pour le chapitre suivant.',
        items: {
          one: 'pourquoi plusieurs choix raisonnables peuvent malgré tout créer de la dérive ;',
          two: 'pourquoi une bibliothèque de composants n’est qu’une partie d’un Design System plus large ;',
          three:
            'pourquoi une connaissance produit partagée est utile aux designers comme aux développeurs.',
        },
      },
      continue: {
        eyebrow: 'Poursuivre le parcours',
        title: 'Ensuite : Design Tokens',
        description:
          'Maintenant que le besoin de décisions partagées est clair, le prochain chapitre montrera comment les Design Tokens donnent à ces décisions des noms, valeurs et relations durables.',
        status: 'Prochainement',
      },
    },
  },
} as const;
