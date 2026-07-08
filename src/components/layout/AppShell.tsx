import type { ReactNode } from 'react';

import { AppTopbar } from '@/components/layout/AppTopbar';
import { AppShellNavigation } from '@/components/layout/AppShellNavigation';
import { ProjectTopbarBreadcrumbProvider } from './ProjectTopbarBreadcrumb';
import type { ProjectTopbarBreadcrumbLabels } from './ProjectTopbarBreadcrumb';
import type { ThemePreference } from '@/features/settings/user-settings.schema';
import { SaveContextRestorer } from '@/features/save-context/SaveContextRestorer';
import { ThemePreferenceApplier } from '@/features/settings/ThemePreferenceApplier';
import type { PrivateNavigationItemKey } from '@/features/app-navigation/private-navigation';

type AppShellLabels = {
  navigationLabel: string;
  navigationItems: Record<PrivateNavigationItemKey, string>;
  topbar: {
    export: string;
    workspaceLabel: string;
    userMenuLabel: string;
    account: string;
    breadcrumb: ProjectTopbarBreadcrumbLabels;
  };
  sidebar: {
    workspace: string;
    beta: string;
  };
};

type AppShellProps = {
  children: ReactNode;
  userEmail: string;
  labels: AppShellLabels;
  themePreference: ThemePreference;
  workspaceName?: string;
};

export function AppShell({
  children,
  userEmail,
  labels,
  themePreference,
  workspaceName,
}: AppShellProps) {
  return (
    <ProjectTopbarBreadcrumbProvider>
      <div className="bg-background-app text-content-primary flex h-screen min-h-screen flex-col overflow-hidden">
        <ThemePreferenceApplier themePreference={themePreference} />
        <SaveContextRestorer />

        <AppTopbar
          userEmail={userEmail}
          workspaceName={workspaceName ?? ''}
          labels={labels.topbar}
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <aside className="border-border-subtle bg-background-sunken hidden w-50 shrink-0 border-r lg:block">
            <div className="flex h-full flex-col gap-2 px-2.5 py-4">
              <AppShellNavigation
                navigationLabel={labels.navigationLabel}
                labels={labels.navigationItems}
              />

              <p className="text-content-tertiary mt-auto px-2 text-[11px] font-semibold">
                {labels.sidebar.beta}
              </p>
            </div>
          </aside>

          <div
            data-save-context-scroll-container="app"
            className="relative min-w-0 flex-1 overflow-y-auto"
          >
            <main>{children}</main>
          </div>
        </div>
      </div>
    </ProjectTopbarBreadcrumbProvider>
  );
}
