import { describe, expect, it } from 'vitest';
import type { ComponentContract } from '@/domain/design-system';
import {
  createComponentRegistryItems,
  getComponentCategory,
  getComponentCompleteness,
} from './components-registry.utils';

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
      score: 67,
      level: 'partial',
      missingFields: ['states', 'forbiddenPatterns'],
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
});
