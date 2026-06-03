import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { SettingsForm } from '@/features/settings/SettingsForm';
import { getSettingsPageData } from '@/features/settings/settings.queries';

type SettingsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale: requestedLocale } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('SettingsPage');

  const pageData = await getSettingsPageData({
    userId: session.user.id,
  });

  if (!pageData) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl">
      <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
        {t('eyebrow')}
      </p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        {t('title')}
      </h1>

      <p className="text-content-secondary mt-4 max-w-3xl">
        {t('description')}
      </p>

      <div className="border-border-subtle bg-surface-primary shadow-soft mt-8 rounded-3xl border p-6">
        <h2 className="text-xl font-semibold tracking-tight">
          {t('account.title')}
        </h2>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-content-secondary text-xs font-semibold tracking-[0.18em] uppercase">
              {t('account.name')}
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {pageData.user.name ?? t('account.unknownName')}
            </dd>
          </div>

          <div>
            <dt className="text-content-secondary text-xs font-semibold tracking-[0.18em] uppercase">
              {t('account.email')}
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {pageData.user.email}
            </dd>
          </div>
        </dl>
      </div>

      <SettingsForm initialSettings={pageData.settings} />
    </section>
  );
}
