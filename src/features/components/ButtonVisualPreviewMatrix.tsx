'use client';

import { useState, type CSSProperties } from 'react';
import { Select } from '@/components/ui';
import {
  getComponentTemplateDefinition,
  resolveComponentVisualProperties,
  type ComponentContractV2,
} from '@/domain/design-system';
import type { Locale } from '@/i18n/routing';
import type { ComponentRegistryItem } from './components-registry.utils';
import {
  createVisualMatrixAxes,
  getPreviewSizeCategory,
  type ComponentVisualMatrixLabels,
} from './ComponentVisualMatrix';
import type { ComponentPreviewSemanticPalette } from './component-token-bindings.utils';
import {
  createComponentVisualCssProperties,
  type RawComponentTokenSet,
} from './component-visual-preview.utils';
import { resolveLocalizedStringWithFallback } from '@/domain/i18n';
import { toResolvableLocalizedString } from './components-registry-page.utils';

function getButtonVariantTone(variantKey: string) {
  const normalized = variantKey.toLowerCase();

  if (
    normalized.includes('danger') ||
    normalized.includes('destructive') ||
    normalized.includes('error')
  ) {
    return 'danger' as const;
  }

  if (normalized.includes('ghost')) {
    return 'ghost' as const;
  }

  if (
    normalized.includes('primary') ||
    normalized.includes('default') ||
    normalized.includes('solid')
  ) {
    return 'primary' as const;
  }

  return 'secondary' as const;
}

function hasDefinedStyle(value: CSSProperties[keyof CSSProperties]) {
  return value !== undefined && value !== null && value !== '';
}

function hasHorizontalPadding(styles: CSSProperties) {
  return (
    hasDefinedStyle(styles.padding) ||
    hasDefinedStyle(styles.paddingInline) ||
    hasDefinedStyle(styles.paddingLeft) ||
    hasDefinedStyle(styles.paddingRight)
  );
}

function hasVerticalPadding(styles: CSSProperties) {
  return (
    hasDefinedStyle(styles.padding) ||
    hasDefinedStyle(styles.paddingBlock) ||
    hasDefinedStyle(styles.paddingTop) ||
    hasDefinedStyle(styles.paddingBottom)
  );
}

function hasRadius(styles: CSSProperties) {
  return (
    hasDefinedStyle(styles.borderRadius) ||
    hasDefinedStyle(styles.borderTopLeftRadius) ||
    hasDefinedStyle(styles.borderTopRightRadius) ||
    hasDefinedStyle(styles.borderBottomRightRadius) ||
    hasDefinedStyle(styles.borderBottomLeftRadius)
  );
}

function hasExplicitHeight(styles: CSSProperties) {
  return hasDefinedStyle(styles.height) || hasDefinedStyle(styles.minHeight);
}

function resolveAxisLabel(
  locale: Locale,
  label: ComponentRegistryItem['contract']['variants'][number]['label'],
  fallback: string,
) {
  return (
    resolveLocalizedStringWithFallback({
      localizedString: toResolvableLocalizedString(label),
      locale,
    }).value || fallback
  );
}

export function ButtonVisualPreviewMatrix({
  locale,
  component,
  contractV2,
  labels,
  rawTokenSets,
  semanticPalette,
}: {
  locale: Locale;
  component: ComponentRegistryItem;
  contractV2: ComponentContractV2;
  labels: ComponentVisualMatrixLabels;
  rawTokenSets: RawComponentTokenSet[];
  semanticPalette: ComponentPreviewSemanticPalette;
}) {
  const { variants, sizes, states } = createVisualMatrixAxes(
    component.contract,
  );
  const [stateKey, setStateKey] = useState('');
  const templateDefinition = getComponentTemplateDefinition(
    contractV2.templateKey,
  );

  return (
    <div className="min-w-0" data-button-v2-preview="true">
      {states.length > 0 ? (
        <div className="mb-3 ml-auto grid max-w-xs gap-1.5">
          <label
            htmlFor="button-v2-preview-state"
            className="text-content-tertiary text-xs font-semibold"
          >
            {labels.state}
          </label>
          <Select
            id="button-v2-preview-state"
            value={stateKey}
            options={[
              { value: '', label: labels.baseState },
              ...states.map((state) => ({
                value: state.key,
                label: resolveAxisLabel(locale, state.label, state.key),
              })),
            ]}
            onValueChange={setStateKey}
            placeholder={labels.baseState}
            size="sm"
          />
        </div>
      ) : null}

      <div className="border-border-subtle bg-background-subtle overflow-x-auto rounded-lg border p-3 shadow-sm">
        <table className="w-full min-w-max border-separate border-spacing-0">
          <thead>
            <tr>
              <th aria-hidden="true" className="w-20 min-w-20 p-2" />
              {sizes.map((size) => (
                <th
                  key={size.key}
                  scope="col"
                  className="text-content-secondary min-w-20 px-2 pb-3 text-center font-mono text-xs font-semibold"
                >
                  {size.key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <tr key={variant.key}>
                <th
                  scope="row"
                  className="text-content-tertiary w-20 min-w-20 px-1 py-2 text-left font-mono text-[0.6875rem] font-medium"
                >
                  {variant.key}
                </th>
                {sizes.map((size) => {
                  const resolvedVisual = resolveComponentVisualProperties({
                    templateDefaults:
                      templateDefinition?.defaultContract.visual,
                    base: contractV2.visual,
                    overrides: contractV2.overrides,
                    variantKey: variant.key,
                    sizeKey: size.key,
                    ...(stateKey ? { stateKey } : {}),
                  });
                  const visualStyles = createComponentVisualCssProperties({
                    visual: resolvedVisual,
                    rawTokenSets,
                  });

                  return (
                    <td key={`${variant.key}-${size.key}`} className="p-1.5">
                      <div className="flex min-h-20 min-w-24 items-center justify-center">
                        <ButtonVisualPreview
                          name={component.name}
                          variantKey={variant.key}
                          sizeKey={size.key}
                          stateKey={stateKey}
                          styles={visualStyles}
                          semanticPalette={semanticPalette}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ButtonVisualPreview({
  name,
  variantKey,
  sizeKey,
  stateKey,
  styles,
  semanticPalette,
}: {
  name: string;
  variantKey: string;
  sizeKey: string;
  stateKey: string;
  styles: CSSProperties;
  semanticPalette: ComponentPreviewSemanticPalette;
}) {
  const normalizedStateKey = stateKey.toLowerCase();
  const isDisabled = normalizedStateKey.includes('disabled');
  const isFocus = normalizedStateKey.includes('focus');
  const isLoading = normalizedStateKey.includes('loading');
  const isHover = normalizedStateKey.includes('hover');
  const isActive = normalizedStateKey.includes('active');
  const size = getPreviewSizeCategory(sizeKey);
  const variantTone = getButtonVariantTone(variantKey);
  const semanticColor =
    variantTone === 'danger'
      ? semanticPalette.action.danger
      : variantTone === 'primary'
        ? semanticPalette.action.primary
        : undefined;
  const mergedStyles: CSSProperties = {
    ...(semanticColor && !styles.backgroundColor
      ? { backgroundColor: semanticColor, borderColor: semanticColor }
      : {}),
    ...styles,
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      tabIndex={-1}
      data-preview-component="button"
      data-preview-v2="true"
      style={mergedStyles}
      className={[
        'font-semibold whitespace-nowrap transition',
        styles.borderStyle === 'none' ? '' : 'border',
        hasRadius(styles) ? '' : 'rounded-md',
        hasHorizontalPadding(styles)
          ? ''
          : size === 'small'
            ? 'px-2.5'
            : size === 'large'
              ? 'px-4'
              : 'px-3',
        hasVerticalPadding(styles)
          ? ''
          : size === 'small'
            ? 'py-1'
            : size === 'large'
              ? 'py-2'
              : 'py-1.5',
        hasExplicitHeight(styles)
          ? ''
          : size === 'small'
            ? 'min-h-8'
            : size === 'large'
              ? 'min-h-10'
              : 'min-h-9',
        hasDefinedStyle(styles.fontSize)
          ? ''
          : size === 'large'
            ? 'text-sm'
            : size === 'small'
              ? 'text-[0.6875rem]'
              : 'text-xs',
        hasDefinedStyle(styles.backgroundColor) || semanticColor
          ? ''
          : variantTone === 'primary'
            ? 'bg-action-primary'
            : variantTone === 'danger'
              ? 'bg-action-danger'
              : variantTone === 'ghost'
                ? 'bg-transparent'
                : 'bg-surface-primary',
        hasDefinedStyle(styles.color)
          ? ''
          : variantTone === 'primary'
            ? 'text-action-primary-content'
            : variantTone === 'danger'
              ? 'text-content-inverse'
              : 'text-content-primary',
        hasDefinedStyle(styles.borderColor) || semanticColor
          ? ''
          : variantTone === 'primary'
            ? 'border-action-primary'
            : variantTone === 'danger'
              ? 'border-action-danger'
              : variantTone === 'ghost'
                ? 'border-transparent'
                : 'border-border-subtle',
        isFocus ? 'ring-action-primary/30 ring-2' : '',
        isHover ? 'brightness-95' : '',
        isActive ? 'translate-y-px' : '',
        isDisabled ? 'cursor-not-allowed opacity-45' : '',
      ].join(' ')}
    >
      {isLoading ? '…' : name}
    </button>
  );
}
