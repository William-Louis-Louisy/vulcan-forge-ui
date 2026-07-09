'use client';

import { useTranslations } from 'next-intl';

export default function ComponentsRegistryLoading() {
  const t = useTranslations('ComponentsRegistryPage');

  return (
    <section className="flex h-[calc(100dvh-3rem)] min-h-0 flex-col overflow-hidden xl:absolute xl:inset-0 xl:h-auto">
      <p className="sr-only" role="status">
        {t('states.loading')}
      </p>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto xl:grid xl:h-full xl:grid-cols-[16rem_minmax(0,48rem)_minmax(24rem,1fr)] xl:overflow-hidden">
        <aside className="border-border-subtle min-h-0 border-b p-4 xl:h-full xl:overflow-hidden xl:border-r xl:border-b-0">
          <div className="flex items-center justify-between gap-3">
            <div className="bg-background-subtle h-5 w-24 animate-pulse rounded-md" />
            <div className="bg-background-subtle size-8 animate-pulse rounded-md" />
          </div>
          <div className="bg-background-subtle mt-3 h-9 animate-pulse rounded-md" />
          <div className="mt-6 grid gap-3">
            <div className="bg-background-subtle h-3 w-16 animate-pulse rounded-md" />
            <div className="bg-background-subtle h-10 animate-pulse rounded-md" />
            <div className="bg-background-subtle h-10 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-2 h-3 w-20 animate-pulse rounded-md" />
            <div className="bg-background-subtle h-10 animate-pulse rounded-md" />
          </div>
        </aside>

        <main className="border-border-subtle min-h-0 min-w-0 border-b p-4 xl:h-full xl:overflow-hidden xl:border-b-0">
          <div className="bg-background-subtle h-3 w-24 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-7 w-40 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-4 max-w-lg animate-pulse rounded-md" />
          <div className="mt-6 grid gap-4">
            <div className="bg-background-subtle h-28 animate-pulse rounded-md" />
            <div className="bg-background-subtle h-44 animate-pulse rounded-md" />
            <div className="bg-background-subtle h-44 animate-pulse rounded-md" />
          </div>
        </main>

        <aside className="border-border-subtle grid min-h-0 content-start gap-6 border-t p-4 xl:h-full xl:overflow-hidden xl:border-t-0 xl:border-l">
          <div>
            <div className="bg-background-subtle h-3 w-24 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-3 h-48 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-4 h-24 animate-pulse rounded-md" />
          </div>
          <div>
            <div className="bg-background-subtle h-3 w-20 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-3 h-56 animate-pulse rounded-md" />
          </div>
        </aside>
      </div>
    </section>
  );
}
