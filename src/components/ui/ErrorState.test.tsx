import Link from 'next/link';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('renders one heading, real actions and an optional diagnostic reference', () => {
    render(
      <ErrorState
        code="500"
        eyebrow="Unexpected error"
        title="This surface could not be rendered."
        description="Retry the request or return to safety."
        primaryAction={<button type="button">Try again</button>}
        secondaryAction={<Link href="/app">Dashboard</Link>}
        reference="Diagnostic reference: abc123"
      />,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'This surface could not be rendered.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'href',
      '/app',
    );
    expect(screen.getByText('Diagnostic reference: abc123')).toBeVisible();
  });
});
