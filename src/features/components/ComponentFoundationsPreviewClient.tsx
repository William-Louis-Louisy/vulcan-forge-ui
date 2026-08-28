'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import type { ComponentRegistryItem } from './components-registry.utils';
import {
  createComponentPreviewSemanticPalette,
  createComponentTokenBindingResolution,
} from './component-token-bindings.utils';
import { isComponentTokenBindingRendered } from './component-token-binding-inspector.utils';
import { useComponentContractPreview } from './ComponentContractPreviewContext';
import {
  ComponentInstancePreviewBrowser,
  ComponentMatrixPreviewBrowser,
} from './ComponentPreviewConfigurationBrowser';

type RawTokenSet = {
  type: string;
  name: string;
  tokens: unknown;
};

export function ComponentFoundationsPreviewClient({
  locale,
  component,
  rawTokenSets,
  mode,
}: {
  locale: Locale;
  component: ComponentRegistryItem;
  rawTokenSets: RawTokenSet[];
  mode: 'instance' | 'matrix';
}) {
  const t = useTranslations('ComponentsRegistryPage');
  const previewContext = useComponentContractPreview();
  const contract = previewContext?.contract ?? component.contract;
  const tokenBindingResolution = useMemo(
    () =>
      createComponentTokenBindingResolution({
        bindings: contract.tokenBindings,
        rawTokenSets,
      }),
    [contract.tokenBindings, rawTokenSets],
  );
  const semanticPalette = useMemo(
    () => createComponentPreviewSemanticPalette(rawTokenSets),
    [rawTokenSets],
  );
  const hasFallback =
    contract.variants.length === 0 || contract.sizes.length === 0;
  const missingStatusTokenPaths = semanticPalette.missingStatusTones
    .map((tone) => `color.semantic.status.${tone}`)
    .join(', ');
  const unrenderedBindingKeys = contract.tokenBindings
    .filter(
      (binding) =>
        !isComponentTokenBindingRendered({
          key: binding.key,
          componentType: component.type,
        }),
    )
    .map((binding) => binding.key.trim())
    .filter((key) => key.length > 0);
  const browserLabels = {
    variant: t('editor.variants.axis'),
    size: t('editor.sizes.axis'),
    state: t('foundationsPreview.state'),
    baseState: t('foundationsPreview.baseState'),
    editDefinition: t('workspace.matrix.editDefinition'),
    instanceDescription: t('workspace.instance.description'),
    matrixDescription: t('workspace.matrix.description'),
    useCombination: t('workspace.matrix.useCombination'),
    selectedCombination: t('workspace.matrix.selectedCombination'),
  };

  return (
    <section className="border-border-subtle min-w-0 border-b p-3 sm:p-4">
      <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
        {mode === 'matrix'
          ? t('workspace.matrix.title')
          : t('workspace.instance.title')}
      </p>

      {contract.tokenBindings.length === 0 ? (
        <div className="border-border-subtle bg-background-subtle text-content-secondary mt-3 rounded-md border px-3 py-2 text-xs leading-5">
          {t('foundationsPreview.noTokenBindingsNotice')}
        </div>
      ) : null}

      {unrenderedBindingKeys.length > 0 ? (
        <div className="border-action-info/30 bg-action-info/10 text-action-info mt-3 rounded-md border px-3 py-2 text-xs leading-5 [overflow-wrap:anywhere]">
          {t('foundationsPreview.unrenderedBindingsNotice', {
            keys: unrenderedBindingKeys.join(', '),
          })}
        </div>
      ) : null}

      {hasFallback ? (
        <div className="border-action-warning/30 bg-action-warning/10 text-action-warning mt-3 rounded-md border px-3 py-2 text-xs leading-5">
          {t('foundationsPreview.incompleteMatrixNotice')}
        </div>
      ) : null}

      {component.type === 'alert' &&
      semanticPalette.missingStatusTones.length > 0 ? (
        <div className="border-action-warning/30 bg-action-warning/10 text-action-warning mt-3 rounded-md border px-3 py-2 text-xs leading-5 [overflow-wrap:anywhere]">
          {t('foundationsPreview.missingStatusColorsNotice', {
            paths: missingStatusTokenPaths,
          })}
        </div>
      ) : null}

      <div className="mt-3 max-w-full min-w-0">
        {mode === 'matrix' ? (
          <ComponentMatrixPreviewBrowser
            locale={locale}
            component={component}
            labels={browserLabels}
            tokenBindingResolution={tokenBindingResolution}
            semanticPalette={semanticPalette}
          />
        ) : (
          <ComponentInstancePreviewBrowser
            locale={locale}
            component={component}
            labels={browserLabels}
            tokenBindingResolution={tokenBindingResolution}
            semanticPalette={semanticPalette}
          />
        )}
      </div>

      {Object.keys(tokenBindingResolution.bindings).length > 0 ? (
        <div className="border-border-subtle bg-background-subtle mt-4 min-w-0 rounded-lg border p-3">
          <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
            {t('foundationsPreview.resolvedTokens')}
          </p>

          <dl className="mt-3 grid min-w-0 gap-2">
            {Object.values(tokenBindingResolution.bindings).map((binding) => (
              <div
                key={binding.key}
                className="flex min-w-0 items-center justify-between gap-3 text-xs"
              >
                <dt className="text-content-secondary min-w-0 truncate">
                  {binding.key}
                </dt>
                <dd className="text-content-primary max-w-[55%] min-w-0 truncate font-mono text-[0.6875rem]">
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
          {t('foundationsPreview.tokenBindingWarning', {
            missing: tokenBindingResolution.missingBindings.length,
            invalid: tokenBindingResolution.invalidTokenSetsCount,
          })}
        </div>
      ) : null}
    </section>
  );
}
