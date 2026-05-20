import { describe, expect, it } from 'vitest';
import { buildDesignSystemProjectFoundation } from './create-design-system-project.foundation';

describe('buildDesignSystemProjectFoundation', () => {
  it('builds the complete project foundation required by DS-052', () => {
    const foundation = buildDesignSystemProjectFoundation({
      name: 'Core Product UI',
      description: 'Core product design system.',
      platforms: ['web', 'mobile'],
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr'],
      visualDirection: 'minimal',
      accessibilityTarget: 'wcag_aa',
    });

    expect(foundation.localeSettings.create).toMatchObject({
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr'],
    });

    expect(foundation.brandProfile.create).toMatchObject({
      name: 'Core Product UI',
      description: 'Core product design system.',
      visualDirection: 'minimal',
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
});
