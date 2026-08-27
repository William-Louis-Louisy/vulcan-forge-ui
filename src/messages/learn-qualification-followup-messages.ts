export const learnQualificationFollowupMessages = {
  en: {},
  fr: {
    LearnThemesPage: {
      accessibility: {
        description:
          'Modifier les associations crée de nouvelles relations entre premier plan et arrière-plan. Un thème sombre n’est pas automatiquement accessible parce qu’il est sombre, pas plus qu’un thème clair ne l’est parce qu’il est clair.',
        items: {
          contrast:
            'Réévaluez les contrastes du texte et de l’interface après chaque changement d’association dans un thème.',
        },
      },
    },
    LearnComponentsPage: {
      rules: {
        items: {
          accessibility: {
            description:
              'La configuration actuelle exige un nom accessible et une activation clavier avec Entrée et Espace.',
          },
          forbidden: {
            description:
              'La configuration actuelle indique explicitement de ne pas utiliser un bouton comme lien de navigation.',
          },
        },
      },
      accessibility: {
        items: {
          accessibleName:
            'La configuration actuelle du Button exige un nom accessible.',
          keyboard:
            'La configuration actuelle du Button exige une activation avec Entrée et Espace.',
        },
      },
      productBridge: {
        description:
          'Ce chapitre décrit la structure réellement présente dans le produit sans prétendre que la future version V2 de l’espace Components existe déjà.',
        boundary:
          'Il n’existe actuellement ni création arbitraire de SearchBar ou ProductCard, ni surface de composition libre, ni modèle général de composition de composants. Ces questions appartiennent à la future phase d’exploration de l’espace Components V2, pas à cette itération Learn.',
      },
    },
    LearnDesignTokensPage: {
      demo: {
        note: 'La page publique Exemples conserve le libellé plus court color.brand.600 pour sa présentation générale. Dans l’éditeur de tokens actuel, les couleurs primitives et les références sémantiques utilisent explicitement les chemins color.primitive.* et color.semantic.*.',
      },
    },
    LearnAiReadyDesignSystemsPage: {
      complete: {
        next: 'Utilisez Exemples pour retrouver le parcours produit condensé. Revenez dans Learn lorsque vous avez besoin de comprendre le raisonnement derrière une décision du système.',
      },
    },
  },
} as const;
