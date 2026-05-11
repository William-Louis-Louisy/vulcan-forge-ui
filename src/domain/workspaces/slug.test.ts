import { describe, expect, it } from 'vitest';
import { createPersonalWorkspaceSlug } from './slug';

describe('createPersonalWorkspaceSlug', () => {
  it('creates a deterministic personal workspace slug', () => {
    expect(createPersonalWorkspaceSlug('user_123')).toBe('personal-user_123');
  });
});
