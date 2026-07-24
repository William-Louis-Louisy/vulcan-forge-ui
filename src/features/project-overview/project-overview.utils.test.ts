import { describe, expect, it } from 'vitest';

import {
  mvpComponentContractSeeds,
  mvpThemeSeeds,
  mvpTokenSetSeeds,
} from '@/domain/design-system';
import { exportLogFormats } from '@/features/exports/export-center.utils';
import type { ProjectOverviewPageData } from './project-overview.queries';
import { createProjectOverviewViewModel } from './project-overview.utils';

function at(value: string): Date {
  return new Date(value);
}

function createPageData(
  overrides: Partial<ProjectOverviewPageData> = {},
): ProjectOverviewPageData {
  const projectUpdatedAt = at('2026-07-20T10:00:00.000Z');

  return {
    project: {
      id: 'project-1',
      name: 'Aurora System',
      slug: 'aurora-system',
      description: 'Internal product design system.',
      platforms: ['web', 'mobile'],
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr'],
      visualDirection: 'editorial',
      accessibilityTarget: 'wcag_aa',
      updatedAt: projectUpdatedAt,
    },
    tokenSets: mvpTokenSetSeeds.map((tokenSet, index) => ({
      id: `token-set-${index + 1}`,
      type: tokenSet.type,
      name: tokenSet.name,
      tokens: tokenSet.tokens,
      updatedAt: projectUpdatedAt,
    })),
    themes: mvpThemeSeeds.map((theme, index) => ({
      id: `theme-${index + 1}`,
      mode: theme.mode,
      name: theme.name,
      tokens: theme.tokens,
      updatedAt: projectUpdatedAt,
    })),
    componentContracts: mvpComponentContractSeeds.map((contract, index) => ({
      id: `component-${index + 1}`,
      type: contract.type,
      name: contract.name,
      contract,
      updatedAt: projectUpdatedAt,
    })),
    latestAccessibilityReport: null,
    exportLogs: exportLogFormats.map((format, index) => ({
      id: `export-${format}`,
      format,
      locale:
        format === 'markdownDocumentation' || format === 'aiInstructions'
          ? ('en' as const)
          : null,
      status: 'success' as const,
      createdAt: at(`2026-07-21T1${index}:00:00.000Z`),
    })),
    brandProfileUpdatedAt: null,
    documentationProfileUpdatedAt: projectUpdatedAt,
    aiInstructionProfileUpdatedAt: projectUpdatedAt,
    ...overrides,
  };
}

describe('createProjectOverviewViewModel', () => {
  it('aggregates the existing project sources without inventing persisted data', () => {
    const overview = createProjectOverviewViewModel(createPageData());

    expect(overview.project.slug).toBe('aurora-system');
    expect(overview.tokens.total).toBeGreaterThan(0);
    expect(overview.tokens.invalid).toBe(0);
    expect(overview.themes.total).toBe(2);
    expect(overview.components.total).toBe(mvpComponentContractSeeds.length);
    expect(overview.exports.availableFormats).toBe(exportLogFormats.length);
    expect(overview.exports.generatedFormats).toBe(exportLogFormats.length);
    expect(overview.exports.missingFormats).toEqual([]);
    expect(overview.exports.staleFormats).toEqual([]);
  });

  it('counts invalid tokens and missing localized descriptions by locale', () => {
    const pageData = createPageData({
      tokenSets: [
        {
          id: 'colors',
          type: 'color',
          name: 'Colors',
          updatedAt: at('2026-07-20T10:00:00.000Z'),
          tokens: [
            {
              path: 'color.primitive.ink',
              type: 'color',
              value: '#111111',
              description: { en: 'Ink' },
              status: 'ready',
            },
            {
              path: 'color.semantic.surface',
              type: 'color',
              value: '{color.primitive.ink}',
              reference: '{color.primitive.ink}',
              description: { en: 'Surface', fr: 'Surface' },
              status: 'draft',
            },
            {
              path: 'invalid path',
              type: 'color',
              value: '#ffffff',
              status: 'ready',
            },
          ],
        },
      ],
      themes: [],
      componentContracts: [],
      exportLogs: [],
    });

    const overview = createProjectOverviewViewModel(pageData);

    expect(overview.tokens).toMatchObject({
      total: 3,
      valid: 2,
      invalid: 1,
      ready: 1,
      draft: 1,
      missingDescriptions: 1,
    });
    expect(overview.tokens.missingDescriptionsByLocale).toEqual({ fr: 1 });
    expect(overview.nextActions.map((action) => action.code)).toContain(
      'invalidTokens',
    );
    expect(overview.nextActions.map((action) => action.code)).toContain(
      'missingTokenDescriptions',
    );
  });

  it('never produces a negative valid-token count for an unreadable token set', () => {
    const overview = createProjectOverviewViewModel(
      createPageData({
        tokenSets: [
          {
            id: 'colors',
            type: 'color',
            name: 'Colors',
            tokens: { malformed: true },
            updatedAt: at('2026-07-20T10:00:00.000Z'),
          },
        ],
        themes: [],
        componentContracts: [],
        exportLogs: [],
      }),
    );

    expect(overview.tokens.total).toBe(0);
    expect(overview.tokens.valid).toBe(0);
    expect(overview.tokens.invalid).toBe(1);
  });

  it('marks successful exports as stale after newer project content changes', () => {
    const pageData = createPageData({
      tokenSets: mvpTokenSetSeeds.map((tokenSet, index) => ({
        id: `token-set-${index + 1}`,
        type: tokenSet.type,
        name: tokenSet.name,
        tokens: tokenSet.tokens,
        updatedAt: at('2026-07-23T12:00:00.000Z'),
      })),
      exportLogs: exportLogFormats.map((format) => ({
        id: `export-${format}`,
        format,
        locale: null,
        status: 'success' as const,
        createdAt: at('2026-07-22T12:00:00.000Z'),
      })),
    });

    const overview = createProjectOverviewViewModel(pageData);

    expect(overview.exports.generatedFormats).toBe(exportLogFormats.length);
    expect(overview.exports.staleFormats).toEqual(exportLogFormats);
    expect(overview.nextActions.map((action) => action.code)).toContain(
      'staleExports',
    );
  });

  it('marks exports stale and records activity after a brand update', () => {
    const brandProfileUpdatedAt = at('2026-07-24T12:00:00.000Z');
    const overview = createProjectOverviewViewModel(
      createPageData({
        brandProfileUpdatedAt,
        exportLogs: exportLogFormats.map((format) => ({
          id: `export-${format}`,
          format,
          locale: null,
          status: 'success' as const,
          createdAt: at('2026-07-23T12:00:00.000Z'),
        })),
      }),
    );

    expect(overview.exports.staleFormats).toEqual(exportLogFormats);
    expect(overview.recentActivity[0]).toEqual({
      id: 'brand-profile',
      type: 'brand',
      occurredAt: brandProfileUpdatedAt.toISOString(),
    });
  });

  it('prioritizes actionable gaps and limits the overview to four next actions', () => {
    const overview = createProjectOverviewViewModel(
      createPageData({
        tokenSets: [],
        themes: [],
        componentContracts: [],
        exportLogs: [],
        brandProfileUpdatedAt: null,
        documentationProfileUpdatedAt: null,
        aiInstructionProfileUpdatedAt: null,
      }),
    );

    expect(overview.nextActions).toHaveLength(4);
    expect(overview.nextActions[0]?.code).toBe('criticalIssues');
    expect(overview.nextActions.map((action) => action.code)).toContain(
      'missingThemes',
    );
    expect(overview.nextActions.map((action) => action.code)).toContain(
      'missingComponents',
    );
  });

  it('sorts recent activity from newest to oldest', () => {
    const overview = createProjectOverviewViewModel(
      createPageData({
        tokenSets: [
          {
            id: 'colors',
            type: 'color',
            name: 'Colors',
            tokens: mvpTokenSetSeeds[0].tokens,
            updatedAt: at('2026-07-22T08:00:00.000Z'),
          },
        ],
        themes: [
          {
            id: 'light',
            mode: 'light',
            name: 'Light',
            tokens: mvpThemeSeeds[0].tokens,
            updatedAt: at('2026-07-23T08:00:00.000Z'),
          },
        ],
        componentContracts: [],
        exportLogs: [
          {
            id: 'latest-export',
            format: 'tailwindV4',
            locale: null,
            status: 'success',
            createdAt: at('2026-07-24T08:00:00.000Z'),
          },
        ],
      }),
    );

    expect(overview.recentActivity.map((activity) => activity.type)).toEqual([
      'export',
      'theme',
      'tokenSet',
    ]);
  });
});
