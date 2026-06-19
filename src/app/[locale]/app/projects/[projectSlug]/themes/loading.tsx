'use client';

import { useTranslations } from 'next-intl';

export default function ThemesEditorLoading() {
  const t = useTranslations('ThemesEditorPage');

  return (
    <section className="mx-auto max-w-7xl">
      <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
        {t('states.loading')}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="bg-surface-primary h-72 animate-pulse rounded-3xl" />
        <div className="bg-surface-primary h-72 animate-pulse rounded-3xl" />
      </div>
    </section>
  );
}
