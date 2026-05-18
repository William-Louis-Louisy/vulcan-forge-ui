import { describe, expect, it } from 'vitest';
import { formatRelativeUpdatedDate } from './design-systems.utils';

describe('formatRelativeUpdatedDate', () => {
  it('formats the updated date as YYYY-MM-DD', () => {
    expect(
      formatRelativeUpdatedDate(new Date('2026-05-18T10:30:00.000Z')),
    ).toBe('2026-05-18');
  });
});
