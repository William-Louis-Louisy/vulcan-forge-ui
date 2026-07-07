import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import type { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import { prisma } from '@/server/db/prisma';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import type { ThemePreference } from '@/features/settings/user-settings.schema';

type AppLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { locale: requestedLocale } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const session = await auth();

  if (!session?.user) {
    redirect(`/${requestedLocale}/login`);
  }

  const t = await getTranslations({
    locale: requestedLocale,
    namespace: 'AppShell',
  });

  const userPreferences = await prisma.userPreference.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      themePreference: true,
    },
  });

  const themePreference =
    (userPreferences?.themePreference as ThemePreference | undefined) ??
    'system';

  return (
    <AppShell
      userEmail={session.user.email ?? t('unknownUser')}
      workspaceName={session.user.name ?? t('unknownUser')}
      themePreference={themePreference}
      labels={{
        navigationLabel: t('navigationLabel'),
        navigationItems: {
          dashboard: t('navigationItems.dashboard'),
          projects: t('navigationItems.projects'),
          settings: t('navigationItems.settings'),
        },
        topbar: {
          export: t('topbar.export'),
          workspaceLabel: t('topbar.workspaceLabel'),
          userMenuLabel: t('topbar.userMenuLabel'),
          account: t('topbar.account'),
          breadcrumb: {
            ariaLabel: t('topbar.breadcrumbLabel'),
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
      {children}
    </AppShell>
  );
}
