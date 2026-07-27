import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { AppLink } from '@/components/navigation/AppLink';
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
    <section className="mx-auto min-h-full max-w-5xl pt-8 pb-12 lg:pt-12 lg:pb-16">
      <AppLink
        href="/app"
        className="text-content-secondary hover:text-content-primary text-sm font-semibold transition"
      >
        {t('backLink')}
      </AppLink>

      <p className="text-action-accent mt-8 text-sm font-semibold tracking-[0.24em] uppercase">
        {t('eyebrow')}
      </p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        {t('title')}
      </h1>

      <p className="text-content-secondary mt-4 max-w-2xl">
        {t('description')}
      </p>

      <div className="mt-2 pb-6 sm:pb-8">
        <CreateDesignSystemWizard locale={locale} />
      </div>
    </section>
  );
}
