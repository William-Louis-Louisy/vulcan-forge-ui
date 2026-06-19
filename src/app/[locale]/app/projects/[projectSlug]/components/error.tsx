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
    <section className="border-action-danger/30 bg-action-danger/10 shadow-soft mx-auto max-w-3xl rounded-3xl border p-8">
      <h2 className="text-action-danger text-2xl font-semibold tracking-tight">
        {t('states.errorTitle')}
      </h2>

      <p className="text-content-secondary mt-4 text-sm leading-6">
        {t('states.errorDescription')}
      </p>

      <Button type="button" className="mt-6" onClick={reset}>
        {t('states.retry')}
      </Button>
    </section>
  );
}
