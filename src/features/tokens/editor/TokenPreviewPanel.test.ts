import { describe, expect, it } from 'vitest';
import { getTypographyPreviewStyle } from './TokenPreviewPanel';

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
