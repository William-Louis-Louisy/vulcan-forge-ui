import { describe, expect, it } from 'vitest';
import type { ComponentContract } from '@/domain/design-system';
import {
  createComponentContractDraft,
  createComponentContractFromDraft,
  createEmptyAccessibilityRuleDraft,
  createEmptyForbiddenPatternDraft,
  createEmptyStateDraft,
  createEmptyVariantDraft,
} from './component-contract-editor.utils';

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
};

describe('component contract editor utils', () => {
  it('creates an editable draft from a component contract', () => {
    expect(createComponentContractDraft(buttonContract)).toMatchObject({
      type: 'button',
      name: 'Button',
      status: 'ready',
      purpose: {
        en: 'Triggers an action.',
        fr: 'Déclenche une action.',
      },
      anatomy: ['root', 'label'],
    });
  });

  it('creates a valid component contract from a draft', () => {
    const draft = createComponentContractDraft(buttonContract);

    expect(createComponentContractFromDraft(draft)).toMatchObject({
      status: 'success',
      contract: {
        type: 'button',
        name: 'Button',
        status: 'ready',
      },
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
});
