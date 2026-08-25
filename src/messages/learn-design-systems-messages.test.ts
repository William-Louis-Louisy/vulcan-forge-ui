import { describe, expect, it } from 'vitest';
import { learnDesignSystemsMessages } from './learn-design-systems-messages';

function getKeys(value: object) {
  return Object.keys(value);
}

describe('learnDesignSystemsMessages', () => {
  it('keeps EN and FR chapter structures aligned', () => {
    expect(getKeys(learnDesignSystemsMessages.fr.LearnDesignSystemsPage)).toEqual(
      getKeys(learnDesignSystemsMessages.en.LearnDesignSystemsPage),
    );

    expect(
      getKeys(learnDesignSystemsMessages.fr.LearnDesignSystemsPage.definition.parts),
    ).toEqual(
      getKeys(learnDesignSystemsMessages.en.LearnDesignSystemsPage.definition.parts),
    );

    expect(
      getKeys(learnDesignSystemsMessages.fr.LearnDesignSystemsPage.whyMatters.items),
    ).toEqual(
      getKeys(learnDesignSystemsMessages.en.LearnDesignSystemsPage.whyMatters.items),
    );
  });

  it('keeps the chapter concept-first and scoped to Design System foundations', () => {
    const page = learnDesignSystemsMessages.en.LearnDesignSystemsPage;

    expect(page.hero.learnerQuestion).toContain('Design System');
    expect(page.distinction.title).toContain('component library');
    expect(page.demo.bridge).toContain('shared meaning');
    expect(page.continue.title).toContain('Design Tokens');
  });
});
