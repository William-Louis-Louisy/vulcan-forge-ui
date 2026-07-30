import { describe, expect, it } from 'vitest';
import {
  formatHexColor,
  getColorPickerAlphaPercent,
  getColorPickerRgbValue,
  hsbToRgb,
  hslToRgb,
  parseHexColor,
  rgbToHsb,
  rgbToHsl,
  updateHexColorAlpha,
  updateHexColorChannels,
  updateHexColorRgb,
} from './color-picker.utils';

describe('color picker utilities', () => {
  it('parses shorthand, six-digit and alpha hex values', () => {
    expect(parseHexColor('#0f8')).toEqual({
      red: 0,
      green: 255,
      blue: 136,
      alpha: 255,
    });
    expect(parseHexColor('#336699')).toEqual({
      red: 51,
      green: 102,
      blue: 153,
      alpha: 255,
    });
    expect(parseHexColor('#33669980')).toEqual({
      red: 51,
      green: 102,
      blue: 153,
      alpha: 128,
    });
    expect(parseHexColor('not-a-color')).toBeNull();
  });

  it('formats normalized uppercase hex values', () => {
    expect(formatHexColor({ red: 51, green: 102, blue: 153, alpha: 255 })).toBe(
      '#336699',
    );
    expect(formatHexColor({ red: 51, green: 102, blue: 153, alpha: 128 })).toBe(
      '#33669980',
    );
  });

  it('exposes RGB and opacity values for picker controls', () => {
    expect(getColorPickerRgbValue('#369')).toBe('#336699');
    expect(getColorPickerRgbValue('invalid', '#ABCDEF')).toBe('#ABCDEF');
    expect(getColorPickerAlphaPercent('#33669980')).toBe(50);
  });

  it('converts RGB colors to and from HSB', () => {
    const hsb = rgbToHsb({ red: 205, green: 25, blue: 25 });

    expect(hsb).toEqual({
      hue: 0,
      saturation: 88,
      brightness: 80,
    });
    expect(hsbToRgb(hsb)).toEqual({
      red: 204,
      green: 24,
      blue: 24,
      alpha: 255,
    });
  });

  it('converts RGB colors to and from HSL', () => {
    const hsl = rgbToHsl({ red: 51, green: 102, blue: 153 });

    expect(hsl).toEqual({
      hue: 210,
      saturation: 50,
      lightness: 40,
    });
    expect(hslToRgb(hsl)).toEqual({
      red: 51,
      green: 102,
      blue: 153,
      alpha: 255,
    });
  });

  it('preserves opacity when visual color channels change', () => {
    expect(
      updateHexColorRgb({
        currentValue: '#33669980',
        rgbValue: '#FF8731',
      }),
    ).toBe('#FF873180');
    expect(
      updateHexColorChannels({
        currentValue: '#33669980',
        red: 255,
        green: 135,
        blue: 49,
      }),
    ).toBe('#FF873180');
  });

  it('adds or removes the alpha channel from the opacity control', () => {
    expect(
      updateHexColorAlpha({
        currentValue: '#336699',
        alphaPercent: 50,
      }),
    ).toBe('#33669980');
    expect(
      updateHexColorAlpha({
        currentValue: '#33669980',
        alphaPercent: 100,
      }),
    ).toBe('#336699');
  });
});
