'use client';

import { useTranslations } from 'next-intl';

export default function ThemesEditorLoading() {
  const t = useTranslations('ThemesEditorPage');

  return (
    <section className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <p className="sr-only" role="status">
        {t('states.loading')}
      </p>

      <div className="border-border-subtle bg-background-app grid grid-cols-2 gap-1 border-b p-2 lg:hidden">
        <div className="bg-content-primary/15 h-9 animate-pulse rounded-md" />
        <div className="bg-background-subtle h-9 animate-pulse rounded-md" />
      </div>

      <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] xl:h-full xl:grid-cols-[minmax(0,1fr)_24rem] xl:overflow-hidden">
        <main className="min-h-0 min-w-0 p-4 sm:p-6 xl:overflow-hidden">
          <div className="mx-auto w-full max-w-5xl">
            <div className="border-border-subtle border-b pb-5">
              <div className="bg-background-subtle h-3 w-20 animate-pulse rounded-md" />
              <div className="bg-background-subtle mt-3 h-7 w-48 max-w-full animate-pulse rounded-md" />
              <div className="bg-background-subtle mt-3 h-4 max-w-xl animate-pulse rounded-md" />
            </div>

            <div className="mt-5 grid gap-5">
              <div className="bg-surface-primary h-96 animate-pulse rounded-3xl" />
              <div className="bg-surface-primary h-96 animate-pulse rounded-3xl" />
              <div className="bg-surface-primary h-72 animate-pulse rounded-3xl" />
            </div>
          </div>
        </main>

        <aside className="border-border-subtle bg-background-sunken hidden min-h-0 min-w-0 border-l p-4 lg:block xl:h-full xl:overflow-hidden">
          <div className="bg-background-subtle h-3 w-20 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-6 w-36 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-9 w-full animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-4 h-96 animate-pulse rounded-md" />
        </aside>
      </div>
    </section>
  );
}
