'use client';

import { Button, Select } from '@/components/ui';
import type { ComponentContract } from '@/domain/design-system';
import type { Locale } from '@/i18n/routing';
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
  previewKey: string;
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
  locale: Locale;
  component: ComponentRegistryItem;
  labels: ComponentPreviewConfigurationBrowserLabels;
  tokenBindingResolution: ComponentTokenBindingResolution;
  semanticPalette: ComponentPreviewSemanticPalette;
};

export function ComponentInstancePreviewBrowser({
  locale,
  component,
  labels,
  tokenBindingResolution,
  semanticPalette,
}: ComponentPreviewConfigurationBrowserProps) {
  const {
    draft,
    previewContract,
    previewConfiguration,
    setPreviewConfiguration,
    resolvedPreviewConfiguration,
    setAuthoringSelection,
  } = useComponentContractWorkspace();
  const variants = getVariantAxis(draft, previewContract, locale);
  const sizes = getSizeAxis(draft, previewContract, locale);
  const states = getStateAxis(
    draft,
    previewContract,
    locale,
    labels.baseState,
    labels.state,
  );
  const selectedVariant =
    variants.find(
      (variant) =>
        variant.draftId === resolvedPreviewConfiguration.variantDraftId,
    ) ?? variants[0];
  const selectedSize =
    sizes.find(
      (size) => size.draftId === resolvedPreviewConfiguration.sizeDraftId,
    ) ?? sizes[0];
  const selectedState =
    states.find(
      (state) => state.draftId === resolvedPreviewConfiguration.stateDraftId,
    ) ?? states[0];

  return (
    <div className="grid min-w-0 gap-4">
      <p className="text-content-secondary text-xs leading-5">
        {labels.instanceDescription}
      </p>

      <div className="grid min-w-0 gap-3 md:grid-cols-3">
        <AxisControl
          id="component-instance-variant"
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
          id="component-instance-size"
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
          id="component-instance-state"
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
          name={previewContract.name}
          variantKey={selectedVariant?.previewKey ?? 'default'}
          sizeKey={selectedSize?.previewKey ?? 'md'}
          stateKey={selectedState?.previewKey ?? ''}
          tokenBindingResolution={tokenBindingResolution}
          semanticPalette={semanticPalette}
        />
      </div>
    </div>
  );
}

export function ComponentMatrixPreviewBrowser({
  locale,
  component,
  labels,
  tokenBindingResolution,
  semanticPalette,
}: ComponentPreviewConfigurationBrowserProps) {
  const {
    draft,
    previewContract,
    authoringSelection,
    setAuthoringSelection,
    previewConfiguration,
    setPreviewConfiguration,
    resolvedPreviewConfiguration,
  } = useComponentContractWorkspace();
  const variants = getVariantAxis(draft, previewContract, locale);
  const sizes = getSizeAxis(draft, previewContract, locale);
  const states = getStateAxis(
    draft,
    previewContract,
    locale,
    labels.baseState,
    labels.state,
  );
  const selectedState =
    states.find(
      (state) => state.draftId === resolvedPreviewConfiguration.stateDraftId,
    ) ?? states[0];

  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <p className="text-content-secondary max-w-2xl text-xs leading-5">
          {labels.matrixDescription}
        </p>
        <div className="w-full min-w-0 lg:max-w-xs">
          <AxisControl
            id="component-matrix-state"
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
                const sizeDraftId = size.draftId;
                const isEdited =
                  sizeDraftId !== null &&
                  authoringSelection.kind === 'sizeDefinition' &&
                  authoringSelection.draftId === sizeDraftId;

                return (
                  <th
                    key={sizeDraftId ?? size.key}
                    scope="col"
                    className="min-w-28 px-2 pb-3 text-center"
                  >
                    {sizeDraftId ? (
                      <button
                        type="button"
                        aria-pressed={isEdited}
                        onClick={() => {
                          setPreviewConfiguration({
                            ...previewConfiguration,
                            sizeDraftId,
                          });
                          setAuthoringSelection({
                            kind: 'sizeDefinition',
                            draftId: sizeDraftId,
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
              const variantDraftId = variant.draftId;
              const isEdited =
                variantDraftId !== null &&
                authoringSelection.kind === 'variantDefinition' &&
                authoringSelection.draftId === variantDraftId;

              return (
                <tr key={variantDraftId ?? variant.key}>
                  <th scope="row" className="w-24 min-w-24 px-1 py-2 text-left">
                    {variantDraftId ? (
                      <button
                        type="button"
                        aria-pressed={isEdited}
                        onClick={() => {
                          setPreviewConfiguration({
                            ...previewConfiguration,
                            variantDraftId,
                          });
                          setAuthoringSelection({
                            kind: 'variantDefinition',
                            draftId: variantDraftId,
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
                              name={previewContract.name}
                              variantKey={variant.previewKey}
                              sizeKey={size.previewKey}
                              stateKey={selectedState?.previewKey ?? ''}
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
  id,
  label,
  items,
  value,
  editLabel,
  canEdit,
  onChange,
  onEdit,
}: {
  id: string;
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
        <label
          htmlFor={id}
          className="text-content-tertiary text-xs font-semibold"
        >
          {label}
        </label>
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
        id={id}
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
  previewContract: ComponentContract,
  locale: Locale,
): AxisItem[] {
  if (draft.variants.length === 0) {
    return [
      {
        draftId: null,
        key: 'default',
        label: 'default',
        previewKey: previewContract.variants[0]?.key ?? 'default',
      },
    ];
  }

  return draft.variants.map((variant, index) => ({
    draftId: variant.draftId,
    key: variant.key.trim() || 'default',
    label: resolveDraftLabel(variant, locale, 'default'),
    previewKey: previewContract.variants[index]?.key ?? 'default',
  }));
}

function getSizeAxis(
  draft: ComponentContractEditorDraft,
  previewContract: ComponentContract,
  locale: Locale,
): AxisItem[] {
  if (draft.sizes.length === 0) {
    return [
      {
        draftId: null,
        key: 'md',
        label: 'md',
        previewKey: previewContract.sizes[0]?.key ?? 'md',
      },
    ];
  }

  return draft.sizes.map((size, index) => ({
    draftId: size.draftId,
    key: size.key.trim() || 'md',
    label: resolveDraftLabel(size, locale, 'md'),
    previewKey: previewContract.sizes[index]?.key ?? 'md',
  }));
}

function getStateAxis(
  draft: ComponentContractEditorDraft,
  previewContract: ComponentContract,
  locale: Locale,
  baseStateLabel: string,
  stateFallback: string,
): AxisItem[] {
  return [
    { draftId: null, key: '', label: baseStateLabel, previewKey: '' },
    ...draft.states.map((state, index) => ({
      draftId: state.draftId,
      key: state.key.trim(),
      label: resolveDraftLabel(state, locale, stateFallback),
      previewKey: previewContract.states[index]?.key ?? '',
    })),
  ];
}

function resolveDraftLabel(
  item: {
    key: string;
    label: { en: string; fr: string };
  },
  locale: Locale,
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
