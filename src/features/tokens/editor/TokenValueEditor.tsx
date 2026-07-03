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
  locale: Locale;
  projectSlug: string;
  primitiveColorAliasOptions: PrimitiveColorTokenAliasOption[];
};

export function TokenValueEditor({
  row,
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
      {isEditableSemanticColorTokenRow(row) ? (
        <div>
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
