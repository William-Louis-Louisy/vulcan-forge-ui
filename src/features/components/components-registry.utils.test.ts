import {
  getComponentCategory,
  getComponentCompleteness,
  createComponentRegistryItems,
  getComponentCompletenessWarnings,
  groupComponentRegistryItemsByCategory,
} from './components-registry.utils';
import { describe, expect, it } from 'vitest';
import type { ComponentContract } from '@/domain/design-system';

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
};

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

  it('creates registry items from valid component contracts', () => {
    expect(
      createComponentRegistryItems([
        {
          id: 'button-contract',
          type: 'button',
          name: 'Button',
          contract: buttonContract,
        },
      ]),
    ).toMatchObject({
      invalidCount: 0,
      items: [
        {
          id: 'button-contract',
          type: 'button',
          name: 'Button',
          status: 'ready',
          category: 'action',
          platforms: ['web', 'mobile'],
          completeness: {
            score: 100,
            level: 'complete',
          },
          isValid: true,
        },
      ],
    });
  });

  it('counts invalid component contracts', () => {
    expect(
      createComponentRegistryItems([
        {
          id: 'invalid-contract',
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

  it('groups registry items by category', () => {
    const registry = createComponentRegistryItems([
      {
        id: 'button-contract',
        type: 'button',
        name: 'Button',
        contract: buttonContract,
      },
      {
        id: 'alert-contract',
        type: 'alert',
        name: 'Alert',
        contract: {
          ...buttonContract,
          type: 'alert',
          name: 'Alert',
          status: 'draft',
          variants: [],
          states: [],
          accessibility: [],
          forbiddenPatterns: [],
        },
      },
    ]);

    expect(groupComponentRegistryItemsByCategory(registry.items)).toEqual([
      {
        category: 'action',
        items: [expect.objectContaining({ type: 'button' })],
      },
      {
        category: 'feedback',
        items: [expect.objectContaining({ type: 'alert' })],
      },
    ]);
  });
});
