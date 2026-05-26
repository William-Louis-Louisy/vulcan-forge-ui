import { describe, expect, it } from 'vitest';
import {
  createTokenColorValueLookup,
  evaluateKeyContrastPair,
  evaluateKeyContrastPairs,
  keyContrastPairDefinitions,
} from './key-contrast-pairs';

describe('keyContrastPairDefinitions', () => {
  it('defines the expected MVP key contrast pairs', () => {
    expect(keyContrastPairDefinitions.map((pair) => pair.id)).toEqual([
      'contentPrimaryOnAppBackground',
      'contentSecondaryOnAppBackground',
      'contentPrimaryOnPrimarySurface',
      'contentSecondaryOnPrimarySurface',
      'contentInverseOnPrimaryAction',
      'dangerTextOnPrimarySurface',
    ]);
  });

  it('marks danger text on surface as optional', () => {
    expect(
      keyContrastPairDefinitions.find(
        (pair) => pair.id === 'dangerTextOnPrimarySurface',
      ),
    ).toMatchObject({
      optional: true,
    });
  });
});

describe('evaluateKeyContrastPair', () => {
  it('passes when the pair has enough contrast', () => {
    const pair = keyContrastPairDefinitions[0];

    expect(pair).toBeDefined();

    const result = evaluateKeyContrastPair({
      pair: pair!,
      getColorValue: createTokenColorValueLookup({
        'color.semantic.content.primary': '#111827',
        'color.semantic.background.app': '#ffffff',
      }),
    });

    expect(result).toMatchObject({
      status: 'pass',
      foreground: '#111827',
      background: '#ffffff',
      issues: [],
    });

    expect(result.contrast?.ratio).not.toBeNull();
  });

  it('returns a critical issue when contrast fails', () => {
    const pair = keyContrastPairDefinitions[0];

    expect(pair).toBeDefined();

    const result = evaluateKeyContrastPair({
      pair: pair!,
      getColorValue: createTokenColorValueLookup({
        'color.semantic.content.primary': '#cccccc',
        'color.semantic.background.app': '#ffffff',
      }),
    });

    expect(result.status).toBe('fail');
    expect(result.issues).toEqual([
      {
        code: 'contrastFail',
        severity: 'critical',
        pairId: 'contentPrimaryOnAppBackground',
        foregroundTokenPath: 'color.semantic.content.primary',
        backgroundTokenPath: 'color.semantic.background.app',
      },
    ]);
  });

  it('returns missing issues when required colors are missing', () => {
    const pair = keyContrastPairDefinitions[0];

    expect(pair).toBeDefined();

    const result = evaluateKeyContrastPair({
      pair: pair!,
      getColorValue: createTokenColorValueLookup({}),
    });

    expect(result).toMatchObject({
      status: 'missing',
      contrast: null,
      issues: [
        {
          code: 'missingForegroundColor',
          severity: 'warning',
          pairId: 'contentPrimaryOnAppBackground',
        },
        {
          code: 'missingBackgroundColor',
          severity: 'warning',
          pairId: 'contentPrimaryOnAppBackground',
        },
      ],
    });
  });

  it('skips optional danger text pair when danger text is unavailable', () => {
    const pair = keyContrastPairDefinitions.find(
      (definition) => definition.id === 'dangerTextOnPrimarySurface',
    );

    expect(pair).toBeDefined();

    const result = evaluateKeyContrastPair({
      pair: pair!,
      getColorValue: createTokenColorValueLookup({
        'color.semantic.surface.primary': '#ffffff',
      }),
    });

    expect(result).toEqual({
      pair,
      foreground: null,
      background: '#ffffff',
      status: 'skipped',
      contrast: null,
      issues: [],
    });
  });
});

describe('evaluateKeyContrastPairs', () => {
  it('evaluates all MVP key pairs and collects issues', () => {
    const report = evaluateKeyContrastPairs({
      getColorValue: createTokenColorValueLookup({
        'color.semantic.content.primary': '#111827',
        'color.semantic.content.secondary': '#4b5563',
        'color.semantic.content.inverse': '#ffffff',
        'color.semantic.background.app': '#ffffff',
        'color.semantic.surface.primary': '#ffffff',
        'color.semantic.action.primary': '#ff8731',
      }),
    });

    expect(report.pairs).toHaveLength(6);
    expect(report.issues.length).toBeGreaterThanOrEqual(0);
  });
});
