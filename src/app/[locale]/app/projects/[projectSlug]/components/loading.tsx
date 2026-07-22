'use client';

import { useTranslations } from 'next-intl';

export default function ComponentsRegistryLoading() {
  const t = useTranslations('ComponentsRegistryPage');

  return (
    <section className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <p className="sr-only" role="status">
        {t('states.loading')}
      </p>

      <div
        aria-hidden="true"
        className="border-border-subtle bg-background-app grid grid-cols-3 gap-1 border-b p-2 lg:hidden"
      >
        <div className="bg-background-subtle h-9 animate-pulse rounded-md" />
        <div className="bg-content-primary/15 h-9 animate-pulse rounded-md" />
        <div className="bg-background-subtle h-9 animate-pulse rounded-md" />
      </div>

      <div
        aria-hidden="true"
        className="min-h-0 flex-1 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] xl:h-full xl:grid-cols-[16rem_minmax(0,48rem)_minmax(24rem,1fr)] xl:overflow-hidden"
      >
        <aside className="border-border-subtle hidden min-h-0 min-w-0 border-b p-3 sm:p-4 lg:row-span-2 lg:block lg:border-r lg:border-b-0 xl:row-span-1 xl:h-full xl:overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="bg-background-subtle h-5 w-24 animate-pulse rounded-md" />
            <div className="bg-background-subtle size-8 animate-pulse rounded-md" />
          </div>
          <div className="bg-background-subtle mt-3 h-9 animate-pulse rounded-md" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="bg-background-subtle h-3 w-16 animate-pulse rounded-md" />
            <div className="bg-background-subtle h-10 animate-pulse rounded-md" />
            <div className="bg-background-subtle h-10 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-2 h-3 w-20 animate-pulse rounded-md" />
            <div className="bg-background-subtle h-10 animate-pulse rounded-md" />
          </div>
        </aside>

        <main className="border-border-subtle min-h-0 min-w-0 p-4 sm:p-6 lg:col-start-2 xl:col-start-auto xl:h-full xl:overflow-hidden">
          <div className="bg-background-subtle h-3 w-24 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-7 w-40 max-w-full animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-4 max-w-lg animate-pulse rounded-md" />
          <div className="mt-6 grid gap-4">
            <div className="bg-background-subtle h-28 animate-pulse rounded-md" />
            <div className="bg-background-subtle h-44 animate-pulse rounded-md" />
            <div className="bg-background-subtle h-44 animate-pulse rounded-md" />
          </div>
        </main>

        <aside className="border-border-subtle hidden min-h-0 min-w-0 content-start gap-6 border-t p-3 sm:p-4 lg:col-start-2 lg:grid xl:col-start-auto xl:h-full xl:overflow-hidden xl:border-t-0 xl:border-l">
          <div className="min-w-0">
            <div className="bg-background-subtle h-3 w-24 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-3 h-48 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-4 h-24 animate-pulse rounded-md" />
          </div>
          <div className="min-w-0">
            <div className="bg-background-subtle h-3 w-20 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-3 h-56 animate-pulse rounded-md" />
          </div>
        </aside>
      </div>
    </section>
  );
}
