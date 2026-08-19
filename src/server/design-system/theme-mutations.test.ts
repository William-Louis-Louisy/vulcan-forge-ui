import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  findTheme: vi.fn(),
  updateTheme: vi.fn(),
}));

vi.mock('@/server/db/prisma', () => ({
  prisma: {
    theme: {
      findFirst: mocks.findTheme,
      update: mocks.updateTheme,
    },
  },
}));

import {
  createThemeColorRoleForUser,
  updateThemeColorRoleReferenceForUser,
} from './theme-mutations';

const colorTokens = [
  {
    path: 'color.semantic.border.default',
    type: 'color',
    value: '#94A3B8',
    status: 'ready',
  },
  {
    path: 'color.semantic.border.subtle',
    type: 'color',
    value: '#64748B',
    status: 'ready',
  },
];

function createStoredTheme(
  tokens: unknown = { color: { background: '#ffffff' } },
) {
  return {
    id: 'theme-light',
    tokens,
    project: {
      tokenSets: [
        {
          tokens: colorTokens,
        },
      ],
    },
  };
}

describe('theme mutation storage boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.updateTheme.mockResolvedValue({ id: 'theme-light' });
  });

  it('scopes the editable theme to a project workspace member', async () => {
    mocks.findTheme.mockResolvedValue(createStoredTheme());

    await createThemeColorRoleForUser({
      userId: 'user-1',
      projectSlug: 'project-one',
      themeId: 'theme-light',
      roleKey: 'border-subtle',
      tokenPath: 'color.semantic.border.subtle',
    });

    expect(mocks.findTheme).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'theme-light',
          project: {
            slug: 'project-one',
            workspace: {
              members: {
                some: {
                  userId: 'user-1',
                },
              },
            },
          },
        },
      }),
    );
  });

  it('rejects missing themes and token paths that are not valid resolved color options', async () => {
    mocks.findTheme.mockResolvedValueOnce(null);

    await expect(
      createThemeColorRoleForUser({
        userId: 'user-1',
        projectSlug: 'project-one',
        themeId: 'missing-theme',
        roleKey: 'border-subtle',
        tokenPath: 'color.semantic.border.subtle',
      }),
    ).resolves.toEqual({
      status: 'error',
      error: 'themeNotFound',
    });

    mocks.findTheme.mockResolvedValueOnce(createStoredTheme());

    await expect(
      createThemeColorRoleForUser({
        userId: 'user-1',
        projectSlug: 'project-one',
        themeId: 'theme-light',
        roleKey: 'border-subtle',
        tokenPath: 'color.semantic.missing',
      }),
    ).resolves.toEqual({
      status: 'error',
      error: 'invalidTokenReference',
    });
    expect(mocks.updateTheme).not.toHaveBeenCalled();
  });

  it('preserves domain errors such as duplicate role keys', async () => {
    mocks.findTheme.mockResolvedValue(
      createStoredTheme({
        color: {
          background: '#ffffff',
          'border-subtle': '{color.semantic.border.subtle}',
        },
      }),
    );

    await expect(
      createThemeColorRoleForUser({
        userId: 'user-1',
        projectSlug: 'project-one',
        themeId: 'theme-light',
        roleKey: 'border-subtle',
        tokenPath: 'color.semantic.border.subtle',
      }),
    ).resolves.toEqual({
      status: 'error',
      error: 'roleAlreadyExists',
    });
    expect(mocks.updateTheme).not.toHaveBeenCalled();
  });

  it('persists only the selected theme with the new token reference', async () => {
    mocks.findTheme.mockResolvedValue(createStoredTheme());

    await expect(
      createThemeColorRoleForUser({
        userId: 'user-1',
        projectSlug: 'project-one',
        themeId: 'theme-light',
        roleKey: 'border-subtle',
        tokenPath: 'color.semantic.border.subtle',
      }),
    ).resolves.toEqual({
      status: 'success',
      roleKey: 'border-subtle',
      tokenReference: '{color.semantic.border.subtle}',
    });

    expect(mocks.updateTheme).toHaveBeenCalledWith({
      where: {
        id: 'theme-light',
      },
      data: {
        tokens: {
          color: {
            background: '#ffffff',
            'border-subtle': '{color.semantic.border.subtle}',
          },
        },
      },
      select: {
        id: true,
      },
    });
  });

  it('updates an existing custom role through the same authorized boundary', async () => {
    mocks.findTheme.mockResolvedValue(
      createStoredTheme({
        color: {
          background: '#ffffff',
          'border-subtle': '{color.semantic.border.default}',
        },
      }),
    );

    await expect(
      updateThemeColorRoleReferenceForUser({
        userId: 'user-1',
        projectSlug: 'project-one',
        themeId: 'theme-light',
        roleKey: 'border-subtle',
        tokenPath: 'color.semantic.border.subtle',
      }),
    ).resolves.toEqual({
      status: 'success',
      roleKey: 'border-subtle',
      tokenReference: '{color.semantic.border.subtle}',
    });

    expect(mocks.updateTheme).toHaveBeenCalledWith({
      where: {
        id: 'theme-light',
      },
      data: {
        tokens: {
          color: {
            background: '#ffffff',
            'border-subtle': '{color.semantic.border.subtle}',
          },
        },
      },
      select: {
        id: true,
      },
    });
  });

  it('does not create missing roles through the update mutation', async () => {
    mocks.findTheme.mockResolvedValue(createStoredTheme());

    await expect(
      updateThemeColorRoleReferenceForUser({
        userId: 'user-1',
        projectSlug: 'project-one',
        themeId: 'theme-light',
        roleKey: 'border-subtle',
        tokenPath: 'color.semantic.border.subtle',
      }),
    ).resolves.toEqual({
      status: 'error',
      error: 'roleNotFound',
    });
    expect(mocks.updateTheme).not.toHaveBeenCalled();
  });

  it('reports persistence failures without leaking them across the feature boundary', async () => {
    mocks.findTheme.mockResolvedValue(createStoredTheme());
    mocks.updateTheme.mockRejectedValue(new Error('database unavailable'));

    await expect(
      createThemeColorRoleForUser({
        userId: 'user-1',
        projectSlug: 'project-one',
        themeId: 'theme-light',
        roleKey: 'border-subtle',
        tokenPath: 'color.semantic.border.subtle',
      }),
    ).resolves.toEqual({
      status: 'error',
      error: 'unexpected',
    });
  });
});
