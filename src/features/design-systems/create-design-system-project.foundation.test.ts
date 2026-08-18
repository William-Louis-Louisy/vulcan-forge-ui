import { describe, expect, it } from 'vitest';
import { createAccessibilityCenterReport } from '@/domain/accessibility';
import { buildDesignSystemProjectFoundation } from './create-design-system-project.foundation';

const testDate = new Date('2026-01-01T00:00:00.000Z');

function createFoundation() {
  return buildDesignSystemProjectFoundation({
    name: 'Core Product UI',
    description: 'Core product design system.',
    platforms: ['web', 'mobile'],
    defaultLocale: 'en',
    supportedLocales: ['en', 'fr'],
    visualDirection: 'minimal',
    accessibilityTarget: 'wcag_aa',
  });
}

describe('buildDesignSystemProjectFoundation', () => {
  it('builds the complete project foundation required by DS-052', () => {
    const foundation = createFoundation();

    expect(foundation.localeSettings.create).toMatchObject({
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr'],
    });

    expect(foundation.brandProfile.create).toMatchObject({
      visualStyle: 'minimal',
      uiDensity: 'cozy',
      inspirationKeywords: [],
      localizedContent: {
        shortDescription: {
          en: 'Core product design system.',
        },
      },
    });

    expect(foundation.tokenSets.create).toHaveLength(5);
    expect(
      foundation.tokenSets.create.map((tokenSet) => tokenSet.type),
    ).toEqual(['color', 'spacing', 'radius', 'typography', 'motion']);

    expect(foundation.themes.create).toHaveLength(2);
    expect(foundation.themes.create.map((theme) => theme.mode)).toEqual([
      'light',
      'dark',
    ]);

    expect(foundation.componentContracts.create).toHaveLength(5);
    expect(
      foundation.componentContracts.create.map((contract) => contract.type),
    ).toEqual(['button', 'textField', 'card', 'alert', 'dialog']);

    expect(foundation.documentationProfile.create).toBeDefined();
    expect(foundation.aiInstructionProfile.create).toBeDefined();
  });

  it('seeds new projects without internally generated accessibility issues', () => {
    const foundation = createFoundation();
    const colorTokenSet = foundation.tokenSets.create.find(
      (tokenSet) => tokenSet.type === 'color',
    );
    const report = createAccessibilityCenterReport({
      colorTokenSetTokens: colorTokenSet?.tokens ?? [],
      themes: foundation.themes.create.map((theme) => ({
        id: `seed-theme-${theme.mode}`,
        mode: theme.mode,
        name: theme.name,
        tokens: theme.tokens,
        updatedAt: testDate,
      })),
      defaultLocale: foundation.localeSettings.create.defaultLocale,
      supportedLocales: foundation.localeSettings.create.supportedLocales,
      tokenSets: foundation.tokenSets.create.map((tokenSet, index) => ({
        id: `seed-token-set-${index}`,
        type: tokenSet.type,
        name: tokenSet.name,
        tokens: tokenSet.tokens,
      })),
      componentContracts: foundation.componentContracts.create.map(
        (componentContract, index) => ({
          id: `seed-component-${index}`,
          type: componentContract.type,
          name: componentContract.name,
          contract: componentContract.contract,
        }),
      ),
    });

    expect(report.contrastPairs).not.toHaveLength(0);
    expect(report.contrastPairs.every((pair) => pair.status === 'pass')).toBe(
      true,
    );
    expect(report.issues).toEqual([]);
    expect(report.score).toBe(100);
    expect(report.status).toBe('healthy');
  });

  it('maps the legacy enterprise direction to technical', () => {
    const foundation = buildDesignSystemProjectFoundation({
      name: 'Enterprise UI',
      description: null,
      platforms: ['web'],
      defaultLocale: 'fr',
      supportedLocales: ['fr'],
      visualDirection: 'enterprise',
      accessibilityTarget: 'wcag_aa',
    });

    expect(foundation.brandProfile.create).toMatchObject({
      visualStyle: 'technical',
      localizedContent: {},
    });
  });
});
