import type { Locale } from '@/i18n/routing';
import type { MessageObject } from './merge-messages';

const technicalGroups = {
  dimensions: 'Dimensions',
  spacing: 'Spacing',
  radius: 'Radius',
  fill: 'Fill',
  border: 'Stroke / Border',
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
  background: 'Background',
  foreground: 'Foreground',
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
        title: 'Visual tokens',
        description:
          'Edit the component appearance from one compact property inspector. Add optional property groups only when you need them.',
        scope: 'Editing layer',
        target: 'Target',
        addProperty: 'Add visual property',
        removeProperty: 'Remove visual property',
        noPropertiesToAdd: 'All optional properties are already visible.',
        independentCorners: 'Independent corners',
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
        unset: 'Default',
        selectToken: 'Select token',
        valuePlaceholder: 'e.g. 12px',
        colorPlaceholder: 'e.g. #111827',
        groups: technicalGroups,
        properties: technicalProperties,
        borderStyles: technicalBorderStyles,
        textAlignments: technicalTextAlignments,
        save: {
          action: 'Save visual tokens',
          saving: 'Saving…',
          saved: 'Visual tokens saved',
          unsaved: 'Unsaved visual changes',
          invalid: 'Visual tokens are invalid',
          errors: {
            unauthorized: 'You must be signed in to update this component.',
            projectNotFound: 'The design system could not be found.',
            componentContractNotFound: 'This component no longer exists.',
            invalidPayload: 'The visual customization payload is invalid.',
            invalidContract:
              'This visual editor only supports Button and TextField templates.',
            unexpected: 'Unable to save the visual tokens. Try again.',
          },
        },
      },
    },
  },
  fr: {
    ComponentsRegistryPage: {
      buttonCustomization: {
        title: 'Tokens visuels',
        description:
          'Modifiez l’apparence du composant depuis un seul inspecteur compact. Ajoutez les groupes de propriétés optionnels uniquement lorsque vous en avez besoin.',
        scope: 'Couche éditée',
        target: 'Cible',
        addProperty: 'Ajouter une propriété visuelle',
        removeProperty: 'Retirer la propriété visuelle',
        noPropertiesToAdd:
          'Toutes les propriétés optionnelles sont déjà affichées.',
        independentCorners: 'Independent corners',
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
        unset: 'Default',
        selectToken: 'Sélectionner un token',
        valuePlaceholder: 'ex. 12px',
        colorPlaceholder: 'ex. #111827',
        groups: technicalGroups,
        properties: technicalProperties,
        borderStyles: technicalBorderStyles,
        textAlignments: technicalTextAlignments,
        save: {
          action: 'Enregistrer les tokens visuels',
          saving: 'Enregistrement…',
          saved: 'Tokens visuels enregistrés',
          unsaved: 'Modifications visuelles non enregistrées',
          invalid: 'Les tokens visuels sont invalides',
          errors: {
            unauthorized:
              'Vous devez être connecté pour modifier ce composant.',
            projectNotFound: 'Le design system est introuvable.',
            componentContractNotFound: 'Ce composant n’existe plus.',
            invalidPayload: 'La personnalisation visuelle est invalide.',
            invalidContract:
              'Cet éditeur visuel prend uniquement en charge les templates Button et TextField.',
            unexpected:
              'Impossible d’enregistrer les tokens visuels. Veuillez réessayer.',
          },
        },
      },
    },
  },
} satisfies Record<Locale, MessageObject>;
