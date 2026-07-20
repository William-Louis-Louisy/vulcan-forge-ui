import { describe, expect, it } from 'vitest';
import { createExpandedAccessibilityIssues } from './accessibility-automated-rules';

const completeColorTokenSet = {
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
};

describe('createExpandedAccessibilityIssues', () => {
  it('creates one traceable issue per ready token with missing localized descriptions', () => {
    const issues = createExpandedAccessibilityIssues({
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr'],
      tokenSets: [
        {
          id: 'spacing-set',
          type: 'spacing',
          name: 'Spacing',
          tokens: [
            {
              path: 'spacing.4',
              type: 'spacing',
              value: '1rem',
              description: {
                en: 'Default spacing',
              },
              status: 'ready',
            },
            {
              path: 'spacing.8',
              type: 'spacing',
              value: '2rem',
              status: 'draft',
            },
          ],
        },
      ],
      componentContracts: [],
    });

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'missingTokenDescription',
        severity: 'warning',
        scope: 'tokenDocumentation',
        tokenPath: 'spacing.4',
        tokenSetName: 'Spacing',
        affectedField: 'description',
        missingLocales: ['fr'],
      }),
    ]);
  });

  it('groups missing component translations by component field', () => {
    const issues = createExpandedAccessibilityIssues({
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr'],
      tokenSets: [completeColorTokenSet],
      componentContracts: [
        {
          id: 'card-contract',
          type: 'card',
          name: 'Card',
          contract: {
            type: 'card',
            name: 'Card',
            purpose: {
              en: 'Groups related content',
            },
            anatomy: ['root', 'content'],
          },
        },
      ],
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'missingComponentLocalization',
          componentId: 'card-contract',
          componentName: 'Card',
          affectedField: 'purpose',
          affectedCount: 1,
          missingLocales: ['fr'],
        }),
        expect.objectContaining({
          code: 'missingComponentLocalization',
          componentId: 'card-contract',
          affectedField: 'anatomy',
          affectedCount: 2,
          missingLocales: ['fr'],
        }),
      ]),
    );
  });

  it('detects interactive contract, focus-visible and token binding problems', () => {
    const issues = createExpandedAccessibilityIssues({
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr'],
      tokenSets: [completeColorTokenSet],
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
            states: [
              {
                key: 'hover',
                label: {
                  en: 'Hover',
                  fr: 'Survol',
                },
              },
            ],
            tokenBindings: [
              {
                key: 'background',
                tokenType: 'color',
                tokenPath: 'color.semantic.missing',
              },
              {
                key: 'padding',
                tokenType: 'spacing',
                tokenPath: 'color.semantic.action.primary',
              },
            ],
          },
        },
      ],
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'missingComponentAccessibilityRules',
          severity: 'warning',
          componentName: 'Button',
        }),
        expect.objectContaining({
          code: 'missingComponentFocusVisibleState',
          severity: 'critical',
          affectedField: 'focusVisible',
        }),
        expect.objectContaining({
          code: 'unresolvedComponentTokenBinding',
          severity: 'critical',
          bindingKey: 'background',
          tokenPath: 'color.semantic.missing',
        }),
        expect.objectContaining({
          code: 'componentTokenTypeMismatch',
          severity: 'warning',
          bindingKey: 'padding',
          expectedTokenType: 'spacing',
          actualTokenType: 'color',
        }),
      ]),
    );
  });

  it('keeps malformed contracts traceable and issue ids stable', () => {
    const input = {
      defaultLocale: 'en' as const,
      supportedLocales: ['en', 'fr'] as const,
      tokenSets: [completeColorTokenSet],
      componentContracts: [
        {
          id: 'invalid-contract',
          type: 'dialog' as const,
          name: 'Dialog',
          contract: {
            type: 'dialog',
          },
        },
      ],
    };

    const firstIssues = createExpandedAccessibilityIssues({
      ...input,
      supportedLocales: [...input.supportedLocales],
    });
    const secondIssues = createExpandedAccessibilityIssues({
      ...input,
      supportedLocales: [...input.supportedLocales],
    });

    expect(firstIssues).toEqual([
      expect.objectContaining({
        code: 'invalidComponentContract',
        severity: 'critical',
        scope: 'componentContract',
        componentId: 'invalid-contract',
        componentName: 'Dialog',
      }),
    ]);
    expect(secondIssues.map((issue) => issue.id)).toEqual(
      firstIssues.map((issue) => issue.id),
    );
  });
});
