import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
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

  const pageData = await getExportCenterPageData({
    userId: session.user.id,
    projectSlug,
  });

  if (!pageData) {
    notFound();
  }

  return (
    <section className="min-h-0 xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
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
