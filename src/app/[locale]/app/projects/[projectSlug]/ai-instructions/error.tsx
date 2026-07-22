'use client';

import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';

export default function AiInstructionsGeneratorError({
  reset,
}: {
  reset: () => void;
}) {
  const t = useTranslations('AiInstructionsGeneratorPage');

  return (
    <section className="min-h-0 xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <div className="min-h-0 min-w-0 xl:grid xl:h-full xl:grid-cols-[20rem_minmax(0,1fr)] xl:overflow-hidden 2xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="border-border-subtle bg-background-app min-w-0 border-b p-4 md:p-6 xl:h-full xl:border-r xl:border-b-0">
          <p className="text-action-primary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.015em]">
            {t('states.errorTitle')}
          </h1>
          <p className="text-content-tertiary mt-3 text-sm leading-6">
            {t('states.errorDescription')}
          </p>
          <Button type="button" className="mt-5 w-full" onClick={reset}>
            {t('states.retry')}
          </Button>
        </aside>

        <section className="border-border-subtle bg-background-sunken min-h-[32rem] border-t xl:h-full xl:min-h-0 xl:border-t-0" />
      </div>
    </section>
  );
}
