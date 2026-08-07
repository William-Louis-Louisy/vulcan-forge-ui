import { z } from 'zod';
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
  .regex(/^\{[a-zA-Z0-9._-]+\}$/, {
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
    (value) =>
      Object.values(value).some((fieldValue) => fieldValue !== undefined),
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

function getLegacyTypographyField(
  tokenPath: string,
): TypographyTokenField | null {
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

  if (tokenPath && (typeof value === 'string' || typeof value === 'number')) {
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
