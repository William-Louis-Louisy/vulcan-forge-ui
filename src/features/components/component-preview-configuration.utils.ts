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
