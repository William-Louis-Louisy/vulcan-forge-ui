from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file_path = Path(path)
    content = file_path.read_text(encoding='utf-8')
    if old not in content:
        raise RuntimeError(f'Expected fragment not found in {path}: {old[:120]!r}')
    file_path.write_text(content.replace(old, new, 1), encoding='utf-8')


def replace_all(path: str, old: str, new: str) -> None:
    file_path = Path(path)
    content = file_path.read_text(encoding='utf-8')
    if old not in content:
        raise RuntimeError(f'Expected fragment not found in {path}: {old[:120]!r}')
    file_path.write_text(content.replace(old, new), encoding='utf-8')


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

export type TypographyTokenValue = z.infer<typeof typographyTokenValueSchema>;

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

export const designTokenSchema = rawDesignTokenSchema.transform((token, context) => {
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

    return {
      ...token,
      value: typographyValue,
    };
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

  return {
    ...token,
    value: scalarValue.data,
  };
});

export const designTokenSetSchema = z.object({
  type: designTokenTypeSchema,
  name: z.string().trim().min(1, { message: 'tokenSetNameRequired' }),
  tokens: z.array(designTokenSchema),
});

export type DesignTokenType = z.infer<typeof designTokenTypeSchema>;
export type DesignToken = z.infer<typeof designTokenSchema>;
export type DesignTokenSet = z.infer<typeof designTokenSetSchema>;
''',
)

write(
    'src/domain/design-system/design-token.schema.test.ts',
    '''import { describe, expect, it } from 'vitest';
import { designTokenSchema, designTokenSetSchema } from './design-token.schema';

describe('designTokenSchema', () => {
  it('accepts a valid design token', () => {
    expect(
      designTokenSchema.parse({
        path: 'color.action.primary',
        type: 'color',
        value: '#ff8731',
        description: {
          en: 'Primary action color',
          fr: 'Couleur d’action principale',
        },
      }),
    ).toMatchObject({
      path: 'color.action.primary',
      type: 'color',
      value: '#ff8731',
      status: 'draft',
    });
  });

  it('accepts and preserves a composite typography value', () => {
    expect(
      designTokenSchema.parse({
        path: 'typography.body.base',
        type: 'typography',
        value: {
          fontFamily: 'Inter',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: '1.5',
          letterSpacing: '0em',
        },
      }).value,
    ).toEqual({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: '0em',
    });
  });

  it('normalizes JSON-string typography values created by the previous editor', () => {
    const token = designTokenSchema.parse({
      path: 'typography.body.base',
      type: 'typography',
      value: JSON.stringify({
        fontFamily: 'Inter',
        fontSize: '1rem',
        fontWeight: 600,
      }),
    });

    expect(token.value).toEqual({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: 600,
    });
  });

  it('normalizes legacy atomic typography seed values by path', () => {
    const token = designTokenSchema.parse({
      path: 'typography.fontWeight.semibold',
      type: 'typography',
      value: 600,
    });

    expect(token.value).toEqual({
      fontWeight: 600,
    });
  });

  it('rejects object values for non-typography tokens', () => {
    expect(
      designTokenSchema.safeParse({
        path: 'spacing.4',
        type: 'spacing',
        value: { fontSize: '1rem' },
      }).success,
    ).toBe(false);
  });

  it('rejects an invalid token path', () => {
    expect(
      designTokenSchema.safeParse({
        path: 'color action primary',
        type: 'color',
        value: '#ff8731',
      }).success,
    ).toBe(false);
  });

  it('accepts a valid token set', () => {
    expect(
      designTokenSetSchema.safeParse({
        type: 'spacing',
        name: 'Spacing',
        tokens: [
          {
            path: 'spacing.4',
            type: 'spacing',
            value: '1rem',
          },
        ],
      }).success,
    ).toBe(true);
  });

  it('accepts an empty authored token set', () => {
    expect(
      designTokenSetSchema.safeParse({
        type: 'spacing',
        name: 'Spacing',
        tokens: [],
      }).success,
    ).toBe(true);
  });
});
''',
)

write(
    'src/features/tokens/typography-token-value.utils.ts',
    '''import {
  normalizeTypographyTokenValue,
  type TypographyTokenValue,
} from '@/domain/design-system';

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

function stringifyTypographyFieldValue(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return '';
}

function parseFontWeight(value: string): string | number {
  const trimmedValue = value.trim();

  if (/^\\d+$/.test(trimmedValue)) {
    return Number(trimmedValue);
  }

  return trimmedValue;
}

export function createEmptyTypographyTokenFormValues(): TypographyTokenFormValues {
  return { ...emptyTypographyTokenFormValues };
}

export function parseTypographyTokenValue(
  value: unknown,
  tokenPath?: string,
): TypographyTokenFormValues {
  const normalizedValue = normalizeTypographyTokenValue({ value, tokenPath });

  if (!normalizedValue) {
    return createEmptyTypographyTokenFormValues();
  }

  return {
    fontFamily: stringifyTypographyFieldValue(normalizedValue.fontFamily),
    fontSize: stringifyTypographyFieldValue(normalizedValue.fontSize),
    fontWeight: stringifyTypographyFieldValue(normalizedValue.fontWeight),
    lineHeight: stringifyTypographyFieldValue(normalizedValue.lineHeight),
    letterSpacing: stringifyTypographyFieldValue(normalizedValue.letterSpacing),
  };
}

export function serializeTypographyTokenFormValues(
  values: TypographyTokenFormValues,
): string {
  const nextValue: TypographyTokenValue = {};

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
''',
)

write(
    'src/features/tokens/typography-token-value.utils.test.ts',
    '''import {
  parseTypographyTokenValue,
  serializeTypographyTokenFormValues,
  createEmptyTypographyTokenFormValues,
} from './typography-token-value.utils';
import { describe, expect, it } from 'vitest';
import { validateTokenValueForType } from './token-value-validation.utils';

describe('typography-token-value utils', () => {
  it('returns empty form values', () => {
    expect(createEmptyTypographyTokenFormValues()).toEqual({
      fontFamily: '',
      fontSize: '',
      fontWeight: '',
      lineHeight: '',
      letterSpacing: '',
    });
  });

  it('parses a composite typography token object', () => {
    expect(
      parseTypographyTokenValue({
        fontFamily: 'Inter',
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: '1.5',
        letterSpacing: '-0.01em',
      }),
    ).toEqual({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '-0.01em',
    });
  });

  it('parses JSON-string values written by the previous typography editor', () => {
    expect(
      parseTypographyTokenValue(
        JSON.stringify({
          fontFamily: 'Inter',
          fontSize: '1rem',
          fontWeight: 600,
        }),
      ),
    ).toEqual({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: '600',
      lineHeight: '',
      letterSpacing: '',
    });
  });

  it('hydrates legacy atomic typography values using their path', () => {
    expect(
      parseTypographyTokenValue(600, 'typography.fontWeight.semibold'),
    ).toEqual({
      fontFamily: '',
      fontSize: '',
      fontWeight: '600',
      lineHeight: '',
      letterSpacing: '',
    });
  });

  it('returns empty values for unsupported legacy scalar typography', () => {
    expect(parseTypographyTokenValue('not-json', 'typography.legacy')).toEqual({
      fontFamily: '',
      fontSize: '',
      fontWeight: '',
      lineHeight: '',
      letterSpacing: '',
    });
  });

  it('serializes filled typography fields to a JSON transport value', () => {
    const serializedValue = serializeTypographyTokenFormValues({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '-0.01em',
    });

    expect(JSON.parse(serializedValue)).toEqual({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: '1.5',
      letterSpacing: '-0.01em',
    });
  });

  it('omits empty typography fields', () => {
    const serializedValue = serializeTypographyTokenFormValues({
      fontFamily: 'Inter',
      fontSize: '',
      fontWeight: '',
      lineHeight: '1.5',
      letterSpacing: '',
    });

    expect(JSON.parse(serializedValue)).toEqual({
      fontFamily: 'Inter',
      lineHeight: '1.5',
    });
  });

  it('produces a value accepted by typography token validation', () => {
    const serializedValue = serializeTypographyTokenFormValues({
      fontFamily: 'Inter',
      fontSize: '1rem',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '-0.01em',
    });

    expect(
      validateTokenValueForType({
        type: 'typography',
        value: serializedValue,
      }),
    ).toBeNull();
  });
});
''',
)

write(
    'src/features/tokens/token-value-validation.utils.ts',
    '''import { isHexColorValue } from './tokens-editor.utils';
import {
  normalizeTypographyTokenValue,
  type DesignTokenType,
} from '@/domain/design-system';

export type TokenValueValidationError =
  | 'tokenValueRequired'
  | 'tokenColorValueInvalid'
  | 'tokenSpacingValueInvalid'
  | 'tokenRadiusValueInvalid'
  | 'tokenTypographyValueInvalid'
  | 'tokenMotionValueInvalid';

const cssLengthPattern = /^-?\\d+(\\.\\d+)?(px|rem|em|%|vh|vw|vmin|vmax|ch|ex)$/;

const cssDurationPattern = /^\\d+(\\.\\d+)?(ms|s)$/;

export function validateTokenValueForType({
  type,
  value,
}: {
  type: DesignTokenType;
  value: string;
}): TokenValueValidationError | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'tokenValueRequired';
  }

  if (type === 'color') {
    return isHexColorValue(trimmedValue) ? null : 'tokenColorValueInvalid';
  }

  if (type === 'spacing') {
    return cssLengthPattern.test(trimmedValue)
      ? null
      : 'tokenSpacingValueInvalid';
  }

  if (type === 'radius') {
    return cssLengthPattern.test(trimmedValue)
      ? null
      : 'tokenRadiusValueInvalid';
  }

  if (type === 'motion') {
    return cssDurationPattern.test(trimmedValue)
      ? null
      : 'tokenMotionValueInvalid';
  }

  if (type === 'typography') {
    return normalizeTypographyTokenValue({ value: trimmedValue })
      ? null
      : 'tokenTypographyValueInvalid';
  }

  return null;
}
''',
)

replace_once(
    'src/features/tokens/create-design-token.utils.ts',
    "import type { DesignToken, DesignTokenType } from '@/domain/design-system';",
    "import {\n  normalizeTypographyTokenValue,\n  type DesignToken,\n  type DesignTokenType,\n} from '@/domain/design-system';",
)
replace_once(
    'src/features/tokens/create-design-token.utils.ts',
    "  const description: DesignToken['description'] = {};\n",
    "  const storedValue =\n    type === 'typography'\n      ? normalizeTypographyTokenValue({ value: nextValue })\n      : nextValue;\n\n  if (storedValue === null) {\n    return {\n      status: 'error',\n      error: 'tokenTypographyValueInvalid',\n    };\n  }\n\n  const description: DesignToken['description'] = {};\n",
)
replace_once(
    'src/features/tokens/create-design-token.utils.ts',
    "    value: nextValue,",
    "    value: storedValue,",
)

replace_once(
    'src/features/tokens/update-design-token-value.action.ts',
    "import type { UpdateDesignTokenValueActionState } from './update-design-token-value.state';",
    "import type { UpdateDesignTokenValueActionState } from './update-design-token-value.state';\nimport { normalizeTypographyTokenValue } from '@/domain/design-system';",
)
replace_once(
    'src/features/tokens/update-design-token-value.action.ts',
    "  const tokenIndex = parsedTokensResult.tokens.findIndex(\n",
    "  const storedValue =\n    tokenSetType === 'typography'\n      ? normalizeTypographyTokenValue({ value: values.value })\n      : values.value.trim();\n\n  if (storedValue === null) {\n    return {\n      status: 'error',\n      fieldErrors: {\n        value: ['tokenTypographyValueInvalid'],\n      },\n      formError: null,\n      values,\n    };\n  }\n\n  const tokenIndex = parsedTokensResult.tokens.findIndex(\n",
)
replace_once(
    'src/features/tokens/update-design-token-value.action.ts',
    "          value: values.value.trim(),",
    "          value: storedValue,",
)

replace_once(
    'src/features/tokens/tokens-editor.utils.ts',
    "export function formatTokenValue(value: DesignToken['value']): string {\n  return String(value);\n}",
    "export function formatTokenValue(value: DesignToken['value']): string {\n  return typeof value === 'object' && value !== null\n    ? JSON.stringify(value)\n    : String(value);\n}",
)

replace_once(
    'src/features/tokens/TypographyTokenValueEditor.tsx',
    '  initialValue: string;',
    '  initialValue: unknown;',
)
replace_once(
    'src/features/tokens/TypographyTokenValueEditor.tsx',
    "  const [state, formAction, isPending] = useActionState(\n    updateDesignTokenValueAction,\n    {\n      ...initialUpdateDesignTokenValueActionState,\n      values: {\n        value: initialValue,\n      },\n    },\n  );\n\n  const [typographyValues, setTypographyValues] =\n    useState<TypographyTokenFormValues>(() =>\n      parseTypographyTokenValue(initialValue),\n    );",
    "  const initialTypographyValues = parseTypographyTokenValue(\n    initialValue,\n    tokenPath,\n  );\n  const initialSerializedValue = hasTypographyFieldValue(initialTypographyValues)\n    ? serializeTypographyTokenFormValues(initialTypographyValues)\n    : '';\n  const [state, formAction, isPending] = useActionState(\n    updateDesignTokenValueAction,\n    {\n      ...initialUpdateDesignTokenValueActionState,\n      values: {\n        value: initialSerializedValue,\n      },\n    },\n  );\n\n  const [typographyValues, setTypographyValues] =\n    useState<TypographyTokenFormValues>(() => initialTypographyValues);",
)
replace_once(
    'src/features/tokens/TypographyTokenValueEditor.tsx',
    '    initialSavedFingerprint: initialValue,',
    '    initialSavedFingerprint: initialSerializedValue,',
)

write(
    'src/features/tokens/delete-token.state.ts',
    '''export type DeleteTokenDependencyKind = 'token' | 'theme' | 'component';

export type DeleteTokenDependency = {
  kind: DeleteTokenDependencyKind;
  label: string;
};

export type DeleteTokenFormError =
  | 'unauthorized'
  | 'projectNotFound'
  | 'tokenSetNotFound'
  | 'tokenSetMalformed'
  | 'tokenNotFound'
  | 'tokenInUse'
  | 'tokenValidationFailed'
  | 'unexpected';

export type DeleteTokenActionState = {
  status: 'idle' | 'error' | 'success';
  formError: DeleteTokenFormError | null;
  dependencies: DeleteTokenDependency[];
  deletedTokenPath: string | null;
};

export const initialDeleteTokenActionState: DeleteTokenActionState = {
  status: 'idle',
  formError: null,
  dependencies: [],
  deletedTokenPath: null,
};
''',
)

write(
    'src/features/tokens/delete-token.utils.ts',
    '''import { componentContractSchema, designTokenSchema } from '@/domain/design-system';
import { pathToTokenReference } from '@/domain/design-system';
import type { DesignToken } from '@/domain/design-system';
import type { DeleteTokenDependency } from './delete-token.state';

export type DeleteTokenResult =
  | {
      status: 'success';
      tokens: DesignToken[];
    }
  | {
      status: 'error';
      error: 'tokenNotFound';
    };

function parseTokenArray(tokens: unknown): DesignToken[] {
  if (!Array.isArray(tokens)) {
    return [];
  }

  return tokens.flatMap((token) => {
    const parsedToken = designTokenSchema.safeParse(token);

    return parsedToken.success ? [parsedToken.data] : [];
  });
}

function collectReferenceLocations({
  value,
  reference,
  path = [],
}: {
  value: unknown;
  reference: string;
  path?: string[];
}): string[] {
  if (value === reference) {
    return [path.join('.') || 'root'];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectReferenceLocations({
        value: item,
        reference,
        path: [...path, String(index)],
      }),
    );
  }

  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, nestedValue]) =>
      collectReferenceLocations({
        value: nestedValue,
        reference,
        path: [...path, key],
      }),
    );
  }

  return [];
}

export function findTokenDependencies({
  tokenPath,
  tokenSets,
  themes,
  componentContracts,
}: {
  tokenPath: string;
  tokenSets: Array<{ tokens: unknown }>;
  themes: Array<{ name: string; tokens: unknown }>;
  componentContracts: Array<{ name: string; contract: unknown }>;
}): DeleteTokenDependency[] {
  const reference = pathToTokenReference(tokenPath);
  const dependencies: DeleteTokenDependency[] = [];

  for (const tokenSet of tokenSets) {
    for (const token of parseTokenArray(tokenSet.tokens)) {
      if (token.path === tokenPath) {
        continue;
      }

      if (token.reference === reference || token.value === reference) {
        dependencies.push({
          kind: 'token',
          label: token.path,
        });
      }
    }
  }

  for (const theme of themes) {
    for (const location of collectReferenceLocations({
      value: theme.tokens,
      reference,
    })) {
      dependencies.push({
        kind: 'theme',
        label: `${theme.name} · ${location}`,
      });
    }
  }

  for (const component of componentContracts) {
    const parsedContract = componentContractSchema.safeParse(component.contract);

    if (!parsedContract.success) {
      continue;
    }

    for (const binding of parsedContract.data.tokenBindings) {
      if (binding.tokenPath === tokenPath) {
        dependencies.push({
          kind: 'component',
          label: `${component.name} · ${binding.key}`,
        });
      }
    }
  }

  return dependencies;
}

export function removeTokenByPath({
  tokens,
  tokenPath,
}: {
  tokens: DesignToken[];
  tokenPath: string;
}): DeleteTokenResult {
  if (!tokens.some((token) => token.path === tokenPath)) {
    return {
      status: 'error',
      error: 'tokenNotFound',
    };
  }

  return {
    status: 'success',
    tokens: tokens.filter((token) => token.path !== tokenPath),
  };
}
''',
)

write(
    'src/features/tokens/delete-token.utils.test.ts',
    '''import { describe, expect, it } from 'vitest';
import type { DesignToken } from '@/domain/design-system';
import { findTokenDependencies, removeTokenByPath } from './delete-token.utils';

const tokens: DesignToken[] = [
  {
    path: 'color.primitive.blue.500',
    type: 'color',
    value: '#2563eb',
    status: 'ready',
  },
  {
    path: 'color.semantic.action.primary',
    type: 'color',
    value: '{color.primitive.blue.500}',
    reference: '{color.primitive.blue.500}',
    status: 'ready',
  },
];

describe('delete-token utils', () => {
  it('removes an unreferenced token', () => {
    const result = removeTokenByPath({
      tokens,
      tokenPath: 'color.semantic.action.primary',
    });

    expect(result).toEqual({
      status: 'success',
      tokens: [tokens[0]],
    });
  });

  it('returns tokenNotFound for an unknown path', () => {
    expect(
      removeTokenByPath({ tokens, tokenPath: 'color.primitive.missing' }),
    ).toEqual({
      status: 'error',
      error: 'tokenNotFound',
    });
  });

  it('finds token, theme and component dependencies', () => {
    const dependencies = findTokenDependencies({
      tokenPath: 'color.primitive.blue.500',
      tokenSets: [{ tokens }],
      themes: [
        {
          name: 'Light',
          tokens: {
            color: {
              accent: '{color.primitive.blue.500}',
            },
          },
        },
      ],
      componentContracts: [
        {
          name: 'Button',
          contract: {
            type: 'button',
            name: 'Button',
            purpose: { en: 'Triggers an action.' },
            tokenBindings: [
              {
                key: 'background',
                tokenType: 'color',
                tokenPath: 'color.primitive.blue.500',
              },
            ],
          },
        },
      ],
    });

    expect(dependencies).toEqual([
      {
        kind: 'token',
        label: 'color.semantic.action.primary',
      },
      {
        kind: 'theme',
        label: 'Light · color.accent',
      },
      {
        kind: 'component',
        label: 'Button · background',
      },
    ]);
  });
});
''',
)

write(
    'src/features/tokens/delete-token.action.ts',
    ''''use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/server/db/prisma';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
import { isTokenSetType } from './tokens-editor.utils';
import {
  parseStoredTokenSetTokens,
  saveValidatedTokenSetTokens,
} from './token-set-save.service';
import { findTokenDependencies, removeTokenByPath } from './delete-token.utils';
import type { DeleteTokenActionState } from './delete-token.state';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

export async function deleteTokenAction(
  _previousState: DeleteTokenActionState,
  formData: FormData,
): Promise<DeleteTokenActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');
  const tokenSetType = getFormStringValue(formData, 'tokenSetType');
  const tokenPath = getFormStringValue(formData, 'tokenPath');

  if (!isTokenSetType(tokenSetType)) {
    return {
      status: 'error',
      formError: 'tokenSetNotFound',
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  const project = await prisma.designSystemProject.findFirst({
    where: {
      slug: projectSlug,
      workspace: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    select: {
      tokenSets: {
        select: {
          id: true,
          type: true,
          tokens: true,
        },
      },
      themes: {
        select: {
          name: true,
          tokens: true,
        },
      },
      componentContracts: {
        select: {
          name: true,
          contract: true,
        },
      },
    },
  });

  if (!project) {
    return {
      status: 'error',
      formError: 'projectNotFound',
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  const tokenSet = project.tokenSets.find(
    (candidate) => candidate.type === tokenSetType,
  );

  if (!tokenSet) {
    return {
      status: 'error',
      formError: 'tokenSetNotFound',
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  const parsedTokensResult = parseStoredTokenSetTokens(tokenSet.tokens);

  if (parsedTokensResult.status === 'error') {
    return {
      status: 'error',
      formError: parsedTokensResult.error,
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  const removeResult = removeTokenByPath({
    tokens: parsedTokensResult.tokens,
    tokenPath,
  });

  if (removeResult.status === 'error') {
    return {
      status: 'error',
      formError: removeResult.error,
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  const dependencies = findTokenDependencies({
    tokenPath,
    tokenSets: project.tokenSets,
    themes: project.themes,
    componentContracts: project.componentContracts,
  });

  if (dependencies.length > 0) {
    return {
      status: 'error',
      formError: 'tokenInUse',
      dependencies,
      deletedTokenPath: null,
    };
  }

  const saveResult = await saveValidatedTokenSetTokens({
    tokenSetId: tokenSet.id,
    tokens: removeResult.tokens,
  });

  if (saveResult.status === 'error') {
    return {
      status: 'error',
      formError: saveResult.error,
      dependencies: [],
      deletedTokenPath: null,
    };
  }

  revalidatePath(`/${locale}/app/projects/${projectSlug}/tokens`);

  return {
    status: 'success',
    formError: null,
    dependencies: [],
    deletedTokenPath: tokenPath,
  };
}
''',
)

write(
    'src/features/tokens/DeleteTokenControl.tsx',
    ''''use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import type { TokenSetType } from './tokens-editor.utils';
import { deleteTokenAction } from './delete-token.action';
import {
  initialDeleteTokenActionState,
  type DeleteTokenDependencyKind,
  type DeleteTokenFormError,
} from './delete-token.state';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';

const copy = {
  en: {
    title: 'Delete token',
    description:
      'Remove this token permanently. Referenced tokens must be unlinked first.',
    request: 'Delete token',
    confirmationTitle: (tokenPath: string) => `Delete ${tokenPath}?`,
    confirmationDescription: 'This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete permanently',
    deleting: 'Deleting…',
    dependencyTitle: 'This token is still used by:',
    dependencyKinds: {
      token: 'Token',
      theme: 'Theme',
      component: 'Component',
    },
    errors: {
      unauthorized: 'Your session is no longer authorized.',
      projectNotFound: 'The project could not be found.',
      tokenSetNotFound: 'The token set could not be found.',
      tokenSetMalformed: 'The token set cannot be edited safely.',
      tokenNotFound: 'The token no longer exists.',
      tokenInUse: 'Remove the references below before deleting this token.',
      tokenValidationFailed: 'The token set could not be saved safely.',
      unexpected: 'The token could not be deleted. Try again.',
    },
  },
  fr: {
    title: 'Supprimer le token',
    description:
      'Supprime définitivement ce token. Les références existantes doivent d’abord être retirées.',
    request: 'Supprimer le token',
    confirmationTitle: (tokenPath: string) => `Supprimer ${tokenPath} ?`,
    confirmationDescription: 'Cette action est irréversible.',
    cancel: 'Annuler',
    delete: 'Supprimer définitivement',
    deleting: 'Suppression…',
    dependencyTitle: 'Ce token est encore utilisé par :',
    dependencyKinds: {
      token: 'Token',
      theme: 'Thème',
      component: 'Composant',
    },
    errors: {
      unauthorized: 'Votre session n’est plus autorisée.',
      projectNotFound: 'Le projet est introuvable.',
      tokenSetNotFound: 'Le groupe de tokens est introuvable.',
      tokenSetMalformed: 'Le groupe de tokens ne peut pas être modifié en sécurité.',
      tokenNotFound: 'Le token n’existe plus.',
      tokenInUse: 'Retirez les références ci-dessous avant de supprimer ce token.',
      tokenValidationFailed: 'Le groupe de tokens n’a pas pu être enregistré en sécurité.',
      unexpected: 'Le token n’a pas pu être supprimé. Réessayez.',
    },
  },
} as const;

type DeleteTokenControlProps = {
  locale: Locale;
  projectSlug: string;
  tokenPath: string;
  tokenSetType: TokenSetType;
  onDeleted: (tokenPath: string) => void;
};

export function DeleteTokenControl({
  locale,
  projectSlug,
  tokenPath,
  tokenSetType,
  onDeleted,
}: DeleteTokenControlProps) {
  const labels = copy[locale];
  const [isConfirming, setIsConfirming] = useState(false);
  const [state, formAction, isPending] = useActionState(
    deleteTokenAction,
    initialDeleteTokenActionState,
  );
  const handledDeletedPath = useRef<string | null>(null);
  const preserveSaveContext = usePreserveSaveContext(
    `delete-token:${projectSlug}:${tokenSetType}:${tokenPath}`,
  );

  useEffect(() => {
    if (
      state.status === 'success' &&
      state.deletedTokenPath &&
      handledDeletedPath.current !== state.deletedTokenPath
    ) {
      handledDeletedPath.current = state.deletedTokenPath;
      onDeleted(state.deletedTokenPath);
    }
  }, [onDeleted, state.deletedTokenPath, state.status]);

  const formError = state.formError as DeleteTokenFormError | null;

  return (
    <section className="border-border-subtle mt-4 border-t pt-4">
      <h3 className="text-action-danger text-xs font-semibold tracking-[0.16em] uppercase">
        {labels.title}
      </h3>
      <p className="text-content-secondary mt-2 text-xs leading-5">
        {labels.description}
      </p>

      {!isConfirming ? (
        <Button
          type="button"
          variant="danger"
          size="sm"
          className="mt-3"
          onClick={() => setIsConfirming(true)}
        >
          {labels.request}
        </Button>
      ) : (
        <form
          action={formAction}
          onSubmitCapture={preserveSaveContext}
          className="border-action-danger/30 bg-action-danger/5 mt-3 rounded-md border p-3"
        >
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="projectSlug" value={projectSlug} />
          <input type="hidden" name="tokenSetType" value={tokenSetType} />
          <input type="hidden" name="tokenPath" value={tokenPath} />

          <p className="text-sm font-semibold">
            {labels.confirmationTitle(tokenPath)}
          </p>
          <p className="text-content-secondary mt-1 text-xs leading-5">
            {labels.confirmationDescription}
          </p>

          {formError ? (
            <div role="alert" className="mt-3">
              <p className="text-action-danger text-xs font-semibold">
                {labels.errors[formError]}
              </p>

              {formError === 'tokenInUse' && state.dependencies.length > 0 ? (
                <div className="mt-2">
                  <p className="text-content-secondary text-xs font-semibold">
                    {labels.dependencyTitle}
                  </p>
                  <ul className="text-content-secondary mt-1 grid gap-1 text-xs">
                    {state.dependencies.map((dependency) => (
                      <li key={`${dependency.kind}:${dependency.label}`}>
                        <span className="font-semibold">
                          {
                            labels.dependencyKinds[
                              dependency.kind as DeleteTokenDependencyKind
                            ]
                          }
                        </span>{' '}
                        · <span className="font-mono">{dependency.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isPending}
              onClick={() => setIsConfirming(false)}
            >
              {labels.cancel}
            </Button>
            <Button type="submit" variant="danger" size="sm" disabled={isPending}>
              {isPending ? labels.deleting : labels.delete}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
''',
)

replace_once(
    'src/features/tokens/editor/TokenInspectorPanel.tsx',
    "import { TokenDescriptionEditor } from '../TokenDescriptionEditor';",
    "import { TokenDescriptionEditor } from '../TokenDescriptionEditor';\nimport { DeleteTokenControl } from '../DeleteTokenControl';",
)
replace_once(
    'src/features/tokens/editor/TokenInspectorPanel.tsx',
    '  onTokenValueUpdated: (tokenPath: string) => void;\n};',
    '  onTokenValueUpdated: (tokenPath: string) => void;\n  onTokenDeleted: (tokenPath: string) => void;\n};',
)
replace_once(
    'src/features/tokens/editor/TokenInspectorPanel.tsx',
    '  onTokenValueUpdated,\n}: TokenInspectorPanelProps) {',
    '  onTokenValueUpdated,\n  onTokenDeleted,\n}: TokenInspectorPanelProps) {',
)
replace_once(
    'src/features/tokens/editor/TokenInspectorPanel.tsx',
    '              initialValue={token.value}',
    '              initialValue={token.rawValue}',
)
replace_once(
    'src/features/tokens/editor/TokenInspectorPanel.tsx',
    "        <div className=\"mt-4\">\n          <p className=\"text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase\">\n            {labels.description}\n          </p>\n\n          <TokenDescriptionEditor\n            key={`${token.type}:${token.path}`}\n            locale={locale}\n            projectSlug={projectSlug}\n            tokenSetType={tokenSetType}\n            tokenPath={token.path}\n            initialDescriptionEn={token.description?.en ?? ''}\n            initialDescriptionFr={token.description?.fr ?? ''}\n          />\n        </div>\n",
    "        <div className=\"mt-4\">\n          <p className=\"text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase\">\n            {labels.description}\n          </p>\n\n          <TokenDescriptionEditor\n            key={`${token.type}:${token.path}`}\n            locale={locale}\n            projectSlug={projectSlug}\n            tokenSetType={tokenSetType}\n            tokenPath={token.path}\n            initialDescriptionEn={token.description?.en ?? ''}\n            initialDescriptionFr={token.description?.fr ?? ''}\n          />\n        </div>\n\n        <DeleteTokenControl\n          key={`delete:${tokenSetType}:${token.path}`}\n          locale={locale}\n          projectSlug={projectSlug}\n          tokenPath={token.path}\n          tokenSetType={tokenSetType}\n          onDeleted={onTokenDeleted}\n        />\n",
)

replace_once(
    'src/features/tokens/editor/tokens-editor-shell.utils.ts',
    "export function createTokenEditorUrl({",
    "export function resolveSelectedToken({\n  activeRows,\n  filteredRows,\n  selectedTokenPath,\n}: {\n  activeRows: TokenRowData[];\n  filteredRows: TokenRowData[];\n  selectedTokenPath: string | null;\n}) {\n  return (\n    activeRows.find((row) => row.path === selectedTokenPath) ??\n    filteredRows[0] ??\n    activeRows[0] ??\n    null\n  );\n}\n\nexport function getNextSelectedTokenPathAfterDeletion({\n  rows,\n  deletedTokenPath,\n  query,\n}: {\n  rows: TokenRowData[];\n  deletedTokenPath: string;\n  query: string;\n}) {\n  const deletedIndex = rows.findIndex((row) => row.path === deletedTokenPath);\n  const remainingRows = rows.filter((row) => row.path !== deletedTokenPath);\n\n  if (remainingRows.length === 0) {\n    return null;\n  }\n\n  const filteredRemainingRows = filterTokenRows({\n    rows: remainingRows,\n    query,\n  });\n\n  if (filteredRemainingRows.length > 0) {\n    return filteredRemainingRows[\n      Math.min(Math.max(deletedIndex, 0), filteredRemainingRows.length - 1)\n    ]?.path ?? null;\n  }\n\n  return remainingRows[\n    Math.min(Math.max(deletedIndex, 0), remainingRows.length - 1)\n  ]?.path ?? null;\n}\n\nexport function createTokenEditorUrl({",
)

write(
    'src/features/tokens/editor/tokens-editor-shell.utils.test.ts',
    '''import { describe, expect, it } from 'vitest';
import type { TokenRowData } from '../tokens-editor.utils';
import {
  getNextSelectedTokenPathAfterDeletion,
  resolveSelectedToken,
} from './tokens-editor-shell.utils';

function createRow(path: string, value: string): TokenRowData {
  return {
    id: path,
    path,
    type: 'spacing',
    value,
    rawValue: value,
    isColorValue: false,
    validationStatus: 'valid',
    errorMessages: [],
  };
}

const rows = [
  createRow('spacing.1', '0.25rem'),
  createRow('spacing.2', '0.5rem'),
  createRow('spacing.4', '1rem'),
];

describe('tokens editor selection', () => {
  it('keeps the explicitly selected token even when a search no longer matches it', () => {
    expect(
      resolveSelectedToken({
        activeRows: rows,
        filteredRows: [rows[0]!],
        selectedTokenPath: 'spacing.4',
      })?.path,
    ).toBe('spacing.4');
  });

  it('selects a stable neighboring token after deletion', () => {
    expect(
      getNextSelectedTokenPathAfterDeletion({
        rows,
        deletedTokenPath: 'spacing.2',
        query: '',
      }),
    ).toBe('spacing.4');
  });

  it('returns null after deleting the final token', () => {
    expect(
      getNextSelectedTokenPathAfterDeletion({
        rows: [rows[0]!],
        deletedTokenPath: 'spacing.1',
        query: '',
      }),
    ).toBeNull();
  });
});
''',
)

replace_once(
    'src/features/tokens/editor/TokensEditorShell.tsx',
    "  filterTokenRows,\n  createTokenEditorUrl,\n} from './tokens-editor-shell.utils';",
    "  filterTokenRows,\n  createTokenEditorUrl,\n  getNextSelectedTokenPathAfterDeletion,\n  resolveSelectedToken,\n} from './tokens-editor-shell.utils';",
)
replace_once(
    'src/features/tokens/editor/TokensEditorShell.tsx',
    "  const selectedToken =\n    filteredTokenRows.find((row) => row.path === selectedTokenPath) ??\n    filteredTokenRows[0] ??\n    activeTokenSet?.rows[0] ??\n    null;",
    "  const selectedToken = resolveSelectedToken({\n    activeRows: activeTokenSet?.rows ?? [],\n    filteredRows: filteredTokenRows,\n    selectedTokenPath,\n  });",
)
replace_once(
    'src/features/tokens/editor/TokensEditorShell.tsx',
    "  function handleTokenValueUpdated(tokenPath: string) {\n    setSelectedTokenPath(tokenPath);\n\n    updateUrl({\n      set: activeTokenSetType,\n      token: tokenPath,\n      q: tokenSearchQuery,\n    });\n  }\n",
    "  function handleTokenValueUpdated(tokenPath: string) {\n    setSelectedTokenPath(tokenPath);\n\n    updateUrl({\n      set: activeTokenSetType,\n      token: tokenPath,\n      q: tokenSearchQuery,\n    });\n  }\n\n  function handleTokenDeleted(tokenPath: string) {\n    const nextTokenPath = getNextSelectedTokenPathAfterDeletion({\n      rows: activeTokenSet?.rows ?? [],\n      deletedTokenPath: tokenPath,\n      query: tokenSearchQuery,\n    });\n\n    setSelectedTokenPath(nextTokenPath);\n    updateUrl({\n      set: activeTokenSetType,\n      token: nextTokenPath,\n      q: tokenSearchQuery,\n    });\n  }\n",
)
replace_once(
    'src/features/tokens/editor/TokensEditorShell.tsx',
    "          onTokenValueUpdated={handleTokenValueUpdated}\n        />",
    "          onTokenValueUpdated={handleTokenValueUpdated}\n          onTokenDeleted={handleTokenDeleted}\n        />",
)

replace_once(
    'src/domain/exports/css-variables-export.ts',
    "function createCssFileName(projectName: string): string {",
    "function flattenCssTokenValue({\n  path,\n  value,\n}: {\n  path: string;\n  value: DesignToken['value'];\n}): Array<{ path: string; value: string }> {\n  const primitiveValue = stringifyCssValue(value);\n\n  if (primitiveValue !== null) {\n    return [{ path, value: primitiveValue }];\n  }\n\n  if (typeof value !== 'object' || value === null || Array.isArray(value)) {\n    return [];\n  }\n\n  return Object.entries(value).flatMap(([key, nestedValue]) => {\n    const stringValue = stringifyCssValue(nestedValue);\n\n    return stringValue === null\n      ? []\n      : [{ path: `${path}.${key}`, value: stringValue }];\n  });\n}\n\nfunction createCssFileName(projectName: string): string {",
)
replace_once(
    'src/domain/exports/css-variables-export.ts',
    "    const value = stringifyCssValue(resolvedToken.resolvedValue);\n\n    if (!value) {\n      skippedTokens.push({\n        path: sourceToken.path,\n        reason: 'unsupportedValue',\n      });\n\n      return [];\n    }\n\n    return [\n      {\n        path: resolvedToken.path,\n        name: tokenPathToCssVariableName(resolvedToken.path),\n        value,\n        scope: ':root' as const,\n      },\n    ];",
    "    const flattenedValues = flattenCssTokenValue({\n      path: resolvedToken.path,\n      value: resolvedToken.resolvedValue,\n    });\n\n    if (flattenedValues.length === 0) {\n      skippedTokens.push({\n        path: sourceToken.path,\n        reason: 'unsupportedValue',\n      });\n\n      return [];\n    }\n\n    return flattenedValues.map((flattenedValue) => ({\n      path: flattenedValue.path,\n      name: tokenPathToCssVariableName(flattenedValue.path),\n      value: flattenedValue.value,\n      scope: ':root' as const,\n    }));",
)
replace_once(
    'src/domain/exports/css-variables-export.test.ts',
    "  {\n    path: 'typography.fontWeight.semibold',\n    type: 'typography',\n    value: 600,\n    status: 'ready',\n  },",
    "  {\n    path: 'typography.body.base',\n    type: 'typography',\n    value: {\n      fontFamily: 'Inter',\n      fontSize: '1rem',\n      fontWeight: 600,\n      lineHeight: '1.5',\n      letterSpacing: '-0.01em',\n    },\n    status: 'ready',\n  },",
)
replace_once(
    'src/domain/exports/css-variables-export.test.ts',
    "    expect(tokenPathToCssVariableName('typography.fontWeight.semibold')).toBe(\n      '--typography-font-weight-semibold',\n    );",
    "    expect(tokenPathToCssVariableName('typography.body.base.fontWeight')).toBe(\n      '--typography-body-base-font-weight',\n    );",
)
replace_once(
    'src/domain/exports/css-variables-export.test.ts',
    "    expect(result.content).toContain('--typography-font-weight-semibold: 600;');",
    "    expect(result.content).toContain('--typography-body-base-font-family: Inter;');\n    expect(result.content).toContain('--typography-body-base-font-size: 1rem;');\n    expect(result.content).toContain('--typography-body-base-font-weight: 600;');\n    expect(result.content).toContain('--typography-body-base-line-height: 1.5;');\n    expect(result.content).toContain(\n      '--typography-body-base-letter-spacing: -0.01em;',\n    );",
)

replace_once(
    'src/app/globals.css',
    "  --font-sans: var(--font-inter-tight);\n  --font-mono: var(--font-jetbrains-mono);",
    "  --font-sans: var(--font-inter-tight);\n  --font-display: var(--font-fraunces);\n  --font-mono: var(--font-jetbrains-mono);",
)
replace_once(
    'src/app/globals.css',
    '    font-family: var(--font-inter-tight), system-ui, sans-serif;',
    '    font-family: var(--font-sans);',
)

for path in [
    'src/components/layout/AuthShell.tsx',
    'src/features/legal/LegalDocumentPage.tsx',
    'src/app/[locale]/(public)/(marketing)/page.tsx',
    'src/app/[locale]/(public)/(marketing)/pricing/page.tsx',
]:
    replace_all(
        path,
        'font-[family-name:var(--font-fraunces)]',
        'font-display',
    )

write(
    'docs/product/ds-170-08a-token-editor-reliability.md',
    '''# DS-170-08A — Token editor reliability and typography consistency

## Status

Implementation complete on `feature/ds-170-08a-token-editor-reliability`. Automated Quality and manual product QA remain required before the draft pull request can be marked ready.

## Objective

Resolve the token-authoring defects found during the final DS-170 product journey before the large refactor:

- tokens can be deleted safely;
- typography tokens edit and preview reliably;
- saving a token does not unexpectedly switch the inspector to another token;
- application typography uses semantic CSS/Tailwind font roles instead of arbitrary family expressions.

## Product decisions

### Composite typography values

A typography token represents a style object rather than one isolated scalar. The supported properties are:

- `fontFamily`;
- `fontSize`;
- `fontWeight`;
- `lineHeight`;
- `letterSpacing`.

The domain schema now normalizes two legacy storage shapes when reading existing projects:

1. JSON strings written by the previous typography editor are parsed into real objects;
2. legacy atomic seed paths such as `typography.fontWeight.semibold` are converted into a one-property composite object based on their path.

Any subsequent save of that token set persists normalized object values because token-set writes validate and serialize the parsed domain representation.

### Typography preview and exports

The token preview consumes the normalized object directly, so the sample can apply the actual family, size, weight, line height and letter spacing.

CSS-variable export flattens composite typography properties into stable custom properties such as:

```css
--typography-body-base-font-family: Inter;
--typography-body-base-font-size: 1rem;
--typography-body-base-font-weight: 600;
```

Tailwind v4 and TypeScript theme exports inherit that flattened representation from the shared CSS-variable export pipeline.

### Safe deletion

The inspector exposes a destructive token action with an explicit confirmation step.

Deletion is blocked when the target is still referenced by:

- another token alias/reference;
- a Theme token mapping;
- a ComponentContract token binding.

The UI surfaces the dependencies that must be removed first instead of silently cascading or leaving broken references.

An authored token set is allowed to become empty; the editor already has a valid empty-state authoring flow.

### Stable inspector selection

Selection is now resolved against the complete active token set before filtered search results. Saving a value or description that causes the current token to stop matching the search therefore keeps the inspector on the token the user was editing.

After deletion, selection moves deterministically to a remaining token or to the empty state.

### Semantic application fonts

The application font roles are:

- `font-sans` → Inter Tight;
- `font-display` → Fraunces;
- `font-mono` → JetBrains Mono.

Public/auth/legal surfaces now use `font-display` instead of arbitrary `font-[family-name:...]` expressions, and the base body uses the semantic `--font-sans` role.

Hard-coded font stacks in generated/testing documents or HTML email markup are intentional external-format exceptions because those surfaces cannot rely on the application Tailwind runtime or its CSS variables.

## Automated coverage

Focused regression coverage verifies:

- composite typography schema parsing;
- backward normalization of JSON-string and atomic typography values;
- typography form hydration and serialization;
- empty token-set validity;
- token deletion and dependency discovery;
- selected-token stability across filtering and deletion;
- flattened typography CSS variables.

The repository Quality workflow remains the final merge gate for lint, strict TypeScript, formatting, UI audit, tests and production build.

## Manual QA checklist

- [ ] Open an existing project created before DS-170-08A and verify the seeded typography tokens populate the appropriate editor fields instead of showing empty inputs.
- [ ] Create a new composite typography token, save it, reselect it and verify every authored field persists.
- [ ] Verify the typography preview reflects font family, size, weight, line height and letter spacing after saving.
- [ ] Edit spacing, radius, motion, typography values and token descriptions while a search is active; confirm saving never jumps to a different token solely because the edited token no longer matches the search.
- [ ] Delete an unreferenced token and verify the nearest remaining token stays selected.
- [ ] Delete the final token in a set and verify the editor reaches a valid empty state and still allows creating a new token.
- [ ] Attempt to delete a referenced primitive color token and verify deletion is blocked with its token/theme/component dependencies listed.
- [ ] Remove those dependencies, retry deletion and verify it succeeds.
- [ ] Verify public Home, Pricing, Login/Signup and Terms/Privacy retain their intended Fraunces display typography in light/dark and responsive layouts.
- [ ] Verify technical/code text still uses JetBrains Mono and ordinary UI text still uses Inter Tight.

## Deferred

- automatic cascade deletion of token dependencies is deliberately excluded;
- arbitrary migration that tries to merge unknown legacy atomic typography tokens into invented full styles is deliberately excluded;
- the full DS-170-08 journey remains the final end-to-end verification after this reliability slice.
''',
)

print('DS-170-08A patch applied.')
