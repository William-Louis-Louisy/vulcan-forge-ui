'use client';

import { Button, Input, Textarea } from '@/components/ui';
import type {
  ComponentContractEditorDraft,
  ComponentVariantDraft,
} from './component-contract-editor.utils';
import type { ComponentContractEditorLabels } from './ComponentContractEditorSections';
import { useComponentContractWorkspace } from './ComponentContractWorkspaceContext';

type AxisCollection = 'variants' | 'sizes' | 'states';
type AxisSelectionKind =
  | 'variantDefinition'
  | 'sizeDefinition'
  | 'stateDefinition';

export function ComponentAxisDefinitionInspector({
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
    previewConfiguration,
    setPreviewConfiguration,
  } = useComponentContractWorkspace();

  if (!isAxisSelection(authoringSelection.kind)) {
    return null;
  }

  const axis = getAxisConfiguration(authoringSelection.kind, labels);
  const items = getAxisItems(draft, axis.collection);
  const selectedItem = items.find(
    (item) => item.draftId === authoringSelection.draftId,
  );

  if (!selectedItem) {
    return null;
  }

  const item = selectedItem;
  const displayLabel =
    item.label[activeLocale].trim() || item.key.trim() || axis.title;
  const localeLabel = labels.localizedContent.locales[activeLocale];

  function updateItem(nextItem: ComponentVariantDraft) {
    const nextItems = items.map((candidate) =>
      candidate.draftId === item.draftId ? nextItem : candidate,
    );

    setDraft(setAxisItems(draft, axis.collection, nextItems));
  }

  function removeItem() {
    const nextItems = items.filter(
      (candidate) => candidate.draftId !== item.draftId,
    );

    setDraft(setAxisItems(draft, axis.collection, nextItems));
    setPreviewConfiguration(
      clearRemovedPreviewAxis(
        previewConfiguration,
        axis.collection,
        item.draftId,
      ),
    );
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
          {axis.title}
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
            value={item.key}
            onChange={(event) =>
              updateItem({ ...item, key: event.target.value })
            }
            size="sm"
            textMode="technical"
          />
        </label>

        <div className="grid min-w-0 gap-2">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="text-content-secondary text-xs font-semibold">
              {axis.labelField} · {localeLabel}
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
            aria-label={`${axis.labelField} · ${localeLabel}`}
            value={item.label[activeLocale]}
            onChange={(event) =>
              updateItem({
                ...item,
                label: {
                  ...item.label,
                  [activeLocale]: event.target.value,
                },
              })
            }
            size="sm"
          />
        </div>

        <label className="grid min-w-0 gap-1.5">
          <span className="text-content-secondary text-xs font-semibold">
            {axis.descriptionField} · {localeLabel}
          </span>
          <Textarea
            value={item.description[activeLocale]}
            onChange={(event) =>
              updateItem({
                ...item,
                description: {
                  ...item.description,
                  [activeLocale]: event.target.value,
                },
              })
            }
            rows={4}
          />
        </label>

        <div className="border-border-subtle border-t pt-4">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={removeItem}
            className="text-action-danger"
          >
            {labels.fields.remove}
          </Button>
        </div>
      </div>
    </section>
  );
}

function isAxisSelection(kind: string): kind is AxisSelectionKind {
  return (
    kind === 'variantDefinition' ||
    kind === 'sizeDefinition' ||
    kind === 'stateDefinition'
  );
}

function getAxisConfiguration(
  kind: AxisSelectionKind,
  labels: ComponentContractEditorLabels,
) {
  if (kind === 'variantDefinition') {
    return {
      collection: 'variants' as const,
      title: labels.variants.title,
      labelField: labels.variants.axis,
      descriptionField: labels.fields.descriptionEn.replace(/EN$/u, '').trim(),
    };
  }

  if (kind === 'sizeDefinition') {
    return {
      collection: 'sizes' as const,
      title: labels.sizes.title,
      labelField: labels.sizes.axis,
      descriptionField: labels.fields.descriptionEn.replace(/EN$/u, '').trim(),
    };
  }

  return {
    collection: 'states' as const,
    title: labels.states.title,
    labelField: labels.states.axis,
    descriptionField: labels.fields.descriptionEn.replace(/EN$/u, '').trim(),
  };
}

function getAxisItems(
  draft: ComponentContractEditorDraft,
  collection: AxisCollection,
): ComponentVariantDraft[] {
  return draft[collection];
}

function setAxisItems(
  draft: ComponentContractEditorDraft,
  collection: AxisCollection,
  items: ComponentVariantDraft[],
): ComponentContractEditorDraft {
  if (collection === 'variants') {
    return { ...draft, variants: items };
  }

  if (collection === 'sizes') {
    return { ...draft, sizes: items };
  }

  return { ...draft, states: items };
}

function clearRemovedPreviewAxis(
  configuration: {
    variantDraftId: string | null;
    sizeDraftId: string | null;
    stateDraftId: string | null;
  },
  collection: AxisCollection,
  removedDraftId: string,
) {
  if (
    collection === 'variants' &&
    configuration.variantDraftId === removedDraftId
  ) {
    return { ...configuration, variantDraftId: null };
  }

  if (collection === 'sizes' && configuration.sizeDraftId === removedDraftId) {
    return { ...configuration, sizeDraftId: null };
  }

  if (collection === 'states' && configuration.stateDraftId === removedDraftId) {
    return { ...configuration, stateDraftId: null };
  }

  return configuration;
}
