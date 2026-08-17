import { describe, expect, it } from 'vitest';
import {
  createTypographyPreviewModel,
  getTypographyPreviewStyle,
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

  it('does not pass unresolved token references to CSS properties', () => {
    expect(
      getTypographyPreviewStyle({
        fontSize: '{spacing.test.reference}',
        letterSpacing: '{spacing.test.reference}',
      }),
    ).toMatchObject({
      fontSize: undefined,
      letterSpacing: undefined,
    });
  });
});

describe('createTypographyPreviewModel', () => {
  it('uses resolved spacing references for font size and letter spacing', () => {
    const model = createTypographyPreviewModel({
      rawValue: {
        fontFamily: 'Inter Tight, system-ui, sans-serif',
        fontSize: '{spacing.test.reference}',
        fontWeight: 400,
        lineHeight: '1.5',
        letterSpacing: '{spacing.test.reference}',
      },
      resolvedValue: {
        fontFamily: 'Inter Tight, system-ui, sans-serif',
        fontSize: '1.25rem',
        fontWeight: 400,
        lineHeight: '1.5',
        letterSpacing: '0.125rem',
      },
    });

    expect(model.style).toMatchObject({
      fontSize: '1.25rem',
      letterSpacing: '0.125rem',
    });
    expect(model.fields).toEqual(
      expect.arrayContaining([
        {
          key: 'fontSize',
          rawValue: '{spacing.test.reference}',
          resolvedValue: '1.25rem',
          isReference: true,
          isResolved: true,
        },
        {
          key: 'letterSpacing',
          rawValue: '{spacing.test.reference}',
          resolvedValue: '0.125rem',
          isReference: true,
          isResolved: true,
        },
      ]),
    );
  });

  it('keeps unresolved references visible without applying them as CSS', () => {
    const model = createTypographyPreviewModel({
      rawValue: {
        fontSize: '{spacing.missing}',
      },
      resolvedValue: {
        fontSize: '{spacing.missing}',
      },
    });

    expect(model.style.fontSize).toBeUndefined();
    expect(model.fields).toContainEqual({
      key: 'fontSize',
      rawValue: '{spacing.missing}',
      resolvedValue: '{spacing.missing}',
      isReference: true,
      isResolved: false,
    });
  });
});
