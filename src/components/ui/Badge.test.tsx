import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge>Draft</Badge>);

    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders the default variant by default', () => {
    render(<Badge>Default</Badge>);

    expect(screen.getByText('Default')).toHaveClass(
      'bg-background-subtle',
      'text-content-tertiary',
    );
  });

  it('renders the accent variant', () => {
    render(<Badge variant="accent">Accent</Badge>);

    expect(screen.getByText('Accent')).toHaveClass(
      'bg-action-accent/10',
      'text-action-accent',
    );
  });

  it('renders the success variant', () => {
    render(<Badge variant="success">Ready</Badge>);

    expect(screen.getByText('Ready')).toHaveClass(
      'bg-action-success/10',
      'text-action-success',
    );
  });

  it('renders the warning variant', () => {
    render(<Badge variant="warning">Draft</Badge>);

    expect(screen.getByText('Draft')).toHaveClass(
      'bg-action-warning/10',
      'text-action-warning',
    );
  });

  it('renders the danger variant', () => {
    render(<Badge variant="danger">Failed</Badge>);

    expect(screen.getByText('Failed')).toHaveClass(
      'bg-action-danger/10',
      'text-action-danger',
    );
  });

  it('renders the small size', () => {
    render(<Badge size="sm">Small</Badge>);

    expect(screen.getByText('Small')).toHaveClass('px-2', 'text-[11px]');
  });
});
