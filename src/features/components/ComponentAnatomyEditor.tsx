'use client';

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
    <section>
      <h3 className="text-lg font-semibold tracking-tight">{labels.title}</h3>
      <p className="text-content-secondary mt-2 text-sm leading-6">
        {labels.description}
      </p>

      <div className="border-border-subtle mt-4 overflow-hidden rounded-xl border">
        <div className="bg-background-subtle text-content-tertiary hidden grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_10rem_2.5rem] gap-3 border-b px-3 py-2 text-xs font-semibold tracking-wide uppercase md:grid">
          <span>{labels.key}</span>
          <span>{labels.label}</span>
          <span>{labels.requirement}</span>
          <span aria-hidden="true" />
        </div>

        {draft.anatomy.length === 0 ? (
          <div className="text-content-secondary px-3 py-4 text-sm">
            {labels.description}
          </div>
        ) : (
          <div className="divide-border-subtle divide-y">
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

      <button
        type="button"
        onClick={() =>
          setDraft({
            ...draft,
            anatomy: [...draft.anatomy, createEmptyAnatomyPartDraft()],
          })
        }
        className="border-border-subtle text-content-secondary hover:text-content-primary mt-4 rounded-xl border px-4 py-2 text-sm font-semibold transition"
      >
        {labels.add}
      </button>
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
    <div className="grid gap-3 px-3 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_10rem_2.5rem] md:items-end">
      <label className="grid gap-1.5">
        <span className="text-content-tertiary text-xs font-semibold md:hidden">
          {labels.key}
        </span>
        <input
          value={part.key}
          onChange={(event) => onChange({ ...part, key: event.target.value })}
          className="border-border-subtle bg-background-app min-h-10 rounded-lg border px-3 font-mono text-sm"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-content-tertiary text-xs font-semibold md:hidden">
          {labels.label}
        </span>
        <input
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
          className="border-border-subtle bg-background-app min-h-10 rounded-lg border px-3 text-sm"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-content-tertiary text-xs font-semibold md:hidden">
          {labels.requirement}
        </span>
        <select
          value={part.requirement}
          onChange={(event) =>
            onChange({
              ...part,
              requirement: event.target
                .value as ComponentAnatomyPartDraft['requirement'],
            })
          }
          className="border-border-subtle bg-background-app min-h-10 rounded-lg border px-3 text-sm"
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
        className="text-action-danger hover:bg-action-danger/10 min-h-10 rounded-lg px-3 text-sm font-semibold transition md:px-0"
      >
        <span aria-hidden="true">×</span>
        <span className="ml-2 md:sr-only">{labels.remove}</span>
      </button>
    </div>
  );
}
