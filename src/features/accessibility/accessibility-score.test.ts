import { describe, expect, it } from 'vitest';
import {
  ACCESSIBILITY_SCORE_BASE,
  ACCESSIBILITY_SCORE_PENALTIES,
  createAccessibilityScoreBreakdown,
} from './accessibility-score';

describe('createAccessibilityScoreBreakdown', () => {
  it('returns the full score when no issue is detected', () => {
    expect(
      createAccessibilityScoreBreakdown({
        criticalIssues: 0,
        warningIssues: 0,
      }),
    ).toEqual({
      baseScore: ACCESSIBILITY_SCORE_BASE,
      criticalIssues: 0,
      warningIssues: 0,
      criticalPenalty: 0,
      warningPenalty: 0,
      totalPenalty: 0,
      rawScore: 100,
      score: 100,
      isFloored: false,
    });
  });

  it('exposes each fixed issue penalty', () => {
    expect(
      createAccessibilityScoreBreakdown({
        criticalIssues: 2,
        warningIssues: 3,
      }),
    ).toEqual({
      baseScore: 100,
      criticalIssues: 2,
      warningIssues: 3,
      criticalPenalty: 2 * ACCESSIBILITY_SCORE_PENALTIES.critical,
      warningPenalty: 3 * ACCESSIBILITY_SCORE_PENALTIES.warning,
      totalPenalty: 80,
      rawScore: 20,
      score: 20,
      isFloored: false,
    });
  });

  it('floors the displayed score at zero while retaining the raw result', () => {
    expect(
      createAccessibilityScoreBreakdown({
        criticalIssues: 4,
        warningIssues: 3,
      }),
    ).toEqual({
      baseScore: 100,
      criticalIssues: 4,
      warningIssues: 3,
      criticalPenalty: 100,
      warningPenalty: 30,
      totalPenalty: 130,
      rawScore: -30,
      score: 0,
      isFloored: true,
    });
  });
});
