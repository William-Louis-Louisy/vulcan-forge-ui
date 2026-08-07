import type { Locale } from '@/i18n/routing';
import type { LegalPublisher } from './legal-publisher';

export const LEGAL_LAST_UPDATED = '2026-08-07';

export type LegalDocumentKind = 'terms' | 'privacy';

type LegalExternalLink = {
  href: string;
  label: string;
};

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  externalLink?: LegalExternalLink;
};

export type LegalDocument = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdatedLabel: string;
  lastUpdatedDisplay: string;
  publicationWarningTitle: string;
  publicationWarning: string;
  sections: LegalSection[];
};

function getContactValue(locale: Locale, publisher: LegalPublisher) {
  if (publisher.contactEmail) {
    return publisher.contactEmail;
  }

  return locale === 'fr' ? 'non configuré' : 'not configured';
}

function getTermsDocument(
  locale: Locale,
  publisher: LegalPublisher,
): LegalDocument {
  const contact = getContactValue(locale, publisher);

  if (locale === 'fr') {
    return {
      eyebrow: 'Légal · Bêta publique',
      title: "Conditions d’utilisation",
      description:
        "Ces conditions encadrent l’accès et l’utilisation de la bêta actuelle de VulcanForge UI.",
      lastUpdatedLabel: 'Dernière mise à jour',
      lastUpdatedDisplay: '7 août 2026',
      publicationWarningTitle: 'Informations de publication incomplètes',
      publicationWarning:
        "L’identité complète de l’exploitant et son contact juridique doivent être configurés avant de considérer cette page comme prête pour une ouverture publique.",
      sections: [
        {
          title: '1. Périmètre et statut de la bêta',
          paragraphs: [
            "VulcanForge UI est actuellement proposé en bêta. Les fonctionnalités, limites et modalités d’accès peuvent évoluer pendant cette phase.",
            "La bêta est actuellement gratuite et aucune facturation n’est activée dans le produit.",
          ],
        },
        {
          title: '2. Compte et sécurité',
          paragraphs: [
            "Vous devez utiliser une adresse électronique que vous contrôlez et protéger vos identifiants. Vous êtes responsable des actions réalisées depuis votre compte tant qu’elles résultent de l’utilisation de vos moyens d’authentification.",
            "Les fonctions de vérification d’adresse, récupération de mot de passe et révocation de sessions servent à sécuriser l’accès au compte.",
          ],
        },
        {
          title: '3. Utilisation acceptable',
          items: [
            "utiliser le service conformément aux lois applicables ;",
            "ne pas tenter de contourner les contrôles d’authentification, de limitation ou d’autorisation ;",
            "ne pas perturber volontairement le service ni lancer de trafic automatisé abusif ;",
            "ne pas utiliser VulcanForge UI pour stocker ou diffuser du contenu illicite ou portant atteinte aux droits de tiers.",
          ],
        },
        {
          title: '4. Contenu de projet et exports',
          paragraphs: [
            "Vous restez responsable des contenus, règles, tokens, composants et autres informations que vous saisissez dans vos projets ainsi que de l’usage des exports générés à partir de ces données.",
            "Ces conditions ne transfèrent pas à VulcanForge UI la propriété de vos contenus de projet. Le service les traite uniquement dans la mesure nécessaire à la fourniture des fonctionnalités demandées.",
          ],
        },
        {
          title: '5. Disponibilité de la bêta',
          paragraphs: [
            "La bêta peut être modifiée, interrompue ou indisponible ponctuellement. Conservez une copie des exports ou informations dont vous avez besoin en dehors du service.",
            "Les fonctionnalités expérimentales doivent être vérifiées avant tout usage critique ou en production.",
          ],
        },
        {
          title: '6. Suspension et suppression du compte',
          paragraphs: [
            "Vous pouvez supprimer votre compte depuis les paramètres prévus à cet effet. Une utilisation abusive, une tentative d’atteinte à la sécurité ou une obligation légale peut justifier une restriction ou suspension d’accès.",
          ],
        },
        {
          title: '7. Exploitant, contact et évolution des conditions',
          paragraphs: [
            `Exploitant déclaré pour ce déploiement : ${publisher.name}. Contact juridique et confidentialité : ${contact}.`,
            "La date de mise à jour figure en haut de cette page. Toute évolution importante de ces conditions devra être reflétée dans une version mise à jour avant qu’elle ne s’applique au parcours public concerné.",
          ],
        },
      ],
    };
  }

  return {
    eyebrow: 'Legal · Public beta',
    title: 'Terms of Use',
    description:
      'These terms govern access to and use of the current VulcanForge UI beta.',
    lastUpdatedLabel: 'Last updated',
    lastUpdatedDisplay: 'August 7, 2026',
    publicationWarningTitle: 'Publication details are incomplete',
    publicationWarning:
      'The operator identity and legal contact must be configured before this page is treated as ready for a public launch.',
    sections: [
      {
        title: '1. Scope and beta status',
        paragraphs: [
          'VulcanForge UI is currently provided as a beta. Features, limits and access conditions may change during this phase.',
          'The beta is currently free and billing is not enabled in the product.',
        ],
      },
      {
        title: '2. Account and security',
        paragraphs: [
          'You must use an email address you control and keep your credentials secure. You are responsible for activity performed through your account when it results from use of your authentication credentials.',
          'Email verification, password recovery and session-revocation features are provided to protect account access.',
        ],
      },
      {
        title: '3. Acceptable use',
        items: [
          'use the service in accordance with applicable law;',
          'do not attempt to bypass authentication, rate-limit or authorization controls;',
          'do not intentionally disrupt the service or generate abusive automated traffic;',
          'do not use VulcanForge UI to store or distribute unlawful material or material that infringes third-party rights.',
        ],
      },
      {
        title: '4. Project content and exports',
        paragraphs: [
          'You remain responsible for the content, rules, tokens, components and other information you enter into projects and for how you use exports generated from that data.',
          'These terms do not transfer ownership of your project content to VulcanForge UI. The service processes that content only as needed to provide the requested functionality.',
        ],
      },
      {
        title: '5. Beta availability',
        paragraphs: [
          'The beta may be changed, interrupted or temporarily unavailable. Keep your own copy of exports or information you need independently of the service.',
          'Experimental functionality should be reviewed before critical or production use.',
        ],
      },
      {
        title: '6. Account suspension and deletion',
        paragraphs: [
          'You can delete your account through the available account settings. Abuse, attempted security compromise or a legal obligation may justify restricting or suspending access.',
        ],
      },
      {
        title: '7. Operator, contact and changes to these terms',
        paragraphs: [
          `Operator declared for this deployment: ${publisher.name}. Legal and privacy contact: ${contact}.`,
          'The update date appears at the top of this page. Material changes to these terms should be reflected in an updated version before they apply to the relevant public journey.',
        ],
      },
    ],
  };
}

function getPrivacyDocument(
  locale: Locale,
  publisher: LegalPublisher,
): LegalDocument {
  const contact = getContactValue(locale, publisher);

  if (locale === 'fr') {
    return {
      eyebrow: 'Confidentialité · Bêta publique',
      title: 'Politique de confidentialité',
      description:
        'Cette page décrit les traitements de données actuellement nécessaires au fonctionnement de VulcanForge UI.',
      lastUpdatedLabel: 'Dernière mise à jour',
      lastUpdatedDisplay: '7 août 2026',
      publicationWarningTitle: 'Informations de publication incomplètes',
      publicationWarning:
        "L’identité complète du responsable de traitement et son point de contact doivent être configurés et la qualification juridique finale doit être validée avant une ouverture publique.",
      sections: [
        {
          title: '1. Responsable du traitement et contact',
          paragraphs: [
            `Responsable déclaré pour ce déploiement : ${publisher.name}. Contact relatif aux données personnelles : ${contact}.`,
            "Lorsque les informations de publication ne sont pas configurées, ce document décrit le comportement technique du produit mais ne doit pas être considéré comme une notice juridique finalisée pour un lancement public.",
          ],
        },
        {
          title: '2. Données traitées',
          items: [
            "données de compte : nom, adresse électronique, statut de vérification, langue et préférences d’interface ;",
            "données d’authentification et de sécurité : hash du mot de passe, version d’authentification, métadonnées de session, empreintes HMAC de limitation, identifiants techniques et événements de sécurité ;",
            "challenges de vérification et récupération : empreinte cryptographique du token, date d’expiration et métadonnées nécessaires au parcours ;",
            "données produit : espaces de travail, projets de design system, tokens, thèmes, composants, réglages, documentation et données nécessaires aux exports.",
          ],
        },
        {
          title: '3. Finalités et bases juridiques prévues',
          items: [
            "création et gestion du compte, des espaces de travail et des projets : traitement nécessaire à la fourniture du service demandé ;",
            "authentification, récupération, vérification d’adresse, prévention des abus et révocation de sessions : protection du service et des comptes ;",
            "envoi des messages transactionnels nécessaires à la vérification et à la récupération du compte ;",
            "production des fonctionnalités, contrôles d’accessibilité et exports demandés par l’utilisateur.",
          ],
          paragraphs: [
            "Pour la bêta actuelle, la qualification envisagée est l’exécution du service pour les opérations de compte et de produit, et l’intérêt légitime de sécurisation pour les contrôles de sécurité et d’abus. Cette qualification doit être confirmée par l’exploitant avant l’ouverture publique.",
            "Le parcours d’inscription n’ajoute aucun consentement marketing pré-coché ou implicite.",
          ],
        },
        {
          title: '4. Mots de passe et contrôle de compromission',
          paragraphs: [
            "Le mot de passe en clair n’est pas conservé. Les nouveaux mots de passe sont stockés sous forme de hash Argon2id après normalisation et validation.",
            "Lors de la création ou du remplacement d’un mot de passe, le service Pwned Passwords est interrogé avec seulement les cinq premiers caractères hexadécimaux du SHA-1 du mot de passe normalisé. Le mot de passe complet et son hash complet ne sont pas transmis à ce service.",
          ],
        },
        {
          title: '5. Destinataires et prestataires techniques',
          items: [
            "la base PostgreSQL et l’hébergement utilisés par le déploiement pour fournir l’application ;",
            "Resend dans les environnements déployés configurés pour l’envoi des emails transactionnels de vérification et de récupération ;",
            "Pwned Passwords pour le contrôle par k-anonymat des nouveaux mots de passe ;",
            "les services d’hébergement et de journalisation réellement configurés par l’exploitant.",
          ],
          paragraphs: [
            "Les prestataires d’hébergement, leurs lieux de traitement et les éventuels transferts hors Espace économique européen dépendent du déploiement final et doivent être documentés par l’exploitant avant un lancement public.",
          ],
        },
        {
          title: '6. Durées de conservation',
          items: [
            "les données de compte et de projet présentes dans la base principale sont conservées tant que le compte existe et sont supprimées avec le compte selon les relations de suppression du modèle actuel ;",
            "les challenges de vérification d’adresse et de récupération expirent après 30 minutes et sont supprimés après utilisation, remplacement, expiration ou suppression du compte ;",
            "les états de limitation sont bornés par les fenêtres de contrôle prévues par le système anti-abus ;",
            "la durée des sauvegardes, logs d’infrastructure et journaux de plateforme dépend des fournisseurs de déploiement et doit être fixée dans la configuration opérationnelle finale.",
          ],
        },
        {
          title: '7. Cookies et sessions',
          paragraphs: [
            "Le parcours d’authentification utilise les cookies et mécanismes de session nécessaires au fonctionnement d’Auth.js et aux contrôles de sécurité associés. AUTH-07 n’introduit aucun cookie publicitaire ou de consentement marketing.",
          ],
        },
        {
          title: '8. Vos droits',
          paragraphs: [
            "Selon le traitement concerné et la législation applicable, vous pouvez disposer de droits d’accès, rectification, effacement, limitation, portabilité et opposition. Adressez votre demande au contact de confidentialité indiqué ci-dessus.",
            "Vous pouvez également introduire une réclamation auprès de la CNIL si vous estimez que vos droits relatifs aux données personnelles ne sont pas respectés.",
          ],
          externalLink: {
            href: 'https://www.cnil.fr/fr/adresser-une-plainte',
            label: 'Adresser une plainte à la CNIL',
          },
        },
        {
          title: '9. Décisions automatisées et évolutions',
          paragraphs: [
            "Les contrôles automatiques de sécurité, de mot de passe et de limitation servent à protéger le compte et le service ; le produit actuel ne met pas en œuvre de décision automatisée produisant des effets juridiques ou similaires sur la personne.",
            "Toute nouvelle finalité, intégration de suivi, fonctionnalité marketing ou modification substantielle du traitement doit entraîner une réévaluation de cette politique avant son déploiement public.",
          ],
        },
      ],
    };
  }

  return {
    eyebrow: 'Privacy · Public beta',
    title: 'Privacy Notice',
    description:
      'This page describes the data processing currently needed to operate VulcanForge UI.',
    lastUpdatedLabel: 'Last updated',
    lastUpdatedDisplay: 'August 7, 2026',
    publicationWarningTitle: 'Publication details are incomplete',
    publicationWarning:
      'The controller identity and privacy contact must be configured and the final legal classification reviewed before public launch.',
    sections: [
      {
        title: '1. Controller and contact',
        paragraphs: [
          `Controller declared for this deployment: ${publisher.name}. Privacy contact: ${contact}.`,
          'When publication details are not configured, this document describes the technical behavior of the product but should not be treated as a finalized legal notice for public launch.',
        ],
      },
      {
        title: '2. Data we process',
        items: [
          'account data: name, email address, verification status, language and interface preferences;',
          'authentication and security data: password hash, authentication version, session metadata, HMAC rate-limit fingerprints, technical identifiers and security events;',
          'verification and recovery challenges: token fingerprint, expiry and metadata required for the journey;',
          'product data: workspaces, design-system projects, tokens, themes, components, settings, documentation and data required to generate exports.',
        ],
      },
      {
        title: '3. Purposes and intended legal bases',
        items: [
          'creating and managing the account, workspaces and projects: processing needed to provide the requested service;',
          'authentication, recovery, email verification, abuse prevention and session revocation: protecting the service and user accounts;',
          'sending transactional messages required for account verification and recovery;',
          'providing the requested product features, accessibility checks and exports.',
        ],
        paragraphs: [
          'For the current beta, the intended classification is performance of the service for account and product operations and legitimate interests in service security for security and abuse controls. The operator must confirm this mapping before public launch.',
          'The signup journey does not introduce any pre-checked or implicit marketing consent.',
        ],
      },
      {
        title: '4. Passwords and compromised-password checks',
        paragraphs: [
          'Plaintext passwords are not stored. New passwords are stored as Argon2id hashes after normalization and validation.',
          "When a password is created or replaced, the Pwned Passwords service receives only the first five hexadecimal characters of the normalized password's SHA-1 digest. The complete password and complete digest are not sent to that service.",
        ],
      },
      {
        title: '5. Recipients and technical providers',
        items: [
          'the PostgreSQL database and hosting used by the deployment to provide the application;',
          'Resend in deployed environments configured to deliver transactional verification and recovery email;',
          'Pwned Passwords for k-anonymous checking of newly accepted passwords;',
          'the hosting and logging services actually configured by the operator.',
        ],
        paragraphs: [
          'Hosting providers, processing locations and any transfers outside the European Economic Area depend on the final deployment and must be documented by the operator before public launch.',
        ],
      },
      {
        title: '6. Retention',
        items: [
          'account and project data in the primary application database is retained while the account exists and is deleted with the account under the current relational deletion model;',
          'email-verification and password-recovery challenges expire after 30 minutes and are deleted after use, replacement, expiry or account deletion;',
          'rate-limit state is bounded by the abuse-control windows defined by the application;',
          'backup, infrastructure-log and platform-log retention depends on the deployment providers and must be defined in the final operational configuration.',
        ],
      },
      {
        title: '7. Cookies and sessions',
        paragraphs: [
          'The authentication journey uses the cookies and session mechanisms required by Auth.js and the associated security controls. AUTH-07 does not add advertising cookies or marketing-consent tracking.',
        ],
      },
      {
        title: '8. Your rights',
        paragraphs: [
          'Depending on the processing and applicable law, you may have rights of access, rectification, erasure, restriction, portability and objection. Send a request to the privacy contact shown above.',
          'You may also lodge a complaint with the French data-protection authority, the CNIL, if you believe your data-protection rights have not been respected.',
        ],
        externalLink: {
          href: 'https://www.cnil.fr/fr/adresser-une-plainte',
          label: 'File a complaint with the CNIL',
        },
      },
      {
        title: '9. Automated decisions and future changes',
        paragraphs: [
          'Automated password, security and rate-limit checks protect accounts and the service; the current product does not implement automated decision-making that produces legal or similarly significant effects on a person.',
          'Any new purpose, tracking integration, marketing feature or material processing change should trigger a review of this notice before public deployment.',
        ],
      },
    ],
  };
}

export function getLegalDocument({
  locale,
  kind,
  publisher,
}: {
  locale: Locale;
  kind: LegalDocumentKind;
  publisher: LegalPublisher;
}) {
  return kind === 'terms'
    ? getTermsDocument(locale, publisher)
    : getPrivacyDocument(locale, publisher);
}
