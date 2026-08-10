import { z } from 'zod';
import { zodErrorToLocalizedIssues } from '@/domain/design-system';
import { designTokenSchema, type DesignToken } from '@/domain/design-system';
import {
  pathToTokenReference,
  tokenReferenceToPath,
} from '@/domain/design-system';

export const tokenSetTypes = [
  'color',
  'spacing',
  'radius',
  'typography',
  'motion',
] as const;

export type TokenSetType = (typeof tokenSetTypes)[number];

export type ParsedTokenSetTokens = {
  tokens: DesignToken[];
  isValid: boolean;
};

const designTokenArraySchema = z.array(designTokenSchema);

export function isTokenSetType(value: string): value is TokenSetType {
  return tokenSetTypes.includes(value as TokenSetType);
}

export function getActiveTokenSetType(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;

  return candidate && isTokenSetType(candidate) ? candidate : 'color';
}

export function sortTokenSetsByType<T extends { type: TokenSetType }>(
  tokenSets: T[],
): T[] {
  return [...tokenSets].sort(
    (firstTokenSet, secondTokenSet) =>
      tokenSetTypes.indexOf(firstTokenSet.type) -
      tokenSetTypes.indexOf(secondTokenSet.type),
  );
}

export function parseTokenSetTokens(tokens: unknown): ParsedTokenSetTokens {
  const result = designTokenArraySchema.safeParse(tokens);

  if (!result.success) {
    return {
      tokens: [],
      isValid: false,
    };
  }

  return {
    tokens: result.data,
    isValid: true,
  };
}

export function formatTokenValue(value: DesignToken['value']): string {
  return typeof value === 'object' && value !== null
    ? JSON.stringify(value)
    : String(value);
}

export function isHexColorValue(value: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
}

export type TokenRowValidationStatus = 'valid' | 'invalid';

export type TokenRowData = {
  id: string;
  path: string;
  type: string;
  value: string;
  rawValue: unknown;
  reference?: string;
  description?: DesignToken['description'];
  isColorValue: boolean;
  validationStatus: TokenRowValidationStatus;
  errorMessages: string[];
};

export type TokenRowsResult = {
  rows: TokenRowData[];
  isReadable: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getRecordStringValue(
  record: Record<string, unknown>,
  key: string,
  fallback: string,
): string {
  const value = record[key];

  return typeof value === 'string' && value.trim().length > 0
    ? value
    : fallback;
}

export function createTokenRows(tokens: unknown): TokenRowsResult {
  if (!Array.isArray(tokens)) {
    return {
      rows: [],
      isReadable: false,
    };
  }

  return {
    isReadable: true,
    rows: tokens.map((token, index) => {
      const parsedToken = designTokenSchema.safeParse(token);

      if (parsedToken.success) {
        const value = formatTokenValue(parsedToken.data.value);

        const row: TokenRowData = {
          id: parsedToken.data.path,
          path: parsedToken.data.path,
          type: parsedToken.data.type,
          value,
          rawValue: parsedToken.data.value,
          isColorValue:
            parsedToken.data.type === 'color' && isHexColorValue(value),
          validationStatus: 'valid',
          errorMessages: [],
        };

        if (parsedToken.data.reference) {
          row.reference = parsedToken.data.reference;
        }

        if (parsedToken.data.description) {
          row.description = parsedToken.data.description;
        }

        return row;
      }

      const fallbackRecord = isRecord(token) ? token : {};
      const fallbackValue = fallbackRecord.value;

      return {
        id: `invalid-token-${index + 1}`,
        path: getRecordStringValue(
          fallbackRecord,
          'path',
          `invalid-token-${index + 1}`,
        ),
        type: getRecordStringValue(fallbackRecord, 'type', 'unknown'),
        value:
          typeof fallbackValue === 'string' ||
          typeof fallbackValue === 'number' ||
          typeof fallbackValue === 'boolean'
            ? String(fallbackValue)
            : '—',
        rawValue: fallbackValue,
        isColorValue:
          typeof fallbackValue === 'string' && isHexColorValue(fallbackValue),
        validationStatus: 'invalid',
        errorMessages: zodErrorToLocalizedIssues(parsedToken.error).map(
          (issue) =>
            issue.path
              ? `${issue.path}: ${issue.messageKey}`
              : issue.messageKey,
        ),
      };
    }),
  };
}

export function isPrimitiveColorTokenPath(path: string): boolean {
  return path.startsWith('color.primitive.');
}

export function isEditablePrimitiveColorTokenRow(row: TokenRowData): boolean {
  return (
    row.validationStatus === 'valid' &&
    row.type === 'color' &&
    typeof row.rawValue === 'string' &&
    isPrimitiveColorTokenPath(row.path)
  );
}

export type PrimitiveColorTokenAliasOption = {
  path: string;
  value: string;
  label: string;
};

export function isSemanticColorTokenPath(path: string): boolean {
  return path.startsWith('color.semantic.');
}

export function isEditableSemanticColorTokenRow(row: TokenRowData): boolean {
  return (
    row.validationStatus === 'valid' &&
    row.type === 'color' &&
    isSemanticColorTokenPath(row.path)
  );
}

export function getPrimitiveColorTokenAliasOptions(
  rows: TokenRowData[],
): PrimitiveColorTokenAliasOption[] {
  return rows
    .filter(
      (row) =>
        row.validationStatus === 'valid' &&
        row.type === 'color' &&
        isPrimitiveColorTokenPath(row.path) &&
        typeof row.rawValue === 'string' &&
        isHexColorValue(row.rawValue),
    )
    .map((row) => ({
      path: row.path,
      value: row.value,
      label: row.path,
    }));
}

export function getResolvedColorValueForReference({
  reference,
  primitiveOptions,
}: {
  reference: string;
  primitiveOptions: PrimitiveColorTokenAliasOption[];
}): string | null {
  const referencedPath = tokenReferenceToPath(reference) ?? reference;

  return (
    primitiveOptions.find((option) => option.path === referencedPath)?.value ??
    null
  );
}

export { pathToTokenReference, tokenReferenceToPath };
