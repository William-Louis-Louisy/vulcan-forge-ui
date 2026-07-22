'use client';

import { useTranslations } from 'next-intl';

export default function AiInstructionsGeneratorLoading() {
  const t = useTranslations('AiInstructionsGeneratorPage');

  return (
    <section className="min-h-0 xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <div className="min-h-0 min-w-0 xl:grid xl:h-full xl:grid-cols-[20rem_minmax(0,1fr)] xl:overflow-hidden 2xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="border-border-subtle bg-background-app min-w-0 border-b p-4 md:p-6 xl:h-full xl:border-r xl:border-b-0">
          <p className="text-action-primary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
            {t('states.loading')}
          </p>
          <div className="mt-3 grid gap-3">
            <div className="bg-background-subtle h-8 animate-pulse rounded-sm" />
            <div className="bg-background-subtle h-16 animate-pulse rounded-sm" />
            <div className="bg-background-subtle h-28 animate-pulse rounded-sm" />
            <div className="bg-background-subtle h-44 animate-pulse rounded-sm" />
            <div className="bg-background-subtle h-20 animate-pulse rounded-sm" />
          </div>
        </aside>

        <section className="border-border-subtle bg-background-app min-w-0 border-t xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:overflow-hidden xl:border-t-0">
          <div className="border-border-default bg-surface-primary h-20 animate-pulse border-b" />
          <div className="bg-background-sunken min-h-[38rem] flex-1 animate-pulse xl:min-h-0" />
        </section>
      </div>
    </section>
  );
}
