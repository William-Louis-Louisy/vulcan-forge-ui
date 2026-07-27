'use client';

import { Button, Input, Select } from '@/components/ui';
import type {
  ComponentAnatomyPartDraft,
  ComponentContractEditorDraft,
} from './component-contract-editor.utils';
import { createEmptyAnatomyPartDraft } from './component-contract-editor.utils';

export type ComponentAnatomyEditorLabels = {
  title: string;
  description: string;
  add: string;
  key: string;
  label: string;
  requirement: string;
  remove: string;
  requirements: {
    required: string;
    optional: string;
    derived: string;
  };
};

type ComponentAnatomyEditorProps = {
  labels: ComponentAnatomyEditorLabels;
  activeLocale: 'en' | 'fr';
  draft: ComponentContractEditorDraft;
  setDraft: (draft: ComponentContractEditorDraft) => void;
};

export function ComponentAnatomyEditor({
  labels,
  activeLocale,
  draft,
  setDraft,
}: ComponentAnatomyEditorProps) {
  return (
    <section className="border-border-subtle min-w-0 border-t pt-4 sm:pt-5">
      <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight">
            {labels.title}
          </h3>
          <p className="text-content-secondary mt-1 text-xs leading-5">
            {labels.description}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() =>
            setDraft({
              ...draft,
              anatomy: [...draft.anatomy, createEmptyAnatomyPartDraft()],
            })
          }
        >
          + {labels.add}
        </Button>
      </div>

      <div className="border-border-subtle mt-3 min-w-0 overflow-hidden rounded-md border">
        <div className="bg-background-subtle text-content-tertiary hidden min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_8rem_2rem] gap-2 border-b px-3 py-2 text-[0.6875rem] font-medium md:grid">
          <span>{labels.key}</span>
          <span>{labels.label}</span>
          <span>{labels.requirement}</span>
          <span aria-hidden="true" />
        </div>

        {draft.anatomy.length === 0 ? (
          <p className="text-content-tertiary px-3 py-4 text-xs">
            {labels.description}
          </p>
        ) : (
          <div className="divide-border-subtle min-w-0 divide-y">
            {draft.anatomy.map((part, index) => (
              <AnatomyPartRow
                key={`${part.key}-${index}`}
                rowId={`anatomy-part-${index}`}
                labels={labels}
                activeLocale={activeLocale}
                part={part}
                onChange={(nextPart) => {
                  const nextAnatomy = [...draft.anatomy];
                  nextAnatomy[index] = nextPart;
                  setDraft({ ...draft, anatomy: nextAnatomy });
                }}
                onRemove={() =>
                  setDraft({
                    ...draft,
                    anatomy: draft.anatomy.filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  })
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AnatomyPartRow({
  rowId,
  labels,
  activeLocale,
  part,
  onChange,
  onRemove,
}: {
  rowId: string;
  labels: ComponentAnatomyEditorLabels;
  activeLocale: 'en' | 'fr';
  part: ComponentAnatomyPartDraft;
  onChange: (part: ComponentAnatomyPartDraft) => void;
  onRemove: () => void;
}) {
  const requirementId = `${rowId}-requirement`;

  return (
    <div className="grid min-w-0 gap-2 px-3 py-2.5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_8rem_2rem] md:items-end">
      <label className="grid min-w-0 gap-1 md:block">
        <span className="text-content-tertiary text-[0.6875rem] font-medium md:sr-only">
          {labels.key}
        </span>
        <Input
          aria-label={labels.key}
          value={part.key}
          onChange={(event) => onChange({ ...part, key: event.target.value })}
          size="sm"
          textMode="technical"
        />
      </label>

      <label className="grid min-w-0 gap-1 md:block">
        <span className="text-content-tertiary text-[0.6875rem] font-medium md:sr-only">
          {labels.label}
        </span>
        <Input
          aria-label={labels.label}
          value={part.label[activeLocale]}
          onChange={(event) =>
            onChange({
              ...part,
              label: {
                ...part.label,
                [activeLocale]: event.target.value,
              },
            })
          }
          size="sm"
        />
      </label>

      <div className="grid min-w-0 gap-1 md:block">
        <label
          htmlFor={requirementId}
          className="text-content-tertiary text-[0.6875rem] font-medium md:sr-only"
        >
          {labels.requirement}
        </label>
        <Select<ComponentAnatomyPartDraft['requirement']>
          id={requirementId}
          value={part.requirement}
          options={[
            { value: 'required', label: labels.requirements.required },
            { value: 'optional', label: labels.requirements.optional },
            { value: 'derived', label: labels.requirements.derived },
          ]}
          onValueChange={(requirement) => onChange({ ...part, requirement })}
          placeholder={labels.requirement}
          size="sm"
        />
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={labels.remove}
        className="text-content-tertiary hover:bg-action-danger/10 hover:text-action-danger flex size-9 items-center justify-center justify-self-end rounded-md text-lg transition md:justify-self-auto"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
