import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { Badge } from '@/components/ui';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import {
  createComponentRegistryItems,
  groupComponentRegistryItemsByCategory,
  type ComponentRegistryItem,
} from '@/features/components/components-registry.utils';
import { ComponentDetails } from '@/features/components/ComponentDetailsPanel';
import { ComponentList } from '@/features/components/ComponentRegistryNavigation';
import { ComponentAiContractShell } from '@/features/components/ComponentAiContractPreview';
import { getComponentsRegistryPageData } from '@/features/components/components-registry.queries';
import { createComponentTokenOptions } from '@/features/components/component-token-bindings.utils';
import { filterComponentRegistryItems } from '@/features/components/components-registry-page.utils';
import { ComponentFoundationsPreviewShell } from '@/features/components/ComponentFoundationsPreview';
import { createComponentTokenBindingResolution } from '@/features/components/component-token-bindings.utils';

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

export type ComponentsRegistryTranslator = Awaited<
  ReturnType<typeof getTranslations>
>;

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

  const componentTokenOptions = createComponentTokenOptions(pageData.tokenSets);

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

  const tokenBindingResolution = selectedComponent
    ? createComponentTokenBindingResolution({
        bindings: selectedComponent.contract.tokenBindings,
        rawTokenSets: pageData.tokenSets,
      })
    : null;

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
                tokenOptions={componentTokenOptions}
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
                  tokenBindingResolution={
                    tokenBindingResolution ?? {
                      bindings: {},
                      missingBindings: [],
                      invalidTokenSetsCount: 0,
                    }
                  }
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

export function StatusBadge({
  t,
  status,
}: {
  t: ComponentsRegistryTranslator;
  status: ComponentRegistryItem['status'];
}) {
  const statusVariant: Record<
    ComponentRegistryItem['status'],
    'success' | 'warning' | 'default'
  > = {
    ready: 'success',
    draft: 'warning',
    deprecated: 'default',
  };

  return (
    <Badge variant={statusVariant[status]} size="sm">
      {t(`statuses.${status}`)}
    </Badge>
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
