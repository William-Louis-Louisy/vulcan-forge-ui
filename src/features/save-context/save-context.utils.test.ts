import {
  saveContextMaxAgeMs,
  parseSaveContextSnapshot,
  createSaveContextSnapshot,
  isSaveContextSnapshotFresh,
} from './save-context.utils';
import { describe, expect, it } from 'vitest';

describe('save context utils', () => {
  it('creates a save context snapshot', () => {
    expect(
      createSaveContextSnapshot({
        pathname: '/fr/app/design-systems/demo/tokens',
        contextId: 'tokens',
        scrollTop: 420,
        scrollLeft: 0,
        now: 1000,
      }),
    ).toEqual({
      pathname: '/fr/app/design-systems/demo/tokens',
      contextId: 'tokens',
      scrollTop: 420,
      scrollLeft: 0,
      createdAt: 1000,
    });
  });

  it('parses a valid snapshot', () => {
    expect(
      parseSaveContextSnapshot(
        JSON.stringify({
          pathname: '/fr/app/settings',
          contextId: 'settings',
          scrollTop: 120,
          scrollLeft: 0,
          createdAt: 1000,
        }),
      ),
    ).toMatchObject({
      pathname: '/fr/app/settings',
      contextId: 'settings',
      scrollTop: 120,
    });
  });

  it('rejects malformed snapshots', () => {
    expect(parseSaveContextSnapshot('{nope')).toBeNull();
    expect(
      parseSaveContextSnapshot(JSON.stringify({ scrollTop: 10 })),
    ).toBeNull();
  });

  it('detects stale snapshots', () => {
    const snapshot = createSaveContextSnapshot({
      pathname: '/fr/app/settings',
      contextId: 'settings',
      scrollTop: 120,
      scrollLeft: 0,
      now: 1000,
    });

    expect(
      isSaveContextSnapshotFresh({
        snapshot,
        now: 1000 + saveContextMaxAgeMs - 1,
      }),
    ).toBe(true);

    expect(
      isSaveContextSnapshotFresh({
        snapshot,
        now: 1000 + saveContextMaxAgeMs + 1,
      }),
    ).toBe(false);
  });
});
