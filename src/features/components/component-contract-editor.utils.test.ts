import {
  createEmptyStateDraft,
  createEmptyVariantDraft,
  createComponentContractDraft,
  createEmptyAnatomyPartDraft,
  createComponentContractFromDraft,
  createEmptyForbiddenPatternDraft,
  createEmptyAccessibilityRuleDraft,
} from './component-contract-editor.utils';
import { describe, expect, it } from 'vitest';
import type { ComponentContract } from '@/domain/design-system';

const buttonContract: ComponentContract = {
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
      severity: 'critical',
      description: {
        en: 'Buttons must expose an accessible name.',
        fr: 'Les boutons doivent exposer un nom accessible.',
      },
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

describe('component contract editor utils', () => {
  it('normalizes legacy anatomy strings into structured editable parts', () => {
    expect(createComponentContractDraft(buttonContract)).toMatchObject({
      type: 'button',
      name: 'Button',
      status: 'ready',
      purpose: {
        en: 'Triggers an action.',
        fr: 'Déclenche une action.',
      },
      anatomy: [
        {
          key: 'root',
          label: {
            en: 'root',
            fr: '',
          },
          requirement: 'required',
        },
        {
          key: 'label',
          label: {
            en: 'label',
            fr: '',
          },
          requirement: 'required',
        },
      ],
    });
  });

  it('preserves structured anatomy labels and requirements', () => {
    const draft = createComponentContractDraft({
      ...buttonContract,
      anatomy: [
        {
          key: 'icon-leading',
          label: {
            en: 'Leading icon',
            fr: 'Icône de début',
          },
          requirement: 'optional',
        },
      ],
    });

    expect(draft.anatomy).toEqual([
      {
        key: 'icon-leading',
        label: {
          en: 'Leading icon',
          fr: 'Icône de début',
        },
        requirement: 'optional',
      },
    ]);
  });

  it('normalizes missing optional guidelines to empty localized drafts', () => {
    const legacyContract = { ...buttonContract };
    delete legacyContract.usageGuidelines;
    delete legacyContract.contentGuidelines;

    const draft = createComponentContractDraft(legacyContract);

    expect(draft.usageGuidelines).toEqual({ en: '', fr: '' });
    expect(draft.contentGuidelines).toEqual({ en: '', fr: '' });
  });

  it('creates a valid component contract with structured anatomy from a draft', () => {
    const draft = createComponentContractDraft(buttonContract);
    draft.anatomy = [
      {
        key: 'root',
        label: {
          en: 'Root',
          fr: 'Racine',
        },
        requirement: 'required',
      },
    ];

    expect(createComponentContractFromDraft(draft)).toMatchObject({
      status: 'success',
      contract: {
        type: 'button',
        name: 'Button',
        status: 'ready',
        anatomy: [
          {
            key: 'root',
            label: {
              en: 'Root',
              fr: 'Racine',
            },
            requirement: 'required',
          },
        ],
      },
    });
  });

  it('omits empty optional guidelines from the validated contract', () => {
    const draft = createComponentContractDraft(buttonContract);
    draft.usageGuidelines = { en: ' ', fr: '' };
    draft.contentGuidelines = { en: '', fr: ' ' };

    const result = createComponentContractFromDraft(draft);

    expect(result.status).toBe('success');

    if (result.status !== 'success') {
      return;
    }

    expect(result.contract.usageGuidelines).toBeUndefined();
    expect(result.contract.contentGuidelines).toBeUndefined();
  });

  it('returns validation errors when an anatomy key has no localized label', () => {
    const draft = createComponentContractDraft(buttonContract);
    draft.anatomy = [
      {
        key: 'icon-leading',
        label: {
          en: '',
          fr: '',
        },
        requirement: 'optional',
      },
    ];

    expect(createComponentContractFromDraft(draft)).toMatchObject({
      status: 'error',
    });
  });

  it('returns validation errors for invalid drafts', () => {
    const draft = createComponentContractDraft(buttonContract);
    draft.name = '';

    expect(createComponentContractFromDraft(draft)).toMatchObject({
      status: 'error',
    });
  });

  it('creates empty nested draft items', () => {
    expect(createEmptyAnatomyPartDraft()).toEqual({
      key: '',
      label: {
        en: '',
        fr: '',
      },
      requirement: 'optional',
    });
    expect(createEmptyVariantDraft()).toMatchObject({ key: '' });
    expect(createEmptyStateDraft()).toMatchObject({ key: '' });
    expect(createEmptyAccessibilityRuleDraft()).toMatchObject({
      key: '',
      severity: 'warning',
    });
    expect(createEmptyForbiddenPatternDraft()).toEqual({
      en: '',
      fr: '',
    });
  });

  it('creates a draft that preserves sizes and token bindings', () => {
    const draft = createComponentContractDraft({
      ...buttonContract,
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
          key: 'radius',
          tokenType: 'radius',
          tokenPath: 'radius.md',
        },
      ],
    });

    expect(draft.sizes).toEqual([
      {
        key: 'md',
        label: {
          en: 'Medium',
          fr: 'Moyen',
        },
        description: {
          en: '',
          fr: '',
        },
      },
    ]);

    expect(draft.tokenBindings).toEqual([
      {
        key: 'radius',
        tokenType: 'radius',
        tokenPath: 'radius.md',
        description: {
          en: '',
          fr: '',
        },
      },
    ]);
  });

  it('creates a contract from draft that preserves sizes and token bindings', () => {
    const draft = createComponentContractDraft({
      ...buttonContract,
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
          key: 'paddingX',
          tokenType: 'spacing',
          tokenPath: 'spacing.4',
        },
      ],
    });

    const result = createComponentContractFromDraft(draft);

    expect(result.status).toBe('success');

    if (result.status !== 'success') {
      return;
    }

    expect(result.contract.sizes).toEqual([
      {
        key: 'md',
        label: {
          en: 'Medium',
          fr: 'Moyen',
        },
      },
    ]);

    expect(result.contract.tokenBindings).toEqual([
      {
        key: 'paddingX',
        tokenType: 'spacing',
        tokenPath: 'spacing.4',
      },
    ]);
  });
});
