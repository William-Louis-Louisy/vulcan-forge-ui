import {
  parseUserSettings,
  userSettingsSchema,
  defaultUserSettings,
} from './user-settings.schema';
import { describe, expect, it } from 'vitest';

describe('user settings schema', () => {
  it('accepts valid user settings', () => {
    expect(
      userSettingsSchema.safeParse({
        locale: 'fr',
        themePreference: 'dark',
      }).success,
    ).toBe(true);
  });

  it('rejects invalid theme preferences', () => {
    expect(
      userSettingsSchema.safeParse({
        locale: 'fr',
        themePreference: 'sepia',
      }).success,
    ).toBe(false);
  });

  it('falls back to default settings when input is invalid', () => {
    expect(parseUserSettings({ invalid: true })).toEqual(defaultUserSettings);
  });
});
