'use client';

import { Button, Textarea } from '@/components/ui';
import type { ComponentContractEditorLabels } from './ComponentContractEditorSections';
import { useComponentContractWorkspace } from './ComponentContractWorkspaceContext';

export function ComponentForbiddenPatternInspector({
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

  if (authoringSelection.kind !== 'forbiddenPattern') {
    return null;
  }

  const pattern = draft.forbiddenPatterns.find(
    (candidate) => candidate.draftId === authoringSelection.draftId,
  );

  if (!pattern) {
    return null;
  }

  const selectedPattern = pattern;
  const patternLabel =
    activeLocale === 'en' ? labels.fields.patternEn : labels.fields.patternFr;
  const displayLabel =
    selectedPattern[activeLocale].trim() || labels.forbiddenPatterns.title;

  function updatePattern(value: string) {
    setDraft({
      ...draft,
      forbiddenPatterns: draft.forbiddenPatterns.map((candidate) =>
        candidate.draftId === selectedPattern.draftId
          ? { ...candidate, [activeLocale]: value }
          : candidate,
      ),
    });
  }

  function removePattern() {
    setDraft({
      ...draft,
      forbiddenPatterns: draft.forbiddenPatterns.filter(
        (candidate) => candidate.draftId !== selectedPattern.draftId,
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
          {labels.forbiddenPatterns.title}
        </p>
        <h3 className="mt-1 line-clamp-2 text-lg font-semibold tracking-tight">
          {displayLabel}
        </h3>
      </header>

      <div className="grid min-w-0 gap-4 pt-4">
        <div className="grid min-w-0 gap-2">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="text-content-secondary text-xs font-semibold">
              {patternLabel}
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
          <Textarea
            aria-label={patternLabel}
            value={selectedPattern[activeLocale]}
            onChange={(event) => updatePattern(event.target.value)}
            rows={6}
          />
        </div>

        <div className="border-border-subtle border-t pt-4">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={removePattern}
            className="text-action-danger"
          >
            {labels.fields.remove}
          </Button>
        </div>
      </div>
    </section>
  );
}
