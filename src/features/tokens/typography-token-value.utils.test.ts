import {
  parseTypographyTokenValue,
  serializeTypographyTokenFormValues,
  createEmptyTypographyTokenFormValues,
} from './typography-token-value.utils';
import { describe, expect, it } from 'vitest';
import { validateTokenValueForType } from './token-value-validation.utils';

describe('typography-token-value utils', () => {
  it('returns empty form values', () => {
    expect(createEmptyTypographyTokenFormValues()).toEqual({
      fontFamily: '',
      fontSize: '',
      fontWeight: '',
      lineHeight: '',
      letterSpacing: '',
    });
  });

  it('parses an existing typography token JSON value', () => {
    expect(
      parseTypographyTokenValue(
        JSON.stringify({
          fontFamily: 'Inter',
          fontSize: '1rem',
          fontWeight: 600,
          lineHeight: '1.5',
          letterSpacing: '-0.01em',
        }),
      ),
    ).toEqual({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '-0.01em',
    });
  });

  it('returns empty values when parsing invalid JSON', () => {
    expect(parseTypographyTokenValue('not-json')).toEqual({
      fontFamily: '',
      fontSize: '',
      fontWeight: '',
      lineHeight: '',
      letterSpacing: '',
    });
  });

  it('serializes filled typography fields to a JSON token value', () => {
    const serializedValue = serializeTypographyTokenFormValues({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '-0.01em',
    });

    expect(JSON.parse(serializedValue)).toEqual({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: '1.5',
      letterSpacing: '-0.01em',
    });
  });

  it('omits empty typography fields', () => {
    const serializedValue = serializeTypographyTokenFormValues({
      fontFamily: 'Inter',
      fontSize: '',
      fontWeight: '',
      lineHeight: '1.5',
      letterSpacing: '',
    });

    expect(JSON.parse(serializedValue)).toEqual({
      fontFamily: 'Inter',
      lineHeight: '1.5',
    });
  });

  it('produces a value accepted by typography token validation', () => {
    const serializedValue = serializeTypographyTokenFormValues({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '-0.01em',
    });

    expect(
      validateTokenValueForType({
        type: 'typography',
        value: serializedValue,
      }),
    ).toBeNull();
  });
});
