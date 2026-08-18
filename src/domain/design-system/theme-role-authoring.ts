import { z } from 'zod';
import { designTokenReferenceSchema } from './design-token.schema';
import { jsonValueSchema, type JsonValue } from './theme.schema';
import { pathToTokenReference } from './token-resolution';

export const themeRoleKeySchema = z
  .string()
  .trim()
  .min(1, { message: 'themeRoleKeyRequired' })
  .max(64, { message: 'themeRoleKeyTooLong' })
  .regex(/^[a-z](?:[a-z0-9-]*[a-z0-9])?$/, {
    message: 'themeRoleKeyInvalid',
  });

export type ThemeRoleKey = z.infer<typeof themeRoleKeySchema>;

export type CreateThemeColorRoleError =
  | 'invalidRoleKey'
  | 'invalidTokenPath'
  | 'themeTokensMalformed'
  | 'roleAlreadyExists';

export type CreateThemeColorRoleResult =
  | {
      status: 'success';
      roleKey: ThemeRoleKey;
      tokenReference: string;
      tokens: Record<string, JsonValue>;
    }
  | {
      status: 'error';
      error: CreateThemeColorRoleError;
    };

const themeTokensSchema = z.record(z.string(), jsonValueSchema);

function isJsonObject(value: JsonValue | undefined): value is Record<string, JsonValue> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function createThemeColorRole({
  tokens,
  roleKey,
  tokenPath,
}: {
  tokens: unknown;
  roleKey: string;
  tokenPath: string;
}): CreateThemeColorRoleResult {
  const parsedRoleKey = themeRoleKeySchema.safeParse(roleKey);

  if (!parsedRoleKey.success) {
    return {
      status: 'error',
      error: 'invalidRoleKey',
    };
  }

  const parsedTokens = themeTokensSchema.safeParse(tokens);

  if (!parsedTokens.success) {
    return {
      status: 'error',
      error: 'themeTokensMalformed',
    };
  }

  const currentColorTokens = parsedTokens.data.color;

  if (currentColorTokens !== undefined && !isJsonObject(currentColorTokens)) {
    return {
      status: 'error',
      error: 'themeTokensMalformed',
    };
  }

  const tokenReference = pathToTokenReference(tokenPath.trim());

  if (!designTokenReferenceSchema.safeParse(tokenReference).success) {
    return {
      status: 'error',
      error: 'invalidTokenPath',
    };
  }

  const colorTokens = currentColorTokens ?? {};

  if (Object.prototype.hasOwnProperty.call(colorTokens, parsedRoleKey.data)) {
    return {
      status: 'error',
      error: 'roleAlreadyExists',
    };
  }

  return {
    status: 'success',
    roleKey: parsedRoleKey.data,
    tokenReference,
    tokens: {
      ...parsedTokens.data,
      color: {
        ...colorTokens,
        [parsedRoleKey.data]: tokenReference,
      },
    },
  };
}
