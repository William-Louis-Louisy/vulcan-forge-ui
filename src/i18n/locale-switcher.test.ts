import { describe, expect, it } from 'vitest';
import { getLocaleSwitcherOptions } from './locale-switcher';

describe('getLocaleSwitcherOptions', () => {
  it('returns one option per supported locale', () => {
    const options = getLocaleSwitcherOptions('en');

    expect(options).toEqual([
      {
        locale: 'en',
        label: 'English',
        shortLabel: 'EN',
        isActive: true,
      },
      {
        locale: 'fr',
        label: 'Français',
        shortLabel: 'FR',
        isActive: false,
      },
    ]);
  });

  it('marks French as active when the current locale is fr', () => {
    const options = getLocaleSwitcherOptions('fr');

    expect(options).toEqual([
      {
        locale: 'en',
        label: 'English',
        shortLabel: 'EN',
        isActive: false,
      },
      {
        locale: 'fr',
        label: 'Français',
        shortLabel: 'FR',
        isActive: true,
      },
    ]);
  });
});
