import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createAccessibilityScoreBreakdown } from './accessibility-score';
import { AccessibilityScoreExplanation } from './AccessibilityScoreExplanation';

const labels = {
  trigger: 'Explain the indicative score',
  title: 'How the score is calculated',
  description: 'The score starts at 100.',
  formula: '100 − (critical issues × 25) − (warnings × 10)',
  baseScore: 'Starting score',
  criticalIssues: '4 critical issues',
  warningIssues: '3 warnings',
  totalPenalty: 'Total deduction',
  currentScore: 'Displayed score',
  floorNotice: 'The raw result is -30. The displayed score is floored at 0.',
  disclaimer: 'This is not a percentage of WCAG compliance.',
  close: 'Close score explanation',
};

describe('AccessibilityScoreExplanation', () => {
  it('opens an accessible score breakdown and closes it with Escape', async () => {
    const user = userEvent.setup();

    render(
      <AccessibilityScoreExplanation
        breakdown={createAccessibilityScoreBreakdown({
          criticalIssues: 4,
          warningIssues: 3,
        })}
        labels={labels}
      />,
    );

    const trigger = screen.getByRole('button', { name: labels.trigger });

    expect(
      screen.queryByRole('dialog', { name: labels.title }),
    ).not.toBeInTheDocument();

    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: labels.title });

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveClass(
      'fixed',
      'inset-x-4',
      'max-h-[calc(100dvh-2rem)]',
      'overflow-y-auto',
      'sm:absolute',
      'sm:inset-x-auto',
    );
    expect(screen.getByText('−100')).toBeInTheDocument();
    expect(screen.getByText('−30')).toBeInTheDocument();
    expect(screen.getByText('−130')).toBeInTheDocument();
    expect(screen.getByText('0/100')).toBeInTheDocument();
    expect(screen.getByText(labels.floorNotice)).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: labels.title }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('does not show a floor notice when the raw score remains positive', async () => {
    const user = userEvent.setup();

    render(
      <AccessibilityScoreExplanation
        breakdown={createAccessibilityScoreBreakdown({
          criticalIssues: 1,
          warningIssues: 1,
        })}
        labels={labels}
      />,
    );

    await user.click(
      screen.getByRole('button', {
        name: labels.trigger,
      }),
    );

    expect(screen.getByText('65/100')).toBeInTheDocument();
    expect(screen.queryByText(labels.floorNotice)).not.toBeInTheDocument();
  });
});
