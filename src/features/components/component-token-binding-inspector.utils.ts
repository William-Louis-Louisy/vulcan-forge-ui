import type { ComponentContractType, DesignToken } from '@/domain/design-system';
import type { ComponentTokenBindingDraft } from './component-contract-editor.utils';
import {
  componentPreviewStatusTones,
  normalizeComponentPreviewTokenRole,
  type ComponentPreviewStatusTone,
  type ComponentPreviewTokenRole,
  type ComponentTokenOption,
} from './component-token-bindings.utils';
import { getComponentPreviewTokenRoleType } from './component-preview-role-bindings';

export type ComponentTokenBindingResolutionState =
  | 'unassigned'
  | 'missing'
  | 'typeMismatch'
  | 'unresolved'
  | 'deprecated'
  | 'resolved';

export type ComponentTokenBindingInspectorState = {
  previewRole: ComponentPreviewTokenRole | null;
  expectedTokenType: DesignToken['type'] | null;
  token: ComponentTokenOption | null;
  resolutionState: ComponentTokenBindingResolutionState;
  hasRendererEffect: boolean;
};

export function getComponentTokenBindingInspectorState({
  binding,
  tokenOptions,
  componentType,
}: {
  binding: ComponentTokenBindingDraft;
  tokenOptions: ComponentTokenOption[];
  componentType: ComponentContractType;
}): ComponentTokenBindingInspectorState {
  const previewRole = normalizeComponentPreviewTokenRole(binding.key);
  const expectedTokenType = previewRole
    ? getComponentPreviewTokenRoleType(previewRole)
    : null;
  const token =
    tokenOptions.find((candidate) => candidate.path === binding.tokenPath) ?? null;

  return {
    previewRole,
    expectedTokenType,
    token,
    resolutionState: getResolutionState(binding, token),
    hasRendererEffect: isComponentTokenBindingRendered({
      key: binding.key,
      componentType,
    }),
  };
}

export function isComponentTokenBindingRendered({
  key,
  componentType,
}: {
  key: string;
  componentType: ComponentContractType;
}): boolean {
  if (normalizeComponentPreviewTokenRole(key)) {
    return true;
  }

  if (componentType !== 'alert') {
    return false;
  }

  const normalizedKey = key.trim().toLowerCase();

  return componentPreviewStatusTones.includes(
    normalizedKey as ComponentPreviewStatusTone,
  );
}

function getResolutionState(
  binding: ComponentTokenBindingDraft,
  token: ComponentTokenOption | null,
): ComponentTokenBindingResolutionState {
  if (binding.tokenPath.trim().length === 0) {
    return 'unassigned';
  }

  if (!token) {
    return 'missing';
  }

  if (token.type !== binding.tokenType) {
    return 'typeMismatch';
  }

  if (!token.isResolved) {
    return 'unresolved';
  }

  if (token.status === 'deprecated') {
    return 'deprecated';
  }

  return 'resolved';
}
