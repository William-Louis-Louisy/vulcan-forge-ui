'use client';

import { useTranslations } from 'next-intl';

export default function ExportCenterLoading() {
  const t = useTranslations('ExportCenterPage');

  return (
    <section className="min-h-0 xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <p className="sr-only" role="status">
        {t('states.loading')}
      </p>

      <div
        aria-hidden="true"
        className="min-h-0 min-w-0 xl:grid xl:h-full xl:grid-cols-[minmax(0,1fr)_30rem] xl:overflow-hidden 2xl:grid-cols-[minmax(0,1fr)_34rem]"
      >
        <main className="bg-background-app px-4 py-5 md:px-6 md:py-6 xl:h-full xl:overflow-y-auto xl:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="bg-background-subtle h-8 w-32 animate-pulse rounded-md" />
                <div className="bg-action-success/10 h-7 w-40 animate-pulse rounded-full" />
              </div>
              <div className="bg-background-subtle mt-3 h-4 w-full max-w-2xl animate-pulse rounded-md" />
              <div className="bg-background-subtle mt-2 h-4 w-3/4 max-w-xl animate-pulse rounded-md" />
            </div>
            <div className="border-border-subtle bg-surface-primary h-20 w-full max-w-sm animate-pulse rounded-md border" />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="border-border-subtle bg-surface-primary h-48 animate-pulse rounded-md border"
              />
            ))}
          </div>
          <div className="border-border-subtle bg-surface-primary mt-6 h-44 animate-pulse rounded-md border" />
        </main>

        <aside className="border-border-subtle bg-background-sunken min-h-[36rem] border-t xl:h-full xl:border-t-0 xl:border-l">
          <div className="border-border-subtle flex h-16 items-center justify-between border-b px-4">
            <div className="bg-background-subtle h-4 w-48 animate-pulse rounded-sm" />
            <div className="bg-background-subtle h-9 w-28 animate-pulse rounded-md" />
          </div>
          <div className="space-y-3 p-4">
            {Array.from({ length: 14 }, (_, index) => (
              <div
                key={index}
                className="bg-background-subtle h-3 animate-pulse rounded-sm"
                style={{ width: `${55 + ((index * 13) % 40)}%` }}
              />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
