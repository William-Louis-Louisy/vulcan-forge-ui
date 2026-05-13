import type { ReactNode } from 'react';
import { LogoutButton } from '@/features/auth/logout/LogoutButton';
import { Link } from '@/i18n/navigation';
import { appConfig } from '@/config/app';

type AppShellLabels = {
  navigationLabel: string;
  dashboard: string;
  projectsSoon: string;
  settingsSoon: string;
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
    <div className="bg-background-app text-content-primary min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="border-border-subtle bg-background-subtle hidden border-r lg:block">
        <div className="flex h-full min-h-screen flex-col px-5 py-6">
          <Link
            href="/app"
            className="inline-flex items-center gap-3 font-semibold"
          >
            <span className="bg-action-primary text-action-primary-content flex size-9 items-center justify-center rounded-lg text-sm font-black">
              VF
            </span>
            <span>{appConfig.name}</span>
          </Link>

          <nav aria-label={labels.navigationLabel} className="mt-10 space-y-1">
            <Link
              href="/app"
              className="bg-surface-primary text-content-primary shadow-soft flex rounded-lg px-3 py-2 text-sm font-semibold"
            >
              {labels.dashboard}
            </Link>

            <button
              type="button"
              disabled
              className="text-content-tertiary flex w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm font-medium"
            >
              {labels.projectsSoon}
            </button>

            <button
              type="button"
              disabled
              className="text-content-tertiary flex w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm font-medium"
            >
              {labels.settingsSoon}
            </button>
          </nav>

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

      <div className="min-w-0">
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
