import { ErrorState } from '@/components/ui';
import { AppLink } from '@/components/navigation/AppLink';
import { getTranslations } from 'next-intl/server';

export default async function AppNotFound() {
  const t = await getTranslations('ErrorSurfaces');

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <ErrorState
        code={t('appNotFound.code')}
        eyebrow={t('appNotFound.eyebrow')}
        title={t('appNotFound.title')}
        description={t('appNotFound.description')}
        tone="notFound"
        primaryAction={
          <AppLink
            href="/app"
            className="border-action-primary bg-action-primary text-action-primary-content hover:bg-action-primary-hover inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition"
          >
            {t('actions.backToDashboard')}
          </AppLink>
        }
      />
    </main>
  );
}
