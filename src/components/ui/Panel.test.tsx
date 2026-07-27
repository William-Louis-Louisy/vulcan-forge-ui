import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Panel } from './Panel';

describe('Panel', () => {
  it('renders its content', () => {
    render(<Panel>Panel content</Panel>);

    expect(screen.getByText('Panel content')).toBeInTheDocument();
  });

  it('renders the default variant by default', () => {
    render(<Panel>Default panel</Panel>);

    expect(screen.getByText('Default panel')).toHaveClass(
      'bg-surface-primary',
      'shadow-soft',
      'rounded-xl',
      'border',
      'border-border-subtle',
    );
  });

  it('renders the subtle variant', () => {
    render(<Panel variant="subtle">Subtle panel</Panel>);

    expect(screen.getByText('Subtle panel')).toHaveClass(
      'bg-background-subtle',
    );
  });

  it('renders no padding when requested', () => {
    render(<Panel padding="none">No padding panel</Panel>);

    expect(screen.getByText('No padding panel')).toHaveClass('p-0');
  });

  it('renders the large padding', () => {
    render(<Panel padding="lg">Large panel</Panel>);

    expect(screen.getByText('Large panel')).toHaveClass('p-8');
  });
});
