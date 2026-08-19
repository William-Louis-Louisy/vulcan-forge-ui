import { describe, expect, it } from 'vitest';
import {
  createThemeColorRole,
  themeRoleKeySchema,
  updateThemeColorRoleReference,
} from './theme-role-authoring';

describe('theme role authoring', () => {
  it('creates a color role without mutating existing theme tokens', () => {
    const tokens = {
      color: {
        background: '{color.semantic.background}',
      },
      radius: {
        card: '{radius.md}',
      },
    };

    const result = createThemeColorRole({
      tokens,
      roleKey: 'border-subtle',
      tokenPath: 'color.semantic.border.subtle',
    });

    expect(result).toEqual({
      status: 'success',
      roleKey: 'border-subtle',
      tokenReference: '{color.semantic.border.subtle}',
      tokens: {
        color: {
          background: '{color.semantic.background}',
          'border-subtle': '{color.semantic.border.subtle}',
        },
        radius: {
          card: '{radius.md}',
        },
      },
    });
    expect(tokens).toEqual({
      color: {
        background: '{color.semantic.background}',
      },
      radius: {
        card: '{radius.md}',
      },
    });
  });

  it('allows a known semantic role to be authored when a legacy theme does not have it yet', () => {
    expect(
      createThemeColorRole({
        tokens: {
          color: {
            background: '#ffffff',
          },
        },
        roleKey: 'info',
        tokenPath: 'color.semantic.status.info.light',
      }),
    ).toMatchObject({
      status: 'success',
      roleKey: 'info',
      tokenReference: '{color.semantic.status.info.light}',
    });
  });

  it('rejects a role key that already exists in the selected theme', () => {
    expect(
      createThemeColorRole({
        tokens: {
          color: {
            accent: '{color.semantic.accent}',
          },
        },
        roleKey: 'accent',
        tokenPath: 'color.semantic.secondary',
      }),
    ).toEqual({
      status: 'error',
      error: 'roleAlreadyExists',
    });
  });

  it('updates an existing custom role without mutating unrelated theme tokens', () => {
    const tokens = {
      color: {
        background: '{color.semantic.background}',
        'border-subtle': '{color.semantic.border.default}',
      },
      radius: {
        card: '{radius.md}',
      },
    };

    expect(
      updateThemeColorRoleReference({
        tokens,
        roleKey: 'border-subtle',
        tokenPath: 'color.semantic.border.subtle',
      }),
    ).toEqual({
      status: 'success',
      roleKey: 'border-subtle',
      tokenReference: '{color.semantic.border.subtle}',
      tokens: {
        color: {
          background: '{color.semantic.background}',
          'border-subtle': '{color.semantic.border.subtle}',
        },
        radius: {
          card: '{radius.md}',
        },
      },
    });
    expect(tokens.color['border-subtle']).toBe(
      '{color.semantic.border.default}',
    );
  });

  it('rejects updates for roles that are not authored on the selected theme', () => {
    expect(
      updateThemeColorRoleReference({
        tokens: {
          color: {
            background: '{color.semantic.background}',
          },
        },
        roleKey: 'border-subtle',
        tokenPath: 'color.semantic.border.subtle',
      }),
    ).toEqual({
      status: 'error',
      error: 'roleNotFound',
    });
  });

  it('accepts only stable lowercase role keys', () => {
    expect(themeRoleKeySchema.safeParse('border-subtle').success).toBe(true);
    expect(themeRoleKeySchema.safeParse('surface2').success).toBe(true);
    expect(themeRoleKeySchema.safeParse(' Border ').success).toBe(false);
    expect(themeRoleKeySchema.safeParse('border_subtle').success).toBe(false);
    expect(themeRoleKeySchema.safeParse('border-').success).toBe(false);
  });

  it('rejects malformed theme color containers and invalid token paths', () => {
    expect(
      createThemeColorRole({
        tokens: {
          color: 'not-an-object',
        },
        roleKey: 'border',
        tokenPath: 'color.semantic.border',
      }),
    ).toEqual({
      status: 'error',
      error: 'themeTokensMalformed',
    });

    expect(
      createThemeColorRole({
        tokens: {
          color: {},
        },
        roleKey: 'border',
        tokenPath: 'color semantic border',
      }),
    ).toEqual({
      status: 'error',
      error: 'invalidTokenPath',
    });
  });
});
