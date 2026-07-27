'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { projectEditorNavItems } from './project-editor-nav.config';

type ProjectEditorNavItem = (typeof projectEditorNavItems)[number];
type ProjectEditorNavItemKey = ProjectEditorNavItem['key'];
type ProjectEditorNavBadgeKey = Extract<
  ProjectEditorNavItem,
  { badgeKey: string }
>['badgeKey'];

export type ProjectEditorNavBadges = Partial<
  Record<ProjectEditorNavBadgeKey | ProjectEditorNavItemKey, string | number>
>;

type ProjectEditorNavProps = {
  projectSlug: string;
  badges?: ProjectEditorNavBadges;
  showDisabledItems?: boolean;
};

export function ProjectEditorNav({
  projectSlug,
  badges = {},
  showDisabledItems = true,
}: ProjectEditorNavProps) {
  const t = useTranslations('ProjectEditorNav');
  const pathname = usePathname();

  const labels: Record<ProjectEditorNavItemKey, string> = {
    overview: t('overview'),
    brand: t('brand'),
    tokens: t('tokens'),
    themes: t('themes'),
    components: t('components'),
    accessibility: t('accessibility'),
    documentation: t('documentation'),
    exports: t('exports'),
    aiInstructions: t('aiInstructions'),
  };

  const visibleItems = showDisabledItems
    ? projectEditorNavItems
    : projectEditorNavItems.filter((item) => item.isEnabled);

  return (
    <nav
      aria-label={t('label')}
      className="border-border-subtle bg-surface-primary shadow-soft rounded-xl border p-3"
    >
      <Link
        href="/app"
        className="text-action-primary hover:text-action-primary/80 block px-2.5 py-2 text-sm font-semibold transition"
      >
        {t('backToProjects')}
      </Link>

      <div className="border-border-subtle mt-2 border-t pt-2">
        <ul className="grid gap-1">
          {visibleItems.map((item) => {
            const href = createProjectEditorNavHref({
              projectSlug,
              path: item.path,
            });

            const isActive = isProjectEditorNavItemActive({
              pathname,
              projectSlug,
              path: item.path,
            });

            const badge =
              'badgeKey' in item
                ? (badges[item.badgeKey] ?? badges[item.key])
                : badges[item.key];

            if (!item.isEnabled) {
              return (
                <li key={item.key}>
                  <span
                    aria-disabled="true"
                    className="text-content-tertiary flex cursor-not-allowed items-center justify-between gap-3 rounded-md px-2.5 py-2 text-sm font-semibold opacity-70"
                  >
                    <span>{labels[item.key]}</span>

                    <span className="border-border-subtle rounded-full border px-2 py-0.5 text-[11px] font-semibold">
                      {t('soon')}
                    </span>
                  </span>
                </li>
              );
            }

            return (
              <li key={item.key}>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'flex items-center justify-between gap-3 rounded-md px-2.5 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'bg-action-accent/10 text-action-accent'
                      : 'text-content-secondary hover:bg-background-subtle hover:text-content-primary',
                  ].join(' ')}
                >
                  <span className="flex items-center gap-2">
                    {labels[item.key]}

                    {'severity' in item && item.severity === 'warning' ? (
                      <span
                        aria-label={t('warning')}
                        className={[
                          'inline-flex size-5 items-center justify-center rounded-full text-xs font-bold',
                          isActive
                            ? 'bg-action-accent/15 text-action-accent'
                            : 'bg-action-warning/10 text-action-warning',
                        ].join(' ')}
                      >
                        !
                      </span>
                    ) : null}
                  </span>

                  {badge !== undefined ? (
                    <span
                      className={[
                        'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                        isActive
                          ? 'bg-action-accent/15 text-action-accent'
                          : 'bg-background-subtle text-content-tertiary',
                      ].join(' ')}
                    >
                      {badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function createProjectEditorNavHref({
  projectSlug,
  path,
}: {
  projectSlug: string;
  path: string;
}) {
  const baseHref = `/app/projects/${projectSlug}`;

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
  const basePath = `/app/projects/${projectSlug}`;
  const pathWithoutQuery = path.split('?')[0] ?? '';

  if (!pathWithoutQuery) {
    return pathname === basePath;
  }

  return pathname === `${basePath}/${pathWithoutQuery}`;
}
