import { describe, expect, it } from 'vitest';

import { getActionBackedProjectSaveStatus } from './project-save-status.utils';

describe('getActionBackedProjectSaveStatus', () => {
  it('prioritizes an active save over stale or invalid states', () => {
    expect(
      getActionBackedProjectSaveStatus({
        isPending: true,
        hasUnsavedChanges: true,
        hasValidationError: true,
        hasCurrentActionError: true,
      }),
    ).toBe('saving');
  });

  it('reports current validation and action failures as errors', () => {
    expect(
      getActionBackedProjectSaveStatus({
        isPending: false,
        hasUnsavedChanges: true,
        hasValidationError: true,
        hasCurrentActionError: false,
      }),
    ).toBe('error');

    expect(
      getActionBackedProjectSaveStatus({
        isPending: false,
        hasUnsavedChanges: false,
        hasValidationError: false,
        hasCurrentActionError: true,
      }),
    ).toBe('error');
  });

  it('distinguishes unsaved and saved drafts', () => {
    expect(
      getActionBackedProjectSaveStatus({
        isPending: false,
        hasUnsavedChanges: true,
        hasValidationError: false,
        hasCurrentActionError: false,
      }),
    ).toBe('unsaved');

    expect(
      getActionBackedProjectSaveStatus({
        isPending: false,
        hasUnsavedChanges: false,
        hasValidationError: false,
        hasCurrentActionError: false,
      }),
    ).toBe('saved');
  });
});
