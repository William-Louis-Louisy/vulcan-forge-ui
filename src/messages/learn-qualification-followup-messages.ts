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
    },
  },
} as const;
