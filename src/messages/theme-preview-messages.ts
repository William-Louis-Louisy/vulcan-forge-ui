export const themePreviewMessages = {
  en: {
    ThemesEditorPage: {
      preview: {
        eyebrow: 'Live preview',
        activeTheme: 'Active theme',
        palette: 'Resolved palette',
        mappedColors: 'mapped colors',
        fallbackColors: 'fallback colors',
        resolvedBadge: 'Resolved',
        fallbackBadge: 'Fallback',
        fallbackNotice:
          'Fallback colors are displayed for: {keys}. Complete or repair these mappings in the editor.',
        paletteKeys: {
          background: 'Background',
          surface: 'Surface',
          content: 'Content',
          muted: 'Muted',
          accent: 'Accent',
        },
      },
    },
  },
  fr: {
    ThemesEditorPage: {
      preview: {
        eyebrow: 'Aperçu en direct',
        activeTheme: 'Thème actif',
        palette: 'Palette résolue',
        mappedColors: 'couleurs associées',
        fallbackColors: 'couleurs de fallback',
        resolvedBadge: 'Résolu',
        fallbackBadge: 'Fallback',
        fallbackNotice:
          "Des couleurs de fallback sont affichées pour : {keys}. Complétez ou corrigez ces associations dans l’éditeur.",
        paletteKeys: {
          background: 'Arrière-plan',
          surface: 'Surface',
          content: 'Contenu',
          muted: 'Atténué',
          accent: 'Accent',
        },
      },
    },
  },
} as const;
