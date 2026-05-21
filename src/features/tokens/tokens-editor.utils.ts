import { z } from 'zod';
import { designTokenSchema, type DesignToken } from '@/domain/design-system';

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
  return String(value);
}

export function isHexColorValue(value: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$/.test(value);
}
