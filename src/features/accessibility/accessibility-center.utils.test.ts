import { describe, expect, it } from 'vitest';
import { createAccessibilityCenterReport } from './accessibility-center.utils';

const testDate = new Date('2026-01-01T00:00:00.000Z');

describe('createAccessibilityCenterReport', () => {
  it('returns a critical report when the token set is malformed', () => {
    expect(
      createAccessibilityCenterReport({
        colorTokenSetTokens: { invalid: true },
        themes: [],
      }),
    ).toMatchObject({
      score: 75,
      status: 'critical',
      isReadable: false,
      issues: [
        {
          code: 'invalidColorTokenSet',
          severity: 'critical',
          scope: 'tokenSet',
        },
      ],
    });
  });

  it('evaluates theme contrast pairs from resolved theme token references', () => {
    const report = createAccessibilityCenterReport({
      colorTokenSetTokens: [
        {
          path: 'color.primitive.neutral.0',
          type: 'color',
          value: '#ffffff',
          status: 'ready',
        },
        {
          path: 'color.primitive.neutral.950',
          type: 'color',
          value: '#111827',
          status: 'ready',
        },
        {
          path: 'color.semantic.background.app',
          type: 'color',
          value: '{color.primitive.neutral.0}',
          reference: '{color.primitive.neutral.0}',
          status: 'ready',
        },
        {
          path: 'color.semantic.content.primary',
          type: 'color',
          value: '{color.primitive.neutral.950}',
          reference: '{color.primitive.neutral.950}',
          status: 'ready',
        },
      ],
      themes: [
        {
          id: 'light-theme',
          mode: 'light',
          name: 'Light',
          tokens: {
            color: {
              background: '{color.semantic.background.app}',
              content: '{color.semantic.content.primary}',
              surface: '{color.primitive.neutral.0}',
              muted: '{color.primitive.neutral.950}',
              accent: '{color.primitive.neutral.950}',
            },
          },
          updatedAt: testDate,
        },
      ],
    });

    expect(report.isReadable).toBe(true);
    expect(report.summary.themeCount).toBe(1);
    expect(report.summary.pairCount).toBeGreaterThan(0);

    expect(report.contrastPairs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          themeId: 'light-theme',
          themeMode: 'light',
          themeName: 'Light',
          pairId: 'contentOnBackground',
          foregroundRole: 'content',
          backgroundRole: 'background',
          foregroundTokenPath: 'color.semantic.content.primary',
          backgroundTokenPath: 'color.semantic.background.app',
          foregroundValue: '#111827',
          backgroundValue: '#ffffff',
          status: 'pass',
        }),
      ]),
    );
  });

  it('adds token resolution issues to the report', () => {
    const report = createAccessibilityCenterReport({
      colorTokenSetTokens: [
        {
          path: 'color.semantic.content.primary',
          type: 'color',
          value: '{color.semantic.missing}',
          reference: '{color.semantic.missing}',
          status: 'ready',
        },
      ],
      themes: [],
    });

    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'tokenResolutionError',
          severity: 'critical',
          scope: 'tokenResolution',
          tokenPath: 'color.semantic.content.primary',
        }),
        expect.objectContaining({
          code: 'missingThemes',
          severity: 'critical',
          scope: 'theme',
        }),
      ]),
    );
  });

  it('creates traceable contrast issues when a theme pair fails', () => {
    const report = createAccessibilityCenterReport({
      colorTokenSetTokens: [
        {
          path: 'color.primitive.low.1',
          type: 'color',
          value: '#777777',
          status: 'ready',
        },
        {
          path: 'color.primitive.low.2',
          type: 'color',
          value: '#777778',
          status: 'ready',
        },
      ],
      themes: [
        {
          id: 'light-theme',
          mode: 'light',
          name: 'Light',
          tokens: {
            color: {
              background: '{color.primitive.low.1}',
              content: '{color.primitive.low.2}',
            },
          },
          updatedAt: testDate,
        },
      ],
    });

    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'contrastFail',
          severity: 'critical',
          scope: 'themeContrast',
          themeId: 'light-theme',
          themeMode: 'light',
          themeName: 'Light',
          pairId: 'contentOnBackground',
          foregroundRole: 'content',
          backgroundRole: 'background',
          foregroundTokenPath: 'color.primitive.low.2',
          backgroundTokenPath: 'color.primitive.low.1',
          foregroundValue: '#777778',
          backgroundValue: '#777777',
        }),
      ]),
    );
  });

  it('merges expanded token and component checks into score and summary', () => {
    const colorTokens = [
      {
        path: 'color.semantic.action.primary',
        type: 'color',
        value: '#7c3aed',
        description: {
          en: 'Primary action color',
        },
        status: 'ready',
      },
    ];
    const report = createAccessibilityCenterReport({
      colorTokenSetTokens: colorTokens,
      themes: [],
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr'],
      tokenSets: [
        {
          id: 'color-set',
          type: 'color',
          name: 'Colors',
          tokens: colorTokens,
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
            states: [
              {
                key: 'focus-visible',
                label: {
                  en: 'Focus visible',
                  fr: 'Focus visible',
                },
              },
            ],
            accessibility: [
              {
                key: 'accessible-name',
                description: {
                  en: 'Expose an accessible name',
                  fr: 'Expose un nom accessible',
                },
                severity: 'critical',
              },
            ],
            tokenBindings: [
              {
                key: 'background',
                tokenType: 'color',
                tokenPath: 'color.semantic.action.primary',
              },
            ],
          },
        },
      ],
    });

    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'missingTokenDescription',
          tokenPath: 'color.semantic.action.primary',
          missingLocales: ['fr'],
        }),
        expect.objectContaining({
          code: 'missingThemes',
          severity: 'critical',
        }),
      ]),
    );
    expect(report.summary.warningIssues).toBe(1);
    expect(report.summary.criticalIssues).toBe(1);
    expect(report.score).toBe(65);
  });
});
