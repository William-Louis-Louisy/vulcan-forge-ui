'use client';

import { useTranslations } from 'next-intl';

export default function ComponentsRegistryLoading() {
  const t = useTranslations('ComponentsRegistryPage');

  return (
    <section className="h-[calc(100vh-3rem)] min-h-0 overflow-hidden">
      <p className="sr-only" role="status">
        {t('states.loading')}
      </p>

      <div className="flex h-full min-h-0 flex-col overflow-y-auto xl:grid xl:grid-cols-[15rem_minmax(0,1fr)_22rem] xl:overflow-hidden">
        <aside className="border-border-subtle border-b p-4 xl:border-r xl:border-b-0">
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

        <main className="border-border-subtle border-b p-6 xl:border-b-0">
          <div className="bg-background-subtle h-3 w-20 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-8 w-44 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-4 h-4 max-w-xl animate-pulse rounded-md" />
          <div className="mt-8 grid gap-6">
            <div className="bg-background-subtle h-36 animate-pulse rounded-md" />
            <div className="bg-background-subtle h-48 animate-pulse rounded-md" />
            <div className="bg-background-subtle h-48 animate-pulse rounded-md" />
          </div>
        </main>

        <aside className="border-border-subtle border-t p-4 xl:border-t-0 xl:border-l">
          <div className="bg-background-subtle h-3 w-20 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-6 w-32 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-5 h-56 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-6 h-64 animate-pulse rounded-md" />
        </aside>
      </div>
    </section>
  );
}
