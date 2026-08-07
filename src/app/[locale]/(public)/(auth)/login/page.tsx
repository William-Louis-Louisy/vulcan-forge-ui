import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { hasLocale, useTranslations } from 'next-intl';
import { AuthShell } from '@/components/layout/AuthShell';
import { AppLink } from '@/components/navigation/AppLink';
import { LoginForm } from '@/features/auth/login/LoginForm';
import { getSafeAuthReturnTo } from '@/features/auth/shared/return-to';

type LoginPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    reason?: string;
    registered?: string;
    returnTo?: string;
  }>;
};

const benefitKeys = ['workspace', 'exports', 'ai'] as const;

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale: requestedLocale } = await params;
  const { reason, registered, returnTo } = await searchParams;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;

  return (
    <LoginPageContent
      locale={locale}
      registered={registered === '1'}
      authenticationRequired={reason === 'authentication-required'}
      returnTo={getSafeAuthReturnTo({ locale, returnTo })}
    />
  );
}

function LoginPageContent({
  locale,
  registered,
  authenticationRequired,
  returnTo,
}: {
  locale: Locale;
  registered: boolean;
  authenticationRequired: boolean;
  returnTo: string;
}) {
  const t = useTranslations('LoginPage');

  return (
    <AuthShell
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      benefitsTitle={t('benefits.title')}
      benefits={benefitKeys.map((key) => t(`benefits.items.${key}`))}
      variant="login"
    >
      <LoginForm
        locale={locale}
        registered={registered}
        authenticationRequired={authenticationRequired}
        returnTo={returnTo}
      />

      <p className="text-content-secondary mt-6 text-center text-sm">
        {t('form.noAccount')}{' '}
        <AppLink
          href={`/signup?returnTo=${encodeURIComponent(returnTo)}`}
          className="text-action-accent font-semibold"
        >
          {t('form.signupLink')}
        </AppLink>
      </p>
    </AuthShell>
  );
}
