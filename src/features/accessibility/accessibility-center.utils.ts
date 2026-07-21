import { z } from 'zod';
import {
  designTokenSchema,
  resolveDesignTokens,
  type ComponentContractType,
  type DesignTokenType,
  type TokenResolutionError,
} from '@/domain/design-system';
import type { AppLocale } from '@/domain/i18n';
import type {
  ThemeMode,
  ThemeColorKey,
  ThemeColorPair,
  ThemeEditorTheme,
} from '@/features/themes/themes-editor.utils';
import {
  sortThemesByMode,
  getThemeContrastPairs,
  createThemeColorTokenOptions,
} from '@/features/themes/themes-editor.utils';
import {
  createExpandedAccessibilityIssues,
  type ExpandedAccessibilityIssue,
  type ExpandedAccessibilityIssueCode,
  type ExpandedAccessibilityIssueField,
  type ExpandedAccessibilityIssueScope,
} from './accessibility-automated-rules';
import type {
  AccessibilityRuleComponentContractSource,
  AccessibilityRuleTokenSetSource,
} from './accessibility-rule-sources';

const designTokenArraySchema = z.array(designTokenSchema);

export type AccessibilityCenterIssueCode =
  | 'missingForegroundColor'
  | 'missingBackgroundColor'
  | 'contrastWarning'
  | 'contrastFail'
  | 'tokenResolutionError'
  | 'invalidColorTokenSet'
  | 'missingThemes'
  | ExpandedAccessibilityIssueCode;

export type AccessibilityCenterIssueSeverity = 'warning' | 'critical';

export type AccessibilityCenterIssueScope =
  | 'themeContrast'
  | 'tokenResolution'
  | 'tokenSet'
  | 'theme'
  | ExpandedAccessibilityIssueScope;

export type AccessibilityCenterIssue = {
  id: string;
  code: AccessibilityCenterIssueCode;
  severity: AccessibilityCenterIssueSeverity;
  scope: AccessibilityCenterIssueScope;
  themeId: string | null;
  themeMode: ThemeMode | null;
  themeName: string | null;
  pairId: ThemeColorPair['key'] | null;
  foregroundRole: ThemeColorKey | null;
  backgroundRole: ThemeColorKey | null;
  foregroundTokenPath: string | null;
  backgroundTokenPath: string | null;
  foregroundValue: string | null;
  backgroundValue: string | null;
  ratio: number | null;
  requiredRatio: number | null;
  tokenPath: string | null;
  tokenSetId?: string | null;
  tokenSetName?: string | null;
  componentId?: string | null;
  componentType?: ComponentContractType | null;
  componentName?: string | null;
  affectedField?: ExpandedAccessibilityIssueField | null;
  affectedCount?: number | null;
  missingLocales?: AppLocale[];
  bindingKey?: string | null;
  expectedTokenType?: DesignTokenType | null;
  actualTokenType?: DesignTokenType | null;
};

export type AccessibilityCenterContrastPairStatus =
  | 'pass'
  | 'warning'
  | 'fail'
  | 'missing';

export type AccessibilityCenterContrastPair = {
  id: string;
  themeId: string;
  themeMode: ThemeMode;
  themeName: string;
  pairId: ThemeColorPair['key'];
  foregroundRole: ThemeColorKey;
  backgroundRole: ThemeColorKey;
  foregroundTokenPath: string | null;
  backgroundTokenPath: string | null;
  foregroundValue: string | null;
  backgroundValue: string | null;
  ratio: number | null;
  requiredRatio: number | null;
  status: AccessibilityCenterContrastPairStatus;
};

export type AccessibilityCenterSummary = {
  themeCount: number;
  pairCount: number;
  passedPairs: number;
  warningPairs: number;
  failedPairs: number;
  missingPairs: number;
  criticalIssues: number;
  warningIssues: number;
};

export type AccessibilityCenterReport = {
  score: number;
  status: 'healthy' | 'needsAttention' | 'critical';
  issues: AccessibilityCenterIssue[];
  contrastPairs: AccessibilityCenterContrastPair[];
  summary: AccessibilityCenterSummary;
  isReadable: boolean;
};

export type CreateAccessibilityCenterReportInput = {
  colorTokenSetTokens: unknown;
  themes: ThemeEditorTheme[];
  defaultLocale?: AppLocale;
  supportedLocales?: AppLocale[];
  tokenSets?: AccessibilityRuleTokenSetSource[];
  componentContracts?: AccessibilityRuleComponentContractSource[];
};

function scoreFromIssues(issues: readonly AccessibilityCenterIssue[]): number {
  const penalty = issues.reduce((total, issue) => {
    return total + (issue.severity === 'critical' ? 25 : 10);
  }, 0);

  return Math.max(0, 100 - penalty);
}

function statusFromScore(score: number): AccessibilityCenterReport['status'] {
  if (score >= 90) {
    return 'healthy';
  }

  if (score >= 60) {
    return 'needsAttention';
  }

  return 'critical';
}

function createIssueId({
  code,
  scope,
  themeMode,
  pairId,
  tokenPath,
  foregroundRole,
  backgroundRole,
}: {
  code: AccessibilityCenterIssueCode;
  scope: AccessibilityCenterIssueScope;
  themeMode: ThemeMode | null;
  pairId: string | null;
  tokenPath: string | null;
  foregroundRole: ThemeColorKey | null;
  backgroundRole: ThemeColorKey | null;
}) {
  return [
    scope,
    code,
    themeMode,
    pairId,
    tokenPath,
    foregroundRole,
    backgroundRole,
  ]
    .filter(Boolean)
    .join(':');
}

function createTokenSetIssue(): AccessibilityCenterIssue {
  return {
    id: createIssueId({
      code: 'invalidColorTokenSet',
      scope: 'tokenSet',
      themeMode: null,
      pairId: null,
      tokenPath: null,
      foregroundRole: null,
      backgroundRole: null,
    }),
    code: 'invalidColorTokenSet',
    severity: 'critical',
    scope: 'tokenSet',
    themeId: null,
    themeMode: null,
    themeName: null,
    pairId: null,
    foregroundRole: null,
    backgroundRole: null,
    foregroundTokenPath: null,
    backgroundTokenPath: null,
    foregroundValue: null,
    backgroundValue: null,
    ratio: null,
    requiredRatio: null,
    tokenPath: null,
  };
}

function createMissingThemesIssue(): AccessibilityCenterIssue {
  return {
    id: createIssueId({
      code: 'missingThemes',
      scope: 'theme',
      themeMode: null,
      pairId: null,
      tokenPath: null,
      foregroundRole: null,
      backgroundRole: null,
    }),
    code: 'missingThemes',
    severity: 'critical',
    scope: 'theme',
    themeId: null,
    themeMode: null,
    themeName: null,
    pairId: null,
    foregroundRole: null,
    backgroundRole: null,
    foregroundTokenPath: null,
    backgroundTokenPath: null,
    foregroundValue: null,
    backgroundValue: null,
    ratio: null,
    requiredRatio: null,
    tokenPath: null,
  };
}

function mapTokenResolutionError(
  error: TokenResolutionError,
): AccessibilityCenterIssue {
  return {
    id: createIssueId({
      code: 'tokenResolutionError',
      scope: 'tokenResolution',
      themeMode: null,
      pairId: null,
      tokenPath: error.tokenPath,
      foregroundRole: null,
      backgroundRole: null,
    }),
    code: 'tokenResolutionError',
    severity: 'critical',
    scope: 'tokenResolution',
    themeId: null,
    themeMode: null,
    themeName: null,
    pairId: null,
    foregroundRole: null,
    backgroundRole: null,
    foregroundTokenPath: null,
    backgroundTokenPath: null,
    foregroundValue: null,
    backgroundValue: null,
    ratio: null,
    requiredRatio: null,
    tokenPath: error.tokenPath,
  };
}

function mapExpandedIssue(
  issue: ExpandedAccessibilityIssue,
): AccessibilityCenterIssue {
  return {
    ...issue,
    themeId: null,
    themeMode: null,
    themeName: null,
    pairId: null,
    foregroundRole: null,
    backgroundRole: null,
    foregroundTokenPath: null,
    backgroundTokenPath: null,
    foregroundValue: null,
    backgroundValue: null,
    ratio: null,
    requiredRatio: null,
  };
}

function mapThemePairToContrastPair({
  theme,
  pair,
}: {
  theme: ThemeEditorTheme;
  pair: ThemeColorPair;
}): AccessibilityCenterContrastPair {
  return {
    id: `${theme.mode}:${pair.key}`,
    themeId: theme.id,
    themeMode: theme.mode,
    themeName: theme.name,
    pairId: pair.key,
    foregroundRole: pair.foregroundKey,
    backgroundRole: pair.backgroundKey,
    foregroundTokenPath: pair.foregroundReferencePath,
    backgroundTokenPath: pair.backgroundReferencePath,
    foregroundValue: pair.foregroundValue,
    backgroundValue: pair.backgroundValue,
    ratio: pair.contrast?.ratio ?? null,
    requiredRatio: pair.contrast?.requiredRatio ?? null,
    status: pair.contrast?.status ?? 'missing',
  };
}

function mapThemePairToIssues({
  theme,
  pair,
}: {
  theme: ThemeEditorTheme;
  pair: ThemeColorPair;
}): AccessibilityCenterIssue[] {
  const baseIssue = {
    scope: 'themeContrast' as const,
    themeId: theme.id,
    themeMode: theme.mode,
    themeName: theme.name,
    pairId: pair.key,
    foregroundRole: pair.foregroundKey,
    backgroundRole: pair.backgroundKey,
    foregroundTokenPath: pair.foregroundReferencePath,
    backgroundTokenPath: pair.backgroundReferencePath,
    foregroundValue: pair.foregroundValue,
    backgroundValue: pair.backgroundValue,
    ratio: pair.contrast?.ratio ?? null,
    requiredRatio: pair.contrast?.requiredRatio ?? null,
    tokenPath: null,
  };

  const issues: AccessibilityCenterIssue[] = [];

  if (!pair.foregroundValue) {
    issues.push({
      ...baseIssue,
      id: createIssueId({
        code: 'missingForegroundColor',
        scope: 'themeContrast',
        themeMode: theme.mode,
        pairId: pair.key,
        tokenPath: null,
        foregroundRole: pair.foregroundKey,
        backgroundRole: pair.backgroundKey,
      }),
      code: 'missingForegroundColor',
      severity: 'warning',
    });
  }

  if (!pair.backgroundValue) {
    issues.push({
      ...baseIssue,
      id: createIssueId({
        code: 'missingBackgroundColor',
        scope: 'themeContrast',
        themeMode: theme.mode,
        pairId: pair.key,
        tokenPath: null,
        foregroundRole: pair.foregroundKey,
        backgroundRole: pair.backgroundKey,
      }),
      code: 'missingBackgroundColor',
      severity: 'warning',
    });
  }

  if (pair.contrast?.status === 'warning') {
    issues.push({
      ...baseIssue,
      id: createIssueId({
        code: 'contrastWarning',
        scope: 'themeContrast',
        themeMode: theme.mode,
        pairId: pair.key,
        tokenPath: null,
        foregroundRole: pair.foregroundKey,
        backgroundRole: pair.backgroundKey,
      }),
      code: 'contrastWarning',
      severity: 'warning',
    });
  }

  if (pair.contrast?.status === 'fail') {
    issues.push({
      ...baseIssue,
      id: createIssueId({
        code: 'contrastFail',
        scope: 'themeContrast',
        themeMode: theme.mode,
        pairId: pair.key,
        tokenPath: null,
        foregroundRole: pair.foregroundKey,
        backgroundRole: pair.backgroundKey,
      }),
      code: 'contrastFail',
      severity: 'critical',
    });
  }

  return issues;
}

function createSummary({
  themes,
  contrastPairs,
  issues,
}: {
  themes: ThemeEditorTheme[];
  contrastPairs: AccessibilityCenterContrastPair[];
  issues: AccessibilityCenterIssue[];
}): AccessibilityCenterSummary {
  return {
    themeCount: themes.length,
    pairCount: contrastPairs.length,
    passedPairs: contrastPairs.filter((pair) => pair.status === 'pass').length,
    warningPairs: contrastPairs.filter((pair) => pair.status === 'warning')
      .length,
    failedPairs: contrastPairs.filter((pair) => pair.status === 'fail').length,
    missingPairs: contrastPairs.filter((pair) => pair.status === 'missing')
      .length,
    criticalIssues: issues.filter((issue) => issue.severity === 'critical')
      .length,
    warningIssues: issues.filter((issue) => issue.severity === 'warning')
      .length,
  };
}

export function createAccessibilityCenterReport({
  colorTokenSetTokens,
  themes,
  defaultLocale = 'en',
  supportedLocales = [defaultLocale],
  tokenSets,
  componentContracts = [],
}: CreateAccessibilityCenterReportInput): AccessibilityCenterReport {
  const parsedTokens = designTokenArraySchema.safeParse(colorTokenSetTokens);
  const expandedIssues = createExpandedAccessibilityIssues({
    defaultLocale,
    supportedLocales,
    tokenSets: tokenSets ?? [],
    componentContracts,
  }).map(mapExpandedIssue);

  if (!parsedTokens.success) {
    const issues = [createTokenSetIssue(), ...expandedIssues];
    const score = scoreFromIssues(issues);

    return {
      score,
      status: 'critical',
      issues,
      contrastPairs: [],
      summary: createSummary({
        themes: [],
        contrastPairs: [],
        issues,
      }),
      isReadable: false,
    };
  }

  const sortedThemes = sortThemesByMode(themes);
  const colorTokenOptions = createThemeColorTokenOptions(parsedTokens.data);
  const resolvedTokens = resolveDesignTokens(parsedTokens.data);

  const themeContrastPairs = sortedThemes.flatMap((theme) => {
    return getThemeContrastPairs({
      tokens: theme.tokens,
      colorTokenOptions,
    }).map((pair) =>
      mapThemePairToContrastPair({
        theme,
        pair,
      }),
    );
  });

  const themeIssues = sortedThemes.flatMap((theme) => {
    return getThemeContrastPairs({
      tokens: theme.tokens,
      colorTokenOptions,
    }).flatMap((pair) =>
      mapThemePairToIssues({
        theme,
        pair,
      }),
    );
  });

  const fallbackTokenResolutionIssues =
    tokenSets === undefined
      ? resolvedTokens.errors.map(mapTokenResolutionError)
      : [];
  const issues = [
    ...fallbackTokenResolutionIssues,
    ...expandedIssues,
    ...themeIssues,
    ...(sortedThemes.length === 0 ? [createMissingThemesIssue()] : []),
  ];

  const score = scoreFromIssues(issues);

  return {
    score,
    status: statusFromScore(score),
    issues,
    contrastPairs: themeContrastPairs,
    summary: createSummary({
      themes: sortedThemes,
      contrastPairs: themeContrastPairs,
      issues,
    }),
    isReadable: true,
  };
}
