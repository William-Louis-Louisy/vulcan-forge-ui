import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AccessibilityIssuesWorkspace } from './AccessibilityIssuesWorkspace';
import type { AccessibilityCenterIssue } from './accessibility-center.utils';

const issues: AccessibilityCenterIssue[] = [
  {
    id: 'light:contentOnBackground:contrastWarning',
    code: 'contrastWarning',
    severity: 'warning',
    scope: 'themeContrast',
    themeId: 'light-theme',
    themeMode: 'light',
    themeName: 'Light',
    pairId: 'contentOnBackground',
    foregroundRole: 'content',
    backgroundRole: 'background',
    foregroundTokenPath: 'color.semantic.content.primary',
    backgroundTokenPath: 'color.semantic.background.app',
    foregroundValue: '#777777',
    backgroundValue: '#ffffff',
    ratio: 4.1,
    requiredRatio: 4.5,
    tokenPath: null,
  },
  {
    id: 'tokenResolution:tokenResolutionError:color.semantic.accent',
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
    tokenPath: 'color.semantic.accent',
  },
];

const labels = {
  title: 'Issues to review',
  detailTitle: 'Issue detail',
  count: '2 issues',
  emptyTitle: 'No issue detected.',
  emptyDescription: 'No automated issue was detected.',
  pairs: {
    contentOnBackground: 'Content on background',
  },
  issueCodes: {
    missingForegroundColor: 'Missing foreground color',
    missingBackgroundColor: 'Missing background color',
    contrastWarning: 'Contrast warning',
    contrastFail: 'Contrast failure',
    tokenResolutionError: 'Token resolution error',
    invalidColorTokenSet: 'Invalid color token set',
    missingThemes: 'Missing themes',
  },
  issueFixes: {
    missingForegroundColor: 'Add a foreground color.',
    missingBackgroundColor: 'Add a background color.',
    contrastWarning: 'Review this pair.',
    contrastFail: 'Increase contrast.',
    tokenResolutionError: 'Fix the token alias.',
    invalidColorTokenSet: 'Repair the token set.',
    missingThemes: 'Add a theme.',
  },
  severities: {
    warning: 'Warning',
    critical: 'Critical',
  },
  details: {
    tokenPath: 'Token path',
    foreground: 'Foreground',
    background: 'Background',
    foregroundValue: 'Foreground value',
    backgroundValue: 'Background value',
    ratio: 'Ratio',
    ratioValue: (ratio: string, required: string) =>
      `${ratio}:1 / required ${required}:1`,
  },
};

describe('AccessibilityIssuesWorkspace', () => {
  it('selects the first issue and updates the detail panel', async () => {
    const user = userEvent.setup();
    render(<AccessibilityIssuesWorkspace issues={issues} labels={labels} />);

    expect(screen.getByText('Review this pair.')).toBeInTheDocument();
    expect(screen.getByText('4.10:1 / required 4.5:1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Token resolution error/ }));

    expect(screen.getByText('Fix the token alias.')).toBeInTheDocument();
    expect(screen.getAllByText('color.semantic.accent')).toHaveLength(2);
  });

  it('renders the localized empty state when there are no issues', () => {
    render(<AccessibilityIssuesWorkspace issues={[]} labels={labels} />);

    expect(screen.getByText('No issue detected.')).toBeInTheDocument();
    expect(screen.getByText('No automated issue was detected.')).toBeInTheDocument();
  });
});
