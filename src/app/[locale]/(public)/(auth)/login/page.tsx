import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { hasLocale, useTranslations } from 'next-intl';
import { AuthShell } from '@/components/layout/AuthShell';
import { AppLink } from '@/components/navigation/AppLink';
import { LoginForm } from '@/features/auth/login/LoginForm';

type LoginPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    reason?: string;
    registered?: string;
  }>;
};

const benefitKeys = ['workspace', 'exports', 'ai'] as const;

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale: requestedLocale } = await params;
  const { reason, registered } = await searchParams;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  return (
    <LoginPageContent
      locale={requestedLocale}
      registered={registered === '1'}
      authenticationRequired={reason === 'authentication-required'}
    />
  );
}

function LoginPageContent({
  locale,
  registered,
  authenticationRequired,
}: {
  locale: Locale;
  registered: boolean;
  authenticationRequired: boolean;
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
      />

      <p className="text-content-secondary mt-6 text-center text-sm">
        {t('form.noAccount')}{' '}
        <AppLink href="/signup" className="text-action-accent font-semibold">
          {t('form.signupLink')}
        </AppLink>
      </p>
    </AuthShell>
  );
}
