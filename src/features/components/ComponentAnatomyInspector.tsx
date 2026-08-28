'use client';

import { Button, Input, Select } from '@/components/ui';
import type { ComponentContractEditorLabels } from './ComponentContractEditorSections';
import { useComponentContractWorkspace } from './ComponentContractWorkspaceContext';

export function ComponentAnatomyInspector({
  labels,
}: {
  labels: ComponentContractEditorLabels;
}) {
  const {
    draft,
    setDraft,
    activeLocale,
    setActiveLocale,
    authoringSelection,
    setAuthoringSelection,
  } = useComponentContractWorkspace();

  if (authoringSelection.kind !== 'anatomyPart') {
    return null;
  }

  const part = draft.anatomy.find(
    (candidate) => candidate.draftId === authoringSelection.draftId,
  );

  if (!part) {
    return null;
  }

  const selectedPart = part;
  const displayLabel =
    selectedPart.label[activeLocale].trim() ||
    selectedPart.key.trim() ||
    labels.anatomy.title;

  function updatePart(nextPart: (typeof draft.anatomy)[number]) {
    setDraft({
      ...draft,
      anatomy: draft.anatomy.map((candidate) =>
        candidate.draftId === selectedPart.draftId ? nextPart : candidate,
      ),
    });
  }

  function removePart() {
    setDraft({
      ...draft,
      anatomy: draft.anatomy.filter(
        (candidate) => candidate.draftId !== selectedPart.draftId,
      ),
    });
    setAuthoringSelection({ kind: 'component' });
  }

  return (
    <section className="min-w-0">
      <header className="border-border-subtle border-b pb-4">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setAuthoringSelection({ kind: 'component' })}
          className="-ml-2"
        >
          ← {draft.name}
        </Button>
        <p className="text-content-tertiary mt-3 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
          {labels.anatomy.title}
        </p>
        <h3 className="mt-1 truncate text-lg font-semibold tracking-tight">
          {displayLabel}
        </h3>
        <p className="text-content-secondary mt-1 text-xs leading-5">
          {labels.anatomy.description}
        </p>
      </header>

      <div className="grid min-w-0 gap-4 pt-4">
        <label className="grid min-w-0 gap-1.5">
          <span className="text-content-secondary text-xs font-semibold">
            {labels.anatomy.key}
          </span>
          <Input
            value={selectedPart.key}
            onChange={(event) =>
              updatePart({ ...selectedPart, key: event.target.value })
            }
            size="sm"
            textMode="technical"
          />
        </label>

        <div className="grid min-w-0 gap-2">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="text-content-secondary text-xs font-semibold">
              {labels.anatomy.label} ·{' '}
              {labels.localizedContent.locales[activeLocale]}
            </span>
            <div
              role="group"
              aria-label={labels.localizedContent.editing}
              className="border-border-subtle bg-surface-primary inline-flex shrink-0 rounded-md border p-0.5"
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
                      'rounded-sm px-2 py-1 font-mono text-[0.6875rem] font-semibold transition',
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
          <Input
            aria-label={labels.anatomy.label}
            value={selectedPart.label[activeLocale]}
            onChange={(event) =>
              updatePart({
                ...selectedPart,
                label: {
                  ...selectedPart.label,
                  [activeLocale]: event.target.value,
                },
              })
            }
            size="sm"
          />
        </div>

        <div className="grid min-w-0 gap-1.5">
          <label
            htmlFor={`component-anatomy-requirement-${selectedPart.draftId}`}
            className="text-content-secondary text-xs font-semibold"
          >
            {labels.anatomy.requirement}
          </label>
          <Select<(typeof selectedPart)['requirement']>
            id={`component-anatomy-requirement-${selectedPart.draftId}`}
            value={selectedPart.requirement}
            options={[
              {
                value: 'required',
                label: labels.anatomy.requirements.required,
              },
              {
                value: 'optional',
                label: labels.anatomy.requirements.optional,
              },
              {
                value: 'derived',
                label: labels.anatomy.requirements.derived,
              },
            ]}
            onValueChange={(requirement) =>
              updatePart({ ...selectedPart, requirement })
            }
            placeholder={labels.anatomy.requirement}
            size="sm"
          />
        </div>

        <div className="border-border-subtle border-t pt-4">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={removePart}
            className="text-action-danger"
          >
            {labels.fields.remove}
          </Button>
        </div>
      </div>
    </section>
  );
}
