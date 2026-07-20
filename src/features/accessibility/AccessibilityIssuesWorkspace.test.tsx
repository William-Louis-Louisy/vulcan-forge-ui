import { render, screen, within } from '@testing-library/react';
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
  automatic: 'Automated check',
  recommendation: 'Recommended action',
  columns: {
    severity: 'Severity',
    scope: 'Scope',
    rule: 'Rule',
    affected: 'Affected',
  },
  actions: {
    openTokens: 'Open tokens editor',
    openThemes: 'Open themes editor',
  },
  scopes: {
    themeContrast: 'Theme contrast',
    tokenResolution: 'Token resolution',
    tokenSet: 'Token set',
    theme: 'Theme',
  },
  pairs: {
    contentOnBackground: 'Content on background',
    contentOnSurface: 'Content on surface',
    mutedOnBackground: 'Secondary content on background',
    mutedOnSurface: 'Secondary content on surface',
    accentOnBackground: 'Accent on background',
    accentOnSurface: 'Accent on surface',
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
    const { container } = render(
      <AccessibilityIssuesWorkspace
        projectSlug="forge"
        issues={issues}
        labels={labels}
      />,
    );

    const detail = container.querySelector('#accessibility-issue-detail');

    expect(detail).not.toBeNull();
    expect(
      within(detail as HTMLElement).getByText('Review this pair.'),
    ).toBeInTheDocument();
    expect(
      within(detail as HTMLElement).getByText('4.10:1 / required 4.5:1'),
    ).toBeInTheDocument();
    expect(
      within(detail as HTMLElement).getByRole('img', {
        name: 'Foreground value: #777777',
      }),
    ).toBeInTheDocument();

    const themesLink = within(detail as HTMLElement).getByRole('link', {
      name: 'Open themes editor',
    });
    expect(themesLink.getAttribute('href')).toContain(
      '/app/projects/forge/themes',
    );

    await user.click(
      screen.getAllByRole('button', { name: /Token resolution error/ })[0]!,
    );

    expect(
      within(detail as HTMLElement).getByText('Fix the token alias.'),
    ).toBeInTheDocument();
    expect(
      within(detail as HTMLElement).getByText('color.semantic.accent'),
    ).toBeInTheDocument();

    const tokensLink = within(detail as HTMLElement).getByRole('link', {
      name: 'Open tokens editor',
    });
    expect(tokensLink.getAttribute('href')).toContain(
      '/app/projects/forge/tokens',
    );
  });

  it('renders a desktop issue table and color swatches', () => {
    render(
      <AccessibilityIssuesWorkspace
        projectSlug="forge"
        issues={issues}
        labels={labels}
      />,
    );

    expect(
      screen.getByRole('columnheader', { name: 'Severity' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Affected' }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('img', { name: 'Foreground value: #777777' }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('img', { name: 'Background value: #ffffff' }).length,
    ).toBeGreaterThan(0);
  });

  it('renders the localized empty state when there are no issues', () => {
    render(
      <AccessibilityIssuesWorkspace
        projectSlug="forge"
        issues={[]}
        labels={labels}
      />,
    );

    expect(screen.getByText('No issue detected.')).toBeInTheDocument();
    expect(
      screen.getByText('No automated issue was detected.'),
    ).toBeInTheDocument();
  });
});
