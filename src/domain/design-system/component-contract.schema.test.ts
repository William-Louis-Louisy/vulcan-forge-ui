import { describe, expect, it } from 'vitest';
import { componentContractSchema } from './component-contract.schema';

describe('componentContractSchema', () => {
  it('accepts a valid component contract', () => {
    expect(
      componentContractSchema.parse({
        type: 'button',
        name: 'Button',
        purpose: {
          en: 'Triggers an action.',
          fr: 'Déclenche une action.',
        },
        variants: [
          {
            key: 'primary',
            label: {
              en: 'Primary',
              fr: 'Principal',
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
              en: 'Buttons must have an accessible name.',
              fr: 'Les boutons doivent avoir un nom accessible.',
            },
            severity: 'critical',
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
        tokenBindings: [
          {
            key: 'background',
            tokenType: 'color',
            tokenPath: 'color.background.default',
            description: {
              en: 'Default component background.',
              fr: 'Fond par défaut du composant.',
            },
          },
          {
            key: 'radius',
            tokenType: 'radius',
            tokenPath: 'radius.md',
          },
        ],
      }),
    ).toMatchObject({
      type: 'button',
      name: 'Button',
      status: 'draft',
    });
  });

  it('rejects a contract without localized purpose', () => {
    expect(
      componentContractSchema.safeParse({
        type: 'button',
        name: 'Button',
        purpose: {},
      }).success,
    ).toBe(false);
  });
  it('defaults optional matrix fields to empty arrays', () => {
    const contract = componentContractSchema.parse({
      type: 'button',
      name: 'Button',
      purpose: {
        en: 'Triggers an action.',
        fr: 'Déclenche une action.',
      },
    });

    expect(contract.sizes).toEqual([]);
    expect(contract.tokenBindings).toEqual([]);
  });
  it('rejects an invalid token binding path', () => {
    expect(
      componentContractSchema.safeParse({
        type: 'button',
        name: 'Button',
        purpose: {
          en: 'Triggers an action.',
          fr: 'Déclenche une action.',
        },
        tokenBindings: [
          {
            key: 'background',
            tokenType: 'color',
            tokenPath: '{color.background.default}',
          },
        ],
      }).success,
    ).toBe(false);
  });
});
