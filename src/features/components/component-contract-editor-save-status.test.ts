import { describe, expect, it } from 'vitest';

import { getComponentContractEditorSaveStatus } from './component-contract-editor-save-status';

describe('getComponentContractEditorSaveStatus', () => {
  it.each([
    {
      name: 'saving while the server action is pending',
      input: {
        isPending: true,
        hasUnsavedChanges: true,
        hasValidationError: false,
        hasFormError: false,
      },
      expected: 'saving',
    },
    {
      name: 'error when the local draft is invalid',
      input: {
        isPending: false,
        hasUnsavedChanges: true,
        hasValidationError: true,
        hasFormError: false,
      },
      expected: 'error',
    },
    {
      name: 'error when the last save failed',
      input: {
        isPending: false,
        hasUnsavedChanges: true,
        hasValidationError: false,
        hasFormError: true,
      },
      expected: 'error',
    },
    {
      name: 'unsaved for a valid dirty draft',
      input: {
        isPending: false,
        hasUnsavedChanges: true,
        hasValidationError: false,
        hasFormError: false,
      },
      expected: 'unsaved',
    },
    {
      name: 'saved for an unchanged valid draft',
      input: {
        isPending: false,
        hasUnsavedChanges: false,
        hasValidationError: false,
        hasFormError: false,
      },
      expected: 'saved',
    },
  ])('returns $expected when $name', ({ input, expected }) => {
    expect(getComponentContractEditorSaveStatus(input)).toBe(expected);
  });
});
