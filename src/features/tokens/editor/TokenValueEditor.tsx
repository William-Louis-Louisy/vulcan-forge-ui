'use client';

import {
  tokenReferenceToPath,
  isEditableSemanticColorTokenRow,
  isEditablePrimitiveColorTokenRow,
  getResolvedColorValueForReference,
  type TokenRowData,
  type PrimitiveColorTokenAliasOption,
} from '../tokens-editor.utils';
import type { Locale } from '@/i18n/routing';
import { PrimitiveColorTokenEditor } from '../PrimitiveColorTokenEditor';
import { SemanticColorTokenAliasEditor } from '../SemanticColorTokenAliasEditor';

export type TokenValueEditorLabels = {
  colorSwatchLabel: string;
  semanticAlias: {
    resolvedValue: string;
    unresolved: string;
  };
};

type TokenValueEditorProps = {
  row: TokenRowData;
  labels: TokenValueEditorLabels;
  locale: Locale;
  projectSlug: string;
  primitiveColorAliasOptions: PrimitiveColorTokenAliasOption[];
};

export function TokenValueEditor({
  row,
  labels,
  locale,
  projectSlug,
  primitiveColorAliasOptions,
}: TokenValueEditorProps) {
  const currentReference =
    row.reference ?? (typeof row.rawValue === 'string' ? row.rawValue : '');

  const currentReferencePath = currentReference
    ? tokenReferenceToPath(currentReference)
    : null;

  const resolvedColorValue = currentReference
    ? getResolvedColorValueForReference({
        reference: currentReference,
        primitiveOptions: primitiveColorAliasOptions,
      })
    : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {row.isColorValue ? (
          <span
            role="img"
            aria-label={`${labels.colorSwatchLabel}: ${row.value}`}
            className="border-border-subtle size-5 rounded-full border"
            style={{ backgroundColor: row.value }}
          />
        ) : null}

        <span className="text-content-primary font-mono text-sm font-semibold break-all">
          {row.value}
        </span>
      </div>

      {isEditableSemanticColorTokenRow(row) ? (
        <div>
          {resolvedColorValue ? (
            <div className="text-content-secondary mb-2 flex items-center gap-2 text-xs">
              <span
                role="img"
                aria-label={`${labels.semanticAlias.resolvedValue}: ${resolvedColorValue}`}
                className="border-border-subtle size-5 rounded-full border"
                style={{ backgroundColor: resolvedColorValue }}
              />
              <span>
                {labels.semanticAlias.resolvedValue}: {resolvedColorValue}
              </span>
            </div>
          ) : (
            <p className="text-action-warning mb-2 text-xs font-semibold">
              {labels.semanticAlias.unresolved}
            </p>
          )}

          <SemanticColorTokenAliasEditor
            locale={locale}
            projectSlug={projectSlug}
            tokenPath={row.path}
            initialReferencePath={currentReferencePath ?? ''}
            resolvedColorValue={resolvedColorValue}
            primitiveOptions={primitiveColorAliasOptions}
          />
        </div>
      ) : null}

      {isEditablePrimitiveColorTokenRow(row) ? (
        <PrimitiveColorTokenEditor
          locale={locale}
          projectSlug={projectSlug}
          tokenPath={row.path}
          initialValue={row.value}
        />
      ) : null}
    </div>
  );
}
