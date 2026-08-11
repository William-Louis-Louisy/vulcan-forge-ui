'use client';

import { CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import {
  getResolvedColorValueForReference,
  isEditablePrimitiveColorTokenRow,
  isEditableSemanticColorTokenRow,
  type PrimitiveColorTokenAliasOption,
  type TokenRowData,
  type TokenSetType,
} from '../tokens-editor.utils';
import { WorkspaceState } from '@/components/ui';

export type TokenSetListPanelLabels = {
  invalidTokensTitle: string;
  invalidTokensDescription: string;
  nonColorTitle: string;
  nonColorDescriptions: Record<TokenSetType, string>;
  emptySearchTitle: string;
  emptySearchDescription: string;
  missingEnglishDescription: string;
  groups: {
    primitive: string;
    semantic: string;
    other: string;
  };
};

export type TokenSetListPanelViewModel = {
  name: string;
  type: TokenSetType;
  rows: TokenRowData[];
  isReadable: boolean;
  tokenCountLabel: string;
};

type TokenSetListPanelProps = {
  tokenSet: TokenSetListPanelViewModel;
  rows: TokenRowData[];
  selectedTokenPath: string | null;
  labels: TokenSetListPanelLabels;
  onTokenSelect: (tokenPath: string) => void;
  primitiveColorAliasOptions: PrimitiveColorTokenAliasOption[];
};

type TokenGroup = {
  id: string;
  label: string;
  order: number;
  rows: TokenRowData[];
};

function sortTokenRowsNaturally(rows: TokenRowData[]) {
  return [...rows].sort((firstRow, secondRow) =>
    firstRow.path.localeCompare(secondRow.path, undefined, {
      numeric: true,
      sensitivity: 'base',
    }),
  );
}

function createTokenGroups({
  rows,
  labels,
}: {
  rows: TokenRowData[];
  labels: TokenSetListPanelLabels['groups'];
}): TokenGroup[] {
  const groupMap = new Map<string, TokenGroup>();

  for (const row of rows) {
    const groupInfo = getTokenGroupInfo({
      row,
      labels,
    });
    const existingGroup = groupMap.get(groupInfo.id);

    if (existingGroup) {
      existingGroup.rows.push(row);
      continue;
    }

    groupMap.set(groupInfo.id, {
      ...groupInfo,
      rows: [row],
    });
  }

  return Array.from(groupMap.values())
    .map((group) => ({
      ...group,
      rows: sortTokenRowsNaturally(group.rows),
    }))
    .sort(
      (firstGroup, secondGroup) =>
        firstGroup.order - secondGroup.order ||
        firstGroup.label.localeCompare(secondGroup.label, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
    )
    .filter((group) => group.rows.length > 0);
}

function getTokenGroupInfo({
  row,
  labels,
}: {
  row: TokenRowData;
  labels: TokenSetListPanelLabels['groups'];
}) {
  if (isEditablePrimitiveColorTokenRow(row)) {
    const namespace = getColorTokenNamespace(row.path);

    return {
      id: `primitive:${namespace}`,
      label: `${labels.primitive} · ${formatTokenNamespaceLabel(namespace)}`,
      order: 0,
    };
  }

  if (isEditableSemanticColorTokenRow(row)) {
    const namespace = getColorTokenNamespace(row.path);

    return {
      id: `semantic:${namespace}`,
      label: `${labels.semantic} · ${formatTokenNamespaceLabel(namespace)}`,
      order: 1,
    };
  }

  return {
    id: 'other',
    label: labels.other,
    order: 2,
  };
}

function getColorTokenNamespace(path: string) {
  return path.split('.')[2] ?? 'base';
}

function formatTokenNamespaceLabel(namespace: string) {
  return namespace
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(' ');
}

export function TokenSetListPanel({
  tokenSet,
  rows,
  selectedTokenPath,
  labels,
  onTokenSelect,
  primitiveColorAliasOptions,
}: TokenSetListPanelProps) {
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<Set<string>>(
    () => new Set(),
  );

  if (!tokenSet.isReadable) {
    return (
      <WorkspaceState
        title={labels.invalidTokensTitle}
        description={labels.invalidTokensDescription}
        tone="danger"
        align="start"
        width="full"
        className="shadow-soft"
      />
    );
  }

  const tokenGroups = createTokenGroups({
    rows,
    labels: labels.groups,
  });

  function toggleGroup(groupId: string) {
    setCollapsedGroupIds((currentGroupIds) => {
      const nextGroupIds = new Set(currentGroupIds);

      if (nextGroupIds.has(groupId)) {
        nextGroupIds.delete(groupId);
      } else {
        nextGroupIds.add(groupId);
      }

      return nextGroupIds;
    });
  }

  return (
    <div className="shadow-soft flex min-h-0 flex-col xl:h-full xl:overflow-hidden">
      {tokenGroups.length > 0 ? (
        <div className="p-4 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
          <div className="grid gap-4">
            {tokenGroups.map((group) => {
              const isExpanded = !collapsedGroupIds.has(group.id);
              const groupPanelId = `token-group-${group.id}`;

              return (
                <section key={group.id}>
                  <h3 className="mb-2">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={groupPanelId}
                      onClick={() => toggleGroup(group.id)}
                      className="text-content-tertiary hover:text-content-primary focus-visible:outline-border-focus flex w-full items-center gap-2 rounded-sm text-left text-xs font-semibold tracking-[0.16em] uppercase transition focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {isExpanded ? (
                        <CaretDownIcon aria-hidden="true" size={14} />
                      ) : (
                        <CaretRightIcon aria-hidden="true" size={14} />
                      )}

                      <span>{group.label}</span>

                      <span className="bg-background-sunken text-content-tertiary rounded-full px-2 py-0.5 text-xs font-semibold tracking-normal">
                        {group.rows.length}
                      </span>
                    </button>
                  </h3>

                  {isExpanded ? (
                    <div
                      id={groupPanelId}
                      className="border-border-subtle bg-surface-primary overflow-hidden rounded-md border"
                    >
                      {group.rows.map((row) => {
                        const isSelected = row.path === selectedTokenPath;
                        const isSemanticDescriptionMissing =
                          isEditableSemanticColorTokenRow(row) &&
                          !row.description?.en?.trim();

                        return (
                          <button
                            key={row.path}
                            type="button"
                            aria-current={isSelected ? 'page' : undefined}
                            onClick={() => onTokenSelect(row.path)}
                            className={[
                              'border-border-subtle flex w-full items-center gap-3 border-b px-4 py-3 text-left last:border-b-0',
                              isSelected
                                ? 'bg-background-sunken'
                                : 'hover:bg-background-subtle',
                            ].join(' ')}
                          >
                            {row.type === 'color' ? (
                              <TokenPreviewSwatch
                                row={row}
                                primitiveColorAliasOptions={
                                  primitiveColorAliasOptions
                                }
                              />
                            ) : null}

                            <div className="min-w-0 flex-1">
                              <p className="truncate font-mono text-sm font-semibold">
                                {row.path}
                              </p>

                              <p className="text-content-secondary mt-0.5 truncate font-mono text-xs">
                                {row.value}
                              </p>
                            </div>

                            {isSemanticDescriptionMissing ? (
                              <span className="text-action-warning bg-action-warning/10 rounded-full px-2 py-0.5 text-xs font-semibold">
                                {labels.missingEnglishDescription}
                              </span>
                            ) : null}

                            <CaretRightIcon
                              aria-hidden="true"
                              className="text-content-tertiary shrink-0"
                              size={16}
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
          <WorkspaceState
            title={labels.emptySearchTitle}
            description={labels.emptySearchDescription}
            width="full"
            headingLevel={3}
            dashed
          />
        </div>
      )}
    </div>
  );
}

export function TokenPreviewSwatch({
  row,
  primitiveColorAliasOptions,
}: {
  row: TokenRowData;
  primitiveColorAliasOptions: PrimitiveColorTokenAliasOption[];
}) {
  const value = String(row.value);
  const reference = row.reference ?? value;
  const resolvedColorValue = value.startsWith('#')
    ? value
    : getResolvedColorValueForReference({
        reference,
        primitiveOptions: primitiveColorAliasOptions,
      });

  return (
    <span
      className="border-border-subtle size-7 shrink-0 rounded-full border"
      style={{
        backgroundColor: resolvedColorValue ?? undefined,
      }}
      aria-hidden="true"
    />
  );
}
