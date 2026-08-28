import type { ComponentContractEditorDraft } from './component-contract-editor.utils';

export type ComponentWorkspacePreviewConfiguration = {
  variantDraftId: string | null;
  sizeDraftId: string | null;
  stateDraftId: string | null;
};

export type ResolvedComponentWorkspacePreviewConfiguration = {
  variantDraftId: string | null;
  variantKey: string;
  sizeDraftId: string | null;
  sizeKey: string;
  stateDraftId: string | null;
  stateKey: string;
};

export type ComponentWorkspacePreviewAxisDefinition = {
  draftId: string;
  key: string;
};

export type ComponentWorkspacePreviewAxes = {
  variants: ComponentWorkspacePreviewAxisDefinition[];
  sizes: ComponentWorkspacePreviewAxisDefinition[];
  states: ComponentWorkspacePreviewAxisDefinition[];
};

const fallbackVariantKey = 'default';
const fallbackSizeKey = 'md';

export function createInitialComponentWorkspacePreviewConfiguration(
  draft: ComponentContractEditorDraft,
): ComponentWorkspacePreviewConfiguration {
  return {
    variantDraftId: draft.variants[0]?.draftId ?? null,
    sizeDraftId: draft.sizes[0]?.draftId ?? null,
    stateDraftId: null,
  };
}

export function createComponentWorkspacePreviewAxes(
  draft: ComponentContractEditorDraft,
): ComponentWorkspacePreviewAxes {
  return {
    variants: createPreviewAxis(draft.variants),
    sizes: createPreviewAxis(draft.sizes),
    states: createPreviewAxis(draft.states),
  };
}

export function resolveComponentWorkspacePreviewConfiguration(
  draft: ComponentContractEditorDraft,
  configuration: ComponentWorkspacePreviewConfiguration,
): ResolvedComponentWorkspacePreviewConfiguration {
  const variant =
    draft.variants.find(
      (candidate) => candidate.draftId === configuration.variantDraftId,
    ) ?? draft.variants[0];
  const size =
    draft.sizes.find(
      (candidate) => candidate.draftId === configuration.sizeDraftId,
    ) ?? draft.sizes[0];
  const state =
    configuration.stateDraftId === null
      ? undefined
      : draft.states.find(
          (candidate) => candidate.draftId === configuration.stateDraftId,
        );

  return {
    variantDraftId: variant?.draftId ?? null,
    variantKey: variant?.key.trim() || fallbackVariantKey,
    sizeDraftId: size?.draftId ?? null,
    sizeKey: size?.key.trim() || fallbackSizeKey,
    stateDraftId: state?.draftId ?? null,
    stateKey: state?.key.trim() || '',
  };
}

function createPreviewAxis(
  items: Array<{
    draftId: string;
    key: string;
  }>,
): ComponentWorkspacePreviewAxisDefinition[] {
  return items
    .filter((item) => item.key.trim().length > 0)
    .map((item) => ({
      draftId: item.draftId,
      key: item.key.trim(),
    }));
}
