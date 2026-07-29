import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import { Notice } from '@/components/ui';
import { DeleteProjectSection } from '@/features/project-settings/DeleteProjectSection';
import { routing, type Locale } from '@/i18n/routing';
import { prisma } from '@/server/db/prisma';

type ProjectSettingsPageProps = {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
};

export default async function ProjectSettingsPage({
  params,
}: ProjectSettingsPageProps) {
  const { locale: requestedLocale, projectSlug } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const [t, project] = await Promise.all([
    getTranslations('ProjectSettingsPage'),
    prisma.designSystemProject.findFirst({
      where: {
        slug: projectSlug,
        workspace: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        workspace: {
          select: {
            ownerId: true,
          },
        },
      },
    }),
  ]);

  if (!project) {
    notFound();
  }

  const canDeleteProject = project.workspace.ownerId === session.user.id;

  return (
    <section>
      <header className="border-border-subtle border-b px-4 pt-6 pb-4 sm:px-6 lg:px-8 xl:px-10 xl:pt-8">
        <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
          {t('eyebrow')}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.015em]">
          {t('title')}
        </h1>
        <p className="text-content-secondary mt-1 max-w-3xl text-sm leading-6">
          {t('description')}
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <section className="grid gap-6 border-b py-8 xl:grid-cols-[minmax(12rem,0.38fr)_minmax(0,1fr)] xl:gap-12">
          <div className="max-w-sm">
            <h2 className="text-base font-semibold tracking-tight">
              {t('identity.title')}
            </h2>
            <p className="text-content-secondary mt-1 text-sm leading-6">
              {t('identity.description')}
            </p>
          </div>

          <dl className="border-border-subtle bg-surface-primary grid min-w-0 gap-4 rounded-md border p-4 sm:grid-cols-2">
            <div>
              <dt className="text-content-tertiary text-xs font-semibold uppercase tracking-[0.08em]">
                {t('identity.name')}
              </dt>
              <dd className="mt-1 truncate text-sm font-semibold">
                {project.name}
              </dd>
            </div>
            <div>
              <dt className="text-content-tertiary text-xs font-semibold uppercase tracking-[0.08em]">
                {t('identity.slug')}
              </dt>
              <dd className="text-content-secondary mt-1 truncate font-mono text-sm">
                /{project.slug}
              </dd>
            </div>
          </dl>
        </section>

        {canDeleteProject ? (
          <DeleteProjectSection
            locale={locale}
            projectId={project.id}
            projectName={project.name}
            projectSlug={project.slug}
          />
        ) : (
          <div className="py-8">
            <Notice tone="info" title={t('permissions.ownerOnlyTitle')}>
              {t('permissions.ownerOnlyDescription')}
            </Notice>
          </div>
        )}
      </div>
    </section>
  );
}
