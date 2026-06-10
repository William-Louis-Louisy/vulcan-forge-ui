import type { Locale } from '@/i18n/routing';
import { resolveLocalizedStringWithFallback } from '@/domain/i18n';
import type { ComponentRegistryItem } from './components-registry.utils';
import { toResolvableLocalizedString } from './components-registry-page.utils';

export function ComponentVariantPreviewGroup({
  locale,
  component,
  variantKey,
  variantLabel,
  states,
}: {
  locale: Locale;
  component: ComponentRegistryItem;
  variantKey: string;
  variantLabel: ComponentRegistryItem['contract']['variants'][number]['label'];
  states: ComponentRegistryItem['contract']['states'];
}) {
  const label = resolveLocalizedStringWithFallback({
    localizedString: toResolvableLocalizedString(variantLabel),
    locale: locale,
  });

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold">{label.value || variantKey}</h3>

        <span className="text-content-tertiary font-mono text-xs">
          {variantKey}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {states.map((state) => (
          <ComponentStatePreviewCard
            key={`${variantKey}-${state.key}`}
            locale={locale}
            component={component}
            variantKey={variantKey}
            stateKey={state.key}
            stateLabel={state.label}
          />
        ))}
      </div>
    </section>
  );
}

export function ComponentStatePreviewCard({
  locale,
  component,
  variantKey,
  stateKey,
  stateLabel,
}: {
  locale: Locale;
  component: ComponentRegistryItem;
  variantKey: string;
  stateKey: string;
  stateLabel: ComponentRegistryItem['contract']['states'][number]['label'];
}) {
  const label = resolveLocalizedStringWithFallback({
    localizedString: toResolvableLocalizedString(stateLabel),
    locale: locale,
  });

  return (
    <article className="border-border-subtle bg-background-subtle rounded-md border p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold">{label.value || stateKey}</p>

        <span className="text-content-tertiary font-mono text-[11px]">
          {stateKey}
        </span>
      </div>

      <div className="flex min-h-24 items-center justify-center">
        <ComponentPreview
          type={component.type}
          name={component.name}
          variantKey={variantKey}
          stateKey={stateKey}
        />
      </div>
    </article>
  );
}

export function ComponentPreview({
  type,
  name,
  variantKey,
  stateKey,
}: {
  type: ComponentRegistryItem['type'];
  name: string;
  variantKey: string;
  stateKey: string;
}) {
  const isDisabled = stateKey.toLowerCase().includes('disabled');
  const isFocus = stateKey.toLowerCase().includes('focus');
  const isError = stateKey.toLowerCase().includes('error');
  const isOpen = stateKey.toLowerCase().includes('open');

  if (type === 'textField') {
    return (
      <div className="w-full">
        <label className="text-content-secondary text-xs font-semibold">
          {name}
        </label>
        <div
          className={[
            'mt-2 min-h-10 rounded-xl border px-3 py-2 text-sm',
            isError
              ? 'border-action-danger text-action-danger'
              : isFocus
                ? 'border-action-primary'
                : 'border-border-subtle',
            isDisabled
              ? 'bg-background-subtle text-content-tertiary'
              : 'bg-surface-primary text-content-primary',
          ].join(' ')}
        >
          {variantKey}
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div
        className={[
          'w-full rounded-2xl border p-4',
          isFocus ? 'border-action-primary' : 'border-border-subtle',
        ].join(' ')}
      >
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-content-secondary mt-2 text-xs">
          {variantKey} · {stateKey}
        </p>
      </div>
    );
  }

  if (type === 'alert') {
    return (
      <div
        className={[
          'w-full rounded-2xl border p-4 text-sm font-semibold',
          isError
            ? 'border-action-danger/30 bg-action-danger/10 text-action-danger'
            : 'border-action-warning/30 bg-action-warning/10 text-action-warning',
        ].join(' ')}
      >
        {name}
      </div>
    );
  }

  if (type === 'dialog') {
    return (
      <div className="w-full">
        <div className="border-border-subtle bg-background-subtle rounded-2xl border p-3">
          <div
            className={[
              'rounded-xl border p-4',
              isOpen
                ? 'border-action-primary bg-surface-primary'
                : 'border-border-subtle bg-surface-primary opacity-70',
            ].join(' ')}
          >
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-content-secondary mt-2 text-xs">
              {variantKey} · {stateKey}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={[
        'rounded-xl border px-4 py-2 text-sm font-semibold transition',
        variantKey.toLowerCase().includes('primary')
          ? 'bg-action-primary text-action-primary-content border-action-primary'
          : 'border-border-subtle bg-surface-primary text-content-primary',
        isFocus ? 'ring-action-primary/40 ring-2' : '',
        isDisabled ? 'cursor-not-allowed opacity-50' : '',
      ].join(' ')}
    >
      {name}
    </button>
  );
}
