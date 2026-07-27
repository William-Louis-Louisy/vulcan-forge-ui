'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { PublicBrandLockup } from '@/components/layout/PublicBrandLockup';
import { PublicButtonLink } from '@/components/layout/PublicButtonLink';
import { Button, ErrorState } from '@/components/ui';

export default function LocaleError({
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
    <main className="bg-background-app min-h-screen px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <PublicButtonLink href="/" variant="ghost" className="mb-10 px-0">
          <PublicBrandLockup />
        </PublicButtonLink>

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
            <PublicButtonLink href="/" variant="secondary">
              {t('actions.backToHome')}
            </PublicButtonLink>
          }
        />
      </div>
    </main>
  );
}
