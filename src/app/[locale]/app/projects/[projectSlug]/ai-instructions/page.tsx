import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import type { AppLocale } from '@/domain/i18n';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { AiInstructionsGeneratorClient } from '@/features/ai-instructions/AiInstructionsGeneratorClient';
import { getAiInstructionsGeneratorPageData } from '@/features/ai-instructions/ai-instructions-generator.queries';

type AiInstructionsGeneratorPageProps = {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
};

export default async function AiInstructionsGeneratorPage({
  params,
}: AiInstructionsGeneratorPageProps) {
  const { locale: requestedLocale, projectSlug } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const pageData = await getAiInstructionsGeneratorPageData({
    userId: session.user.id,
    projectSlug,
  });

  if (!pageData) {
    notFound();
  }

  const supportedLocales =
    pageData.aiInstructionsInput.project.supportedLocales;
  const initialLocale = supportedLocales.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : pageData.fallbackLocale;

  return (
    <section className="min-h-0 xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <AiInstructionsGeneratorClient
        projectSlug={pageData.projectSlug}
        initialProfile={{
          ...pageData.savedProfile,
          locale: supportedLocales.includes(pageData.savedProfile.locale)
            ? pageData.savedProfile.locale
            : initialLocale,
        }}
        fallbackLocale={pageData.fallbackLocale}
        aiInstructionsInput={pageData.aiInstructionsInput}
      />
    </section>
  );
}
