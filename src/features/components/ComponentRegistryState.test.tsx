import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComponentRegistryState } from './ComponentRegistryState';

describe('ComponentRegistryState', () => {
  it('renders a compact empty state with localized content', () => {
    render(
      <ComponentRegistryState
        title="No components yet"
        description="Create a component contract to get started."
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'No components yet' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Create a component contract to get started.'),
    ).toBeInTheDocument();
  });

  it('renders an action and supports the danger tone', () => {
    render(
      <ComponentRegistryState
        role="alert"
        tone="danger"
        title="Unable to load components"
        description="Try again."
        action={<button type="button">Retry</button>}
      />,
    );

    expect(screen.getByRole('alert')).toHaveClass('border-action-danger/30');
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});
