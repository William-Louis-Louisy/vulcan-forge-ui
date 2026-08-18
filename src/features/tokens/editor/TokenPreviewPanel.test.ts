import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  createTokenDictionary,
  type DesignToken,
} from '@/domain/design-system';
import { createTokenRows } from '../tokens-editor.utils';
import {
  getTypographyPreviewStyle,
  TokenPreviewPanel,
} from './TokenPreviewPanel';

describe('getTypographyPreviewStyle', () => {
  it('maps bundled font families to the loaded next/font variables', () => {
    expect(
      getTypographyPreviewStyle({
        fontFamily: 'Inter Tight, system-ui, sans-serif',
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: '1.5',
        letterSpacing: '0em',
      }),
    ).toEqual({
      fontFamily: 'var(--font-inter-tight), system-ui, sans-serif',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: '0em',
    });

    expect(
      getTypographyPreviewStyle({ fontFamily: 'Fraunces, serif' }).fontFamily,
    ).toBe('var(--font-fraunces), serif');
    expect(
      getTypographyPreviewStyle({
        fontFamily: 'JetBrains Mono, monospace',
      }).fontFamily,
    ).toBe('var(--font-jetbrains-mono), monospace');
  });

  it('preserves arbitrary font stacks so the browser can use available local fonts and fallbacks', () => {
    expect(
      getTypographyPreviewStyle({
        fontFamily: 'Roboto, Arial, sans-serif',
      }).fontFamily,
    ).toBe('Roboto, Arial, sans-serif');
  });
});

describe('TokenPreviewPanel typography rendering', () => {
  it('renders resolved spacing references as font-size and letter-spacing styles', () => {
    const spacingToken = {
      path: 'spacing.test.reference',
      type: 'spacing',
      value: '1.25rem',
      status: 'ready',
    } satisfies DesignToken;
    const typographyToken = {
      path: 'typography.body.test',
      type: 'typography',
      value: {
        fontFamily: 'Inter Tight, system-ui, sans-serif',
        fontSize: '{spacing.test.reference}',
        fontWeight: 400,
        lineHeight: '1.5',
        letterSpacing: '{spacing.test.reference}',
      },
      status: 'ready',
    } satisfies DesignToken;
    const dictionary = createTokenDictionary([spacingToken, typographyToken]);
    const token = createTokenRows([typographyToken], dictionary).rows[0];

    expect(token?.resolvedValue).toMatchObject({
      fontSize: '1.25rem',
      letterSpacing: '1.25rem',
    });

    if (!token) {
      throw new Error('Expected the typography token row to be created.');
    }

    const markup = renderToStaticMarkup(
      createElement(TokenPreviewPanel, {
        token,
        tokenSetType: 'typography',
        tokenSetLabel: 'Typography',
        primitiveColorAliasOptions: [],
        labels: {
          title: 'Preview',
          empty: 'Empty',
          sample: 'Sample',
          value: 'Value',
          reference: 'Reference',
          resolvedValue: 'Resolved value',
          unresolved: 'Unresolved',
        },
      }),
    );

    expect(markup).toContain('font-size:1.25rem');
    expect(markup).toContain('letter-spacing:1.25rem');
  });
});
