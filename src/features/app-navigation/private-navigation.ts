export const privateNavigationItems = [
  {
    key: 'dashboard',
    href: '/app',
  },
  {
    key: 'designSystems',
    href: '/app/design-systems',
  },
  {
    key: 'settings',
    href: '/app/settings',
  },
] as const;

export type PrivateNavigationItem = (typeof privateNavigationItems)[number];

export type PrivateNavigationItemKey = PrivateNavigationItem['key'];
