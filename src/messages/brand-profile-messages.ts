export const brandProfileMessages = {
  en: {
    BrandProfilePage: {
      eyebrow: 'Brand foundation',
      title: 'Brand profile',
      description:
        'Define the product identity that feeds Documentation, Exports and AI Instructions.',
      missingTranslations: {
        badge: '{count} missing',
        complete: 'Translations complete',
      },
      locale: {
        editing: 'Editing content',
        ariaLabel: 'Brand content locale',
      },
      actions: {
        save: 'Save profile',
        saving: 'Saving…',
      },
      errors: {
        unauthorized: 'Your session has expired. Sign in again.',
        projectNotFound: 'This project is no longer available.',
        invalidPayload: 'Review the highlighted brand information.',
        unexpected: 'The brand profile could not be saved. Try again.',
      },
      feedback: {
        saved: 'Brand profile saved.',
        invalid: 'Complete the required information before saving.',
        unsaved: 'Unsaved changes',
        savedState: 'All changes saved',
      },
      identity: {
        title: 'Product identity',
        description:
          'The product name is language-neutral. The slug remains stable for routes and exports.',
        productName: 'Product name',
        slug: 'Slug · read only',
      },
      localized: {
        title: 'Localized content',
        description:
          'Edit each supported locale independently. Missing values use the project default locale as a fallback.',
      },
      fields: {
        tagline: {
          label: 'Tagline',
          description: 'A concise expression of the product promise.',
        },
        shortDescription: {
          label: 'Short description',
          description:
            'A compact product summary used by the Dashboard, Overview and generated documentation.',
        },
        personality: {
          label: 'Brand personality',
          description:
            'Describe the character, attitude and traits the product should communicate.',
        },
        audience: {
          label: 'Audience',
          description:
            'Identify the people, roles and contexts the product is designed for.',
        },
        toneOfVoice: {
          label: 'Tone of voice',
          description:
            'State how the product communicates and what its copy should avoid.',
        },
      },
      direction: {
        title: 'Visual direction',
        description:
          'These choices provide a reusable signal for generators and future design-system guidance.',
        visualStyle: 'Visual style',
        uiDensity: 'UI density',
        styles: {
          minimal: {
            label: 'Minimal',
            description: 'Restrained, clear and deliberately quiet.',
          },
          premium: {
            label: 'Premium',
            description: 'Refined details and elevated presentation.',
          },
          editorial: {
            label: 'Editorial',
            description: 'Strong typography and content-led rhythm.',
          },
          technical: {
            label: 'Technical',
            description: 'Precise, systematic and tool-oriented.',
          },
          playful: {
            label: 'Playful',
            description: 'Friendly energy and expressive interactions.',
          },
          bold: {
            label: 'Bold',
            description: 'High-impact hierarchy and confident contrast.',
          },
          neutral: {
            label: 'Neutral',
            description: 'Flexible, balanced and context-independent.',
          },
          custom: {
            label: 'Custom',
            description: 'A direction defined through your own guidance.',
          },
        },
        densities: {
          compact: {
            label: 'Compact',
            description: 'Approx. 40 px rows',
          },
          cozy: {
            label: 'Cozy',
            description: 'Approx. 48 px rows',
          },
          comfortable: {
            label: 'Comfortable',
            description: 'Approx. 56 px rows',
          },
        },
        keywords: {
          label: 'Inspiration keywords',
          description:
            'Comma-separated cues used by AI Instructions and future generators.',
        },
      },
      terminology: {
        title: 'Terminology',
        description:
          'Define preferred terms and the alternatives that generated copy must avoid.',
        add: 'Add term',
        empty: 'No terminology rule has been defined yet.',
        preferred: 'Preferred term',
        avoid: 'Avoid · comma separated',
        remove: 'Remove terminology rule',
      },
      editorialRules: {
        title: 'Editorial rules',
        description:
          'Add deterministic writing rules that can be reused verbatim in AI Instructions.',
        label: 'Rules',
        help: 'Enter one rule per line.',
      },
    },
  },
  fr: {
    BrandProfilePage: {
      eyebrow: 'Fondation de marque',
      title: 'Profil de marque',
      description:
        'Définissez l’identité produit qui alimente la Documentation, les Exports et les Instructions IA.',
      missingTranslations: {
        badge: '{count} manquante(s)',
        complete: 'Traductions complètes',
      },
      locale: {
        editing: 'Contenu édité',
        ariaLabel: 'Locale du contenu de marque',
      },
      actions: {
        save: 'Enregistrer le profil',
        saving: 'Enregistrement…',
      },
      errors: {
        unauthorized: 'Votre session a expiré. Reconnectez-vous.',
        projectNotFound: 'Ce projet n’est plus disponible.',
        invalidPayload: 'Vérifiez les informations de marque renseignées.',
        unexpected:
          'Le profil de marque n’a pas pu être enregistré. Réessayez.',
      },
      feedback: {
        saved: 'Profil de marque enregistré.',
        invalid: 'Complétez les informations requises avant d’enregistrer.',
        unsaved: 'Modifications non enregistrées',
        savedState: 'Toutes les modifications sont enregistrées',
      },
      identity: {
        title: 'Identité produit',
        description:
          'Le nom du produit est indépendant de la langue. Le slug reste stable pour les routes et les exports.',
        productName: 'Nom du produit',
        slug: 'Slug · lecture seule',
      },
      localized: {
        title: 'Contenu localisé',
        description:
          'Éditez chaque locale supportée indépendamment. Les valeurs manquantes utilisent la locale par défaut du projet.',
      },
      fields: {
        tagline: {
          label: 'Tagline',
          description: 'Une formulation concise de la promesse produit.',
        },
        shortDescription: {
          label: 'Description courte',
          description:
            'Un résumé compact utilisé par le Dashboard, l’Overview et la documentation générée.',
        },
        personality: {
          label: 'Personnalité de marque',
          description:
            'Décrivez le caractère, l’attitude et les traits communiqués par le produit.',
        },
        audience: {
          label: 'Audience',
          description:
            'Identifiez les personnes, les rôles et les contextes auxquels le produit s’adresse.',
        },
        toneOfVoice: {
          label: 'Ton de voix',
          description:
            'Précisez comment le produit communique et ce que ses textes doivent éviter.',
        },
      },
      direction: {
        title: 'Direction visuelle',
        description:
          'Ces choix fournissent un signal réutilisable aux générateurs et aux futures recommandations.',
        visualStyle: 'Style visuel',
        uiDensity: 'Densité de l’interface',
        styles: {
          minimal: {
            label: 'Minimal',
            description: 'Sobre, clair et volontairement discret.',
          },
          premium: {
            label: 'Premium',
            description: 'Détails raffinés et présentation élevée.',
          },
          editorial: {
            label: 'Éditorial',
            description: 'Typographie forte et rythme guidé par le contenu.',
          },
          technical: {
            label: 'Technique',
            description: 'Précis, systématique et orienté outil.',
          },
          playful: {
            label: 'Ludique',
            description: 'Énergie accessible et interactions expressives.',
          },
          bold: {
            label: 'Audacieux',
            description: 'Hiérarchie marquée et contrastes assumés.',
          },
          neutral: {
            label: 'Neutre',
            description: 'Flexible, équilibré et indépendant du contexte.',
          },
          custom: {
            label: 'Personnalisé',
            description: 'Une direction définie par vos propres indications.',
          },
        },
        densities: {
          compact: {
            label: 'Compacte',
            description: 'Lignes d’environ 40 px',
          },
          cozy: {
            label: 'Intermédiaire',
            description: 'Lignes d’environ 48 px',
          },
          comfortable: {
            label: 'Confortable',
            description: 'Lignes d’environ 56 px',
          },
        },
        keywords: {
          label: 'Mots-clés d’inspiration',
          description:
            'Des indications séparées par des virgules pour les Instructions IA et les futurs générateurs.',
        },
      },
      terminology: {
        title: 'Terminologie',
        description:
          'Définissez les termes privilégiés et les alternatives que les textes générés doivent éviter.',
        add: 'Ajouter un terme',
        empty: 'Aucune règle terminologique n’est encore définie.',
        preferred: 'Terme privilégié',
        avoid: 'À éviter · séparés par des virgules',
        remove: 'Supprimer la règle terminologique',
      },
      editorialRules: {
        title: 'Règles éditoriales',
        description:
          'Ajoutez des règles de rédaction déterministes, réutilisables telles quelles dans les Instructions IA.',
        label: 'Règles',
        help: 'Saisissez une règle par ligne.',
      },
    },
  },
} as const;
