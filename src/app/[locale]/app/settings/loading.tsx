'use client';

import { useTranslations } from 'next-intl';

export default function SettingsLoading() {
  const t = useTranslations('SettingsPage');

  return (
    <section>
      <p className="sr-only" role="status">
        {t('states.loading')}
      </p>

      <div aria-hidden="true">
        <header className="border-border-subtle border-b px-4 pt-6 pb-4 sm:px-6 lg:px-8 xl:px-10 xl:pt-8">
          <div className="bg-background-subtle h-3 w-28 animate-pulse rounded-sm" />
          <div className="bg-background-subtle mt-3 h-8 w-44 animate-pulse rounded-md" />
          <div className="bg-background-subtle mt-3 h-4 w-full max-w-xl animate-pulse rounded-md" />
        </header>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-10">
          {[0, 1, 2, 3].map((section) => (
            <div
              key={section}
              className="border-border-subtle grid gap-6 border-b py-8 xl:grid-cols-[minmax(12rem,0.38fr)_minmax(0,1fr)] xl:gap-12"
            >
              <div>
                <div className="bg-background-subtle h-5 w-32 animate-pulse rounded-md" />
                <div className="bg-background-subtle mt-3 h-4 w-full max-w-xs animate-pulse rounded-md" />
                <div className="bg-background-subtle mt-2 h-4 w-4/5 max-w-xs animate-pulse rounded-md" />
              </div>
              <div className="bg-surface-primary border-border-subtle h-32 animate-pulse rounded-md border" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
