import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Notice } from './Notice';

describe('Notice', () => {
  it('renders its content', () => {
    render(<Notice>Something needs attention.</Notice>);

    expect(screen.getByText('Something needs attention.')).toBeInTheDocument();
  });

  it('renders a title when provided', () => {
    render(<Notice title="Warning">Missing data.</Notice>);

    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Missing data.')).toBeInTheDocument();
  });

  it('renders the default tone by default', () => {
    render(<Notice>Default notice</Notice>);

    expect(screen.getByText('Default notice').parentElement).toHaveClass(
      'bg-background-subtle',
      'text-content-secondary',
    );
  });

  it('renders the warning tone', () => {
    render(<Notice tone="warning">Warning notice</Notice>);

    expect(screen.getByText('Warning notice').parentElement).toHaveClass(
      'bg-action-warning/10',
      'text-action-warning',
    );
  });

  it('renders the danger tone', () => {
    render(<Notice tone="danger">Danger notice</Notice>);

    expect(screen.getByText('Danger notice').parentElement).toHaveClass(
      'bg-action-danger/10',
      'text-action-danger',
    );
  });

  it('renders the success tone', () => {
    render(<Notice tone="success">Success notice</Notice>);

    expect(screen.getByText('Success notice').parentElement).toHaveClass(
      'bg-action-success/10',
      'text-action-success',
    );
  });

  it('renders the info tone', () => {
    render(<Notice tone="info">Info notice</Notice>);

    expect(screen.getByText('Info notice').parentElement).toHaveClass(
      'bg-action-info/10',
      'text-action-info',
    );
  });
});
