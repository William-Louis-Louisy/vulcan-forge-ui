'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Button } from '@/components/ui';
import { ComponentAnatomyEditor } from './ComponentAnatomyEditor';
import {
  createEmptyAccessibilityRuleDraft,
  createEmptyForbiddenPatternDraft,
  createEmptySizeDraft,
  createEmptyStateDraft,
  createEmptyTokenBindingDraft,
  createEmptyVariantDraft,
  type ComponentAccessibilityRuleDraft,
  type ComponentContractEditorDraft,
  type ComponentSizeDraft,
  type ComponentStateDraft,
  type ComponentTokenBindingDraft,
  type ComponentVariantDraft,
  type LocalizedTextDraft,
} from './component-contract-editor.utils';
import type { ComponentTokenOption } from './component-token-bindings.utils';

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
    tokenType: string;
    tokenPath: string;
    selectToken: string;
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

export function ComponentContractEditorSections({
  labels,
  draft,
  setDraft,
  activeLocale,
  setActiveLocale,
  tokenOptions,
}: EditorProps) {
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
        activeLocale={activeLocale}
        setDraft={setDraft}
        tokenOptions={tokenOptions}
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

      <label className="grid min-w-0 gap-1.5">
        <span className="text-content-secondary text-xs font-semibold">
          {labels.basics.status}
        </span>
        <select
          value={draft.status}
          onChange={(event) =>
            setDraft({
              ...draft,
              status: event.target
                .value as ComponentContractEditorDraft['status'],
            })
          }
          className={fieldClassName}
        >
          <option value="draft">{labels.statuses.draft}</option>
          <option value="ready">{labels.statuses.ready}</option>
          <option value="deprecated">{labels.statuses.deprecated}</option>
        </select>
      </label>
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

        <label className="grid min-w-0 gap-1.5">
          <span className="text-content-secondary text-xs font-semibold">
            {labels.accessibility.severity}
          </span>
          <select
            value={rule.severity}
            onChange={(event) =>
              onChange({
                ...rule,
                severity: event.target
                  .value as ComponentAccessibilityRuleDraft['severity'],
              })
            }
            className={fieldClassName}
          >
            <option value="info">{labels.severities.info}</option>
            <option value="warning">{labels.severities.warning}</option>
            <option value="critical">{labels.severities.critical}</option>
          </select>
        </label>

        <RemoveIconButton label={labels.fields.remove} onClick={onRemove} />
      </div>

      <div className="mt-2.5">
        <CompactTextarea
          label={descriptionLabel}
          value={rule.description[activeLocale]}
          rows={3}
          onChange={(value) =>
            onChange({
              ...rule,
              description: updateLocalizedText(
                rule.description,
                activeLocale,
                value,
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
      tone="danger"
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
      <div className="border-action-danger/20 bg-action-danger/5 divide-action-danger/15 min-w-0 divide-y overflow-hidden rounded-md border">
        {draft.forbiddenPatterns.map((pattern, index) => (
          <div
            key={`${pattern.en}-${pattern.fr}-${index}`}
            className="grid min-w-0 gap-2 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_2rem] sm:items-end"
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
  activeLocale,
  setDraft,
  tokenOptions,
}: Omit<EditorProps, 'setActiveLocale'>) {
  return (
    <EditorSection
      title={labels.visualTokens.title}
      description={labels.visualTokens.description}
      action={
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            setDraft({
              ...draft,
              tokenBindings: [
                ...draft.tokenBindings,
                createEmptyTokenBindingDraft(),
              ],
            })
          }
        >
          + {labels.visualTokens.add}
        </Button>
      }
    >
      <div className="border-border-subtle min-w-0 overflow-hidden rounded-md border">
        {draft.tokenBindings.map((binding, index) => (
          <TokenBindingRow
            key={`${binding.key}-${binding.tokenPath}-${index}`}
            labels={labels}
            activeLocale={activeLocale}
            binding={binding}
            tokenOptions={tokenOptions}
            onChange={(nextBinding) => {
              const nextBindings = [...draft.tokenBindings];
              nextBindings[index] = nextBinding;
              setDraft({ ...draft, tokenBindings: nextBindings });
            }}
            onRemove={() =>
              setDraft({
                ...draft,
                tokenBindings: draft.tokenBindings.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              })
            }
          />
        ))}

        {draft.tokenBindings.length === 0 ? (
          <p className="text-content-tertiary px-3 py-4 text-xs">
            {labels.visualTokens.description}
          </p>
        ) : null}
      </div>
    </EditorSection>
  );
}

function TokenBindingRow({
  labels,
  activeLocale,
  binding,
  tokenOptions,
  onChange,
  onRemove,
}: {
  labels: ComponentContractEditorLabels;
  activeLocale: 'en' | 'fr';
  binding: ComponentTokenBindingDraft;
  tokenOptions: ComponentTokenOption[];
  onChange: (binding: ComponentTokenBindingDraft) => void;
  onRemove: () => void;
}) {
  const tokenOptionsForType = tokenOptions.filter(
    (tokenOption) => tokenOption.type === binding.tokenType,
  );
  const hasCurrentTokenPath = tokenOptionsForType.some(
    (tokenOption) => tokenOption.path === binding.tokenPath,
  );
  const descriptionLabel =
    activeLocale === 'en'
      ? labels.fields.descriptionEn
      : labels.fields.descriptionFr;

  return (
    <div className="border-border-subtle min-w-0 border-b px-3 py-3 last:border-b-0">
      <div className="grid min-w-0 gap-2 md:grid-cols-[minmax(7rem,0.8fr)_8rem_minmax(10rem,1.4fr)_2rem] md:items-end">
        <CompactInput
          label={labels.fields.key}
          value={binding.key}
          mono
          onChange={(key) => onChange({ ...binding, key })}
        />
        <label className="grid min-w-0 gap-1.5">
          <span className="text-content-secondary text-xs font-semibold">
            {labels.visualTokens.tokenType}
          </span>
          <select
            value={binding.tokenType}
            onChange={(event) =>
              onChange({
                ...binding,
                tokenType: event.target
                  .value as ComponentTokenBindingDraft['tokenType'],
              })
            }
            className={fieldClassName}
          >
            <option value="color">color</option>
            <option value="spacing">spacing</option>
            <option value="radius">radius</option>
            <option value="typography">typography</option>
            <option value="motion">motion</option>
          </select>
        </label>
        <label className="grid min-w-0 gap-1.5">
          <span className="text-content-secondary text-xs font-semibold">
            {labels.visualTokens.tokenPath}
          </span>
          <select
            value={binding.tokenPath}
            onChange={(event) =>
              onChange({ ...binding, tokenPath: event.target.value })
            }
            className={`${fieldClassName} font-mono`}
          >
            <option value="">{labels.visualTokens.selectToken}</option>
            {!hasCurrentTokenPath && binding.tokenPath ? (
              <option value={binding.tokenPath}>{binding.tokenPath}</option>
            ) : null}
            {tokenOptionsForType.map((tokenOption) => (
              <option key={tokenOption.path} value={tokenOption.path}>
                {tokenOption.label}
              </option>
            ))}
          </select>
        </label>
        <RemoveIconButton label={labels.fields.remove} onClick={onRemove} />
      </div>

      <details className="mt-2">
        <summary className="text-content-tertiary hover:text-content-secondary cursor-pointer list-none text-[0.6875rem] font-medium">
          {descriptionLabel}
        </summary>
        <div className="mt-2">
          <CompactTextarea
            label={descriptionLabel}
            hideLabel
            value={binding.description[activeLocale]}
            rows={2}
            onChange={(value) =>
              onChange({
                ...binding,
                description: updateLocalizedText(
                  binding.description,
                  activeLocale,
                  value,
                ),
              })
            }
          />
        </div>
      </details>
    </div>
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
    <section className="border-border-subtle min-w-0 border-t pt-5">
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
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClassName} ${mono ? 'font-mono' : ''}`}
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
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClassName} resize-y py-2 leading-5`}
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

const fieldClassName =
  'border-border-subtle bg-surface-primary focus:border-action-primary min-h-9 w-full min-w-0 rounded-md border px-3 text-[0.8125rem] outline-none transition';
