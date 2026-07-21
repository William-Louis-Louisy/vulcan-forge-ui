'use client';

import { useTranslations } from 'next-intl';

export default function DocumentationGeneratorLoading() {
  const t = useTranslations('DocumentationGeneratorPage');

  return (
    <section className="min-h-0 xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <div className="min-h-0 min-w-0 xl:grid xl:h-full xl:grid-cols-[20rem_minmax(0,1fr)] xl:overflow-hidden 2xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="border-border-subtle bg-background-app border-b p-4 md:p-6 xl:h-full xl:border-r xl:border-b-0">
          <p className="text-action-primary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
            {t('states.loading')}
          </p>
          <div className="bg-background-subtle mt-3 h-8 w-44 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-14 animate-pulse rounded-md" />
          <div className="mt-8 grid gap-5">
            <div className="bg-surface-primary h-24 animate-pulse rounded-md" />
            <div className="bg-surface-primary h-64 animate-pulse rounded-md" />
            <div className="bg-surface-primary h-24 animate-pulse rounded-md" />
          </div>
        </aside>

        <section className="bg-surface-primary min-h-[36rem] min-w-0 xl:h-full">
          <div className="border-border-subtle flex h-16 items-center justify-between border-b px-4">
            <div className="bg-background-subtle h-4 w-64 animate-pulse rounded-sm" />
            <div className="bg-background-subtle h-9 w-36 animate-pulse rounded-md" />
          </div>
          <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 xl:px-12">
            <div className="bg-background-subtle h-12 w-2/3 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-5 h-5 w-full animate-pulse rounded-sm" />
            <div className="bg-background-subtle mt-2 h-5 w-4/5 animate-pulse rounded-sm" />
            <div className="bg-background-subtle mt-10 h-8 w-1/2 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-5 h-56 animate-pulse rounded-md" />
          </div>
        </section>
      </div>
    </section>
  );
}
