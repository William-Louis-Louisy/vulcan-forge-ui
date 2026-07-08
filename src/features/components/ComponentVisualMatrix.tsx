'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Locale } from '@/i18n/routing';
import { resolveLocalizedStringWithFallback } from '@/domain/i18n';
import type { ComponentRegistryItem } from './components-registry.utils';
import { toResolvableLocalizedString } from './components-registry-page.utils';
import type { ComponentTokenBindingResolution } from './component-token-bindings.utils';

type ComponentVariant = ComponentRegistryItem['contract']['variants'][number];
type ComponentSize = ComponentRegistryItem['contract']['sizes'][number];

export type ComponentVisualMatrixLabels = {
  baseState: string;
  state: string;
};

const fallbackVariant: ComponentVariant = {
  key: 'default',
  label: {
    en: 'Default',
    fr: 'Défaut',
  },
};

const fallbackSize: ComponentSize = {
  key: 'md',
  label: {
    en: 'Medium',
    fr: 'Moyen',
  },
};

export function createVisualMatrixAxes(
  contract: ComponentRegistryItem['contract'],
) {
  return {
    variants:
      contract.variants.length > 0 ? contract.variants : [fallbackVariant],
    sizes: contract.sizes.length > 0 ? contract.sizes : [fallbackSize],
    states: contract.states,
    hasFallback: contract.variants.length === 0 || contract.sizes.length === 0,
  };
}

export function getPreviewSizeCategory(
  sizeKey: string,
): 'small' | 'medium' | 'large' {
  const normalizedSizeKey = sizeKey.toLowerCase();

  if (
    normalizedSizeKey === 'xs' ||
    normalizedSizeKey === 'sm' ||
    normalizedSizeKey.includes('small') ||
    normalizedSizeKey.includes('compact')
  ) {
    return 'small';
  }

  if (
    normalizedSizeKey === 'lg' ||
    normalizedSizeKey === 'xl' ||
    normalizedSizeKey.includes('large')
  ) {
    return 'large';
  }

  return 'medium';
}

export function ComponentVisualMatrix({
  locale,
  component,
  labels,
  tokenBindingResolution,
}: {
  locale: Locale;
  component: ComponentRegistryItem;
  labels: ComponentVisualMatrixLabels;
  tokenBindingResolution: ComponentTokenBindingResolution;
}) {
  const { variants, sizes, states } = createVisualMatrixAxes(
    component.contract,
  );
  const [stateKey, setStateKey] = useState('');

  return (
    <div className="min-w-0">
      {states.length > 0 ? (
        <label className="mb-3 flex items-center justify-end gap-2">
          <span className="text-content-tertiary text-xs font-semibold">
            {labels.state}
          </span>
          <select
            aria-label={labels.state}
            value={stateKey}
            onChange={(event) => setStateKey(event.target.value)}
            className="border-border-subtle bg-surface-primary focus:border-action-primary min-h-8 rounded-md border px-2.5 font-mono text-xs outline-none"
          >
            <option value="">{labels.baseState}</option>
            {states.map((state) => (
              <option key={state.key} value={state.key}>
                {resolveMatrixLabel(locale, state.label, state.key)}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="border-border-subtle bg-surface-primary overflow-x-auto rounded-lg border p-3 shadow-sm">
        <table className="w-full min-w-max border-separate border-spacing-0">
          <thead>
            <tr>
              <th aria-hidden="true" className="w-20 min-w-20 p-2" />
              {sizes.map((size) => (
                <th
                  key={size.key}
                  scope="col"
                  className="text-content-secondary min-w-20 px-2 pb-3 text-center font-mono text-xs font-semibold"
                  title={resolveMatrixLabel(locale, size.label, size.key)}
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
                  title={resolveMatrixLabel(locale, variant.label, variant.key)}
                >
                  {variant.key}
                </th>

                {sizes.map((size) => (
                  <td key={`${variant.key}-${size.key}`} className="p-1.5">
                    <div className="border-border-subtle bg-background-app flex min-h-16 min-w-20 items-center justify-center rounded-md border p-2">
                      <ComponentPreview
                        type={component.type}
                        name={component.name}
                        variantKey={variant.key}
                        sizeKey={size.key}
                        stateKey={stateKey}
                        tokenBindingResolution={tokenBindingResolution}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function resolveMatrixLabel(
  locale: Locale,
  label: ComponentVariant['label'] | ComponentSize['label'],
  fallback: string,
) {
  const resolved = resolveLocalizedStringWithFallback({
    localizedString: toResolvableLocalizedString(label),
    locale,
  });

  return resolved.value || fallback;
}

export function getResolvedStyleValue(
  tokenBindingResolution: ComponentTokenBindingResolution,
  key: string,
): string | number | undefined {
  const value = tokenBindingResolution.bindings[key]?.resolvedValue;

  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  return undefined;
}

export function getResolvedStringStyleValue(
  tokenBindingResolution: ComponentTokenBindingResolution,
  key: string,
): string | undefined {
  const value = tokenBindingResolution.bindings[key]?.resolvedValue;

  return typeof value === 'string' ? value : undefined;
}

export function createPreviewTokenStyles(
  tokenBindingResolution: ComponentTokenBindingResolution,
): CSSProperties {
  return {
    backgroundColor: getResolvedStringStyleValue(
      tokenBindingResolution,
      'background',
    ),
    color: getResolvedStringStyleValue(tokenBindingResolution, 'foreground'),
    borderColor: getResolvedStringStyleValue(tokenBindingResolution, 'border'),
    borderRadius: getResolvedStyleValue(tokenBindingResolution, 'radius'),
    padding: getResolvedStyleValue(tokenBindingResolution, 'padding'),
    paddingInline: getResolvedStyleValue(tokenBindingResolution, 'paddingX'),
    paddingBlock: getResolvedStyleValue(tokenBindingResolution, 'paddingY'),
    transitionDuration:
      getResolvedStringStyleValue(tokenBindingResolution, 'duration') ??
      getResolvedStringStyleValue(tokenBindingResolution, 'motion'),
  };
}

export function ComponentPreview({
  type,
  name,
  variantKey,
  sizeKey,
  stateKey,
  tokenBindingResolution,
}: {
  type: ComponentRegistryItem['type'];
  name: string;
  variantKey: string;
  sizeKey: string;
  stateKey: string;
  tokenBindingResolution: ComponentTokenBindingResolution;
}) {
  const normalizedStateKey = stateKey.toLowerCase();
  const isDisabled = normalizedStateKey.includes('disabled');
  const isFocus = normalizedStateKey.includes('focus');
  const isError =
    normalizedStateKey.includes('error') ||
    normalizedStateKey.includes('invalid');
  const isOpen = normalizedStateKey.includes('open');
  const isLoading = normalizedStateKey.includes('loading');
  const isHover = normalizedStateKey.includes('hover');
  const isActive = normalizedStateKey.includes('active');
  const size = getPreviewSizeCategory(sizeKey);
  const previewTokenStyles = createPreviewTokenStyles(tokenBindingResolution);

  if (type === 'textField') {
    return (
      <div className="w-full min-w-0">
        <span className="sr-only">{name}</span>
        <div
          style={previewTokenStyles}
          className={[
            'flex w-full items-center rounded-md border px-2 text-left',
            size === 'small'
              ? 'min-h-8 text-[0.6875rem]'
              : size === 'large'
                ? 'min-h-11 text-sm'
                : 'min-h-9 text-xs',
            isError
              ? 'border-action-danger text-action-danger'
              : isFocus
                ? 'border-action-primary ring-action-primary/25 ring-2'
                : 'border-border-subtle',
            isDisabled
              ? 'bg-background-subtle text-content-tertiary'
              : 'bg-surface-primary text-content-primary',
          ].join(' ')}
        >
          {isLoading ? '…' : variantKey}
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div
        style={previewTokenStyles}
        className={[
          'w-full rounded-md border p-2',
          size === 'small'
            ? 'text-[0.6875rem]'
            : size === 'large'
              ? 'text-sm'
              : 'text-xs',
          isFocus
            ? 'border-action-primary ring-action-primary/25 ring-2'
            : 'border-border-subtle',
          isDisabled ? 'opacity-50' : '',
        ].join(' ')}
      >
        <p className="truncate font-semibold">{name}</p>
        <p className="text-content-tertiary mt-1 truncate font-mono text-[0.625rem]">
          {variantKey}
        </p>
      </div>
    );
  }

  if (type === 'alert') {
    return (
      <div
        style={previewTokenStyles}
        className={[
          'w-full rounded-md border px-2 py-1.5 text-center font-semibold',
          size === 'large' ? 'text-xs' : 'text-[0.6875rem]',
          isError || variantKey.toLowerCase().includes('danger')
            ? 'border-action-danger/30 bg-action-danger/10 text-action-danger'
            : 'border-action-warning/30 bg-action-warning/10 text-action-warning',
          isDisabled ? 'opacity-50' : '',
        ].join(' ')}
      >
        {isLoading ? '…' : name}
      </div>
    );
  }

  if (type === 'dialog') {
    return (
      <div className="border-border-subtle bg-background-subtle w-full rounded-md border p-1.5">
        <div
          style={previewTokenStyles}
          className={[
            'rounded-md border p-2',
            size === 'small'
              ? 'text-[0.625rem]'
              : size === 'large'
                ? 'text-xs'
                : 'text-[0.6875rem]',
            isOpen
              ? 'border-action-primary bg-surface-primary'
              : 'border-border-subtle bg-surface-primary opacity-70',
          ].join(' ')}
        >
          <p className="truncate font-semibold">{name}</p>
        </div>
      </div>
    );
  }

  const variantTone = getButtonVariantTone(variantKey);
  const structuralTokenStyles = getStructuralTokenStyles(previewTokenStyles);

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      tabIndex={-1}
      style={
        variantTone === 'primary' ? previewTokenStyles : structuralTokenStyles
      }
      className={[
        'rounded-md border font-semibold whitespace-nowrap transition',
        size === 'small'
          ? 'min-h-8 px-2.5 py-1 text-[0.6875rem]'
          : size === 'large'
            ? 'min-h-10 px-4 py-2 text-sm'
            : 'min-h-9 px-3 py-1.5 text-xs',
        variantTone === 'primary'
          ? 'border-action-primary bg-action-primary text-action-primary-content'
          : variantTone === 'danger'
            ? 'border-action-danger bg-action-danger text-content-inverse'
            : variantTone === 'ghost'
              ? 'text-content-primary border-transparent bg-transparent'
              : 'border-border-subtle bg-surface-primary text-content-primary',
        isFocus ? 'ring-action-primary/30 ring-2' : '',
        isHover ? 'shadow-sm brightness-95' : '',
        isActive ? 'translate-y-px' : '',
        isDisabled ? 'cursor-not-allowed opacity-45' : '',
      ].join(' ')}
    >
      {isLoading ? '…' : name}
    </button>
  );
}

function getButtonVariantTone(
  variantKey: string,
): 'primary' | 'secondary' | 'ghost' | 'danger' {
  const normalizedVariantKey = variantKey.toLowerCase();

  if (
    normalizedVariantKey.includes('danger') ||
    normalizedVariantKey.includes('destructive')
  ) {
    return 'danger';
  }

  if (
    normalizedVariantKey.includes('ghost') ||
    normalizedVariantKey.includes('tertiary') ||
    normalizedVariantKey.includes('link')
  ) {
    return 'ghost';
  }

  if (
    normalizedVariantKey.includes('primary') ||
    normalizedVariantKey.includes('main')
  ) {
    return 'primary';
  }

  return 'secondary';
}

function getStructuralTokenStyles(styles: CSSProperties): CSSProperties {
  return {
    borderRadius: styles.borderRadius,
    padding: styles.padding,
    paddingInline: styles.paddingInline,
    paddingBlock: styles.paddingBlock,
    transitionDuration: styles.transitionDuration,
  };
}
