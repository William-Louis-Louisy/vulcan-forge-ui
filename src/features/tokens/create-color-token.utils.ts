import { isHexColorValue } from './tokens-editor.utils';
import type { DesignToken } from '@/domain/design-system';
import { pathToTokenReference } from '@/domain/design-system';

export type CreateColorTokenResult =
  | {
      status: 'success';
      tokens: DesignToken[];
      token: DesignToken;
    }
  | {
      status: 'error';
      error:
        | 'tokenPathAlreadyExists'
        | 'primitiveReferenceNotFound'
        | 'primitiveReferenceInvalid';
    };

export function createColorToken({
  tokens,
  kind,
  path,
  value,
  referencePath,
  descriptionEn,
  descriptionFr,
}: {
  tokens: DesignToken[];
  kind: 'primitive' | 'semantic';
  path: string;
  value: string;
  referencePath?: string;
  descriptionEn?: string;
  descriptionFr?: string;
}): CreateColorTokenResult {
  const nextPath = path.trim();

  const pathAlreadyExists = tokens.some((token) => token.path === nextPath);

  if (pathAlreadyExists) {
    return {
      status: 'error',
      error: 'tokenPathAlreadyExists',
    };
  }

  const description: DesignToken['description'] = {};

  if (descriptionEn?.trim()) {
    description.en = descriptionEn.trim();
  }

  if (descriptionFr?.trim()) {
    description.fr = descriptionFr.trim();
  }

  const baseToken = {
    path: nextPath,
    type: 'color' as const,
    status: 'draft' as const,
    ...(Object.keys(description).length > 0 ? { description } : {}),
  };

  if (kind === 'primitive') {
    const token: DesignToken = {
      ...baseToken,
      value: value.trim(),
    };

    return {
      status: 'success',
      token,
      tokens: [...tokens, token],
    };
  }

  const primitiveReferencePath = referencePath?.trim() ?? '';

  const primitiveToken = tokens.find(
    (token) => token.path === primitiveReferencePath,
  );

  if (!primitiveToken) {
    return {
      status: 'error',
      error: 'primitiveReferenceNotFound',
    };
  }

  if (
    primitiveToken.type !== 'color' ||
    typeof primitiveToken.value !== 'string' ||
    !isHexColorValue(primitiveToken.value)
  ) {
    return {
      status: 'error',
      error: 'primitiveReferenceInvalid',
    };
  }

  const reference = pathToTokenReference(primitiveReferencePath);

  const token: DesignToken = {
    ...baseToken,
    value: reference,
    reference,
  };

  return {
    status: 'success',
    token,
    tokens: [...tokens, token],
  };
}
