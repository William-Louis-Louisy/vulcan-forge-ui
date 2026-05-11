import { hasLocale, useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { SignupForm } from '@/features/auth/signup/SignupForm';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

type SignupPageProps = PageProps<'/[locale]/signup'>;

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
    <main className="bg-background-app text-content-primary min-h-screen px-6 py-16">
      <section className="mx-auto max-w-md">
        <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-content-secondary mt-4">{t('description')}</p>

        <SignupForm locale={locale} />

        <p className="text-content-secondary mt-6 text-center text-sm">
          {t('form.alreadyHaveAccount')}{' '}
          <Link href="/login" className="text-action-primary font-semibold">
            {t('form.signInLink')}
          </Link>
        </p>
      </section>
    </main>
  );
}
