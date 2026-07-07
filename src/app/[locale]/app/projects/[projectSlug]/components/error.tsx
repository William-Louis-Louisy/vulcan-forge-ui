'use client';

import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';

export default function ComponentsRegistryError({
  reset,
}: {
  reset: () => void;
}) {
  const t = useTranslations('ComponentsRegistryPage');

  return (
    <section className="flex min-h-[calc(100vh-3rem)] items-start justify-center overflow-y-auto p-4 md:p-6">
      <div className="border-action-danger/30 bg-action-danger/10 w-full max-w-xl rounded-md border p-5">
        <h2 className="text-action-danger text-lg font-semibold tracking-tight">
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
