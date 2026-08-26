import { describe, expect, it } from 'vitest';
import { learnComponentsMessages } from './learn-components-messages';

function getKeys(value: object) {
  return Object.keys(value);
}

describe('learnComponentsMessages', () => {
  it('keeps EN and FR chapter structures aligned', () => {
    const en = learnComponentsMessages.en.LearnComponentsPage;
    const fr = learnComponentsMessages.fr.LearnComponentsPage;

    expect(getKeys(fr)).toEqual(getKeys(en));
    expect(getKeys(fr.openingProblem.questions)).toEqual(
      getKeys(en.openingProblem.questions),
    );
    expect(getKeys(fr.definition.items)).toEqual(getKeys(en.definition.items));
    expect(getKeys(fr.anatomy.parts)).toEqual(getKeys(en.anatomy.parts));
    expect(getKeys(fr.axes.items)).toEqual(getKeys(en.axes.items));
    expect(getKeys(fr.rules.items)).toEqual(getKeys(en.rules.items));
    expect(getKeys(fr.bindings.items)).toEqual(getKeys(en.bindings.items));
    expect(getKeys(fr.accessibility.items)).toEqual(
      getKeys(en.accessibility.items),
    );
    expect(getKeys(fr.structuredSource.items)).toEqual(
      getKeys(en.structuredSource.items),
    );
    expect(getKeys(fr.productBridge.items)).toEqual(
      getKeys(en.productBridge.items),
    );
    expect(getKeys(fr.checkpoint.items)).toEqual(getKeys(en.checkpoint.items));
  });

  it('teaches the current Button seed rather than an invented component model', () => {
    const page = learnComponentsMessages.en.LearnComponentsPage;

    expect(page.definition.instanceMeta).toBe('primary · md · loading');
    expect(page.axes.items.variant.values).toBe('primary · secondary');
    expect(page.axes.items.size.values).toBe('sm · md · lg');
    expect(page.axes.items.state.values).toBe(
      'focusVisible · disabled · loading',
    );
    expect(page.bindings.items.background.path).toBe(
      'color.semantic.action.primary',
    );
    expect(page.bindings.items.background.value).toBe('#FF8731');
    expect(page.bindings.items.radius.path).toBe('radius.md');
    expect(page.bindings.items.radius.value).toBe('0.5rem');
    expect(page.bindings.items.paddingX.path).toBe('spacing.4');
    expect(page.bindings.items.paddingX.value).toBe('1rem');
  });

  it('states the current product boundaries explicitly', () => {
    const page = learnComponentsMessages.en.LearnComponentsPage;

    expect(page.productBridge.types).toBe(
      'button · textField · card · alert · dialog',
    );
    expect(page.productBridge.boundary).toContain('SearchBar');
    expect(page.productBridge.boundary).toContain('freeform component canvas');
    expect(page.bindings.boundary).toContain('directly from Token Sets');
    expect(page.bindings.boundary).toContain(
      'do not currently reference Theme roles',
    );
    expect(page.continue.title).toBe('Accessibility');
  });
});
