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

export type UpdateThemeColorRoleReferenceError =
  | 'invalidRoleKey'
  | 'invalidTokenPath'
  | 'themeTokensMalformed';

type PreparedThemeColorRoleMutation =
  | {
      status: 'success';
      roleKey: ThemeRoleKey;
      tokenReference: string;
      tokens: Record<string, JsonValue>;
      colorTokens: Record<string, JsonValue>;
    }
  | {
      status: 'error';
      error: 'invalidRoleKey' | 'invalidTokenPath' | 'themeTokensMalformed';
    };

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

export type UpdateThemeColorRoleReferenceResult =
  | {
      status: 'success';
      roleKey: ThemeRoleKey;
      tokenReference: string;
      tokens: Record<string, JsonValue>;
    }
  | {
      status: 'error';
      error: UpdateThemeColorRoleReferenceError;
    };

const themeTokensSchema = z.record(z.string(), jsonValueSchema);

function isJsonObject(
  value: JsonValue | undefined,
): value is Record<string, JsonValue> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function prepareThemeColorRoleMutation({
  tokens,
  roleKey,
  tokenPath,
}: {
  tokens: unknown;
  roleKey: string;
  tokenPath: string;
}): PreparedThemeColorRoleMutation {
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

  return {
    status: 'success',
    roleKey: parsedRoleKey.data,
    tokenReference,
    tokens: parsedTokens.data,
    colorTokens: currentColorTokens ?? {},
  };
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
  const preparedMutation = prepareThemeColorRoleMutation({
    tokens,
    roleKey,
    tokenPath,
  });

  if (preparedMutation.status === 'error') {
    return preparedMutation;
  }

  if (
    Object.prototype.hasOwnProperty.call(
      preparedMutation.colorTokens,
      preparedMutation.roleKey,
    )
  ) {
    return {
      status: 'error',
      error: 'roleAlreadyExists',
    };
  }

  return {
    status: 'success',
    roleKey: preparedMutation.roleKey,
    tokenReference: preparedMutation.tokenReference,
    tokens: {
      ...preparedMutation.tokens,
      color: {
        ...preparedMutation.colorTokens,
        [preparedMutation.roleKey]: preparedMutation.tokenReference,
      },
    },
  };
}

export function updateThemeColorRoleReference({
  tokens,
  roleKey,
  tokenPath,
}: {
  tokens: unknown;
  roleKey: string;
  tokenPath: string;
}): UpdateThemeColorRoleReferenceResult {
  const preparedMutation = prepareThemeColorRoleMutation({
    tokens,
    roleKey,
    tokenPath,
  });

  if (preparedMutation.status === 'error') {
    return preparedMutation;
  }

  return {
    status: 'success',
    roleKey: preparedMutation.roleKey,
    tokenReference: preparedMutation.tokenReference,
    tokens: {
      ...preparedMutation.tokens,
      color: {
        ...preparedMutation.colorTokens,
        [preparedMutation.roleKey]: preparedMutation.tokenReference,
      },
    },
  };
}
