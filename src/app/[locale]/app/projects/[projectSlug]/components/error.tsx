'use client';

import { Button } from '@/components/ui';
import { ComponentRegistryState } from '@/features/components/ComponentRegistryState';
import { useTranslations } from 'next-intl';

export default function ComponentsRegistryError({
  reset,
}: {
  reset: () => void;
}) {
  const t = useTranslations('ComponentsRegistryPage');

  return (
    <section className="flex min-h-80 items-center justify-center p-4 md:p-6 xl:absolute xl:inset-0 xl:min-h-0">
      <ComponentRegistryState
        role="alert"
        tone="danger"
        title={t('states.errorTitle')}
        description={t('states.errorDescription')}
        action={
          <Button type="button" size="sm" onClick={reset}>
            {t('states.retry')}
          </Button>
        }
      />
    </section>
  );
}
