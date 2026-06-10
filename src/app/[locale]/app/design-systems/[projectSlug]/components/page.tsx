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

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border-subtle bg-background-subtle rounded-2xl border p-4">
      <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
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
  component,
}: {
  t: ComponentsRegistryTranslator;
  component: ComponentRegistryItem;
}) {
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

      <div className="mt-5 grid gap-3">
        <DetailMetric
          label={t('details.variants')}
          value={String(component.contract.variants.length)}
        />

        <DetailMetric
          label={t('details.states')}
          value={String(component.contract.states.length)}
        />

        <DetailMetric
          label={t('details.accessibilityRules')}
          value={String(component.contract.accessibility.length)}
        />
      </div>

      <div className="border-border-subtle bg-background-subtle mt-5 rounded-2xl border p-4">
        <p className="text-sm font-semibold">
          {t('foundationsPreview.matrixPlaceholderTitle')}
        </p>

        <p className="text-content-secondary mt-2 text-sm leading-6">
          {t('foundationsPreview.matrixPlaceholderDescription')}
        </p>
      </div>
    </section>
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

      <div className="border-border-subtle bg-background-subtle mt-5 rounded-2xl border p-4">
        <p className="text-sm font-semibold">{t('aiContract.purpose')}</p>

        <p className="text-content-secondary mt-2 text-sm leading-6">
          {purpose.value}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        <p className="text-sm font-semibold">{t('aiContract.signals')}</p>

        <ul className="text-content-secondary grid gap-2 text-sm leading-6">
          <li>
            {t('aiContract.signalVariants', {
              count: component.contract.variants.length,
            })}
          </li>
          <li>
            {t('aiContract.signalStates', {
              count: component.contract.states.length,
            })}
          </li>
          <li>
            {t('aiContract.signalForbiddenPatterns', {
              count: component.contract.forbiddenPatterns.length,
            })}
          </li>
        </ul>
      </div>
    </section>
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
