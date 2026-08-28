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
  anatomy: ['root'],
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
      <span data-testid="canvas-view">{workspace.canvasView}</span>
      <span data-testid="selection-kind">
        {workspace.authoringSelection.kind}
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
      <button type="button" onClick={() => workspace.setCanvasView('anatomy')}>
        Show anatomy
      </button>
      <button
        type="button"
        onClick={() => {
          const firstPart = workspace.draft.anatomy[0];

          if (!firstPart) {
            return;
          }

          workspace.setAuthoringSelection({
            kind: 'anatomyPart',
            draftId: firstPart.draftId,
          });
        }}
      >
        Select anatomy part
      </button>
    </>
  );
}

function PreviewProbe() {
  const preview = useComponentContractPreview();

  return <span data-testid="preview-name">{preview?.contract.name}</span>;
}

function renderWorkspace() {
  return render(
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
}

describe('ComponentContractWorkspaceProvider', () => {
  it('keeps the last valid preview while sharing the draft', async () => {
    const user = userEvent.setup();

    renderWorkspace();

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

  it('keeps canvas view and authoring selection as independent transient state', async () => {
    const user = userEvent.setup();

    renderWorkspace();

    expect(screen.getByTestId('canvas-view')).toHaveTextContent('preview');
    expect(screen.getByTestId('selection-kind')).toHaveTextContent('component');

    await user.click(
      screen.getByRole('button', { name: 'Select anatomy part' }),
    );

    expect(screen.getByTestId('selection-kind')).toHaveTextContent(
      'anatomyPart',
    );
    expect(screen.getByTestId('canvas-view')).toHaveTextContent('preview');

    await user.click(screen.getByRole('button', { name: 'Show anatomy' }));

    expect(screen.getByTestId('canvas-view')).toHaveTextContent('anatomy');
    expect(screen.getByTestId('selection-kind')).toHaveTextContent(
      'anatomyPart',
    );
  });
});
