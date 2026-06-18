import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No components" />);

    expect(
      screen.getByRole('heading', { name: 'No components' }),
    ).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(
      <EmptyState
        title="No components"
        description="Create a component contract to continue."
      />,
    );

    expect(
      screen.getByText('Create a component contract to continue.'),
    ).toBeInTheDocument();
  });

  it('renders an action when provided', () => {
    render(
      <EmptyState title="No projects" action={<button>New project</button>} />,
    );

    expect(
      screen.getByRole('button', { name: 'New project' }),
    ).toBeInTheDocument();
  });

  it('renders the warning tone', () => {
    render(<EmptyState title="Missing data" tone="warning" />);

    expect(screen.getByText('Missing data').parentElement).toHaveClass(
      'bg-action-warning/10',
    );
  });

  it('renders the danger tone', () => {
    render(<EmptyState title="Load failed" tone="danger" />);

    expect(screen.getByText('Load failed').parentElement).toHaveClass(
      'bg-action-danger/10',
    );
  });
});
