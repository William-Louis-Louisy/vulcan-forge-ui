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

export function createTokenEditorUrl({
  projectSlug,
  tokenSetType,
  tokenPath,
  tokenSearchQuery,
}: {
  projectSlug: string;
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

  return `/app/design-systems/${projectSlug}/tokens?${params.toString()}`;
}
