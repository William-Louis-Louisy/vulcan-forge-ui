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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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
  value: string,
): TypographyTokenFormValues {
  if (!value.trim()) {
    return createEmptyTypographyTokenFormValues();
  }

  try {
    const parsedValue: unknown = JSON.parse(value);

    if (!isRecord(parsedValue)) {
      return createEmptyTypographyTokenFormValues();
    }

    return {
      fontFamily: stringifyTypographyFieldValue(parsedValue.fontFamily),
      fontSize: stringifyTypographyFieldValue(parsedValue.fontSize),
      fontWeight: stringifyTypographyFieldValue(parsedValue.fontWeight),
      lineHeight: stringifyTypographyFieldValue(parsedValue.lineHeight),
      letterSpacing: stringifyTypographyFieldValue(parsedValue.letterSpacing),
    };
  } catch {
    return createEmptyTypographyTokenFormValues();
  }
}

export function serializeTypographyTokenFormValues(
  values: TypographyTokenFormValues,
): string {
  const nextValue: Record<string, string | number> = {};

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
