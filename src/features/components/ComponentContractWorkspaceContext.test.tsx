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
  variants: [
    { key: 'primary', label: { en: 'Primary' } },
    { key: 'secondary', label: { en: 'Secondary' } },
  ],
  sizes: [
    { key: 'sm', label: { en: 'Small' } },
    { key: 'lg', label: { en: 'Large' } },
  ],
  states: [{ key: 'loading', label: { en: 'Loading' } }],
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
      <span data-testid="preview-variant">
        {workspace.resolvedPreviewConfiguration.variantKey}
      </span>
      <span data-testid="preview-size">
        {workspace.resolvedPreviewConfiguration.sizeKey}
      </span>
      <span data-testid="preview-state">
        {workspace.resolvedPreviewConfiguration.stateKey || 'base'}
      </span>
      <span data-testid="preview-axis-variant">
        {workspace.previewAxes.variants[0]?.key ?? 'none'}
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
            variants: workspace.draft.variants.map((variant, index) =>
              index === 0 ? { ...variant, key: 'renamed-primary' } : variant,
            ),
          })
        }
      >
        Publish invalid draft
      </button>
      <button type="button" onClick={() => workspace.setCanvasView('anatomy')}>
        Show anatomy
      </button>
      <button type="button" onClick={() => workspace.setCanvasView('matrix')}>
        Show matrix
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
      <button
        type="button"
        onClick={() => {
          const secondaryVariant = workspace.draft.variants[1];
          const largeSize = workspace.draft.sizes[1];
          const loadingState = workspace.draft.states[0];

          if (!secondaryVariant || !largeSize || !loadingState) {
            return;
          }

          workspace.setPreviewConfiguration({
            variantDraftId: secondaryVariant.draftId,
            sizeDraftId: largeSize.draftId,
            stateDraftId: loadingState.draftId,
          });
        }}
      >
        Change preview configuration
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
  it('keeps the last valid preview and axis snapshot while sharing the draft', async () => {
    const user = userEvent.setup();

    renderWorkspace();

    expect(screen.getByTestId('preview-name')).toHaveTextContent('Button');
    expect(screen.getByTestId('preview-axis-variant')).toHaveTextContent(
      'primary',
    );
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
    expect(screen.getByTestId('preview-axis-variant')).toHaveTextContent(
      'primary',
    );
  });

  it('keeps canvas view, authoring selection and preview configuration independent', async () => {
    const user = userEvent.setup();

    renderWorkspace();

    expect(screen.getByTestId('canvas-view')).toHaveTextContent('instance');
    expect(screen.getByTestId('selection-kind')).toHaveTextContent('component');
    expect(screen.getByTestId('preview-variant')).toHaveTextContent('primary');
    expect(screen.getByTestId('preview-size')).toHaveTextContent('sm');
    expect(screen.getByTestId('preview-state')).toHaveTextContent('base');

    await user.click(
      screen.getByRole('button', { name: 'Change preview configuration' }),
    );

    expect(screen.getByTestId('preview-variant')).toHaveTextContent('secondary');
    expect(screen.getByTestId('preview-size')).toHaveTextContent('lg');
    expect(screen.getByTestId('preview-state')).toHaveTextContent('loading');
    expect(screen.getByTestId('selection-kind')).toHaveTextContent('component');
    expect(screen.getByTestId('canvas-view')).toHaveTextContent('instance');

    await user.click(
      screen.getByRole('button', { name: 'Select anatomy part' }),
    );
    await user.click(screen.getByRole('button', { name: 'Show matrix' }));

    expect(screen.getByTestId('selection-kind')).toHaveTextContent(
      'anatomyPart',
    );
    expect(screen.getByTestId('canvas-view')).toHaveTextContent('matrix');
    expect(screen.getByTestId('preview-variant')).toHaveTextContent('secondary');
    expect(screen.getByTestId('preview-size')).toHaveTextContent('lg');
    expect(screen.getByTestId('preview-state')).toHaveTextContent('loading');
  });
});
