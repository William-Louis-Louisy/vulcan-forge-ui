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

  return (
    <div className="shadow-soft flex min-h-0 flex-col xl:h-full xl:overflow-hidden">
      {tokenGroups.length > 0 ? (
        <div className="p-4 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
          <div className="grid gap-4">
            {tokenGroups.map((group) => (
              <section key={group.id}>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-content-tertiary text-[11px] font-semibold tracking-[0.18em] uppercase">
                    {group.label}
                  </h3>

                  <span className="bg-background-sunken text-content-tertiary rounded-full px-2 py-0.5 text-[11px] font-semibold">
                    {group.rows.length}
                  </span>
                </div>

                <div className="border-border-subtle bg-surface-primary overflow-hidden rounded-md border">
                  {group.rows.map((row) => {
                    const isSelected = row.path === selectedTokenPath;

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
                          <p className="truncate font-mono text-[13px] font-semibold">
                            {row.path}
                          </p>

                          <p className="text-content-secondary mt-0.5 truncate font-mono text-[11px]">
                            {row.value}
                          </p>
                        </div>

                        {!row.description?.en?.trim() ? (
                          <span className="text-action-warning bg-action-warning/10 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                            {labels.missingEnglishDescription}
                          </span>
                        ) : null}

                        <span className="text-content-tertiary text-base">
                          ›
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
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
