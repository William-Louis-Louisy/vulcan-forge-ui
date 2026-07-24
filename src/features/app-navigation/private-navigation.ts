export const privateNavigationItems = [
  {
    key: 'dashboard',
    href: '/app',
  },
] as const;

export type PrivateNavigationItem = (typeof privateNavigationItems)[number];
export type PrivateNavigationItemKey = PrivateNavigationItem['key'];
