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
        keys: {
          info: 'Info',
          success: 'Success',
          warning: 'Warning',
          danger: 'Danger',
        },
        createRole: {
          title: 'Custom color roles',
          description:
            'Add a semantic role to this theme only. Other theme modes are not changed automatically.',
          open: 'Add role',
          cancel: 'Cancel',
          roleKeyLabel: 'Role key',
          roleKeyPlaceholder: 'e.g. border-subtle',
          roleKeyHint:
            'Use lowercase letters, numbers and hyphens. This stable key is also used in exports.',
          tokenLabel: 'Color token',
          tokenPlaceholder: 'Select a token',
          submit: 'Add role',
          submitting: 'Adding role…',
          added: 'Role added.',
          errors: {
            unauthorized: 'You are not authorized to edit this theme.',
            invalidPayload: 'The role form contains invalid data.',
            themeNotFound: 'This theme could not be found.',
            invalidTokenReference:
              'Select a color token that resolves to a valid HEX value.',
            invalidRoleKey:
              'Use a lowercase role key with letters, numbers and hyphens only.',
            invalidTokenPath: 'The selected token path is invalid.',
            themeTokensMalformed:
              'The stored theme color mappings are malformed and cannot be edited safely.',
            roleAlreadyExists:
              'This role already exists in the selected theme.',
            unexpected: 'The role could not be added. Please try again.',
          },
        },
        deleteRole: {
          request: 'Delete role',
          confirmationTitle: 'Delete {roleKey}?',
          confirmationDescription:
            'This removes the custom role from this theme only. The referenced token is kept. This action cannot be undone.',
          cancel: 'Cancel',
          delete: 'Delete role',
          deleting: 'Deleting…',
          errors: {
            unauthorized: 'You are not authorized to edit this theme.',
            invalidPayload: 'The delete request contains invalid data.',
            themeNotFound: 'This theme could not be found.',
            invalidRoleKey: 'This custom role key is invalid.',
            protectedRole: 'Built-in theme roles cannot be deleted.',
            themeTokensMalformed:
              'The stored theme color mappings are malformed and cannot be edited safely.',
            roleNotFound: 'This custom role no longer exists.',
            unexpected: 'The role could not be deleted. Please try again.',
          },
        },
        form: {
          errors: {
            invalidRoleKey: 'This theme role key is invalid.',
            invalidTokenPath: 'The selected token path is invalid.',
            themeTokensMalformed:
              'The stored theme color mappings are malformed and cannot be edited safely.',
          },
        },
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
          infoOnBackground: 'Info on background',
          infoOnSurface: 'Info on surface',
          successOnBackground: 'Success on background',
          successOnSurface: 'Success on surface',
          warningOnBackground: 'Warning on background',
          warningOnSurface: 'Warning on surface',
          dangerOnBackground: 'Danger on background',
          dangerOnSurface: 'Danger on surface',
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
        keys: {
          info: 'Information',
          success: 'Succès',
          warning: 'Avertissement',
          danger: 'Danger',
        },
        createRole: {
          title: 'Rôles couleur personnalisés',
          description:
            'Ajoutez un rôle sémantique à ce thème uniquement. Les autres modes ne sont pas modifiés automatiquement.',
          open: 'Ajouter un rôle',
          cancel: 'Annuler',
          roleKeyLabel: 'Clé du rôle',
          roleKeyPlaceholder: 'ex. border-subtle',
          roleKeyHint:
            'Utilisez des lettres minuscules, des chiffres et des tirets. Cette clé stable est aussi utilisée dans les exports.',
          tokenLabel: 'Token couleur',
          tokenPlaceholder: 'Sélectionner un token',
          submit: 'Ajouter le rôle',
          submitting: 'Ajout du rôle…',
          added: 'Rôle ajouté.',
          errors: {
            unauthorized: 'Vous n’êtes pas autorisé à modifier ce thème.',
            invalidPayload:
              'Le formulaire du rôle contient des données invalides.',
            themeNotFound: 'Ce thème est introuvable.',
            invalidTokenReference:
              'Sélectionnez un token couleur résolu en valeur HEX valide.',
            invalidRoleKey:
              'Utilisez une clé en minuscules avec uniquement des lettres, des chiffres et des tirets.',
            invalidTokenPath: 'Le chemin du token sélectionné est invalide.',
            themeTokensMalformed:
              'Les mappings couleur enregistrés pour ce thème sont invalides et ne peuvent pas être modifiés en toute sécurité.',
            roleAlreadyExists: 'Ce rôle existe déjà dans le thème sélectionné.',
            unexpected: 'Le rôle n’a pas pu être ajouté. Réessayez.',
          },
        },
        deleteRole: {
          request: 'Supprimer le rôle',
          confirmationTitle: 'Supprimer {roleKey} ?',
          confirmationDescription:
            'Ce rôle personnalisé sera supprimé de ce thème uniquement. Le token référencé est conservé. Cette action est irréversible.',
          cancel: 'Annuler',
          delete: 'Supprimer le rôle',
          deleting: 'Suppression…',
          errors: {
            unauthorized: 'Vous n’êtes pas autorisé à modifier ce thème.',
            invalidPayload:
              'La demande de suppression contient des données invalides.',
            themeNotFound: 'Ce thème est introuvable.',
            invalidRoleKey: 'La clé de ce rôle personnalisé est invalide.',
            protectedRole:
              'Les rôles intégrés du thème ne peuvent pas être supprimés.',
            themeTokensMalformed:
              'Les mappings couleur enregistrés pour ce thème sont invalides et ne peuvent pas être modifiés en toute sécurité.',
            roleNotFound: 'Ce rôle personnalisé n’existe plus.',
            unexpected: 'Le rôle n’a pas pu être supprimé. Réessayez.',
          },
        },
        form: {
          errors: {
            invalidRoleKey: 'La clé de ce rôle de thème est invalide.',
            invalidTokenPath: 'Le chemin du token sélectionné est invalide.',
            themeTokensMalformed:
              'Les mappings couleur enregistrés pour ce thème sont invalides et ne peuvent pas être modifiés en toute sécurité.',
          },
        },
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
          infoOnBackground: 'Information sur arrière-plan',
          infoOnSurface: 'Information sur surface',
          successOnBackground: 'Succès sur arrière-plan',
          successOnSurface: 'Succès sur surface',
          warningOnBackground: 'Avertissement sur arrière-plan',
          warningOnSurface: 'Avertissement sur surface',
          dangerOnBackground: 'Danger sur arrière-plan',
          dangerOnSurface: 'Danger sur surface',
        },
      },
      states: {
        errorEyebrow: 'Thèmes indisponibles',
      },
    },
  },
} as const;
