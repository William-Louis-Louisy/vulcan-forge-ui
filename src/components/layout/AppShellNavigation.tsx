'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import {
  privateNavigationItems,
  type PrivateNavigationItemKey,
} from '@/features/app-navigation/private-navigation';
import { projectEditorNavItems } from '@/features/design-systems/project-editor/project-editor-nav.config';

type AppShellNavigationLabels = Record<PrivateNavigationItemKey, string>;

type AppShellNavigationProps = {
  navigationLabel: string;
  labels: AppShellNavigationLabels;
};

type ProjectEditorNavItem = (typeof projectEditorNavItems)[number];
type ProjectEditorNavItemKey = ProjectEditorNavItem['key'];

function isActivePath(currentPathname: string, itemHref: string) {
  if (itemHref === '/app') {
    return currentPathname === '/app';
  }

  return (
    currentPathname === itemHref || currentPathname.startsWith(`${itemHref}/`)
  );
}

function getCurrentProjectSlug(pathname: string): string | null {
  const prefix = '/app/design-systems/';

  if (!pathname.startsWith(prefix)) {
    return null;
  }

  const [projectSlug] = pathname.slice(prefix.length).split('/');

  if (!projectSlug || projectSlug === 'new') {
    return null;
  }

  return projectSlug;
}

function createProjectEditorNavHref({
  projectSlug,
  path,
}: {
  projectSlug: string;
  path: string;
}) {
  const baseHref = `/app/design-systems/${projectSlug}`;

  return path ? `${baseHref}/${path}` : baseHref;
}

function isProjectEditorNavItemActive({
  pathname,
  projectSlug,
  path,
}: {
  pathname: string;
  projectSlug: string;
  path: string;
}) {
  const basePath = `/app/design-systems/${projectSlug}`;
  const pathWithoutQuery = path.split('?')[0] ?? '';

  if (!pathWithoutQuery) {
    return pathname === basePath;
  }

  return pathname === `${basePath}/${pathWithoutQuery}`;
}

export function AppShellNavigation({
  navigationLabel,
  labels,
}: AppShellNavigationProps) {
  const pathname = usePathname();
  const projectSlug = getCurrentProjectSlug(pathname);
  const projectT = useTranslations('ProjectEditorNav');

  const projectLabels: Record<ProjectEditorNavItemKey, string> = {
    overview: projectT('overview'),
    brand: projectT('brand'),
    tokens: projectT('tokens'),
    themes: projectT('themes'),
    components: projectT('components'),
    accessibility: projectT('accessibility'),
    documentation: projectT('documentation'),
    exports: projectT('exports'),
    aiInstructions: projectT('aiInstructions'),
  };

  return (
    <nav aria-label={navigationLabel} className="space-y-1">
      {privateNavigationItems.map((item) => {
        const isActive = isActivePath(pathname, item.href);
        const shouldRenderProjectNav =
          item.key === 'designSystems' && projectSlug !== null;

        return (
          <div key={item.key}>
            <Link
              href={item.href}
              aria-current={
                isActive && !shouldRenderProjectNav ? 'page' : undefined
              }
              className={[
                'flex rounded-lg px-3 py-2 text-sm font-semibold transition',
                isActive
                  ? 'bg-surface-primary text-content-primary shadow-soft'
                  : 'text-content-secondary hover:bg-surface-primary hover:text-content-primary',
              ].join(' ')}
            >
              {labels[item.key]}
            </Link>

            {shouldRenderProjectNav ? (
              <ul className="border-border-subtle mt-2 ml-3 grid gap-1 border-l pl-3">
                {projectEditorNavItems.map((projectItem) => {
                  const href = createProjectEditorNavHref({
                    projectSlug,
                    path: projectItem.path,
                  });

                  const isProjectItemActive = isProjectEditorNavItemActive({
                    pathname,
                    projectSlug,
                    path: projectItem.path,
                  });

                  if (!projectItem.isEnabled) {
                    return (
                      <li key={projectItem.key}>
                        <span
                          aria-disabled="true"
                          className="text-content-tertiary flex cursor-not-allowed items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs font-semibold opacity-70"
                        >
                          <span>{projectLabels[projectItem.key]}</span>

                          <span className="border-border-subtle rounded-full border px-2 py-0.5 text-[10px] font-semibold">
                            {projectT('soon')}
                          </span>
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li key={projectItem.key}>
                      <Link
                        href={href}
                        aria-current={isProjectItemActive ? 'page' : undefined}
                        className={[
                          'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition',
                          isProjectItemActive
                            ? 'bg-action-primary text-action-primary-content'
                            : 'text-content-secondary hover:bg-surface-primary hover:text-content-primary',
                        ].join(' ')}
                      >
                        <span className="flex items-center gap-2">
                          {projectLabels[projectItem.key]}

                          {'severity' in projectItem &&
                          projectItem.severity === 'warning' ? (
                            <span
                              aria-label={projectT('warning')}
                              className={[
                                'inline-flex size-4 items-center justify-center rounded-full text-[10px] font-bold',
                                isProjectItemActive
                                  ? 'bg-action-primary-content/20 text-action-primary-content'
                                  : 'bg-action-warning/10 text-action-warning',
                              ].join(' ')}
                            >
                              !
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
