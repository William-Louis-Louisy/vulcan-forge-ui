import { describe, expect, it } from 'vitest';
import { learnThemesMessages } from './learn-themes-messages';

function getKeys(value: object) {
  return Object.keys(value);
}

describe('learnThemesMessages', () => {
  it('keeps EN and FR chapter structures aligned', () => {
    const en = learnThemesMessages.en.LearnThemesPage;
    const fr = learnThemesMessages.fr.LearnThemesPage;

    expect(getKeys(fr)).toEqual(getKeys(en));
    expect(getKeys(fr.roles.items)).toEqual(getKeys(en.roles.items));
    expect(getKeys(fr.accessibility.items)).toEqual(
      getKeys(en.accessibility.items),
    );
    expect(getKeys(fr.productBridge.items)).toEqual(
      getKeys(en.productBridge.items),
    );
    expect(getKeys(fr.checkpoint.items)).toEqual(getKeys(en.checkpoint.items));
  });

  it('teaches stable roles with different Light and Dark mappings', () => {
    const page = learnThemesMessages.en.LearnThemesPage;

    expect(page.definition.role).toBe('content');
    expect(page.definition.lightReference).toBe(
      '{color.primitive.neutral.950}',
    );
    expect(page.definition.darkReference).toBe('{color.primitive.neutral.100}');
    expect(page.roles.items.accent.lightValue).toBe('#586644');
    expect(page.roles.items.accent.darkValue).toBe('#FF8731');
  });

  it('states the current VulcanForgeUI Theme boundary explicitly', () => {
    const page = learnThemesMessages.en.LearnThemesPage;

    expect(page.productBridge.description).toContain('Light and Dark');
    expect(page.productBridge.boundary).toContain('no Sepia mode');
    expect(page.productBridge.items.custom).toContain('existing Light or Dark');
    expect(page.broaderConcept.caution).toContain('does not mean');
    expect(page.continue.title).toBe('Components');
  });
});
