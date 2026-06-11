import {
  type TokenRowData,
  type TokenSetType,
  type PrimitiveColorTokenAliasOption,
} from '../tokens-editor.utils';
import type { Locale } from '@/i18n/routing';
import { TokenValueEditor } from './TokenValueEditor';
import { TokenDescriptionEditor } from '../TokenDescriptionEditor';

export type TokenInspectorPanelLabels = {
  eyebrow: string;
  empty: string;
  value: string;
  description: string;
  noDescription: string;
  colorSwatchLabel: string;
  semanticAlias: {
    resolvedValue: string;
    unresolved: string;
  };
};

type TokenInspectorPanelProps = {
  locale: Locale;
  projectSlug: string;
  token: TokenRowData | null;
  tokenSetType: TokenSetType;
  primitiveColorAliasOptions: PrimitiveColorTokenAliasOption[];
  labels: TokenInspectorPanelLabels;
};

export function TokenInspectorPanel({
  locale,
  projectSlug,
  token,
  tokenSetType,
  primitiveColorAliasOptions,
  labels,
}: TokenInspectorPanelProps) {
  if (!token) {
    return (
      <aside className="border-border-subtle bg-surface-primary h-fit rounded-3xl border p-5">
        <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
          {labels.eyebrow}
        </p>

        <p className="text-content-secondary mt-4 text-sm leading-6">
          {labels.empty}
        </p>
      </aside>
    );
  }

  return (
    <aside className="border-border-subtle bg-surface-primary h-fit rounded-3xl border p-5">
      <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {labels.eyebrow}
      </p>

      <h2 className="wrap-break-words mt-3 font-mono text-lg font-semibold">
        {token.path}
      </h2>

      <p className="text-content-secondary mt-1 text-sm">{tokenSetType}</p>

      <div className="border-border-subtle bg-background-subtle mt-5 rounded-2xl border p-4">
        <p className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase">
          {labels.value}
        </p>

        <div className="mt-3">
          <TokenValueEditor
            row={token}
            locale={locale}
            projectSlug={projectSlug}
            primitiveColorAliasOptions={primitiveColorAliasOptions}
            labels={{
              colorSwatchLabel: labels.colorSwatchLabel,
              semanticAlias: {
                resolvedValue: labels.semanticAlias.resolvedValue,
                unresolved: labels.semanticAlias.unresolved,
              },
            }}
          />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase">
          {labels.description}
        </p>

        <p className="text-content-secondary mt-2 text-sm leading-6">
          {getTokenDescriptionForLocale({
            token,
            locale,
            fallback: labels.noDescription,
          })}
        </p>

        <TokenDescriptionEditor
          locale={locale}
          projectSlug={projectSlug}
          tokenSetType={token.type}
          tokenPath={token.path}
          initialDescriptionEn={token.description?.en ?? ''}
          initialDescriptionFr={token.description?.fr ?? ''}
        />
      </div>
    </aside>
  );
}

function getTokenDescriptionForLocale({
  token,
  locale,
  fallback,
}: {
  token: TokenRowData;
  locale: Locale;
  fallback: string;
}) {
  const description =
    locale === 'fr' ? token.description?.fr : token.description?.en;

  return description || fallback;
}
