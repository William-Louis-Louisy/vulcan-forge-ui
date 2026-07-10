import type {
  ComponentRegistryItem,
  ComponentRegistryCategoryGroup,
} from './components-registry.utils';
import type { ComponentContractType } from '@/domain/design-system';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { StatusBadge } from '@/app/[locale]/app/projects/[projectSlug]/components/page';
import type { ComponentsRegistryTranslator } from '@/app/[locale]/app/projects/[projectSlug]/components/page';
import { ComponentRegistryCreateButton } from './ComponentRegistryCreateButton';
import { ComponentRegistryFilter } from './ComponentRegistryFilter';

export function ComponentList({
  t,
  locale,
  projectSlug,
  componentGroups,
  selectedComponentType,
  filterQuery,
  availableComponentTypes,
}: {
  t: ComponentsRegistryTranslator;
  locale: Locale;
  projectSlug: string;
  componentGroups: ComponentRegistryCategoryGroup[];
  selectedComponentType: string | null;
  filterQuery: string;
  availableComponentTypes: Array<{
    type: ComponentContractType;
    name: string;
  }>;
}) {
  const componentCount = componentGroups.reduce(
    (count, group) => count + group.items.length,
    0,
  );

  return (
    <section className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-2">
          <h2 className="truncate text-lg font-semibold tracking-tight">
            {t('list.title')}
          </h2>
          <span className="text-content-tertiary text-xs font-medium">
            {componentCount}
          </span>
        </div>

        <ComponentRegistryCreateButton
          locale={locale}
          projectSlug={projectSlug}
          options={availableComponentTypes}
          labels={{
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
              componentAlreadyExists: t(
                'list.create.errors.componentAlreadyExists',
              ),
              invalidPayload: t('list.create.errors.invalidPayload'),
              unexpected: t('list.create.errors.unexpected'),
            },
          }}
        />
      </div>

      <ComponentRegistryFilter
        value={filterQuery}
        placeholder={t('list.filterPlaceholder')}
      />

      {componentGroups.length > 0 ? (
        <div className="mt-5 grid gap-5">
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
        <p className="text-content-secondary mt-5 text-sm">
          {t('list.emptyFilter')}
        </p>
      )}
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
      <h3 className="text-content-tertiary text-[11px] font-semibold tracking-[0.16em] uppercase">
        {t(`categories.${group.category}`)}
      </h3>

      <div className="mt-2 grid">
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
        'border-l-2 px-3 py-2.5 transition',
        isSelected
          ? 'border-action-primary bg-action-primary/10'
          : 'hover:bg-background-subtle border-transparent',
      ].join(' ')}
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <h4 className="truncate text-sm font-semibold">{component.name}</h4>
        <StatusBadge t={t} status={component.status} />
      </div>
    </Link>
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

  return `/app/projects/${projectSlug}/components?${params.toString()}`;
}
