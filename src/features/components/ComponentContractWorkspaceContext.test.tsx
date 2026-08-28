import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ComponentContract } from '@/domain/design-system';

const routerMocks = vi.hoisted(() => ({
  refresh: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => routerMocks,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/app/projects/demo/components',
}));

vi.mock('@/components/layout/ProjectTopbarBreadcrumb', () => ({
  useProjectSaveStatus: vi.fn(),
}));

vi.mock('./update-component-contract.action', () => ({
  updateComponentContractAction: vi.fn(async () => ({
    status: 'idle',
    formError: null,
    savedContract: null,
  })),
}));

import {
  ComponentContractPreviewProvider,
  useComponentContractPreview,
} from './ComponentContractPreviewContext';
import {
  ComponentContractWorkspaceProvider,
  useComponentContractWorkspace,
} from './ComponentContractWorkspaceContext';

const contract: ComponentContract = {
  type: 'button',
  name: 'Button',
  purpose: {
    en: 'Triggers an action.',
  },
  status: 'ready',
  anatomy: [],
  variants: [],
  sizes: [],
  states: [],
  tokenBindings: [],
  accessibility: [],
  forbiddenPatterns: [],
};

function WorkspaceProbe() {
  const workspace = useComponentContractWorkspace();

  return (
    <>
      <span data-testid="validation-status">{workspace.validation.status}</span>
      <span data-testid="unsaved-status">
        {String(workspace.hasUnsavedChanges)}
      </span>
      <button
        type="button"
        onClick={() =>
          workspace.setDraft({
            ...workspace.draft,
            name: 'Primary Button',
          })
        }
      >
        Publish valid draft
      </button>
      <button
        type="button"
        onClick={() =>
          workspace.setDraft({
            ...workspace.draft,
            name: '',
          })
        }
      >
        Publish invalid draft
      </button>
    </>
  );
}

function PreviewProbe() {
  const preview = useComponentContractPreview();

  return <span data-testid="preview-name">{preview?.contract.name}</span>;
}

describe('ComponentContractWorkspaceProvider', () => {
  it('keeps the last valid preview while sharing the draft', async () => {
    const user = userEvent.setup();

    render(
      <ComponentContractPreviewProvider initialContract={contract}>
        <ComponentContractWorkspaceProvider
          locale="en"
          projectSlug="demo"
          contract={contract}
        >
          <WorkspaceProbe />
          <PreviewProbe />
        </ComponentContractWorkspaceProvider>
      </ComponentContractPreviewProvider>,
    );

    expect(screen.getByTestId('preview-name')).toHaveTextContent('Button');
    expect(screen.getByTestId('validation-status')).toHaveTextContent(
      'success',
    );
    expect(screen.getByTestId('unsaved-status')).toHaveTextContent('false');

    await user.click(
      screen.getByRole('button', { name: 'Publish valid draft' }),
    );

    expect(screen.getByTestId('preview-name')).toHaveTextContent(
      'Primary Button',
    );
    expect(screen.getByTestId('validation-status')).toHaveTextContent(
      'success',
    );
    expect(screen.getByTestId('unsaved-status')).toHaveTextContent('true');

    await user.click(
      screen.getByRole('button', { name: 'Publish invalid draft' }),
    );

    expect(screen.getByTestId('validation-status')).toHaveTextContent('error');
    expect(screen.getByTestId('preview-name')).toHaveTextContent(
      'Primary Button',
    );
  });
});
