import type { ReactNode } from 'react';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AppShell } from '@/components/layout/AppShell';
import { routing } from '@/i18n/routing';

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

  return (
    <AppShell
      userEmail={session.user.email ?? t('unknownUser')}
      labels={{
        navigationLabel: t('navigationLabel'),
        dashboard: t('dashboard'),
        projectsSoon: t('projectsSoon'),
        settingsSoon: t('settingsSoon'),
        account: t('account'),
        signedInAs: t('signedInAs'),
      }}
    >
      {children}
    </AppShell>
  );
}
