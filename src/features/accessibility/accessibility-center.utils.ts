import { z } from 'zod';
import {
  designTokenSchema,
  resolveDesignTokens,
  type TokenResolutionError,
} from '@/domain/design-system';
import {
  evaluateKeyContrastPairs,
  type KeyContrastIssue,
  type KeyContrastPairEvaluation,
} from '@/domain/accessibility';

const designTokenArraySchema = z.array(designTokenSchema);

export type AccessibilityCenterIssueCode =
  | KeyContrastIssue['code']
  | 'tokenResolutionError'
  | 'invalidColorTokenSet';

export type AccessibilityCenterIssueSeverity = 'warning' | 'critical';

export type AccessibilityCenterIssue = {
  code: AccessibilityCenterIssueCode;
  severity: AccessibilityCenterIssueSeverity;
  pairId: KeyContrastIssue['pairId'] | null;
  foregroundTokenPath: string | null;
  backgroundTokenPath: string | null;
  tokenPath: string | null;
};

export type AccessibilityCenterReport = {
  score: number;
  status: 'healthy' | 'needsAttention' | 'critical';
  issues: AccessibilityCenterIssue[];
  contrastPairs: KeyContrastPairEvaluation[];
  isReadable: boolean;
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

function mapKeyContrastIssue(
  issue: KeyContrastIssue,
): AccessibilityCenterIssue {
  return {
    code: issue.code,
    severity: issue.severity,
    pairId: issue.pairId,
    foregroundTokenPath: issue.foregroundTokenPath,
    backgroundTokenPath: issue.backgroundTokenPath,
    tokenPath: null,
  };
}

function mapTokenResolutionError(
  error: TokenResolutionError,
): AccessibilityCenterIssue {
  return {
    code: 'tokenResolutionError',
    severity: 'critical',
    pairId: null,
    foregroundTokenPath: null,
    backgroundTokenPath: null,
    tokenPath: error.tokenPath,
  };
}

export function createAccessibilityCenterReport(
  colorTokenSetTokens: unknown,
): AccessibilityCenterReport {
  const parsedTokens = designTokenArraySchema.safeParse(colorTokenSetTokens);

  if (!parsedTokens.success) {
    const issues: AccessibilityCenterIssue[] = [
      {
        code: 'invalidColorTokenSet',
        severity: 'critical',
        pairId: null,
        foregroundTokenPath: null,
        backgroundTokenPath: null,
        tokenPath: null,
      },
    ];

    return {
      score: scoreFromIssues(issues),
      status: 'critical',
      issues,
      contrastPairs: [],
      isReadable: false,
    };
  }

  const resolvedTokens = resolveDesignTokens(parsedTokens.data);

  const getColorValue = (tokenPath: string) => {
    const token = resolvedTokens.tokens.find(
      (resolvedToken) => resolvedToken.path === tokenPath,
    );

    return typeof token?.resolvedValue === 'string'
      ? token.resolvedValue
      : null;
  };

  const contrastReport = evaluateKeyContrastPairs({
    getColorValue,
  });

  const issues = [
    ...resolvedTokens.errors.map(mapTokenResolutionError),
    ...contrastReport.issues.map(mapKeyContrastIssue),
  ];

  const score = scoreFromIssues(issues);

  return {
    score,
    status: statusFromScore(score),
    issues,
    contrastPairs: contrastReport.pairs,
    isReadable: true,
  };
}
