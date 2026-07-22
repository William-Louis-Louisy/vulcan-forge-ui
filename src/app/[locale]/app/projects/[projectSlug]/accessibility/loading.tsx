'use client';

import { useTranslations } from 'next-intl';

export default function AccessibilityCenterLoading() {
  const t = useTranslations('AccessibilityCenterPage');

  return (
    <section className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <p className="sr-only" role="status">
        {t('states.loading')}
      </p>

      <div
        aria-hidden="true"
        className="flex min-h-0 min-w-0 flex-1 flex-col xl:grid xl:h-full xl:grid-cols-[minmax(0,1fr)_23rem] xl:overflow-hidden"
      >
        <section className="flex min-h-0 min-w-0 flex-col xl:overflow-hidden">
          <header className="border-border-subtle bg-background-app shrink-0 border-b px-4 py-4 md:px-6 xl:px-7 xl:py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="bg-background-subtle h-7 w-64 max-w-full animate-pulse rounded-md" />
                <div className="bg-background-subtle mt-2 h-4 w-full max-w-2xl animate-pulse rounded-md" />
              </div>
              <div className="bg-background-subtle h-9 w-28 shrink-0 animate-pulse rounded-md" />
            </div>
          </header>

          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
            <div className="grid gap-4 p-4 md:p-6 xl:p-7">
              <div className="bg-action-warning/10 h-14 animate-pulse rounded-md" />
              <div className="bg-surface-primary h-44 animate-pulse rounded-md" />
              <div className="bg-surface-primary order-1 h-52 animate-pulse rounded-md" />
              <div className="bg-background-sunken order-2 h-[28rem] animate-pulse rounded-md xl:hidden" />
              <div className="bg-surface-primary order-3 h-72 animate-pulse rounded-md" />
            </div>
          </main>
        </section>

        <aside className="border-border-subtle bg-background-sunken hidden h-full min-h-0 border-l p-5 xl:block xl:overflow-y-auto">
          <div className="bg-background-subtle h-3 w-24 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-6 w-52 max-w-full animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-4 h-6 w-32 animate-pulse rounded-full" />
          <div className="bg-background-subtle mt-6 h-24 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-4 h-48 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-4 h-9 w-32 animate-pulse rounded-md" />
        </aside>
      </div>
    </section>
  );
}
