export const saveContextStorageKey = 'vulcanforgeui:pending-save-context';

export const saveContextMaxAgeMs = 30_000;

export type SaveContextSnapshot = {
  pathname: string;
  contextId: string;
  scrollTop: number;
  scrollLeft: number;
  createdAt: number;
};

export function createSaveContextSnapshot({
  pathname,
  contextId,
  scrollTop,
  scrollLeft,
  now = Date.now(),
}: {
  pathname: string;
  contextId: string;
  scrollTop: number;
  scrollLeft: number;
  now?: number;
}): SaveContextSnapshot {
  return {
    pathname,
    contextId,
    scrollTop,
    scrollLeft,
    createdAt: now,
  };
}

export function parseSaveContextSnapshot(
  value: string | null,
): SaveContextSnapshot | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<SaveContextSnapshot>;

    if (
      typeof parsed.pathname !== 'string' ||
      typeof parsed.contextId !== 'string' ||
      typeof parsed.scrollTop !== 'number' ||
      typeof parsed.scrollLeft !== 'number' ||
      typeof parsed.createdAt !== 'number'
    ) {
      return null;
    }

    return {
      pathname: parsed.pathname,
      contextId: parsed.contextId,
      scrollTop: parsed.scrollTop,
      scrollLeft: parsed.scrollLeft,
      createdAt: parsed.createdAt,
    };
  } catch {
    return null;
  }
}

export function isSaveContextSnapshotFresh({
  snapshot,
  now = Date.now(),
}: {
  snapshot: SaveContextSnapshot;
  now?: number;
}) {
  return now - snapshot.createdAt <= saveContextMaxAgeMs;
}
