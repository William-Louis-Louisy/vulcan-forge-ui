'use client';

import { useTranslations } from 'next-intl';

export default function ThemesEditorLoading() {
  const t = useTranslations('ThemesEditorPage');

  return (
    <section className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <p className="sr-only" role="status">
        {t('states.loading')}
      </p>

      <div
        aria-hidden="true"
        className="border-border-subtle bg-background-app/95 grid shrink-0 grid-cols-2 gap-1 border-b p-2 lg:hidden"
      >
        <div className="bg-content-primary/15 h-9 animate-pulse rounded-md" />
        <div className="bg-background-subtle h-9 animate-pulse rounded-md" />
      </div>

      <div
        aria-hidden="true"
        className="min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:overflow-hidden xl:grid-cols-[minmax(0,1fr)_26rem]"
      >
        <section className="flex min-h-0 min-w-0 flex-col lg:overflow-hidden">
          <header className="border-border-subtle shrink-0 border-b px-4 pt-4 md:px-6 xl:px-7 xl:pt-5">
            <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="bg-background-subtle h-7 w-48 max-w-full animate-pulse rounded-md" />
                <div className="bg-background-subtle mt-2 h-4 w-full max-w-2xl animate-pulse rounded-md" />
              </div>
              <div className="bg-background-subtle h-4 w-16 animate-pulse rounded-md" />
            </div>

            <div className="mt-3 flex gap-1">
              <div className="border-action-primary h-9 w-20 animate-pulse border-b-2" />
              <div className="border-border-subtle h-9 w-20 animate-pulse border-b-2" />
            </div>
          </header>

          <main className="min-h-0 min-w-0 flex-1 p-4 lg:overflow-y-auto md:px-6 xl:px-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="bg-background-subtle h-3 w-14 animate-pulse rounded-md" />
                <div className="bg-background-subtle mt-2 h-5 w-32 animate-pulse rounded-md" />
              </div>
              <div className="bg-action-primary/10 h-7 w-20 animate-pulse rounded-full" />
            </div>

            <section className="border-border-subtle bg-surface-primary mt-4 rounded-md border">
              <div className="border-border-subtle border-b p-4">
                <div className="bg-background-subtle h-4 w-32 animate-pulse rounded-md" />
                <div className="bg-background-subtle mt-2 h-3 w-full max-w-xl animate-pulse rounded-md" />
              </div>

              <div className="grid gap-2 p-3 sm:p-4">
                {Array.from({ length: 5 }, (_, index) => (
                  <div
                    key={index}
                    className="border-border-subtle grid min-h-24 animate-pulse gap-3 rounded-md border p-3 xl:grid-cols-[minmax(7rem,0.65fr)_minmax(16rem,1.7fr)_minmax(8rem,0.8fr)_auto] xl:items-center"
                  >
                    <div className="bg-background-subtle h-5 w-24 rounded-md" />
                    <div className="bg-background-subtle h-10 w-full rounded-md" />
                    <div className="bg-background-subtle h-5 w-20 rounded-md" />
                    <div className="bg-background-subtle h-8 w-24 rounded-md" />
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-5">
              <div className="bg-background-subtle h-4 w-32 animate-pulse rounded-md" />
              <div className="bg-background-subtle mt-2 h-3 w-full max-w-xl animate-pulse rounded-md" />
              <div className="border-border-subtle bg-surface-primary mt-3 h-44 animate-pulse rounded-md border" />
            </section>
          </main>
        </section>

        <aside className="border-border-subtle bg-background-sunken hidden min-h-0 min-w-0 border-l p-4 lg:block lg:overflow-hidden">
          <div className="bg-background-subtle h-4 w-24 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-2 h-3 w-full animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-4 h-9 w-full animate-pulse rounded-md" />
          <div className="bg-surface-primary mt-4 h-28 animate-pulse rounded-md" />
          <div className="bg-surface-primary mt-3 h-36 animate-pulse rounded-md" />
          <div className="bg-surface-primary mt-3 h-44 animate-pulse rounded-md" />
        </aside>
      </div>
    </section>
  );
}
