from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file_path = Path(path)
    content = file_path.read_text(encoding='utf-8')
    if old not in content:
        raise RuntimeError(f'Expected fragment not found in {path}: {old[:160]!r}')
    file_path.write_text(content.replace(old, new, 1), encoding='utf-8')


def write(path: str, content: str) -> None:
    file_path = Path(path)
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_text(content, encoding='utf-8')


write(
    'src/domain/design-system/design-token.schema.ts',
    '''import { z } from 'zod';
import { localizedStringSchema } from '@/domain/i18n';

export const designTokenTypeSchema = z.enum([
  'color',
  'spacing',
  'radius',
  'typography',
  'motion',
]);

export const designTokenReferenceSchema = z
  .string()
  .trim()
  .regex(/^\\{[a-zA-Z0-9._-]+\\}$/, {
    message: 'tokenReferenceInvalid',
  });

export const designTokenScalarValueSchema = z.union([
  z.string().trim().min(1, { message: 'tokenValueRequired' }),
  z.number(),
  z.boolean(),
]);

const typographyStringValueSchema = z
  .string()
  .trim()
  .min(1, { message: 'tokenTypographyValueInvalid' });
const typographyStringOrNumberValueSchema = z.union([
  typographyStringValueSchema,
  z.number(),
]);

export const typographyTokenValueSchema = z
  .object({
    fontFamily: typographyStringValueSchema.optional(),
    fontSize: typographyStringValueSchema.optional(),
    fontWeight: typographyStringOrNumberValueSchema.optional(),
    lineHeight: typographyStringOrNumberValueSchema.optional(),
    letterSpacing: typographyStringValueSchema.optional(),
  })
  .strict()
  .refine(
    (value) => Object.values(value).some((fieldValue) => fieldValue !== undefined),
    { message: 'tokenTypographyValueInvalid' },
  );

export const designTokenValueSchema = z.union([
  designTokenScalarValueSchema,
  typographyTokenValueSchema,
]);

export const designTokenStatusSchema = z.enum(['draft', 'ready', 'deprecated']);

export type DesignTokenType = z.infer<typeof designTokenTypeSchema>;
export type TypographyTokenValue = z.infer<typeof typographyTokenValueSchema>;
export type DesignTokenValue = z.infer<typeof designTokenValueSchema>;
export type DesignTokenStatus = z.infer<typeof designTokenStatusSchema>;
export type DesignTokenDescription = z.infer<typeof localizedStringSchema>;

export type DesignToken = {
  path: string;
  type: DesignTokenType;
  value: DesignTokenValue;
  description?: DesignTokenDescription;
  reference?: string;
  status: DesignTokenStatus;
};

type TypographyTokenField = keyof TypographyTokenValue;

function getLegacyTypographyField(tokenPath: string): TypographyTokenField | null {
  const segments = tokenPath.toLowerCase().split('.');

  if (segments.includes('fontfamily')) {
    return 'fontFamily';
  }

  if (segments.includes('fontsize')) {
    return 'fontSize';
  }

  if (segments.includes('fontweight')) {
    return 'fontWeight';
  }

  if (segments.includes('lineheight')) {
    return 'lineHeight';
  }

  if (segments.includes('letterspacing')) {
    return 'letterSpacing';
  }

  return null;
}

function parseJsonTypographyValue(value: string): unknown {
  const trimmedValue = value.trim();

  if (!trimmedValue.startsWith('{')) {
    return value;
  }

  try {
    return JSON.parse(trimmedValue) as unknown;
  } catch {
    return value;
  }
}

export function normalizeTypographyTokenValue({
  value,
  tokenPath,
}: {
  value: unknown;
  tokenPath?: string;
}): TypographyTokenValue | null {
  const candidate =
    typeof value === 'string' ? parseJsonTypographyValue(value) : value;
  const parsedCandidate = typographyTokenValueSchema.safeParse(candidate);

  if (parsedCandidate.success) {
    return parsedCandidate.data;
  }

  if (
    tokenPath &&
    (typeof value === 'string' || typeof value === 'number')
  ) {
    const legacyField = getLegacyTypographyField(tokenPath);

    if (legacyField) {
      const parsedLegacyValue = typographyTokenValueSchema.safeParse({
        [legacyField]: value,
      });

      if (parsedLegacyValue.success) {
        return parsedLegacyValue.data;
      }
    }
  }

  return null;
}

const rawDesignTokenSchema = z.object({
  path: z
    .string()
    .trim()
    .min(1, { message: 'tokenPathRequired' })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message: 'tokenPathInvalid',
    }),
  type: designTokenTypeSchema,
  value: z.unknown(),
  description: localizedStringSchema.optional(),
  reference: designTokenReferenceSchema.optional(),
  status: designTokenStatusSchema.default('draft'),
});

function createNormalizedDesignToken(
  token: z.infer<typeof rawDesignTokenSchema>,
  value: DesignTokenValue,
): DesignToken {
  return {
    path: token.path,
    type: token.type,
    value,
    status: token.status,
    ...(token.description ? { description: token.description } : {}),
    ...(token.reference ? { reference: token.reference } : {}),
  };
}

export const designTokenSchema = rawDesignTokenSchema.transform<DesignToken>(
  (token, context) => {
    if (token.type === 'typography') {
      const typographyValue = normalizeTypographyTokenValue({
        value: token.value,
        tokenPath: token.path,
      });

      if (!typographyValue) {
        context.addIssue({
          code: 'custom',
          path: ['value'],
          message: 'tokenTypographyValueInvalid',
        });
        return z.NEVER;
      }

      return createNormalizedDesignToken(token, typographyValue);
    }

    const scalarValue = designTokenScalarValueSchema.safeParse(token.value);

    if (!scalarValue.success) {
      context.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'tokenValueRequired',
      });
      return z.NEVER;
    }

    return createNormalizedDesignToken(token, scalarValue.data);
  },
);

export const designTokenSetSchema = z.object({
  type: designTokenTypeSchema,
  name: z.string().trim().min(1, { message: 'tokenSetNameRequired' }),
  tokens: z.array(designTokenSchema),
});

export type DesignTokenSet = z.infer<typeof designTokenSetSchema>;
''',
)

write(
    'src/features/tokens/create-design-token.utils.ts',
    '''import {
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
    status: 'draft',
    ...(Object.keys(description).length > 0 ? { description } : {}),
  };

  return {
    status: 'success',
    token,
    tokens: [...tokens, token],
  };
}
''',
)

replace_once(
    'src/domain/exports/css-variables-export.ts',
    "function stringifyCssValue(value: DesignToken['value']): string | null {",
    "function stringifyCssValue(value: unknown): string | null {",
)

replace_once(
    'src/features/tokens/typography-token-value.utils.ts',
    '  const normalizedValue = normalizeTypographyTokenValue({ value, tokenPath });',
    "  const normalizedValue = normalizeTypographyTokenValue({\n    value,\n    ...(tokenPath ? { tokenPath } : {}),\n  });",
)

replace_once(
    'src/features/tokens/editor/TokenInspectorPanel.tsx',
    '              initialValue={token.rawValue}\n              labels={labels.genericValue}',
    '              initialValue={token.value}\n              labels={labels.genericValue}',
)
replace_once(
    'src/features/tokens/editor/TokenInspectorPanel.tsx',
    '              initialValue={token.value}\n              labels={labels.typographyValue}',
    '              initialValue={token.rawValue}\n              labels={labels.typographyValue}',
)

replace_once(
    'src/domain/design-system/mvp-seed-templates.ts',
    '''    tokens: [
      {
        path: 'typography.fontFamily.sans',
        type: 'typography',
        value: 'Inter, system-ui, sans-serif',
        description: {
          en: 'Default sans-serif font stack.',
          fr: 'Pile de police sans-serif par défaut.',
        },
        status: 'ready',
      },
      {
        path: 'typography.fontSize.base',
        type: 'typography',
        value: '1rem',
        description: {
          en: 'Default body font size.',
          fr: 'Taille de texte par défaut.',
        },
        status: 'ready',
      },
      {
        path: 'typography.fontWeight.semibold',
        type: 'typography',
        value: 600,
        description: {
          en: 'Semibold font weight.',
          fr: 'Graisse de texte semi-bold.',
        },
        status: 'ready',
      },
    ],''',
    '''    tokens: [
      {
        path: 'typography.body.base',
        type: 'typography',
        value: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: '1.5',
          letterSpacing: '0em',
        },
        description: {
          en: 'Default body text style.',
          fr: 'Style de texte courant par défaut.',
        },
        status: 'ready',
      },
    ],''',
)

replace_once(
    'docs/product/ds-170-08a-token-editor-reliability.md',
    'Any subsequent save of that token set persists normalized object values because token-set writes validate and serialize the parsed domain representation.',
    'Any subsequent save of that token set persists normalized object values because token-set writes validate and serialize the parsed domain representation. Newly created projects now start with `typography.body.base` as a real composite body style instead of three atomic typography seed tokens.',
)

print('DS-170-08A type fixes applied.')
