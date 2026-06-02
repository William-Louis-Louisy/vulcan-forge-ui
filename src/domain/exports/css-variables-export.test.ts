import {
  generateCssVariablesExport,
  tokenPathToCssVariableName,
} from './css-variables-export';
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
    path: 'typography.fontWeight.semibold',
    type: 'typography',
    value: 600,
    status: 'ready',
  },
];

describe('tokenPathToCssVariableName', () => {
  it('converts token paths to CSS custom property names', () => {
    expect(tokenPathToCssVariableName('color.semantic.action.primary')).toBe(
      '--color-semantic-action-primary',
    );

    expect(tokenPathToCssVariableName('typography.fontWeight.semibold')).toBe(
      '--typography-font-weight-semibold',
    );
  });
});

describe('generateCssVariablesExport', () => {
  it('generates CSS variables from resolved design tokens', () => {
    const result = generateCssVariablesExport({
      projectName: 'Aurora System',
      tokens,
    });

    expect(result.fileName).toBe('aurora-system-tokens.css');

    expect(result.content).toContain('/* Aurora System — CSS variables */');
    expect(result.content).toContain(':root {');
    expect(result.content).toContain(
      '--color-primitive-accent-primary: #ff8731;',
    );
    expect(result.content).toContain(
      '--color-semantic-action-primary: #ff8731;',
    );
    expect(result.content).toContain('--spacing-4: 1rem;');
    expect(result.content).toContain('--typography-font-weight-semibold: 600;');

    expect(result.skippedTokens).toEqual([]);
  });

  it('skips unresolved token references', () => {
    const result = generateCssVariablesExport({
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

  it('skips deprecated tokens by default', () => {
    const result = generateCssVariablesExport({
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

  it('can include deprecated tokens when requested', () => {
    const result = generateCssVariablesExport({
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

    expect(result.content).toContain('--color-primitive-legacy: #000000;');
  });

  it('adds theme variables for light and dark themes', () => {
    const result = generateCssVariablesExport({
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

    expect(result.content).toContain('/* theme · Light */');
    expect(result.content).toContain('--color-background: #ffffff;');

    expect(result.content).toContain('[data-theme="dark"] {');
    expect(result.content).toContain('/* theme · Dark */');
    expect(result.content).toContain('--color-background: #070707;');
  });
});
