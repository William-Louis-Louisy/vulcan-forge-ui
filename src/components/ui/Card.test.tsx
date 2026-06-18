import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Card } from './Card';

describe('Card', () => {
  it('renders its content', () => {
    render(<Card>Card content</Card>);

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders the default variant by default', () => {
    render(<Card>Default card</Card>);

    expect(screen.getByText('Default card')).toHaveClass(
      'bg-surface-primary',
      'shadow-soft',
    );
  });

  it('renders the subtle variant', () => {
    render(<Card variant="subtle">Subtle card</Card>);

    expect(screen.getByText('Subtle card')).toHaveClass('bg-background-subtle');
  });

  it('renders the elevated variant', () => {
    render(<Card variant="elevated">Elevated card</Card>);

    expect(screen.getByText('Elevated card')).toHaveClass(
      'bg-surface-elevated',
      'shadow-elevated',
    );
  });

  it('renders the large padding', () => {
    render(<Card padding="lg">Large card</Card>);

    expect(screen.getByText('Large card')).toHaveClass('p-6');
  });
});
