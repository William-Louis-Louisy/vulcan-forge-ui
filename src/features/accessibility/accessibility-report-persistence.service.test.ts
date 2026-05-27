import { describe, expect, it } from 'vitest';
import {
  mapAccessibilityReportStatus,
  serializeAccessibilityIssues,
} from './accessibility-report-persistence.service';

describe('accessibility report persistence service', () => {
  it('maps healthy reports to pass', () => {
    expect(mapAccessibilityReportStatus('healthy')).toBe('pass');
  });

  it('maps needsAttention reports to warning', () => {
    expect(mapAccessibilityReportStatus('needsAttention')).toBe('warning');
  });

  it('maps critical reports to fail', () => {
    expect(mapAccessibilityReportStatus('critical')).toBe('fail');
  });

  it('serializes accessibility issues for Prisma JSON persistence', () => {
    expect(
      serializeAccessibilityIssues([
        {
          code: 'contrastFail',
          severity: 'critical',
          pairId: 'contentPrimaryOnAppBackground',
          foregroundTokenPath: 'color.semantic.content.primary',
          backgroundTokenPath: 'color.semantic.background.app',
          tokenPath: null,
        },
      ]),
    ).toEqual([
      {
        code: 'contrastFail',
        severity: 'critical',
        pairId: 'contentPrimaryOnAppBackground',
        foregroundTokenPath: 'color.semantic.content.primary',
        backgroundTokenPath: 'color.semantic.background.app',
        tokenPath: null,
      },
    ]);
  });
});
