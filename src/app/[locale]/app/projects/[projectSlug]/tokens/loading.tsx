'use client';

import { useTranslations } from 'next-intl';

export default function TokensEditorLoading() {
  const t = useTranslations('TokensEditorPage');

  return (
    <section className="h-[calc(100vh-3rem)] min-h-0 overflow-hidden">
      <p className="sr-only" role="status">
        {t('states.loading')}
      </p>

      <div
        aria-hidden="true"
        className="flex h-full min-h-0 flex-col overflow-y-auto xl:grid xl:grid-cols-[minmax(0,1fr)_26rem] xl:overflow-hidden"
      >
        <div className="flex min-w-0 flex-col xl:min-h-0 xl:overflow-hidden">
          <header className="border-border-subtle bg-background-app shrink-0 border-b px-4 pt-4 md:px-6 xl:px-7 xl:pt-5">
            <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="bg-background-subtle h-7 w-40 max-w-full animate-pulse rounded-md" />
                <div className="bg-background-subtle mt-2 h-4 w-full max-w-xl animate-pulse rounded-md" />
              </div>
              <div className="flex gap-2">
                <div className="bg-background-subtle h-9 w-52 animate-pulse rounded-md" />
                <div className="bg-background-subtle h-9 w-28 animate-pulse rounded-md" />
              </div>
            </div>

            <div className="mt-4 flex min-w-0 gap-1 overflow-hidden">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="border-border-subtle h-10 w-24 shrink-0 animate-pulse border-b-2"
                />
              ))}
            </div>
          </header>

          <main className="flex min-h-0 flex-col py-4 md:px-6 xl:flex-1 xl:overflow-hidden xl:px-7">
            <div className="min-h-0 xl:flex-1 xl:overflow-hidden">
              <div className="p-4 xl:h-full xl:overflow-hidden">
                <div className="bg-background-subtle h-3 w-32 animate-pulse rounded-md" />
                <div className="border-border-subtle bg-surface-primary mt-3 overflow-hidden rounded-md border">
                  {Array.from({ length: 7 }, (_, index) => (
                    <div
                      key={index}
                      className="border-border-subtle flex h-16 items-center gap-3 border-b px-4 last:border-b-0"
                    >
                      <div className="bg-background-subtle size-7 shrink-0 animate-pulse rounded-full" />
                      <div className="min-w-0 flex-1">
                        <div className="bg-background-subtle h-3 w-48 max-w-full animate-pulse rounded-sm" />
                        <div className="bg-background-subtle mt-2 h-3 w-28 animate-pulse rounded-sm" />
                      </div>
                      <div className="bg-background-subtle h-5 w-16 animate-pulse rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>

        <aside className="border-border-subtle grid min-h-0 border-t xl:grid-rows-[auto_minmax(0,1fr)] xl:overflow-hidden xl:border-t-0 xl:border-l">
          <section className="border-border-subtle bg-background-sunken border-b p-4">
            <div className="bg-background-subtle h-3 w-20 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-3 h-28 animate-pulse rounded-md" />
          </section>
          <section className="bg-background-app p-4 xl:overflow-hidden">
            <div className="bg-background-subtle h-3 w-24 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-3 h-10 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-4 h-24 animate-pulse rounded-md" />
            <div className="bg-background-subtle mt-4 h-44 animate-pulse rounded-md" />
          </section>
        </aside>
      </div>
    </section>
  );
}
