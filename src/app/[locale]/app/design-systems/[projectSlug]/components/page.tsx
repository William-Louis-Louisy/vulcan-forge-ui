import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import {
  ComponentContractEditor,
  type ComponentContractEditorLabels,
} from '@/features/components/ComponentContractEditor';
import {
  createComponentRegistryItems,
  groupComponentRegistryItemsByCategory,
  type ComponentRegistryItem,
  type ComponentRegistryCategoryGroup,
} from '@/features/components/components-registry.utils';
import { resolveLocalizedStringWithFallback } from '@/domain/i18n';
import { getComponentsRegistryPageData } from '@/features/components/components-registry.queries';

type ComponentsRegistryPageProps = {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
  searchParams: Promise<{
    component?: string;
    q?: string;
  }>;
};

type ComponentsRegistryTranslator = Awaited<ReturnType<typeof getTranslations>>;

type ResolvableLocalizedString = Parameters<
  typeof resolveLocalizedStringWithFallback
>[0]['localizedString'];

type ComponentLocalizedString = {
  en?: string | undefined;
  fr?: string | undefined;
};

function toResolvableLocalizedString(
  localizedString: ComponentLocalizedString,
): ResolvableLocalizedString {
  const normalizedLocalizedString: ResolvableLocalizedString = {};

  if (typeof localizedString.en === 'string') {
    normalizedLocalizedString.en = localizedString.en;
  }

  if (typeof localizedString.fr === 'string') {
    normalizedLocalizedString.fr = localizedString.fr;
  }

  return normalizedLocalizedString;
}

export default async function ComponentsRegistryPage({
  params,
  searchParams,
}: ComponentsRegistryPageProps) {
  const { locale: requestedLocale, projectSlug } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('ComponentsRegistryPage');
  const { component: selectedComponentType, q } = await searchParams;
  const componentFilterQuery = q?.trim() ?? '';

  const pageData = await getComponentsRegistryPageData({
    userId: session.user.id,
    projectSlug,
  });

  if (!pageData) {
    notFound();
  }

  const registry = createComponentRegistryItems(pageData.componentContracts);

  const filteredRegistryItems = filterComponentRegistryItems({
    items: registry.items,
    query: componentFilterQuery,
  });

  const componentGroups = groupComponentRegistryItemsByCategory(
    filteredRegistryItems,
  );

  const selectedComponent =
    filteredRegistryItems.find((item) => item.type === selectedComponentType) ??
    filteredRegistryItems[0] ??
    registry.items[0] ??
    null;

  return (
    <section className="flex h-screen min-h-0 flex-col overflow-hidden">
      {registry.invalidCount > 0 ? (
        <div className="border-action-warning/30 bg-action-warning/10 text-action-warning mt-8 shrink-0 rounded-3xl border p-5 text-sm font-semibold">
          {t('invalidContractsWarning', { count: registry.invalidCount })}
        </div>
      ) : null}

      {registry.items.length > 0 ? (
        <div className="grid min-h-0 flex-1 overflow-hidden xl:grid-cols-[minmax(18rem,0.75fr)_minmax(0,1.35fr)_minmax(18rem,0.9fr)]">
          <aside className="border-border-subtle h-full min-h-0 overflow-y-auto border-r">
            <ComponentList
              t={t}
              projectSlug={pageData.project.slug}
              componentGroups={componentGroups}
              selectedComponentType={selectedComponent?.type ?? null}
              filterQuery={componentFilterQuery}
            />
          </aside>

          <main
            data-save-context-scroll-container={
              selectedComponent
                ? `component-contract:${pageData.project.slug}:${selectedComponent.type}`
                : undefined
            }
            className="min-h-0 min-w-0 overflow-y-auto"
          >
            {selectedComponent ? (
              <ComponentDetails
                t={t}
                locale={locale}
                component={selectedComponent}
                projectSlug={pageData.project.slug}
              />
            ) : null}
          </main>

          <aside className="border-border-subtle grid h-full min-h-0 content-start gap-6 overflow-y-auto border-l">
            {selectedComponent ? (
              <>
                <ComponentFoundationsPreviewShell
                  t={t}
                  locale={locale}
                  component={selectedComponent}
                />
                <ComponentAiContractShell
                  t={t}
                  locale={locale}
                  component={selectedComponent}
                />
              </>
            ) : null}
          </aside>
        </div>
      ) : (
        <EmptyState
          title={t('states.emptyTitle')}
          description={t('states.emptyDescription')}
        />
      )}
    </section>
  );
}

function ComponentList({
  t,
  projectSlug,
  componentGroups,
  selectedComponentType,
  filterQuery,
}: {
  t: ComponentsRegistryTranslator;
  projectSlug: string;
  componentGroups: ComponentRegistryCategoryGroup[];
  selectedComponentType: string | null;
  filterQuery: string;
}) {
  return (
    <section className="p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t('list.title')}
        </h2>

        <button
          type="button"
          disabled
          aria-label={t('list.addDisabled')}
          className="border-border-subtle bg-background-subtle text-content-primary flex size-9 items-center justify-center rounded-xl border text-lg font-semibold opacity-70"
        >
          +
        </button>
      </div>

      <form
        action={`/app/design-systems/${projectSlug}/components`}
        className="mt-4"
      >
        <input
          type="search"
          name="q"
          defaultValue={filterQuery}
          placeholder={t('list.filterPlaceholder')}
          className="border-border-subtle bg-background-subtle focus:border-action-primary w-full rounded-xl border px-3 py-2 text-sm outline-none"
        />
      </form>

      {componentGroups.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {componentGroups.map((group) => (
            <ComponentCategorySection
              key={group.category}
              t={t}
              projectSlug={projectSlug}
              group={group}
              selectedComponentType={selectedComponentType}
              filterQuery={filterQuery}
            />
          ))}
        </div>
      ) : (
        <p className="text-content-secondary mt-6 text-sm">
          {t('list.emptyFilter')}
        </p>
      )}
    </section>
  );
}

function ComponentDetails({
  t,
  locale,
  projectSlug,
  component,
}: {
  t: ComponentsRegistryTranslator;
  locale: Locale;
  projectSlug: string;
  component: ComponentRegistryItem;
}) {
  const purpose = resolveLocalizedStringWithFallback({
    localizedString: toResolvableLocalizedString(component.contract.purpose),
    locale,
  });

  return (
    <article className="px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
            {t(`categories.${component.category}`)}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            {component.name}
          </h2>
          <p className="text-content-secondary mt-3 max-w-2xl text-sm leading-6">
            {purpose.value}
          </p>
        </div>

        <StatusBadge t={t} status={component.status} />
      </div>
      <div className="mt-8">
        <ComponentContractEditor
          locale={locale}
          projectSlug={projectSlug}
          contract={component.contract}
          labels={createComponentContractEditorLabels(t)}
        />
      </div>
    </article>
  );
}

function StatusBadge({
  t,
  status,
}: {
  t: ComponentsRegistryTranslator;
  status: ComponentRegistryItem['status'];
}) {
  const statusClassName: Record<ComponentRegistryItem['status'], string> = {
    ready: 'border-action-success/30 bg-action-success/10 text-action-success',
    draft: 'border-action-warning/30 bg-action-warning/10 text-action-warning',
    deprecated:
      'border-border-subtle bg-background-subtle text-content-tertiary',
  };

  return (
    <span
      className={[
        'rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap',
        statusClassName[status],
      ].join(' ')}
    >
      {t(`statuses.${status}`)}
    </span>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-border-default mt-10 rounded-3xl border border-dashed p-10 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-content-secondary mx-auto mt-4 max-w-xl text-sm leading-6">
        {description}
      </p>
    </div>
  );
}

function createComponentContractEditorLabels(
  t: ComponentsRegistryTranslator,
): ComponentContractEditorLabels {
  return {
    title: t('editor.title'),
    description: t('editor.description'),
    unsavedNotice: t('editor.unsavedNotice'),
    save: {
      action: t('editor.save.action'),
      saving: t('editor.save.saving'),
      saved: t('editor.save.saved'),
      unsaved: t('editor.save.unsaved'),
      invalid: t('editor.save.invalid'),
      errors: {
        unauthorized: t('editor.save.errors.unauthorized'),
        projectNotFound: t('editor.save.errors.projectNotFound'),
        componentContractNotFound: t(
          'editor.save.errors.componentContractNotFound',
        ),
        invalidPayload: t('editor.save.errors.invalidPayload'),
        invalidContract: t('editor.save.errors.invalidContract'),
        unexpected: t('editor.save.errors.unexpected'),
      },
    },
    validationTitle: t('editor.validationTitle'),
    basics: {
      title: t('editor.basics.title'),
      name: t('editor.basics.name'),
      status: t('editor.basics.status'),
      purposeEn: t('editor.basics.purposeEn'),
      purposeFr: t('editor.basics.purposeFr'),
    },
    anatomy: {
      title: t('editor.anatomy.title'),
      description: t('editor.anatomy.description'),
      add: t('editor.anatomy.add'),
    },
    variants: {
      title: t('editor.variants.title'),
      add: t('editor.variants.add'),
    },
    states: {
      title: t('editor.states.title'),
      add: t('editor.states.add'),
    },
    accessibility: {
      title: t('editor.accessibility.title'),
      add: t('editor.accessibility.add'),
      severity: t('editor.accessibility.severity'),
    },
    forbiddenPatterns: {
      title: t('editor.forbiddenPatterns.title'),
      add: t('editor.forbiddenPatterns.add'),
    },
    fields: {
      key: t('editor.fields.key'),
      labelEn: t('editor.fields.labelEn'),
      labelFr: t('editor.fields.labelFr'),
      descriptionEn: t('editor.fields.descriptionEn'),
      descriptionFr: t('editor.fields.descriptionFr'),
      patternEn: t('editor.fields.patternEn'),
      patternFr: t('editor.fields.patternFr'),
      remove: t('editor.fields.remove'),
    },
    statuses: {
      draft: t('statuses.draft'),
      ready: t('statuses.ready'),
      deprecated: t('statuses.deprecated'),
    },
    severities: {
      info: t('severity.info'),
      warning: t('severity.warning'),
      critical: t('severity.critical'),
    },
    localizedContent: {
      title: t('editor.localizedContent.title'),
      editing: t('editor.localizedContent.editing'),
      schemaNotice: t('editor.localizedContent.schemaNotice'),
      locales: {
        en: t('editor.localizedContent.locales.en'),
        fr: t('editor.localizedContent.locales.fr'),
      },
    },
    metadata: {
      title: t('editor.metadata.title'),
    },
  };
}

function ComponentFoundationsPreviewShell({
  t,
  locale,
  component,
}: {
  t: ComponentsRegistryTranslator;
  locale: Locale;
  component: ComponentRegistryItem;
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
          />
        ))}
      </div>
    </section>
  );
}

function ComponentVariantPreviewGroup({
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

function ComponentStatePreviewCard({
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

function ComponentPreview({
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

function ComponentAiContractShell({
  t,
  locale,
  component,
}: {
  t: ComponentsRegistryTranslator;
  locale: Locale;
  component: ComponentRegistryItem;
}) {
  const purpose = resolveLocalizedStringWithFallback({
    localizedString: toResolvableLocalizedString(component.contract.purpose),
    locale,
  });

  const missingSourceData = getComponentAiContractMissingSourceData(component);
  const modelGaps = getComponentAiContractModelGaps();

  return (
    <section className="p-4">
      <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {t('aiContract.eyebrow')}
      </p>

      <h2 className="mt-2 text-xl font-semibold tracking-tight">
        {t('aiContract.title')}
      </h2>

      <p className="text-content-secondary mt-3 text-sm leading-6">
        {t('aiContract.description')}
      </p>

      <div className="mt-5 rounded-2xl bg-[#0B0F14] p-4 font-mono text-[12px] leading-6 text-slate-100">
        <AiContractSection title={t('aiContract.sections.identity')}>
          <AiContractLine
            label={t('aiContract.fields.component')}
            value={component.name}
          />
          <AiContractLine
            label={t('aiContract.fields.type')}
            value={component.type}
          />
          <AiContractLine
            label={t('aiContract.fields.category')}
            value={t(`categories.${component.category}`)}
          />
          <AiContractLine
            label={t('aiContract.fields.status')}
            value={t(`statuses.${component.status}`)}
          />
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.purpose')}>
          <p className="text-slate-300">
            {purpose.value || t('aiContract.empty.purpose')}
          </p>
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.allowedVariants')}>
          <AiContractLocalizedList
            emptyLabel={t('aiContract.empty.variants')}
            items={component.contract.variants.map((variant) => ({
              key: variant.key,
              label: resolveLocalizedStringWithFallback({
                localizedString: toResolvableLocalizedString(variant.label),
                locale,
              }).value,
            }))}
          />
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.allowedStates')}>
          <AiContractLocalizedList
            emptyLabel={t('aiContract.empty.states')}
            items={component.contract.states.map((state) => ({
              key: state.key,
              label: resolveLocalizedStringWithFallback({
                localizedString: toResolvableLocalizedString(state.label),
                locale,
              }).value,
            }))}
          />
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.accessibilityRules')}>
          <AiContractAccessibilityList
            t={t}
            locale={locale}
            rules={component.contract.accessibility}
          />
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.forbiddenPatterns')}>
          <AiContractTextList
            emptyLabel={t('aiContract.empty.forbiddenPatterns')}
            items={component.contract.forbiddenPatterns.map((pattern) =>
              resolveLocalizedStringWithFallback({
                localizedString: toResolvableLocalizedString(pattern),
                locale,
              }),
            )}
          />
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.missingSourceData')}>
          <AiContractSimpleList
            emptyLabel={t('aiContract.empty.missingSourceData')}
            items={missingSourceData.map((item) =>
              t(`aiContract.missingSourceData.${item}`),
            )}
          />
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.modelGaps')}>
          <AiContractSimpleList
            emptyLabel={t('aiContract.empty.modelGaps')}
            items={modelGaps.map((item) => t(`aiContract.modelGaps.${item}`))}
          />
        </AiContractSection>
      </div>
    </section>
  );
}

type AiContractMissingSourceDataKey =
  | 'anatomy'
  | 'variants'
  | 'states'
  | 'accessibilityRules'
  | 'forbiddenPatterns';

type AiContractModelGapKey =
  | 'usageGuidelines'
  | 'contentGuidelines'
  | 'tokenBindings';

function getComponentAiContractMissingSourceData(
  component: ComponentRegistryItem,
): AiContractMissingSourceDataKey[] {
  const missingSourceData: AiContractMissingSourceDataKey[] = [];

  if (component.contract.anatomy.length === 0) {
    missingSourceData.push('anatomy');
  }

  if (component.contract.variants.length === 0) {
    missingSourceData.push('variants');
  }

  if (component.contract.states.length === 0) {
    missingSourceData.push('states');
  }

  if (component.contract.accessibility.length === 0) {
    missingSourceData.push('accessibilityRules');
  }

  if (component.contract.forbiddenPatterns.length === 0) {
    missingSourceData.push('forbiddenPatterns');
  }

  return missingSourceData;
}

function getComponentAiContractModelGaps(): AiContractModelGapKey[] {
  return ['usageGuidelines', 'contentGuidelines', 'tokenBindings'];
}

function AiContractSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="not-first:mt-5">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
        {title}
      </p>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function AiContractLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="text-slate-500">{label}: </span>
      <span className="text-slate-200">{value}</span>
    </p>
  );
}

function AiContractLocalizedList({
  items,
  emptyLabel,
}: {
  items: Array<{
    key: string;
    label: string;
  }>;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-slate-500">{emptyLabel}</p>;
  }

  return (
    <ul className="grid gap-1">
      {items.map((item) => (
        <li key={item.key}>
          <span className="text-slate-500">- {item.key}</span>
          {item.label ? (
            <span className="text-slate-300"> — {item.label}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function AiContractAccessibilityList({
  t,
  locale,
  rules,
}: {
  t: ComponentsRegistryTranslator;
  locale: Locale;
  rules: ComponentRegistryItem['contract']['accessibility'];
}) {
  if (rules.length === 0) {
    return (
      <p className="text-slate-500">{t('aiContract.empty.accessibility')}</p>
    );
  }

  return (
    <ul className="grid gap-2">
      {rules.map((rule) => {
        const description = resolveLocalizedStringWithFallback({
          localizedString: toResolvableLocalizedString(rule.description),
          locale,
        });

        return (
          <li key={rule.key}>
            <p>
              <span className="text-slate-500">- {rule.key}</span>
              <span className="text-slate-300">
                {' '}
                [{t(`severity.${rule.severity}`)}]
              </span>
            </p>
            {description.value ? (
              <p className="pl-4 text-slate-400">{description.value}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function AiContractTextList({
  items,
  emptyLabel,
}: {
  items: Array<{
    value: string;
  }>;
  emptyLabel: string;
}) {
  const availableItems = items.filter((item) => item.value);

  if (availableItems.length === 0) {
    return <p className="text-slate-500">{emptyLabel}</p>;
  }

  return (
    <ul className="grid gap-1">
      {availableItems.map((item, index) => (
        <li key={`${item.value}-${index}`} className="text-slate-300">
          - {item.value}
        </li>
      ))}
    </ul>
  );
}

function AiContractSimpleList({
  items,
  emptyLabel,
}: {
  items: string[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-slate-500">{emptyLabel}</p>;
  }

  return (
    <ul className="grid gap-1">
      {items.map((item) => (
        <li key={item} className="text-slate-300">
          - {item}
        </li>
      ))}
    </ul>
  );
}

function ComponentCategorySection({
  t,
  projectSlug,
  group,
  selectedComponentType,
  filterQuery,
}: {
  t: ComponentsRegistryTranslator;
  projectSlug: string;
  group: ComponentRegistryCategoryGroup;
  selectedComponentType: string | null;
  filterQuery: string;
}) {
  return (
    <section>
      <h3 className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {t(`categories.${group.category}`)}
      </h3>

      <div className="mt-3 grid">
        {group.items.map((component) => (
          <ComponentNavigationRow
            key={component.id}
            t={t}
            projectSlug={projectSlug}
            component={component}
            isSelected={component.type === selectedComponentType}
            filterQuery={filterQuery}
          />
        ))}
      </div>
    </section>
  );
}

function ComponentNavigationRow({
  t,
  projectSlug,
  component,
  isSelected,
  filterQuery,
}: {
  t: ComponentsRegistryTranslator;
  projectSlug: string;
  component: ComponentRegistryItem;
  isSelected: boolean;
  filterQuery: string;
}) {
  return (
    <Link
      href={createComponentNavigationHref({
        projectSlug,
        componentType: component.type,
        filterQuery,
      })}
      aria-current={isSelected ? 'page' : undefined}
      className={[
        'border-l-2 px-4 py-3 transition',
        isSelected
          ? 'border-action-primary bg-action-primary/10'
          : 'hover:bg-background-subtle border-transparent',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold">{component.name}</h4>

          <p className="text-content-secondary mt-1 text-sm">
            {formatComponentPlatforms(t, component.platforms)}
          </p>
        </div>

        <StatusBadge t={t} status={component.status} />
      </div>
    </Link>
  );
}

function filterComponentRegistryItems({
  items,
  query,
}: {
  items: ComponentRegistryItem[];
  query: string;
}) {
  if (!query) {
    return items;
  }

  const normalizedQuery = query.toLowerCase();

  return items.filter((item) =>
    [item.name, item.type, item.category, ...item.platforms]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

function createComponentNavigationHref({
  projectSlug,
  componentType,
  filterQuery,
}: {
  projectSlug: string;
  componentType: string;
  filterQuery: string;
}) {
  const params = new URLSearchParams({
    component: componentType,
  });

  if (filterQuery) {
    params.set('q', filterQuery);
  }

  return `/app/design-systems/${projectSlug}/components?${params.toString()}`;
}

function formatComponentPlatforms(
  t: ComponentsRegistryTranslator,
  platforms: ComponentRegistryItem['platforms'],
) {
  return platforms.map((platform) => t(`platforms.${platform}`)).join(' • ');
}
