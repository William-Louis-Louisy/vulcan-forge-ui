import {
  generateTailwindV4Export,
  tokenPathToTailwindThemeName,
} from './tailwind-v4-export';
import { describe, expect, it } from 'vitest';
import type { DesignToken } from '@/domain/design-system';

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

describe('tokenPathToTailwindThemeName', () => {
  it('converts token paths to Tailwind v4 theme custom property names', () => {
    expect(tokenPathToTailwindThemeName('color.semantic.action.primary')).toBe(
      '--color-semantic-action-primary',
    );

    expect(tokenPathToTailwindThemeName('typography.fontWeight.semibold')).toBe(
      '--typography-font-weight-semibold',
    );
  });
});

describe('generateTailwindV4Export', () => {
  it('generates a Tailwind v4 CSS theme file', () => {
    const result = generateTailwindV4Export({
      projectName: 'Aurora System',
      tokens,
    });

    expect(result.fileName).toBe('aurora-system-tailwind.css');

    expect(result.content).toContain('/* Aurora System — Tailwind v4 theme */');
    expect(result.content).toContain('/* Aurora System — CSS variables */');
    expect(result.content).toContain(':root {');
    expect(result.content).toContain('@theme {');

    expect(result.content).toContain(
      '--color-semantic-action-primary: #ff8731;',
    );

    expect(result.content).toContain(
      '--color-semantic-action-primary: var(--color-semantic-action-primary);',
    );

    expect(result.content).toContain('--spacing-4: var(--spacing-4);');
    expect(result.content).toContain('--radius-xl: var(--radius-xl);');

    expect(result.skippedTokens).toEqual([]);
  });

  it('forwards skipped unresolved tokens from the CSS variables export', () => {
    const result = generateTailwindV4Export({
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

    expect(result.content).not.toContain('--color-semantic-missing');

    expect(result.skippedTokens).toContainEqual({
      path: 'color.semantic.missing',
      reason: 'resolutionError',
    });
  });

  it('excludes deprecated tokens by default', () => {
    const result = generateTailwindV4Export({
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

    expect(result.content).not.toContain('--color-primitive-legacy');

    expect(result.skippedTokens).toContainEqual({
      path: 'color.primitive.legacy',
      reason: 'deprecated',
    });
  });

  it('includes dark theme variables when themes are provided', () => {
    const result = generateTailwindV4Export({
      projectName: 'Aurora System',
      tokens,
      themes: [
        {
          mode: 'light',
          name: 'Light',
          tokens: {
            color: {
              background: '#ffffff',
            },
          },
        },
        {
          mode: 'dark',
          name: 'Dark',
          tokens: {
            color: {
              background: '#070707',
            },
          },
        },
      ],
    });

    expect(result.content).toContain('[data-theme="dark"] {');
    expect(result.content).toContain('--color-background: #070707;');
  });
});
