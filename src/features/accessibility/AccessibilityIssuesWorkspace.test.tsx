import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import { AccessibilityIssuesWorkspace } from './AccessibilityIssuesWorkspace';
import type { AccessibilityCenterIssue } from './accessibility-center.utils';

type MockAppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

vi.mock('@/components/navigation/AppLink', () => ({
  AppLink: ({ href, children, ...props }: MockAppLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

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

const componentIssue: AccessibilityCenterIssue = {
  id: 'componentContract:missingComponentFocusVisibleState:button-contract',
  code: 'missingComponentFocusVisibleState',
  severity: 'critical',
  scope: 'componentContract',
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
  componentId: 'button-contract',
  componentType: 'button',
  componentName: 'Button',
  affectedField: 'focusVisible',
  affectedCount: null,
  missingLocales: [],
  bindingKey: null,
  expectedTokenType: null,
  actualTokenType: null,
};

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
    openComponents: 'Open components registry',
  },
  scopes: {
    themeContrast: 'Theme contrast',
    tokenResolution: 'Token resolution',
    tokenSet: 'Token set',
    theme: 'Theme',
    tokenDocumentation: 'Token documentation',
    componentContract: 'Component contract',
    componentBinding: 'Component binding',
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
    missingTokenDescription: 'Missing token description',
    invalidTokenSet: 'Invalid token set',
    invalidComponentContract: 'Invalid component contract',
    missingComponentLocalization: 'Missing component localization',
    missingComponentAccessibilityRules: 'Missing accessibility rules',
    missingComponentFocusVisibleState: 'Missing focus-visible state',
    unresolvedComponentTokenBinding: 'Unresolved component token binding',
    componentTokenTypeMismatch: 'Component token type mismatch',
  },
  issueFixes: {
    missingForegroundColor: 'Add a foreground color.',
    missingBackgroundColor: 'Add a background color.',
    contrastWarning: 'Review this pair.',
    contrastFail: 'Increase contrast.',
    tokenResolutionError: 'Fix the token alias.',
    invalidColorTokenSet: 'Repair the token set.',
    missingThemes: 'Add a theme.',
    missingTokenDescription: 'Document the token.',
    invalidTokenSet: 'Repair the token set.',
    invalidComponentContract: 'Repair the component contract.',
    missingComponentLocalization: 'Complete component translations.',
    missingComponentAccessibilityRules: 'Document accessibility rules.',
    missingComponentFocusVisibleState: 'Add a focus-visible state.',
    unresolvedComponentTokenBinding: 'Point to an existing token.',
    componentTokenTypeMismatch: 'Align the token types.',
  },
  severities: {
    warning: 'Warning',
    critical: 'Critical',
  },
  details: {
    tokenPath: 'Token path',
    tokenSet: 'Token set',
    component: 'Component',
    componentType: 'Component type',
    affectedField: 'Affected field',
    affectedCount: 'Affected items',
    missingLocales: 'Missing languages',
    bindingKey: 'Binding key',
    expectedTokenType: 'Expected token type',
    actualTokenType: 'Actual token type',
    foreground: 'Foreground',
    background: 'Background',
    foregroundValue: 'Foreground value',
    backgroundValue: 'Background value',
    ratio: 'Ratio',
    fields: {
      description: 'Description',
      tokenSet: 'Token set data',
      contract: 'Contract data',
      purpose: 'Purpose',
      anatomy: 'Anatomy labels',
      variants: 'Variant labels',
      sizes: 'Size labels',
      states: 'State labels',
      accessibility: 'Accessibility rules',
      focusVisible: 'Focus-visible state',
      tokenBindings: 'Token bindings',
    },
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

  it('opens the components registry and exposes component context', () => {
    const { container } = render(
      <AccessibilityIssuesWorkspace
        projectSlug="forge"
        issues={[componentIssue]}
        labels={{ ...labels, count: '1 issue' }}
      />,
    );

    const detail = container.querySelector('#accessibility-issue-detail');

    expect(detail).not.toBeNull();
    expect(within(detail as HTMLElement).getByText('Button')).toBeInTheDocument();
    expect(
      within(detail as HTMLElement).getByText('Focus-visible state'),
    ).toBeInTheDocument();

    const componentsLink = within(detail as HTMLElement).getByRole('link', {
      name: 'Open components registry',
    });
    expect(componentsLink.getAttribute('href')).toContain(
      '/app/projects/forge/components',
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

  it('keeps the compact order while stacking secondary report content in the desktop main column', () => {
    const { container } = render(
      <AccessibilityIssuesWorkspace
        projectSlug="forge"
        issues={issues}
        labels={labels}
      >
        <section>Key contrast pairs</section>
      </AccessibilityIssuesWorkspace>,
    );

    const issuesSlot = container.querySelector(
      '[data-accessibility-layout-slot="issues"]',
    );
    const detailSlot = container.querySelector(
      '[data-accessibility-layout-slot="detail"]',
    );
    const secondarySlot = container.querySelector(
      '[data-accessibility-layout-slot="secondary"]',
    );

    expect(issuesSlot).toHaveClass('order-1', 'xl:order-none');
    expect(detailSlot).toHaveClass('order-2', 'xl:order-none');
    expect(secondarySlot).toHaveClass('order-3', 'xl:order-none');
    expect(issuesSlot?.parentElement).toHaveClass(
      'contents',
      'xl:flex',
      'xl:flex-col',
    );
    expect(screen.getByText('Key contrast pairs')).toBeInTheDocument();
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
