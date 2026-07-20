export const accessibilityCenterMessages = {
  en: {
    AccessibilityCenterPage: {
      description:
        'Review automated accessibility signals across tokens, components and themes, inspect detected issues and verify the configured contrast pairs.',
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
          tokenDocumentation: 'Token documentation',
          componentContract: 'Component contract',
          componentBinding: 'Component binding',
        },
        actions: {
          openTokens: 'Open tokens editor',
          openThemes: 'Open themes editor',
          openComponents: 'Open components registry',
        },
        codes: {
          missingTokenDescription: 'Missing token description',
          invalidTokenSet: 'Invalid token set',
          invalidComponentContract: 'Invalid component contract',
          missingComponentLocalization: 'Missing component localization',
          missingComponentAccessibilityRules: 'Missing accessibility rules',
          missingComponentFocusVisibleState: 'Missing focus-visible state',
          unresolvedComponentTokenBinding: 'Unresolved component token binding',
          componentTokenTypeMismatch: 'Component token type mismatch',
        },
        fixes: {
          missingTokenDescription:
            'Add a description for every supported project language before treating this ready token as fully documented.',
          invalidTokenSet:
            'Repair this token set so its type, name and tokens conform to the design-token schema.',
          invalidComponentContract:
            'Repair the persisted component contract so required metadata and structured fields conform to the component schema.',
          missingComponentLocalization:
            'Complete the affected component field for every supported project language.',
          missingComponentAccessibilityRules:
            'Document explicit accessibility requirements for this interactive component.',
          missingComponentFocusVisibleState:
            'Add an explicit focus-visible state to the component contract instead of inferring keyboard focus behavior.',
          unresolvedComponentTokenBinding:
            'Update the component binding so it points to an existing design token.',
          componentTokenTypeMismatch:
            'Align the binding token type with the type of the referenced design token.',
        },
      },
      issueDetails: {
        tokenPath: 'Token path',
        tokenSet: 'Token set',
        component: 'Component',
        componentType: 'Component type',
        affectedField: 'Affected field',
        affectedCount: 'Affected items',
        missingLocales: 'Missing languages',
        bindingKey: 'Binding key',
        expectedTokenType: 'Expected token type',
        actualTokenType: 'Actual token type',
        fields: {
          description: 'Description',
          tokenSet: 'Token set data',
          contract: 'Contract data',
          purpose: 'Purpose',
          anatomy: 'Anatomy labels',
          variants: 'Variant labels',
          sizes: 'Size labels',
          states: 'State labels',
          accessibility: 'Accessibility rules',
          focusVisible: 'Focus-visible state',
          tokenBindings: 'Token bindings',
        },
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
        'Analysez les signaux d’accessibilité automatisés des tokens, composants et thèmes, inspectez les problèmes détectés et vérifiez les contrastes configurés.',
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
          tokenDocumentation: 'Documentation des tokens',
          componentContract: 'Contrat de composant',
          componentBinding: 'Liaison de composant',
        },
        actions: {
          openTokens: 'Ouvrir l’éditeur de tokens',
          openThemes: 'Ouvrir l’éditeur de thèmes',
          openComponents: 'Ouvrir le registre des composants',
        },
        codes: {
          missingTokenDescription: 'Description de token manquante',
          invalidTokenSet: 'Jeu de tokens invalide',
          invalidComponentContract: 'Contrat de composant invalide',
          missingComponentLocalization: 'Traduction de composant manquante',
          missingComponentAccessibilityRules: 'Règles d’accessibilité manquantes',
          missingComponentFocusVisibleState: 'État focus-visible manquant',
          unresolvedComponentTokenBinding: 'Liaison de token non résolue',
          componentTokenTypeMismatch: 'Type de token incompatible',
        },
        fixes: {
          missingTokenDescription:
            'Ajoutez une description dans chaque langue du projet avant de considérer ce token prêt comme entièrement documenté.',
          invalidTokenSet:
            'Réparez ce jeu de tokens afin que son type, son nom et ses tokens respectent le schéma des design tokens.',
          invalidComponentContract:
            'Réparez le contrat enregistré afin que ses métadonnées obligatoires et ses champs structurés respectent le schéma des composants.',
          missingComponentLocalization:
            'Complétez le champ concerné du composant dans chaque langue prise en charge par le projet.',
          missingComponentAccessibilityRules:
            'Documentez des exigences d’accessibilité explicites pour ce composant interactif.',
          missingComponentFocusVisibleState:
            'Ajoutez un état focus-visible explicite au contrat plutôt que de déduire le comportement du focus clavier.',
          unresolvedComponentTokenBinding:
            'Mettez à jour la liaison afin qu’elle pointe vers un design token existant.',
          componentTokenTypeMismatch:
            'Alignez le type déclaré par la liaison avec celui du design token référencé.',
        },
      },
      issueDetails: {
        tokenPath: 'Chemin du token',
        tokenSet: 'Jeu de tokens',
        component: 'Composant',
        componentType: 'Type de composant',
        affectedField: 'Champ concerné',
        affectedCount: 'Éléments concernés',
        missingLocales: 'Langues manquantes',
        bindingKey: 'Clé de liaison',
        expectedTokenType: 'Type de token attendu',
        actualTokenType: 'Type de token réel',
        fields: {
          description: 'Description',
          tokenSet: 'Données du jeu de tokens',
          contract: 'Données du contrat',
          purpose: 'Finalité',
          anatomy: 'Libellés de l’anatomie',
          variants: 'Libellés des variantes',
          sizes: 'Libellés des tailles',
          states: 'Libellés des états',
          accessibility: 'Règles d’accessibilité',
          focusVisible: 'État focus-visible',
          tokenBindings: 'Liaisons de tokens',
        },
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
