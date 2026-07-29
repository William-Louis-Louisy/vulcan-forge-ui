export const projectSettingsMessages = {
  en: {
    DashboardPage: {
      projectDeleted: {
        description:
          'The project and all of its related design-system data were permanently removed.',
        title: 'Project deleted',
      },
    },
    ProjectEditorNav: {
      settings: 'Settings',
    },
    ProjectSettingsPage: {
      description:
        'Review project identity and manage destructive project-level actions.',
      eyebrow: 'Project settings',
      identity: {
        description:
          'Confirm the project you are managing before making irreversible changes.',
        name: 'Project name',
        slug: 'Project slug',
        title: 'Project identity',
      },
      permissions: {
        ownerOnlyDescription:
          'Only the workspace owner can permanently delete this project.',
        ownerOnlyTitle: 'Owner permission required',
      },
      title: 'Settings',
      danger: {
        confirmation: {
          cancel: 'Cancel',
          delete: 'Permanently delete project',
          deleting: 'Deleting project...',
          description:
            'This removes {projectName}, including its brand profile, tokens, themes, component contracts, accessibility reports, documentation preferences, AI instruction preferences and export history.',
          nameDescription:
            'Type {projectName} exactly to unlock permanent deletion.',
          nameLabel: 'Project name confirmation',
          title: 'Confirm permanent deletion',
        },
        description: 'Deleting a project is permanent and cannot be undone.',
        errors: {
          confirmationNameMismatch:
            'The confirmation name does not match the current project name.',
          forbiddenOrNotFound:
            'You cannot delete this project, or it no longer exists.',
          invalidPayload: 'The project deletion request is invalid.',
          unauthorized: 'You must be signed in to delete a project.',
          unexpected: 'The project could not be deleted. Please try again.',
        },
        request: 'Delete project',
        summary:
          'Permanently remove this project and every resource stored beneath it.',
        title: 'Danger zone',
        validation: {
          confirmationNameMismatch:
            'Enter the project name exactly as displayed.',
        },
      },
    },
  },
  fr: {
    DashboardPage: {
      projectDeleted: {
        description:
          'Le projet et toutes les données de design system associées ont été supprimés définitivement.',
        title: 'Projet supprimé',
      },
    },
    ProjectEditorNav: {
      settings: 'Paramètres',
    },
    ProjectSettingsPage: {
      description:
        'Vérifiez l’identité du projet et gérez les actions destructives qui le concernent.',
      eyebrow: 'Paramètres du projet',
      identity: {
        description:
          'Vérifiez le projet que vous gérez avant toute modification irréversible.',
        name: 'Nom du projet',
        slug: 'Slug du projet',
        title: 'Identité du projet',
      },
      permissions: {
        ownerOnlyDescription:
          'Seul le propriétaire de l’espace de travail peut supprimer définitivement ce projet.',
        ownerOnlyTitle: 'Autorisation du propriétaire requise',
      },
      title: 'Paramètres',
      danger: {
        confirmation: {
          cancel: 'Annuler',
          delete: 'Supprimer définitivement le projet',
          deleting: 'Suppression du projet...',
          description:
            'Cette action supprime {projectName}, notamment son profil de marque, ses tokens, ses thèmes, ses contrats de composants, ses rapports d’accessibilité, ses préférences de documentation, ses préférences d’instructions IA et son historique d’exports.',
          nameDescription:
            'Saisissez exactement {projectName} pour autoriser la suppression définitive.',
          nameLabel: 'Confirmation du nom du projet',
          title: 'Confirmer la suppression définitive',
        },
        description:
          'La suppression d’un projet est définitive et ne peut pas être annulée.',
        errors: {
          confirmationNameMismatch:
            'Le nom de confirmation ne correspond pas au nom actuel du projet.',
          forbiddenOrNotFound:
            'Vous ne pouvez pas supprimer ce projet, ou celui-ci n’existe plus.',
          invalidPayload: 'La demande de suppression du projet est invalide.',
          unauthorized: 'Vous devez être connecté pour supprimer un projet.',
          unexpected: 'Le projet n’a pas pu être supprimé. Veuillez réessayer.',
        },
        request: 'Supprimer le projet',
        summary:
          'Supprimez définitivement ce projet et toutes les ressources qu’il contient.',
        title: 'Zone dangereuse',
        validation: {
          confirmationNameMismatch:
            'Saisissez le nom du projet exactement comme il est affiché.',
        },
      },
    },
  },
} as const;
