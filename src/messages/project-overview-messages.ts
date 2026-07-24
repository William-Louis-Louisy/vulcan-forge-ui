export const projectOverviewMessages = {
  en: {
    ProjectOverviewPage: {
      eyebrow: 'Project overview',
      project: {
        noDescription:
          'No project description has been added yet. Add one during the Brand step to improve generated documentation.',
        openDocumentation: 'Open documentation',
        platforms: {
          web: 'Web',
          mobile: 'Mobile',
        },
        accessibility: {
          wcag_aa: 'WCAG 2.2 AA target',
          wcag_aaa: 'WCAG 2.2 AAA target',
        },
      },
      health: {
        eyebrow: 'Validation score',
        scoreLabel: 'Indicative project score: {score} out of 100',
        issueCount:
          '{count, plural, =0 {No detected issue} one {# detected issue} other {# detected issues}}',
        status: {
          healthy: 'Strong',
          needsAttention: 'Needs attention',
          critical: 'Critical gaps',
        },
        description: {
          healthy:
            'No critical issue is currently detected. {warnings, plural, =0 {The automated signals are clear.} one {# warning still deserves review.} other {# warnings still deserve review.}}',
          needsAttention:
            '{warnings, plural, one {# warning should be reviewed before the next handoff.} other {# warnings should be reviewed before the next handoff.}}',
          critical:
            '{critical, plural, one {# critical issue blocks a reliable handoff.} other {# critical issues block a reliable handoff.}}',
        },
        disclaimer:
          'This score is an automated prioritization signal based on the current project model. It is not a WCAG certification and does not replace a complete manual review.',
        metrics: {
          tokens: {
            label: 'Tokens',
            invalid: '{count, plural, one {# invalid} other {# invalid}}',
            missingDescriptions:
              '{count, plural, one {# description gap} other {# description gaps}}',
            ready: 'Structured',
          },
          contrasts: {
            label: 'Contrasts',
            issues: '{count, plural, one {# issue} other {# issues}}',
            ready: 'All pass',
          },
          components: {
            label: 'Components',
            draft: '{count, plural, one {# draft} other {# drafts}}',
            invalid: '{count, plural, one {# invalid} other {# invalid}}',
            ready: 'Registry ready',
          },
          exports: {
            label: 'Exports',
            stale: '{count, plural, one {# stale} other {# stale}}',
            generated: '{count}/{total} generated',
          },
        },
      },
      nextActions: {
        title: 'Recommended next actions',
        description:
          'Actions are derived from the current project data and ordered by impact.',
        emptyTitle: 'No immediate action required.',
        emptyDescription:
          'The automated signals do not currently expose a blocking or incomplete product area.',
        destinations: {
          accessibility: 'Accessibility',
          tokens: 'Tokens',
          themes: 'Themes',
          components: 'Components',
          exports: 'Exports',
        },
        items: {
          criticalIssues:
            '{count, plural, one {Resolve # critical validation issue.} other {Resolve # critical validation issues.}}',
          invalidTokens:
            '{count, plural, one {Repair # invalid token entry.} other {Repair # invalid token entries.}}',
          contrastIssues:
            '{count, plural, one {Review # incomplete or failing contrast pair.} other {Review # incomplete or failing contrast pairs.}}',
          missingTokenDescriptions:
            '{count, plural, one {Complete localized descriptions for # token.} other {Complete localized descriptions for # tokens.}}',
          missingThemes: 'Configure at least one project theme.',
          draftComponents:
            '{count, plural, one {Move # component contract out of draft.} other {Move # component contracts out of draft.}}',
          missingComponents: 'Add the first component contract.',
          staleExports:
            '{count, plural, one {Regenerate # export after recent model changes.} other {Regenerate # exports after recent model changes.}}',
          missingExports:
            '{count, plural, one {Generate the remaining # export format.} other {Generate the remaining # export formats.}}',
        },
      },
      tokens: {
        title: 'Tokens',
        description: 'Coverage by token family and readiness state.',
        open: 'Open tokens',
        empty: 'No token set is available for this project.',
        coverage: '{ready}/{total} ready',
        issues: '{invalid} invalid · {missing} description gaps',
        types: {
          color: 'Colors',
          spacing: 'Spacing',
          radius: 'Radius',
          typography: 'Typography',
          motion: 'Motion',
        },
      },
      themes: {
        title: 'Themes',
        description: 'Configured modes and automated contrast coverage.',
        open: 'Open themes',
        empty: 'No light or dark theme is configured yet.',
        modes: {
          light: 'Light',
          dark: 'Dark',
        },
        configured: 'Configured',
        notConfigured: 'Not configured',
        contrasts: 'Contrast pairs',
        contrastSummary: '{passed}/{total} pass',
        issues: '{count, plural, one {# issue} other {# issues}}',
        allPass: 'All pass',
      },
      components: {
        title: 'Components',
        description: 'Contract status across the current component registry.',
        open: 'Open components',
        empty: 'No valid component contract is available yet.',
        summary: '{ready} ready · {draft} draft · {invalid} invalid',
        status: {
          ready: 'Ready',
          draft: 'Draft',
          deprecated: 'Deprecated',
        },
        types: {
          button: 'Button',
          textField: 'Text field',
          card: 'Card',
          alert: 'Alert',
          dialog: 'Dialog',
        },
      },
      exports: {
        title: 'Exports',
        description: 'Available formats and the latest successful generations.',
        open: 'Open exports',
        available: 'Available',
        generated: 'Generated',
        stale: 'Stale',
        empty: 'No successful export has been generated yet.',
        formats: {
          cssVariables: 'CSS variables',
          tailwindV4: 'Tailwind v4',
          typescriptTheme: 'TypeScript theme',
          reactNativeTheme: 'React Native theme',
          markdownDocumentation: 'Markdown documentation',
          aiInstructions: 'AI instructions',
        },
      },
      activity: {
        title: 'Recent activity',
        description:
          'Derived from real project update timestamps, saved reports and export logs.',
        empty: 'No project activity is available yet.',
        localeNeutral: 'neutral',
        status: {
          success: 'successful',
          failed: 'failed',
          pass: 'passed',
          warning: 'warning',
          fail: 'failed',
        },
        items: {
          tokenSet: '{name} token set updated',
          theme: '{name} theme updated',
          component: '{name} component contract updated',
          accessibilityReport:
            'Accessibility report saved at {score}/100 — {status}',
          export: '{format} export · {locale} · {status}',
        },
      },
      states: {
        loading: 'Loading project overview...',
        errorEyebrow: 'Project overview',
        errorTitle: 'Unable to load the project overview',
        errorDescription:
          'Something went wrong while loading the current project signals. Please try again.',
        retry: 'Retry',
      },
    },
  },
  fr: {
    ProjectOverviewPage: {
      eyebrow: 'Vue d’ensemble du projet',
      project: {
        noDescription:
          'Aucune description de projet n’a encore été ajoutée. Complétez-la lors de l’étape Marque afin d’améliorer la documentation générée.',
        openDocumentation: 'Ouvrir la documentation',
        platforms: {
          web: 'Web',
          mobile: 'Mobile',
        },
        accessibility: {
          wcag_aa: 'Cible WCAG 2.2 AA',
          wcag_aaa: 'Cible WCAG 2.2 AAA',
        },
      },
      health: {
        eyebrow: 'Score de validation',
        scoreLabel: 'Score indicatif du projet : {score} sur 100',
        issueCount:
          '{count, plural, =0 {Aucun problème détecté} one {# problème détecté} other {# problèmes détectés}}',
        status: {
          healthy: 'Solide',
          needsAttention: 'À surveiller',
          critical: 'Lacunes critiques',
        },
        description: {
          healthy:
            'Aucun problème critique n’est actuellement détecté. {warnings, plural, =0 {Les signaux automatisés sont au vert.} one {# avertissement mérite encore une vérification.} other {# avertissements méritent encore une vérification.}}',
          needsAttention:
            '{warnings, plural, one {# avertissement doit être vérifié avant la prochaine transmission.} other {# avertissements doivent être vérifiés avant la prochaine transmission.}}',
          critical:
            '{critical, plural, one {# problème critique empêche une transmission fiable.} other {# problèmes critiques empêchent une transmission fiable.}}',
        },
        disclaimer:
          'Ce score est un signal automatisé de priorisation fondé sur le modèle actuel du projet. Il ne constitue pas une certification WCAG et ne remplace pas une vérification manuelle complète.',
        metrics: {
          tokens: {
            label: 'Tokens',
            invalid: '{count, plural, one {# invalide} other {# invalides}}',
            missingDescriptions:
              '{count, plural, one {# description manquante} other {# descriptions manquantes}}',
            ready: 'Structurés',
          },
          contrasts: {
            label: 'Contrastes',
            issues: '{count, plural, one {# problème} other {# problèmes}}',
            ready: 'Tous validés',
          },
          components: {
            label: 'Composants',
            draft: '{count, plural, one {# brouillon} other {# brouillons}}',
            invalid: '{count, plural, one {# invalide} other {# invalides}}',
            ready: 'Registre prêt',
          },
          exports: {
            label: 'Exports',
            stale: '{count, plural, one {# obsolète} other {# obsolètes}}',
            generated: '{count}/{total} générés',
          },
        },
      },
      nextActions: {
        title: 'Prochaines actions recommandées',
        description:
          'Les actions sont calculées à partir des données actuelles du projet et classées par impact.',
        emptyTitle: 'Aucune action immédiate requise.',
        emptyDescription:
          'Les signaux automatisés ne font actuellement apparaître aucune zone bloquante ou incomplète.',
        destinations: {
          accessibility: 'Accessibilité',
          tokens: 'Tokens',
          themes: 'Thèmes',
          components: 'Composants',
          exports: 'Exports',
        },
        items: {
          criticalIssues:
            '{count, plural, one {Résolvez # problème critique de validation.} other {Résolvez # problèmes critiques de validation.}}',
          invalidTokens:
            '{count, plural, one {Réparez # token invalide.} other {Réparez # tokens invalides.}}',
          contrastIssues:
            '{count, plural, one {Vérifiez # paire de contraste incomplète ou invalide.} other {Vérifiez # paires de contraste incomplètes ou invalides.}}',
          missingTokenDescriptions:
            '{count, plural, one {Complétez les descriptions localisées de # token.} other {Complétez les descriptions localisées de # tokens.}}',
          missingThemes: 'Configurez au moins un thème pour ce projet.',
          draftComponents:
            '{count, plural, one {Faites sortir # contrat de composant du statut brouillon.} other {Faites sortir # contrats de composants du statut brouillon.}}',
          missingComponents: 'Ajoutez le premier contrat de composant.',
          staleExports:
            '{count, plural, one {Regénérez # export après les dernières modifications du modèle.} other {Regénérez # exports après les dernières modifications du modèle.}}',
          missingExports:
            '{count, plural, one {Générez le format d’export restant.} other {Générez les # formats d’export restants.}}',
        },
      },
      tokens: {
        title: 'Tokens',
        description: 'Couverture par famille de tokens et état de préparation.',
        open: 'Ouvrir les tokens',
        empty: 'Aucun jeu de tokens n’est disponible pour ce projet.',
        coverage: '{ready}/{total} prêts',
        issues: '{invalid} invalides · {missing} descriptions manquantes',
        types: {
          color: 'Couleurs',
          spacing: 'Espacements',
          radius: 'Rayons',
          typography: 'Typographie',
          motion: 'Mouvement',
        },
      },
      themes: {
        title: 'Thèmes',
        description:
          'Modes configurés et couverture automatisée des contrastes.',
        open: 'Ouvrir les thèmes',
        empty: 'Aucun thème clair ou sombre n’est encore configuré.',
        modes: {
          light: 'Clair',
          dark: 'Sombre',
        },
        configured: 'Configuré',
        notConfigured: 'Non configuré',
        contrasts: 'Paires de contraste',
        contrastSummary: '{passed}/{total} validées',
        issues: '{count, plural, one {# problème} other {# problèmes}}',
        allPass: 'Toutes validées',
      },
      components: {
        title: 'Composants',
        description: 'État des contrats dans le registre actuel.',
        open: 'Ouvrir les composants',
        empty: 'Aucun contrat de composant valide n’est encore disponible.',
        summary: '{ready} prêts · {draft} brouillons · {invalid} invalides',
        status: {
          ready: 'Prêt',
          draft: 'Brouillon',
          deprecated: 'Déprécié',
        },
        types: {
          button: 'Bouton',
          textField: 'Champ texte',
          card: 'Carte',
          alert: 'Alerte',
          dialog: 'Dialogue',
        },
      },
      exports: {
        title: 'Exports',
        description: 'Formats disponibles et dernières générations réussies.',
        open: 'Ouvrir les exports',
        available: 'Disponibles',
        generated: 'Générés',
        stale: 'Obsolètes',
        empty: 'Aucun export n’a encore été généré avec succès.',
        formats: {
          cssVariables: 'Variables CSS',
          tailwindV4: 'Tailwind v4',
          typescriptTheme: 'Thème TypeScript',
          reactNativeTheme: 'Thème React Native',
          markdownDocumentation: 'Documentation Markdown',
          aiInstructions: 'Instructions IA',
        },
      },
      activity: {
        title: 'Activité récente',
        description:
          'Dérivée des véritables dates de modification, rapports enregistrés et journaux d’export du projet.',
        empty: 'Aucune activité de projet n’est encore disponible.',
        localeNeutral: 'neutre',
        status: {
          success: 'réussi',
          failed: 'échoué',
          pass: 'validé',
          warning: 'avertissement',
          fail: 'échoué',
        },
        items: {
          tokenSet: 'Jeu de tokens {name} mis à jour',
          theme: 'Thème {name} mis à jour',
          component: 'Contrat du composant {name} mis à jour',
          accessibilityReport:
            'Rapport d’accessibilité enregistré à {score}/100 — {status}',
          export: 'Export {format} · {locale} · {status}',
        },
      },
      states: {
        loading: 'Chargement de la vue d’ensemble du projet...',
        errorEyebrow: 'Vue d’ensemble du projet',
        errorTitle: 'Impossible de charger la vue d’ensemble',
        errorDescription:
          'Une erreur est survenue lors du chargement des signaux actuels du projet. Veuillez réessayer.',
        retry: 'Réessayer',
      },
    },
  },
} as const;
