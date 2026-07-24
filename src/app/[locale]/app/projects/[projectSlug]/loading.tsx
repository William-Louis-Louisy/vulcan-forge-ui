'use client';

import { useTranslations } from 'next-intl';

export default function ProjectOverviewLoading() {
  const t = useTranslations('ProjectOverviewPage');

  return (
    <section className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <p className="sr-only" role="status">
        {t('states.loading')}
      </p>

      <div
        aria-hidden="true"
        className="grid min-h-0 flex-1 xl:grid-cols-[minmax(0,1fr)_23rem]"
      >
        <div className="min-w-0 xl:overflow-y-auto">
          <header className="border-border-subtle border-b px-4 pt-6 pb-4 sm:px-6 lg:px-8 xl:px-10 xl:pt-8">
            <div className="bg-background-subtle h-3 w-32 animate-pulse rounded-sm" />
            <div className="bg-background-subtle mt-3 h-8 w-56 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-3 h-4 w-full max-w-xl animate-pulse rounded-md" />
            <div className="mt-3 flex gap-2">
              {[0, 1, 2, 3].map((badge) => (
                <div
                  key={badge}
                  className="bg-background-subtle h-6 w-16 animate-pulse rounded-full"
                />
              ))}
            </div>
          </header>

          <div className="grid gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 xl:px-10 xl:py-6">
            <div className="border-border-subtle bg-surface-primary h-56 animate-pulse rounded-md border" />
            <div className="border-border-subtle bg-surface-primary h-44 animate-pulse rounded-md border" />
            <div className="grid gap-4 2xl:grid-cols-2">
              {[0, 1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="border-border-subtle bg-surface-primary h-64 animate-pulse rounded-md border"
                />
              ))}
            </div>
            <div className="border-border-subtle bg-surface-primary h-60 animate-pulse rounded-md border" />
          </div>
        </div>

        <aside className="border-border-subtle bg-background-sunken hidden border-l p-4 xl:block">
          <div className="bg-background-subtle h-5 w-28 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-4 w-full animate-pulse rounded-md" />
          <div className="bg-surface-primary border-border-subtle mt-5 h-96 animate-pulse rounded-md border" />
        </aside>
      </div>
    </section>
  );
}
