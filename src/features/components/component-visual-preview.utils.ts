import type { CSSProperties } from 'react';
import {
  createTokenDictionary,
  parseComponentTokenSets,
  resolveDesignToken,
  type ComponentVisualProperties,
  type DesignToken,
  type DesignTokenValue,
  type TypographyTokenValue,
} from '@/domain/design-system';

export type RawComponentTokenSet = {
  type: string;
  name: string;
  tokens: unknown;
};

type TokenResolver = (
  tokenType: DesignToken['type'],
  path: string,
) => DesignTokenValue | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createTokenResolver(
  rawTokenSets: RawComponentTokenSet[],
): TokenResolver {
  const parsedTokenSets = parseComponentTokenSets(rawTokenSets).tokenSets;
  const tokens = parsedTokenSets.flatMap((tokenSet) => tokenSet.tokens);
  const dictionary = createTokenDictionary(tokens);
  const tokenByPath = new Map(tokens.map((token) => [token.path, token]));

  return (tokenType, path) => {
    const token = tokenByPath.get(path);

    if (!token || token.type !== tokenType) {
      return undefined;
    }

    const resolution = resolveDesignToken({ token, dictionary });

    return resolution.isResolved ? resolution.resolvedValue : token.value;
  };
}

function resolvePrimitiveDesignValue(
  value: unknown,
  resolveToken: TokenResolver,
): string | number | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  if (
    value.source === 'token' &&
    typeof value.tokenType === 'string' &&
    typeof value.path === 'string'
  ) {
    const resolved = resolveToken(
      value.tokenType as DesignToken['type'],
      value.path,
    );

    return typeof resolved === 'string' || typeof resolved === 'number'
      ? resolved
      : undefined;
  }

  if (value.source === 'value') {
    return typeof value.value === 'string' || typeof value.value === 'number'
      ? value.value
      : undefined;
  }

  if (value.source === 'mode') {
    return value.value === 'fill'
      ? '100%'
      : value.value === 'auto'
        ? 'auto'
        : undefined;
  }

  return undefined;
}

function resolveStringDesignValue(
  value: unknown,
  resolveToken: TokenResolver,
): string | undefined {
  const resolved = resolvePrimitiveDesignValue(value, resolveToken);
  return typeof resolved === 'string' ? resolved : undefined;
}

function resolveTypographyDesignValue(
  value: ComponentVisualProperties['typography'],
  resolveToken: TokenResolver,
): TypographyTokenValue | undefined {
  if (!value) {
    return undefined;
  }

  if (value.source === 'token') {
    const resolved = resolveToken('typography', value.path);
    return isRecord(resolved) ? (resolved as TypographyTokenValue) : undefined;
  }

  return value.value;
}

function elevationToBoxShadow(value: string | number | undefined) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const shadows: Record<string, string> = {
    none: 'none',
    sm: '0 1px 2px rgb(0 0 0 / 0.08)',
    md: '0 4px 10px rgb(0 0 0 / 0.12)',
    lg: '0 10px 24px rgb(0 0 0 / 0.16)',
    xl: '0 18px 40px rgb(0 0 0 / 0.2)',
  };

  return shadows[value];
}

export function createComponentVisualCssProperties({
  visual,
  rawTokenSets,
}: {
  visual: ComponentVisualProperties;
  rawTokenSets: RawComponentTokenSet[];
}): CSSProperties {
  const resolveToken = createTokenResolver(rawTokenSets);
  const dimensions = visual.dimensions;
  const spacing = visual.spacing;
  const border = visual.border;
  const radius = visual.radius;
  const surface = visual.surface;
  const typography = resolveTypographyDesignValue(
    visual.typography,
    resolveToken,
  );
  const layout = visual.layout;

  return {
    width: resolvePrimitiveDesignValue(dimensions?.width, resolveToken),
    minWidth: resolvePrimitiveDesignValue(dimensions?.minWidth, resolveToken),
    maxWidth: resolvePrimitiveDesignValue(dimensions?.maxWidth, resolveToken),
    height: resolvePrimitiveDesignValue(dimensions?.height, resolveToken),
    minHeight: resolvePrimitiveDesignValue(dimensions?.minHeight, resolveToken),
    maxHeight: resolvePrimitiveDesignValue(dimensions?.maxHeight, resolveToken),
    padding: resolvePrimitiveDesignValue(spacing?.padding, resolveToken),
    paddingInline: resolvePrimitiveDesignValue(spacing?.paddingX, resolveToken),
    paddingBlock: resolvePrimitiveDesignValue(spacing?.paddingY, resolveToken),
    paddingTop: resolvePrimitiveDesignValue(spacing?.paddingTop, resolveToken),
    paddingRight: resolvePrimitiveDesignValue(
      spacing?.paddingRight,
      resolveToken,
    ),
    paddingBottom: resolvePrimitiveDesignValue(
      spacing?.paddingBottom,
      resolveToken,
    ),
    paddingLeft: resolvePrimitiveDesignValue(
      spacing?.paddingLeft,
      resolveToken,
    ),
    gap: resolvePrimitiveDesignValue(spacing?.gap, resolveToken),
    borderWidth: resolvePrimitiveDesignValue(border?.width, resolveToken),
    borderTopWidth: resolvePrimitiveDesignValue(border?.topWidth, resolveToken),
    borderRightWidth: resolvePrimitiveDesignValue(
      border?.rightWidth,
      resolveToken,
    ),
    borderBottomWidth: resolvePrimitiveDesignValue(
      border?.bottomWidth,
      resolveToken,
    ),
    borderLeftWidth: resolvePrimitiveDesignValue(
      border?.leftWidth,
      resolveToken,
    ),
    borderStyle: border?.style,
    borderColor: resolveStringDesignValue(border?.color, resolveToken),
    borderRadius: resolvePrimitiveDesignValue(radius?.radius, resolveToken),
    borderTopLeftRadius: resolvePrimitiveDesignValue(
      radius?.topLeft,
      resolveToken,
    ),
    borderTopRightRadius: resolvePrimitiveDesignValue(
      radius?.topRight,
      resolveToken,
    ),
    borderBottomRightRadius: resolvePrimitiveDesignValue(
      radius?.bottomRight,
      resolveToken,
    ),
    borderBottomLeftRadius: resolvePrimitiveDesignValue(
      radius?.bottomLeft,
      resolveToken,
    ),
    backgroundColor: resolveStringDesignValue(
      surface?.background,
      resolveToken,
    ),
    color: resolveStringDesignValue(surface?.foreground, resolveToken),
    boxShadow: elevationToBoxShadow(
      resolvePrimitiveDesignValue(surface?.elevation, resolveToken),
    ),
    fontFamily: typography?.fontFamily,
    fontSize: typography?.fontSize,
    fontWeight: typography?.fontWeight,
    lineHeight: typography?.lineHeight,
    letterSpacing: typography?.letterSpacing,
    textAlign:
      visual.typography?.source === 'value'
        ? visual.typography.value.textAlign
        : undefined,
    display: layout ? 'inline-flex' : undefined,
    flexDirection: layout?.direction,
    alignItems:
      layout?.alignment === 'start'
        ? 'flex-start'
        : layout?.alignment === 'end'
          ? 'flex-end'
          : layout?.alignment,
    justifyContent:
      layout?.justification === 'start'
        ? 'flex-start'
        : layout?.justification === 'end'
          ? 'flex-end'
          : layout?.justification === 'spaceBetween'
            ? 'space-between'
            : layout?.justification === 'spaceAround'
              ? 'space-around'
              : layout?.justification,
    flexWrap: layout?.wrap,
    overflowX: visual.overflow?.x === 'clip' ? 'hidden' : visual.overflow?.x,
    overflowY: visual.overflow?.y === 'clip' ? 'hidden' : visual.overflow?.y,
  };
}
