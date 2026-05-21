'use client';

import { useTranslations } from 'next-intl';

export default function TokensEditorLoading() {
  const t = useTranslations('TokensEditorPage');

  return (
    <section className="mx-auto max-w-7xl">
      <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
        {t('states.loading')}
      </p>

      <div className="bg-surface-primary mt-8 h-36 animate-pulse rounded-3xl" />
      <div className="mt-6 grid gap-4">
        <div className="bg-surface-primary h-24 animate-pulse rounded-2xl" />
        <div className="bg-surface-primary h-24 animate-pulse rounded-2xl" />
        <div className="bg-surface-primary h-24 animate-pulse rounded-2xl" />
      </div>
    </section>
  );
}
