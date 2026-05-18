import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function DesignSystemsPage() {
  const t = await getTranslations('DesignSystemsPage');

  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
        {t('eyebrow')}
      </p>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            {t('title')}
          </h1>

          <p className="text-content-secondary mt-4 max-w-2xl">
            {t('description')}
          </p>
        </div>

        <Link
          href="/app/design-systems/new"
          className="bg-action-primary text-action-primary-content shadow-soft hover:bg-action-primary-hover inline-flex justify-center rounded-lg px-5 py-3 text-sm font-semibold transition"
        >
          {t('primaryCta')}
        </Link>
      </div>

      <div className="border-border-default bg-surface-primary shadow-soft mt-10 rounded-3xl border border-dashed p-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t('emptyState.title')}
        </h2>

        <p className="text-content-secondary mx-auto mt-4 max-w-xl leading-7">
          {t('emptyState.description')}
        </p>
      </div>
    </section>
  );
}
