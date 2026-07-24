import {
  createDocumentationSourceDataQualityReport,
  createAiInstructionsSourceDataQualityReport,
} from './source-data-quality';
import { describe, expect, it } from 'vitest';

describe('source data quality report', () => {
  it('reports incomplete documentation source data', () => {
    const report = createDocumentationSourceDataQualityReport({
      project: {
        name: 'Aurora',
        description: null,
        defaultLocale: 'en',
        supportedLocales: ['en', 'fr'],
      },
      brand: null,
      tokens: [],
      themes: [],
      components: [],
      accessibility: null,
    });

    expect(report.status).toBe('insufficient');
    expect(report.summary.critical).toBeGreaterThan(0);

    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'missingTokens',
          severity: 'critical',
        }),
        expect.objectContaining({
          code: 'missingComponents',
          severity: 'critical',
        }),
        expect.objectContaining({
          code: 'missingThemes',
          severity: 'warning',
        }),
        expect.objectContaining({
          code: 'missingAccessibilityReport',
          severity: 'warning',
        }),
      ]),
    );
  });

  it('reports incomplete component data for AI instructions', () => {
    const report = createAiInstructionsSourceDataQualityReport({
      project: {
        name: 'Aurora',
        description: 'A design system.',
        defaultLocale: 'en',
        supportedLocales: ['en', 'fr'],
      },
      tokens: [
        {
          path: 'color.primitive.accent.primary',
          type: 'color',
          value: '#ff8731',
          status: 'ready',
        },
      ],
      components: [
        {
          type: 'button',
          name: 'Button',
          purpose: {
            en: 'Triggers an action.',
            fr: 'Déclenche une action.',
          },
          status: 'ready',
          anatomy: [],
          variants: [],
          states: [],
          accessibility: [],
          forbiddenPatterns: [],
          sizes: [],
          tokenBindings: [],
        },
      ],
    });

    expect(report.status).toBe('partial');

    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'componentMissingVariants',
          label: 'Button',
        }),
        expect.objectContaining({
          code: 'componentMissingAccessibilityRules',
          label: 'Button',
        }),
      ]),
    );
  });
});
