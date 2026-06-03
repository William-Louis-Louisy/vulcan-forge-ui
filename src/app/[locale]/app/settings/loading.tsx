'use client';

import { useTranslations } from 'next-intl';

export default function SettingsLoading() {
  const t = useTranslations('SettingsPage');

  return (
    <section className="mx-auto max-w-4xl">
      <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
        {t('states.loading')}
      </p>

      <div className="mt-8 grid gap-6">
        <div className="bg-surface-primary h-40 animate-pulse rounded-3xl" />
        <div className="bg-surface-primary h-96 animate-pulse rounded-3xl" />
      </div>
    </section>
  );
}
