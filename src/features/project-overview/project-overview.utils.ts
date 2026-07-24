import {
  componentContractSchema,
  designTokenSchema,
  type ComponentContract,
  type DesignToken,
} from '@/domain/design-system';
import type { AppLocale } from '@/domain/i18n';
import {
  createAccessibilityCenterReport,
  type AccessibilityCenterReport,
} from '@/features/accessibility/accessibility-center.utils';
import {
  exportLogFormats,
  type ExportLogFormat,
} from '@/features/exports/export-center.utils';
import type { TokenSetType } from '@/features/tokens/tokens-editor.utils';
import type { ProjectOverviewPageData } from './project-overview.queries';

export type ProjectOverviewTokenSetCoverage = {
  type: TokenSetType;
  total: number;
  ready: number;
  draft: number;
  deprecated: number;
  invalid: number;
  missingDescriptions: number;
};

export type ProjectOverviewComponentItem = {
  id: string;
  type: ComponentContract['type'];
  name: string;
  status: ComponentContract['status'];
};

export type ProjectOverviewNextActionCode =
  | 'criticalIssues'
  | 'invalidTokens'
  | 'contrastIssues'
  | 'missingTokenDescriptions'
  | 'missingThemes'
  | 'draftComponents'
  | 'missingComponents'
  | 'staleExports'
  | 'missingExports';

export type ProjectOverviewNextAction = {
  id: string;
  code: ProjectOverviewNextActionCode;
  count: number;
  href: string;
  priority: number;
};

export type ProjectOverviewActivity =
  | {
      id: string;
      type: 'tokenSet';
      occurredAt: string;
      tokenSetType: TokenSetType;
      subject: string;
    }
  | {
      id: string;
      type: 'theme';
      occurredAt: string;
      subject: string;
    }
  | {
      id: string;
      type: 'component';
      occurredAt: string;
      subject: string;
    }
  | {
      id: string;
      type: 'accessibilityReport';
      occurredAt: string;
      score: number;
      status: 'pass' | 'warning' | 'fail';
    }
  | {
      id: string;
      type: 'export';
      occurredAt: string;
      format: ExportLogFormat;
      locale: AppLocale | null;
      status: 'success' | 'failed';
    };

export type ProjectOverviewViewModel = {
  project: ProjectOverviewPageData['project'];
  health: {
    score: number;
    status: AccessibilityCenterReport['status'];
    issueCount: number;
    criticalIssues: number;
    warningIssues: number;
  };
  tokens: {
    total: number;
    valid: number;
    invalid: number;
    ready: number;
    draft: number;
    deprecated: number;
    missingDescriptions: number;
    missingDescriptionsByLocale: Partial<Record<AppLocale, number>>;
    sets: ProjectOverviewTokenSetCoverage[];
  };
  themes: {
    total: number;
    modes: Array<'light' | 'dark'>;
    contrastPairs: number;
    passedPairs: number;
    warningPairs: number;
    failedPairs: number;
    missingPairs: number;
  };
  components: {
    total: number;
    valid: number;
    invalid: number;
    ready: number;
    draft: number;
    deprecated: number;
    items: ProjectOverviewComponentItem[];
  };
  exports: {
    availableFormats: number;
    generatedFormats: number;
    staleFormats: ExportLogFormat[];
    missingFormats: ExportLogFormat[];
    latestSuccessfulExports: Array<{
      format: ExportLogFormat;
      createdAt: string;
    }>;
    recentLogs: Array<{
      id: string;
      format: ExportLogFormat;
      locale: AppLocale | null;
      status: 'success' | 'failed';
      createdAt: string;
    }>;
  };
  nextActions: ProjectOverviewNextAction[];
  recentActivity: ProjectOverviewActivity[];
  contentUpdatedAt: string;
};

function isDescriptionMissing(
  token: DesignToken,
  locale: AppLocale,
): boolean {
  const value = token.description?.[locale];

  return typeof value !== 'string' || value.trim().length === 0;
}

function createTokenCoverage(
  pageData: ProjectOverviewPageData,
): ProjectOverviewViewModel['tokens'] {
  const missingDescriptionsByLocale: Partial<Record<AppLocale, number>> = {};

  const sets = pageData.tokenSets.map((tokenSet) => {
    const rawTokens = Array.isArray(tokenSet.tokens) ? tokenSet.tokens : [];
    let ready = 0;
    let draft = 0;
    let deprecated = 0;
    let invalid = Array.isArray(tokenSet.tokens) ? 0 : 1;
    let missingDescriptions = 0;

    rawTokens.forEach((rawToken) => {
      const parsedToken = designTokenSchema.safeParse(rawToken);

      if (!parsedToken.success) {
        invalid += 1;
        return;
      }

      if (parsedToken.data.status === 'ready') {
        ready += 1;
      } else if (parsedToken.data.status === 'deprecated') {
        deprecated += 1;
      } else {
        draft += 1;
      }

      const missingLocales = pageData.project.supportedLocales.filter((locale) =>
        isDescriptionMissing(parsedToken.data, locale),
      );

      if (missingLocales.length > 0) {
        missingDescriptions += 1;
      }

      missingLocales.forEach((locale) => {
        missingDescriptionsByLocale[locale] =
          (missingDescriptionsByLocale[locale] ?? 0) + 1;
      });
    });

    return {
      type: tokenSet.type,
      total: rawTokens.length,
      ready,
      draft,
      deprecated,
      invalid,
      missingDescriptions,
    };
  });

  return sets.reduce<ProjectOverviewViewModel['tokens']>(
    (coverage, tokenSet) => ({
      total: coverage.total + tokenSet.total,
      valid: coverage.valid + tokenSet.total - tokenSet.invalid,
      invalid: coverage.invalid + tokenSet.invalid,
      ready: coverage.ready + tokenSet.ready,
      draft: coverage.draft + tokenSet.draft,
      deprecated: coverage.deprecated + tokenSet.deprecated,
      missingDescriptions:
        coverage.missingDescriptions + tokenSet.missingDescriptions,
      missingDescriptionsByLocale,
      sets,
    }),
    {
      total: 0,
      valid: 0,
      invalid: 0,
      ready: 0,
      draft: 0,
      deprecated: 0,
      missingDescriptions: 0,
      missingDescriptionsByLocale,
      sets,
    },
  );
}

function createComponentCoverage(
  pageData: ProjectOverviewPageData,
): ProjectOverviewViewModel['components'] {
  const items: ProjectOverviewComponentItem[] = [];
  let invalid = 0;
  let ready = 0;
  let draft = 0;
  let deprecated = 0;

  pageData.componentContracts.forEach((componentContract) => {
    const parsedContract = componentContractSchema.safeParse(
      componentContract.contract,
    );

    if (!parsedContract.success) {
      invalid += 1;
      return;
    }

    if (parsedContract.data.status === 'ready') {
      ready += 1;
    } else if (parsedContract.data.status === 'deprecated') {
      deprecated += 1;
    } else {
      draft += 1;
    }

    items.push({
      id: componentContract.id,
      type: parsedContract.data.type,
      name: parsedContract.data.name,
      status: parsedContract.data.status,
    });
  });

  return {
    total: pageData.componentContracts.length,
    valid: items.length,
    invalid,
    ready,
    draft,
    deprecated,
    items,
  };
}

function createCurrentAccessibilityReport(
  pageData: ProjectOverviewPageData,
): AccessibilityCenterReport {
  const colorTokenSet = pageData.tokenSets.find(
    (tokenSet) => tokenSet.type === 'color',
  );

  return createAccessibilityCenterReport({
    colorTokenSetTokens: colorTokenSet?.tokens ?? [],
    themes: pageData.themes,
    defaultLocale: pageData.project.defaultLocale,
    supportedLocales: pageData.project.supportedLocales,
    tokenSets: pageData.tokenSets,
    componentContracts: pageData.componentContracts,
  });
}

function getLatestDate(dates: Array<Date | null>): Date {
  const availableDates = dates.filter((date): date is Date => date !== null);

  return new Date(
    Math.max(...availableDates.map((date) => date.getTime())),
  );
}

function createExportCoverage({
  pageData,
  contentUpdatedAt,
}: {
  pageData: ProjectOverviewPageData;
  contentUpdatedAt: Date;
}): ProjectOverviewViewModel['exports'] {
  const latestSuccessfulByFormat = new Map<ExportLogFormat, Date>();

  pageData.exportLogs.forEach((exportLog) => {
    if (
      exportLog.status === 'success' &&
      !latestSuccessfulByFormat.has(exportLog.format)
    ) {
      latestSuccessfulByFormat.set(exportLog.format, exportLog.createdAt);
    }
  });

  const missingFormats = exportLogFormats.filter(
    (format) => !latestSuccessfulByFormat.has(format),
  );
  const staleFormats = exportLogFormats.filter((format) => {
    const lastExportedAt = latestSuccessfulByFormat.get(format);

    return Boolean(lastExportedAt && lastExportedAt < contentUpdatedAt);
  });

  return {
    availableFormats: exportLogFormats.length,
    generatedFormats: latestSuccessfulByFormat.size,
    staleFormats,
    missingFormats,
    latestSuccessfulExports: exportLogFormats.flatMap((format) => {
      const createdAt = latestSuccessfulByFormat.get(format);

      return createdAt
        ? [
            {
              format,
              createdAt: createdAt.toISOString(),
            },
          ]
        : [];
    }),
    recentLogs: pageData.exportLogs.slice(0, 5).map((exportLog) => ({
      id: exportLog.id,
      format: exportLog.format,
      locale: exportLog.locale,
      status: exportLog.status,
      createdAt: exportLog.createdAt.toISOString(),
    })),
  };
}

function createNextActions({
  pageData,
  report,
  tokens,
  themes,
  components,
  exports,
}: {
  pageData: ProjectOverviewPageData;
  report: AccessibilityCenterReport;
  tokens: ProjectOverviewViewModel['tokens'];
  themes: ProjectOverviewViewModel['themes'];
  components: ProjectOverviewViewModel['components'];
  exports: ProjectOverviewViewModel['exports'];
}): ProjectOverviewNextAction[] {
  const projectHref = `/app/projects/${pageData.project.slug}`;
  const actions: ProjectOverviewNextAction[] = [];

  if (report.summary.criticalIssues > 0) {
    actions.push({
      id: 'critical-issues',
      code: 'criticalIssues',
      count: report.summary.criticalIssues,
      href: `${projectHref}/accessibility`,
      priority: 10,
    });
  }

  if (tokens.invalid > 0) {
    actions.push({
      id: 'invalid-tokens',
      code: 'invalidTokens',
      count: tokens.invalid,
      href: `${projectHref}/tokens?set=color`,
      priority: 20,
    });
  }

  const contrastIssues =
    themes.failedPairs + themes.warningPairs + themes.missingPairs;

  if (contrastIssues > 0) {
    actions.push({
      id: 'contrast-issues',
      code: 'contrastIssues',
      count: contrastIssues,
      href: `${projectHref}/themes`,
      priority: 30,
    });
  }

  if (tokens.missingDescriptions > 0) {
    const firstIncompleteSet = tokens.sets.find(
      (tokenSet) => tokenSet.missingDescriptions > 0,
    );

    actions.push({
      id: 'missing-token-descriptions',
      code: 'missingTokenDescriptions',
      count: tokens.missingDescriptions,
      href: `${projectHref}/tokens?set=${firstIncompleteSet?.type ?? 'color'}`,
      priority: 40,
    });
  }

  if (themes.total === 0) {
    actions.push({
      id: 'missing-themes',
      code: 'missingThemes',
      count: 1,
      href: `${projectHref}/themes`,
      priority: 50,
    });
  }

  if (components.total === 0) {
    actions.push({
      id: 'missing-components',
      code: 'missingComponents',
      count: 1,
      href: `${projectHref}/components`,
      priority: 60,
    });
  } else if (components.draft > 0) {
    actions.push({
      id: 'draft-components',
      code: 'draftComponents',
      count: components.draft,
      href: `${projectHref}/components`,
      priority: 60,
    });
  }

  if (exports.staleFormats.length > 0) {
    actions.push({
      id: 'stale-exports',
      code: 'staleExports',
      count: exports.staleFormats.length,
      href: `${projectHref}/exports`,
      priority: 70,
    });
  } else if (exports.missingFormats.length > 0) {
    actions.push({
      id: 'missing-exports',
      code: 'missingExports',
      count: exports.missingFormats.length,
      href: `${projectHref}/exports`,
      priority: 80,
    });
  }

  return actions
    .sort((firstAction, secondAction) =>
      firstAction.priority === secondAction.priority
        ? firstAction.id.localeCompare(secondAction.id)
        : firstAction.priority - secondAction.priority,
    )
    .slice(0, 4);
}

function createRecentActivity(
  pageData: ProjectOverviewPageData,
): ProjectOverviewActivity[] {
  const activity: ProjectOverviewActivity[] = [
    ...pageData.tokenSets.map(
      (tokenSet): ProjectOverviewActivity => ({
        id: `token-set:${tokenSet.id}`,
        type: 'tokenSet',
        occurredAt: tokenSet.updatedAt.toISOString(),
        tokenSetType: tokenSet.type,
        subject: tokenSet.name,
      }),
    ),
    ...pageData.themes.map(
      (theme): ProjectOverviewActivity => ({
        id: `theme:${theme.id}`,
        type: 'theme',
        occurredAt: theme.updatedAt.toISOString(),
        subject: theme.name,
      }),
    ),
    ...pageData.componentContracts.map(
      (component): ProjectOverviewActivity => ({
        id: `component:${component.id}`,
        type: 'component',
        occurredAt: component.updatedAt.toISOString(),
        subject: component.name,
      }),
    ),
    ...pageData.exportLogs.slice(0, 8).map(
      (exportLog): ProjectOverviewActivity => ({
        id: `export:${exportLog.id}`,
        type: 'export',
        occurredAt: exportLog.createdAt.toISOString(),
        format: exportLog.format,
        locale: exportLog.locale,
        status: exportLog.status,
      }),
    ),
    ...(pageData.latestAccessibilityReport
      ? [
          {
            id: `accessibility:${pageData.latestAccessibilityReport.id}`,
            type: 'accessibilityReport' as const,
            occurredAt:
              pageData.latestAccessibilityReport.createdAt.toISOString(),
            score: pageData.latestAccessibilityReport.score,
            status: pageData.latestAccessibilityReport.status,
          },
        ]
      : []),
  ];

  return activity
    .sort(
      (firstActivity, secondActivity) =>
        new Date(secondActivity.occurredAt).getTime() -
        new Date(firstActivity.occurredAt).getTime(),
    )
    .slice(0, 6);
}

export function createProjectOverviewViewModel(
  pageData: ProjectOverviewPageData,
): ProjectOverviewViewModel {
  const tokens = createTokenCoverage(pageData);
  const components = createComponentCoverage(pageData);
  const report = createCurrentAccessibilityReport(pageData);
  const contentUpdatedAt = getLatestDate([
    pageData.project.updatedAt,
    ...pageData.tokenSets.map((tokenSet) => tokenSet.updatedAt),
    ...pageData.themes.map((theme) => theme.updatedAt),
    ...pageData.componentContracts.map((component) => component.updatedAt),
    pageData.documentationProfileUpdatedAt,
    pageData.aiInstructionProfileUpdatedAt,
  ]);
  const themes: ProjectOverviewViewModel['themes'] = {
    total: pageData.themes.length,
    modes: pageData.themes.map((theme) => theme.mode),
    contrastPairs: report.summary.pairCount,
    passedPairs: report.summary.passedPairs,
    warningPairs: report.summary.warningPairs,
    failedPairs: report.summary.failedPairs,
    missingPairs: report.summary.missingPairs,
  };
  const exports = createExportCoverage({ pageData, contentUpdatedAt });

  return {
    project: pageData.project,
    health: {
      score: report.score,
      status: report.status,
      issueCount: report.issues.length,
      criticalIssues: report.summary.criticalIssues,
      warningIssues: report.summary.warningIssues,
    },
    tokens,
    themes,
    components,
    exports,
    nextActions: createNextActions({
      pageData,
      report,
      tokens,
      themes,
      components,
      exports,
    }),
    recentActivity: createRecentActivity(pageData),
    contentUpdatedAt: contentUpdatedAt.toISOString(),
  };
}
