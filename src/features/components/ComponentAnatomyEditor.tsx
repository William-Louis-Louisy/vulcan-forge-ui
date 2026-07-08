'use client';

import { Button } from '@/components/ui';
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
    <section className="border-border-subtle min-w-0 border-t pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
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
  labels,
  activeLocale,
  part,
  onChange,
  onRemove,
}: {
  labels: ComponentAnatomyEditorLabels;
  activeLocale: 'en' | 'fr';
  part: ComponentAnatomyPartDraft;
  onChange: (part: ComponentAnatomyPartDraft) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid min-w-0 gap-2 px-3 py-2.5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_8rem_2rem] md:items-end">
      <label className="grid min-w-0 gap-1 md:block">
        <span className="text-content-tertiary text-[0.6875rem] font-medium md:sr-only">
          {labels.key}
        </span>
        <input
          aria-label={labels.key}
          value={part.key}
          onChange={(event) => onChange({ ...part, key: event.target.value })}
          className={`${fieldClassName} font-mono`}
        />
      </label>

      <label className="grid min-w-0 gap-1 md:block">
        <span className="text-content-tertiary text-[0.6875rem] font-medium md:sr-only">
          {labels.label}
        </span>
        <input
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
          className={fieldClassName}
        />
      </label>

      <label className="grid min-w-0 gap-1 md:block">
        <span className="text-content-tertiary text-[0.6875rem] font-medium md:sr-only">
          {labels.requirement}
        </span>
        <select
          aria-label={labels.requirement}
          value={part.requirement}
          onChange={(event) =>
            onChange({
              ...part,
              requirement: event.target
                .value as ComponentAnatomyPartDraft['requirement'],
            })
          }
          className={fieldClassName}
        >
          <option value="required">{labels.requirements.required}</option>
          <option value="optional">{labels.requirements.optional}</option>
          <option value="derived">{labels.requirements.derived}</option>
        </select>
      </label>

      <button
        type="button"
        onClick={onRemove}
        aria-label={labels.remove}
        className="text-content-tertiary hover:bg-action-danger/10 hover:text-action-danger flex size-9 items-center justify-center rounded-md text-lg transition"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}

const fieldClassName =
  'border-border-subtle bg-surface-primary focus:border-action-primary min-h-9 w-full min-w-0 rounded-md border px-3 text-[0.8125rem] outline-none transition';
