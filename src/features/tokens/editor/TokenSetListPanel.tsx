import {
  getResolvedColorValueForReference,
  isEditablePrimitiveColorTokenRow,
  isEditableSemanticColorTokenRow,
  type PrimitiveColorTokenAliasOption,
  type TokenRowData,
  type TokenSetType,
} from '../tokens-editor.utils';

export type TokenSetListPanelLabels = {
  invalidTokensTitle: string;
  invalidTokensDescription: string;
  nonColorTitle: string;
  nonColorDescriptions: Record<TokenSetType, string>;
  emptySearchTitle: string;
  emptySearchDescription: string;
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
  tokenSetLabel: string;
  rows: TokenRowData[];
  selectedTokenPath: string | null;
  labels: TokenSetListPanelLabels;
  onTokenSelect: (tokenPath: string) => void;
  primitiveColorAliasOptions: PrimitiveColorTokenAliasOption[];
};

type TokenGroup = {
  id: 'primitive' | 'semantic' | 'other';
  label: string;
  rows: TokenRowData[];
};

function sortTokenRowsAlphabetically(rows: TokenRowData[]) {
  return [...rows].sort((firstRow, secondRow) =>
    firstRow.path.localeCompare(secondRow.path),
  );
}

function createTokenGroups({
  rows,
  labels,
}: {
  rows: TokenRowData[];
  labels: TokenSetListPanelLabels['groups'];
}): TokenGroup[] {
  const primitiveRows: TokenRowData[] = [];
  const semanticRows: TokenRowData[] = [];
  const otherRows: TokenRowData[] = [];

  for (const row of rows) {
    if (isEditablePrimitiveColorTokenRow(row)) {
      primitiveRows.push(row);
      continue;
    }

    if (isEditableSemanticColorTokenRow(row)) {
      semanticRows.push(row);
      continue;
    }

    otherRows.push(row);
  }

  const groups: TokenGroup[] = [
    {
      id: 'primitive',
      label: labels.primitive,
      rows: sortTokenRowsAlphabetically(primitiveRows),
    },
    {
      id: 'semantic',
      label: labels.semantic,
      rows: sortTokenRowsAlphabetically(semanticRows),
    },
    {
      id: 'other',
      label: labels.other,
      rows: sortTokenRowsAlphabetically(otherRows),
    },
  ];

  return groups.filter((group) => group.rows.length > 0);
}

export function TokenSetListPanel({
  tokenSet,
  tokenSetLabel,
  rows,
  selectedTokenPath,
  labels,
  onTokenSelect,
  primitiveColorAliasOptions,
}: TokenSetListPanelProps) {
  if (!tokenSet.isReadable) {
    return (
      <div className="border-action-danger/30 bg-action-danger/10 shadow-soft rounded-3xl border p-8">
        <h2 className="text-action-danger text-2xl font-semibold tracking-tight">
          {labels.invalidTokensTitle}
        </h2>

        <p className="text-content-secondary mt-3 max-w-2xl text-sm leading-6">
          {labels.invalidTokensDescription}
        </p>
      </div>
    );
  }

  const tokenGroups = createTokenGroups({
    rows,
    labels: labels.groups,
  });

  return (
    <div className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-5 lg:p-6">
      <div className="border-border-subtle flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
            {tokenSetLabel}
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {tokenSet.name}
          </h2>
        </div>

        <p className="text-content-secondary text-sm">
          {tokenSet.tokenCountLabel}
        </p>
      </div>

      {tokenSet.type !== 'color' ? (
        <div className="border-border-subtle bg-background-subtle mt-5 rounded-2xl border p-4">
          <p className="text-sm font-semibold">{labels.nonColorTitle}</p>

          <p className="text-content-secondary mt-2 text-sm leading-6">
            {labels.nonColorDescriptions[tokenSet.type]}
          </p>
        </div>
      ) : null}

      {tokenGroups.length > 0 ? (
        <div className="mt-6 grid gap-5">
          {tokenGroups.map((group) => (
            <section key={group.id}>
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
                  {group.label}
                </h3>

                <span className="text-content-tertiary bg-content-tertiary/20 rounded-full px-2 py-0.5 text-xs">
                  {group.rows.length}
                </span>
              </div>

              <div className="border-border-subtle bg-surface-primary overflow-hidden rounded-3xl border">
                {group.rows.map((row) => {
                  const isSelected = row.path === selectedTokenPath;

                  return (
                    <button
                      key={row.path}
                      type="button"
                      aria-current={isSelected ? 'page' : undefined}
                      onClick={() => onTokenSelect(row.path)}
                      className={[
                        'border-border-subtle flex w-full items-center gap-4 border-b px-5 py-4 text-left last:border-b-0',
                        isSelected
                          ? 'bg-action-primary/10'
                          : 'hover:bg-background-subtle',
                      ].join(' ')}
                    >
                      <TokenPreviewSwatch
                        row={row}
                        primitiveColorAliasOptions={primitiveColorAliasOptions}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-sm font-semibold">
                          {row.path}
                        </p>

                        <p className="text-content-secondary mt-1 truncate font-mono text-xs">
                          {row.value}
                        </p>
                      </div>

                      <span className="text-content-tertiary text-xl">›</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="border-border-default mt-6 rounded-2xl border border-dashed p-8 text-center">
          <h3 className="text-xl font-semibold tracking-tight">
            {labels.emptySearchTitle}
          </h3>

          <p className="text-content-secondary mx-auto mt-3 max-w-xl text-sm leading-6">
            {labels.emptySearchDescription}
          </p>
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
      className="border-border-subtle size-8 shrink-0 rounded-lg border"
      style={{
        backgroundColor: resolvedColorValue ?? undefined,
      }}
      aria-hidden="true"
    />
  );
}
