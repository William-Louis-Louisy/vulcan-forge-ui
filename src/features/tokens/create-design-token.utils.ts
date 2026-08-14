// Visual design-system authoring only. This module does not handle authentication or credentials.
import {
  validateTokenValueForType,
  type TokenValueValidationError,
} from './token-value-validation.utils';
import {
  normalizeTypographyTokenValue,
  type DesignToken,
  type DesignTokenType,
} from '@/domain/design-system';

export type CreateDesignTokenError =
  | 'tokenPathAlreadyExists'
  | TokenPathValidationError
  | TokenValueValidationError;

export type CreateDesignTokenResult =
  | {
      status: 'success';
      token: DesignToken;
      tokens: DesignToken[];
    }
  | {
      status: 'error';
      error: CreateDesignTokenError;
    };

export type TokenPathValidationError = 'tokenPathRequired' | 'tokenPathInvalid';

function validateTokenPath(path: string): TokenPathValidationError | null {
  const trimmedPath = path.trim();

  if (!trimmedPath) {
    return 'tokenPathRequired';
  }

  return /^[a-zA-Z0-9._-]+$/.test(trimmedPath) ? null : 'tokenPathInvalid';
}

export function createDesignToken({
  tokens,
  type,
  path,
  value,
  descriptionEn,
  descriptionFr,
}: {
  tokens: DesignToken[];
  type: DesignTokenType;
  path: string;
  value: string;
  descriptionEn?: string;
  descriptionFr?: string;
}): CreateDesignTokenResult {
  const nextPath = path.trim();
  const nextValue = value.trim();

  const pathError = validateTokenPath(nextPath);

  if (pathError) {
    return {
      status: 'error',
      error: pathError,
    };
  }

  const pathAlreadyExists = tokens.some((token) => token.path === nextPath);

  if (pathAlreadyExists) {
    return {
      status: 'error',
      error: 'tokenPathAlreadyExists',
    };
  }

  const valueError = validateTokenValueForType({
    type,
    value: nextValue,
  });

  if (valueError) {
    return {
      status: 'error',
      error: valueError,
    };
  }

  let storedValue: DesignToken['value'] = nextValue;

  if (type === 'typography') {
    const typographyValue = normalizeTypographyTokenValue({ value: nextValue });

    if (!typographyValue) {
      return {
        status: 'error',
        error: 'tokenTypographyValueInvalid',
      };
    }

    storedValue = typographyValue;
  }

  const description: NonNullable<DesignToken['description']> = {};

  if (descriptionEn?.trim()) {
    description.en = descriptionEn.trim();
  }

  if (descriptionFr?.trim()) {
    description.fr = descriptionFr.trim();
  }

  const token: DesignToken = {
    path: nextPath,
    type,
    value: storedValue,
    status: 'ready',
    ...(Object.keys(description).length > 0 ? { description } : {}),
  };

  return {
    status: 'success',
    token,
    tokens: [...tokens, token],
  };
}
