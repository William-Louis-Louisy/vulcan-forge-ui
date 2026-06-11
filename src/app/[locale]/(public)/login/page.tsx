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
    registered?: string;
  }>;
};

const benefitKeys = ['workspace', 'exports', 'ai'] as const;

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale: requestedLocale } = await params;
  const { registered } = await searchParams;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  return (
    <LoginPageContent
      locale={requestedLocale}
      registered={registered === '1'}
    />
  );
}

function LoginPageContent({
  locale,
  registered,
}: {
  locale: Locale;
  registered: boolean;
}) {
  const t = useTranslations('LoginPage');

  return (
    <AuthShell
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      benefitsTitle={t('benefits.title')}
      benefits={benefitKeys.map((key) => t(`benefits.items.${key}`))}
    >
      <LoginForm locale={locale} registered={registered} />

      <p className="text-content-secondary mt-6 text-center text-sm">
        {t('form.noAccount')}{' '}
        <AppLink href="/signup" className="text-action-primary font-semibold">
          {t('form.signupLink')}
        </AppLink>
      </p>
    </AuthShell>
  );
}
