'use client';

import { Button, Input, Select, Textarea } from '@/components/ui';
import {
  createEmptySizeDraft,
  createEmptyStateDraft,
  createEmptyVariantDraft,
  createEmptyTokenBindingDraft,
  createEmptyForbiddenPatternDraft,
  createEmptyAccessibilityRuleDraft,
  type ComponentSizeDraft,
  type LocalizedTextDraft,
  type ComponentStateDraft,
  type ComponentVariantDraft,
  type ComponentContractEditorDraft,
  type ComponentAccessibilityRuleDraft,
} from './component-contract-editor.utils';
import type { CSSProperties, ReactNode } from 'react';
import { ComponentAnatomyEditor } from './ComponentAnatomyEditor';
import type { ComponentTokenOption } from './component-token-bindings.utils';
import { getComponentTokenBindingInspectorState } from './component-token-binding-inspector.utils';
import {
  getComponentPreviewTokenRoleType,
  getFirstAvailableComponentPreviewTokenRole,
} from './component-preview-role-bindings';

export type ComponentContractEditorLabels = {
  title: string;
  description: string;
  unsavedNotice: string;
  validationTitle: string;
  basics: {
    title: string;
    name: string;
    status: string;
  };
  anatomy: {
    title: string;
    description: string;
    add: string;
    key: string;
    label: string;
    requirement: string;
    requirements: {
      required: string;
      optional: string;
      derived: string;
    };
  };
  collections: {
    title: string;
    editDetails: string;
  };
  variants: {
    title: string;
    axis: string;
    add: string;
  };
  sizes: {
    title: string;
    axis: string;
    add: string;
  };
  states: {
    title: string;
    axis: string;
    add: string;
  };
  accessibility: {
    title: string;
    add: string;
    severity: string;
  };
  forbiddenPatterns: {
    title: string;
    add: string;
  };
  fields: {
    key: string;
    labelEn: string;
    labelFr: string;
    descriptionEn: string;
    descriptionFr: string;
    patternEn: string;
    patternFr: string;
    remove: string;
  };
  statuses: {
    draft: string;
    ready: string;
    deprecated: string;
  };
  severities: {
    info: string;
    warning: string;
    critical: string;
  };
  save: {
    action: string;
    saving: string;
    saved: string;
    unsaved: string;
    invalid: string;
    errors: {
      unauthorized: string;
      projectNotFound: string;
      componentContractNotFound: string;
      invalidPayload: string;
      invalidContract: string;
      unexpected: string;
    };
  };
  localizedContent: {
    title: string;
    editing: string;
    purpose: string;
    usageGuidelines: string;
    contentGuidelines: string;
    locales: {
      en: string;
      fr: string;
    };
  };
  metadata: {
    title: string;
  };
  visualTokens: {
    title: string;
    description: string;
    add: string;
    inspectBinding: string;
    scope: string;
    componentScope: string;
    role: string;
    selectRole: string;
    customRole: string;
    customRoleDescription: string;
    customRoleKey: string;
    customRolePlaceholder: string;
    roleAlreadyUsed: string;
    roles: {
      background: string;
      foreground: string;
      border: string;
      radius: string;
      padding: string;
      paddingX: string;
      paddingY: string;
      duration: string;
      motion: string;
    };
    tokenType: string;
    tokenPath: string;
    selectToken: string;
    resolvedValue: string;
    tokenStatus: string;
    previewEffect: string;
    previewEffectActive: string;
    previewEffectUnavailable: string;
    diagnostics: {
      title: string;
      unassigned: string;
      missing: string;
      typeMismatch: string;
      unresolved: string;
      deprecated: string;
      resolved: string;
      expectedType: string;
      actualType: string;
    };
    tokenTypes: {
      color: string;
      spacing: string;
      radius: string;
      typography: string;
      motion: string;
    };
  };
};

type EditorProps = {
  labels: ComponentContractEditorLabels;
  draft: ComponentContractEditorDraft;
  setDraft: (draft: ComponentContractEditorDraft) => void;
  activeLocale: 'en' | 'fr';
  setActiveLocale: (locale: 'en' | 'fr') => void;
  tokenOptions: ComponentTokenOption[];
};

type ComponentContractEditorSectionsProps = EditorProps & {
  onSelectTokenBinding: (draftId: string) => void;
};

export function ComponentContractEditorSections({
  labels,
  draft,
  setDraft,
  activeLocale,
  setActiveLocale,
  tokenOptions,
  onSelectTokenBinding,
}: ComponentContractEditorSectionsProps) {
  return (
    <div className="grid min-w-0 gap-6">
      <MetadataEditor labels={labels} draft={draft} setDraft={setDraft} />

      <LocalizedContentSection
        labels={labels}
        draft={draft}
        activeLocale={activeLocale}
        setActiveLocale={setActiveLocale}
        setDraft={setDraft}
      />

      <ComponentAnatomyEditor
        labels={{
          ...labels.anatomy,
          remove: labels.fields.remove,
        }}
        activeLocale={activeLocale}
        draft={draft}
        setDraft={setDraft}
      />

      <VariantsSizesStatesSection
        labels={labels}
        draft={draft}
        activeLocale={activeLocale}
        setDraft={setDraft}
      />

      <AccessibilitySection
        labels={labels}
        draft={draft}
        activeLocale={activeLocale}
        setDraft={setDraft}
      />

      <ForbiddenPatternsSection
        labels={labels}
        draft={draft}
        activeLocale={activeLocale}
        setDraft={setDraft}
      />

      <VisualTokensSection
        labels={labels}
        draft={draft}
        setDraft={setDraft}
        tokenOptions={tokenOptions}
        onSelectTokenBinding={onSelectTokenBinding}
      />
    </div>
  );
}

function MetadataEditor({
  labels,
  draft,
  setDraft,
}: Pick<EditorProps, 'labels' | 'draft' | 'setDraft'>) {
  return (
    <section
      aria-label={labels.metadata.title}
      className="border-border-subtle grid min-w-0 gap-3 border-b pb-5 sm:grid-cols-[minmax(0,1fr)_11rem]"
    >
      <CompactInput
        label={labels.basics.name}
        value={draft.name}
        onChange={(name) => setDraft({ ...draft, name })}
      />

      <div className="grid min-w-0 gap-1.5">
        <label
          htmlFor="component-contract-status"
          className="text-content-secondary text-xs font-semibold"
        >
          {labels.basics.status}
        </label>
        <Select<ComponentContractEditorDraft['status']>
          id="component-contract-status"
          value={draft.status}
          options={[
            { value: 'draft', label: labels.statuses.draft },
            { value: 'ready', label: labels.statuses.ready },
            { value: 'deprecated', label: labels.statuses.deprecated },
          ]}
          onValueChange={(status) => setDraft({ ...draft, status })}
          placeholder={labels.basics.status}
          size="sm"
        />
      </div>
    </section>
  );
}

function LocalizedContentSection({
  labels,
  draft,
  activeLocale,
  setActiveLocale,
  setDraft,
}: Omit<EditorProps, 'tokenOptions'>) {
  const localeLabel = labels.localizedContent.locales[activeLocale];

  return (
    <EditorSection
      title={labels.localizedContent.title}
      action={
        <LocaleControl
          labels={labels}
          activeLocale={activeLocale}
          setActiveLocale={setActiveLocale}
        />
      }
    >
      <div className="grid gap-3">
        <CompactTextarea
          label={`${labels.localizedContent.purpose} · ${localeLabel}`}
          value={draft.purpose[activeLocale]}
          rows={2}
          onChange={(value) =>
            setDraft({
              ...draft,
              purpose: updateLocalizedText(draft.purpose, activeLocale, value),
            })
          }
        />

        <CompactTextarea
          label={`${labels.localizedContent.usageGuidelines} · ${localeLabel}`}
          value={draft.usageGuidelines[activeLocale]}
          rows={2}
          onChange={(value) =>
            setDraft({
              ...draft,
              usageGuidelines: updateLocalizedText(
                draft.usageGuidelines,
                activeLocale,
                value,
              ),
            })
          }
        />

        <CompactTextarea
          label={`${labels.localizedContent.contentGuidelines} · ${localeLabel}`}
          value={draft.contentGuidelines[activeLocale]}
          rows={2}
          onChange={(value) =>
            setDraft({
              ...draft,
              contentGuidelines: updateLocalizedText(
                draft.contentGuidelines,
                activeLocale,
                value,
              ),
            })
          }
        />
      </div>
    </EditorSection>
  );
}

function LocaleControl({
  labels,
  activeLocale,
  setActiveLocale,
}: Pick<EditorProps, 'labels' | 'activeLocale' | 'setActiveLocale'>) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-content-tertiary hidden text-xs sm:inline">
        {labels.localizedContent.editing}
      </span>
      <div
        role="group"
        aria-label={labels.localizedContent.editing}
        className="border-border-subtle bg-surface-primary inline-flex rounded-md border p-0.5"
      >
        {(['fr', 'en'] as const).map((localeOption) => {
          const isActive = localeOption === activeLocale;

          return (
            <button
              key={localeOption}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveLocale(localeOption)}
              className={[
                'rounded-sm px-2.5 py-1 font-mono text-[0.6875rem] font-semibold transition',
                isActive
                  ? 'bg-content-primary text-background-app'
                  : 'text-content-secondary hover:text-content-primary',
              ].join(' ')}
            >
              {labels.localizedContent.locales[localeOption]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VariantsSizesStatesSection({
  labels,
  draft,
  activeLocale,
  setDraft,
}: Omit<EditorProps, 'setActiveLocale' | 'tokenOptions'>) {
  return (
    <EditorSection title={labels.collections.title}>
      <div className="grid gap-4">
        <TagCollectionRow
          axisLabel={labels.variants.axis}
          addLabel={labels.variants.add}
          editDetailsLabel={labels.collections.editDetails}
          labels={labels}
          activeLocale={activeLocale}
          items={draft.variants}
          onAdd={() =>
            setDraft({
              ...draft,
              variants: [...draft.variants, createEmptyVariantDraft()],
            })
          }
          onChange={(variants) => setDraft({ ...draft, variants })}
        />

        <TagCollectionRow
          axisLabel={labels.sizes.axis}
          addLabel={labels.sizes.add}
          editDetailsLabel={labels.collections.editDetails}
          labels={labels}
          activeLocale={activeLocale}
          items={draft.sizes}
          onAdd={() =>
            setDraft({
              ...draft,
              sizes: [...draft.sizes, createEmptySizeDraft()],
            })
          }
          onChange={(sizes) => setDraft({ ...draft, sizes })}
        />

        <TagCollectionRow
          axisLabel={labels.states.axis}
          addLabel={labels.states.add}
          editDetailsLabel={labels.collections.editDetails}
          labels={labels}
          activeLocale={activeLocale}
          items={draft.states}
          onAdd={() =>
            setDraft({
              ...draft,
              states: [...draft.states, createEmptyStateDraft()],
            })
          }
          onChange={(states) => setDraft({ ...draft, states })}
        />
      </div>
    </EditorSection>
  );
}

type CollectionItem =
  | ComponentVariantDraft
  | ComponentSizeDraft
  | ComponentStateDraft;

function TagCollectionRow<Item extends CollectionItem>({
  axisLabel,
  addLabel,
  editDetailsLabel,
  labels,
  activeLocale,
  items,
  onAdd,
  onChange,
}: {
  axisLabel: string;
  addLabel: string;
  editDetailsLabel: string;
  labels: ComponentContractEditorLabels;
  activeLocale: 'en' | 'fr';
  items: Item[];
  onAdd: () => void;
  onChange: (items: Item[]) => void;
}) {
  const labelField =
    activeLocale === 'en' ? labels.fields.labelEn : labels.fields.labelFr;
  const descriptionField =
    activeLocale === 'en'
      ? labels.fields.descriptionEn
      : labels.fields.descriptionFr;

  return (
    <div className="grid min-w-0 gap-2 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-start">
      <p className="text-content-secondary pt-1.5 text-xs font-semibold">
        {axisLabel}
      </p>

      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {items.map((item, index) => (
            <EditableTag
              key={`${item.key}-${index}`}
              value={item.key}
              label={labels.fields.key}
              removeLabel={labels.fields.remove}
              onChange={(key) => {
                const nextItems = [...items];
                nextItems[index] = { ...item, key } as Item;
                onChange(nextItems);
              }}
              onRemove={() =>
                onChange(items.filter((_, itemIndex) => itemIndex !== index))
              }
            />
          ))}

          <button
            type="button"
            onClick={onAdd}
            className="border-border-subtle bg-surface-primary text-content-tertiary hover:border-border-default hover:text-content-primary min-h-7 rounded-full border border-dashed px-2.5 font-mono text-[0.6875rem] transition"
          >
            + {addLabel}
          </button>
        </div>

        {items.length > 0 ? (
          <details className="mt-2">
            <summary className="text-content-tertiary hover:text-content-secondary cursor-pointer list-none text-[0.6875rem] font-medium">
              {editDetailsLabel}
            </summary>
            <div className="border-border-subtle bg-surface-primary mt-2 divide-y overflow-hidden rounded-md border">
              {items.map((item, index) => (
                <div
                  key={`${item.key}-details-${index}`}
                  className="grid min-w-0 gap-2 px-3 py-3 md:grid-cols-[minmax(8rem,1fr)_minmax(12rem,1.6fr)]"
                >
                  <CompactInput
                    label={labelField}
                    value={item.label[activeLocale]}
                    onChange={(value) => {
                      const nextItems = [...items];
                      nextItems[index] = {
                        ...item,
                        label: updateLocalizedText(
                          item.label,
                          activeLocale,
                          value,
                        ),
                      } as Item;
                      onChange(nextItems);
                    }}
                  />
                  <CompactTextarea
                    label={descriptionField}
                    value={item.description[activeLocale]}
                    rows={2}
                    onChange={(value) => {
                      const nextItems = [...items];
                      nextItems[index] = {
                        ...item,
                        description: updateLocalizedText(
                          item.description,
                          activeLocale,
                          value,
                        ),
                      } as Item;
                      onChange(nextItems);
                    }}
                  />
                </div>
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </div>
  );
}

function EditableTag({
  value,
  label,
  removeLabel,
  onChange,
  onRemove,
}: {
  value: string;
  label: string;
  removeLabel: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}) {
  const width = `${Math.max(3, value.length + 1)}ch`;

  return (
    <span className="border-border-subtle bg-surface-primary inline-flex min-h-7 items-center rounded-full border pr-1 pl-2.5">
      <input
        aria-label={label}
        value={value}
        style={{ width } as CSSProperties}
        onChange={(event) => onChange(event.target.value)}
        className="text-content-primary min-w-0 bg-transparent font-mono text-[0.6875rem] outline-none"
      />
      <button
        type="button"
        aria-label={removeLabel}
        onClick={onRemove}
        className="text-content-tertiary hover:text-action-danger flex size-5 items-center justify-center rounded-full text-sm transition"
      >
        <span aria-hidden="true">×</span>
      </button>
    </span>
  );
}

function AccessibilitySection({
  labels,
  draft,
  activeLocale,
  setDraft,
}: Omit<EditorProps, 'setActiveLocale' | 'tokenOptions'>) {
  return (
    <EditorSection
      title={labels.accessibility.title}
      action={
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            setDraft({
              ...draft,
              accessibility: [
                ...draft.accessibility,
                createEmptyAccessibilityRuleDraft(),
              ],
            })
          }
        >
          + {labels.accessibility.add}
        </Button>
      }
    >
      <div className="grid min-w-0 gap-3 md:grid-cols-2">
        {draft.accessibility.map((rule, index) => (
          <AccessibilityRuleCard
            key={`${rule.key}-${index}`}
            labels={labels}
            activeLocale={activeLocale}
            rule={rule}
            onChange={(nextRule) => {
              const nextRules = [...draft.accessibility];
              nextRules[index] = nextRule;
              setDraft({ ...draft, accessibility: nextRules });
            }}
            onRemove={() =>
              setDraft({
                ...draft,
                accessibility: draft.accessibility.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              })
            }
          />
        ))}
      </div>
    </EditorSection>
  );
}

function AccessibilityRuleCard({
  labels,
  activeLocale,
  rule,
  onChange,
  onRemove,
}: {
  labels: ComponentContractEditorLabels;
  activeLocale: 'en' | 'fr';
  rule: ComponentAccessibilityRuleDraft;
  onChange: (rule: ComponentAccessibilityRuleDraft) => void;
  onRemove: () => void;
}) {
  const descriptionLabel =
    activeLocale === 'en'
      ? labels.fields.descriptionEn
      : labels.fields.descriptionFr;

  return (
    <article className="border-border-subtle bg-surface-primary min-w-0 rounded-md border p-3">
      <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_7.5rem_2rem] sm:items-end">
        <CompactInput
          label={labels.fields.key}
          value={rule.key}
          mono
          onChange={(key) => onChange({ ...rule, key })}
        />
        <div className="grid min-w-0 gap-1.5">
          <label
            htmlFor={`accessibility-severity-${rule.key}`}
            className="text-content-secondary text-xs font-semibold"
          >
            {labels.accessibility.severity}
          </label>
          <Select<ComponentAccessibilityRuleDraft['severity']>
            id={`accessibility-severity-${rule.key}`}
            value={rule.severity}
            options={[
              { value: 'info', label: labels.severities.info },
              { value: 'warning', label: labels.severities.warning },
              { value: 'critical', label: labels.severities.critical },
            ]}
            onValueChange={(severity) => onChange({ ...rule, severity })}
            placeholder={labels.accessibility.severity}
            size="sm"
          />
        </div>
        <RemoveIconButton label={labels.fields.remove} onClick={onRemove} />
      </div>

      <div className="mt-2">
        <CompactTextarea
          label={descriptionLabel}
          value={rule.description[activeLocale]}
          rows={2}
          onChange={(description) =>
            onChange({
              ...rule,
              description: updateLocalizedText(
                rule.description,
                activeLocale,
                description,
              ),
            })
          }
        />
      </div>
    </article>
  );
}

function ForbiddenPatternsSection({
  labels,
  draft,
  activeLocale,
  setDraft,
}: Omit<EditorProps, 'setActiveLocale' | 'tokenOptions'>) {
  const patternLabel =
    activeLocale === 'en' ? labels.fields.patternEn : labels.fields.patternFr;

  return (
    <EditorSection
      title={labels.forbiddenPatterns.title}
      action={
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            setDraft({
              ...draft,
              forbiddenPatterns: [
                ...draft.forbiddenPatterns,
                createEmptyForbiddenPatternDraft(),
              ],
            })
          }
        >
          + {labels.forbiddenPatterns.add}
        </Button>
      }
    >
      <div className="grid min-w-0 gap-3">
        {draft.forbiddenPatterns.map((pattern, index) => (
          <div
            key={index}
            className="grid min-w-0 gap-2 md:grid-cols-[minmax(0,1fr)_2rem] md:items-end"
          >
            <CompactTextarea
              label={patternLabel}
              value={pattern[activeLocale]}
              rows={2}
              onChange={(value) => {
                const nextPatterns = [...draft.forbiddenPatterns];
                nextPatterns[index] = updateLocalizedText(
                  pattern,
                  activeLocale,
                  value,
                );
                setDraft({ ...draft, forbiddenPatterns: nextPatterns });
              }}
            />
            <RemoveIconButton
              label={labels.fields.remove}
              onClick={() =>
                setDraft({
                  ...draft,
                  forbiddenPatterns: draft.forbiddenPatterns.filter(
                    (_, itemIndex) => itemIndex !== index,
                  ),
                })
              }
            />
          </div>
        ))}
      </div>
    </EditorSection>
  );
}

function VisualTokensSection({
  labels,
  draft,
  setDraft,
  tokenOptions,
  onSelectTokenBinding,
}: Pick<EditorProps, 'labels' | 'draft' | 'setDraft' | 'tokenOptions'> & {
  onSelectTokenBinding: (draftId: string) => void;
}) {
  function addTokenBinding() {
    const emptyBinding = createEmptyTokenBindingDraft();
    const role = getFirstAvailableComponentPreviewTokenRole(
      draft.tokenBindings,
    );
    const nextBinding = role
      ? {
          ...emptyBinding,
          key: role,
          tokenType: getComponentPreviewTokenRoleType(role),
        }
      : emptyBinding;

    setDraft({
      ...draft,
      tokenBindings: [...draft.tokenBindings, nextBinding],
    });
    onSelectTokenBinding(nextBinding.draftId);
  }

  return (
    <EditorSection
      title={labels.visualTokens.title}
      description={labels.visualTokens.description}
      action={
        <Button variant="secondary" size="sm" onClick={addTokenBinding}>
          + {labels.visualTokens.add}
        </Button>
      }
    >
      {draft.tokenBindings.length > 0 ? (
        <div className="grid min-w-0 gap-2">
          {draft.tokenBindings.map((binding) => {
            const inspectorState = getComponentTokenBindingInspectorState({
              binding,
              tokenOptions,
              componentType: draft.type,
            });
            const roleLabel = inspectorState.previewRole
              ? labels.visualTokens.roles[inspectorState.previewRole]
              : binding.key.trim() || labels.visualTokens.customRole;
            const diagnosticLabel =
              labels.visualTokens.diagnostics[inspectorState.resolutionState];
            const diagnosticClassName =
              inspectorState.resolutionState === 'resolved'
                ? 'text-action-success'
                : inspectorState.resolutionState === 'unassigned'
                  ? 'text-content-tertiary'
                  : 'text-action-warning';

            return (
              <button
                key={binding.draftId}
                type="button"
                onClick={() => onSelectTokenBinding(binding.draftId)}
                aria-label={`${labels.visualTokens.inspectBinding}: ${roleLabel}`}
                className="border-border-subtle bg-surface-primary hover:border-border-default hover:bg-background-subtle grid min-w-0 gap-2 rounded-md border px-3 py-3 text-left transition"
              >
                <span className="flex min-w-0 items-center justify-between gap-3">
                  <span className="text-content-primary min-w-0 truncate text-sm font-semibold">
                    {roleLabel}
                  </span>
                  <span className="text-content-tertiary shrink-0 font-mono text-[0.6875rem]">
                    {labels.visualTokens.tokenTypes[binding.tokenType]}
                  </span>
                </span>
                <span className="flex min-w-0 items-center justify-between gap-3 text-[0.6875rem]">
                  <span className="text-content-secondary min-w-0 truncate font-mono">
                    {binding.tokenPath || labels.visualTokens.selectToken}
                  </span>
                  <span className={`${diagnosticClassName} shrink-0 font-semibold`}>
                    {diagnosticLabel}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="border-border-subtle bg-background-subtle text-content-tertiary rounded-md border px-3 py-4 text-xs leading-5">
          {labels.visualTokens.description}
        </p>
      )}
    </EditorSection>
  );
}

function EditorSection({
  title,
  description,
  action,
  tone = 'default',
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: 'default' | 'danger';
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={[
              'text-base font-semibold tracking-tight',
              tone === 'danger' ? 'text-action-danger' : '',
            ].join(' ')}
          >
            {title}
          </h3>
          {description ? (
            <p className="text-content-secondary mt-1 max-w-2xl text-xs leading-5">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="mt-3 min-w-0">{children}</div>
    </section>
  );
}

function CompactInput({
  label,
  value,
  mono = false,
  onChange,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-content-secondary text-xs font-semibold">
        {label}
      </span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        size="sm"
        textMode={mono ? 'technical' : 'default'}
      />
    </label>
  );
}

function CompactTextarea({
  label,
  value,
  rows,
  hideLabel = false,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  hideLabel?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span
        className={
          hideLabel ? 'sr-only' : 'text-content-secondary text-xs font-semibold'
        }
      >
        {label}
      </span>
      <Textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        size="sm"
        className="leading-5"
      />
    </label>
  );
}

function RemoveIconButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="text-content-tertiary hover:bg-action-danger/10 hover:text-action-danger flex size-9 items-center justify-center rounded-md text-lg transition"
    >
      <span aria-hidden="true">×</span>
    </button>
  );
}

function updateLocalizedText(
  value: LocalizedTextDraft,
  locale: 'en' | 'fr',
  text: string,
): LocalizedTextDraft {
  return {
    ...value,
    [locale]: text,
  };
}
