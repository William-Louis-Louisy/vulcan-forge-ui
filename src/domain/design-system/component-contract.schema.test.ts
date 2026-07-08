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
        usageGuidelines: {
          en: 'Use for clear user actions.',
          fr: 'Utiliser pour des actions utilisateur claires.',
        },
        contentGuidelines: {
          en: 'Start labels with a verb.',
          fr: 'Commencer les labels par un verbe.',
        },
        anatomy: [
          {
            key: 'label',
            label: {
              en: 'Label text',
              fr: 'Texte du label',
            },
            requirement: 'required',
          },
          {
            key: 'icon-leading',
            label: {
              en: 'Leading icon',
              fr: 'Icône de début',
            },
            requirement: 'optional',
          },
        ],
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
      anatomy: [
        {
          key: 'label',
          label: {
            en: 'Label text',
            fr: 'Texte du label',
          },
          requirement: 'required',
        },
        {
          key: 'icon-leading',
          label: {
            en: 'Leading icon',
            fr: 'Icône de début',
          },
          requirement: 'optional',
        },
      ],
      usageGuidelines: {
        en: 'Use for clear user actions.',
        fr: 'Utiliser pour des actions utilisateur claires.',
      },
      contentGuidelines: {
        en: 'Start labels with a verb.',
        fr: 'Commencer les labels par un verbe.',
      },
    });
  });

  it('upgrades legacy anatomy strings to structured required parts', () => {
    const contract = componentContractSchema.parse({
      type: 'button',
      name: 'Button',
      purpose: {
        en: 'Triggers an action.',
      },
      anatomy: ['root', 'label'],
    });

    expect(contract.anatomy).toEqual([
      {
        key: 'root',
        label: {
          en: 'root',
        },
        requirement: 'required',
      },
      {
        key: 'label',
        label: {
          en: 'label',
        },
        requirement: 'required',
      },
    ]);
    expect(JSON.parse(JSON.stringify(contract.anatomy))).toEqual(
      contract.anatomy,
    );
  });

  it('keeps guideline fields optional for existing contracts', () => {
    const contract = componentContractSchema.parse({
      type: 'button',
      name: 'Button',
      purpose: {
        en: 'Triggers an action.',
        fr: 'Déclenche une action.',
      },
    });

    expect(contract.usageGuidelines).toBeUndefined();
    expect(contract.contentGuidelines).toBeUndefined();
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

  it('rejects an empty localized guideline when the field is provided', () => {
    expect(
      componentContractSchema.safeParse({
        type: 'button',
        name: 'Button',
        purpose: {
          en: 'Triggers an action.',
        },
        usageGuidelines: {},
      }).success,
    ).toBe(false);
  });

  it('rejects a structured anatomy part without a localized label', () => {
    expect(
      componentContractSchema.safeParse({
        type: 'button',
        name: 'Button',
        purpose: {
          en: 'Triggers an action.',
        },
        anatomy: [
          {
            key: 'label',
            label: {},
            requirement: 'required',
          },
        ],
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
