import { describe, expect, it } from 'vitest';
import { errorSurfaceMessages } from './error-surface-messages';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) =>
    flattenKeys(nestedValue, prefix ? `${prefix}.${key}` : key),
  );
}

describe('errorSurfaceMessages', () => {
  it('keeps English and French message shapes aligned', () => {
    expect(flattenKeys(errorSurfaceMessages.en).sort()).toEqual(
      flattenKeys(errorSurfaceMessages.fr).sort(),
    );
  });

  it('provides distinct not-found, authentication, forbidden and recovery copy', () => {
    for (const locale of ['en', 'fr'] as const) {
      const messages = errorSurfaceMessages[locale].ErrorSurfaces;

      expect(messages.publicNotFound.code).toBe('404');
      expect(messages.appNotFound.code).toBe('404');
      expect(messages.forbidden.code).toBe('403');
      expect(messages.unexpected.code).toBe('500');
      expect(messages.global.code).toBe('500');
      expect(messages.authenticationRequired.title).not.toBe('');
      expect(messages.actions.retry).not.toBe('');
    }
  });
});
