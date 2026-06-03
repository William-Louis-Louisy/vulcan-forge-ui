import { describe, expect, it } from 'vitest';
import type { DesignToken } from '@/domain/design-system';
import { generateTypeScriptThemeExport } from './typescript-theme-export';

const tokens: DesignToken[] = [
  {
    path: 'color.primitive.accent.primary',
    type: 'color',
    value: '#ff8731',
    status: 'ready',
  },
  {
    path: 'color.semantic.action.primary',
    type: 'color',
    value: '{color.primitive.accent.primary}',
    reference: '{color.primitive.accent.primary}',
    status: 'ready',
  },
  {
    path: 'spacing.4',
    type: 'spacing',
    value: '1rem',
    status: 'ready',
  },
  {
    path: 'radius.xl',
    type: 'radius',
    value: '1rem',
    status: 'ready',
  },
];

describe('generateTypeScriptThemeExport', () => {
  it('generates a TypeScript theme file from resolved design tokens', () => {
    const result = generateTypeScriptThemeExport({
      projectName: 'Aurora System',
      tokens,
    });

    expect(result.fileName).toBe('aurora-system-theme.ts');

    expect(result.content).toContain('// Aurora System — TypeScript theme');
    expect(result.content).toContain('export const tokens =');
    expect(result.content).toContain('export const themes =');
    expect(result.content).toContain('export const designSystemTheme =');
    expect(result.content).toContain(
      'export type DesignSystemTokens = typeof tokens;',
    );
    expect(result.content).toContain('export default designSystemTheme;');

    expect(result.tokens).toMatchObject({
      color: {
        primitive: {
          accent: {
            primary: '#ff8731',
          },
        },
        semantic: {
          action: {
            primary: '#ff8731',
          },
        },
      },
      spacing: {
        _4: '1rem',
      },
      radius: {
        xl: '1rem',
      },
    });

    expect(result.skippedTokens).toEqual([]);
  });

  it('forwards unresolved token references as skipped tokens', () => {
    const result = generateTypeScriptThemeExport({
      projectName: 'Aurora System',
      tokens: [
        ...tokens,
        {
          path: 'color.semantic.missing',
          type: 'color',
          value: '{color.primitive.missing}',
          reference: '{color.primitive.missing}',
          status: 'ready',
        },
      ],
    });

    expect(result.tokens).not.toMatchObject({
      color: {
        semantic: {
          missing: expect.any(String),
        },
      },
    });

    expect(result.skippedTokens).toContainEqual({
      path: 'color.semantic.missing',
      reason: 'resolutionError',
    });
  });

  it('excludes deprecated tokens by default', () => {
    const result = generateTypeScriptThemeExport({
      projectName: 'Aurora System',
      tokens: [
        ...tokens,
        {
          path: 'color.primitive.legacy',
          type: 'color',
          value: '#000000',
          status: 'deprecated',
        },
      ],
    });

    expect(result.tokens).not.toMatchObject({
      color: {
        primitive: {
          legacy: '#000000',
        },
      },
    });

    expect(result.skippedTokens).toContainEqual({
      path: 'color.primitive.legacy',
      reason: 'deprecated',
    });
  });

  it('can include deprecated tokens when requested', () => {
    const result = generateTypeScriptThemeExport({
      projectName: 'Aurora System',
      includeDeprecated: true,
      tokens: [
        ...tokens,
        {
          path: 'color.primitive.legacy',
          type: 'color',
          value: '#000000',
          status: 'deprecated',
        },
      ],
    });

    expect(result.tokens).toMatchObject({
      color: {
        primitive: {
          legacy: '#000000',
        },
      },
    });
  });

  it('adds light and dark themes', () => {
    const result = generateTypeScriptThemeExport({
      projectName: 'Aurora System',
      tokens,
      themes: [
        {
          mode: 'light',
          name: 'Light',
          tokens: {
            color: {
              background: '#ffffff',
              content: '#111827',
            },
          },
        },
        {
          mode: 'dark',
          name: 'Dark',
          tokens: {
            color: {
              background: '#070707',
              content: '#f9fafb',
            },
          },
        },
      ],
    });

    expect(result.themes).toEqual({
      light: {
        color: {
          background: '#ffffff',
          content: '#111827',
        },
      },
      dark: {
        color: {
          background: '#070707',
          content: '#f9fafb',
        },
      },
    });

    expect(result.content).toContain('"light"');
    expect(result.content).toContain('"dark"');
  });
});
