import {
  isEditablePrimitiveColorTokenRow,
  isEditableSemanticColorTokenRow,
  type TokenRowData,
  type TokenSetType,
} from '../tokens-editor.utils';

export type PendingTokenRename = {
  currentTokenPath: string;
  nextTokenPath: string;
};

function compareNaturally(firstValue: string, secondValue: string) {
  return firstValue.localeCompare(secondValue, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
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

function getTokenDisplayGroupSortKey(row: TokenRowData) {
  if (isEditablePrimitiveColorTokenRow(row)) {
    return {
      order: 0,
      label: formatTokenNamespaceLabel(getColorTokenNamespace(row.path)),
    };
  }

  if (isEditableSemanticColorTokenRow(row)) {
    return {
      order: 1,
      label: formatTokenNamespaceLabel(getColorTokenNamespace(row.path)),
    };
  }

  return {
    order: 2,
    label: '',
  };
}

export function sortTokenRowsForDisplay(rows: TokenRowData[]) {
  return [...rows].sort((firstRow, secondRow) => {
    const firstGroup = getTokenDisplayGroupSortKey(firstRow);
    const secondGroup = getTokenDisplayGroupSortKey(secondRow);

    return (
      firstGroup.order - secondGroup.order ||
      compareNaturally(firstGroup.label, secondGroup.label) ||
      compareNaturally(firstRow.path, secondRow.path)
    );
  });
}

export function getTokenCreationPathPrefix(tokenPath: string | null) {
  const normalizedPath = tokenPath?.trim() ?? '';
  const finalSeparatorIndex = normalizedPath.lastIndexOf('.');

  if (finalSeparatorIndex < 0) {
    return '';
  }

  return normalizedPath.slice(0, finalSeparatorIndex + 1);
}

export function filterTokenRows({
  rows,
  query,
}: {
  rows: TokenRowData[];
  query: string;
}) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return rows;
  }

  return rows.filter((row) =>
    [row.path, row.type, row.value, row.description?.en, row.description?.fr]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function resolveSelectedToken({
  activeRows,
  filteredRows,
  selectedTokenPath,
  pendingRename = null,
}: {
  activeRows: TokenRowData[];
  filteredRows: TokenRowData[];
  selectedTokenPath: string | null;
  pendingRename?: PendingTokenRename | null;
}) {
  const directlySelectedToken = activeRows.find(
    (row) => row.path === selectedTokenPath,
  );

  if (directlySelectedToken) {
    return directlySelectedToken;
  }

  if (
    pendingRename &&
    (pendingRename.currentTokenPath === selectedTokenPath ||
      pendingRename.nextTokenPath === selectedTokenPath)
  ) {
    const renamedToken = activeRows.find(
      (row) => row.path === pendingRename.nextTokenPath,
    );

    if (renamedToken) {
      return renamedToken;
    }

    const sourceToken = activeRows.find(
      (row) => row.path === pendingRename.currentTokenPath,
    );

    if (sourceToken) {
      return sourceToken;
    }
  }

  return filteredRows[0] ?? activeRows[0] ?? null;
}

export function getNextSelectedTokenPathAfterDeletion({
  rows,
  deletedTokenPath,
  query,
}: {
  rows: TokenRowData[];
  deletedTokenPath: string;
  query: string;
}) {
  const deletedIndex = rows.findIndex((row) => row.path === deletedTokenPath);
  const remainingRows = rows.filter((row) => row.path !== deletedTokenPath);

  if (remainingRows.length === 0) {
    return null;
  }

  const filteredRemainingRows = filterTokenRows({
    rows: remainingRows,
    query,
  });

  if (filteredRemainingRows.length > 0) {
    return (
      filteredRemainingRows[
        Math.min(Math.max(deletedIndex, 0), filteredRemainingRows.length - 1)
      ]?.path ?? null
    );
  }

  return (
    remainingRows[Math.min(Math.max(deletedIndex, 0), remainingRows.length - 1)]
      ?.path ?? null
  );
}

export function createTokenEditorUrl({
  pathname,
  tokenSetType,
  tokenPath,
  tokenSearchQuery,
}: {
  pathname: string;
  tokenSetType: TokenSetType;
  tokenPath: string | null;
  tokenSearchQuery: string;
}) {
  const params = new URLSearchParams({
    set: tokenSetType,
  });

  if (tokenPath) {
    params.set('token', tokenPath);
  }

  if (tokenSearchQuery) {
    params.set('q', tokenSearchQuery);
  }

  return `${pathname}?${params.toString()}`;
}
