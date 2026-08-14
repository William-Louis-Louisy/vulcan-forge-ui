import {
  createThemeColorTokenOptions,
  getThemeContrastPairs,
  resolveDesignTokens,
  sortThemesByMode,
  type DesignSystemProjectSource,
} from '@/domain/design-system';

export type GeneratedAccessibilitySummaryStatus =
  | 'healthy'
  | 'needsAttention'
  | 'critical';

export type GeneratedAccessibilityContrastPair = {
  pairId: string;
  themeName: string;
  status: string;
  ratio: number | null;
};

export type GeneratedAccessibilitySummary = {
  score: number;
  status: GeneratedAccessibilitySummaryStatus;
  contrastPairs: GeneratedAccessibilityContrastPair[];
};

function statusFromScore(
  score: number,
): GeneratedAccessibilitySummaryStatus {
  if (score >= 90) {
    return 'healthy';
  }

  if (score >= 60) {
    return 'needsAttention';
  }

  return 'critical';
}

function scoreFromIssues({
  criticalIssues,
  warningIssues,
}: {
  criticalIssues: number;
  warningIssues: number;
}): number {
  return Math.max(0, 100 - criticalIssues * 25 - warningIssues * 10);
}

export function createGeneratedAccessibilitySummary(
  source: DesignSystemProjectSource,
): GeneratedAccessibilitySummary | null {
  const colorTokenSet = source.tokenSets.find(
    (tokenSet) => tokenSet.type === 'color',
  );

  if (!colorTokenSet) {
    return null;
  }

  if (colorTokenSet.isMalformed) {
    return {
      score: 75,
      status: 'critical',
      contrastPairs: [],
    };
  }

  const sortedThemes = sortThemesByMode(source.themes);
  const colorTokenOptions = createThemeColorTokenOptions(colorTokenSet.tokens);
  const resolvedTokens = resolveDesignTokens(colorTokenSet.tokens);

  let warningIssues = 0;
  let criticalIssues = resolvedTokens.errors.length;

  const contrastPairs = sortedThemes.flatMap((theme) =>
    getThemeContrastPairs({
      tokens: theme.tokens,
      colorTokenOptions,
    }).map((pair) => {
      if (!pair.foregroundValue) {
        warningIssues += 1;
      }

      if (!pair.backgroundValue) {
        warningIssues += 1;
      }

      if (pair.contrast?.status === 'warning') {
        warningIssues += 1;
      }

      if (pair.contrast?.status === 'fail') {
        criticalIssues += 1;
      }

      return {
        pairId: pair.key,
        themeName: theme.name,
        status: pair.contrast?.status ?? 'missing',
        ratio: pair.contrast?.ratio ?? null,
      };
    }),
  );

  if (sortedThemes.length === 0) {
    criticalIssues += 1;
  }

  const score = scoreFromIssues({
    criticalIssues,
    warningIssues,
  });

  return {
    score,
    status: statusFromScore(score),
    contrastPairs,
  };
}
