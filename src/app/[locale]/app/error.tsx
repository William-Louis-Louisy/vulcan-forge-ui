'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AppLink } from '@/components/navigation/AppLink';
import { Button, ErrorState } from '@/components/ui';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ErrorSurfaces');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <ErrorState
        code={t('unexpected.code')}
        eyebrow={t('unexpected.eyebrow')}
        title={t('unexpected.title')}
        description={t('unexpected.description')}
        reference={
          error.digest
            ? t('unexpected.reference', { digest: error.digest })
            : undefined
        }
        primaryAction={
          <Button type="button" onClick={reset}>
            {t('actions.retry')}
          </Button>
        }
        secondaryAction={
          <AppLink
            href="/app"
            className="border-border-default bg-surface-primary text-content-primary hover:bg-surface-secondary inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition"
          >
            {t('actions.backToDashboard')}
          </AppLink>
        }
      />
    </main>
  );
}
