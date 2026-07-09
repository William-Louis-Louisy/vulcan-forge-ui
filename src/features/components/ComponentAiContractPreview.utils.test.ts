import { describe, expect, it } from 'vitest';
import type { ComponentRegistryItem } from './components-registry.utils';
import {
  createComponentAiContractPreview,
  getComponentAiContractMissingSourceData,
  type ComponentAiContractRuleCopy,
} from './ComponentAiContractPreview.utils';

const copy: ComponentAiContractRuleCopy = {
  strictRules: 'strict rules',
  purpose: 'Purpose',
  usageGuidelines: 'Usage',
  contentGuidelines: 'Content',
  anatomy: 'Use only anatomy parts',
  variants: 'Use only variants',
  sizes: 'Use only sizes',
  states: 'Support only states',
  tokenBindings: 'Use only token bindings',
  accessibility: 'Accessibility',
  forbidden: 'Never',
  severities: {
    info: 'Info',
    warning: 'Warning',
    critical: 'Critical',
  },
};

const component: ComponentRegistryItem = {
  id: 'button',
  type: 'button',
  name: 'Button',
  status: 'ready',
  category: 'action',
  platforms: ['web', 'mobile'],
  isValid: true,
  completeness: {
    score: 100,
    level: 'complete',
    missingFields: [],
    warnings: [],
  },
  contract: {
    type: 'button',
    name: 'Button',
    status: 'ready',
    purpose: {
      en: 'Trigger a contextual action.',
      fr: 'Déclencher une action contextuelle.',
    },
    usageGuidelines: {
      en: 'Use one primary action per context.',
      fr: 'Utiliser une action principale par contexte.',
    },
    contentGuidelines: {
      en: 'Start labels with a verb.',
      fr: 'Commencer les labels par un verbe.',
    },
    anatomy: [
      {
        key: 'label',
        label: {
          en: 'Label',
          fr: 'Libellé',
        },
        requirement: 'required',
      },
    ],
    variants: [
      {
        key: 'primary',
        label: {
          en: 'Primary',
          fr: 'Primaire',
        },
      },
    ],
    sizes: [
      {
        key: 'md',
        label: {
          en: 'Medium',
          fr: 'Moyen',
        },
      },
    ],
    states: [
      {
        key: 'loading',
        label: {
          en: 'Loading',
          fr: 'Chargement',
        },
      },
    ],
    tokenBindings: [
      {
        key: 'background',
        tokenType: 'color',
        tokenPath: 'color.action.primary',
      },
    ],
    accessibility: [
      {
        key: 'loading-state',
        severity: 'critical',
        description: {
          en: 'Expose aria-busy while loading.',
          fr: 'Exposer aria-busy pendant le chargement.',
        },
      },
    ],
    forbiddenPatterns: [
      {
        en: 'Wrap a button in a link.',
        fr: 'Imbriquer un bouton dans un lien.',
      },
    ],
  },
};

describe('createComponentAiContractPreview', () => {
  it('creates concise strict rules from real component contract data', () => {
    const preview = createComponentAiContractPreview({
      component,
      locale: 'en',
      copy,
    });

    expect(preview.heading).toBe('# Button — strict rules');
    expect(preview.rules).toEqual([
      'Purpose: Trigger a contextual action.',
      'Usage: Use one primary action per context.',
      'Content: Start labels with a verb.',
      'Use only anatomy parts: `label`',
      'Use only variants: `primary`',
      'Use only sizes: `md`',
      'Support only states: `loading`',
      'Use only token bindings: `background` → `color.action.primary`',
      'Accessibility [Critical]: Expose aria-busy while loading.',
      'Never: Wrap a button in a link.',
    ]);
    expect(preview.missingSourceData).toEqual([]);
  });

  it('uses the requested locale with the existing fallback behavior', () => {
    const preview = createComponentAiContractPreview({
      component,
      locale: 'fr',
      copy,
    });

    expect(preview.rules).toContain(
      'Purpose: Déclencher une action contextuelle.',
    );
    expect(preview.rules).toContain(
      'Accessibility [Critical]: Exposer aria-busy pendant le chargement.',
    );
  });
});

describe('getComponentAiContractMissingSourceData', () => {
  it('reports every source field required for a strict component contract', () => {
    const incompleteComponent: ComponentRegistryItem = {
      ...component,
      contract: {
        ...component.contract,
        purpose: {},
        usageGuidelines: undefined,
        contentGuidelines: undefined,
        anatomy: [],
        variants: [],
        sizes: [],
        states: [],
        tokenBindings: [],
        accessibility: [],
        forbiddenPatterns: [],
      },
    };

    expect(
      getComponentAiContractMissingSourceData(incompleteComponent),
    ).toEqual([
      'purpose',
      'usageGuidelines',
      'contentGuidelines',
      'anatomy',
      'variants',
      'sizes',
      'states',
      'tokenBindings',
      'accessibilityRules',
      'forbiddenPatterns',
    ]);
  });
});
