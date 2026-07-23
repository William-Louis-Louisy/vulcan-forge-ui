import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import type { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { getAppShellData } from '@/features/app-navigation/app-shell.queries';

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

  const [t, appShellData] = await Promise.all([
    getTranslations({
      locale: requestedLocale,
      namespace: 'AppShell',
    }),
    getAppShellData(session.user.id),
  ]);

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
          projects: t('navigationItems.projects'),
        },
        topbar: {
          export: t('topbar.export'),
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
      {children}
    </AppShell>
  );
}
