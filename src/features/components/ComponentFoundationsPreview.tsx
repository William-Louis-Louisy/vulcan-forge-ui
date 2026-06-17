import type { Locale } from '@/i18n/routing';
import { ComponentVariantPreviewGroup } from './ComponentVisualMatrix';
import type { ComponentRegistryItem } from './components-registry.utils';
import type { ComponentTokenBindingResolution } from './component-token-bindings.utils';
import type { ComponentsRegistryTranslator } from '@/app/[locale]/app/design-systems/[projectSlug]/components/page';

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
  const variants =
    component.contract.variants.length > 0
      ? component.contract.variants
      : [
          {
            key: 'default',
            label: {
              en: 'Default',
              fr: 'Défaut',
            },
          },
        ];

  const states =
    component.contract.states.length > 0
      ? component.contract.states
      : [
          {
            key: 'default',
            label: {
              en: 'Default',
              fr: 'Défaut',
            },
          },
        ];

  const hasIncompleteMatrix =
    component.contract.variants.length === 0 ||
    component.contract.states.length === 0;

  return (
    <section className="p-4">
      <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {t('foundationsPreview.eyebrow')}
      </p>

      <h2 className="mt-2 text-xl font-semibold tracking-tight">
        {t('foundationsPreview.title')}
      </h2>

      <p className="text-content-secondary mt-3 text-sm leading-6">
        {t('foundationsPreview.description')}
      </p>

      {component.contract.tokenBindings.length === 0 ? (
        <div className="border-border-subtle bg-background-subtle text-content-secondary mt-5 rounded-2xl border p-4 text-sm leading-6">
          {t('foundationsPreview.noTokenBindingsNotice')}
        </div>
      ) : null}

      {hasIncompleteMatrix ? (
        <div className="border-action-warning/30 bg-action-warning/10 text-action-warning mt-5 rounded-2xl border p-4 text-sm leading-6">
          {t('foundationsPreview.incompleteMatrixNotice')}
        </div>
      ) : null}

      <div className="mt-5 grid gap-5">
        {variants.map((variant) => (
          <ComponentVariantPreviewGroup
            key={variant.key}
            locale={locale}
            component={component}
            variantKey={variant.key}
            variantLabel={variant.label}
            states={states}
            tokenBindingResolution={tokenBindingResolution}
          />
        ))}
      </div>

      {Object.keys(tokenBindingResolution.bindings).length > 0 ? (
        <div className="border-border-subtle bg-background-subtle mt-5 rounded-2xl border p-4">
          <p className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase">
            {t('foundationsPreview.resolvedTokens')}
          </p>

          <dl className="mt-3 grid gap-2">
            {Object.values(tokenBindingResolution.bindings).map((binding) => (
              <div
                key={binding.key}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <dt className="text-content-secondary">{binding.key}</dt>
                <dd className="text-content-primary font-mono text-xs">
                  {String(binding.resolvedValue)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {tokenBindingResolution.missingBindings.length > 0 ||
      tokenBindingResolution.invalidTokenSetsCount > 0 ? (
        <div className="border-action-warning/30 bg-action-warning/10 text-action-warning mt-5 rounded-2xl border p-4 text-sm leading-6">
          {t('foundationsPreview.tokenBindingWarning', {
            missing: tokenBindingResolution.missingBindings.length,
            invalid: tokenBindingResolution.invalidTokenSetsCount,
          })}
        </div>
      ) : null}
    </section>
  );
}
