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

        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 xl:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.55fr)] xl:items-start xl:px-10">
          <div className="border-border-subtle bg-surface-primary h-64 animate-pulse rounded-md border" />
          <div className="border-border-subtle bg-surface-primary h-[32rem] animate-pulse rounded-md border" />
        </div>
      </div>
    </section>
  );
}
