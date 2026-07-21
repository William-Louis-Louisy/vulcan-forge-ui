import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import type { AppLocale } from '@/domain/i18n';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { DocumentationGeneratorClient } from '@/features/documentation/DocumentationGeneratorClient';
import { getDocumentationGeneratorPageData } from '@/features/documentation/documentation-generator.queries';

type DocumentationGeneratorPageProps = {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
};

export default async function DocumentationGeneratorPage({
  params,
}: DocumentationGeneratorPageProps) {
  const { locale: requestedLocale, projectSlug } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const pageData = await getDocumentationGeneratorPageData({
    userId: session.user.id,
    projectSlug,
  });

  if (!pageData) {
    notFound();
  }

  const supportedLocales = pageData.documentationInput.project.supportedLocales;
  const initialLocale = supportedLocales.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : pageData.fallbackLocale;

  return (
    <section className="min-h-0 xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <DocumentationGeneratorClient
        interfaceLocale={locale}
        projectSlug={pageData.projectSlug}
        initialProfile={{
          ...pageData.savedProfile,
          locale: supportedLocales.includes(pageData.savedProfile.locale)
            ? pageData.savedProfile.locale
            : initialLocale,
        }}
        fallbackLocale={pageData.fallbackLocale}
        documentationInput={pageData.documentationInput}
      />
    </section>
  );
}
