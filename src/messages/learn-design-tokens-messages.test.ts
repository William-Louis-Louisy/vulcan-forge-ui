import { describe, expect, it } from 'vitest';
import { learnDesignTokensMessages } from './learn-design-tokens-messages';

function getKeys(value: object) {
  return Object.keys(value);
}

describe('learnDesignTokensMessages', () => {
  it('keeps EN and FR chapter structures aligned', () => {
    const en = learnDesignTokensMessages.en.LearnDesignTokensPage;
    const fr = learnDesignTokensMessages.fr.LearnDesignTokensPage;

    expect(getKeys(fr)).toEqual(getKeys(en));
    expect(getKeys(fr.openingProblem.cards)).toEqual(
      getKeys(en.openingProblem.cards),
    );
    expect(getKeys(fr.definition.anatomy)).toEqual(
      getKeys(en.definition.anatomy),
    );
    expect(getKeys(fr.categories.items)).toEqual(getKeys(en.categories.items));
    expect(getKeys(fr.productBridge.items)).toEqual(
      getKeys(en.productBridge.items),
    );
  });

  it('keeps the lesson scoped to token architecture before Themes', () => {
    const page = learnDesignTokensMessages.en.LearnDesignTokensPage;

    expect(page.primitive.tokenPath).toBe('color.primitive.brand.600');
    expect(page.semantic.semanticPath).toBe('color.semantic.action.primary');
    expect(page.references.reference).toBe('{color.primitive.brand.600}');
    expect(page.categories.items.color.title).toBe('Color');
    expect(page.categories.items.spacing.title).toBe('Spacing');
    expect(page.categories.items.radius.title).toBe('Radius');
    expect(page.categories.items.typography.title).toBe('Typography');
    expect(page.categories.items.motion.title).toBe('Motion');
    expect(page.continue.title).toContain('Themes');
  });

  it('states the current primitive and semantic product boundary explicitly', () => {
    const page = learnDesignTokensMessages.en.LearnDesignTokensPage;

    expect(page.semantic.boundary).toContain('not universal token types');
    expect(page.productBridge.boundary).toContain('color tokens');
  });
});
