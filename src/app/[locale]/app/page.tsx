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
      <header className="border-border-subtle border-b px-4 pt-6 pb-5 sm:px-6 sm:pt-7 lg:px-10 lg:pt-8 lg:pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-[-0.015em] sm:text-3xl">
              {t('title')}
            </h1>

            <p className="text-content-secondary mt-1 text-sm">
              {t('summary', {
                projectCount,
                workspaceCount,
                plan: t('plan.beta'),
              })}
            </p>
          </div>

          <AppLink
            href="/app/projects/new"
            className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-md px-4 text-sm font-semibold transition sm:min-h-8 sm:w-auto sm:px-3"
          >
            <PlusIcon aria-hidden="true" size={13} weight="bold" />
            <span className="ml-1.5 whitespace-nowrap">{t('primaryCta')}</span>
          </AppLink>
        </div>
      </header>

      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-10">
        {projectDeleted === '1' ? (
          <Notice
            tone="success"
            title={t('projectDeleted.title')}
            className="mb-5 sm:mb-6"
          >
            {t('projectDeleted.description')}
          </Notice>
        ) : null}

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
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
      className="border-border-default text-content-secondary hover:border-action-primary hover:bg-background-subtle flex min-h-0 items-center justify-start gap-3 rounded-md border border-dashed bg-transparent p-4 text-left transition sm:min-h-55 sm:flex-col sm:justify-center sm:gap-2.5 sm:p-6 sm:text-center"
    >
      <span className="bg-background-sunken text-content-primary flex size-9 shrink-0 items-center justify-center rounded-full">
        <PlusIcon aria-hidden="true" size={16} weight="bold" />
      </span>

      <span className="min-w-0 flex-1 sm:flex-none">
        <span className="text-content-primary block text-base font-semibold tracking-tight sm:text-lg">
          {title}
        </span>

        <span className="mt-1 block max-w-60 text-sm leading-5 sm:mt-0.5 sm:max-w-52 sm:leading-6">
          {description}
        </span>
      </span>
    </AppLink>
  );
}
