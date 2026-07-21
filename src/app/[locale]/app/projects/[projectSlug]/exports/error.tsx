'use client';

import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';

export default function ExportCenterError({ reset }: { reset: () => void }) {
  const t = useTranslations('ExportCenterPage');

  return (
    <section className="min-h-0 xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <div className="min-h-0 min-w-0 xl:grid xl:h-full xl:grid-cols-[minmax(0,1fr)_30rem] xl:overflow-hidden 2xl:grid-cols-[minmax(0,1fr)_34rem]">
        <main className="bg-background-app flex min-h-[34rem] items-center justify-center p-6 xl:h-full">
          <div className="border-action-danger/30 bg-action-danger/10 max-w-xl rounded-md border p-6">
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
          </div>
        </main>

        <aside className="border-border-subtle bg-background-sunken min-h-[28rem] border-t xl:h-full xl:border-t-0 xl:border-l">
          <div className="border-border-subtle h-16 border-b" />
          <div className="flex h-full min-h-[22rem] items-center justify-center p-6">
            <p className="text-content-tertiary max-w-xs text-center text-sm leading-6">
              {t('states.errorDescription')}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
