'use client';

import {
  TokenSetListPanel,
  type TokenSetListPanelLabels,
  type TokenSetListPanelViewModel,
} from './TokenSetListPanel';
import {
  TokenPreviewPanel,
  type TokenPreviewPanelLabels,
} from './TokenPreviewPanel';
import {
  TokenInspectorPanel,
  type TokenInspectorPanelLabels,
} from './TokenInspectorPanel';
import {
  getPrimitiveColorTokenAliasOptions,
  type TokenSetType,
} from '../tokens-editor.utils';
import {
  CreateColorTokenForm,
  type CreateColorTokenFormLabels,
} from '../CreateColorTokenForm';
import {
  CreateDesignTokenForm,
  type CreateDesignTokenFormLabels,
} from '../CreateDesignTokenForm';
import {
  filterTokenRows,
  createTokenEditorUrl,
} from './tokens-editor-shell.utils';
import {
  CreateTypographyTokenForm,
  type CreateTypographyTokenFormLabels,
} from '../CreateTypographyTokenForm';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { ProjectWorkspaceHeader, WorkspaceState } from '@/components/ui';
import { TokenSetTabs } from './TokenSetTabs';
import { TokenEditorToolbar } from './TokenEditorToolbar';

export type TokensEditorShellLabels = {
  header: {
    title: string;
    summary: string;
  };
  toolbar: {
    searchLabel: string;
    searchPlaceholder: string;
    newToken: string;
  };
  tabs: {
    label: string;
    items: Record<TokenSetType, string>;
  };
  createDesignToken: {
    spacing: CreateDesignTokenFormLabels;
    radius: CreateDesignTokenFormLabels;
    motion: CreateDesignTokenFormLabels;
  };
  preview: TokenPreviewPanelLabels;
  tokenSet: TokenSetListPanelLabels;
  inspector: TokenInspectorPanelLabels;
  createColorToken: CreateColorTokenFormLabels;
  createTypographyToken: CreateTypographyTokenFormLabels;
};

export type TokenSetEditorViewModel = TokenSetListPanelViewModel;

type TokensEditorShellProps = {
  locale: Locale;
  projectSlug: string;
  projectName: string;
  tokenSets: TokenSetEditorViewModel[];
  initialActiveTokenSetType: TokenSetType;
  initialSelectedTokenPath: string | null;
  initialTokenSearchQuery: string;
  labels: TokensEditorShellLabels;
};

export function TokensEditorShell({
  locale,
  projectSlug,
  projectName,
  tokenSets,
  initialActiveTokenSetType,
  initialSelectedTokenPath,
  initialTokenSearchQuery,
  labels,
}: TokensEditorShellProps) {
  const [activeTokenSetType, setActiveTokenSetType] = useState(
    initialActiveTokenSetType,
  );
  const [selectedTokenPath, setSelectedTokenPath] = useState(
    initialSelectedTokenPath,
  );
  const [tokenSearchQuery, setTokenSearchQuery] = useState(
    initialTokenSearchQuery,
  );
  const [createTokenFormType, setCreateTokenFormType] =
    useState<TokenSetType | null>(null);

  const tokenSetCounts = useMemo(
    () =>
      Object.fromEntries(
        tokenSets.map((tokenSet) => [tokenSet.type, tokenSet.rows.length]),
      ) as Record<TokenSetType, number>,
    [tokenSets],
  );

  const missingEnglishDescriptionCount = useMemo(
    () =>
      tokenSets.reduce(
        (count, tokenSet) =>
          count +
          tokenSet.rows.filter((row) => !row.description?.en?.trim()).length,
        0,
      ),
    [tokenSets],
  );

  const hasMissingEnglishDescriptions = missingEnglishDescriptionCount > 0;

  const activeTokenSet =
    tokenSets.find((tokenSet) => tokenSet.type === activeTokenSetType) ??
    tokenSets[0] ??
    null;

  const filteredTokenRows = useMemo(() => {
    if (!activeTokenSet) {
      return [];
    }

    return filterTokenRows({
      rows: activeTokenSet.rows,
      query: tokenSearchQuery,
    });
  }, [activeTokenSet, tokenSearchQuery]);

  const selectedToken =
    filteredTokenRows.find((row) => row.path === selectedTokenPath) ??
    filteredTokenRows[0] ??
    activeTokenSet?.rows[0] ??
    null;

  const primitiveColorAliasOptions = useMemo(
    () => getPrimitiveColorTokenAliasOptions(activeTokenSet?.rows ?? []),
    [activeTokenSet],
  );

  function updateUrl(nextState: {
    set?: TokenSetType;
    token?: string | null;
    q?: string;
  }) {
    const nextTokenSetType = nextState.set ?? activeTokenSetType;
    const nextTokenPath =
      nextState.token === undefined ? selectedTokenPath : nextState.token;
    const nextQuery =
      nextState.q === undefined ? tokenSearchQuery : nextState.q;

    window.history.replaceState(
      null,
      '',
      createTokenEditorUrl({
        pathname: window.location.pathname,
        tokenSetType: nextTokenSetType,
        tokenPath: nextTokenPath,
        tokenSearchQuery: nextQuery,
      }),
    );
  }

  function handleTokenSetChange(tokenSetType: TokenSetType) {
    const nextTokenSet = tokenSets.find(
      (tokenSet) => tokenSet.type === tokenSetType,
    );

    const nextSelectedTokenPath = nextTokenSet?.rows[0]?.path ?? null;

    setActiveTokenSetType(tokenSetType);
    setSelectedTokenPath(nextSelectedTokenPath);
    updateUrl({
      set: tokenSetType,
      token: nextSelectedTokenPath,
    });
  }

  function handleTokenSelect(tokenPath: string) {
    setSelectedTokenPath(tokenPath);
    updateUrl({
      token: tokenPath,
    });
  }

  function handleSearchChange(query: string) {
    setTokenSearchQuery(query);
    updateUrl({
      q: query,
      token: null,
    });
  }

  function handleTokenRenamed(nextTokenPath: string) {
    setSelectedTokenPath(nextTokenPath);

    updateUrl({
      token: nextTokenPath,
    });
  }

  function handleNewTokenClick() {
    if (
      activeTokenSetType === 'color' ||
      activeTokenSetType === 'spacing' ||
      activeTokenSetType === 'radius' ||
      activeTokenSetType === 'motion' ||
      activeTokenSetType === 'typography'
    ) {
      setCreateTokenFormType(activeTokenSetType);
    }
  }

  function handleCreateTokenCancel() {
    setCreateTokenFormType(null);
  }

  function handleTokenCreated({
    tokenSetType,
    tokenPath,
  }: {
    tokenSetType: TokenSetType;
    tokenPath: string;
  }) {
    setCreateTokenFormType(null);
    setActiveTokenSetType(tokenSetType);
    setTokenSearchQuery('');
    setSelectedTokenPath(tokenPath);

    updateUrl({
      set: tokenSetType,
      token: tokenPath,
      q: '',
    });
  }

  function handleTokenValueUpdated(tokenPath: string) {
    setSelectedTokenPath(tokenPath);

    updateUrl({
      set: activeTokenSetType,
      token: tokenPath,
      q: tokenSearchQuery,
    });
  }

  const selectedTokenSetType = activeTokenSet?.type ?? activeTokenSetType;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto xl:grid xl:grid-cols-[minmax(0,1fr)_26rem] xl:overflow-hidden">
      <div className="flex min-w-0 flex-col xl:min-h-0 xl:overflow-hidden">
        <ProjectWorkspaceHeader
          variant="bar"
          title={labels.header.title}
          description={labels.header.summary}
          descriptionClassName={
            hasMissingEnglishDescriptions
              ? 'text-action-warning'
              : 'text-content-tertiary'
          }
          projectName={projectName}
          actions={
            <TokenEditorToolbar
              searchLabel={labels.toolbar.searchLabel}
              searchPlaceholder={labels.toolbar.searchPlaceholder}
              newTokenLabel={labels.toolbar.newToken}
              tokenSearchQuery={tokenSearchQuery}
              isNewTokenDisabled={
                activeTokenSetType !== 'color' &&
                activeTokenSetType !== 'spacing' &&
                activeTokenSetType !== 'radius' &&
                activeTokenSetType !== 'motion' &&
                activeTokenSetType !== 'typography'
              }
              onNewTokenClick={handleNewTokenClick}
              onSearchChange={handleSearchChange}
            />
          }
          footer={
            <TokenSetTabs
              label={labels.tabs.label}
              activeTokenSetType={activeTokenSetType}
              tokenSetLabels={labels.tabs.items}
              tokenSetCounts={tokenSetCounts}
              onTokenSetChange={handleTokenSetChange}
            />
          }
        />

        <div className="flex min-h-0 flex-col py-4 md:px-6 xl:flex-1 xl:overflow-hidden xl:px-7">
          {createTokenFormType === 'color' ? (
            <CreateColorTokenForm
              locale={locale}
              projectSlug={projectSlug}
              primitiveColorAliasOptions={primitiveColorAliasOptions}
              labels={labels.createColorToken}
              onCancel={handleCreateTokenCancel}
              onCreated={(tokenPath) =>
                handleTokenCreated({
                  tokenSetType: 'color',
                  tokenPath,
                })
              }
            />
          ) : null}

          {createTokenFormType === 'spacing' ? (
            <CreateDesignTokenForm
              locale={locale}
              projectSlug={projectSlug}
              type="spacing"
              labels={labels.createDesignToken.spacing}
              onCancel={handleCreateTokenCancel}
              onCreated={(tokenPath) =>
                handleTokenCreated({
                  tokenSetType: 'spacing',
                  tokenPath,
                })
              }
            />
          ) : null}

          {createTokenFormType === 'radius' ? (
            <CreateDesignTokenForm
              locale={locale}
              projectSlug={projectSlug}
              type="radius"
              labels={labels.createDesignToken.radius}
              onCancel={handleCreateTokenCancel}
              onCreated={(tokenPath) =>
                handleTokenCreated({
                  tokenSetType: 'radius',
                  tokenPath,
                })
              }
            />
          ) : null}

          {createTokenFormType === 'motion' ? (
            <CreateDesignTokenForm
              locale={locale}
              projectSlug={projectSlug}
              type="motion"
              labels={labels.createDesignToken.motion}
              onCancel={handleCreateTokenCancel}
              onCreated={(tokenPath) =>
                handleTokenCreated({
                  tokenSetType: 'motion',
                  tokenPath,
                })
              }
            />
          ) : null}

          {createTokenFormType === 'typography' ? (
            <CreateTypographyTokenForm
              locale={locale}
              projectSlug={projectSlug}
              labels={labels.createTypographyToken}
              onCancel={handleCreateTokenCancel}
              onCreated={(tokenPath) =>
                handleTokenCreated({
                  tokenSetType: 'typography',
                  tokenPath,
                })
              }
            />
          ) : null}

          <div className="min-h-0 xl:flex-1 xl:overflow-hidden">
            {activeTokenSet ? (
              <TokenSetListPanel
                tokenSet={activeTokenSet}
                rows={filteredTokenRows}
                selectedTokenPath={selectedToken?.path ?? null}
                labels={labels.tokenSet}
                onTokenSelect={handleTokenSelect}
                primitiveColorAliasOptions={primitiveColorAliasOptions}
              />
            ) : (
              <EmptyTokenSetsState />
            )}
          </div>
        </div>
      </div>

      <aside className="border-border-subtle grid min-h-0 border-t xl:grid-rows-[auto_minmax(0,1fr)] xl:overflow-hidden xl:border-t-0 xl:border-l">
        <TokenPreviewPanel
          token={selectedToken}
          tokenSetType={selectedTokenSetType}
          tokenSetLabel={labels.tabs.items[selectedTokenSetType]}
          primitiveColorAliasOptions={primitiveColorAliasOptions}
          labels={labels.preview}
        />

        <TokenInspectorPanel
          locale={locale}
          projectSlug={projectSlug}
          token={selectedToken}
          tokenSetType={selectedTokenSetType}
          primitiveColorAliasOptions={primitiveColorAliasOptions}
          labels={labels.inspector}
          onTokenRenamed={handleTokenRenamed}
          onTokenValueUpdated={handleTokenValueUpdated}
        />
      </aside>
    </div>
  );
}

function EmptyTokenSetsState() {
  const t = useTranslations('TokensEditorPage');

  return (
    <WorkspaceState
      title={t('states.emptyTitle')}
      description={t('states.emptyDescription')}
      width="full"
      dashed
      className="shadow-soft"
    />
  );
}
