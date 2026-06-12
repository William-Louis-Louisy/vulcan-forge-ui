import {
  validateTokenValueForType,
  type TokenValueValidationError,
} from './token-value-validation.utils';
import type { DesignToken, DesignTokenType } from '@/domain/design-system';

export type CreateDesignTokenError =
  | 'tokenPathAlreadyExists'
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

  const description: DesignToken['description'] = {};

  if (descriptionEn?.trim()) {
    description.en = descriptionEn.trim();
  }

  if (descriptionFr?.trim()) {
    description.fr = descriptionFr.trim();
  }

  const token: DesignToken = {
    path: nextPath,
    type,
    value: nextValue,
    status: 'draft',
    ...(Object.keys(description).length > 0 ? { description } : {}),
  };

  return {
    status: 'success',
    token,
    tokens: [...tokens, token],
  };
}
