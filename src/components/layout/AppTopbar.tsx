import Logo from './Logo';
import { UserMenu } from './UserMenu';
import type { ReactNode } from 'react';
import { MobileAppMenu } from './MobileAppMenu';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { ProjectTopbarBreadcrumbTrail } from './ProjectTopbarBreadcrumb';
import type { ProjectTopbarBreadcrumbLabels } from './ProjectTopbarBreadcrumb';
import type { PrivateNavigationItemKey } from '@/features/app-navigation/private-navigation';

export type AppTopbarLabels = {
  account: string;
  settings: string;
  userMenuLabel: string;
  breadcrumb: ProjectTopbarBreadcrumbLabels;
};

type AppTopbarProps = {
  userEmail: string;
  labels: AppTopbarLabels;
  navigationLabel: string;
  navigationItems: Record<PrivateNavigationItemKey, string>;
  workspaceName?: string;
  leading?: ReactNode;
  status?: ReactNode;
};

export function AppTopbar({
  userEmail,
  labels,
  navigationLabel,
  navigationItems,
  workspaceName = 'Atelier Lyon',
  leading,
  status,
}: AppTopbarProps) {
  return (
    <header className="border-border-subtle bg-background-sunken flex h-12 min-w-0 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
      <Logo />
      {leading}

      <div
        className="text-content-secondary hidden min-w-0 shrink-0 cursor-default select-none items-center gap-2 px-2 text-sm font-medium md:flex"
        title={workspaceName}
      >
        <span className="bg-action-accent text-action-accent-content flex size-4 items-center justify-center rounded-[4px] text-[9.5px] font-bold">
          {workspaceName[0]?.toUpperCase() ?? 'A'}
        </span>
        <span className="max-w-32 truncate">{workspaceName}</span>
      </div>

      <ProjectTopbarBreadcrumbTrail labels={labels.breadcrumb} />

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {status}

        <div className="hidden lg:block">
          <LocaleSwitcher />
        </div>

        <div className="hidden lg:block">
          <UserMenu
            userEmail={userEmail}
            ariaLabel={labels.userMenuLabel}
            accountLabel={labels.account}
            settingsLabel={labels.settings}
          />
        </div>

        <div className="lg:hidden">
          <MobileAppMenu
            userEmail={userEmail}
            ariaLabel={navigationLabel}
            accountLabel={labels.account}
            settingsLabel={labels.settings}
            navigationLabel={navigationLabel}
            navigationItems={navigationItems}
          />
        </div>
      </div>
    </header>
  );
}
