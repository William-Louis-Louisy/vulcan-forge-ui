import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import {
  EnvelopeSimpleIcon,
  UserCircleIcon,
} from '@phosphor-icons/react/dist/ssr';

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
    <section>
      <header className="border-border-subtle border-b px-4 pt-6 pb-4 sm:px-6 lg:px-8 xl:px-10 xl:pt-8">
        <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
          {t('eyebrow')}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.015em]">
          {t('title')}
        </h1>
        <p className="text-content-secondary mt-1 max-w-3xl text-sm leading-6">
          {t('description')}
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 xl:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.55fr)] xl:items-start xl:px-10">
        <section
          aria-labelledby="settings-profile-title"
          className="border-border-subtle bg-surface-primary shadow-soft min-w-0 overflow-hidden rounded-md border"
        >
          <header className="border-border-subtle flex items-start gap-3 border-b p-5">
            <span
              aria-hidden="true"
              className="bg-background-subtle text-content-secondary flex size-9 shrink-0 items-center justify-center rounded-md"
            >
              <UserCircleIcon size={19} weight="duotone" />
            </span>
            <div className="min-w-0">
              <h2
                id="settings-profile-title"
                className="text-base font-semibold tracking-tight"
              >
                {t('account.title')}
              </h2>
              <p className="text-content-secondary mt-1 text-xs leading-5">
                {t('account.description')}
              </p>
            </div>
          </header>

          <dl className="divide-border-subtle divide-y">
            <div className="grid min-w-0 gap-1 px-5 py-4">
              <dt className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
                {t('account.name')}
              </dt>
              <dd className="min-w-0 text-sm font-semibold break-words">
                {pageData.user.name ?? t('account.unknownName')}
              </dd>
            </div>

            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-2 gap-y-1 px-5 py-4">
              <EnvelopeSimpleIcon
                aria-hidden="true"
                size={15}
                className="text-content-tertiary mt-5"
              />
              <div className="min-w-0">
                <dt className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
                  {t('account.email')}
                </dt>
                <dd className="mt-1 min-w-0 text-sm font-semibold break-all">
                  {pageData.user.email}
                </dd>
              </div>
            </div>
          </dl>
        </section>

        <SettingsForm initialSettings={pageData.settings} />
      </div>
    </section>
  );
}
