import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import { AppLink } from '@/components/navigation/AppLink';
import { ProjectCard } from '@/features/design-systems/ProjectCard';
import { formatRelativeUpdatedDate } from '@/features/design-systems/design-systems.utils';
import { getDesignSystemsPageData } from '@/features/design-systems/design-systems.queries';

export default async function DesignSystemsPage() {
  const session = await auth();
  const t = await getTranslations('DesignSystemsPage');

  const pageData = session?.user?.id
    ? await getDesignSystemsPageData(session.user.id)
    : {
        workspace: null,
        designSystems: [],
      };

  const hasDesignSystems = pageData.designSystems.length > 0;

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
            {t('eyebrow')}
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            {t('title')}
          </h1>

          <p className="text-content-secondary mt-4 max-w-2xl">
            {t('description')}
          </p>
        </div>

        <AppLink
          href="/app/projects/new"
          className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover inline-flex justify-center rounded-lg px-5 py-3 text-sm font-semibold transition"
        >
          {t('primaryCta')}
        </AppLink>
      </div>

      <div className="border-border-subtle bg-surface-primary shadow-soft mt-8 rounded-2xl border p-5">
        <p className="text-content-tertiary text-sm font-medium">
          {t('workspace.label')}
        </p>
        <p className="mt-1 font-semibold">
          {pageData.workspace?.name ?? t('workspace.empty')}
        </p>
      </div>

      {hasDesignSystems ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {pageData.designSystems.map((designSystem) => (
            <ProjectCard
              key={designSystem.id}
              project={designSystem}
              updatedAtLabel={formatRelativeUpdatedDate(designSystem.updatedAt)}
              labels={{
                noDescription: t('card.noDescription'),
                open: t('card.open'),
                slug: (slug) => t('card.slug', { slug }),
                updatedAt: (date) => t('card.updatedAt', { date }),
              }}
            />
          ))}
        </div>
      ) : (
        <div className="border-border-default bg-surface-primary shadow-soft mt-8 rounded-3xl border border-dashed p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('emptyState.title')}
          </h2>

          <p className="text-content-secondary mx-auto mt-4 max-w-xl leading-7">
            {t('emptyState.description')}
          </p>

          <AppLink
            href="/app/projects/new"
            className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover mt-8 inline-flex justify-center rounded-lg px-5 py-3 text-sm font-semibold transition"
          >
            {t('emptyState.cta')}
          </AppLink>
        </div>
      )}
    </section>
  );
}
