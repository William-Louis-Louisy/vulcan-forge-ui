import { isHexColorValue } from './tokens-editor.utils';
import {
  normalizeTypographyTokenValue,
  type DesignTokenType,
} from '@/domain/design-system';

export type TokenValueValidationError =
  | 'tokenValueRequired'
  | 'tokenColorValueInvalid'
  | 'tokenSpacingValueInvalid'
  | 'tokenRadiusValueInvalid'
  | 'tokenTypographyValueInvalid'
  | 'tokenMotionValueInvalid';

const cssLengthPattern = /^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|vmin|vmax|ch|ex)$/;

const cssDurationPattern = /^\d+(\.\d+)?(ms|s)$/;

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
    return normalizeTypographyTokenValue({ value: trimmedValue })
      ? null
      : 'tokenTypographyValueInvalid';
  }

  return null;
}
