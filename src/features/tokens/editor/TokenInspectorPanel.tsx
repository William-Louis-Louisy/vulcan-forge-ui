import {
  TokenRenameForm,
  type TokenRenameFormLabels,
} from '../TokenRenameForm';
import {
  isEditableSemanticColorTokenRow,
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
import { DeleteTokenControl } from '../DeleteTokenControl';
import { TokenStatusEditor } from '../TokenStatusEditor';

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
  onTokenRenameStarted: (rename: {
    currentTokenPath: string;
    nextTokenPath: string;
  }) => void;
  onTokenRenameFailed: (currentTokenPath: string) => void;
  onTokenValueUpdated: (tokenPath: string) => void;
  onTokenDeleted: (tokenPath: string) => void;
};

export function TokenInspectorPanel({
  locale,
  projectSlug,
  token,
  tokenSetType,
  primitiveColorAliasOptions,
  labels,
  onTokenRenamed,
  onTokenRenameStarted,
  onTokenRenameFailed,
  onTokenValueUpdated,
  onTokenDeleted,
}: TokenInspectorPanelProps) {
  if (!token) {
    return (
      <aside className="border-border-subtle flex min-h-0 flex-col xl:h-full xl:overflow-hidden">
        <header className="border-border-subtle shrink-0 border-b px-4 py-3">
          <p className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase">
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
    <aside className="border-border-subtle flex min-h-0 flex-col xl:h-full xl:overflow-hidden">
      <header className="border-border-subtle shrink-0 border-b px-4 py-3">
        <p className="text-content-tertiary text-xs font-semibold tracking-[0.16em] uppercase">
          {labels.eyebrow}
        </p>

        <h2 className="wrap-break-words mt-2 font-mono text-xs font-semibold">
          {token.path}
        </h2>
      </header>

      <div className="p-4 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
        <div>
          <TokenValueEditor
            key={`${tokenSetType}:${token.path}:${token.value}:${token.reference ?? ''}`}
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
              initialValue={token.rawValue}
              labels={labels.typographyValue}
              onUpdated={onTokenValueUpdated}
            />
          ) : null}
        </div>

        {token.status ? (
          <TokenStatusEditor
            key={`status:${tokenSetType}:${token.path}:${token.status}`}
            locale={locale}
            projectSlug={projectSlug}
            tokenSetType={tokenSetType}
            tokenPath={token.path}
            initialStatus={token.status}
            onUpdated={onTokenValueUpdated}
          />
        ) : null}

        <TokenRenameForm
          key={token.path}
          locale={locale}
          projectSlug={projectSlug}
          tokenSetType={tokenSetType}
          currentTokenPath={token.path}
          labels={labels.rename}
          {...(onTokenRenamed ? { onRenamed: onTokenRenamed } : {})}
          onRenameStarted={onTokenRenameStarted}
          onRenameFailed={onTokenRenameFailed}
        />

        <TokenDescriptionEditor
          key={`${token.type}:${token.path}`}
          locale={locale}
          projectSlug={projectSlug}
          tokenSetType={tokenSetType}
          tokenPath={token.path}
          sectionLabel={labels.description}
          descriptionRecommended={isEditableSemanticColorTokenRow(token)}
          initialDescriptionEn={token.description?.en ?? ''}
          initialDescriptionFr={token.description?.fr ?? ''}
        />

        <DeleteTokenControl
          key={`delete:${tokenSetType}:${token.path}`}
          locale={locale}
          projectSlug={projectSlug}
          tokenPath={token.path}
          tokenSetType={tokenSetType}
          onDeleted={onTokenDeleted}
        />
      </div>
    </aside>
  );
}
