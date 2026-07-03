import {
  TokenRenameForm,
  type TokenRenameFormLabels,
} from '../TokenRenameForm';
import {
  type TokenRowData,
  type TokenSetType,
  type PrimitiveColorTokenAliasOption,
} from '../tokens-editor.utils';
import {
  DesignTokenValueEditor,
  type DesignTokenValueEditorLabels,
} from '../DesignTokenValueEditor';
import {
  TypographyTokenValueEditor,
  type TypographyTokenValueEditorLabels,
} from '../TypographyTokenValueEditor';
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
  rename: TokenRenameFormLabels;
  genericValue: DesignTokenValueEditorLabels;
  typographyValue: TypographyTokenValueEditorLabels;
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
  onTokenRenamed?: (nextTokenPath: string) => void;
  onTokenValueUpdated: (tokenPath: string) => void;
};

export function TokenInspectorPanel({
  locale,
  projectSlug,
  token,
  tokenSetType,
  primitiveColorAliasOptions,
  labels,
  onTokenRenamed,
  onTokenValueUpdated,
}: TokenInspectorPanelProps) {
  if (!token) {
    return (
      <aside className="border-border-subtle bg-surface-primary shadow-soft flex h-full min-h-0 flex-col overflow-hidden rounded-lg border">
        <header className="border-border-subtle shrink-0 border-b px-4 py-3">
          <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
            {labels.eyebrow}
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

  return (
    <aside className="border-border-subtle flex h-full min-h-0 flex-col overflow-hidden">
      <header className="border-border-subtle shrink-0 border-b px-4 py-3">
        <p className="text-content-tertiary text-[11px] font-semibold tracking-[0.16em] uppercase">
          {labels.eyebrow}
        </p>

        <h2 className="wrap-break-words mt-2 font-mono text-base font-semibold">
          {token.path}
        </h2>

        <p className="text-content-secondary mt-1 text-xs">{tokenSetType}</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div>
          <TokenValueEditor
            row={token}
            locale={locale}
            projectSlug={projectSlug}
            primitiveColorAliasOptions={primitiveColorAliasOptions}
          />

          {token.type === 'spacing' ||
          token.type === 'radius' ||
          token.type === 'motion' ? (
            <DesignTokenValueEditor
              key={`${token.path}:${token.value}`}
              locale={locale}
              projectSlug={projectSlug}
              tokenSetType={tokenSetType}
              tokenPath={token.path}
              initialValue={token.value}
              labels={labels.genericValue}
              onUpdated={onTokenValueUpdated}
            />
          ) : null}

          {token.type === 'typography' ? (
            <TypographyTokenValueEditor
              key={`${token.path}:${token.value}`}
              locale={locale}
              projectSlug={projectSlug}
              tokenPath={token.path}
              initialValue={token.value}
              labels={labels.typographyValue}
              onUpdated={onTokenValueUpdated}
            />
          ) : null}
        </div>

        <TokenRenameForm
          key={token.path}
          locale={locale}
          projectSlug={projectSlug}
          tokenSetType={tokenSetType}
          currentTokenPath={token.path}
          labels={labels.rename}
          {...(onTokenRenamed ? { onRenamed: onTokenRenamed } : {})}
        />

        <div className="mt-4">
          <p className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase">
            {labels.description}
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
      </div>
    </aside>
  );
}
