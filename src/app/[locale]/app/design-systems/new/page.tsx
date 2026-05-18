import { hasLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { CreateDesignSystemWizard } from '@/features/design-systems/CreateDesignSystemWizard';

type CreateDesignSystemPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CreateDesignSystemPage({
  params,
}: CreateDesignSystemPageProps) {
  const { locale: requestedLocale } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  return <CreateDesignSystemPageContent locale={requestedLocale} />;
}

async function CreateDesignSystemPageContent({ locale }: { locale: Locale }) {
  const t = await getTranslations('CreateDesignSystemPage');

  return (
    <section className="mx-auto max-w-3xl">
      <Link
        href="/app/design-systems"
        className="text-action-primary text-sm font-semibold"
      >
        {t('backLink')}
      </Link>

      <p className="text-action-primary mt-8 text-sm font-semibold tracking-[0.24em] uppercase">
        {t('eyebrow')}
      </p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        {t('title')}
      </h1>

      <p className="text-content-secondary mt-4 max-w-2xl">
        {t('description')}
      </p>

      <div className="border-border-subtle bg-surface-primary shadow-soft mt-8 rounded-3xl border p-6">
        <CreateDesignSystemWizard locale={locale} />
      </div>
    </section>
  );
}
