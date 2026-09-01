import type { Locale } from '@/i18n/routing';
import type { MessageObject } from './merge-messages';

const technicalGroups = {
  dimensions: 'Dimensions',
  spacing: 'Spacing',
  radius: 'Radius',
  border: 'Border',
  typography: 'Typography',
} as const;

const technicalProperties = {
  width: 'Width',
  minWidth: 'Min width',
  height: 'Height',
  minHeight: 'Min height',
  paddingX: 'Padding X',
  paddingY: 'Padding Y',
  gap: 'Gap',
  radius: 'Radius',
  topLeft: 'Top-left radius',
  topRight: 'Top-right radius',
  bottomRight: 'Bottom-right radius',
  bottomLeft: 'Bottom-left radius',
  borderWidth: 'Border width',
  borderStyle: 'Border style',
  borderColor: 'Border color',
  typography: 'Typography',
  fontFamily: 'Font family',
  fontSize: 'Font size',
  fontWeight: 'Font weight',
  lineHeight: 'Line height',
  letterSpacing: 'Letter spacing',
  textAlign: 'Text align',
} as const;

const technicalBorderStyles = {
  none: 'None',
  solid: 'Solid',
  dashed: 'Dashed',
  dotted: 'Dotted',
} as const;

const technicalTextAlignments = {
  left: 'Left',
  center: 'Center',
  right: 'Right',
  justify: 'Justify',
} as const;

export const componentV2CustomizationMessages = {
  en: {
    ComponentsRegistryPage: {
      buttonCustomization: {
        title: 'Button visual customization',
        description:
          'Author the Button appearance directly. Values can reference design tokens or use controlled explicit values.',
        scope: 'Editing layer',
        target: 'Target',
        scopes: {
          base: 'Base',
          variant: 'Variant',
          size: 'Size',
          state: 'State',
        },
        inherited: 'Inherited',
        templateDefault: 'Template default',
        reset: 'Reset',
        source: 'Value source',
        token: 'Token',
        explicit: 'Explicit value',
        modeAuto: 'Auto',
        modeFill: 'Fill',
        unset: 'Inherit / default',
        selectToken: 'Select token',
        valuePlaceholder: 'e.g. 12px',
        colorPlaceholder: 'e.g. #111827',
        groups: technicalGroups,
        properties: technicalProperties,
        borderStyles: technicalBorderStyles,
        textAlignments: technicalTextAlignments,
        save: {
          action: 'Save visual customization',
          saving: 'Saving…',
          saved: 'Visual customization saved',
          unsaved: 'Unsaved visual changes',
          invalid: 'Visual customization is invalid',
          errors: {
            unauthorized: 'You must be signed in to update this component.',
            projectNotFound: 'The design system could not be found.',
            componentContractNotFound: 'This component no longer exists.',
            invalidPayload: 'The visual customization payload is invalid.',
            invalidContract:
              'This visual editor only supports Button templates.',
            unexpected: 'Unable to save the visual customization. Try again.',
          },
        },
      },
    },
  },
  fr: {
    ComponentsRegistryPage: {
      buttonCustomization: {
        title: 'Personnalisation visuelle du Button',
        description:
          'Définissez directement l’apparence du Button. Les valeurs peuvent référencer des design tokens ou utiliser des valeurs explicites contrôlées.',
        scope: 'Couche éditée',
        target: 'Cible',
        scopes: {
          base: 'Base',
          variant: 'Variant',
          size: 'Size',
          state: 'State',
        },
        inherited: 'Hérité',
        templateDefault: 'Template default',
        reset: 'Reset',
        source: 'Source de la valeur',
        token: 'Token',
        explicit: 'Explicit value',
        modeAuto: 'Auto',
        modeFill: 'Fill',
        unset: 'Inherit / default',
        selectToken: 'Sélectionner un token',
        valuePlaceholder: 'ex. 12px',
        colorPlaceholder: 'ex. #111827',
        groups: technicalGroups,
        properties: technicalProperties,
        borderStyles: technicalBorderStyles,
        textAlignments: technicalTextAlignments,
        save: {
          action: 'Enregistrer la personnalisation',
          saving: 'Enregistrement…',
          saved: 'Personnalisation visuelle enregistrée',
          unsaved: 'Modifications visuelles non enregistrées',
          invalid: 'La personnalisation visuelle est invalide',
          errors: {
            unauthorized:
              'Vous devez être connecté pour modifier ce composant.',
            projectNotFound: 'Le design system est introuvable.',
            componentContractNotFound: 'Ce composant n’existe plus.',
            invalidPayload: 'La personnalisation visuelle est invalide.',
            invalidContract:
              'Cet éditeur visuel prend uniquement en charge les templates Button.',
            unexpected:
              'Impossible d’enregistrer la personnalisation visuelle. Veuillez réessayer.',
          },
        },
      },
    },
  },
} satisfies Record<Locale, MessageObject>;
