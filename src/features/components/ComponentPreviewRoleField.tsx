'use client';

import { useState } from 'react';

import { Input, Select, type SelectOption } from '@/components/ui';
import type { DesignToken } from '@/domain/design-system';
import {
  componentPreviewTokenRoles,
  type ComponentPreviewTokenRole,
} from './component-token-bindings.utils';
import type { ComponentTokenBindingDraft } from './component-contract-editor.utils';
import {
  customComponentPreviewTokenRole,
  getComponentPreviewTokenRoleSelection,
  getComponentPreviewTokenRoleType,
  getUsedComponentPreviewTokenRoles,
  type ComponentPreviewTokenRoleSelection,
} from './component-preview-role-bindings';

export type ComponentPreviewRoleFieldLabels = {
  role: string;
  selectRole: string;
  customRole: string;
  customRoleDescription: string;
  customRoleKey: string;
  customRolePlaceholder: string;
  roleAlreadyUsed: string;
  roles: Record<ComponentPreviewTokenRole, string>;
  tokenTypes: Record<DesignToken['type'], string>;
};

type ComponentPreviewRoleFieldProps = {
  binding: ComponentTokenBindingDraft;
  bindings: ComponentTokenBindingDraft[];
  labels: ComponentPreviewRoleFieldLabels;
  onChange: (binding: ComponentTokenBindingDraft) => void;
};

export function ComponentPreviewRoleField({
  binding,
  bindings,
  labels,
  onChange,
}: ComponentPreviewRoleFieldProps) {
  const detectedSelection = getComponentPreviewTokenRoleSelection(binding.key);
  const [isCustomRoleSelected, setIsCustomRoleSelected] = useState(
    detectedSelection === customComponentPreviewTokenRole,
  );
  const selection = isCustomRoleSelected
    ? customComponentPreviewTokenRole
    : detectedSelection;
  const roleMode =
    selection === customComponentPreviewTokenRole
      ? 'custom'
      : selection
        ? 'official'
        : 'unselected';
  const usedRoles = getUsedComponentPreviewTokenRoles(
    bindings,
    binding.draftId,
  );
  const options: SelectOption<ComponentPreviewTokenRoleSelection>[] = [
    ...componentPreviewTokenRoles.map((role) => {
      const tokenType = getComponentPreviewTokenRoleType(role);
      const isUsed = usedRoles.has(role);
      const metadata = `${role} · ${labels.tokenTypes[tokenType]}`;

      return {
        value: role,
        label: labels.roles[role],
        description: isUsed
          ? `${metadata} · ${labels.roleAlreadyUsed}`
          : metadata,
        disabled: isUsed,
      };
    }),
    {
      value: customComponentPreviewTokenRole,
      label: labels.customRole,
      description: labels.customRoleDescription,
    },
  ];

  function handleSelectionChange(
    nextSelection: ComponentPreviewTokenRoleSelection,
  ) {
    if (nextSelection === customComponentPreviewTokenRole) {
      setIsCustomRoleSelected(true);
      onChange({
        ...binding,
        key:
          detectedSelection === customComponentPreviewTokenRole
            ? binding.key
            : '',
      });
      return;
    }

    if (!nextSelection) {
      return;
    }

    setIsCustomRoleSelected(false);
    const tokenType = getComponentPreviewTokenRoleType(nextSelection);

    onChange({
      ...binding,
      key: nextSelection,
      tokenType,
      tokenPath: binding.tokenType === tokenType ? binding.tokenPath : '',
    });
  }

  return (
    <div
      data-mode={roleMode}
      className="component-preview-role-field grid min-w-0 gap-2"
    >
      <div className="grid min-w-0 gap-1.5">
        <label
          htmlFor={`token-binding-role-${binding.draftId}`}
          className="text-content-secondary text-xs font-semibold"
        >
          {labels.role}
        </label>
        <Select<ComponentPreviewTokenRoleSelection>
          id={`token-binding-role-${binding.draftId}`}
          value={selection}
          options={options}
          onValueChange={handleSelectionChange}
          placeholder={labels.selectRole}
          size="sm"
          textMode="technical"
        />
      </div>

      {selection === customComponentPreviewTokenRole ? (
        <label className="grid min-w-0 gap-1.5">
          <span className="text-content-secondary text-xs font-semibold">
            {labels.customRoleKey}
          </span>
          <Input
            value={binding.key}
            onChange={(event) =>
              onChange({ ...binding, key: event.currentTarget.value })
            }
            placeholder={labels.customRolePlaceholder}
            size="sm"
            textMode="technical"
          />
        </label>
      ) : null}
    </div>
  );
}
