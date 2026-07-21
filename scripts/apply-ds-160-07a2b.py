from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file_path = Path(path)
    content = file_path.read_text(encoding='utf-8')
    count = content.count(old)

    if count != 1:
        raise RuntimeError(f'{path}: expected one match, found {count}')

    file_path.write_text(content.replace(old, new), encoding='utf-8')


replace_once(
    'src/features/accessibility/accessibility-center.utils.ts',
    """import type {
  AccessibilityRuleComponentContractSource,
  AccessibilityRuleTokenSetSource,
} from './accessibility-rule-sources';
""",
    """import type {
  AccessibilityRuleComponentContractSource,
  AccessibilityRuleTokenSetSource,
} from './accessibility-rule-sources';
import {
  createAccessibilityScoreBreakdown,
  type AccessibilityScoreBreakdown,
} from './accessibility-score';
""",
)

replace_once(
    'src/features/accessibility/accessibility-center.utils.ts',
    """export type AccessibilityCenterReport = {
  score: number;
  status: 'healthy' | 'needsAttention' | 'critical';
""",
    """export type AccessibilityCenterReport = {
  score: number;
  scoreBreakdown: AccessibilityScoreBreakdown;
  status: 'healthy' | 'needsAttention' | 'critical';
""",
)

replace_once(
    'src/features/accessibility/accessibility-center.utils.ts',
    """function scoreFromIssues(issues: readonly AccessibilityCenterIssue[]): number {
  const penalty = issues.reduce((total, issue) => {
    return total + (issue.severity === 'critical' ? 25 : 10);
  }, 0);

  return Math.max(0, 100 - penalty);
}
""",
    """function scoreBreakdownFromIssues(
  issues: readonly AccessibilityCenterIssue[],
): AccessibilityScoreBreakdown {
  return createAccessibilityScoreBreakdown({
    criticalIssues: issues.filter((issue) => issue.severity === 'critical').length,
    warningIssues: issues.filter((issue) => issue.severity === 'warning').length,
  });
}
""",
)

replace_once(
    'src/features/accessibility/accessibility-center.utils.ts',
    """  if (!parsedTokens.success) {
    const issues = [createTokenSetIssue(), ...expandedIssues];
    const score = scoreFromIssues(issues);

    return {
      score,
      status: 'critical',
""",
    """  if (!parsedTokens.success) {
    const issues = [createTokenSetIssue(), ...expandedIssues];
    const scoreBreakdown = scoreBreakdownFromIssues(issues);

    return {
      score: scoreBreakdown.score,
      scoreBreakdown,
      status: 'critical',
""",
)

replace_once(
    'src/features/accessibility/accessibility-center.utils.ts',
    """  const score = scoreFromIssues(issues);

  return {
    score,
    status: statusFromScore(score),
""",
    """  const scoreBreakdown = scoreBreakdownFromIssues(issues);

  return {
    score: scoreBreakdown.score,
    scoreBreakdown,
    status: statusFromScore(scoreBreakdown.score),
""",
)

replace_once(
    'src/app/[locale]/app/projects/[projectSlug]/accessibility/page.tsx',
    """import { AccessibilityIssuesWorkspace } from '@/features/accessibility/AccessibilityIssuesWorkspace';
import { SaveAccessibilityReportButton } from '@/features/accessibility/SaveAccessibilityReportButton';
""",
    """import { AccessibilityIssuesWorkspace } from '@/features/accessibility/AccessibilityIssuesWorkspace';
import { AccessibilityScoreExplanation } from '@/features/accessibility/AccessibilityScoreExplanation';
import { SaveAccessibilityReportButton } from '@/features/accessibility/SaveAccessibilityReportButton';
""",
)

replace_once(
    'src/app/[locale]/app/projects/[projectSlug]/accessibility/page.tsx',
    """          <p className=\"text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase\">
            {t('score.eyebrow')}
          </p>
          <div className=\"mt-1 flex items-end gap-1.5\">
""",
    """          <div className=\"flex items-center gap-1.5\">
            <p className=\"text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase\">
              {t('score.eyebrow')}
            </p>
            <AccessibilityScoreExplanation
              breakdown={report.scoreBreakdown}
              labels={{
                trigger: t('score.help.trigger'),
                title: t('score.help.title'),
                description: t('score.help.description'),
                formula: t('score.help.formula'),
                baseScore: t('score.help.baseScore'),
                criticalIssues: t('score.help.criticalIssues', {
                  count: report.scoreBreakdown.criticalIssues,
                }),
                warningIssues: t('score.help.warningIssues', {
                  count: report.scoreBreakdown.warningIssues,
                }),
                totalPenalty: t('score.help.totalPenalty'),
                currentScore: t('score.help.currentScore'),
                floorNotice: t('score.help.floorNotice', {
                  score: report.scoreBreakdown.rawScore,
                }),
                disclaimer: t('score.help.disclaimer'),
                close: t('score.help.close'),
              }}
            />
          </div>
          <div className=\"mt-1 flex items-end gap-1.5\">
""",
)

replace_once(
    'src/messages/accessibility-center-messages.ts',
    """      score: {
        validationSummary: 'Validation summary',
        automatedChecks: 'Automated issues',
        contrastChecks: 'Contrast passed',
        warningIssues: 'Warnings',
      },
""",
    """      score: {
        validationSummary: 'Validation summary',
        automatedChecks: 'Automated issues',
        contrastChecks: 'Contrast passed',
        warningIssues: 'Warnings',
        help: {
          trigger: 'Explain the indicative score',
          title: 'How the score is calculated',
          description:
            'The score starts at 100 and applies a fixed deduction for every automated issue detected in the current project data.',
          formula: '100 − (critical issues × 25) − (warnings × 10)',
          baseScore: 'Starting score',
          criticalIssues:
            '{count, plural, one {# critical issue} other {# critical issues}}',
          warningIssues: '{count, plural, one {# warning} other {# warnings}}',
          totalPenalty: 'Total deduction',
          currentScore: 'Displayed score',
          floorNotice:
            'The raw result is {score}. The displayed score is floored at 0.',
          disclaimer:
            'This is a prioritization signal, not a percentage of WCAG compliance. It does not replace a complete manual audit.',
          close: 'Close score explanation',
        },
      },
""",
)

replace_once(
    'src/messages/accessibility-center-messages.ts',
    """      score: {
        validationSummary: 'Synthèse de validation',
        automatedChecks: 'Problèmes automatisés',
        contrastChecks: 'Contrastes validés',
        warningIssues: 'Avertissements',
      },
""",
    """      score: {
        validationSummary: 'Synthèse de validation',
        automatedChecks: 'Problèmes automatisés',
        contrastChecks: 'Contrastes validés',
        warningIssues: 'Avertissements',
        help: {
          trigger: 'Expliquer le score indicatif',
          title: 'Comment le score est calculé',
          description:
            'Le score part de 100 et applique une pénalité fixe à chaque problème automatisé détecté dans les données actuelles du projet.',
          formula: '100 − (problèmes critiques × 25) − (avertissements × 10)',
          baseScore: 'Score de départ',
          criticalIssues:
            '{count, plural, one {# problème critique} other {# problèmes critiques}}',
          warningIssues:
            '{count, plural, one {# avertissement} other {# avertissements}}',
          totalPenalty: 'Pénalité totale',
          currentScore: 'Score affiché',
          floorNotice:
            'Le résultat brut est de {score}. Le score affiché est ramené à 0.',
          disclaimer:
            'Il s’agit d’un signal de priorisation, pas d’un pourcentage de conformité WCAG. Il ne remplace pas un audit manuel complet.',
          close: 'Fermer l’explication du score',
        },
      },
""",
)

replace_once(
    'src/features/accessibility/accessibility-center.utils.test.ts',
    """    expect(report.summary.warningIssues).toBe(1);
    expect(report.summary.criticalIssues).toBe(1);
    expect(report.score).toBe(65);
""",
    """    expect(report.summary.warningIssues).toBe(1);
    expect(report.summary.criticalIssues).toBe(1);
    expect(report.score).toBe(65);
    expect(report.scoreBreakdown).toEqual({
      baseScore: 100,
      criticalIssues: 1,
      warningIssues: 1,
      criticalPenalty: 25,
      warningPenalty: 10,
      totalPenalty: 35,
      rawScore: 65,
      score: 65,
      isFloored: false,
    });
""",
)
