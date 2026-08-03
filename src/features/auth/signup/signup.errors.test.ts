import { describe, expect, it } from 'vitest';
import { getSignupPersistenceError } from './signup.errors';

describe('getSignupPersistenceError', () => {
  it('maps unique-constraint races to a neutral signup state', () => {
    expect(getSignupPersistenceError({ code: 'P2002' })).toBe(
      'signupUnavailable',
    );
  });

  it('keeps unexpected persistence failures distinct', () => {
    expect(getSignupPersistenceError(new Error('database unavailable'))).toBe(
      'unexpected',
    );
  });
});
