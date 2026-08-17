import {
  normalizeTypographyTokenValue,
  tokenReferenceToPath,
  type TypographyTokenValue,
} from '@/domain/design-system';
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
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
  };
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

const typographyPreviewFieldKeys = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
] as const satisfies readonly (keyof TypographyTokenValue)[];

type TypographyPreviewFieldKey = (typeof typographyPreviewFieldKeys)[number];

export type TypographyPreviewField = {
  key: TypographyPreviewFieldKey;
  rawValue: string | null;
  resolvedValue: string | null;
  isReference: boolean;
  isResolved: boolean;
};

export type TypographyPreviewModel = {
  style: CSSProperties;
  fields: TypographyPreviewField[];
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
      <aside className="border-border-subtle flex min-h-0 flex-col overflow-hidden border-b">
        <header className="border-border-subtle shrink-0 border-b px-4 py-3">
          <p className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase">
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
    <aside className="border-border-subtle flex min-h-0 flex-col overflow-hidden border-b">
      <header className="border-border-subtle flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <p className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase">
            {labels.title}
          </p>
        </div>

        <span className="text-content-tertiary max-w-40 truncate font-mono text-xs">
          {tokenSetLabel}
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <TokenPreviewSample
          token={token}
          tokenSetType={tokenSetType}
          resolvedColorValue={resolvedColorValue}
          labels={labels}
        />
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
            <span className="bg-preview-contrast-surface text-preview-contrast-content rounded-full px-2 py-1 font-mono text-xs font-semibold">
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
    return <TypographyPreview token={token} labels={labels} />;
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

function TypographyPreview({
  token,
  labels,
}: {
  token: TokenRowData;
  labels: TokenPreviewPanelLabels;
}) {
  const model = createTypographyPreviewModel({
    rawValue: token.rawValue,
    resolvedValue: token.resolvedValue,
  });

  return (
    <div className="grid gap-3">
      <div className="border-border-subtle bg-surface-primary overflow-x-auto rounded-md border p-4">
        <div className="min-w-max py-2">
          <p className="text-content-primary" style={model.style}>
            Aa · {labels.sample}
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {model.fields.map((field) => (
          <TypographyPreviewFieldCard
            key={field.key}
            field={field}
            label={labels.typography[field.key]}
            labels={labels}
            previewStyle={model.style}
          />
        ))}
      </div>
    </div>
  );
}

function TypographyPreviewFieldCard({
  field,
  label,
  labels,
  previewStyle,
}: {
  field: TypographyPreviewField;
  label: string;
  labels: TokenPreviewPanelLabels;
  previewStyle: CSSProperties;
}) {
  return (
    <div className="border-border-subtle bg-background-sunken min-w-0 rounded-md border p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-content-tertiary text-xs font-semibold">{label}</p>
        {field.isReference && !field.isResolved ? (
          <span className="text-action-warning text-xs font-semibold">
            {labels.unresolved}
          </span>
        ) : null}
      </div>

      <TypographyFieldValues field={field} labels={labels} />
      <TypographyFieldSpecimen field={field} previewStyle={previewStyle} />
    </div>
  );
}

function TypographyFieldValues({
  field,
  labels,
}: {
  field: TypographyPreviewField;
  labels: TokenPreviewPanelLabels;
}) {
  if (field.isReference) {
    return (
      <dl className="mt-2 grid gap-1.5 text-xs">
        <div className="min-w-0">
          <dt className="text-content-tertiary">{labels.reference}</dt>
          <dd className="text-content-secondary truncate font-mono">
            {field.rawValue}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-content-tertiary">{labels.resolvedValue}</dt>
          <dd
            className={
              field.isResolved
                ? 'text-content-primary truncate font-mono font-semibold'
                : 'text-action-warning truncate font-mono font-semibold'
            }
          >
            {field.isResolved ? field.resolvedValue : labels.unresolved}
          </dd>
        </div>
      </dl>
    );
  }

  return (
    <p className="text-content-primary mt-2 truncate font-mono text-xs font-semibold">
      {field.resolvedValue ?? field.rawValue}
    </p>
  );
}

function TypographyFieldSpecimen({
  field,
  previewStyle,
}: {
  field: TypographyPreviewField;
  previewStyle: CSSProperties;
}) {
  if (!field.isResolved) {
    return null;
  }

  if (field.key === 'fontSize') {
    return (
      <div className="border-border-subtle bg-surface-primary mt-3 overflow-hidden rounded border px-3 py-2">
        <span
          className="text-content-primary inline-block leading-none"
          style={{ fontSize: previewStyle.fontSize }}
        >
          Aa
        </span>
      </div>
    );
  }

  if (field.key === 'letterSpacing') {
    return (
      <div className="border-border-subtle bg-surface-primary mt-3 overflow-x-auto rounded border px-3 py-2">
        <span
          className="text-content-primary inline-block whitespace-nowrap text-sm"
          style={{ letterSpacing: previewStyle.letterSpacing }}
        >
          LETTER SPACING
        </span>
      </div>
    );
  }

  return null;
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

  return /^-?\d*\.?\d+(px|rem|em|%|vh|vw|vmin|vmax|ch|ex)$/.test(
    trimmedValue,
  )
    ? trimmedValue
    : undefined;
}

function stringifyTypographyFieldValue(value: unknown): string | null {
  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : null;
}

function hasTokenReferenceSyntax(value: unknown): boolean {
  return typeof value === 'string' && tokenReferenceToPath(value) !== null;
}

export function createTypographyPreviewModel({
  rawValue,
  resolvedValue,
}: {
  rawValue: unknown;
  resolvedValue?: unknown;
}): TypographyPreviewModel {
  const rawTypographyValue = normalizeTypographyTokenValue({ value: rawValue });
  const resolvedTypographyValue = normalizeTypographyTokenValue({
    value: resolvedValue ?? rawValue,
  });
  const effectiveResolvedValue = resolvedTypographyValue ?? rawTypographyValue;

  const fields = typographyPreviewFieldKeys.flatMap((key) => {
    const rawFieldValue = stringifyTypographyFieldValue(
      rawTypographyValue?.[key],
    );
    const resolvedFieldValue = stringifyTypographyFieldValue(
      effectiveResolvedValue?.[key],
    );

    if (rawFieldValue === null && resolvedFieldValue === null) {
      return [];
    }

    const fieldIsReference = hasTokenReferenceSyntax(rawFieldValue);

    return [
      {
        key,
        rawValue: rawFieldValue,
        resolvedValue: resolvedFieldValue,
        isReference: fieldIsReference,
        isResolved:
          !fieldIsReference ||
          (resolvedFieldValue !== null &&
            !hasTokenReferenceSyntax(resolvedFieldValue) &&
            resolvedFieldValue !== rawFieldValue),
      } satisfies TypographyPreviewField,
    ];
  });

  return {
    style: getTypographyPreviewStyle(effectiveResolvedValue),
    fields,
  };
}

export function getTypographyPreviewStyle(rawValue: unknown): CSSProperties {
  const typographyValue = normalizeTypographyTokenValue({ value: rawValue });

  if (!typographyValue) {
    return {};
  }

  return {
    fontFamily: getTypographyPreviewFontFamily(typographyValue.fontFamily),
    fontSize: getStyleValue(typographyValue.fontSize),
    fontWeight: getStyleValue(typographyValue.fontWeight),
    lineHeight: getStyleValue(typographyValue.lineHeight),
    letterSpacing: getStyleValue(typographyValue.letterSpacing),
  };
}

function getTypographyPreviewFontFamily(value: unknown) {
  if (typeof value !== 'string' || hasTokenReferenceSyntax(value)) {
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
  if (hasTokenReferenceSyntax(value)) {
    return undefined;
  }

  return typeof value === 'string' || typeof value === 'number'
    ? value
    : undefined;
}
