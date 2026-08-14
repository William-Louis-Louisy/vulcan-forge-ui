import { describe, expect, it } from 'vitest';
import { defaultBrandProfile } from './brand-profile.schema';
import {
  createDesignSystemProjectSource,
  type DesignSystemProjectSourceInput,
} from './project-source';

const project = {
  id: 'project-1',
  name: 'Vulcan Forge',
  slug: 'vulcan-forge',
  description: 'Design system',
  defaultLocale: 'en' as const,
  supportedLocales: ['en', 'fr'] as const,
};

const updatedAt = new Date('2026-08-14T12:00:00.000Z');

function createSourceInput(): DesignSystemProjectSourceInput {
  return {
    project: {
      ...project,
      supportedLocales: [...project.supportedLocales],
    },
    brandProfile: {
      visualStyle: 'technical',
      uiDensity: 'cozy',
      inspirationKeywords: ['precise'],
      localizedContent: {},
    },
    tokenSets: [
      {
        id: 'colors',
        type: 'color',
        name: 'Colors',
        tokens: [
          {
            path: 'color.primitive.blue.500',
            type: 'color',
            value: '#2563eb',
            status: 'ready',
          },
        ],
      },
    ],
    themes: [
      {
        id: 'theme-light',
        mode: 'light',
        name: 'Light',
        tokens: {
          color: {
            background: '{color.primitive.blue.500}',
          },
        },
        updatedAt,
      },
    ],
    componentContracts: [
      {
        id: 'component-button',
        type: 'button',
        name: 'Button',
        contract: {
          type: 'button',
          name: 'Button',
          purpose: {
            en: 'Trigger an action',
          },
          status: 'ready',
        },
        updatedAt,
      },
    ],
  };
}

describe('canonical design system project source', () => {
  it('normalizes persisted design-system data into one typed source', () => {
    const source = createDesignSystemProjectSource(createSourceInput());

    expect(source.project).toEqual(project);
    expect(source.brand).toMatchObject({
      visualStyle: 'technical',
      uiDensity: 'cozy',
    });
    expect(source.tokenSets[0]?.tokens).toHaveLength(1);
    expect(source.tokens).toEqual(source.tokenSets[0]?.tokens);
    expect(source.themes[0]).toMatchObject({
      id: 'theme-light',
      mode: 'light',
      name: 'Light',
    });
    expect(source.components[0]?.contract).toMatchObject({
      type: 'button',
      name: 'Button',
      status: 'ready',
    });
  });

  it('keeps storage fallbacks deterministic for malformed nested content', () => {
    const input = createSourceInput();

    input.brandProfile = {
      visualStyle: 'unknown',
      uiDensity: 'unknown',
      inspirationKeywords: null,
      localizedContent: null,
    };
    input.tokenSets[0]!.tokens = [
      {
        path: '',
        type: 'color',
        value: '#2563eb',
        status: 'ready',
      },
    ];
    input.themes[0]!.tokens = [];
    input.componentContracts[0]!.contract = {
      type: 'button',
      name: '',
      purpose: {},
    };

    const source = createDesignSystemProjectSource(input);

    expect(source.brand).toEqual(defaultBrandProfile);
    expect(source.tokenSets[0]?.tokens).toEqual([]);
    expect(source.tokens).toEqual([]);
    expect(source.themes[0]?.tokens).toEqual({});
    expect(source.components).toEqual([]);
  });

  it('preserves the distinction between no brand profile and invalid stored brand data', () => {
    const input = createSourceInput();
    input.brandProfile = null;

    expect(createDesignSystemProjectSource(input).brand).toBeNull();
  });
});
