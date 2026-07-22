import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectWorkspaceHeader } from './ProjectWorkspaceHeader';

describe('ProjectWorkspaceHeader', () => {
  it('renders the shared hierarchy and keeps project context compact-only', () => {
    render(
      <ProjectWorkspaceHeader
        eyebrow="Workspace"
        title="Exports"
        description="Generate files from the current model."
        projectName="Atlas"
        status={<span>Ready</span>}
        actions={<button type="button">Download</button>}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Exports' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Download' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Atlas')).toHaveClass('xl:hidden');
  });

  it('keeps footer navigation attached to the standard bar separator', () => {
    const { container } = render(
      <ProjectWorkspaceHeader
        variant="bar"
        title="Tokens"
        footer={<nav aria-label="Token categories" />}
      />,
    );
    const header = container.querySelector('[data-project-workspace-header]');

    expect(header).toHaveClass(
      'border-b',
      'bg-background-app',
      'pt-4',
    );
    expect(header).not.toHaveClass('py-4');
    expect(
      screen.getByRole('navigation', { name: 'Token categories' }),
    ).toBeInTheDocument();
  });
});
