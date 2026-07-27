export const errorSurfaceMessages = {
  en: {
    ErrorSurfaces: {
      actions: {
        backToDashboard: 'Back to dashboard',
        backToHome: 'Back to home',
        backToProject: 'Back to project',
        retry: 'Try again',
        signIn: 'Sign in',
      },
      appNotFound: {
        code: '404',
        description:
          'This project page or resource is unavailable. It may have been moved, deleted or hidden because you do not have access.',
        eyebrow: 'Resource unavailable',
        title: 'This workspace destination cannot be found.',
      },
      authenticationRequired: {
        description:
          'Your session is missing or has expired. Sign in to continue to the authenticated workspace.',
        title: 'Authentication required',
      },
      forbidden: {
        code: '403',
        description:
          'Your account is signed in, but it does not have permission to open this resource.',
        eyebrow: 'Access denied',
        title: 'This resource is outside your permissions.',
      },
      global: {
        code: '500',
        description:
          'The application could not recover its main interface. Retry the request or return to the public home page.',
        eyebrow: 'Application error',
        title: 'VulcanForge UI could not start correctly.',
      },
      publicNotFound: {
        code: '404',
        description:
          'The address may be incorrect, or the page may have been moved. Use a real destination below to continue.',
        eyebrow: 'Page not found',
        title: 'There is nothing to forge at this address.',
      },
      unexpected: {
        code: '500',
        description:
          'An unexpected error interrupted this part of the application. Your saved data has not been intentionally changed.',
        eyebrow: 'Unexpected error',
        reference: 'Diagnostic reference: {digest}',
        title: 'This surface could not be rendered.',
      },
    },
  },
  fr: {
    ErrorSurfaces: {
      actions: {
        backToDashboard: 'Retour au tableau de bord',
        backToHome: 'Retour à l’accueil',
        backToProject: 'Retour au projet',
        retry: 'Réessayer',
        signIn: 'Se connecter',
      },
      appNotFound: {
        code: '404',
        description:
          'Cette page ou ressource du projet est indisponible. Elle a peut-être été déplacée, supprimée ou masquée parce que vous n’y avez pas accès.',
        eyebrow: 'Ressource indisponible',
        title: 'Cette destination du workspace est introuvable.',
      },
      authenticationRequired: {
        description:
          'Votre session est absente ou a expiré. Connectez-vous pour continuer dans le workspace authentifié.',
        title: 'Authentification requise',
      },
      forbidden: {
        code: '403',
        description:
          'Votre compte est connecté, mais il ne possède pas l’autorisation nécessaire pour ouvrir cette ressource.',
        eyebrow: 'Accès refusé',
        title: 'Cette ressource ne fait pas partie de vos autorisations.',
      },
      global: {
        code: '500',
        description:
          'L’application n’a pas pu restaurer son interface principale. Réessayez la requête ou revenez à l’accueil public.',
        eyebrow: 'Erreur de l’application',
        title: 'VulcanForge UI n’a pas pu démarrer correctement.',
      },
      publicNotFound: {
        code: '404',
        description:
          'L’adresse est peut-être incorrecte ou la page a été déplacée. Utilisez une destination réelle ci-dessous pour continuer.',
        eyebrow: 'Page introuvable',
        title: 'Il n’y a rien à forger à cette adresse.',
      },
      unexpected: {
        code: '500',
        description:
          'Une erreur inattendue a interrompu cette partie de l’application. Vos données enregistrées n’ont pas été volontairement modifiées.',
        eyebrow: 'Erreur inattendue',
        reference: 'Référence de diagnostic : {digest}',
        title: 'Cette surface n’a pas pu être affichée.',
      },
    },
  },
} as const;
