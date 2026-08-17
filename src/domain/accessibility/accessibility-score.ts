export const ACCESSIBILITY_SCORE_BASE = 100;

export const ACCESSIBILITY_SCORE_PENALTIES = {
  critical: 25,
  warning: 10,
} as const;

export type AccessibilityScoreBreakdown = {
  baseScore: number;
  criticalIssues: number;
  warningIssues: number;
  criticalPenalty: number;
  warningPenalty: number;
  totalPenalty: number;
  rawScore: number;
  score: number;
  isFloored: boolean;
};

export function createAccessibilityScoreBreakdown({
  criticalIssues,
  warningIssues,
}: {
  criticalIssues: number;
  warningIssues: number;
}): AccessibilityScoreBreakdown {
  const criticalPenalty =
    criticalIssues * ACCESSIBILITY_SCORE_PENALTIES.critical;
  const warningPenalty = warningIssues * ACCESSIBILITY_SCORE_PENALTIES.warning;
  const totalPenalty = criticalPenalty + warningPenalty;
  const rawScore = ACCESSIBILITY_SCORE_BASE - totalPenalty;

  return {
    baseScore: ACCESSIBILITY_SCORE_BASE,
    criticalIssues,
    warningIssues,
    criticalPenalty,
    warningPenalty,
    totalPenalty,
    rawScore,
    score: Math.max(0, rawScore),
    isFloored: rawScore < 0,
  };
}
