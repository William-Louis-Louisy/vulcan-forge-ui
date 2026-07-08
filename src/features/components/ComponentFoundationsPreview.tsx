import type { Locale } from '@/i18n/routing';
import {
  ComponentVisualMatrix,
  createVisualMatrixAxes,
} from './ComponentVisualMatrix';
import type { ComponentRegistryItem } from './components-registry.utils';
import type { ComponentTokenBindingResolution } from './component-token-bindings.utils';
import type { ComponentsRegistryTranslator } from '@/app/[locale]/app/projects/[projectSlug]/components/page';

export function ComponentFoundationsPreviewShell({
  t,
  locale,
  component,
  tokenBindingResolution,
}: {
  t: ComponentsRegistryTranslator;
  locale: Locale;
  component: ComponentRegistryItem;
  tokenBindingResolution: ComponentTokenBindingResolution;
}) {
  const { hasFallback } = createVisualMatrixAxes(component.contract);

  return (
    <section className="border-border-subtle border-b p-4">
      <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
        {t('foundationsPreview.title')}
      </p>

      {component.contract.tokenBindings.length === 0 ? (
        <div className="border-border-subtle bg-background-subtle text-content-secondary mt-3 rounded-md border px-3 py-2 text-xs leading-5">
          {t('foundationsPreview.noTokenBindingsNotice')}
        </div>
      ) : null}

      {hasFallback ? (
        <div className="border-action-warning/30 bg-action-warning/10 text-action-warning mt-3 rounded-md border px-3 py-2 text-xs leading-5">
          {t('foundationsPreview.incompleteMatrixNotice')}
        </div>
      ) : null}

      <div className="mt-3">
        <ComponentVisualMatrix
          key={component.id}
          locale={locale}
          component={component}
          labels={{
            baseState: t('foundationsPreview.baseState'),
            state: t('foundationsPreview.state'),
          }}
          tokenBindingResolution={tokenBindingResolution}
        />
      </div>

      {Object.keys(tokenBindingResolution.bindings).length > 0 ? (
        <div className="border-border-subtle bg-background-subtle mt-4 rounded-lg border p-3">
          <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
            {t('foundationsPreview.resolvedTokens')}
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
          {t('foundationsPreview.tokenBindingWarning', {
            missing: tokenBindingResolution.missingBindings.length,
            invalid: tokenBindingResolution.invalidTokenSetsCount,
          })}
        </div>
      ) : null}
    </section>
  );
}
