'use client';

import { Button } from '@/components/ui';
import { createEmptyAnatomyPartDraft } from './component-contract-editor.utils';
import { useComponentContractWorkspace } from './ComponentContractWorkspaceContext';

export type ComponentAnatomyCanvasLabels = {
  title: string;
  description: string;
  add: string;
  component: string;
  flatStructure: string;
  empty: string;
  selectPart: string;
  untitled: string;
  requirements: {
    required: string;
    optional: string;
    derived: string;
  };
};

export function ComponentAnatomyCanvas({
  labels,
}: {
  labels: ComponentAnatomyCanvasLabels;
}) {
  const {
    draft,
    setDraft,
    activeLocale,
    authoringSelection,
    setAuthoringSelection,
  } = useComponentContractWorkspace();

  function addAnatomyPart() {
    const nextPart = createEmptyAnatomyPartDraft();

    setDraft({
      ...draft,
      anatomy: [...draft.anatomy, nextPart],
    });
    setAuthoringSelection({
      kind: 'anatomyPart',
      draftId: nextPart.draftId,
    });
  }

  return (
    <section className="min-w-0 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight">
              {labels.title}
            </h2>
            <p className="text-content-secondary mt-1 max-w-2xl text-sm leading-6">
              {labels.description}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={addAnatomyPart}
            className="shrink-0"
          >
            + {labels.add}
          </Button>
        </header>

        <div className="border-border-subtle bg-surface-primary mt-5 rounded-xl border p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
              {labels.flatStructure}
            </p>
            <p className="text-content-tertiary text-xs">
              {draft.anatomy.length}
            </p>
          </div>

          <button
            type="button"
            aria-pressed={authoringSelection.kind === 'component'}
            onClick={() => setAuthoringSelection({ kind: 'component' })}
            className={[
              'mx-auto mt-5 block w-full max-w-md rounded-xl border px-5 py-4 text-left transition',
              authoringSelection.kind === 'component'
                ? 'border-border-focus bg-background-subtle'
                : 'border-border-subtle bg-background-app hover:border-border-default',
            ].join(' ')}
          >
            <span className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
              {labels.component}
            </span>
            <span className="mt-1 block truncate text-base font-semibold">
              {draft.name}
            </span>
          </button>

          <div
            aria-hidden="true"
            className="bg-border-default mx-auto h-6 w-px"
          />

          {draft.anatomy.length === 0 ? (
            <div className="border-border-subtle bg-background-subtle rounded-lg border border-dashed px-4 py-8 text-center">
              <p className="text-content-secondary text-sm">{labels.empty}</p>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={addAnatomyPart}
                className="mt-4"
              >
                + {labels.add}
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-content-secondary mb-3 text-center text-xs">
                {labels.selectPart}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {draft.anatomy.map((part, index) => {
                  const isSelected =
                    authoringSelection.kind === 'anatomyPart' &&
                    authoringSelection.draftId === part.draftId;
                  const displayLabel =
                    part.label[activeLocale].trim() ||
                    part.key.trim() ||
                    labels.untitled;

                  return (
                    <button
                      key={part.draftId}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() =>
                        setAuthoringSelection({
                          kind: 'anatomyPart',
                          draftId: part.draftId,
                        })
                      }
                      className={[
                        'min-w-0 rounded-lg border p-4 text-left transition',
                        isSelected
                          ? 'border-border-focus bg-background-subtle'
                          : 'border-border-subtle bg-background-app hover:border-border-default hover:bg-background-subtle',
                      ].join(' ')}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-content-tertiary font-mono text-[0.6875rem]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="border-border-subtle bg-surface-primary text-content-secondary rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold">
                          {labels.requirements[part.requirement]}
                        </span>
                      </div>
                      <span className="mt-3 block truncate text-sm font-semibold">
                        {displayLabel}
                      </span>
                      <span className="text-content-tertiary mt-1 block truncate font-mono text-[0.6875rem]">
                        {part.key.trim() || '—'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
