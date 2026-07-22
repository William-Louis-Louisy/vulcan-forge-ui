export const themeEditorMessages = {
  en: {
    ThemesEditorPage: {
      workspaceTitle: 'Themes',
      description:
        'Map existing color tokens to light and dark theme roles, preview core components and review WCAG contrast.',
      workspace: {
        navigationLabel: 'Theme editor sections',
      },
      themes: {
        count: '{count, plural, =0 {No theme} one {# theme} other {# themes}}',
        navigationLabel: 'Theme modes',
        emptyTitle: 'No theme is configured',
        emptyDescription:
          'This project does not currently contain a light or dark theme. Theme editing and preview are unavailable until theme data is configured.',
      },
      themeMapping: {
        noTokenOptionsTitle: 'No usable color token',
        noTokenOptionsDescription:
          'Theme roles require at least one color token that resolves to a valid HEX value. Create or repair color tokens before editing these mappings.',
      },
      contrast: {
        title: 'Contrast matrix',
        description:
          'Review WCAG text contrast grades for the configured foreground and background combinations.',
        grades: {
          aaa: 'AAA',
          aa: 'AA',
          largeOnly: 'Large text only',
          fail: 'Fail',
        },
        pairs: {
          mutedOnSurface: 'Muted content on surface',
          accentOnSurface: 'Accent on surface',
        },
      },
      states: {
        errorEyebrow: 'Themes unavailable',
      },
    },
  },
  fr: {
    ThemesEditorPage: {
      workspaceTitle: 'Thèmes',
      description:
        'Associez les tokens couleur existants aux rôles des thèmes clair et sombre, prévisualisez les composants principaux et vérifiez les contrastes WCAG.',
      workspace: {
        navigationLabel: 'Sections de l’éditeur de thèmes',
      },
      themes: {
        count:
          '{count, plural, =0 {Aucun thème} one {# thème} other {# thèmes}}',
        navigationLabel: 'Modes de thème',
        emptyTitle: 'Aucun thème configuré',
        emptyDescription:
          'Ce projet ne contient actuellement aucun thème clair ou sombre. L’édition et la prévisualisation resteront indisponibles tant que les données de thème ne seront pas configurées.',
      },
      themeMapping: {
        noTokenOptionsTitle: 'Aucun token couleur utilisable',
        noTokenOptionsDescription:
          'Les rôles du thème nécessitent au moins un token couleur résolu en valeur HEX valide. Créez ou corrigez les tokens couleur avant de modifier ces mappings.',
      },
      contrast: {
        title: 'Matrice de contraste',
        description:
          'Vérifiez les niveaux WCAG du contraste textuel pour les combinaisons de premier plan et d’arrière-plan configurées.',
        grades: {
          aaa: 'AAA',
          aa: 'AA',
          largeOnly: 'Texte large uniquement',
          fail: 'Échec',
        },
        pairs: {
          mutedOnSurface: 'Contenu atténué sur surface',
          accentOnSurface: 'Accent sur surface',
        },
      },
      states: {
        errorEyebrow: 'Thèmes indisponibles',
      },
    },
  },
} as const;
