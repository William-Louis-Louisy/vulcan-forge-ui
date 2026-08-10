import {
  normalizeTypographyTokenValue,
  type TypographyTokenValue,
} from '@/domain/design-system';

export type TypographyTokenFormValues = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
};

const emptyTypographyTokenFormValues: TypographyTokenFormValues = {
  fontFamily: '',
  fontSize: '',
  fontWeight: '',
  lineHeight: '',
  letterSpacing: '',
};

function stringifyTypographyFieldValue(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return '';
}

function parseFontWeight(value: string): string | number {
  const trimmedValue = value.trim();

  if (/^\d+$/.test(trimmedValue)) {
    return Number(trimmedValue);
  }

  return trimmedValue;
}

export function createEmptyTypographyTokenFormValues(): TypographyTokenFormValues {
  return { ...emptyTypographyTokenFormValues };
}

export function parseTypographyTokenValue(
  value: unknown,
  tokenPath?: string,
): TypographyTokenFormValues {
  const normalizedValue = normalizeTypographyTokenValue({
    value,
    ...(tokenPath ? { tokenPath } : {}),
  });

  if (!normalizedValue) {
    return createEmptyTypographyTokenFormValues();
  }

  return {
    fontFamily: stringifyTypographyFieldValue(normalizedValue.fontFamily),
    fontSize: stringifyTypographyFieldValue(normalizedValue.fontSize),
    fontWeight: stringifyTypographyFieldValue(normalizedValue.fontWeight),
    lineHeight: stringifyTypographyFieldValue(normalizedValue.lineHeight),
    letterSpacing: stringifyTypographyFieldValue(normalizedValue.letterSpacing),
  };
}

export function serializeTypographyTokenFormValues(
  values: TypographyTokenFormValues,
): string {
  const nextValue: TypographyTokenValue = {};

  const fontFamily = values.fontFamily.trim();
  const fontSize = values.fontSize.trim();
  const fontWeight = values.fontWeight.trim();
  const lineHeight = values.lineHeight.trim();
  const letterSpacing = values.letterSpacing.trim();

  if (fontFamily) {
    nextValue.fontFamily = fontFamily;
  }

  if (fontSize) {
    nextValue.fontSize = fontSize;
  }

  if (fontWeight) {
    nextValue.fontWeight = parseFontWeight(fontWeight);
  }

  if (lineHeight) {
    nextValue.lineHeight = lineHeight;
  }

  if (letterSpacing) {
    nextValue.letterSpacing = letterSpacing;
  }

  return JSON.stringify(nextValue);
}
