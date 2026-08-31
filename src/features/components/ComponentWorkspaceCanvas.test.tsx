import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentWorkspaceCanvas } from './ComponentWorkspaceCanvas';

const workspaceMock = vi.hoisted(() => ({
  canvasView: 'instance' as 'instance' | 'anatomy' | 'matrix',
  setCanvasView: vi.fn(),
}));

vi.mock('./ComponentContractWorkspaceContext', () => ({
  useComponentContractWorkspace: () => workspaceMock,
}));

vi.mock('./ComponentAnatomyCanvas', () => ({
  ComponentAnatomyCanvas: () => <p>Anatomy content</p>,
}));

const labels = {
  modes: {
    ariaLabel: 'Canvas modes',
    instance: 'Instance',
    anatomy: 'Anatomy',
    matrix: 'Matrix',
  },
  anatomy: {
    title: 'Anatomy',
    description: 'Component anatomy',
    add: 'Add part',
    component: 'Component',
    flatStructure: 'Flat structure',
    empty: 'No parts',
    selectPart: 'Select a part',
    untitled: 'Untitled',
    requirements: {
      required: 'Required',
      optional: 'Optional',
      derived: 'Derived',
    },
  },
};

function renderCanvas() {
  return render(
    <ComponentWorkspaceCanvas
      labels={labels}
      instance={<p>Instance content</p>}
      matrix={<p>Matrix content</p>}
    />,
  );
}

describe('ComponentWorkspaceCanvas', () => {
  beforeEach(() => {
    workspaceMock.canvasView = 'instance';
    workspaceMock.setCanvasView.mockReset();
  });

  it('exposes Canvas modes as associated keyboard-operable tabs', async () => {
    const user = userEvent.setup();
    const { rerender } = renderCanvas();

    const tabList = screen.getByRole('tablist', { name: 'Canvas modes' });
    const instanceTab = screen.getByRole('tab', { name: 'Instance' });
    const anatomyTab = screen.getByRole('tab', { name: 'Anatomy' });
    const matrixTab = screen.getByRole('tab', { name: 'Matrix' });
    const instancePanel = screen.getByRole('tabpanel', { name: 'Instance' });

    expect(tabList).toBeInTheDocument();
    expect(instanceTab).toHaveAttribute('aria-selected', 'true');
    expect(instanceTab).toHaveAttribute(
      'aria-controls',
      'components-workspace-canvas-panel-instance',
    );
    expect(instancePanel).toHaveAttribute(
      'aria-labelledby',
      'components-workspace-canvas-tab-instance',
    );
    expect(instancePanel).toHaveTextContent('Instance content');

    instanceTab.focus();
    await user.keyboard('{ArrowRight}');

    expect(workspaceMock.setCanvasView).toHaveBeenCalledWith('anatomy');
    expect(anatomyTab).toHaveFocus();

    await user.keyboard('{End}');

    expect(workspaceMock.setCanvasView).toHaveBeenLastCalledWith('matrix');
    expect(matrixTab).toHaveFocus();

    workspaceMock.canvasView = 'anatomy';
    rerender(
      <ComponentWorkspaceCanvas
        labels={labels}
        instance={<p>Instance content</p>}
        matrix={<p>Matrix content</p>}
      />,
    );

    expect(screen.getByRole('tab', { name: 'Anatomy' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel', { name: 'Anatomy' })).toHaveTextContent(
      'Anatomy content',
    );
    expect(screen.queryByText('Instance content')).not.toBeInTheDocument();
  });
});
