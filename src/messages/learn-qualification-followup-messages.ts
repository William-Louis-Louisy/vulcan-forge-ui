export const learnQualificationFollowupMessages = {
  en: {},
  fr: {
    LearnThemesPage: {
      accessibility: {
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
          'Il n’existe actuellement ni création arbitraire de SearchBar ou ProductCard, ni canvas libre, ni modèle général de composition de composants. Ces questions appartiennent à la future phase d’exploration de l’espace Components V2, pas à cette itération Learn.',
      },
    },
  },
} as const;
