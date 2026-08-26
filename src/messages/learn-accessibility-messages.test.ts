import { describe, expect, it } from 'vitest';
import { learnAccessibilityMessages } from './learn-accessibility-messages';

function flattenKeys(
  value: Record<string, unknown>,
  prefix = '',
): string[] {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof child === 'object' && child !== null && !Array.isArray(child)) {
      return flattenKeys(child as Record<string, unknown>, path);
    }

    return [path];
  });
}

describe('learnAccessibilityMessages', () => {
  it('keeps EN and FR chapter structures aligned', () => {
    const en = learnAccessibilityMessages.en.LearnAccessibilityPage;
    const fr = learnAccessibilityMessages.fr.LearnAccessibilityPage;

    expect(flattenKeys(fr).sort()).toEqual(flattenKeys(en).sort());
  });

  it('uses the current Demo Theme values and contrast results', () => {
    const page = learnAccessibilityMessages.en.LearnAccessibilityPage;

    expect(page.openingProblem.backgroundValue).toBe('#F7F3EB');
    expect(page.openingProblem.correct.token).toBe(
      'color.primitive.neutral.700',
    );
    expect(page.openingProblem.correct.value).toBe('#3A4454');
    expect(page.openingProblem.correct.ratio).toBe('8.89:1');
    expect(page.openingProblem.drifted.token).toBe(
      'color.primitive.neutral.400',
    );
    expect(page.openingProblem.drifted.value).toBe('#A0B1CA');
    expect(page.openingProblem.drifted.ratio).toBe('1.97:1');
  });

  it('states the current automated contrast and score boundaries explicitly', () => {
    const page = learnAccessibilityMessages.en.LearnAccessibilityPage;

    expect(page.contrast.rows.pass.range).toBe('≥ 4.5:1');
    expect(page.contrast.rows.warning.range).toBe('3.0–4.49:1');
    expect(page.contrast.rows.fail.range).toBe('< 3.0:1');
    expect(page.contrast.standardContext).toContain(
      'every configured Theme pair using its normal-text mode',
    );
    expect(page.score.formula).toBe(
      '100 − (critical issues × 25) − (warnings × 10)',
    );
    expect(page.score.disclaimer).toContain('100/100');
    expect(page.score.disclaimer).toContain('not a percentage of WCAG');
  });

  it('keeps automation distinct from human accessibility validation', () => {
    const page = learnAccessibilityMessages.en.LearnAccessibilityPage;

    expect(page.focus.productRule).toContain('focusVisible');
    expect(page.focus.manualRule).toContain('running application');
    expect(page.automation.principle).toContain('tools alone cannot determine');
    expect(page.productBridge.boundary).toContain(
      'does not crawl or execute a downstream application',
    );
    expect(page.productBridge.boundary).toContain(
      'does not',
    );
    expect(page.productBridge.boundary).toContain('certify WCAG conformance');
    expect(page.continue.title).toBe('Documentation & Delivery');
  });

  it('keeps French guillemets attached to their quoted words', () => {
    const page = learnAccessibilityMessages.fr.LearnAccessibilityPage;

    expect(page.misconception.title).toBe(
      '« Aucun problème automatisé » ne signifie pas « accessible ».',
    );
  });
});
