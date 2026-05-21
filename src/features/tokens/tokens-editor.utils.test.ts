import { describe, expect, it } from 'vitest';
import {
  formatTokenValue,
  getActiveTokenSetType,
  isHexColorValue,
  parseTokenSetTokens,
  sortTokenSetsByType,
} from './tokens-editor.utils';

describe('tokens editor utils', () => {
  it('returns color as the default active token set type', () => {
    expect(getActiveTokenSetType(undefined)).toBe('color');
    expect(getActiveTokenSetType('unknown')).toBe('color');
  });

  it('returns a valid active token set type', () => {
    expect(getActiveTokenSetType('spacing')).toBe('spacing');
  });

  it('sorts token sets using the MVP token set order', () => {
    expect(
      sortTokenSetsByType([
        { type: 'motion' },
        { type: 'color' },
        { type: 'typography' },
        { type: 'spacing' },
        { type: 'radius' },
      ]),
    ).toEqual([
      { type: 'color' },
      { type: 'spacing' },
      { type: 'radius' },
      { type: 'typography' },
      { type: 'motion' },
    ]);
  });

  it('parses valid design tokens', () => {
    expect(
      parseTokenSetTokens([
        {
          path: 'color.action.primary',
          type: 'color',
          value: '#ff8731',
          status: 'ready',
        },
      ]),
    ).toMatchObject({
      isValid: true,
      tokens: [
        {
          path: 'color.action.primary',
          type: 'color',
          value: '#ff8731',
        },
      ],
    });
  });

  it('returns invalid result for malformed token JSON', () => {
    expect(parseTokenSetTokens({ invalid: true })).toEqual({
      isValid: false,
      tokens: [],
    });
  });

  it('formats token values', () => {
    expect(formatTokenValue(600)).toBe('600');
    expect(formatTokenValue('#ffffff')).toBe('#ffffff');
  });

  it('detects hex color values', () => {
    expect(isHexColorValue('#ffffff')).toBe(true);
    expect(isHexColorValue('1rem')).toBe(false);
  });
});
