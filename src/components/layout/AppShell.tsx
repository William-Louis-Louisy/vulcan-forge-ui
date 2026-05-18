import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { appConfig } from '@/config/app';
import { LogoutButton } from '@/features/auth/logout/LogoutButton';
import { AppShellNavigation } from '@/components/layout/AppShellNavigation';
import type { PrivateNavigationItemKey } from '@/features/app-navigation/private-navigation';

type AppShellLabels = {
  navigationLabel: string;
  navigationItems: Record<PrivateNavigationItemKey, string>;
  account: string;
  signedInAs: string;
};

type AppShellProps = {
  children: ReactNode;
  userEmail: string;
  labels: AppShellLabels;
};

export function AppShell({ children, userEmail, labels }: AppShellProps) {
  return (
    <div className="bg-background-app text-content-primary min-h-screen lg:grid lg:h-screen lg:grid-cols-[17rem_minmax(0,1fr)] lg:overflow-hidden">
      <aside className="border-border-subtle bg-background-subtle hidden border-r lg:block lg:h-screen lg:overflow-y-auto">
        <div className="flex min-h-full flex-col px-5 py-6">
          <Link
            href="/app"
            className="inline-flex items-center gap-3 font-semibold"
          >
            <span className="bg-action-primary text-action-primary-content flex size-9 items-center justify-center rounded-lg text-sm font-black">
              VF
            </span>
            <span>{appConfig.name}</span>
          </Link>

          <div className="mt-10">
            <AppShellNavigation
              navigationLabel={labels.navigationLabel}
              labels={labels.navigationItems}
            />
          </div>

          <div className="border-border-subtle bg-surface-primary mt-auto rounded-2xl border p-4">
            <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
              {labels.account}
            </p>

            <p className="text-content-secondary mt-2 truncate text-sm">
              {labels.signedInAs}
            </p>

            <p className="truncate text-sm font-semibold">{userEmail}</p>

            <div className="mt-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 lg:h-screen lg:overflow-y-auto">
        <header className="border-border-subtle bg-background-app flex min-h-16 items-center justify-between border-b px-6 lg:hidden">
          <Link
            href="/app"
            className="inline-flex items-center gap-3 font-semibold"
          >
            <span className="bg-action-primary text-action-primary-content flex size-9 items-center justify-center rounded-lg text-sm font-black">
              VF
            </span>
            <span>{appConfig.name}</span>
          </Link>

          <LogoutButton />
        </header>

        <main className="px-6 py-10 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
