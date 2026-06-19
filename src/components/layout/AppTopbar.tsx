import type { ReactNode } from 'react';

import { UserMenu } from './UserMenu';
import { Button } from '@/components/ui';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';

export type AppTopbarLabels = {
  export: string;
  account: string;
  workspaceLabel: string;
  userMenuLabel: string;
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
    <header className="border-border-subtle bg-surface-primary flex h-12 shrink-0 items-center gap-2 border-b px-4">
      {leading}

      <button
        type="button"
        className="hover:bg-background-subtle inline-flex min-h-8 items-center gap-2 rounded-md px-2 text-sm font-medium transition"
        aria-label={labels.workspaceLabel}
      >
        <span className="bg-action-accent text-action-accent-content flex size-4 items-center justify-center rounded-[4px] text-[9.5px] font-bold">
          {workspaceName[0]?.toUpperCase() ?? 'A'}
        </span>
        <span>{workspaceName}</span>
        <span aria-hidden="true" className="text-content-tertiary text-xs">
          ▾
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="secondary" size="sm">
          {labels.export}
        </Button>

        <LocaleSwitcher />

        <UserMenu
          userEmail={userEmail}
          ariaLabel={labels.userMenuLabel}
          accountLabel={labels.account}
        />
      </div>
    </header>
  );
}
