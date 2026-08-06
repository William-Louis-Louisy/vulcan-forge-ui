import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { hasLocale, useTranslations } from 'next-intl';
import { AuthShell } from '@/components/layout/AuthShell';
import { AppLink } from '@/components/navigation/AppLink';
import { SignupForm } from '@/features/auth/signup/SignupForm';
import { getSafeAuthReturnTo } from '@/features/auth/shared/return-to';

type SignupPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    returnTo?: string;
  }>;
};

const benefitKeys = ['tokens', 'accessibility', 'exports', 'ai'] as const;

export default async function SignupPage({
  params,
  searchParams,
}: SignupPageProps) {
  const { locale: requestedLocale } = await params;
  const { returnTo } = await searchParams;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;

  return (
    <SignupPageContent
      locale={locale}
      returnTo={getSafeAuthReturnTo({ locale, returnTo })}
    />
  );
}

function SignupPageContent({
  locale,
  returnTo,
}: {
  locale: Locale;
  returnTo: string;
}) {
  const t = useTranslations('SignupPage');

  return (
    <AuthShell
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      benefitsTitle={t('benefits.title')}
      benefits={benefitKeys.map((key) => t(`benefits.items.${key}`))}
      variant="signup"
    >
      <SignupForm locale={locale} returnTo={returnTo} />

      <p className="text-content-secondary mt-6 text-center text-sm">
        {t('form.alreadyHaveAccount')}{' '}
        <AppLink
          href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
          className="text-action-accent font-semibold"
        >
          {t('form.signInLink')}
        </AppLink>
      </p>
    </AuthShell>
  );
}
