import { describe, expect, it } from 'vitest';
import { createTokenRows } from './tokens-editor.utils';
import { isEditablePrimitiveColorTokenRow } from './tokens-editor.utils';
import {
  isHexColorValue,
  formatTokenValue,
  parseTokenSetTokens,
  sortTokenSetsByType,
  getActiveTokenSetType,
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

  it('creates valid token rows from token JSON', () => {
    expect(
      createTokenRows([
        {
          path: 'color.action.primary',
          type: 'color',
          value: '#ff8731',
          description: {
            en: 'Primary action color',
            fr: 'Couleur d’action principale',
          },
          status: 'ready',
        },
      ]),
    ).toMatchObject({
      isReadable: true,
      rows: [
        {
          path: 'color.action.primary',
          type: 'color',
          value: '#ff8731',
          isColorValue: true,
          validationStatus: 'valid',
          errorMessages: [],
        },
      ],
    });
  });

  it('creates invalid token rows with visible errors', () => {
    const result = createTokenRows([
      {
        path: '',
        type: 'color',
        value: '',
      },
    ]);

    expect(result.isReadable).toBe(true);
    expect(result.rows[0]?.validationStatus).toBe('invalid');
    expect(result.rows[0]?.errorMessages.length).toBeGreaterThan(0);
  });

  it('marks malformed token sets as unreadable', () => {
    expect(createTokenRows({ invalid: true })).toEqual({
      rows: [],
      isReadable: false,
    });
  });

  it('detects editable primitive color token rows', () => {
    expect(
      isEditablePrimitiveColorTokenRow({
        id: 'color.primitive.accent.primary',
        path: 'color.primitive.accent.primary',
        type: 'color',
        value: '#ff8731',
        rawValue: '#ff8731',
        isColorValue: true,
        validationStatus: 'valid',
        errorMessages: [],
      }),
    ).toBe(true);
  });

  it('does not mark semantic color aliases as primitive editable rows', () => {
    expect(
      isEditablePrimitiveColorTokenRow({
        id: 'color.semantic.action.primary',
        path: 'color.semantic.action.primary',
        type: 'color',
        value: '{color.primitive.accent.primary}',
        rawValue: '{color.primitive.accent.primary}',
        isColorValue: false,
        validationStatus: 'valid',
        errorMessages: [],
      }),
    ).toBe(false);
  });
});
