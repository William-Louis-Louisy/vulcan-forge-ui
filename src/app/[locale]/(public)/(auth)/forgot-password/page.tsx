import { hasLocale, useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { AuthShell } from '@/components/layout/AuthShell';
import { AppLink } from '@/components/navigation/AppLink';
import { RequestPasswordRecoveryForm } from '@/features/auth/password-recovery/RequestPasswordRecoveryForm';
import { routing } from '@/i18n/routing';

type ForgotPasswordPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const benefitKeys = ['neutral', 'singleUse', 'sessions'] as const;

export default async function ForgotPasswordPage({
  params,
}: ForgotPasswordPageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return <ForgotPasswordPageContent />;
}

function ForgotPasswordPageContent() {
  const t = useTranslations('PasswordRecoveryRequestPage');

  return (
    <AuthShell
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      benefitsTitle={t('benefits.title')}
      benefits={benefitKeys.map((key) => t(`benefits.items.${key}`))}
      variant="login"
    >
      <RequestPasswordRecoveryForm />

      <p className="text-content-secondary mt-6 text-center text-sm">
        <AppLink href="/login" className="text-action-accent font-semibold">
          {t('backToLogin')}
        </AppLink>
      </p>
    </AuthShell>
  );
}
