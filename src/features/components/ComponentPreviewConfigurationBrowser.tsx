'use client';

import { Button, Select } from '@/components/ui';
import type { ComponentContractEditorDraft } from './component-contract-editor.utils';
import type { ComponentRegistryItem } from './components-registry.utils';
import type {
  ComponentPreviewSemanticPalette,
  ComponentTokenBindingResolution,
} from './component-token-bindings.utils';
import { ComponentPreview } from './ComponentVisualMatrix';
import { useComponentContractWorkspace } from './ComponentContractWorkspaceContext';

type AxisItem = {
  draftId: string | null;
  key: string;
  label: string;
};

export type ComponentPreviewConfigurationBrowserLabels = {
  variant: string;
  size: string;
  state: string;
  baseState: string;
  editDefinition: string;
  instanceDescription: string;
  matrixDescription: string;
  useCombination: string;
  selectedCombination: string;
};

type ComponentPreviewConfigurationBrowserProps = {
  component: ComponentRegistryItem;
  labels: ComponentPreviewConfigurationBrowserLabels;
  tokenBindingResolution: ComponentTokenBindingResolution;
  semanticPalette: ComponentPreviewSemanticPalette;
};

export function ComponentInstancePreviewBrowser({
  component,
  labels,
  tokenBindingResolution,
  semanticPalette,
}: ComponentPreviewConfigurationBrowserProps) {
  const {
    draft,
    activeLocale,
    previewConfiguration,
    setPreviewConfiguration,
    resolvedPreviewConfiguration,
    setAuthoringSelection,
  } = useComponentContractWorkspace();
  const variants = getVariantAxis(draft, activeLocale);
  const sizes = getSizeAxis(draft, activeLocale);
  const states = getStateAxis(
    draft,
    activeLocale,
    labels.baseState,
    labels.state,
  );

  return (
    <div className="grid min-w-0 gap-4">
      <p className="text-content-secondary text-xs leading-5">
        {labels.instanceDescription}
      </p>

      <div className="grid min-w-0 gap-3 md:grid-cols-3">
        <AxisControl
          label={labels.variant}
          items={variants}
          value={resolvedPreviewConfiguration.variantDraftId ?? ''}
          editLabel={labels.editDefinition}
          canEdit={resolvedPreviewConfiguration.variantDraftId !== null}
          onChange={(variantDraftId) =>
            setPreviewConfiguration({
              ...previewConfiguration,
              variantDraftId: variantDraftId || null,
            })
          }
          onEdit={() => {
            if (resolvedPreviewConfiguration.variantDraftId) {
              setAuthoringSelection({
                kind: 'variantDefinition',
                draftId: resolvedPreviewConfiguration.variantDraftId,
              });
            }
          }}
        />
        <AxisControl
          label={labels.size}
          items={sizes}
          value={resolvedPreviewConfiguration.sizeDraftId ?? ''}
          editLabel={labels.editDefinition}
          canEdit={resolvedPreviewConfiguration.sizeDraftId !== null}
          onChange={(sizeDraftId) =>
            setPreviewConfiguration({
              ...previewConfiguration,
              sizeDraftId: sizeDraftId || null,
            })
          }
          onEdit={() => {
            if (resolvedPreviewConfiguration.sizeDraftId) {
              setAuthoringSelection({
                kind: 'sizeDefinition',
                draftId: resolvedPreviewConfiguration.sizeDraftId,
              });
            }
          }}
        />
        <AxisControl
          label={labels.state}
          items={states}
          value={resolvedPreviewConfiguration.stateDraftId ?? ''}
          editLabel={labels.editDefinition}
          canEdit={resolvedPreviewConfiguration.stateDraftId !== null}
          onChange={(stateDraftId) =>
            setPreviewConfiguration({
              ...previewConfiguration,
              stateDraftId: stateDraftId || null,
            })
          }
          onEdit={() => {
            if (resolvedPreviewConfiguration.stateDraftId) {
              setAuthoringSelection({
                kind: 'stateDefinition',
                draftId: resolvedPreviewConfiguration.stateDraftId,
              });
            }
          }}
        />
      </div>

      <div className="border-border-subtle bg-background-subtle flex min-h-64 items-center justify-center rounded-xl border p-6 shadow-sm">
        <ComponentPreview
          type={component.type}
          name={draft.name}
          variantKey={resolvedPreviewConfiguration.variantKey}
          sizeKey={resolvedPreviewConfiguration.sizeKey}
          stateKey={resolvedPreviewConfiguration.stateKey}
          tokenBindingResolution={tokenBindingResolution}
          semanticPalette={semanticPalette}
        />
      </div>
    </div>
  );
}

export function ComponentMatrixPreviewBrowser({
  component,
  labels,
  tokenBindingResolution,
  semanticPalette,
}: ComponentPreviewConfigurationBrowserProps) {
  const {
    draft,
    activeLocale,
    authoringSelection,
    setAuthoringSelection,
    previewConfiguration,
    setPreviewConfiguration,
    resolvedPreviewConfiguration,
  } = useComponentContractWorkspace();
  const variants = getVariantAxis(draft, activeLocale);
  const sizes = getSizeAxis(draft, activeLocale);
  const states = getStateAxis(
    draft,
    activeLocale,
    labels.baseState,
    labels.state,
  );

  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <p className="text-content-secondary max-w-2xl text-xs leading-5">
          {labels.matrixDescription}
        </p>
        <div className="w-full min-w-0 lg:max-w-xs">
          <AxisControl
            label={labels.state}
            items={states}
            value={resolvedPreviewConfiguration.stateDraftId ?? ''}
            editLabel={labels.editDefinition}
            canEdit={resolvedPreviewConfiguration.stateDraftId !== null}
            onChange={(stateDraftId) =>
              setPreviewConfiguration({
                ...previewConfiguration,
                stateDraftId: stateDraftId || null,
              })
            }
            onEdit={() => {
              if (resolvedPreviewConfiguration.stateDraftId) {
                setAuthoringSelection({
                  kind: 'stateDefinition',
                  draftId: resolvedPreviewConfiguration.stateDraftId,
                });
              }
            }}
          />
        </div>
      </div>

      <div className="border-border-subtle bg-background-subtle overflow-x-auto rounded-xl border p-3 shadow-sm">
        <table className="w-full min-w-max border-separate border-spacing-0">
          <thead>
            <tr>
              <th aria-hidden="true" className="w-24 min-w-24 p-2" />
              {sizes.map((size) => {
                const isEdited =
                  size.draftId !== null &&
                  authoringSelection.kind === 'sizeDefinition' &&
                  authoringSelection.draftId === size.draftId;

                return (
                  <th
                    key={size.draftId ?? size.key}
                    scope="col"
                    className="min-w-28 px-2 pb-3 text-center"
                  >
                    {size.draftId ? (
                      <button
                        type="button"
                        aria-pressed={isEdited}
                        onClick={() => {
                          setPreviewConfiguration({
                            ...previewConfiguration,
                            sizeDraftId: size.draftId,
                          });
                          setAuthoringSelection({
                            kind: 'sizeDefinition',
                            draftId: size.draftId,
                          });
                        }}
                        className={[
                          'text-content-secondary rounded-md px-2 py-1 font-mono text-xs font-semibold transition',
                          isEdited
                            ? 'bg-background-app ring-border-focus ring-1'
                            : 'hover:bg-background-app hover:text-content-primary',
                        ].join(' ')}
                      >
                        {size.key}
                      </button>
                    ) : (
                      <span className="text-content-tertiary font-mono text-xs font-semibold">
                        {size.key}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {variants.map((variant) => {
              const isEdited =
                variant.draftId !== null &&
                authoringSelection.kind === 'variantDefinition' &&
                authoringSelection.draftId === variant.draftId;

              return (
                <tr key={variant.draftId ?? variant.key}>
                  <th scope="row" className="w-24 min-w-24 px-1 py-2 text-left">
                    {variant.draftId ? (
                      <button
                        type="button"
                        aria-pressed={isEdited}
                        onClick={() => {
                          setPreviewConfiguration({
                            ...previewConfiguration,
                            variantDraftId: variant.draftId,
                          });
                          setAuthoringSelection({
                            kind: 'variantDefinition',
                            draftId: variant.draftId,
                          });
                        }}
                        className={[
                          'text-content-tertiary rounded-md px-2 py-1 font-mono text-[0.6875rem] font-medium transition',
                          isEdited
                            ? 'bg-background-app text-content-primary ring-border-focus ring-1'
                            : 'hover:bg-background-app hover:text-content-secondary',
                        ].join(' ')}
                      >
                        {variant.key}
                      </button>
                    ) : (
                      <span className="text-content-tertiary px-2 font-mono text-[0.6875rem] font-medium">
                        {variant.key}
                      </span>
                    )}
                  </th>

                  {sizes.map((size) => {
                    const isSelected =
                      resolvedPreviewConfiguration.variantDraftId ===
                        variant.draftId &&
                      resolvedPreviewConfiguration.sizeDraftId === size.draftId;
                    const combinationLabel = `${variant.label} / ${size.label}`;

                    return (
                      <td
                        key={`${variant.draftId ?? variant.key}-${size.draftId ?? size.key}`}
                        className="p-1.5"
                      >
                        <div
                          className={[
                            'border-border-subtle bg-background-app grid min-h-28 min-w-32 gap-2 rounded-lg border p-2 transition',
                            isSelected
                              ? 'ring-border-focus ring-2'
                              : 'hover:border-border-default',
                          ].join(' ')}
                        >
                          <div className="pointer-events-none flex min-h-16 items-center justify-center">
                            <ComponentPreview
                              type={component.type}
                              name={draft.name}
                              variantKey={variant.key}
                              sizeKey={size.key}
                              stateKey={resolvedPreviewConfiguration.stateKey}
                              tokenBindingResolution={tokenBindingResolution}
                              semanticPalette={semanticPalette}
                            />
                          </div>
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`${labels.useCombination}: ${combinationLabel}`}
                            onClick={() =>
                              setPreviewConfiguration({
                                ...previewConfiguration,
                                variantDraftId: variant.draftId,
                                sizeDraftId: size.draftId,
                              })
                            }
                            className="text-content-tertiary hover:text-content-primary rounded px-2 py-1 text-[0.6875rem] font-semibold transition"
                          >
                            {isSelected
                              ? labels.selectedCombination
                              : labels.useCombination}
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AxisControl({
  label,
  items,
  value,
  editLabel,
  canEdit,
  onChange,
  onEdit,
}: {
  label: string;
  items: AxisItem[];
  value: string;
  editLabel: string;
  canEdit: boolean;
  onChange: (value: string) => void;
  onEdit: () => void;
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-content-tertiary text-xs font-semibold">{label}</span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={!canEdit}
          onClick={onEdit}
          className="min-h-7 px-2 py-1 text-[0.6875rem]"
        >
          {editLabel}
        </Button>
      </div>
      <Select
        value={value}
        options={items.map((item) => ({
          value: item.draftId ?? '',
          label: item.label,
        }))}
        onValueChange={onChange}
        placeholder={label}
        size="sm"
      />
    </div>
  );
}

function getVariantAxis(
  draft: ComponentContractEditorDraft,
  locale: 'en' | 'fr',
): AxisItem[] {
  if (draft.variants.length === 0) {
    return [{ draftId: null, key: 'default', label: 'default' }];
  }

  return draft.variants.map((variant) => ({
    draftId: variant.draftId,
    key: variant.key.trim() || 'default',
    label: resolveDraftLabel(variant, locale, 'default'),
  }));
}

function getSizeAxis(
  draft: ComponentContractEditorDraft,
  locale: 'en' | 'fr',
): AxisItem[] {
  if (draft.sizes.length === 0) {
    return [{ draftId: null, key: 'md', label: 'md' }];
  }

  return draft.sizes.map((size) => ({
    draftId: size.draftId,
    key: size.key.trim() || 'md',
    label: resolveDraftLabel(size, locale, 'md'),
  }));
}

function getStateAxis(
  draft: ComponentContractEditorDraft,
  locale: 'en' | 'fr',
  baseStateLabel: string,
  stateFallback: string,
): AxisItem[] {
  return [
    { draftId: null, key: '', label: baseStateLabel },
    ...draft.states.map((state) => ({
      draftId: state.draftId,
      key: state.key.trim(),
      label: resolveDraftLabel(state, locale, stateFallback),
    })),
  ];
}

function resolveDraftLabel(
  item: {
    key: string;
    label: { en: string; fr: string };
  },
  locale: 'en' | 'fr',
  fallback: string,
) {
  return (
    item.label[locale].trim() ||
    item.label.en.trim() ||
    item.label.fr.trim() ||
    item.key.trim() ||
    fallback
  );
}
