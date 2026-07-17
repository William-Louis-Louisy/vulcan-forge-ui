'use client';

import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';

export default function AccessibilityCenterError({
  reset,
}: {
  reset: () => void;
}) {
  const t = useTranslations('AccessibilityCenterPage');

  return (
    <section className="flex min-h-80 items-center justify-center p-4 md:p-6 xl:absolute xl:inset-0 xl:min-h-0">
      <div className="border-action-danger/30 bg-action-danger/10 w-full max-w-2xl rounded-md border p-5 sm:p-6">
        <h2 className="text-action-danger text-xl font-semibold tracking-tight sm:text-2xl">
          {t('states.errorTitle')}
        </h2>

        <p className="text-content-secondary mt-3 text-sm leading-6">
          {t('states.errorDescription')}
        </p>

        <Button type="button" size="sm" className="mt-5" onClick={reset}>
          {t('states.retry')}
        </Button>
      </div>
    </section>
  );
}
