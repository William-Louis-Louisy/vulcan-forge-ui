import { describe, expect, it } from 'vitest';
import { getDisplayNameFromEmail } from './dashboard.utils';

describe('getDisplayNameFromEmail', () => {
  it('returns the local part of an email', () => {
    expect(getDisplayNameFromEmail('william@example.com')).toBe('william');
  });

  it('returns null when the email is missing', () => {
    expect(getDisplayNameFromEmail(null)).toBeNull();
    expect(getDisplayNameFromEmail(undefined)).toBeNull();
  });

  it('returns null when the local part is empty', () => {
    expect(getDisplayNameFromEmail('@example.com')).toBeNull();
  });
});
