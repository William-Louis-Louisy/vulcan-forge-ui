import {
  getComponentCategory,
  getComponentCompleteness,
  createComponentRegistryItems,
  getComponentCompletenessWarnings,
  groupComponentRegistryItemsByCategory,
} from './components-registry.utils';
import { describe, expect, it } from 'vitest';
import type {
  ComponentCategory,
  ComponentContract,
  ComponentContractType,
} from '@/domain/design-system';

const buttonContract: ComponentContract = {
  type: 'button',
  name: 'Button',
  purpose: {
    en: 'Triggers an action.',
    fr: 'Déclenche une action.',
  },
  status: 'ready',
  anatomy: ['root', 'label'],
  variants: [
    {
      key: 'primary',
      label: {
        en: 'Primary',
        fr: 'Primaire',
      },
    },
  ],
  states: [
    {
      key: 'disabled',
      label: {
        en: 'Disabled',
        fr: 'Désactivé',
      },
    },
    {
      key: 'focus',
      label: {
        en: 'Focus',
        fr: 'Focus',
      },
    },
    {
      key: 'hover',
      label: {
        en: 'Hover',
        fr: 'Survol',
      },
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
  ],
  forbiddenPatterns: [
    {
      en: 'Do not use a button as a navigation link.',
      fr: 'Ne pas utiliser un bouton comme lien de navigation.',
    },
  ],
  sizes: [],
  tokenBindings: [],
};

const categoryByType: Record<ComponentContractType, ComponentCategory> = {
  button: 'action',
  textField: 'input',
  card: 'layout',
  alert: 'feedback',
  dialog: 'overlay',
};

function createStoredLegacyComponent({
  id,
  contract,
}: {
  id: string;
  contract: ComponentContract;
}) {
  return {
    id,
    key: contract.type,
    templateKey: contract.type,
    category: categoryByType[contract.type],
    contractVersion: 1,
    type: contract.type,
    name: contract.name,
    contract,
  };
}

describe('components registry utils', () => {
  it('maps component types to categories', () => {
    expect(getComponentCategory('button')).toBe('action');
    expect(getComponentCategory('textField')).toBe('input');
    expect(getComponentCategory('card')).toBe('layout');
    expect(getComponentCategory('alert')).toBe('feedback');
    expect(getComponentCategory('dialog')).toBe('overlay');
  });

  it('computes complete component contracts', () => {
    expect(getComponentCompleteness(buttonContract)).toEqual({
      score: 100,
      level: 'complete',
      missingFields: [],
      warnings: [],
    });
  });

  it('computes partial component contracts', () => {
    expect(
      getComponentCompleteness({
        ...buttonContract,
        states: [],
        forbiddenPatterns: [],
      }),
    ).toEqual({
      score: 57,
      level: 'partial',
      missingFields: ['states', 'forbiddenPatterns'],
      warnings: [
        {
          code: 'missingCriticalStates',
          severity: 'warning',
        },
      ],
    });
  });

  it('creates registry items through the registered V2 template boundary', () => {
    expect(
      createComponentRegistryItems([
        createStoredLegacyComponent({
          id: 'button-contract',
          contract: buttonContract,
        }),
      ]),
    ).toMatchObject({
      invalidCount: 0,
      items: [
        {
          id: 'button-contract',
          key: 'button',
          templateKey: 'button',
          type: 'button',
          name: 'Button',
          status: 'ready',
          category: 'action',
          platforms: ['web', 'mobile'],
          contractV2: {
            version: 2,
            key: 'button',
            templateKey: 'button',
          },
          completeness: {
            score: 100,
            level: 'complete',
          },
          isValid: true,
        },
      ],
    });
  });

  it('derives compatibility type from templateKey instead of trusting persisted legacy type', () => {
    const storedButton = createStoredLegacyComponent({
      id: 'marketing-cta',
      contract: buttonContract,
    });

    expect(
      createComponentRegistryItems([
        {
          ...storedButton,
          key: 'marketingCta',
          name: 'Marketing CTA',
          type: 'card',
        },
      ]),
    ).toMatchObject({
      invalidCount: 0,
      items: [
        {
          key: 'marketingCta',
          templateKey: 'button',
          type: 'button',
          name: 'Marketing CTA',
        },
      ],
    });
  });

  it('counts invalid component contracts', () => {
    expect(
      createComponentRegistryItems([
        {
          id: 'invalid-contract',
          key: 'button',
          templateKey: 'button',
          category: 'action',
          contractVersion: 1,
          type: 'button',
          name: 'Button',
          contract: {
            invalid: true,
          },
        },
      ]),
    ).toEqual({
      items: [],
      invalidCount: 1,
    });
  });

  it('returns a warning when purpose is missing', () => {
    expect(
      getComponentCompletenessWarnings({
        ...buttonContract,
        purpose: {},
      }),
    ).toContainEqual({
      code: 'missingPurpose',
      severity: 'warning',
    });
  });

  it('returns a warning when an interactive component has no accessible name rule', () => {
    expect(
      getComponentCompletenessWarnings({
        ...buttonContract,
        accessibility: [
          {
            key: 'keyboard-support',
            severity: 'critical',
            description: {
              en: 'The component must support keyboard interactions.',
              fr: 'Le composant doit supporter les interactions clavier.',
            },
          },
        ],
      }),
    ).toContainEqual({
      code: 'missingAccessibleNameRule',
      severity: 'warning',
    });
  });

  it('returns a warning when critical states are missing', () => {
    expect(
      getComponentCompletenessWarnings({
        ...buttonContract,
        states: [
          {
            key: 'disabled',
            label: {
              en: 'Disabled',
              fr: 'Désactivé',
            },
          },
        ],
      }),
    ).toContainEqual({
      code: 'missingCriticalStates',
      severity: 'warning',
    });
  });

  it('does not require accessible name warnings for non-interactive cards', () => {
    expect(
      getComponentCompletenessWarnings({
        ...buttonContract,
        type: 'card',
        name: 'Card',
        accessibility: [],
        states: [],
      }),
    ).not.toContainEqual({
      code: 'missingAccessibleNameRule',
      severity: 'warning',
    });
  });

  it('groups registry items by persisted category', () => {
    const alertContract: ComponentContract = {
      ...buttonContract,
      type: 'alert',
      name: 'Alert',
      status: 'draft',
      variants: [],
      states: [],
      accessibility: [],
      forbiddenPatterns: [],
    };
    const registry = createComponentRegistryItems([
      createStoredLegacyComponent({
        id: 'button-contract',
        contract: buttonContract,
      }),
      createStoredLegacyComponent({
        id: 'alert-contract',
        contract: alertContract,
      }),
    ]);

    expect(groupComponentRegistryItemsByCategory(registry.items)).toEqual([
      {
        category: 'action',
        items: [expect.objectContaining({ type: 'button', key: 'button' })],
      },
      {
        category: 'feedback',
        items: [expect.objectContaining({ type: 'alert', key: 'alert' })],
      },
    ]);
  });
});
