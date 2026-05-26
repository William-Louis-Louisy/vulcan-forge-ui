import { describe, expect, it } from 'vitest';
import {
  isHexColor,
  parseHexColor,
  evaluateContrast,
  getContrastStatus,
  getRelativeLuminance,
  calculateContrastRatio,
  compositeColorOverBackground,
} from './contrast';

describe('hex color parsing', () => {
  it('accepts valid hex colors', () => {
    expect(isHexColor('#fff')).toBe(true);
    expect(isHexColor('#ffff')).toBe(true);
    expect(isHexColor('#ffffff')).toBe(true);
    expect(isHexColor('#ffffffff')).toBe(true);
  });

  it('rejects invalid hex colors', () => {
    expect(isHexColor('white')).toBe(false);
    expect(isHexColor('#ff')).toBe(false);
    expect(isHexColor('#fffff')).toBe(false);
    expect(isHexColor('#gggggg')).toBe(false);
  });

  it('parses short hex colors', () => {
    expect(parseHexColor('#fff')).toEqual({
      red: 255,
      green: 255,
      blue: 255,
      alpha: 1,
    });
  });

  it('parses long hex colors with alpha', () => {
    expect(parseHexColor('#00000080')).toMatchObject({
      red: 0,
      green: 0,
      blue: 0,
    });

    expect(parseHexColor('#00000080')?.alpha).toBeCloseTo(0.502, 3);
  });
});

describe('relative luminance', () => {
  it('returns 0 for black', () => {
    expect(
      getRelativeLuminance({
        red: 0,
        green: 0,
        blue: 0,
        alpha: 1,
      }),
    ).toBe(0);
  });

  it('returns 1 for white', () => {
    expect(
      getRelativeLuminance({
        red: 255,
        green: 255,
        blue: 255,
        alpha: 1,
      }),
    ).toBe(1);
  });
});

describe('contrast ratio calculation', () => {
  it('returns 21 for black on white', () => {
    expect(
      calculateContrastRatio({
        foreground: '#000000',
        background: '#ffffff',
      }),
    ).toBe(21);
  });

  it('returns the same ratio regardless of foreground/background order', () => {
    expect(
      calculateContrastRatio({
        foreground: '#ffffff',
        background: '#000000',
      }),
    ).toBe(21);
  });

  it('returns null for invalid colors', () => {
    expect(
      calculateContrastRatio({
        foreground: 'black',
        background: '#ffffff',
      }),
    ).toBeNull();
  });

  it('composites transparent foreground colors over the background', () => {
    expect(
      compositeColorOverBackground({
        foreground: {
          red: 0,
          green: 0,
          blue: 0,
          alpha: 0.5,
        },
        background: {
          red: 255,
          green: 255,
          blue: 255,
          alpha: 1,
        },
      }),
    ).toEqual({
      red: 128,
      green: 128,
      blue: 128,
      alpha: 1,
    });
  });
});

describe('contrast evaluation', () => {
  it('passes AA contrast for normal text', () => {
    expect(
      evaluateContrast({
        foreground: '#111827',
        background: '#ffffff',
        textSize: 'normal',
      }),
    ).toMatchObject({
      status: 'pass',
      requiredRatio: 4.5,
      isValid: true,
      error: null,
    });
  });

  it('passes AA contrast for large text at 3:1', () => {
    expect(
      evaluateContrast({
        foreground: '#888888',
        background: '#ffffff',
        textSize: 'large',
      }),
    ).toMatchObject({
      status: 'pass',
      requiredRatio: 3,
      isValid: true,
      error: null,
    });
  });

  it('returns warning when normal text misses AA but is not a hard fail', () => {
    const result = evaluateContrast({
      foreground: '#888888',
      background: '#ffffff',
      textSize: 'normal',
    });

    expect(result.status).toBe('warning');
    expect(result.ratio).toBeGreaterThanOrEqual(3);
    expect(result.ratio).toBeLessThan(4.5);
  });

  it('fails when contrast is too low', () => {
    expect(
      evaluateContrast({
        foreground: '#cccccc',
        background: '#ffffff',
        textSize: 'normal',
      }),
    ).toMatchObject({
      status: 'fail',
      isValid: true,
      error: null,
    });
  });

  it('returns a validation error for invalid foreground color', () => {
    expect(
      evaluateContrast({
        foreground: 'red',
        background: '#ffffff',
      }),
    ).toMatchObject({
      ratio: null,
      status: 'fail',
      isValid: false,
      error: 'invalidForegroundColor',
    });
  });

  it('returns a validation error for invalid background color', () => {
    expect(
      evaluateContrast({
        foreground: '#ffffff',
        background: 'black',
      }),
    ).toMatchObject({
      ratio: null,
      status: 'fail',
      isValid: false,
      error: 'invalidBackgroundColor',
    });
  });

  it('returns contrast status from an already computed ratio', () => {
    expect(
      getContrastStatus({
        ratio: 4.5,
        textSize: 'normal',
      }),
    ).toBe('pass');

    expect(
      getContrastStatus({
        ratio: 3.2,
        textSize: 'normal',
      }),
    ).toBe('warning');

    expect(
      getContrastStatus({
        ratio: 2.9,
        textSize: 'normal',
      }),
    ).toBe('fail');
  });
});
