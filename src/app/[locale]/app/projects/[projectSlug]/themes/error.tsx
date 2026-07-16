'use client';

import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';

export default function ThemesEditorError({ reset }: { reset: () => void }) {
  const t = useTranslations('ThemesEditorPage');

  return (
    <section className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <div className="flex min-h-80 min-w-0 flex-1 items-center justify-center p-4 md:p-6">
        <div
          role="alert"
          className="border-action-danger/30 bg-action-danger/10 shadow-soft w-full max-w-2xl rounded-md border p-5 sm:p-6"
        >
          <p className="text-action-danger text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
            {t('states.errorEyebrow')}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
            {t('states.errorTitle')}
          </h2>

          <p className="text-content-secondary mt-3 text-sm leading-6">
            {t('states.errorDescription')}
          </p>

          <Button type="button" size="sm" className="mt-5" onClick={reset}>
            {t('states.retry')}
          </Button>
        </div>
      </div>
    </section>
  );
}
