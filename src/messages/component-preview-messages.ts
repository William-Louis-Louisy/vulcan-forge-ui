import type { Locale } from '@/i18n/routing';
import type { MessageObject } from './merge-messages';

export const componentPreviewMessages = {
  en: {
    ComponentsRegistryPage: {
      foundationsPreview: {
        missingStatusColorsNotice:
          'Missing semantic status colors: {paths}. The component preview is using fallback colors.',
      },
      workspace: {
        canvasTitle: 'Canvas',
        canvasModes: {
          ariaLabel: 'Canvas view',
          instance: 'Instance',
          anatomy: 'Anatomy',
          matrix: 'Matrix',
        },
        instance: {
          title: 'Component instance',
          description:
            'Choose one variant, size and state to inspect a representative component instance. Preview controls do not change what the Inspector is editing.',
        },
        matrix: {
          title: 'Configuration matrix',
          description:
            'Compare variants and sizes under one selected state. The matrix keeps the state axis controlled instead of rendering every possible three-axis combination.',
          editDefinition: 'Edit',
          useCombination: 'Preview combination',
          selectedCombination: 'Current',
        },
        anatomy: {
          component: 'Component',
          flatStructure: 'Flat contract structure',
          empty: 'No anatomy parts yet.',
          selectPart: 'Select a part to edit it in the Inspector.',
          untitled: 'Untitled part',
        },
      },
    },
  },
  fr: {
    ComponentsRegistryPage: {
      foundationsPreview: {
        missingStatusColorsNotice:
          'Couleurs sémantiques de statut manquantes : {paths}. L’aperçu du composant utilise des couleurs de secours.',
      },
      workspace: {
        canvasTitle: 'Canevas',
        canvasModes: {
          ariaLabel: 'Vue du canevas',
          instance: 'Instance',
          anatomy: 'Anatomie',
          matrix: 'Matrice',
        },
        instance: {
          title: 'Instance du composant',
          description:
            'Choisissez une variante, une taille et un état pour examiner une instance représentative. Les contrôles d’aperçu ne changent pas ce que l’Inspector est en train d’éditer.',
        },
        matrix: {
          title: 'Matrice de configuration',
          description:
            'Comparez les variantes et les tailles sous un seul état sélectionné. La matrice garde l’axe des états sous contrôle au lieu de rendre toutes les combinaisons possibles des trois axes.',
          editDefinition: 'Modifier',
          useCombination: 'Prévisualiser la combinaison',
          selectedCombination: 'Actuelle',
        },
        anatomy: {
          component: 'Composant',
          flatStructure: 'Structure de contrat à plat',
          empty: "Aucune partie d'anatomie pour le moment.",
          selectPart:
            "Sélectionnez une partie pour la modifier dans l'Inspector.",
          untitled: 'Partie sans titre',
        },
      },
    },
  },
} satisfies Record<Locale, MessageObject>;
