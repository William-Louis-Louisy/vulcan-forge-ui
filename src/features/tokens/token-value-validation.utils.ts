import { isHexColorValue } from './tokens-editor.utils';
import type { DesignTokenType } from '@/domain/design-system';

export type TokenValueValidationError =
  | 'tokenValueRequired'
  | 'tokenColorValueInvalid'
  | 'tokenSpacingValueInvalid'
  | 'tokenRadiusValueInvalid'
  | 'tokenTypographyValueInvalid'
  | 'tokenMotionValueInvalid';

const cssLengthPattern = /^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|vmin|vmax|ch|ex)$/;

const cssDurationPattern = /^\d+(\.\d+)?(ms|s)$/;

const typographyAllowedProperties = new Set([
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
]);

export function validateTokenValueForType({
  type,
  value,
}: {
  type: DesignTokenType;
  value: string;
}): TokenValueValidationError | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'tokenValueRequired';
  }

  if (type === 'color') {
    return isHexColorValue(trimmedValue) ? null : 'tokenColorValueInvalid';
  }

  if (type === 'spacing') {
    return cssLengthPattern.test(trimmedValue)
      ? null
      : 'tokenSpacingValueInvalid';
  }

  if (type === 'radius') {
    return cssLengthPattern.test(trimmedValue)
      ? null
      : 'tokenRadiusValueInvalid';
  }

  if (type === 'motion') {
    return cssDurationPattern.test(trimmedValue)
      ? null
      : 'tokenMotionValueInvalid';
  }

  if (type === 'typography') {
    return validateTypographyTokenValue(trimmedValue);
  }

  return null;
}

function validateTypographyTokenValue(
  value: string,
): TokenValueValidationError | null {
  try {
    const parsedValue: unknown = JSON.parse(value);

    if (
      typeof parsedValue !== 'object' ||
      parsedValue === null ||
      Array.isArray(parsedValue)
    ) {
      return 'tokenTypographyValueInvalid';
    }

    const entries = Object.entries(parsedValue);

    if (entries.length === 0) {
      return 'tokenTypographyValueInvalid';
    }

    const hasOnlyAllowedProperties = entries.every(
      ([key, entryValue]) =>
        typographyAllowedProperties.has(key) &&
        (typeof entryValue === 'string' || typeof entryValue === 'number'),
    );

    return hasOnlyAllowedProperties ? null : 'tokenTypographyValueInvalid';
  } catch {
    return 'tokenTypographyValueInvalid';
  }
}
