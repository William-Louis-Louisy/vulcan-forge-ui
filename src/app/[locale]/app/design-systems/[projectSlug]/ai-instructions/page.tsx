import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import type { AppLocale } from '@/domain/i18n';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { ProjectEditorNav } from '@/features/design-systems/project-editor/ProjectEditorNav';
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

  const t = await getTranslations('AiInstructionsGeneratorPage');

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
    <section className="mx-auto max-w-7xl">
      <ProjectEditorNav projectSlug={pageData.projectSlug} />

      <div className="mt-8">
        <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
          {t('eyebrow')}
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {t('title', {
            projectName: pageData.aiInstructionsInput.project.name,
          })}
        </h1>

        <p className="text-content-secondary mt-4 max-w-3xl">
          {t('description')}
        </p>
      </div>

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
