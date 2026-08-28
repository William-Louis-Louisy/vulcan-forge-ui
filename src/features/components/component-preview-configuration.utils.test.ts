import { describe, expect, it } from 'vitest';
import type { ComponentContract } from '@/domain/design-system';
import { createComponentContractDraft } from './component-contract-editor.utils';
import {
  createInitialComponentWorkspacePreviewConfiguration,
  resolveComponentWorkspacePreviewConfiguration,
} from './component-preview-configuration.utils';

const contract: ComponentContract = {
  type: 'button',
  name: 'Button',
  purpose: { en: 'Triggers an action.' },
  status: 'ready',
  anatomy: [],
  variants: [
    { key: 'primary', label: { en: 'Primary' } },
    { key: 'secondary', label: { en: 'Secondary' } },
  ],
  sizes: [
    { key: 'sm', label: { en: 'Small' } },
    { key: 'lg', label: { en: 'Large' } },
  ],
  states: [{ key: 'loading', label: { en: 'Loading' } }],
  tokenBindings: [],
  accessibility: [],
  forbiddenPatterns: [],
};

describe('component preview configuration', () => {
  it('starts on the first variant and size with the base state', () => {
    const draft = createComponentContractDraft(contract);
    const configuration =
      createInitialComponentWorkspacePreviewConfiguration(draft);
    const resolved = resolveComponentWorkspacePreviewConfiguration(
      draft,
      configuration,
    );

    expect(resolved.variantKey).toBe('primary');
    expect(resolved.sizeKey).toBe('sm');
    expect(resolved.stateKey).toBe('');
  });

  it('keeps a selected definition stable when its key changes', () => {
    const draft = createComponentContractDraft(contract);
    const selectedVariant = draft.variants[1];
    const selectedSize = draft.sizes[1];
    const selectedState = draft.states[0];

    expect(selectedVariant).toBeDefined();
    expect(selectedSize).toBeDefined();
    expect(selectedState).toBeDefined();

    if (!selectedVariant || !selectedSize || !selectedState) {
      return;
    }

    const configuration = {
      variantDraftId: selectedVariant.draftId,
      sizeDraftId: selectedSize.draftId,
      stateDraftId: selectedState.draftId,
    };

    selectedVariant.key = 'quiet';
    selectedSize.key = 'xl';
    selectedState.key = 'busy';

    const resolved = resolveComponentWorkspacePreviewConfiguration(
      draft,
      configuration,
    );

    expect(resolved.variantDraftId).toBe(selectedVariant.draftId);
    expect(resolved.variantKey).toBe('quiet');
    expect(resolved.sizeDraftId).toBe(selectedSize.draftId);
    expect(resolved.sizeKey).toBe('xl');
    expect(resolved.stateDraftId).toBe(selectedState.draftId);
    expect(resolved.stateKey).toBe('busy');
  });

  it('falls back safely when a selected definition no longer exists', () => {
    const draft = createComponentContractDraft(contract);
    const configuration = {
      variantDraftId: 'missing-variant',
      sizeDraftId: 'missing-size',
      stateDraftId: 'missing-state',
    };

    const resolved = resolveComponentWorkspacePreviewConfiguration(
      draft,
      configuration,
    );

    expect(resolved.variantKey).toBe('primary');
    expect(resolved.sizeKey).toBe('sm');
    expect(resolved.stateKey).toBe('');
  });
});
