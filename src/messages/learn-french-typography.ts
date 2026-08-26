import type { MessageObject } from './merge-messages';

const narrowNoBreakSpace = '\u202F';

function qualifyFrenchString(value: string): string {
  return value
    .replace(/«[\u00A0 ]/g, `«${narrowNoBreakSpace}`)
    .replace(/[\u00A0 ]»/g, `${narrowNoBreakSpace}»`)
    .replace(/[\u00A0 ]([:;?!])/g, `${narrowNoBreakSpace}$1`)
    .replace(/(\d) (px|ms)\b/g, `$1${narrowNoBreakSpace}$2`);
}

function qualifyValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return qualifyFrenchString(value);
  }

  if (Array.isArray(value)) {
    return value.map(qualifyValue);
  }

  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        qualifyValue(nestedValue),
      ]),
    );
  }

  return value;
}

export function qualifyFrenchLearnTypography<T extends MessageObject>(
  messages: T,
): T {
  return qualifyValue(messages) as T;
}
