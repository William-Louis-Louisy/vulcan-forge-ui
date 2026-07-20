import { describe, expect, it } from 'vitest';
import { createAccessibilityRuleSources } from './accessibility-rule-sources';

describe('createAccessibilityRuleSources', () => {
  it('normalizes locales and indexes valid token and component sources', () => {
    const sources = createAccessibilityRuleSources({
      defaultLocale: 'fr',
      supportedLocales: ['en', 'fr', 'en'],
      tokenSets: [
        {
          id: 'color-set',
          type: 'color',
          name: 'Colors',
          tokens: [
            {
              path: 'color.semantic.action.primary',
              type: 'color',
              value: '#7c3aed',
              description: {
                en: 'Primary action color',
                fr: "Couleur d'action principale",
              },
              status: 'ready',
            },
          ],
        },
      ],
      componentContracts: [
        {
          id: 'button-contract',
          type: 'button',
          name: 'Button',
          contract: {
            type: 'button',
            name: 'Button',
            purpose: {
              en: 'Triggers an action',
              fr: 'Déclenche une action',
            },
          },
        },
      ],
    });

    expect(sources.locales).toEqual(['fr', 'en']);
    expect(sources.invalidTokenSets).toEqual([]);
    expect(sources.invalidComponentContracts).toEqual([]);
    expect(sources.tokenSets).toHaveLength(1);
    expect(sources.componentContracts).toHaveLength(1);
    expect(
      sources.tokensByPath.get('color.semantic.action.primary'),
    ).toMatchObject({
      type: 'color',
      status: 'ready',
    });
  });

  it('keeps malformed token sets and component contracts traceable', () => {
    const sources = createAccessibilityRuleSources({
      defaultLocale: 'en',
      supportedLocales: ['en'],
      tokenSets: [
        {
          id: 'invalid-set',
          type: 'color',
          name: 'Invalid colors',
          tokens: { invalid: true },
        },
      ],
      componentContracts: [
        {
          id: 'invalid-contract',
          type: 'button',
          name: 'Invalid button',
          contract: {
            type: 'button',
          },
        },
      ],
    });

    expect(sources.tokenSets).toEqual([]);
    expect(sources.componentContracts).toEqual([]);
    expect(sources.invalidTokenSets).toEqual([
      expect.objectContaining({ id: 'invalid-set' }),
    ]);
    expect(sources.invalidComponentContracts).toEqual([
      expect.objectContaining({ id: 'invalid-contract' }),
    ]);
    expect(sources.tokensByPath.size).toBe(0);
  });
});
