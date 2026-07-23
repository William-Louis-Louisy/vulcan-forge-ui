import Logo from './Logo';
import { UserMenu } from './UserMenu';
import type { ReactNode } from 'react';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import {
  ProjectTopbarBreadcrumbTrail,
  ProjectTopbarExportAction,
} from './ProjectTopbarBreadcrumb';
import type { ProjectTopbarBreadcrumbLabels } from './ProjectTopbarBreadcrumb';

export type AppTopbarLabels = {
  export: string;
  account: string;
  settings: string;
  userMenuLabel: string;
  breadcrumb: ProjectTopbarBreadcrumbLabels;
};

type AppTopbarProps = {
  userEmail: string;
  labels: AppTopbarLabels;
  workspaceName?: string;
  leading?: ReactNode;
};

export function AppTopbar({
  userEmail,
  labels,
  workspaceName = 'Atelier Lyon',
  leading,
}: AppTopbarProps) {
  return (
    <header className="border-border-subtle bg-background-sunken flex h-12 min-w-0 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
      <Logo />
      {leading}

      <div
        className="text-content-secondary hidden min-w-0 shrink-0 items-center gap-2 px-2 text-sm font-medium md:flex"
        title={workspaceName}
      >
        <span className="bg-action-accent text-action-accent-content flex size-4 items-center justify-center rounded-[4px] text-[9.5px] font-bold">
          {workspaceName[0]?.toUpperCase() ?? 'A'}
        </span>
        <span className="max-w-32 truncate">{workspaceName}</span>
      </div>

      <ProjectTopbarBreadcrumbTrail labels={labels.breadcrumb} />

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <ProjectTopbarExportAction label={labels.export} />

        <div className="hidden sm:block">
          <LocaleSwitcher />
        </div>

        <UserMenu
          userEmail={userEmail}
          ariaLabel={labels.userMenuLabel}
          accountLabel={labels.account}
          settingsLabel={labels.settings}
        />
      </div>
    </header>
  );
}
