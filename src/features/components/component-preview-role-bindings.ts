import type { DesignToken } from '@/domain/design-system';
import {
  componentPreviewTokenRoles,
  normalizeComponentPreviewTokenRole,
  type ComponentPreviewTokenRole,
} from './component-token-bindings.utils';

export const customComponentPreviewTokenRole = 'custom' as const;

export type ComponentPreviewTokenRoleSelection =
  | ComponentPreviewTokenRole
  | typeof customComponentPreviewTokenRole
  | '';

export const componentPreviewTokenRoleTypes = {
  background: 'color',
  foreground: 'color',
  border: 'color',
  radius: 'radius',
  padding: 'spacing',
  paddingX: 'spacing',
  paddingY: 'spacing',
  duration: 'motion',
  motion: 'motion',
} as const satisfies Record<ComponentPreviewTokenRole, DesignToken['type']>;

export function getComponentPreviewTokenRoleType(
  role: ComponentPreviewTokenRole,
): DesignToken['type'] {
  return componentPreviewTokenRoleTypes[role];
}

export function getComponentPreviewTokenRoleSelection(
  key: string,
): ComponentPreviewTokenRoleSelection {
  if (key.trim().length === 0) {
    return '';
  }

  return (
    normalizeComponentPreviewTokenRole(key) ?? customComponentPreviewTokenRole
  );
}

export function getUsedComponentPreviewTokenRoles(
  bindings: ReadonlyArray<{ draftId: string; key: string }>,
  excludedDraftId?: string,
): Set<ComponentPreviewTokenRole> {
  const roles = new Set<ComponentPreviewTokenRole>();

  for (const binding of bindings) {
    if (binding.draftId === excludedDraftId) {
      continue;
    }

    const role = normalizeComponentPreviewTokenRole(binding.key);

    if (role) {
      roles.add(role);
    }
  }

  return roles;
}

export function getFirstAvailableComponentPreviewTokenRole(
  bindings: ReadonlyArray<{ draftId: string; key: string }>,
): ComponentPreviewTokenRole | null {
  const usedRoles = getUsedComponentPreviewTokenRoles(bindings);

  return (
    componentPreviewTokenRoles.find((role) => !usedRoles.has(role)) ?? null
  );
}
