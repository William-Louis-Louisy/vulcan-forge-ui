import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WorkspaceState } from './WorkspaceState';

describe('WorkspaceState', () => {
  it('renders the shared state hierarchy and action', () => {
    render(
      <WorkspaceState
        eyebrow="Workspace unavailable"
        title="Unable to load tokens"
        description="Try loading this workspace again."
        action={<button type="button">Retry</button>}
        tone="danger"
        align="start"
        headingLevel={1}
        role="alert"
      />,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Unable to load tokens',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-action-danger/10');
    expect(screen.getByText('Workspace unavailable')).toHaveClass(
      'text-action-danger',
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('supports compact empty-state presentation', () => {
    render(
      <WorkspaceState
        title="No results"
        description="Change the current search."
        width="md"
        headingLevel={3}
        dashed
      />,
    );

    const state = screen.getByText('No results').parentElement;

    expect(state).toHaveClass('max-w-lg', 'border-dashed', 'text-center');
    expect(
      screen.getByRole('heading', { level: 3, name: 'No results' }),
    ).toBeInTheDocument();
  });
});
