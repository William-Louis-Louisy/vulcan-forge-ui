import { describe, expect, it } from 'vitest';
import {
  themeSchema,
  mvpThemeSeeds,
  mvpTokenSetSeeds,
  getMvpSeedTemplates,
  designTokenSetSchema,
  componentContractSchema,
  mvpComponentContractSeeds,
} from './index';

const semanticStatusTokenPaths = [
  'color.semantic.status.info.light',
  'color.semantic.status.info.dark',
  'color.semantic.status.success.light',
  'color.semantic.status.success.dark',
  'color.semantic.status.warning.light',
  'color.semantic.status.warning.dark',
  'color.semantic.status.danger.light',
  'color.semantic.status.danger.dark',
] as const;

describe('mvp seed templates', () => {
  it('provides the expected MVP token sets', () => {
    const seedTemplates = getMvpSeedTemplates();

    expect(seedTemplates.tokenSets.map((tokenSet) => tokenSet.type)).toEqual([
      'color',
      'spacing',
      'radius',
      'typography',
      'motion',
    ]);
  });

  it('provides light and dark themes', () => {
    const seedTemplates = getMvpSeedTemplates();

    expect(seedTemplates.themes.map((theme) => theme.mode)).toEqual([
      'light',
      'dark',
    ]);
  });

  it('provides semantic status colors for light and dark themes', () => {
    const seedTemplates = getMvpSeedTemplates();
    const colorTokenSet = seedTemplates.tokenSets.find(
      (tokenSet) => tokenSet.type === 'color',
    );
    const tokensByPath = new Map(
      colorTokenSet?.tokens.map((token) => [token.path, token]) ?? [],
    );

    for (const tokenPath of semanticStatusTokenPaths) {
      const token = tokensByPath.get(tokenPath);

      expect(token).toBeDefined();
      expect(token?.status).toBe('ready');
      expect(token?.description?.en).toBeTruthy();
      expect(token?.description?.fr).toBeTruthy();
    }

    expect(mvpThemeSeeds[0].tokens.color).toMatchObject({
      info: '{color.semantic.status.info.light}',
      success: '{color.semantic.status.success.light}',
      warning: '{color.semantic.status.warning.light}',
      danger: '{color.semantic.status.danger.light}',
    });
    expect(mvpThemeSeeds[1].tokens.color).toMatchObject({
      info: '{color.semantic.status.info.dark}',
      success: '{color.semantic.status.success.dark}',
      warning: '{color.semantic.status.warning.dark}',
      danger: '{color.semantic.status.danger.dark}',
    });
  });

  it('provides the expected MVP component contracts', () => {
    const seedTemplates = getMvpSeedTemplates();

    expect(
      seedTemplates.componentContracts.map((contract) => contract.type),
    ).toEqual(['button', 'textField', 'card', 'alert', 'dialog']);
  });

  it('keeps token seeds compatible with the Zod token set schema', () => {
    for (const tokenSet of mvpTokenSetSeeds) {
      expect(designTokenSetSchema.safeParse(tokenSet).success).toBe(true);
    }
  });

  it('keeps theme seeds compatible with the Zod theme schema', () => {
    for (const theme of mvpThemeSeeds) {
      expect(themeSchema.safeParse(theme).success).toBe(true);
    }
  });

  it('keeps component contract seeds compatible with the Zod component schema', () => {
    for (const componentContract of mvpComponentContractSeeds) {
      expect(componentContractSchema.safeParse(componentContract).success).toBe(
        true,
      );
    }
  });

  it('provides FR and EN content for all MVP component contracts', () => {
    const seedTemplates = getMvpSeedTemplates();

    for (const componentContract of seedTemplates.componentContracts) {
      expect(componentContract.purpose.en).toBeTruthy();
      expect(componentContract.purpose.fr).toBeTruthy();

      for (const variant of componentContract.variants) {
        expect(variant.label.en).toBeTruthy();
        expect(variant.label.fr).toBeTruthy();
      }

      for (const state of componentContract.states) {
        expect(state.label.en).toBeTruthy();
        expect(state.label.fr).toBeTruthy();
      }

      for (const accessibilityRule of componentContract.accessibility) {
        expect(accessibilityRule.description.en).toBeTruthy();
        expect(accessibilityRule.description.fr).toBeTruthy();
      }
    }
  });
});
