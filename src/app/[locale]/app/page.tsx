import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';
import { AppLink } from '@/components/navigation/AppLink';
import { Notice } from '@/components/ui';
import { ProjectCard } from '@/features/design-systems/ProjectCard';
import { formatRelativeUpdatedDate } from '@/features/design-systems/design-systems.utils';
import { getDesignSystemsPageData } from '@/features/design-systems/design-systems.queries';

type AppPageProps = {
  searchParams: Promise<{
    projectDeleted?: string | string[];
  }>;
};

export default async function AppPage({ searchParams }: AppPageProps) {
  const session = await auth();
  const t = await getTranslations('DashboardPage');
  const projectT = await getTranslations('DesignSystemsPage');
  const { projectDeleted } = await searchParams;

  const pageData = session?.user?.id
    ? await getDesignSystemsPageData(session.user.id)
    : {
        workspace: null,
        designSystems: [],
      };

  const projectCount = pageData.designSystems.length;
  const workspaceCount = pageData.workspace ? 1 : 0;

  return (
    <section>
      <header className="border-border-subtle border-b px-10 pt-8 pb-4">
        <div className="flex items-baseline justify-between gap-6">
          <h1 className="text-3xl font-semibold tracking-[-0.015em]">
            {t('title')}
          </h1>

          <AppLink
            href="/app/projects/new"
            className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover inline-flex min-h-8 items-center justify-center rounded-md px-3 text-sm font-semibold transition"
          >
            <PlusIcon aria-hidden="true" size={13} weight="bold" />
            <span className="ml-1.5">{t('primaryCta')}</span>
          </AppLink>
        </div>

        <p className="text-content-secondary mt-1 text-sm">
          {t('summary', {
            projectCount,
            workspaceCount,
            plan: t('plan.beta'),
          })}
        </p>
      </header>

      <div className="px-10 py-6">
        {projectDeleted === '1' ? (
          <Notice
            tone="success"
            title={t('projectDeleted.title')}
            className="mb-6"
          >
            {t('projectDeleted.description')}
          </Notice>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {pageData.designSystems.map((designSystem) => (
            <ProjectCard
              key={designSystem.id}
              project={designSystem}
              updatedAtLabel={formatRelativeUpdatedDate(designSystem.updatedAt)}
              labels={{
                noDescription: projectT('card.noDescription'),
                open: projectT('card.open'),
                slug: (slug) => projectT('card.slug', { slug }),
                updatedAt: (date) => projectT('card.updatedAt', { date }),
              }}
            />
          ))}

          <CreateProjectPlaceholder
            title={t('placeholder.title')}
            description={t('placeholder.description')}
            cta={t('primaryCta')}
          />
        </div>
      </div>
    </section>
  );
}

function CreateProjectPlaceholder({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <AppLink
      href="/app/projects/new"
      aria-label={cta}
      className="border-border-default text-content-secondary hover:border-action-primary hover:bg-background-subtle flex min-h-55 flex-col items-center justify-center gap-2.5 rounded-md border border-dashed bg-transparent p-6 text-center transition"
    >
      <span className="bg-background-sunken text-content-primary flex size-9 items-center justify-center rounded-full">
        <PlusIcon aria-hidden="true" size={16} weight="bold" />
      </span>

      <span className="text-content-primary text-lg font-semibold tracking-tight">
        {title}
      </span>

      <span className="max-w-52 text-sm leading-6">{description}</span>
    </AppLink>
  );
}
