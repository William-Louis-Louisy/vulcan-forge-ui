export const accessibilityCenterMessages = {
  en: {
    AccessibilityCenterPage: {
      description:
        'Review automated accessibility signals, inspect detected issues and verify the configured theme contrast pairs.',
      issues: {
        detailTitle: 'Issue detail',
        automatic: 'Automated check',
        recommendation: 'Recommended action',
        columns: {
          severity: 'Severity',
          scope: 'Scope',
          rule: 'Rule',
          affected: 'Affected',
        },
        scopes: {
          themeContrast: 'Theme contrast',
          tokenResolution: 'Token resolution',
          tokenSet: 'Token set',
          theme: 'Theme',
        },
        actions: {
          openTokens: 'Open tokens editor',
          openThemes: 'Open themes editor',
        },
      },
      issueDetails: {
        tokenPath: 'Token path',
      },
      pairs: {
        mutedOnSurface: 'Secondary content on surface',
        accentOnSurface: 'Accent on surface',
      },
      score: {
        validationSummary: 'Validation summary',
        automatedChecks: 'Automated issues',
        contrastChecks: 'Contrast passed',
        warningIssues: 'Warnings',
      },
    },
  },
  fr: {
    AccessibilityCenterPage: {
      description:
        'Analysez les signaux d’accessibilité automatisés, inspectez les problèmes détectés et vérifiez les contrastes configurés des thèmes.',
      issues: {
        detailTitle: 'Détail du problème',
        automatic: 'Contrôle automatisé',
        recommendation: 'Action recommandée',
        columns: {
          severity: 'Sévérité',
          scope: 'Périmètre',
          rule: 'Règle',
          affected: 'Élément concerné',
        },
        scopes: {
          themeContrast: 'Contraste du thème',
          tokenResolution: 'Résolution de token',
          tokenSet: 'Jeu de tokens',
          theme: 'Thème',
        },
        actions: {
          openTokens: 'Ouvrir l’éditeur de tokens',
          openThemes: 'Ouvrir l’éditeur de thèmes',
        },
      },
      issueDetails: {
        tokenPath: 'Chemin du token',
      },
      pairs: {
        mutedOnSurface: 'Contenu secondaire sur surface',
        accentOnSurface: 'Accent sur surface',
      },
      score: {
        validationSummary: 'Synthèse de validation',
        automatedChecks: 'Problèmes automatisés',
        contrastChecks: 'Contrastes validés',
        warningIssues: 'Avertissements',
      },
    },
  },
} as const;
