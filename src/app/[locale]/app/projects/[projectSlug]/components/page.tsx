import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import {
  mvpComponentContractSeeds,
  type ComponentContractType,
} from '@/domain/design-system';
import {
  createComponentRegistryItems,
  groupComponentRegistryItemsByCategory,
  type ComponentRegistryItem,
} from '@/features/components/components-registry.utils';
import { Badge, Notice } from '@/components/ui';
import { ComponentDetails } from '@/features/components/ComponentDetailsPanel';
import { ComponentList } from '@/features/components/ComponentRegistryNavigation';
import { ComponentAiContractShell } from '@/features/components/ComponentAiContractPreview';
import { ComponentRegistryState } from '@/features/components/ComponentRegistryState';
import { ComponentContractPreviewProvider } from '@/features/components/ComponentContractPreviewContext';
import { getComponentsRegistryPageData } from '@/features/components/components-registry.queries';
import { createComponentTokenOptions } from '@/features/components/component-token-bindings.utils';
import { filterComponentRegistryItems } from '@/features/components/components-registry-page.utils';
import { ComponentFoundationsPreviewShell } from '@/features/components/ComponentFoundationsPreview';

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
  const existingComponentTypes = new Set<ComponentContractType>(
    registry.items.map((item) => item.type),
  );
  const availableComponentTypes = mvpComponentContractSeeds
    .filter((seed) => !existingComponentTypes.has(seed.type))
    .map((seed) => ({
      type: seed.type,
      name: seed.name,
    }));

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
    <section className="flex h-[calc(100dvh-3rem)] min-h-0 flex-col overflow-hidden xl:absolute xl:inset-0 xl:h-auto">
      {registry.invalidCount > 0 ? (
        <Notice tone="warning" className="m-4 shrink-0 font-semibold">
          {t('invalidContractsWarning', { count: registry.invalidCount })}
        </Notice>
      ) : null}

      {registry.items.length > 0 ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto xl:grid xl:h-full xl:grid-cols-[16rem_minmax(0,48rem)_minmax(24rem,1fr)] xl:overflow-hidden">
          <aside className="border-border-subtle min-h-0 border-b xl:h-full xl:overflow-y-auto xl:border-r xl:border-b-0">
            <ComponentList
              t={t}
              locale={locale}
              projectSlug={pageData.project.slug}
              componentGroups={componentGroups}
              selectedComponentType={selectedComponent?.type ?? null}
              filterQuery={componentFilterQuery}
              availableComponentTypes={availableComponentTypes}
            />
          </aside>

          {selectedComponent ? (
            <ComponentContractPreviewProvider
              key={selectedComponent.id}
              initialContract={selectedComponent.contract}
            >
              <main
                data-save-context-scroll-container={`component-contract:${pageData.project.slug}:${selectedComponent.type}`}
                className="min-h-0 min-w-0 border-b xl:overflow-y-auto xl:border-b-0"
              >
                <ComponentDetails
                  t={t}
                  locale={locale}
                  component={selectedComponent}
                  projectSlug={pageData.project.slug}
                  tokenOptions={componentTokenOptions}
                />
              </main>

              <aside className="border-border-subtle grid min-h-0 content-start gap-6 border-t xl:h-full xl:overflow-y-auto xl:border-t-0 xl:border-l">
                <ComponentFoundationsPreviewShell
                  locale={locale}
                  component={selectedComponent}
                  rawTokenSets={pageData.tokenSets}
                />
                <ComponentAiContractShell
                  t={t}
                  locale={locale}
                  component={selectedComponent}
                />
              </aside>
            </ComponentContractPreviewProvider>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4 md:p-6">
          <ComponentRegistryState
            title={t('states.emptyTitle')}
            description={t('states.emptyDescription')}
          />
        </div>
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
