import {
  isHexColorValue,
  getResolvedColorValueForReference,
  type TokenRowData,
  type TokenSetType,
  type PrimitiveColorTokenAliasOption,
} from '../tokens-editor.utils';
import type { CSSProperties } from 'react';

export type TokenPreviewPanelLabels = {
  title: string;
  empty: string;
  sample: string;
  value: string;
  reference: string;
  resolvedValue: string;
  unresolved: string;
};

type TokenPreviewPanelProps = {
  token: TokenRowData | null;
  tokenSetType: TokenSetType;
  tokenSetLabel: string;
  primitiveColorAliasOptions: PrimitiveColorTokenAliasOption[];
  labels: TokenPreviewPanelLabels;
};

const bundledFontFamilyVariables: Record<string, string> = {
  inter: '--font-inter-tight',
  'inter tight': '--font-inter-tight',
  fraunces: '--font-fraunces',
  'jetbrains mono': '--font-jetbrains-mono',
};

export function TokenPreviewPanel({
  token,
  tokenSetType,
  tokenSetLabel,
  primitiveColorAliasOptions,
  labels,
}: TokenPreviewPanelProps) {
  if (!token) {
    return (
      <aside className="border-border-subtle flex h-76 min-h-0 flex-col overflow-hidden border-b">
        <header className="border-border-subtle shrink-0 border-b px-4 py-3">
          <p className="text-content-tertiary text-[11px] font-semibold tracking-[0.16em] uppercase">
            {labels.title}
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <p className="text-content-secondary text-sm leading-6">
            {labels.empty}
          </p>
        </div>
      </aside>
    );
  }

  const resolvedColorValue =
    token.type === 'color'
      ? getResolvedColorValue({
          token,
          primitiveColorAliasOptions,
        })
      : null;

  return (
    <aside className="border-border-subtle flex h-76 min-h-0 flex-col overflow-hidden border-b">
      <header className="border-border-subtle flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <p className="text-content-tertiary text-[11px] font-semibold tracking-[0.16em] uppercase">
            {labels.title}
          </p>

          <h2 className="text-content-primary mt-0.5 truncate text-sm font-semibold">
            {tokenSetLabel}
          </h2>
        </div>

        <span className="text-content-tertiary max-w-40 truncate font-mono text-[11px]">
          {token.path}
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <TokenPreviewSample
          token={token}
          tokenSetType={tokenSetType}
          resolvedColorValue={resolvedColorValue}
          labels={labels}
        />

        <dl className="border-border-subtle mt-3 grid gap-2 border-t pt-3">
          <TokenPreviewMetadataRow label={labels.value} value={token.value} />

          {token.reference ? (
            <TokenPreviewMetadataRow
              label={labels.reference}
              value={token.reference}
            />
          ) : null}

          {resolvedColorValue ? (
            <TokenPreviewMetadataRow
              label={labels.resolvedValue}
              value={resolvedColorValue}
            />
          ) : null}
        </dl>
      </div>
    </aside>
  );
}

function TokenPreviewSample({
  token,
  tokenSetType,
  resolvedColorValue,
  labels,
}: {
  token: TokenRowData;
  tokenSetType: TokenSetType;
  resolvedColorValue: string | null;
  labels: TokenPreviewPanelLabels;
}) {
  if (tokenSetType === 'color') {
    return (
      <div className="border-border-subtle overflow-hidden rounded-md border">
        <div
          className="flex h-24 items-end p-3"
          style={{
            backgroundColor: resolvedColorValue ?? undefined,
          }}
        >
          {!resolvedColorValue ? (
            <p className="text-action-warning text-sm font-semibold">
              {labels.unresolved}
            </p>
          ) : (
            <span className="bg-preview-contrast-surface text-preview-contrast-content rounded-full px-2 py-1 font-mono text-[11px] font-semibold">
              {resolvedColorValue}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (tokenSetType === 'spacing') {
    const spacingValue = getSafeCssLength(token.value);

    return (
      <div className="border-border-subtle bg-background-sunken rounded-md border p-3">
        <div
          className="border-border-subtle bg-surface-primary border"
          style={{
            padding: spacingValue,
          }}
        >
          <div className="bg-action-primary/20 text-action-primary px-3 py-2 text-center text-xs font-semibold">
            {labels.sample}
          </div>
        </div>
      </div>
    );
  }

  if (tokenSetType === 'radius') {
    const radiusValue = getSafeCssLength(token.value);

    return (
      <div className="border-border-subtle bg-background-sunken rounded-md border p-4">
        <div
          className="bg-action-primary/20 border-action-primary/30 flex h-24 items-center justify-center border text-xs font-semibold"
          style={{
            borderRadius: radiusValue,
          }}
        >
          {labels.sample}
        </div>
      </div>
    );
  }

  if (tokenSetType === 'typography') {
    return (
      <div className="border-border-subtle bg-background-sunken rounded-md border p-4">
        <p
          className="text-content-primary"
          style={getTypographyPreviewStyle(token.rawValue)}
        >
          Aa · {labels.sample}
        </p>
      </div>
    );
  }

  if (tokenSetType === 'motion') {
    return (
      <div className="border-border-subtle bg-background-sunken rounded-md border p-4">
        <div className="flex items-center gap-3">
          <span className="bg-action-primary block h-8 w-16 rounded-full" />
          <span className="text-content-secondary font-mono text-xs">
            {token.value}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-border-subtle bg-background-sunken rounded-md border p-4">
      <p className="text-content-secondary font-mono text-sm">{token.value}</p>
    </div>
  );
}

function TokenPreviewMetadataRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3">
      <dt className="text-content-tertiary text-xs font-medium">{label}</dt>
      <dd className="text-content-secondary truncate font-mono text-xs">
        {value}
      </dd>
    </div>
  );
}

function getResolvedColorValue({
  token,
  primitiveColorAliasOptions,
}: {
  token: TokenRowData;
  primitiveColorAliasOptions: PrimitiveColorTokenAliasOption[];
}) {
  if (isHexColorValue(token.value)) {
    return token.value;
  }

  const reference = token.reference ?? token.value;

  return getResolvedColorValueForReference({
    reference,
    primitiveOptions: primitiveColorAliasOptions,
  });
}

function getSafeCssLength(value: string) {
  const trimmedValue = value.trim();

  if (trimmedValue === '0') {
    return trimmedValue;
  }

  return /^-?\d*\.?\d+(px|rem|em|%|vh|vw)$/.test(trimmedValue)
    ? trimmedValue
    : undefined;
}

export function getTypographyPreviewStyle(rawValue: unknown): CSSProperties {
  if (!isRecord(rawValue)) {
    return {};
  }

  return {
    fontFamily: getTypographyPreviewFontFamily(rawValue.fontFamily),
    fontSize: getStyleValue(rawValue.fontSize),
    fontWeight: getStyleValue(rawValue.fontWeight),
    lineHeight: getStyleValue(rawValue.lineHeight),
    letterSpacing: getStyleValue(rawValue.letterSpacing),
  };
}

function getTypographyPreviewFontFamily(value: unknown) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const families = value
    .split(',')
    .map((family) => family.trim())
    .filter(Boolean);
  const [primaryFamily, ...fallbackFamilies] = families;

  if (!primaryFamily) {
    return undefined;
  }

  const normalizedPrimaryFamily = primaryFamily
    .replace(/^['"]|['"]$/g, '')
    .toLowerCase();
  const bundledVariable = bundledFontFamilyVariables[normalizedPrimaryFamily];

  if (!bundledVariable) {
    return value;
  }

  return [`var(${bundledVariable})`, ...fallbackFamilies].join(', ');
}

function getStyleValue(value: unknown) {
  return typeof value === 'string' || typeof value === 'number'
    ? value
    : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
