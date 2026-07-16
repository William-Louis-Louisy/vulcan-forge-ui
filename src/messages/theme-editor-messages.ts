export const themeEditorMessages = {
  en: {
    ThemesEditorPage: {
      themes: {
        count: '{count, plural, =0 {No theme} one {# theme} other {# themes}}',
        navigationLabel: 'Theme modes',
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
    },
  },
  fr: {
    ThemesEditorPage: {
      themes: {
        count:
          '{count, plural, =0 {Aucun thème} one {# thème} other {# thèmes}}',
        navigationLabel: 'Modes de thème',
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
    },
  },
} as const;
