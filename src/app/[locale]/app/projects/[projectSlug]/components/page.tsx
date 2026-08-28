import { auth } from '@/auth';
import {
  mvpComponentContractSeeds,
  type ComponentContractType,
} from '@/domain/design-system';
import { hasLocale } from 'next-intl';
import { Badge, Notice } from '@/components/ui';
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
import { ComponentRegistryState } from '@/features/components/ComponentRegistryState';
import { ComponentAiContractShell } from '@/features/components/ComponentAiContractPreview';
import { ComponentResponsiveWorkspace } from '@/features/components/ComponentResponsiveWorkspace';
import { getComponentsRegistryPageData } from '@/features/components/components-registry.queries';
import { createComponentTokenOptions } from '@/features/components/component-token-bindings.utils';
import { ComponentRegistryCreateButton } from '@/features/components/ComponentRegistryCreateButton';
import { filterComponentRegistryItems } from '@/features/components/components-registry-page.utils';
import { ComponentFoundationsPreviewShell } from '@/features/components/ComponentFoundationsPreview';
import { ComponentContractPreviewProvider } from '@/features/components/ComponentContractPreviewContext';
import { ComponentContractWorkspaceProvider } from '@/features/components/ComponentContractWorkspaceContext';
import { ComponentWorkspaceSaveAction } from '@/features/components/ComponentWorkspaceSaveAction';

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

  const createComponentLabels = {
    ariaLabel: t('list.create.ariaLabel'),
    unavailable: t('list.create.unavailable'),
    title: t('list.create.title'),
    description: t('list.create.description'),
    type: t('list.create.type'),
    cancel: t('list.create.cancel'),
    submit: t('list.create.submit'),
    submitting: t('list.create.submitting'),
    errors: {
      unauthorized: t('list.create.errors.unauthorized'),
      projectNotFound: t('list.create.errors.projectNotFound'),
      componentNotFound: t('list.create.errors.componentNotFound'),
      componentAlreadyExists: t('list.create.errors.componentAlreadyExists'),
      invalidPayload: t('list.create.errors.invalidPayload'),
      unexpected: t('list.create.errors.unexpected'),
    },
  };
  const workspaceSaveLabels = {
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
  };

  return (
    <section className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      {registry.invalidCount > 0 ? (
        <Notice tone="warning" className="m-3 shrink-0 font-semibold sm:m-4">
          {t('invalidContractsWarning', { count: registry.invalidCount })}
        </Notice>
      ) : null}

      {registry.items.length > 0 && selectedComponent ? (
        <ComponentContractPreviewProvider
          key={selectedComponent.id}
          initialContract={selectedComponent.contract}
        >
          <ComponentContractWorkspaceProvider
            locale={locale}
            projectSlug={pageData.project.slug}
            contract={selectedComponent.contract}
          >
            <ComponentResponsiveWorkspace
              labels={{
                navigation: t('list.title'),
                canvas: t('foundationsPreview.title'),
                inspector: t('editor.title'),
              }}
              componentName={selectedComponent.name}
              inspectorScrollContextId={`component-contract:${pageData.project.slug}:${selectedComponent.type}`}
              navigation={
                <ComponentList
                  t={t}
                  locale={locale}
                  projectSlug={pageData.project.slug}
                  componentGroups={componentGroups}
                  selectedComponentType={selectedComponent.type}
                  filterQuery={componentFilterQuery}
                  availableComponentTypes={availableComponentTypes}
                />
              }
              canvas={
                <>
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
                </>
              }
              inspector={
                <ComponentDetails
                  t={t}
                  locale={locale}
                  component={selectedComponent}
                  projectSlug={pageData.project.slug}
                  tokenOptions={componentTokenOptions}
                />
              }
              saveAction={
                <ComponentWorkspaceSaveAction
                  locale={locale}
                  projectSlug={pageData.project.slug}
                  labels={workspaceSaveLabels}
                />
              }
            />
          </ComponentContractWorkspaceProvider>
        </ComponentContractPreviewProvider>
      ) : (
        <div className="flex min-h-80 flex-1 items-center justify-center p-4 md:p-6">
          <ComponentRegistryState
            title={t('states.emptyTitle')}
            description={t('states.emptyDescription')}
            action={
              <ComponentRegistryCreateButton
                locale={locale}
                projectSlug={pageData.project.slug}
                options={availableComponentTypes}
                labels={createComponentLabels}
                triggerLabel={t('list.create.submit')}
              />
            }
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
