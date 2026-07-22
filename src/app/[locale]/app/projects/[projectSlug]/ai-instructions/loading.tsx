'use client';

import { useTranslations } from 'next-intl';

export default function AiInstructionsGeneratorLoading() {
  const t = useTranslations('AiInstructionsGeneratorPage');

  return (
    <section className="min-h-0 xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <p className="sr-only" role="status">
        {t('states.loading')}
      </p>

      <div
        aria-hidden="true"
        className="min-h-0 min-w-0 xl:grid xl:h-full xl:grid-cols-[20rem_minmax(0,1fr)] xl:overflow-hidden 2xl:grid-cols-[22rem_minmax(0,1fr)]"
      >
        <aside className="border-border-subtle bg-background-app min-w-0 border-b p-4 md:p-6 xl:h-full xl:border-r xl:border-b-0">
          <div className="bg-background-subtle h-3 w-28 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-2 h-8 w-48 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-14 animate-pulse rounded-md" />
          <div className="mt-6 grid gap-5">
            <div className="bg-surface-primary h-24 animate-pulse rounded-md" />
            <div className="bg-surface-primary h-48 animate-pulse rounded-md" />
            <div className="bg-surface-primary h-52 animate-pulse rounded-md" />
            <div className="bg-surface-primary h-20 animate-pulse rounded-md" />
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
