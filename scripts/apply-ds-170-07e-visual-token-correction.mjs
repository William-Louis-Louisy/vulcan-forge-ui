import { readFileSync, writeFileSync } from 'node:fs';

function read(path) {
  return readFileSync(path, 'utf8');
}

function write(path, content) {
  writeFileSync(path, content, 'utf8');
}

function replaceOnce(path, source, target, label) {
  const content = read(path);
  const occurrences = content.split(source).length - 1;

  if (occurrences !== 1) {
    throw new Error(
      `${label}: expected exactly one occurrence in ${path}, found ${occurrences}`,
    );
  }

  write(path, content.replace(source, target));
}

const selectPath = 'src/components/ui/Select.tsx';
replaceOnce(
  selectPath,
  `  textMode?: SelectTextMode;\n  className?: string;`,
  `  textMode?: SelectTextMode;\n  showSelectedDescription?: boolean;\n  className?: string;`,
  'add Select selected-description option',
);
replaceOnce(
  selectPath,
  `  textMode = 'default',\n  className,`,
  `  textMode = 'default',\n  showSelectedDescription = true,\n  className,`,
  'default Select selected-description option',
);
replaceOnce(
  selectPath,
  `{selectedOption?.description ? (`,
  `{showSelectedDescription && selectedOption?.description ? (`,
  'conditionally render the selected description',
);

const selectTestPath = 'src/components/ui/Select.test.tsx';
replaceOnce(
  selectTestPath,
  `function SelectFixture({ disabled = false }: { disabled?: boolean }) {`,
  `function SelectFixture({\n  disabled = false,\n  showSelectedDescription = true,\n}: {\n  disabled?: boolean;\n  showSelectedDescription?: boolean;\n}) {`,
  'extend Select fixture props',
);
replaceOnce(
  selectTestPath,
  `        disabled={disabled}\n        onValueChange={setValue}`,
  `        disabled={disabled}\n        showSelectedDescription={showSelectedDescription}\n        onValueChange={setValue}`,
  'forward selected-description option',
);
replaceOnce(
  selectTestPath,
  `  it('supports a disabled state', () => {`,
  `  it('can keep option metadata while hiding it from the selected value', async () => {\n    const user = userEvent.setup();\n\n    render(<SelectFixture showSelectedDescription={false} />);\n\n    const combobox = screen.getByRole('combobox', { name: 'Choose token' });\n    expect(combobox).not.toHaveTextContent('#f7f3eb');\n\n    await user.click(combobox);\n\n    expect(\n      screen.getByRole('option', {\n        name: 'color.semantic.background.app #f7f3eb',\n      }),\n    ).toBeInTheDocument();\n  });\n\n  it('supports a disabled state', () => {`,
  'cover compact selected values',
);

const roleFieldPath =
  'src/features/components/ComponentPreviewRoleField.tsx';
write(
  roleFieldPath,
  `'use client';\n\nimport { Input, Select, type SelectOption } from '@/components/ui';\nimport type { DesignToken } from '@/domain/design-system';\nimport {\n  componentPreviewTokenRoles,\n  type ComponentPreviewTokenRole,\n} from './component-token-bindings.utils';\nimport type { ComponentTokenBindingDraft } from './component-contract-editor.utils';\nimport {\n  customComponentPreviewTokenRole,\n  getComponentPreviewTokenRoleType,\n  getUsedComponentPreviewTokenRoles,\n  type ComponentPreviewTokenRoleSelection,\n} from './component-preview-role-bindings';\n\nexport type ComponentPreviewRoleFieldLabels = {\n  role: string;\n  selectRole: string;\n  customRole: string;\n  customRoleDescription: string;\n  customRoleKey: string;\n  customRolePlaceholder: string;\n  roleAlreadyUsed: string;\n  roles: Record<ComponentPreviewTokenRole, string>;\n  tokenTypes: Record<DesignToken['type'], string>;\n};\n\ntype ComponentPreviewRoleFieldProps = {\n  binding: ComponentTokenBindingDraft;\n  bindings: ComponentTokenBindingDraft[];\n  labels: ComponentPreviewRoleFieldLabels;\n  selection: ComponentPreviewTokenRoleSelection;\n  onSelectionChange: (selection: ComponentPreviewTokenRoleSelection) => void;\n  onChange: (binding: ComponentTokenBindingDraft) => void;\n};\n\nexport function ComponentPreviewRoleField({\n  binding,\n  bindings,\n  labels,\n  selection,\n  onSelectionChange,\n  onChange,\n}: ComponentPreviewRoleFieldProps) {\n  const roleMode =\n    selection === customComponentPreviewTokenRole\n      ? 'custom'\n      : selection\n        ? 'official'\n        : 'unselected';\n  const usedRoles = getUsedComponentPreviewTokenRoles(\n    bindings,\n    binding.draftId,\n  );\n  const options: SelectOption<ComponentPreviewTokenRoleSelection>[] = [\n    ...componentPreviewTokenRoles.map((role) => {\n      const tokenType = getComponentPreviewTokenRoleType(role);\n      const isUsed = usedRoles.has(role);\n      const metadata = \`${'${role}'} · ${'${labels.tokenTypes[tokenType]}'}\`;\n\n      return {\n        value: role,\n        label: labels.roles[role],\n        description: isUsed\n          ? \`${'${metadata}'} · ${'${labels.roleAlreadyUsed}'}\`\n          : metadata,\n        disabled: isUsed,\n      };\n    }),\n    {\n      value: customComponentPreviewTokenRole,\n      label: labels.customRole,\n      description: labels.customRoleDescription,\n    },\n  ];\n\n  function handleSelectionChange(\n    nextSelection: ComponentPreviewTokenRoleSelection,\n  ) {\n    if (nextSelection === customComponentPreviewTokenRole) {\n      onSelectionChange(nextSelection);\n      onChange({\n        ...binding,\n        key:\n          selection === customComponentPreviewTokenRole ? binding.key : '',\n      });\n      return;\n    }\n\n    if (!nextSelection) {\n      return;\n    }\n\n    onSelectionChange(nextSelection);\n    const tokenType = getComponentPreviewTokenRoleType(nextSelection);\n\n    onChange({\n      ...binding,\n      key: nextSelection,\n      tokenType,\n      tokenPath: binding.tokenType === tokenType ? binding.tokenPath : '',\n    });\n  }\n\n  return (\n    <div\n      data-mode={roleMode}\n      className="component-preview-role-field grid min-w-0 gap-2"\n    >\n      <div className="grid min-w-0 gap-1.5">\n        <label\n          htmlFor={\`token-binding-role-${'${binding.draftId}'}\`}\n          className="text-content-secondary text-xs font-semibold"\n        >\n          {labels.role}\n        </label>\n        <Select<ComponentPreviewTokenRoleSelection>\n          id={\`token-binding-role-${'${binding.draftId}'}\`}\n          value={selection}\n          options={options}\n          onValueChange={handleSelectionChange}\n          placeholder={labels.selectRole}\n          size="sm"\n          textMode="technical"\n          showSelectedDescription={false}\n        />\n      </div>\n\n      {selection === customComponentPreviewTokenRole ? (\n        <label className="grid min-w-0 gap-1.5">\n          <span className="text-content-secondary text-xs font-semibold">\n            {labels.customRoleKey}\n          </span>\n          <Input\n            value={binding.key}\n            onChange={(event) =>\n              onChange({ ...binding, key: event.currentTarget.value })\n            }\n            placeholder={labels.customRolePlaceholder}\n            size="sm"\n            textMode="technical"\n          />\n        </label>\n      ) : null}\n    </div>\n  );\n}\n`,
);

const sectionsPath =
  'src/features/components/ComponentContractEditorSections.tsx';
replaceOnce(
  sectionsPath,
  `import type { CSSProperties, ReactNode } from 'react';`,
  `import { useState, type CSSProperties, type ReactNode } from 'react';`,
  'import React state for controlled role selection',
);
replaceOnce(
  sectionsPath,
  `import {\n  normalizeComponentPreviewTokenRole,\n  type ComponentTokenOption,\n} from './component-token-bindings.utils';`,
  `import type { ComponentTokenOption } from './component-token-bindings.utils';`,
  'remove key-based role normalization from the row',
);
replaceOnce(
  sectionsPath,
  `import {\n  getComponentPreviewTokenRoleType,\n  getFirstAvailableComponentPreviewTokenRole,\n} from './component-preview-role-bindings';`,
  `import {\n  customComponentPreviewTokenRole,\n  getComponentPreviewTokenRoleSelection,\n  getComponentPreviewTokenRoleType,\n  getFirstAvailableComponentPreviewTokenRole,\n  type ComponentPreviewTokenRoleSelection,\n} from './component-preview-role-bindings';`,
  'import controlled role-selection helpers',
);
replaceOnce(
  sectionsPath,
  `  const previewRole = normalizeComponentPreviewTokenRole(binding.key);\n  const constrainedTokenType = previewRole\n    ? getComponentPreviewTokenRoleType(previewRole)\n    : null;`,
  `  const [roleSelection, setRoleSelection] =\n    useState<ComponentPreviewTokenRoleSelection>(() =>\n      getComponentPreviewTokenRoleSelection(binding.key),\n    );\n  const previewRole =\n    roleSelection && roleSelection !== customComponentPreviewTokenRole\n      ? roleSelection\n      : null;\n  const constrainedTokenType = previewRole\n    ? getComponentPreviewTokenRoleType(previewRole)\n    : null;`,
  'derive constraints from the selected authoring mode',
);
replaceOnce(
  sectionsPath,
  `          binding={binding}\n          bindings={bindings}\n          onChange={onChange}`,
  `          binding={binding}\n          bindings={bindings}\n          selection={roleSelection}\n          onSelectionChange={setRoleSelection}\n          onChange={onChange}`,
  'control the role field from its binding row',
);

const globalsPath = 'src/app/globals.css';
replaceOnce(
  globalsPath,
  `  /* Keep preview-role metadata in the option list without making the trigger taller. */\n  .component-preview-role-field button[role='combobox'] > span > span + span {\n    display: none;\n  }\n\n  /* Official preview roles already define their token type. */\n  .component-preview-role-field[data-mode='official'] + div {\n    display: none;\n  }\n\n`,
  ``,
  'remove Visual Tokens DOM-coupled CSS',
);

const editorTestPath =
  'src/features/components/ComponentContractEditor.test.tsx';
replaceOnce(
  editorTestPath,
  `    expect(\n      screen.getByRole('combobox', { name: 'Preview role' }),\n    ).toHaveTextContent('Background');\n    expect(screen.getByLabelText('Token type')).toHaveTextContent('Color');`,
  `    const roleSelect = screen.getByRole('combobox', {\n      name: 'Preview role',\n    });\n    expect(roleSelect).toHaveTextContent('Background');\n    expect(roleSelect).not.toHaveTextContent('background · Color');\n    expect(screen.getByLabelText('Token type')).toHaveTextContent('Color');`,
  'verify the role trigger remains compact',
);
replaceOnce(
  editorTestPath,
  `    expect(screen.getByLabelText('Token type')).toHaveTextContent('Typography');\n  });\n});`,
  `    expect(screen.getByLabelText('Token type')).toHaveTextContent('Typography');\n  });\n\n  it('keeps token-type authoring available when a custom key matches an alias', async () => {\n    const user = userEvent.setup();\n\n    render(\n      <ComponentContractEditor\n        locale="en"\n        projectSlug="demo"\n        contract={contract}\n        labels={labels}\n        tokenOptions={tokenOptions}\n      />,\n    );\n\n    await user.click(screen.getByRole('button', { name: /Add visual token/ }));\n    await user.click(screen.getByRole('combobox', { name: 'Preview role' }));\n    await user.click(\n      screen.getByRole('option', {\n        name: /Custom role \\(advanced\\) Use an arbitrary role key/,\n      }),\n    );\n    await user.type(screen.getByLabelText('Custom role key'), 'color');\n\n    expect(screen.getByLabelText('Token type')).toBeEnabled();\n\n    await user.click(screen.getByLabelText('Token type'));\n    await user.click(screen.getByRole('option', { name: 'Typography' }));\n\n    expect(screen.getByLabelText('Token type')).toHaveTextContent('Typography');\n  });\n});`,
  'cover custom keys that collide with preview aliases',
);

console.log('DS-170-07E Visual Tokens correction applied.');
