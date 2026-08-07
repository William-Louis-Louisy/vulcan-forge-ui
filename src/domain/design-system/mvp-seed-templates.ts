import {
  designTokenSetSchema,
  type DesignTokenSet,
} from './design-token.schema';
import {
  componentContractSchema,
  type ComponentContract,
} from './component-contract.schema';
import { themeSchema, type ThemeSeed } from './theme.schema';

export const mvpTokenSetSeeds = [
  {
    type: 'color',
    name: 'Color',
    tokens: [
      {
        path: 'color.primitive.neutral.0',
        type: 'color',
        value: '#ffffff',
        description: {
          en: 'Pure white base color.',
          fr: 'Couleur blanche de base.',
        },
        status: 'ready',
      },
      {
        path: 'color.primitive.neutral.950',
        type: 'color',
        value: '#070707',
        description: {
          en: 'Deep neutral background color.',
          fr: 'Couleur neutre profonde pour les fonds.',
        },
        status: 'ready',
      },
      {
        path: 'color.primitive.accent.primary',
        type: 'color',
        value: '#FF8731',
        description: {
          en: 'Primary brand accent.',
          fr: 'Accent principal de marque.',
        },
        status: 'ready',
      },
      {
        path: 'color.primitive.accent.secondary',
        type: 'color',
        value: '#586644',
        description: {
          en: 'Secondary brand accent.',
          fr: 'Accent secondaire de marque.',
        },
        status: 'ready',
      },
      {
        path: 'color.semantic.background.app',
        type: 'color',
        value: '{color.primitive.neutral.950}',
        reference: '{color.primitive.neutral.950}',
        description: {
          en: 'Main application background.',
          fr: 'Fond principal de l’application.',
        },
        status: 'ready',
      },
      {
        path: 'color.semantic.action.primary',
        type: 'color',
        value: '{color.primitive.accent.primary}',
        reference: '{color.primitive.accent.primary}',
        description: {
          en: 'Primary interactive action color.',
          fr: 'Couleur principale des actions interactives.',
        },
        status: 'ready',
      },
      {
        path: 'color.primitive.neutral.50',
        type: 'color',
        value: '#F7F3EB',
        description: {
          en: 'Warm light application background.',
          fr: 'Fond applicatif clair et chaleureux.',
        },
        status: 'ready',
      },
      {
        path: 'color.primitive.neutral.100',
        type: 'color',
        value: '#E2E7EF',
        description: {
          en: 'Light content color for dark surfaces.',
          fr: 'Couleur de contenu claire pour les surfaces sombres.',
        },
        status: 'ready',
      },
      {
        path: 'color.primitive.neutral.400',
        type: 'color',
        value: '#A0B1CA',
        description: {
          en: 'Muted content color for dark surfaces.',
          fr: 'Couleur de contenu secondaire pour les surfaces sombres.',
        },
        status: 'ready',
      },
      {
        path: 'color.primitive.neutral.700',
        type: 'color',
        value: '#3A4454',
        description: {
          en: 'Muted content color for light surfaces.',
          fr: 'Couleur de contenu secondaire pour les surfaces claires.',
        },
        status: 'ready',
      },
      {
        path: 'color.primitive.neutral.900',
        type: 'color',
        value: '#1E1E1E',
        description: {
          en: 'Dark surface color.',
          fr: 'Couleur de surface sombre.',
        },
        status: 'ready',
      },
    ],
  },
  {
    type: 'spacing',
    name: 'Spacing',
    tokens: [
      {
        path: 'spacing.1',
        type: 'spacing',
        value: '0.25rem',
        description: {
          en: 'Extra small spacing step.',
          fr: 'Très petit pas d’espacement.',
        },
        status: 'ready',
      },
      {
        path: 'spacing.2',
        type: 'spacing',
        value: '0.5rem',
        description: {
          en: 'Small spacing step.',
          fr: 'Petit pas d’espacement.',
        },
        status: 'ready',
      },
      {
        path: 'spacing.4',
        type: 'spacing',
        value: '1rem',
        description: {
          en: 'Default spacing step.',
          fr: 'Pas d’espacement par défaut.',
        },
        status: 'ready',
      },
      {
        path: 'spacing.8',
        type: 'spacing',
        value: '2rem',
        description: {
          en: 'Large spacing step.',
          fr: 'Grand pas d’espacement.',
        },
        status: 'ready',
      },
    ],
  },
  {
    type: 'radius',
    name: 'Radius',
    tokens: [
      {
        path: 'radius.none',
        type: 'radius',
        value: '0rem',
        description: {
          en: 'No border radius.',
          fr: 'Aucun arrondi.',
        },
        status: 'ready',
      },
      {
        path: 'radius.md',
        type: 'radius',
        value: '0.5rem',
        description: {
          en: 'Medium border radius.',
          fr: 'Arrondi moyen.',
        },
        status: 'ready',
      },
      {
        path: 'radius.xl',
        type: 'radius',
        value: '1rem',
        description: {
          en: 'Large border radius.',
          fr: 'Grand arrondi.',
        },
        status: 'ready',
      },
      {
        path: 'radius.full',
        type: 'radius',
        value: '9999px',
        description: {
          en: 'Fully rounded shape.',
          fr: 'Forme entièrement arrondie.',
        },
        status: 'ready',
      },
    ],
  },
  {
    type: 'typography',
    name: 'Typography',
    tokens: [
      {
        path: 'typography.body.base',
        type: 'typography',
        value: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: '1.5',
          letterSpacing: '0em',
        },
        description: {
          en: 'Default body text style.',
          fr: 'Style de texte courant par défaut.',
        },
        status: 'ready',
      },
    ],
  },
  {
    type: 'motion',
    name: 'Motion',
    tokens: [
      {
        path: 'motion.duration.fast',
        type: 'motion',
        value: '150ms',
        description: {
          en: 'Fast interaction duration.',
          fr: 'Durée rapide pour les interactions.',
        },
        status: 'ready',
      },
      {
        path: 'motion.duration.normal',
        type: 'motion',
        value: '250ms',
        description: {
          en: 'Default interaction duration.',
          fr: 'Durée d’interaction par défaut.',
        },
        status: 'ready',
      },
      {
        path: 'motion.easing.standard',
        type: 'motion',
        value: 'cubic-bezier(0.2, 0, 0, 1)',
        description: {
          en: 'Default easing curve.',
          fr: 'Courbe d’animation par défaut.',
        },
        status: 'ready',
      },
    ],
  },
] as const satisfies readonly DesignTokenSet[];

export const mvpThemeSeeds = [
  {
    mode: 'light',
    name: 'Light',
    tokens: {
      color: {
        background: '{color.primitive.neutral.50}',
        surface: '{color.primitive.neutral.0}',
        content: '{color.primitive.neutral.950}',
        muted: '{color.primitive.neutral.700}',
        accent: '{color.primitive.accent.primary}',
      },
    },
  },
  {
    mode: 'dark',
    name: 'Dark',
    tokens: {
      color: {
        background: '{color.primitive.neutral.950}',
        surface: '{color.primitive.neutral.900}',
        content: '{color.primitive.neutral.100}',
        muted: '{color.primitive.neutral.400}',
        accent: '{color.primitive.accent.primary}',
      },
    },
  },
] as const satisfies readonly ThemeSeed[];

export const mvpComponentContractSeeds = [
  {
    type: 'button',
    name: 'Button',
    purpose: {
      en: 'Triggers an important user action.',
      fr: 'Déclenche une action importante de l’utilisateur.',
    },
    status: 'ready',
    anatomy: ['root', 'label', 'icon'],
    variants: [
      {
        key: 'primary',
        label: { en: 'Primary', fr: 'Principal' },
        description: {
          en: 'Used for the main action in a section.',
          fr: 'Utilisé pour l’action principale d’une section.',
        },
      },
      {
        key: 'secondary',
        label: { en: 'Secondary', fr: 'Secondaire' },
        description: {
          en: 'Used for secondary actions.',
          fr: 'Utilisé pour les actions secondaires.',
        },
      },
    ],
    states: [
      {
        key: 'disabled',
        label: { en: 'Disabled', fr: 'Désactivé' },
      },
      {
        key: 'loading',
        label: { en: 'Loading', fr: 'Chargement' },
      },
    ],
    accessibility: [
      {
        key: 'accessible-name',
        description: {
          en: 'Buttons must expose an accessible name.',
          fr: 'Les boutons doivent exposer un nom accessible.',
        },
        severity: 'critical',
      },
      {
        key: 'keyboard-activation',
        description: {
          en: 'Buttons must be activable with Enter and Space.',
          fr: 'Les boutons doivent être activables avec Entrée et Espace.',
        },
        severity: 'critical',
      },
    ],
    forbiddenPatterns: [
      {
        en: 'Do not use a button as a navigation link.',
        fr: 'Ne pas utiliser un bouton comme lien de navigation.',
      },
    ],
    sizes: [
      {
        key: 'sm',
        label: {
          en: 'Small',
          fr: 'Petit',
        },
      },
      {
        key: 'md',
        label: {
          en: 'Medium',
          fr: 'Moyen',
        },
      },
      {
        key: 'lg',
        label: {
          en: 'Large',
          fr: 'Grand',
        },
      },
    ],
    tokenBindings: [
      {
        key: 'background',
        tokenType: 'color',
        tokenPath: 'color.background.default',
        description: {
          en: 'Default button background.',
          fr: 'Fond par défaut du bouton.',
        },
      },
      {
        key: 'foreground',
        tokenType: 'color',
        tokenPath: 'color.foreground.default',
      },
      {
        key: 'radius',
        tokenType: 'radius',
        tokenPath: 'radius.md',
      },
      {
        key: 'paddingX',
        tokenType: 'spacing',
        tokenPath: 'spacing.4',
      },
    ],
  },
  {
    type: 'textField',
    name: 'TextField',
    purpose: {
      en: 'Collects short text input from the user.',
      fr: 'Collecte une saisie textuelle courte de l’utilisateur.',
    },
    status: 'ready',
    anatomy: ['root', 'label', 'input', 'hint', 'error'],
    variants: [
      {
        key: 'default',
        label: { en: 'Default', fr: 'Défaut' },
      },
    ],
    states: [
      {
        key: 'focus',
        label: { en: 'Focus', fr: 'Focus' },
      },
      {
        key: 'invalid',
        label: { en: 'Invalid', fr: 'Invalide' },
      },
      {
        key: 'disabled',
        label: { en: 'Disabled', fr: 'Désactivé' },
      },
    ],
    accessibility: [
      {
        key: 'visible-label',
        description: {
          en: 'Text fields must have a visible label.',
          fr: 'Les champs texte doivent avoir un label visible.',
        },
        severity: 'critical',
      },
      {
        key: 'error-linking',
        description: {
          en: 'Validation errors must be associated with the input.',
          fr: 'Les erreurs de validation doivent être liées au champ.',
        },
        severity: 'critical',
      },
    ],
    forbiddenPatterns: [
      {
        en: 'Do not rely on placeholder text as the only label.',
        fr: 'Ne pas utiliser le placeholder comme unique label.',
      },
    ],
    sizes: [
      {
        key: 'sm',
        label: {
          en: 'Small',
          fr: 'Petit',
        },
      },
      {
        key: 'md',
        label: {
          en: 'Medium',
          fr: 'Moyen',
        },
      },
      {
        key: 'lg',
        label: {
          en: 'Large',
          fr: 'Grand',
        },
      },
    ],
    tokenBindings: [],
  },
  {
    type: 'card',
    name: 'Card',
    purpose: {
      en: 'Groups related content and actions.',
      fr: 'Regroupe des contenus et actions liés.',
    },
    status: 'ready',
    anatomy: ['root', 'header', 'content', 'footer'],
    variants: [
      {
        key: 'default',
        label: { en: 'Default', fr: 'Défaut' },
      },
      {
        key: 'interactive',
        label: { en: 'Interactive', fr: 'Interactive' },
      },
    ],
    states: [],
    accessibility: [
      {
        key: 'semantic-structure',
        description: {
          en: 'Interactive cards must expose a clear action and accessible name.',
          fr: 'Les cards interactives doivent exposer une action claire et un nom accessible.',
        },
        severity: 'warning',
      },
    ],
    forbiddenPatterns: [
      {
        en: 'Do not make an entire card clickable if nested interactive elements conflict.',
        fr: 'Ne pas rendre toute une card cliquable si des éléments interactifs imbriqués entrent en conflit.',
      },
    ],
    sizes: [
      {
        key: 'sm',
        label: {
          en: 'Small',
          fr: 'Petit',
        },
      },
      {
        key: 'md',
        label: {
          en: 'Medium',
          fr: 'Moyen',
        },
      },
      {
        key: 'lg',
        label: {
          en: 'Large',
          fr: 'Grand',
        },
      },
    ],
    tokenBindings: [],
  },
  {
    type: 'alert',
    name: 'Alert',
    purpose: {
      en: 'Communicates feedback, status or warnings.',
      fr: 'Communique un feedback, un statut ou un avertissement.',
    },
    status: 'ready',
    anatomy: ['root', 'icon', 'title', 'description'],
    variants: [
      {
        key: 'info',
        label: { en: 'Info', fr: 'Information' },
      },
      {
        key: 'success',
        label: { en: 'Success', fr: 'Succès' },
      },
      {
        key: 'warning',
        label: { en: 'Warning', fr: 'Avertissement' },
      },
      {
        key: 'danger',
        label: { en: 'Danger', fr: 'Danger' },
      },
    ],
    states: [],
    accessibility: [
      {
        key: 'status-role',
        description: {
          en: 'Use status or alert semantics depending on urgency.',
          fr: 'Utiliser une sémantique status ou alert selon l’urgence.',
        },
        severity: 'warning',
      },
    ],
    forbiddenPatterns: [
      {
        en: 'Do not use color alone to communicate severity.',
        fr: 'Ne pas utiliser uniquement la couleur pour communiquer la sévérité.',
      },
    ],
    sizes: [
      {
        key: 'sm',
        label: {
          en: 'Small',
          fr: 'Petit',
        },
      },
      {
        key: 'md',
        label: {
          en: 'Medium',
          fr: 'Moyen',
        },
      },
      {
        key: 'lg',
        label: {
          en: 'Large',
          fr: 'Grand',
        },
      },
    ],
    tokenBindings: [],
  },
  {
    type: 'dialog',
    name: 'Dialog',
    purpose: {
      en: 'Displays a focused task, confirmation or decision.',
      fr: 'Affiche une tâche, confirmation ou décision focalisée.',
    },
    status: 'ready',
    anatomy: ['root', 'overlay', 'title', 'description', 'actions'],
    variants: [
      {
        key: 'default',
        label: { en: 'Default', fr: 'Défaut' },
      },
      {
        key: 'danger',
        label: { en: 'Danger', fr: 'Danger' },
      },
    ],
    states: ['open', 'closed'].map((key) => ({
      key,
      label:
        key === 'open'
          ? { en: 'Open', fr: 'Ouverte' }
          : { en: 'Closed', fr: 'Fermée' },
    })),
    accessibility: [
      {
        key: 'focus-management',
        description: {
          en: 'Dialogs must trap focus while open and restore focus when closed.',
          fr: 'Les dialogs doivent piéger le focus à l’ouverture et le restaurer à la fermeture.',
        },
        severity: 'critical',
      },
      {
        key: 'escape-close',
        description: {
          en: 'Dialogs should close with Escape unless the action is destructive or blocking.',
          fr: 'Les dialogs devraient se fermer avec Échap sauf action destructive ou bloquante.',
        },
        severity: 'warning',
      },
    ],
    forbiddenPatterns: [
      {
        en: 'Do not open a dialog without an accessible title.',
        fr: 'Ne pas ouvrir un dialog sans titre accessible.',
      },
    ],
    sizes: [
      {
        key: 'sm',
        label: {
          en: 'Small',
          fr: 'Petit',
        },
      },
      {
        key: 'md',
        label: {
          en: 'Medium',
          fr: 'Moyen',
        },
      },
      {
        key: 'lg',
        label: {
          en: 'Large',
          fr: 'Grand',
        },
      },
    ],
    tokenBindings: [],
  },
] as const satisfies readonly ComponentContract[];

export function getMvpSeedTemplates() {
  return {
    tokenSets: mvpTokenSetSeeds.map((tokenSet) =>
      designTokenSetSchema.parse(tokenSet),
    ),
    themes: mvpThemeSeeds.map((theme) => themeSchema.parse(theme)),
    componentContracts: mvpComponentContractSeeds.map((contract) =>
      componentContractSchema.parse(contract),
    ),
  };
}
