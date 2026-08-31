'use client';

import { Button, Input, Select, Textarea } from '@/components/ui';
import type { ComponentContractEditorLabels } from './ComponentContractEditorSections';
import { useComponentContractWorkspace } from './ComponentContractWorkspaceContext';

export function ComponentAccessibilityRuleInspector({
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

  if (authoringSelection.kind !== 'accessibilityRule') {
    return null;
  }

  const rule = draft.accessibility.find(
    (candidate) => candidate.draftId === authoringSelection.draftId,
  );

  if (!rule) {
    return null;
  }

  const selectedRule = rule;
  const displayLabel = selectedRule.key.trim() || labels.accessibility.title;
  const descriptionLabel =
    activeLocale === 'en'
      ? labels.fields.descriptionEn
      : labels.fields.descriptionFr;

  function updateRule(nextRule: (typeof draft.accessibility)[number]) {
    setDraft({
      ...draft,
      accessibility: draft.accessibility.map((candidate) =>
        candidate.draftId === selectedRule.draftId ? nextRule : candidate,
      ),
    });
  }

  function removeRule() {
    setDraft({
      ...draft,
      accessibility: draft.accessibility.filter(
        (candidate) => candidate.draftId !== selectedRule.draftId,
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
          {labels.accessibility.title}
        </p>
        <h3 className="mt-1 truncate text-lg font-semibold tracking-tight">
          {displayLabel}
        </h3>
      </header>

      <div className="grid min-w-0 gap-4 pt-4">
        <label className="grid min-w-0 gap-1.5">
          <span className="text-content-secondary text-xs font-semibold">
            {labels.fields.key}
          </span>
          <Input
            value={selectedRule.key}
            onChange={(event) =>
              updateRule({ ...selectedRule, key: event.target.value })
            }
            size="sm"
            textMode="technical"
          />
        </label>

        <div className="grid min-w-0 gap-1.5">
          <label
            htmlFor={`component-accessibility-severity-${selectedRule.draftId}`}
            className="text-content-secondary text-xs font-semibold"
          >
            {labels.accessibility.severity}
          </label>
          <Select<(typeof selectedRule)['severity']>
            id={`component-accessibility-severity-${selectedRule.draftId}`}
            value={selectedRule.severity}
            options={[
              { value: 'info', label: labels.severities.info },
              { value: 'warning', label: labels.severities.warning },
              { value: 'critical', label: labels.severities.critical },
            ]}
            onValueChange={(severity) =>
              updateRule({ ...selectedRule, severity })
            }
            placeholder={labels.accessibility.severity}
            size="sm"
          />
        </div>

        <div className="grid min-w-0 gap-2">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="text-content-secondary text-xs font-semibold">
              {descriptionLabel}
            </span>
            <LocaleControl
              labels={labels}
              activeLocale={activeLocale}
              setActiveLocale={setActiveLocale}
            />
          </div>
          <Textarea
            aria-label={descriptionLabel}
            value={selectedRule.description[activeLocale]}
            onChange={(event) =>
              updateRule({
                ...selectedRule,
                description: {
                  ...selectedRule.description,
                  [activeLocale]: event.target.value,
                },
              })
            }
            rows={5}
          />
        </div>

        <div className="border-border-subtle border-t pt-4">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={removeRule}
            className="text-action-danger"
          >
            {labels.fields.remove}
          </Button>
        </div>
      </div>
    </section>
  );
}

function LocaleControl({
  labels,
  activeLocale,
  setActiveLocale,
}: {
  labels: ComponentContractEditorLabels;
  activeLocale: 'en' | 'fr';
  setActiveLocale: (locale: 'en' | 'fr') => void;
}) {
  return (
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
  );
}
