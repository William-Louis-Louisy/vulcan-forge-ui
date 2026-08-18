import { describe, expect, it } from 'vitest';
import {
  createDesignSystemProjectSource,
  type DesignSystemProjectSourceInput,
} from '@/domain/design-system';
import { createGeneratedAccessibilitySummary } from './generated-accessibility-summary';

const updatedAt = new Date('2026-08-14T12:00:00.000Z');

function createSourceInput(): DesignSystemProjectSourceInput {
  return {
    project: {
      id: 'project-1',
      name: 'Vulcan Forge',
      slug: 'vulcan-forge',
      description: null,
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr'],
    },
    brandProfile: null,
    tokenSets: [
      {
        id: 'colors',
        type: 'color',
        name: 'Colors',
        tokens: [
          {
            path: 'color.primitive.black',
            type: 'color',
            value: '#000000',
            status: 'ready',
          },
          {
            path: 'color.primitive.white',
            type: 'color',
            value: '#ffffff',
            status: 'ready',
          },
        ],
      },
    ],
    themes: [
      {
        id: 'light',
        mode: 'light',
        name: 'Light',
        tokens: {
          color: {
            background: '{color.primitive.white}',
            surface: '{color.primitive.white}',
            content: '{color.primitive.black}',
            muted: '{color.primitive.black}',
            accent: '{color.primitive.black}',
          },
        },
        updatedAt,
      },
    ],
    componentContracts: [],
  };
}

describe('generated accessibility summary', () => {
  it('creates the compact accessibility model used by generated consumers', () => {
    const source = createDesignSystemProjectSource(createSourceInput());
    const summary = createGeneratedAccessibilitySummary(source);

    expect(summary).not.toBeNull();
    expect(summary?.status).toBe('healthy');
    expect(summary?.contrastPairs.length).toBeGreaterThan(0);
  });

  it('preserves the critical malformed-color-token-set behavior', () => {
    const input = createSourceInput();
    input.tokenSets[0]!.tokens = [{ invalid: true }];

    const source = createDesignSystemProjectSource(input);

    expect(createGeneratedAccessibilitySummary(source)).toEqual({
      score: 75,
      status: 'critical',
      contrastPairs: [],
    });
  });

  it('returns no accessibility summary when the project has no color token set', () => {
    const input = createSourceInput();
    input.tokenSets = [];

    const source = createDesignSystemProjectSource(input);

    expect(createGeneratedAccessibilitySummary(source)).toBeNull();
  });
});
