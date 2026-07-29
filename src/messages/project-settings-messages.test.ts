import { describe, expect, it } from 'vitest';

import { projectSettingsMessages } from './project-settings-messages';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) =>
    flattenKeys(nestedValue, prefix ? `${prefix}.${key}` : key),
  );
}

describe('projectSettingsMessages', () => {
  it('keeps English and French message shapes aligned', () => {
    expect(flattenKeys(projectSettingsMessages.en).sort()).toEqual(
      flattenKeys(projectSettingsMessages.fr).sort(),
    );
  });
});
