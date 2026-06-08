'use client';

import {
  createEmptyStateDraft,
  createEmptyVariantDraft,
  createComponentContractDraft,
  createComponentContractFromDraft,
  createEmptyForbiddenPatternDraft,
  createEmptyAccessibilityRuleDraft,
  type LocalizedTextDraft,
  type ComponentStateDraft,
  type ComponentVariantDraft,
  type ComponentContractEditorDraft,
  type ComponentAccessibilityRuleDraft,
} from './component-contract-editor.utils';
import type { Locale } from '@/i18n/routing';
import type { ComponentContract } from '@/domain/design-system';
import { useActionState, useMemo, useState, type ReactNode } from 'react';
import { updateComponentContractAction } from './update-component-contract.action';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { initialUpdateComponentContractActionState } from './update-component-contract.state';

export type ComponentContractEditorLabels = {
  title: string;
  description: string;
  unsavedNotice: string;
  validationTitle: string;
  basics: {
    title: string;
    name: string;
    status: string;
    purposeEn: string;
    purposeFr: string;
  };
  anatomy: {
    title: string;
    description: string;
    add: string;
  };
  variants: {
    title: string;
    add: string;
  };
  states: {
    title: string;
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
};

type ComponentContractEditorProps = {
  locale: Locale;
  projectSlug: string;
  contract: ComponentContract;
  labels: ComponentContractEditorLabels;
};

export function ComponentContractEditor({
  locale,
  projectSlug,
  contract,
  labels,
}: ComponentContractEditorProps) {
  const [state, formAction, isPending] = useActionState(
    updateComponentContractAction,
    initialUpdateComponentContractActionState,
  );

  const initialDraft = useMemo(
    () => createComponentContractDraft(contract),
    [contract],
  );

  const [draft, setDraft] =
    useState<ComponentContractEditorDraft>(initialDraft);

  const savedContract =
    state.status === 'success' && state.savedContract
      ? state.savedContract
      : contract;

  const savedDraft = useMemo(
    () => createComponentContractDraft(savedContract),
    [savedContract],
  );

  const validation = createComponentContractFromDraft(draft);

  const contractPayload =
    validation.status === 'success' ? JSON.stringify(validation.contract) : '';

  const hasUnsavedChanges =
    JSON.stringify(draft) !== JSON.stringify(savedDraft);

  const preserveSaveContext = usePreserveSaveContext(
    `component-contract:${projectSlug}:${contract.type}`,
  );

  return (
    <section className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-6">
      <div>
        <p className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
          {labels.title}
        </p>
        <p className="text-content-secondary mt-2 text-sm leading-6">
          {labels.description}
        </p>
      </div>

      {hasUnsavedChanges ? (
        <p
          role="status"
          className="text-action-warning mt-4 text-sm font-semibold"
        >
          {labels.unsavedNotice}
        </p>
      ) : null}

      {validation.status === 'error' ? (
        <div
          role="alert"
          className="border-action-danger/30 bg-action-danger/10 text-action-danger mt-4 rounded-2xl border p-4 text-sm"
        >
          <p className="font-semibold">{labels.validationTitle}</p>
          <ul className="mt-2 list-disc pl-5">
            {validation.errors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 grid gap-8">
        <BasicsSection labels={labels} draft={draft} setDraft={setDraft} />

        <AnatomySection labels={labels} draft={draft} setDraft={setDraft} />

        <VariantsSection labels={labels} draft={draft} setDraft={setDraft} />

        <StatesSection labels={labels} draft={draft} setDraft={setDraft} />

        <AccessibilitySection
          labels={labels}
          draft={draft}
          setDraft={setDraft}
        />

        <ForbiddenPatternsSection
          labels={labels}
          draft={draft}
          setDraft={setDraft}
        />
      </div>

      <form
        action={formAction}
        onSubmitCapture={preserveSaveContext}
        className="border-border-subtle mt-8 rounded-2xl border p-4"
      >
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="componentType" value={draft.type} />
        <input type="hidden" name="contract" value={contractPayload} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">
              {hasUnsavedChanges ? labels.save.unsaved : labels.save.saved}
            </p>

            {validation.status === 'error' ? (
              <p className="text-action-danger mt-1 text-sm font-semibold">
                {labels.save.invalid}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={
              isPending || validation.status === 'error' || !hasUnsavedChanges
            }
            className="bg-action-primary text-action-primary-content disabled:bg-background-subtle disabled:text-content-tertiary rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed"
          >
            {isPending ? labels.save.saving : labels.save.action}
          </button>
        </div>

        {state.status === 'success' ? (
          <p
            role="status"
            className="text-action-success mt-4 text-sm font-semibold"
          >
            {labels.save.saved}
          </p>
        ) : null}

        {state.formError ? (
          <p
            role="alert"
            className="text-action-danger mt-4 text-sm font-semibold"
          >
            {labels.save.errors[state.formError]}
          </p>
        ) : null}
      </form>
    </section>
  );
}

function BasicsSection({
  labels,
  draft,
  setDraft,
}: {
  labels: ComponentContractEditorLabels;
  draft: ComponentContractEditorDraft;
  setDraft: (draft: ComponentContractEditorDraft) => void;
}) {
  return (
    <EditorSection title={labels.basics.title}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label={labels.basics.name}
          value={draft.name}
          onChange={(value) => setDraft({ ...draft, name: value })}
        />

        <label className="grid gap-2">
          <span className="text-sm font-semibold">{labels.basics.status}</span>
          <select
            value={draft.status}
            onChange={(event) =>
              setDraft({
                ...draft,
                status: event.target
                  .value as ComponentContractEditorDraft['status'],
              })
            }
            className="border-border-subtle bg-background-subtle min-h-11 rounded-xl border px-3 text-sm"
          >
            <option value="draft">{labels.statuses.draft}</option>
            <option value="ready">{labels.statuses.ready}</option>
            <option value="deprecated">{labels.statuses.deprecated}</option>
          </select>
        </label>

        <TextareaInput
          label={labels.basics.purposeEn}
          value={draft.purpose.en}
          onChange={(value) =>
            setDraft({
              ...draft,
              purpose: { ...draft.purpose, en: value },
            })
          }
        />

        <TextareaInput
          label={labels.basics.purposeFr}
          value={draft.purpose.fr}
          onChange={(value) =>
            setDraft({
              ...draft,
              purpose: { ...draft.purpose, fr: value },
            })
          }
        />
      </div>
    </EditorSection>
  );
}

function AnatomySection({
  labels,
  draft,
  setDraft,
}: {
  labels: ComponentContractEditorLabels;
  draft: ComponentContractEditorDraft;
  setDraft: (draft: ComponentContractEditorDraft) => void;
}) {
  return (
    <EditorSection
      title={labels.anatomy.title}
      description={labels.anatomy.description}
    >
      <div className="grid gap-3">
        {draft.anatomy.map((item, index) => (
          <div key={`${item}-${index}`} className="flex gap-2">
            <TextInput
              label={`${labels.anatomy.title} ${index + 1}`}
              value={item}
              onChange={(value) => {
                const nextAnatomy = [...draft.anatomy];
                nextAnatomy[index] = value;
                setDraft({ ...draft, anatomy: nextAnatomy });
              }}
            />
            <RemoveButton
              label={labels.fields.remove}
              onClick={() =>
                setDraft({
                  ...draft,
                  anatomy: draft.anatomy.filter(
                    (_, itemIndex) => itemIndex !== index,
                  ),
                })
              }
            />
          </div>
        ))}

        <AddButton
          label={labels.anatomy.add}
          onClick={() =>
            setDraft({ ...draft, anatomy: [...draft.anatomy, ''] })
          }
        />
      </div>
    </EditorSection>
  );
}

function VariantsSection({
  labels,
  draft,
  setDraft,
}: {
  labels: ComponentContractEditorLabels;
  draft: ComponentContractEditorDraft;
  setDraft: (draft: ComponentContractEditorDraft) => void;
}) {
  return (
    <EditableListSection
      title={labels.variants.title}
      addLabel={labels.variants.add}
      onAdd={() =>
        setDraft({
          ...draft,
          variants: [...draft.variants, createEmptyVariantDraft()],
        })
      }
    >
      {draft.variants.map((variant, index) => (
        <VariantEditor
          key={`${variant.key}-${index}`}
          labels={labels}
          variant={variant}
          onChange={(nextVariant) => {
            const nextVariants = [...draft.variants];
            nextVariants[index] = nextVariant;
            setDraft({ ...draft, variants: nextVariants });
          }}
          onRemove={() =>
            setDraft({
              ...draft,
              variants: draft.variants.filter(
                (_, itemIndex) => itemIndex !== index,
              ),
            })
          }
        />
      ))}
    </EditableListSection>
  );
}

function StatesSection({
  labels,
  draft,
  setDraft,
}: {
  labels: ComponentContractEditorLabels;
  draft: ComponentContractEditorDraft;
  setDraft: (draft: ComponentContractEditorDraft) => void;
}) {
  return (
    <EditableListSection
      title={labels.states.title}
      addLabel={labels.states.add}
      onAdd={() =>
        setDraft({
          ...draft,
          states: [...draft.states, createEmptyStateDraft()],
        })
      }
    >
      {draft.states.map((state, index) => (
        <StateEditor
          key={`${state.key}-${index}`}
          labels={labels}
          state={state}
          onChange={(nextState) => {
            const nextStates = [...draft.states];
            nextStates[index] = nextState;
            setDraft({ ...draft, states: nextStates });
          }}
          onRemove={() =>
            setDraft({
              ...draft,
              states: draft.states.filter(
                (_, itemIndex) => itemIndex !== index,
              ),
            })
          }
        />
      ))}
    </EditableListSection>
  );
}

function AccessibilitySection({
  labels,
  draft,
  setDraft,
}: {
  labels: ComponentContractEditorLabels;
  draft: ComponentContractEditorDraft;
  setDraft: (draft: ComponentContractEditorDraft) => void;
}) {
  return (
    <EditableListSection
      title={labels.accessibility.title}
      addLabel={labels.accessibility.add}
      onAdd={() =>
        setDraft({
          ...draft,
          accessibility: [
            ...draft.accessibility,
            createEmptyAccessibilityRuleDraft(),
          ],
        })
      }
    >
      {draft.accessibility.map((rule, index) => (
        <AccessibilityRuleEditor
          key={`${rule.key}-${index}`}
          labels={labels}
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
    </EditableListSection>
  );
}

function ForbiddenPatternsSection({
  labels,
  draft,
  setDraft,
}: {
  labels: ComponentContractEditorLabels;
  draft: ComponentContractEditorDraft;
  setDraft: (draft: ComponentContractEditorDraft) => void;
}) {
  return (
    <EditableListSection
      title={labels.forbiddenPatterns.title}
      addLabel={labels.forbiddenPatterns.add}
      onAdd={() =>
        setDraft({
          ...draft,
          forbiddenPatterns: [
            ...draft.forbiddenPatterns,
            createEmptyForbiddenPatternDraft(),
          ],
        })
      }
    >
      {draft.forbiddenPatterns.map((pattern, index) => (
        <LocalizedTextEditor
          key={`${pattern.en}-${pattern.fr}-${index}`}
          labels={labels}
          value={pattern}
          labelEn={labels.fields.patternEn}
          labelFr={labels.fields.patternFr}
          onChange={(nextPattern) => {
            const nextPatterns = [...draft.forbiddenPatterns];
            nextPatterns[index] = nextPattern;
            setDraft({ ...draft, forbiddenPatterns: nextPatterns });
          }}
          onRemove={() =>
            setDraft({
              ...draft,
              forbiddenPatterns: draft.forbiddenPatterns.filter(
                (_, itemIndex) => itemIndex !== index,
              ),
            })
          }
        />
      ))}
    </EditableListSection>
  );
}

function VariantEditor({
  labels,
  variant,
  onChange,
  onRemove,
}: {
  labels: ComponentContractEditorLabels;
  variant: ComponentVariantDraft;
  onChange: (variant: ComponentVariantDraft) => void;
  onRemove: () => void;
}) {
  return (
    <NestedEditorCard onRemove={onRemove} removeLabel={labels.fields.remove}>
      <TextInput
        label={labels.fields.key}
        value={variant.key}
        onChange={(key) => onChange({ ...variant, key })}
      />
      <LocalizedTextEditor
        labels={labels}
        value={variant.label}
        labelEn={labels.fields.labelEn}
        labelFr={labels.fields.labelFr}
        onChange={(label) => onChange({ ...variant, label })}
      />
      <LocalizedTextEditor
        labels={labels}
        value={variant.description}
        labelEn={labels.fields.descriptionEn}
        labelFr={labels.fields.descriptionFr}
        onChange={(description) => onChange({ ...variant, description })}
      />
    </NestedEditorCard>
  );
}

function StateEditor({
  labels,
  state,
  onChange,
  onRemove,
}: {
  labels: ComponentContractEditorLabels;
  state: ComponentStateDraft;
  onChange: (state: ComponentStateDraft) => void;
  onRemove: () => void;
}) {
  return (
    <NestedEditorCard onRemove={onRemove} removeLabel={labels.fields.remove}>
      <TextInput
        label={labels.fields.key}
        value={state.key}
        onChange={(key) => onChange({ ...state, key })}
      />
      <LocalizedTextEditor
        labels={labels}
        value={state.label}
        labelEn={labels.fields.labelEn}
        labelFr={labels.fields.labelFr}
        onChange={(label) => onChange({ ...state, label })}
      />
      <LocalizedTextEditor
        labels={labels}
        value={state.description}
        labelEn={labels.fields.descriptionEn}
        labelFr={labels.fields.descriptionFr}
        onChange={(description) => onChange({ ...state, description })}
      />
    </NestedEditorCard>
  );
}

function AccessibilityRuleEditor({
  labels,
  rule,
  onChange,
  onRemove,
}: {
  labels: ComponentContractEditorLabels;
  rule: ComponentAccessibilityRuleDraft;
  onChange: (rule: ComponentAccessibilityRuleDraft) => void;
  onRemove: () => void;
}) {
  return (
    <NestedEditorCard onRemove={onRemove} removeLabel={labels.fields.remove}>
      <TextInput
        label={labels.fields.key}
        value={rule.key}
        onChange={(key) => onChange({ ...rule, key })}
      />

      <label className="grid gap-2">
        <span className="text-sm font-semibold">
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
          className="border-border-subtle bg-background-subtle min-h-11 rounded-xl border px-3 text-sm"
        >
          <option value="info">{labels.severities.info}</option>
          <option value="warning">{labels.severities.warning}</option>
          <option value="critical">{labels.severities.critical}</option>
        </select>
      </label>

      <LocalizedTextEditor
        labels={labels}
        value={rule.description}
        labelEn={labels.fields.descriptionEn}
        labelFr={labels.fields.descriptionFr}
        onChange={(description) => onChange({ ...rule, description })}
      />
    </NestedEditorCard>
  );
}

function LocalizedTextEditor({
  value,
  labelEn,
  labelFr,
  onChange,
  onRemove,
}: {
  labels: ComponentContractEditorLabels;
  value: LocalizedTextDraft;
  labelEn: string;
  labelFr: string;
  onChange: (value: LocalizedTextDraft) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-2">
        <TextareaInput
          label={labelEn}
          value={value.en}
          onChange={(en) => onChange({ ...value, en })}
        />
        <TextareaInput
          label={labelFr}
          value={value.fr}
          onChange={(fr) => onChange({ ...value, fr })}
        />
      </div>

      {onRemove ? <RemoveButton label="Remove" onClick={onRemove} /> : null}
    </div>
  );
}

function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {description ? (
        <p className="text-content-secondary mt-2 text-sm leading-6">
          {description}
        </p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EditableListSection({
  title,
  addLabel,
  onAdd,
  children,
}: {
  title: string;
  addLabel: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <EditorSection title={title}>
      <div className="grid gap-4">{children}</div>
      <AddButton label={addLabel} onClick={onAdd} />
    </EditorSection>
  );
}

function NestedEditorCard({
  onRemove,
  removeLabel,
  children,
}: {
  onRemove: () => void;
  removeLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="border-border-subtle bg-background-subtle rounded-2xl border p-4">
      <div className="grid gap-4">{children}</div>
      <RemoveButton label={removeLabel} onClick={onRemove} />
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid w-full gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-border-subtle bg-background-subtle min-h-11 rounded-xl border px-3 text-sm"
      />
    </label>
  );
}

function TextareaInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="border-border-subtle bg-background-subtle min-h-24 rounded-xl border px-3 py-2 text-sm"
      />
    </label>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-border-subtle text-content-secondary hover:text-content-primary mt-4 rounded-xl border px-4 py-2 text-sm font-semibold transition"
    >
      {label}
    </button>
  );
}

function RemoveButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-action-danger mt-3 text-sm font-semibold"
    >
      {label}
    </button>
  );
}
