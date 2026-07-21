'use client';

import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';

export default function DocumentationGeneratorError({
  reset,
}: {
  reset: () => void;
}) {
  const t = useTranslations('DocumentationGeneratorPage');

  return (
    <section className="min-h-0 xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <div className="min-h-0 min-w-0 xl:grid xl:h-full xl:grid-cols-[20rem_minmax(0,1fr)] xl:overflow-hidden 2xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="border-border-subtle bg-background-app border-b p-4 md:p-6 xl:h-full xl:border-r xl:border-b-0">
          <p className="text-action-danger text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
            {t('states.errorTitle')}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {t('states.errorTitle')}
          </h1>
          <p className="text-content-secondary mt-3 text-sm leading-6">
            {t('states.errorDescription')}
          </p>
          <Button type="button" className="mt-6" onClick={reset}>
            {t('states.retry')}
          </Button>
        </aside>

        <section className="bg-surface-primary min-h-[36rem] min-w-0 xl:h-full">
          <div className="border-border-subtle h-16 border-b" />
          <div className="flex min-h-[30rem] items-center justify-center p-6">
            <div className="border-action-danger/30 bg-action-danger/10 max-w-lg rounded-md border p-6 text-center">
              <h2 className="text-action-danger text-lg font-semibold">
                {t('states.errorTitle')}
              </h2>
              <p className="text-content-secondary mt-2 text-sm leading-6">
                {t('states.errorDescription')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
