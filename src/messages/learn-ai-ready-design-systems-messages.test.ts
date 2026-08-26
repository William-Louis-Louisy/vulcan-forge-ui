import { describe, expect, it } from 'vitest';
import { learnAiReadyDesignSystemsMessages } from './learn-ai-ready-design-systems-messages';

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

describe('learnAiReadyDesignSystemsMessages', () => {
  it('keeps EN and FR chapter structures aligned', () => {
    const en =
      learnAiReadyDesignSystemsMessages.en.LearnAiReadyDesignSystemsPage;
    const fr =
      learnAiReadyDesignSystemsMessages.fr.LearnAiReadyDesignSystemsPage;

    expect(flattenKeys(fr).sort()).toEqual(flattenKeys(en).sort());
  });

  it('teaches the current AI Instructions profile truthfully', () => {
    const page =
      learnAiReadyDesignSystemsMessages.en.LearnAiReadyDesignSystemsPage;

    expect(page.strictness.levels.balanced.label).toBe('Balanced');
    expect(page.strictness.levels.strict.label).toBe('Strict');
    expect(page.strictness.levels.veryStrict.label).toBe('Very strict');
    expect(page.productBridge.items.sections).toContain('Token rules');
    expect(page.productBridge.items.sections).toContain('Component rules');
    expect(page.productBridge.items.sections).toContain('Accessibility rules');
    expect(page.productBridge.items.sections).toContain('Forbidden patterns');
    expect(page.context.antiHallucination).toContain('anti-hallucination');
  });

  it('keeps guidance distinct from orchestration, synchronization and guarantees', () => {
    const page =
      learnAiReadyDesignSystemsMessages.en.LearnAiReadyDesignSystemsPage;

    expect(page.boundary.items.execution.description).toContain(
      'does not run an external assistant',
    );
    expect(page.boundary.items.sync.description).toContain(
      'does not automatically update',
    );
    expect(page.boundary.items.monitoring.description).toContain(
      'does not observe',
    );
    expect(page.boundary.items.guarantee.description).toContain(
      'cannot guarantee',
    );
    expect(page.misconception.title).toContain('AI-controlled');
  });

  it('uses French typographic guillemets with narrow no-break spaces', () => {
    const page =
      learnAiReadyDesignSystemsMessages.fr.LearnAiReadyDesignSystemsPage;

    expect(page.openingProblem.description).toContain(
      '«\u202fCrée un bouton principal cohérent avec l’application.\u202f»',
    );
    expect(page.context.items.forbidden.description).toContain(
      '«\u202fà ne pas faire\u202f»',
    );
    expect(page.misconception.title).toBe(
      '«\u202fPrêt pour l’IA\u202f» ne signifie pas «\u202fcontrôlé par l’IA\u202f».',
    );
  });

  it('ends the French checkpoint as a natural list rather than semicolon chaining', () => {
    const items = Object.values(
      learnAiReadyDesignSystemsMessages.fr.LearnAiReadyDesignSystemsPage
        .checkpoint.items,
    );

    expect(items.every((item) => !item.endsWith(';'))).toBe(true);
  });
});
