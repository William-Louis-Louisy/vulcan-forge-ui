'use client';

import { useTranslations } from 'next-intl';

export default function SettingsLoading() {
  const t = useTranslations('SettingsPage');

  return (
    <section className="mx-auto max-w-4xl">
      <p className="sr-only" role="status">
        {t('states.loading')}
      </p>

      <div aria-hidden="true">
        <div className="bg-background-subtle h-8 w-48 animate-pulse rounded-md" />
        <div className="bg-background-subtle mt-3 h-4 w-full max-w-xl animate-pulse rounded-md" />
        <div className="mt-8 grid gap-6">
          <div className="border-border-subtle bg-surface-primary h-40 animate-pulse rounded-md border" />
          <div className="border-border-subtle bg-surface-primary h-96 animate-pulse rounded-md border" />
        </div>
      </div>
    </section>
  );
}
