import type { TokenRowData, TokenSetType } from '../tokens-editor.utils';

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
}: {
  activeRows: TokenRowData[];
  filteredRows: TokenRowData[];
  selectedTokenPath: string | null;
}) {
  return (
    activeRows.find((row) => row.path === selectedTokenPath) ??
    filteredRows[0] ??
    activeRows[0] ??
    null
  );
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
