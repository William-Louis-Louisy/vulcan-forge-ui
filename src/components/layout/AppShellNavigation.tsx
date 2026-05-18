'use client';

import { Link, usePathname } from '@/i18n/navigation';
import {
  privateNavigationItems,
  type PrivateNavigationItemKey,
} from '@/features/app-navigation/private-navigation';

type AppShellNavigationLabels = Record<PrivateNavigationItemKey, string>;

type AppShellNavigationProps = {
  navigationLabel: string;
  labels: AppShellNavigationLabels;
};

function isActivePath(currentPathname: string, itemHref: string) {
  if (itemHref === '/app') {
    return currentPathname === '/app';
  }

  return (
    currentPathname === itemHref || currentPathname.startsWith(`${itemHref}/`)
  );
}

export function AppShellNavigation({
  navigationLabel,
  labels,
}: AppShellNavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={navigationLabel} className="space-y-1">
      {privateNavigationItems.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'flex rounded-lg px-3 py-2 text-sm font-semibold transition',
              isActive
                ? 'bg-surface-primary text-content-primary shadow-soft'
                : 'text-content-secondary hover:bg-surface-primary hover:text-content-primary',
            ].join(' ')}
          >
            {labels[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}
