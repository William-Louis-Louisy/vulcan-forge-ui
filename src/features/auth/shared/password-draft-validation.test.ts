import { describe, expect, it } from 'vitest';
import {
  getPasswordDraftIssue,
  passwordsMatchDraft,
} from './password-draft-validation';

describe('password draft validation', () => {
  it('uses the shared Unicode code-point policy', () => {
    expect(getPasswordDraftIssue('short')).toBe('passwordMinLength');
    expect(getPasswordDraftIssue('a'.repeat(15))).toBeNull();
    expect(getPasswordDraftIssue('a'.repeat(129))).toBe('passwordTooLong');
    expect(getPasswordDraftIssue('😀'.repeat(15))).toBeNull();
  });

  it('compares NFC-normalized confirmation values', () => {
    expect(
      passwordsMatchDraft({
        password: 'Mot de passe très long',
        confirmation: 'Mot de passe très long',
      }),
    ).toBe(true);
    expect(
      passwordsMatchDraft({
        password: 'one very long password',
        confirmation: 'another very long password',
      }),
    ).toBe(false);
  });

  it('does not report an empty confirmation as a mismatch', () => {
    expect(
      passwordsMatchDraft({
        password: 'one very long password',
        confirmation: '',
      }),
    ).toBe(true);
  });
});
