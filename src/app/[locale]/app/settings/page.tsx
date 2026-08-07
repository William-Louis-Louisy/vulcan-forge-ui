import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';

import { routing, type Locale } from '@/i18n/routing';
import { SettingsForm } from '@/features/settings/SettingsForm';
import { AccountProfileForm } from '@/features/settings/AccountProfileForm';
import { DeleteAccountSection } from '@/features/settings/DeleteAccountSection';
import { SessionSecuritySection } from '@/features/settings/SessionSecuritySection';
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
  const pageData = await getSettingsPageData({ userId: session.user.id });

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

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <AccountProfileForm
          locale={locale}
          initialProfile={{
            name: pageData.user.name ?? '',
            email: pageData.user.email,
          }}
        />
        <SettingsForm initialSettings={pageData.settings} />
        <SessionSecuritySection locale={locale} />
        <DeleteAccountSection email={pageData.user.email} locale={locale} />
      </div>
    </section>
  );
}
