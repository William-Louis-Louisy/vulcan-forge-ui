import type { TypographyTokenValue } from './design-token.schema';
import {
  pathToTokenReference,
  tokenReferenceToPath,
  type TokenDictionary,
} from './token-resolution';

export type TypographySpacingReferenceField = 'fontSize' | 'letterSpacing';

export type NormalizeTypographySpacingReferencesResult =
  | {
      status: 'success';
      value: TypographyTokenValue;
    }
  | {
      status: 'error';
      field: TypographySpacingReferenceField;
      referencePath: string;
    };

type NormalizeSpacingReferenceFieldResult =
  | {
      status: 'success';
      value: string | undefined;
    }
  | {
      status: 'error';
      field: TypographySpacingReferenceField;
      referencePath: string;
    };

function normalizeSpacingReferenceField({
  field,
  value,
  dictionary,
}: {
  field: TypographySpacingReferenceField;
  value: string | undefined;
  dictionary: TokenDictionary;
}): NormalizeSpacingReferenceFieldResult {
  if (value === undefined) {
    return {
      status: 'success',
      value,
    };
  }

  const trimmedValue = value.trim();
  const canonicalReferencePath = tokenReferenceToPath(trimmedValue);
  const candidateReferencePath = canonicalReferencePath ?? trimmedValue;
  const referencedToken = dictionary.get(candidateReferencePath);

  if (!referencedToken) {
    return {
      status: 'success',
      value: canonicalReferencePath
        ? pathToTokenReference(canonicalReferencePath)
        : trimmedValue,
    };
  }

  if (referencedToken.type !== 'spacing') {
    return {
      status: 'error',
      field,
      referencePath: candidateReferencePath,
    };
  }

  return {
    status: 'success',
    value: pathToTokenReference(candidateReferencePath),
  };
}

export function normalizeTypographySpacingReferences({
  value,
  dictionary,
}: {
  value: TypographyTokenValue;
  dictionary: TokenDictionary;
}): NormalizeTypographySpacingReferencesResult {
  const fontSizeResult = normalizeSpacingReferenceField({
    field: 'fontSize',
    value: value.fontSize,
    dictionary,
  });

  if (fontSizeResult.status === 'error') {
    return fontSizeResult;
  }

  const letterSpacingResult = normalizeSpacingReferenceField({
    field: 'letterSpacing',
    value: value.letterSpacing,
    dictionary,
  });

  if (letterSpacingResult.status === 'error') {
    return letterSpacingResult;
  }

  return {
    status: 'success',
    value: {
      ...value,
      ...(fontSizeResult.value !== undefined
        ? { fontSize: fontSizeResult.value }
        : {}),
      ...(letterSpacingResult.value !== undefined
        ? { letterSpacing: letterSpacingResult.value }
        : {}),
    },
  };
}
