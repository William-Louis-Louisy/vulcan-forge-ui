import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { hasLocale, useTranslations } from 'next-intl';
import { AuthShell } from '@/components/layout/AuthShell';
import { AppLink } from '@/components/navigation/AppLink';
import { SignupForm } from '@/features/auth/signup/SignupForm';

type SignupPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const benefitKeys = ['tokens', 'accessibility', 'exports'] as const;

export default async function SignupPage({ params }: SignupPageProps) {
  const { locale: requestedLocale } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  return <SignupPageContent locale={requestedLocale} />;
}

function SignupPageContent({ locale }: { locale: Locale }) {
  const t = useTranslations('SignupPage');

  return (
    <AuthShell
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      benefitsTitle={t('benefits.title')}
      benefits={benefitKeys.map((key) => t(`benefits.items.${key}`))}
    >
      <SignupForm locale={locale} />

      <p className="text-content-secondary mt-6 text-center text-sm">
        {t('form.alreadyHaveAccount')}{' '}
        <AppLink href="/login" className="text-action-primary font-semibold">
          {t('form.signInLink')}
        </AppLink>
      </p>
    </AuthShell>
  );
}
