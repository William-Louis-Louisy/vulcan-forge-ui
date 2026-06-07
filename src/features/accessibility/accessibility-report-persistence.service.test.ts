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
    const issue = {
      id: 'themeContrast:contrastFail:light:contentOnBackground:content:background',
      code: 'contrastFail' as const,
      severity: 'critical' as const,
      scope: 'themeContrast' as const,
      themeId: 'light-theme',
      themeMode: 'light' as const,
      themeName: 'Light',
      pairId: 'contentOnBackground',
      foregroundRole: 'content' as const,
      backgroundRole: 'background' as const,
      foregroundTokenPath: 'color.semantic.content.primary',
      backgroundTokenPath: 'color.semantic.background.app',
      foregroundValue: '#777778',
      backgroundValue: '#777777',
      ratio: 1,
      requiredRatio: 4.5,
      tokenPath: null,
    };

    expect(serializeAccessibilityIssues([issue])).toEqual([issue]);
  });
});
