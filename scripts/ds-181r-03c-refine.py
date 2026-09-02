from pathlib import Path


def replace(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text()
    if old not in text:
        raise RuntimeError(f"Expected snippet not found in {path}: {old[:120]!r}")
    file.write_text(text.replace(old, new, 1))


# Move Button visual authoring into the semantic editor flow so the real page order is
# Naming -> Variants & states -> Visual tokens -> secondary collapsible sections.
replace(
    'src/features/components/ComponentDetailsPanel.tsx',
    "import { ButtonVisualCustomizationEditor } from './ButtonVisualCustomizationEditor';\n",
    '',
)
replace(
    'src/features/components/ComponentDetailsPanel.tsx',
    """        <div className=\"mt-4 min-w-0 sm:mt-5\">\n          {component.templateKey === 'button' ? (\n            <ButtonVisualCustomizationEditor\n              locale={locale}\n              projectSlug={projectSlug}\n              componentKey={component.key}\n              semanticContract={component.contract}\n              contractV2={component.contractV2}\n              tokenOptions={tokenOptions}\n            />\n          ) : null}\n\n          <ComponentContractEditorBoundary\n""",
    """        <div className=\"mt-4 min-w-0 sm:mt-5\">\n          <ComponentContractEditorBoundary\n""",
)
replace(
    'src/features/components/ComponentDetailsPanel.tsx',
    """            contract={component.contract}\n            labels={createComponentContractEditorLabels(t)}\n""",
    """            contract={component.contract}\n            contractV2={component.contractV2}\n            labels={createComponentContractEditorLabels(t)}\n""",
)

replace(
    'src/features/components/ComponentContractEditorBoundary.tsx',
    "import type { ComponentContract } from '@/domain/design-system';",
    "import type { ComponentContract, ComponentContractV2 } from '@/domain/design-system';",
)
replace(
    'src/features/components/ComponentContractEditorBoundary.tsx',
    """  contract: ComponentContract;\n  labels: ComponentContractEditorLabels;\n""",
    """  contract: ComponentContract;\n  contractV2?: ComponentContractV2;\n  labels: ComponentContractEditorLabels;\n""",
)
replace(
    'src/features/components/ComponentContractEditorBoundary.tsx',
    """  contract,\n  labels,\n""",
    """  contract,\n  contractV2,\n  labels,\n""",
)
replace(
    'src/features/components/ComponentContractEditorBoundary.tsx',
    """      contract={contract}\n      labels={labels}\n""",
    """      contract={contract}\n      contractV2={contractV2}\n      labels={labels}\n""",
)

replace(
    'src/features/components/ComponentContractEditor.tsx',
    "import type { ComponentContract } from '@/domain/design-system';",
    "import type { ComponentContract, ComponentContractV2 } from '@/domain/design-system';",
)
replace(
    'src/features/components/ComponentContractEditor.tsx',
    "import { useComponentContractPreview } from './ComponentContractPreviewContext';",
    "import { useComponentContractPreview } from './ComponentContractPreviewContext';\nimport { ButtonVisualCustomizationEditor } from './ButtonVisualCustomizationEditor';",
)
replace(
    'src/features/components/ComponentContractEditor.tsx',
    """  contract: ComponentContract;\n  labels: ComponentContractEditorLabels;\n""",
    """  contract: ComponentContract;\n  contractV2?: ComponentContractV2;\n  labels: ComponentContractEditorLabels;\n""",
)
replace(
    'src/features/components/ComponentContractEditor.tsx',
    """  contract,\n  labels,\n""",
    """  contract,\n  contractV2,\n  labels,\n""",
)
replace(
    'src/features/components/ComponentContractEditor.tsx',
    """        setActiveLocale={setActiveLocale}\n        tokenOptions={tokenOptions}\n      />\n""",
    """        setActiveLocale={setActiveLocale}\n        tokenOptions={tokenOptions}\n        visualEditor={\n          contractV2?.templateKey === 'button' ? (\n            <ButtonVisualCustomizationEditor\n              locale={locale}\n              projectSlug={projectSlug}\n              componentKey={componentKey}\n              semanticContract={contract}\n              contractV2={contractV2}\n              tokenOptions={tokenOptions}\n            />\n          ) : null\n        }\n      />\n""",
)

# Place the visual editor after Variants & states and collapse secondary Button sections.
replace(
    'src/features/components/ComponentContractEditorSections.tsx',
    """  tokenOptions: ComponentTokenOption[];\n};\n""",
    """  tokenOptions: ComponentTokenOption[];\n  visualEditor?: ReactNode;\n};\n""",
)
replace(
    'src/features/components/ComponentContractEditorSections.tsx',
    """  setActiveLocale,\n  tokenOptions,\n}: EditorProps) {\n""",
    """  setActiveLocale,\n  tokenOptions,\n  visualEditor,\n}: EditorProps) {\n""",
)
replace(
    'src/features/components/ComponentContractEditorSections.tsx',
    """      <LocalizedContentSection\n        labels={labels}\n        draft={draft}\n        activeLocale={activeLocale}\n        setActiveLocale={setActiveLocale}\n        setDraft={setDraft}\n      />\n\n      <ComponentAnatomyEditor\n        labels={{\n          ...labels.anatomy,\n          remove: labels.fields.remove,\n        }}\n        activeLocale={activeLocale}\n        draft={draft}\n        setDraft={setDraft}\n      />\n\n      <VariantsSizesStatesSection\n        labels={labels}\n        draft={draft}\n        activeLocale={activeLocale}\n        setDraft={setDraft}\n      />\n\n      <AccessibilitySection\n""",
    """      <VariantsSizesStatesSection\n        labels={labels}\n        draft={draft}\n        activeLocale={activeLocale}\n        setDraft={setDraft}\n      />\n\n      {visualEditor}\n\n      <LocalizedContentSection\n        labels={labels}\n        draft={draft}\n        activeLocale={activeLocale}\n        setActiveLocale={setActiveLocale}\n        setDraft={setDraft}\n      />\n\n      <ComponentAnatomyEditor\n        labels={{\n          ...labels.anatomy,\n          remove: labels.fields.remove,\n        }}\n        activeLocale={activeLocale}\n        draft={draft}\n        setDraft={setDraft}\n        collapsible={draft.type === 'button'}\n      />\n\n      <AccessibilitySection\n""",
)
replace(
    'src/features/components/ComponentContractEditorSections.tsx',
    """    <EditorSection\n      title={labels.localizedContent.title}\n      action={\n""",
    """    <EditorSection\n      title={labels.localizedContent.title}\n      collapsible={draft.type === 'button'}\n      action={\n""",
)
replace(
    'src/features/components/ComponentContractEditorSections.tsx',
    """    <EditorSection\n      title={labels.accessibility.title}\n      action={\n""",
    """    <EditorSection\n      title={labels.accessibility.title}\n      collapsible={draft.type === 'button'}\n      action={\n""",
)
replace(
    'src/features/components/ComponentContractEditorSections.tsx',
    """    <EditorSection\n      title={labels.forbiddenPatterns.title}\n      action={\n""",
    """    <EditorSection\n      title={labels.forbiddenPatterns.title}\n      collapsible={draft.type === 'button'}\n      action={\n""",
)

old_editor_section = """function EditorSection({\n  title,\n  description,\n  action,\n  tone = 'default',\n  children,\n}: {\n  title: string;\n  description?: string;\n  action?: ReactNode;\n  tone?: 'default' | 'danger';\n  children: ReactNode;\n}) {\n  return (\n    <section className=\"min-w-0 pt-5\">\n      <div className=\"flex flex-wrap items-start justify-between gap-3\">\n        <div className=\"min-w-0\">\n          <h3\n            className={[\n              'text-base font-semibold tracking-tight',\n              tone === 'danger' ? 'text-action-danger' : '',\n            ].join(' ')}\n          >\n            {title}\n          </h3>\n          {description ? (\n            <p className=\"text-content-secondary mt-1 max-w-2xl text-xs leading-5\">\n              {description}\n            </p>\n          ) : null}\n        </div>\n        {action}\n      </div>\n      <div className=\"mt-3 min-w-0\">{children}</div>\n    </section>\n  );\n}\n"""
new_editor_section = """function EditorSection({\n  title,\n  description,\n  action,\n  tone = 'default',\n  collapsible = false,\n  children,\n}: {\n  title: string;\n  description?: string;\n  action?: ReactNode;\n  tone?: 'default' | 'danger';\n  collapsible?: boolean;\n  children: ReactNode;\n}) {\n  const titleClassName = [\n    'text-base font-semibold tracking-tight',\n    tone === 'danger' ? 'text-action-danger' : '',\n  ].join(' ');\n\n  if (collapsible) {\n    return (\n      <details className=\"border-border-subtle group min-w-0 border-t pt-4\">\n        <summary className=\"focus-visible:outline-border-focus flex cursor-pointer list-none items-start justify-between gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2\">\n          <div className=\"min-w-0\">\n            <h3 className={titleClassName}>{title}</h3>\n            {description ? (\n              <p className=\"text-content-secondary mt-1 max-w-2xl text-xs leading-5\">\n                {description}\n              </p>\n            ) : null}\n          </div>\n          <span\n            aria-hidden=\"true\"\n            className=\"text-content-tertiary mt-0.5 flex size-6 shrink-0 items-center justify-center text-base transition-transform group-open:rotate-90\"\n          >\n            ›\n          </span>\n        </summary>\n        <div className=\"mt-3 min-w-0\">\n          {action ? <div className=\"mb-3 flex justify-end\">{action}</div> : null}\n          {children}\n        </div>\n      </details>\n    );\n  }\n\n  return (\n    <section className=\"min-w-0 pt-5\">\n      <div className=\"flex flex-wrap items-start justify-between gap-3\">\n        <div className=\"min-w-0\">\n          <h3 className={titleClassName}>{title}</h3>\n          {description ? (\n            <p className=\"text-content-secondary mt-1 max-w-2xl text-xs leading-5\">\n              {description}\n            </p>\n          ) : null}\n        </div>\n        {action}\n      </div>\n      <div className=\"mt-3 min-w-0\">{children}</div>\n    </section>\n  );\n}\n"""
replace('src/features/components/ComponentContractEditorSections.tsx', old_editor_section, new_editor_section)

# Make Anatomy collapsible only when requested by the Button editor flow.
replace(
    'src/features/components/ComponentAnatomyEditor.tsx',
    """  setDraft: (draft: ComponentContractEditorDraft) => void;\n};\n""",
    """  setDraft: (draft: ComponentContractEditorDraft) => void;\n  collapsible?: boolean;\n};\n""",
)
replace(
    'src/features/components/ComponentAnatomyEditor.tsx',
    """  draft,\n  setDraft,\n}: ComponentAnatomyEditorProps) {\n  return (\n""",
    """  draft,\n  setDraft,\n  collapsible = false,\n}: ComponentAnatomyEditorProps) {\n  if (collapsible) {\n    return (\n      <details className=\"border-border-subtle group min-w-0 border-t pt-4\">\n        <summary className=\"focus-visible:outline-border-focus flex cursor-pointer list-none items-start justify-between gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2\">\n          <div className=\"min-w-0\">\n            <h3 className=\"text-base font-semibold tracking-tight\">{labels.title}</h3>\n            <p className=\"text-content-secondary mt-1 text-xs leading-5\">\n              {labels.description}\n            </p>\n          </div>\n          <span\n            aria-hidden=\"true\"\n            className=\"text-content-tertiary mt-0.5 flex size-6 shrink-0 items-center justify-center text-base transition-transform group-open:rotate-90\"\n          >\n            ›\n          </span>\n        </summary>\n\n        <div className=\"mt-3 flex justify-end\">\n          <Button\n            variant=\"secondary\"\n            size=\"sm\"\n            onClick={() =>\n              setDraft({\n                ...draft,\n                anatomy: [...draft.anatomy, createEmptyAnatomyPartDraft()],\n              })\n            }\n          >\n            + {labels.add}\n          </Button>\n        </div>\n        <AnatomyTable labels={labels} activeLocale={activeLocale} draft={draft} setDraft={setDraft} />\n      </details>\n    );\n  }\n\n  return (\n""",
)
# Extract the repeated Anatomy table from the original non-collapsible branch.
old_table = """      <div className=\"border-border-subtle mt-3 min-w-0 overflow-hidden rounded-md border\">\n        <div className=\"bg-background-subtle text-content-tertiary hidden min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_8rem_2rem] gap-2 border-b px-3 py-2 text-[0.6875rem] font-medium md:grid\">\n          <span>{labels.key}</span>\n          <span>{labels.label}</span>\n          <span>{labels.requirement}</span>\n          <span aria-hidden=\"true\" />\n        </div>\n\n        {draft.anatomy.length === 0 ? (\n          <p className=\"text-content-tertiary px-3 py-4 text-xs\">\n            {labels.description}\n          </p>\n        ) : (\n          <div className=\"divide-border-subtle min-w-0 divide-y\">\n            {draft.anatomy.map((part, index) => (\n              <AnatomyPartRow\n                key={`${part.key}-${index}`}\n                rowId={`anatomy-part-${index}`}\n                labels={labels}\n                activeLocale={activeLocale}\n                part={part}\n                onChange={(nextPart) => {\n                  const nextAnatomy = [...draft.anatomy];\n                  nextAnatomy[index] = nextPart;\n                  setDraft({ ...draft, anatomy: nextAnatomy });\n                }}\n                onRemove={() =>\n                  setDraft({\n                    ...draft,\n                    anatomy: draft.anatomy.filter(\n                      (_, itemIndex) => itemIndex !== index,\n                    ),\n                  })\n                }\n              />\n            ))}\n          </div>\n        )}\n      </div>\n"""
replace(
    'src/features/components/ComponentAnatomyEditor.tsx',
    old_table,
    """      <AnatomyTable\n        labels={labels}\n        activeLocale={activeLocale}\n        draft={draft}\n        setDraft={setDraft}\n      />\n""",
)
insert_marker = """}\n\nfunction AnatomyPartRow({\n"""
anatomy_table = """}\n\nfunction AnatomyTable({\n  labels,\n  activeLocale,\n  draft,\n  setDraft,\n}: ComponentAnatomyEditorProps) {\n  return (\n    <div className=\"border-border-subtle mt-3 min-w-0 overflow-hidden rounded-md border\">\n      <div className=\"bg-background-subtle text-content-tertiary hidden min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_8rem_2rem] gap-2 border-b px-3 py-2 text-[0.6875rem] font-medium md:grid\">\n        <span>{labels.key}</span>\n        <span>{labels.label}</span>\n        <span>{labels.requirement}</span>\n        <span aria-hidden=\"true\" />\n      </div>\n\n      {draft.anatomy.length === 0 ? (\n        <p className=\"text-content-tertiary px-3 py-4 text-xs\">\n          {labels.description}\n        </p>\n      ) : (\n        <div className=\"divide-border-subtle min-w-0 divide-y\">\n          {draft.anatomy.map((part, index) => (\n            <AnatomyPartRow\n              key={`${part.key}-${index}`}\n              rowId={`anatomy-part-${index}`}\n              labels={labels}\n              activeLocale={activeLocale}\n              part={part}\n              onChange={(nextPart) => {\n                const nextAnatomy = [...draft.anatomy];\n                nextAnatomy[index] = nextPart;\n                setDraft({ ...draft, anatomy: nextAnatomy });\n              }}\n              onRemove={() =>\n                setDraft({\n                  ...draft,\n                  anatomy: draft.anatomy.filter(\n                    (_, itemIndex) => itemIndex !== index,\n                  ),\n                })\n              }\n            />\n          ))}\n        </div>\n      )}\n    </div>\n  );\n}\n\nfunction AnatomyPartRow({\n"""
replace('src/features/components/ComponentAnatomyEditor.tsx', insert_marker, anatomy_table)

# Button inspector: Fill is core/first; only Stroke and Typography are optional.
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    """import { useTranslations } from 'next-intl';\nimport { Button, Input, SegmentedControl, Select } from '@/components/ui';\n""",
    """import { useTranslations } from 'next-intl';\nimport { CaretDownIcon, PlusIcon } from '@phosphor-icons/react';\nimport { Button, Input, SegmentedControl, Select } from '@/components/ui';\n""",
)
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    "type InspectorOptionalGroupKey = 'fill' | 'border' | 'typography';",
    "type InspectorOptionalGroupKey = 'border' | 'typography';",
)
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    "const optionalGroups = ['fill', 'border', 'typography'] as const;",
    "const optionalGroups = ['border', 'typography'] as const;",
)
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    """  if (\n    target.surface?.background !== undefined ||\n    target.surface?.foreground !== undefined\n  ) {\n    groups.push('fill');\n  }\n\n""",
    '',
)
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    """    if (group === 'fill') {\n      nextDraft = resetButtonVisualProperty(\n        nextDraft,\n        scope,\n        'surface',\n        'background',\n      );\n      nextDraft = resetButtonVisualProperty(\n        nextDraft,\n        scope,\n        'surface',\n        'foreground',\n      );\n    } else if (group === 'border') {\n      nextDraft = resetButtonVisualGroup(nextDraft, scope, 'border');\n    } else {\n""",
    """    if (group === 'border') {\n      nextDraft = resetButtonVisualGroup(nextDraft, scope, 'border');\n    } else {\n""",
)
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    """            className=\"border-border-subtle bg-surface-primary text-content-secondary hover:border-border-default hover:text-content-primary focus-visible:outline-border-focus flex size-8 items-center justify-center rounded-md border text-lg leading-none transition focus-visible:outline-2 focus-visible:outline-offset-2\"\n          >\n            <span aria-hidden=\"true\">+</span>\n""",
    """            className=\"border-border-subtle bg-surface-primary text-content-secondary hover:border-border-default hover:text-content-primary focus-visible:outline-border-focus flex size-8 items-center justify-center rounded-md border transition focus-visible:outline-2 focus-visible:outline-offset-2\"\n          >\n            <PlusIcon aria-hidden=\"true\" size={14} weight=\"bold\" />\n""",
)
old_groups_start = """      <div className=\"border-border-subtle divide-border-subtle divide-y border-t\">\n        <InspectorGroup title={t('groups.dimensions')}>\n"""
new_groups_start = """      <div className=\"border-border-subtle divide-border-subtle divide-y border-t\">\n        <InspectorGroup title={t('groups.fill')}>\n          {fillProperties.map((descriptor) => renderDesignValueField(descriptor))}\n        </InspectorGroup>\n\n        <InspectorGroup title={t('groups.dimensions')}>\n"""
replace('src/features/components/ButtonVisualCustomizationEditor.tsx', old_groups_start, new_groups_start)
fill_optional_block = """\n        {visibleOptionalGroups.includes('fill') ? (\n          <InspectorGroup\n            title={t('groups.fill')}\n            onRemove={() => removeOptionalGroup('fill')}\n            removeLabel={t('removeProperty')}\n          >\n            {fillProperties.map((descriptor) =>\n              renderDesignValueField(descriptor),\n            )}\n          </InspectorGroup>\n        ) : null}\n"""
replace('src/features/components/ButtonVisualCustomizationEditor.tsx', fill_optional_block, '\n')
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    """            <div className=\"grid gap-3 sm:grid-cols-2\">\n""",
    """            <div className=\"grid w-full min-w-0 gap-3 sm:grid-cols-2\">\n""",
)

# Compact Button-specific source selector. Token/value controls retain the richer shared Select.
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    """        <Select\n          id={`${id}-source`}\n          value={source}\n          options={sourceOptions}\n          onValueChange={handleSourceChange}\n          placeholder={labels.source}\n          size=\"sm\"\n        />\n""",
    """        <PropertySourceSelect\n          id={`${id}-source`}\n          value={source}\n          options={sourceOptions}\n          onValueChange={handleSourceChange}\n          ariaLabel={labels.source}\n        />\n""",
)
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    """      <div className=\"grid min-w-0 grid-cols-[minmax(7rem,0.8fr)_minmax(0,1.2fr)_2rem] items-center gap-2\">\n""",
    """      <div className=\"grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_2rem] items-center gap-2\">\n""",
)
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    """          <Select\n            id=\"button-v2-typography-source\"\n            value={source}\n            options={[\n              { value: 'unset', label: labels.unset },\n              ...(typographyTokens.length > 0\n                ? [{ value: 'token', label: labels.token }]\n                : []),\n              { value: 'value', label: labels.explicit },\n            ]}\n            onValueChange={(nextSource) => {\n""",
    """          <PropertySourceSelect\n            id=\"button-v2-typography-source\"\n            value={source}\n            options={[\n              { value: 'unset', label: labels.unset },\n              ...(typographyTokens.length > 0\n                ? [{ value: 'token', label: labels.token }]\n                : []),\n              { value: 'value', label: labels.explicit },\n            ]}\n            onValueChange={(nextSource) => {\n""",
)
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    """            placeholder={labels.source}\n            size=\"sm\"\n          />\n\n          {value?.source === 'token' ? (\n""",
    """            ariaLabel={labels.source}\n          />\n\n          {value?.source === 'token' ? (\n""",
)
# Make the typography source/value grid use intrinsic compact source + fluid value.
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    """        <div className=\"grid min-w-0 gap-2 sm:grid-cols-2\">\n          <PropertySourceSelect\n""",
    """        <div className=\"grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2\">\n          <PropertySourceSelect\n""",
)

property_source_component = """\nfunction PropertySourceSelect({\n  id,\n  value,\n  options,\n  onValueChange,\n  ariaLabel,\n}: {\n  id: string;\n  value: string;\n  options: Array<{ value: string; label: string }>;\n  onValueChange: (value: string) => void;\n  ariaLabel: string;\n}) {\n  return (\n    <div className=\"relative min-w-[6.75rem] max-w-32\">\n      <select\n        id={id}\n        aria-label={ariaLabel}\n        value={value}\n        onChange={(event) => onValueChange(event.target.value)}\n        className=\"border-border-default bg-surface-primary text-content-secondary focus-visible:outline-border-focus h-7 w-full cursor-pointer appearance-none rounded-md border py-0 pr-6 pl-2 text-[0.6875rem] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2\"\n      >\n        {options.map((option) => (\n          <option key={option.value} value={option.value}>\n            {option.label}\n          </option>\n        ))}\n      </select>\n      <CaretDownIcon\n        aria-hidden=\"true\"\n        size={11}\n        className=\"text-content-tertiary pointer-events-none absolute top-1/2 right-2 -translate-y-1/2\"\n      />\n    </div>\n  );\n}\n\n"""
replace(
    'src/features/components/ButtonVisualCustomizationEditor.tsx',
    "\nfunction SimpleSelectProperty({\n",
    property_source_component + "function SimpleSelectProperty({\n",
)

# UI wording: Default is the compact user-facing name for the same sparse/unset state.
replace(
    'src/messages/component-v2-customization-messages.ts',
    "unset: 'Inherit / default',",
    "unset: 'Default',",
)
replace(
    'src/messages/component-v2-customization-messages.ts',
    "unset: 'Inherit / default',",
    "unset: 'Default',",
)

# Update focused tests for Fill ownership/default visibility and compact source wording.
replace(
    'src/features/components/ButtonVisualCustomizationEditor.test.tsx',
    "unset: 'Inherit / default',",
    "unset: 'Default',",
)
replace(
    'src/features/components/ButtonVisualCustomizationEditor.test.tsx',
    """    expect(screen.queryByText('Stroke / Border')).not.toBeInTheDocument();\n\n    await user.click(\n""",
    """    expect(screen.getByText('Fill')).toBeInTheDocument();\n    expect(screen.getByText('Background')).toBeInTheDocument();\n    expect(screen.getByText('Foreground')).toBeInTheDocument();\n    expect(screen.queryByText('Stroke / Border')).not.toBeInTheDocument();\n\n    await user.click(\n""",
)
replace(
    'src/features/components/ButtonVisualCustomizationEditor.test.tsx',
    """    await user.click(\n      screen.getByRole('button', { name: 'Add visual property' }),\n    );\n    await user.click(screen.getByRole('button', { name: 'Stroke / Border' }));\n""",
    """    await user.click(\n      screen.getByRole('button', { name: 'Add visual property' }),\n    );\n    expect(screen.queryByRole('button', { name: 'Fill' })).not.toBeInTheDocument();\n    await user.click(screen.getByRole('button', { name: 'Stroke / Border' }));\n""",
)

# Documentation reflects the refined hierarchy and source vocabulary.
doc = Path('docs/product/ds-181r-03c-button-property-inspector.md')
text = doc.read_text()
text = text.replace(
    """### Core groups\n\nThe following groups remain visible because they are fundamental to Button geometry:\n\n- Dimensions;\n- Spacing;\n- Radius.\n""",
    """### Page hierarchy\n\nFor Button, the authoring order is intentionally dependency-first:\n\n1. Naming / status;\n2. Variants & states;\n3. Visual tokens;\n4. secondary semantic sections.\n\nSecondary sections (localized guidance, anatomy, accessibility, forbidden patterns) are collapsed by default for Button and remain available on demand.\n\n### Core groups\n\nThe following groups remain visible in the inspector, in this order:\n\n- Fill;\n- Dimensions;\n- Spacing;\n- Radius.\n""",
)
text = text.replace(
    """- Fill;\n- Stroke / Border;\n- Typography.\n""",
    """- Stroke / Border;\n- Typography.\n""",
)
text = text.replace(
    """`Fill` owns the V2 `surface.background` and `surface.foreground` values. `Stroke / Border` owns the V2 border group. Typography keeps its canonical V2 typography value.\n""",
    """`Fill` is always visible and owns the V2 `surface.background` and `surface.foreground` values. `Stroke / Border` owns the V2 border group. Typography keeps its canonical V2 typography value.\n""",
)
text = text.replace(
    """- Inherit / default;\n- Token, when compatible tokens exist;\n""",
    """- Default (the UI label for the sparse, inherited/unset state);\n- Token, when compatible tokens exist;\n""",
)
text += """\n## DS-181R-03C refinement after first UX review\n\nThe first real-page UX review tightened the inspector without changing V2 semantics:\n\n- Naming stays first because component identity should be established before customization.\n- Variants & states now precede Visual tokens because those axes define the targets used by visual overrides.\n- Secondary semantic blocks are collapsible for Button to reduce vertical noise.\n- Fill is the first visual group and is always present; it is no longer treated as optional.\n- Stroke / Border and Typography remain progressively addable.\n- The optional-property `+` uses a centered icon rather than a baseline-sensitive text glyph.\n- DesignValue source selection uses a Button-specific compact native select; rich Token selectors remain unchanged.\n- `Default` replaces `Inherit / default` in that compact selector while retaining the exact same sparse inheritance behavior.\n- Independent-corner cells and their value controls use the full grid width available to them.\n"""
doc.write_text(text)
