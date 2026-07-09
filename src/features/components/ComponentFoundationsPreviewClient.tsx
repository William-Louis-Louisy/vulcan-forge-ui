'use client';

import { useMemo } from 'react';
import type { Locale } from '@/i18n/routing';
import { ComponentVisualMatrix } from './ComponentVisualMatrix';
import type { ComponentRegistryItem } from './components-registry.utils';
import { createComponentTokenBindingResolution } from './component-token-bindings.utils';
import { useComponentContractPreview } from './ComponentContractPreviewContext';

type RawTokenSet = {
  type: string;
  name: string;
  tokens: unknown;
};

export type ComponentFoundationsPreviewLabels = {
  title: string;
  noTokenBindingsNotice: string;
  incompleteMatrixNotice: string;
  baseState: string;
  state: string;
  resolvedTokens: string;
  tokenBindingWarning: (values: {
    missing: number;
    invalid: number;
  }) => string;
};

export function ComponentFoundationsPreviewClient({
  labels,
  locale,
  component,
  rawTokenSets,
}: {
  labels: ComponentFoundationsPreviewLabels;
  locale: Locale;
  component: ComponentRegistryItem;
  rawTokenSets: RawTokenSet[];
}) {
  const previewContext = useComponentContractPreview();
  const contract = previewContext?.contract ?? component.contract;
  const previewComponent = useMemo(
    () => ({
      ...component,
      name: contract.name,
      status: contract.status,
      contract,
    }),
    [component, contract],
  );
  const tokenBindingResolution = useMemo(
    () =>
      createComponentTokenBindingResolution({
        bindings: contract.tokenBindings,
        rawTokenSets,
      }),
    [contract.tokenBindings, rawTokenSets],
  );
  const hasFallback =
    contract.variants.length === 0 || contract.sizes.length === 0;

  return (
    <section className="border-border-subtle border-b p-4">
      <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
        {labels.title}
      </p>

      {contract.tokenBindings.length === 0 ? (
        <div className="border-border-subtle bg-background-subtle text-content-secondary mt-3 rounded-md border px-3 py-2 text-xs leading-5">
          {labels.noTokenBindingsNotice}
        </div>
      ) : null}

      {hasFallback ? (
        <div className="border-action-warning/30 bg-action-warning/10 text-action-warning mt-3 rounded-md border px-3 py-2 text-xs leading-5">
          {labels.incompleteMatrixNotice}
        </div>
      ) : null}

      <div className="mt-3">
        <ComponentVisualMatrix
          locale={locale}
          component={previewComponent}
          labels={{
            baseState: labels.baseState,
            state: labels.state,
          }}
          tokenBindingResolution={tokenBindingResolution}
        />
      </div>

      {Object.keys(tokenBindingResolution.bindings).length > 0 ? (
        <div className="border-border-subtle bg-background-subtle mt-4 rounded-lg border p-3">
          <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
            {labels.resolvedTokens}
          </p>

          <dl className="mt-3 grid gap-2">
            {Object.values(tokenBindingResolution.bindings).map((binding) => (
              <div
                key={binding.key}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <dt className="text-content-secondary">{binding.key}</dt>
                <dd className="text-content-primary max-w-40 truncate font-mono text-[0.6875rem]">
                  {String(binding.resolvedValue)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {tokenBindingResolution.missingBindings.length > 0 ||
      tokenBindingResolution.invalidTokenSetsCount > 0 ? (
        <div className="border-action-warning/30 bg-action-warning/10 text-action-warning mt-3 rounded-md border px-3 py-2 text-xs leading-5">
          {labels.tokenBindingWarning({
            missing: tokenBindingResolution.missingBindings.length,
            invalid: tokenBindingResolution.invalidTokenSetsCount,
          })}
        </div>
      ) : null}
    </section>
  );
}
