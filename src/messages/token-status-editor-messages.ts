export const tokenStatusEditorMessages = {
  en: {
    TokenStatusEditor: {
      title: 'Status',
      placeholder: 'Select a status',
      options: {
        draft: {
          label: 'Draft',
          description: 'Still being authored.',
        },
        ready: {
          label: 'Ready',
          description: 'Ready for project use and generated outputs.',
        },
        deprecated: {
          label: 'Deprecated',
          description: 'Retained for compatibility; avoid new usage.',
        },
      },
      save: 'Save status',
      saving: 'Saving...',
      saved: 'Status saved.',
      unsaved: 'Unsaved status.',
      fieldErrors: {
        invalidStatus: 'Select a valid status.',
      },
      formErrors: {
        unauthorized: 'You must be signed in to update this status.',
        projectNotFound: 'Project not found.',
        tokenSetNotFound: 'Token set not found.',
        tokenSetMalformed: 'Token data is malformed.',
        tokenValidationFailed: 'The updated token set is invalid.',
        tokenNotFound: 'Token not found.',
        unexpected: 'Unable to save this status. Please try again.',
      },
    },
  },
  fr: {
    TokenStatusEditor: {
      title: 'Statut',
      placeholder: 'Sélectionner un statut',
      options: {
        draft: {
          label: 'Brouillon',
          description: 'Encore en cours d’édition.',
        },
        ready: {
          label: 'Prêt',
          description: 'Prêt pour le projet et les contenus générés.',
        },
        deprecated: {
          label: 'Déprécié',
          description:
            'Conservé pour compatibilité ; éviter tout nouvel usage.',
        },
      },
      save: 'Enregistrer le statut',
      saving: 'Enregistrement...',
      saved: 'Statut enregistré.',
      unsaved: 'Statut non enregistré.',
      fieldErrors: {
        invalidStatus: 'Sélectionnez un statut valide.',
      },
      formErrors: {
        unauthorized: 'Vous devez être connecté pour modifier ce statut.',
        projectNotFound: 'Projet introuvable.',
        tokenSetNotFound: 'Jeu de tokens introuvable.',
        tokenSetMalformed: 'Les données des tokens sont invalides.',
        tokenValidationFailed: 'Le jeu de tokens modifié est invalide.',
        tokenNotFound: 'Token introuvable.',
        unexpected: 'Impossible d’enregistrer ce statut. Réessayez.',
      },
    },
  },
} as const;
