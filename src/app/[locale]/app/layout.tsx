import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { EmailVerificationBanner } from '@/features/auth/email-verification/EmailVerificationBanner';
import { getSafeAuthReturnTo } from '@/features/auth/shared/return-to';
import { AUTH_REQUEST_TARGET_HEADER } from '@/features/auth/shared/request-target';
import { getAppShellData } from '@/features/app-navigation/app-shell.queries';
import { routing, type Locale } from '@/i18n/routing';
import { prisma } from '@/server/db/prisma';

type AppLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

function getAuthenticationRequiredUrl({
  locale,
  returnTo,
}: {
  locale: Locale;
  returnTo: string | null;
}) {
  const searchParams = new URLSearchParams({
    reason: 'authentication-required',
    returnTo: getSafeAuthReturnTo({ locale, returnTo }),
  });

  return `/${locale}/login?${searchParams.toString()}`;
}

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { locale: requestedLocale } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const requestHeaders = await headers();
  const authenticationRequiredUrl = getAuthenticationRequiredUrl({
    locale,
    returnTo: requestHeaders.get(AUTH_REQUEST_TARGET_HEADER),
  });
  const session = await auth();

  if (!session?.user) {
    redirect(authenticationRequiredUrl);
  }

  const [user, t, appShellData] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        emailVerifiedAt: true,
      },
    }),
    getTranslations({
      locale,
      namespace: 'AppShell',
    }),
    getAppShellData(session.user.id),
  ]);

  if (!user) {
    redirect(authenticationRequiredUrl);
  }

  return (
    <AppShell
      userEmail={session.user.email ?? t('unknownUser')}
      workspaceName={appShellData.workspaceName ?? t('sidebar.workspace')}
      projects={appShellData.projects}
      themePreference={appShellData.themePreference}
      labels={{
        navigationLabel: t('navigationLabel'),
        navigationItems: {
          dashboard: t('navigationItems.dashboard'),
        },
        topbar: {
          settings: t('navigationItems.settings'),
          userMenuLabel: t('topbar.userMenuLabel'),
          account: t('topbar.account'),
          breadcrumb: {
            ariaLabel: t('topbar.breadcrumbLabel'),
            allProjects: t('navigationItems.projects'),
            saveStatus: {
              saved: t('topbar.saveStatus.saved'),
              unsaved: t('topbar.saveStatus.unsaved'),
              saving: t('topbar.saveStatus.saving'),
              error: t('topbar.saveStatus.error'),
            },
          },
        },
        sidebar: {
          workspace: t('sidebar.workspace'),
          beta: t('sidebar.beta'),
        },
      }}
    >
      {!user.emailVerifiedAt ? (
        <EmailVerificationBanner locale={locale} />
      ) : null}
      {children}
    </AppShell>
  );
}
