export const projectEditorNavItems = [
  {
    key: 'overview',
    path: '',
    isEnabled: true,
  },
  {
    key: 'brand',
    path: 'brand',
    isEnabled: false,
  },
  {
    key: 'tokens',
    path: 'tokens?set=color',
    isEnabled: true,
    badgeKey: 'tokens',
  },
  {
    key: 'themes',
    path: 'themes',
    isEnabled: true,
  },
  {
    key: 'components',
    path: 'components',
    isEnabled: true,
    badgeKey: 'components',
  },
  {
    key: 'accessibility',
    path: 'accessibility',
    isEnabled: true,
    severity: 'warning',
  },
  {
    key: 'documentation',
    path: 'documentation',
    isEnabled: true,
  },
  {
    key: 'exports',
    path: 'exports',
    isEnabled: true,
  },
  {
    key: 'aiInstructions',
    path: 'ai-instructions',
    isEnabled: true,
  },
] as const;
