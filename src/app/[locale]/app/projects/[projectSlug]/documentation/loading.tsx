'use client';

import { useTranslations } from 'next-intl';

export default function DocumentationGeneratorLoading() {
  const t = useTranslations('DocumentationGeneratorPage');

  return (
    <section className="mx-auto max-w-7xl">
      <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
        {t('states.loading')}
      </p>

      <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="bg-surface-primary h-96 animate-pulse rounded-3xl" />
        <div className="bg-surface-primary h-96 animate-pulse rounded-3xl" />
      </div>
    </section>
  );
}
