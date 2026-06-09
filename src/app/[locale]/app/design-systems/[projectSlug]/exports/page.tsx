import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { ExportCenterClient } from '@/features/exports/ExportCenterClient';
import { getExportCenterPageData } from '@/features/exports/export-center.queries';

type ExportCenterPageProps = {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
};

export default async function ExportCenterPage({
  params,
}: ExportCenterPageProps) {
  const { locale: requestedLocale, projectSlug } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('ExportCenterPage');

  const pageData = await getExportCenterPageData({
    userId: session.user.id,
    projectSlug,
  });

  if (!pageData) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mt-8">
        <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
          {t('eyebrow')}
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {t('title', {
            projectName: pageData.exportCenterInput.project.name,
          })}
        </h1>

        <p className="text-content-secondary mt-4 max-w-3xl">
          {t('description')}
        </p>
      </div>

      <ExportCenterClient
        projectSlug={pageData.projectSlug}
        fallbackLocale={pageData.fallbackLocale}
        exportCenterInput={pageData.exportCenterInput}
        documentationProfile={pageData.documentationProfile}
        aiInstructionProfile={pageData.aiInstructionProfile}
        exportLogs={pageData.exportLogs}
      />
    </section>
  );
}
