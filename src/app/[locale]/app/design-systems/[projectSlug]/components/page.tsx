import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { type ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { resolveLocalizedStringWithFallback } from '@/domain/i18n';
import { getComponentsRegistryPageData } from '@/features/components/components-registry.queries';
import {
  createComponentRegistryItems,
  type ComponentRegistryItem,
} from '@/features/components/components-registry.utils';

type ComponentsRegistryPageProps = {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
  searchParams: Promise<{
    component?: string;
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
  const { component: selectedComponentType } = await searchParams;

  const pageData = await getComponentsRegistryPageData({
    userId: session.user.id,
    projectSlug,
  });

  if (!pageData) {
    notFound();
  }

  const registry = createComponentRegistryItems(pageData.componentContracts);

  const selectedComponent =
    registry.items.find((item) => item.type === selectedComponentType) ??
    registry.items[0] ??
    null;

  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/design-systems"
          className="text-action-primary text-sm font-semibold"
        >
          {t('backToProjects')}
        </Link>

        <Link
          href={`/app/design-systems/${pageData.project.slug}/tokens?set=color`}
          className="text-action-primary text-sm font-semibold"
        >
          {t('openTokensEditor')}
        </Link>

        <Link
          href={`/app/design-systems/${pageData.project.slug}/themes`}
          className="text-action-primary text-sm font-semibold"
        >
          {t('openThemesEditor')}
        </Link>

        <Link
          href={`/app/design-systems/${pageData.project.slug}/accessibility`}
          className="text-action-primary text-sm font-semibold"
        >
          {t('openAccessibilityCenter')}
        </Link>
      </div>

      <div className="mt-8">
        <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
          {t('eyebrow')}
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {t('title', { projectName: pageData.project.name })}
        </h1>

        <p className="text-content-secondary mt-4 max-w-3xl">
          {t('description')}
        </p>
      </div>

      {registry.invalidCount > 0 ? (
        <div className="border-action-warning/30 bg-action-warning/10 text-action-warning mt-8 rounded-3xl border p-5 text-sm font-semibold">
          {t('invalidContractsWarning', { count: registry.invalidCount })}
        </div>
      ) : null}

      {registry.items.length > 0 ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <ComponentList
            t={t}
            projectSlug={pageData.project.slug}
            components={registry.items}
            selectedComponentType={selectedComponent?.type ?? null}
          />

          {selectedComponent ? (
            <ComponentDetails
              t={t}
              locale={locale}
              component={selectedComponent}
            />
          ) : null}
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
  components,
  selectedComponentType,
}: {
  t: ComponentsRegistryTranslator;
  projectSlug: string;
  components: ComponentRegistryItem[];
  selectedComponentType: string | null;
}) {
  return (
    <section className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-5">
      <h2 className="text-2xl font-semibold tracking-tight">
        {t('list.title')}
      </h2>

      <div className="mt-5 grid gap-3">
        {components.map((component) => {
          const isSelected = component.type === selectedComponentType;

          return (
            <Link
              key={component.id}
              href={`/app/design-systems/${projectSlug}/components?component=${component.type}`}
              aria-current={isSelected ? 'true' : undefined}
              className={[
                'rounded-2xl border p-4 transition',
                isSelected
                  ? 'border-action-primary bg-action-primary/10'
                  : 'border-border-subtle bg-background-subtle hover:border-action-primary/40',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{component.name}</h3>
                  <p className="text-content-secondary mt-1 text-sm">
                    {t(`categories.${component.category}`)}
                  </p>
                </div>

                <StatusBadge t={t} status={component.status} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {component.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="border-border-subtle text-content-secondary rounded-full border px-3 py-1 text-xs font-semibold"
                  >
                    {t(`platforms.${platform}`)}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
                  {t('completeness.label')}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {t(`completeness.levels.${component.completeness.level}`)} ·{' '}
                  {component.completeness.score}%
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ComponentDetails({
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
    <article className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-6">
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

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
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

      <Section title={t('details.anatomy')}>
        {component.contract.anatomy.length > 0 ? (
          <TagList values={component.contract.anatomy} />
        ) : (
          <MutedText>{t('details.empty')}</MutedText>
        )}
      </Section>

      <Section title={t('details.variants')}>
        {component.contract.variants.length > 0 ? (
          <TagList
            values={component.contract.variants.map((variant) => variant.key)}
          />
        ) : (
          <MutedText>{t('details.empty')}</MutedText>
        )}
      </Section>

      <Section title={t('details.accessibility')}>
        {component.contract.accessibility.length > 0 ? (
          <div className="grid gap-3">
            {component.contract.accessibility.map((rule) => {
              const description = resolveLocalizedStringWithFallback({
                localizedString: toResolvableLocalizedString(rule.description),
                locale,
              });

              return (
                <div
                  key={rule.key}
                  className="border-border-subtle bg-background-subtle rounded-2xl border p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-mono text-sm font-semibold">
                      {rule.key}
                    </h3>
                    <span className="border-border-subtle rounded-full border px-3 py-1 text-xs font-semibold">
                      {t(`severity.${rule.severity}`)}
                    </span>
                  </div>
                  <p className="text-content-secondary mt-2 text-sm leading-6">
                    {description.value}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <MutedText>{t('details.empty')}</MutedText>
        )}
      </Section>

      <Section title={t('completeness.title')}>
        {component.completeness.missingFields.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {component.completeness.missingFields.map((field) => (
              <span
                key={field}
                className="border-action-warning/30 bg-action-warning/10 text-action-warning rounded-full border px-3 py-1 text-xs font-semibold"
              >
                {t(`missingFields.${field}`)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-action-success text-sm font-semibold">
            {t('completeness.completeMessage')}
          </p>
        )}
      </Section>
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
  return (
    <span className="border-border-subtle text-content-secondary rounded-full border px-3 py-1 text-xs font-semibold">
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h3 className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function TagList({ values }: { values: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="border-border-subtle bg-background-subtle text-content-secondary rounded-full border px-3 py-1 text-xs font-semibold"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function MutedText({ children }: { children: ReactNode }) {
  return <p className="text-content-secondary text-sm">{children}</p>;
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
