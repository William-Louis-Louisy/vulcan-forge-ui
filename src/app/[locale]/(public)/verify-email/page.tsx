import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { AppLink } from '@/components/navigation/AppLink';
import { ResendEmailVerificationForm } from '@/features/auth/email-verification/ResendEmailVerificationForm';
import { routing, type Locale } from '@/i18n/routing';
import { prisma } from '@/server/db/prisma';

type VerificationStatus =
  | 'alreadyVerified'
  | 'expired'
  | 'invalid'
  | 'verified';

type DeliveryStatus = 'deliveryUnavailable' | 'rateLimited' | 'sent';

type EmailVerificationPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    delivery?: string | string[];
    status?: string | string[];
  }>;
};

const verificationStatuses = new Set<VerificationStatus>([
  'alreadyVerified',
  'expired',
  'invalid',
  'verified',
]);
const deliveryStatuses = new Set<DeliveryStatus>([
  'deliveryUnavailable',
  'rateLimited',
  'sent',
]);

function getStringSearchParam(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : '';
}

function getVerificationStatus(value: string): VerificationStatus | null {
  return verificationStatuses.has(value as VerificationStatus)
    ? (value as VerificationStatus)
    : null;
}

function getDeliveryStatus(value: string): DeliveryStatus | null {
  return deliveryStatuses.has(value as DeliveryStatus)
    ? (value as DeliveryStatus)
    : null;
}

export default async function EmailVerificationPage({
  params,
  searchParams,
}: EmailVerificationPageProps) {
  const [{ locale: requestedLocale }, query, session] = await Promise.all([
    params,
    searchParams,
    auth(),
  ]);

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const status = getVerificationStatus(
    getStringSearchParam(query.status),
  );
  const delivery = getDeliveryStatus(
    getStringSearchParam(query.delivery),
  );
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          email: true,
          emailVerifiedAt: true,
        },
      })
    : null;

  if (
    user?.emailVerifiedAt &&
    status !== 'verified' &&
    status !== 'alreadyVerified'
  ) {
    redirect(`/${locale}/app`);
  }

  const t = await getTranslations({
    locale,
    namespace: 'EmailVerificationPage',
  });
  const contentStatus = status ?? 'pending';
  const isVerified =
    contentStatus === 'verified' || contentStatus === 'alreadyVerified';
  const canResend = Boolean(user && !user.emailVerifiedAt);

  return (
    <>
      <PublicHeader isAuthenticated={Boolean(session?.user?.id)} />

      <main className="bg-background-app px-4 py-16 sm:px-6 lg:px-8">
        <section className="border-border-subtle bg-surface-primary mx-auto max-w-xl rounded-xl border p-6 shadow-sm sm:p-8">
          <p className="text-action-accent text-sm font-semibold tracking-wide uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="text-content-primary mt-3 text-3xl font-semibold tracking-tight">
            {t(`states.${contentStatus}.title`)}
          </h1>
          <p className="text-content-secondary mt-4 leading-7">
            {t(`states.${contentStatus}.description`)}
          </p>

          {user?.email ? (
            <p className="border-border-subtle bg-surface-secondary text-content-primary mt-6 rounded-md border px-4 py-3 text-sm">
              {t('accountEmail', { email: user.email })}
            </p>
          ) : null}

          {delivery ? (
            <p
              role={delivery === 'sent' ? 'status' : 'alert'}
              className={`mt-6 rounded-md border px-4 py-3 text-sm ${
                delivery === 'sent'
                  ? 'border-action-success/30 bg-action-success/10 text-action-success'
                  : 'border-action-danger/30 bg-action-danger/10 text-action-danger'
              }`}
            >
              {t(`delivery.${delivery}`)}
            </p>
          ) : null}

          {canResend ? (
            <ResendEmailVerificationForm locale={locale} />
          ) : null}

          <div className="mt-6 text-center">
            {isVerified && session?.user?.id ? (
              <AppLink
                href="/app"
                className="text-action-accent font-semibold"
              >
                {t('actions.continue')}
              </AppLink>
            ) : null}

            {!session?.user?.id ? (
              <AppLink
                href="/login"
                className="text-action-accent font-semibold"
              >
                {t('actions.signIn')}
              </AppLink>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}
