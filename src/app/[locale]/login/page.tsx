import { auth } from '@/auth';
import { Link } from '@/i18n/navigation';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { hasLocale, useTranslations } from 'next-intl';
import { LoginForm } from '@/features/auth/login/LoginForm';

type LoginPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    registered?: string;
  }>;
};

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale: requestedLocale } = await params;
  const { registered } = await searchParams;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const session = await auth();

  if (session?.user) {
    redirect(`/${requestedLocale}/app`);
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
    <main className="bg-background-app text-content-primary min-h-screen px-6 py-16">
      <section className="mx-auto max-w-md">
        <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-content-secondary mt-4">{t('description')}</p>

        <LoginForm locale={locale} registered={registered} />

        <p className="text-content-secondary mt-6 text-center text-sm">
          {t('form.noAccount')}{' '}
          <Link href="/signup" className="text-action-primary font-semibold">
            {t('form.signupLink')}
          </Link>
        </p>
      </section>
    </main>
  );
}
