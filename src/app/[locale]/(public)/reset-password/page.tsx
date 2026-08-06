import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { AppLink } from '@/components/navigation/AppLink';
import { PasswordRecoveryLinkBootstrap } from '@/features/auth/password-recovery/PasswordRecoveryLinkBootstrap';
import { ResetPasswordForm } from '@/features/auth/password-recovery/ResetPasswordForm';
import { routing, type Locale } from '@/i18n/routing';

type ResetPasswordPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    status?: string | string[];
  }>;
};

type PageStatus = 'confirm' | 'expired' | 'invalid' | 'pending';

function getStatus(value: string | string[] | undefined): PageStatus {
  const status = typeof value === 'string' ? value : '';

  return ['confirm', 'expired', 'invalid'].includes(status)
    ? (status as PageStatus)
    : 'pending';
}

export default async function ResetPasswordPage({
  params,
  searchParams,
}: ResetPasswordPageProps) {
  const [{ locale: requestedLocale }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const status = getStatus(query.status);
  const t = await getTranslations({
    locale,
    namespace: 'PasswordResetPage',
  });

  return (
    <>
      <PasswordRecoveryLinkBootstrap locale={locale} />
      <PublicHeader />

      <main className="bg-background-app px-4 py-16 sm:px-6 lg:px-8">
        <section className="border-border-subtle bg-surface-primary mx-auto max-w-xl rounded-xl border p-6 shadow-sm sm:p-8">
          <p className="text-action-accent text-sm font-semibold tracking-wide uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="text-content-primary mt-3 text-3xl font-semibold tracking-tight">
            {t(`states.${status}.title`)}
          </h1>
          <p className="text-content-secondary mt-4 leading-7">
            {t(`states.${status}.description`)}
          </p>

          {status === 'confirm' ? <ResetPasswordForm /> : null}

          {status === 'expired' || status === 'invalid' ? (
            <AppLink
              href="/forgot-password"
              className="text-action-accent mt-6 inline-flex font-semibold"
            >
              {t('actions.requestNewLink')}
            </AppLink>
          ) : null}

          {status === 'pending' ? (
            <AppLink
              href="/login"
              className="text-action-accent mt-6 inline-flex font-semibold"
            >
              {t('actions.backToLogin')}
            </AppLink>
          ) : null}
        </section>
      </main>
    </>
  );
}
