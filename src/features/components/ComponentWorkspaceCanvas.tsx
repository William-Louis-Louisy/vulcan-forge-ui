'use client';

import type { ReactNode } from 'react';
import { SegmentedControl } from '@/components/ui';
import { ComponentAnatomyCanvas } from './ComponentAnatomyCanvas';
import {
  useComponentContractWorkspace,
  type ComponentWorkspaceCanvasView,
} from './ComponentContractWorkspaceContext';
import type { ComponentAnatomyCanvasLabels } from './ComponentAnatomyCanvas';

export type ComponentWorkspaceCanvasLabels = {
  modes: {
    ariaLabel: string;
    instance: string;
    anatomy: string;
    matrix: string;
  };
  anatomy: ComponentAnatomyCanvasLabels;
};

export function ComponentWorkspaceCanvas({
  instance,
  matrix,
  labels,
}: {
  instance: ReactNode;
  matrix: ReactNode;
  labels: ComponentWorkspaceCanvasLabels;
}) {
  const { canvasView, setCanvasView } = useComponentContractWorkspace();

  const options = [
    {
      value: 'instance',
      label: labels.modes.instance,
      id: 'components-workspace-canvas-tab-instance',
      controls: 'components-workspace-canvas-panel-instance',
    },
    {
      value: 'anatomy',
      label: labels.modes.anatomy,
      id: 'components-workspace-canvas-tab-anatomy',
      controls: 'components-workspace-canvas-panel-anatomy',
    },
    {
      value: 'matrix',
      label: labels.modes.matrix,
      id: 'components-workspace-canvas-tab-matrix',
      controls: 'components-workspace-canvas-panel-matrix',
    },
  ] satisfies ReadonlyArray<{
    value: ComponentWorkspaceCanvasView;
    label: string;
    id: string;
    controls: string;
  }>;

  return (
    <div className="min-h-0 min-w-0">
      <div className="border-border-subtle bg-background-app/95 sticky top-0 z-20 border-b px-3 py-2 backdrop-blur-sm sm:px-4">
        <SegmentedControl<ComponentWorkspaceCanvasView>
          value={canvasView}
          options={options}
          onValueChange={setCanvasView}
          ariaLabel={labels.modes.ariaLabel}
          semantics="tabs"
        />
      </div>

      <div
        id="components-workspace-canvas-panel-instance"
        role="tabpanel"
        aria-labelledby="components-workspace-canvas-tab-instance"
        hidden={canvasView !== 'instance'}
        className="min-w-0"
      >
        {canvasView === 'instance' ? instance : null}
      </div>
      <div
        id="components-workspace-canvas-panel-anatomy"
        role="tabpanel"
        aria-labelledby="components-workspace-canvas-tab-anatomy"
        hidden={canvasView !== 'anatomy'}
        className="min-w-0"
      >
        {canvasView === 'anatomy' ? (
          <ComponentAnatomyCanvas labels={labels.anatomy} />
        ) : null}
      </div>
      <div
        id="components-workspace-canvas-panel-matrix"
        role="tabpanel"
        aria-labelledby="components-workspace-canvas-tab-matrix"
        hidden={canvasView !== 'matrix'}
        className="min-w-0"
      >
        {canvasView === 'matrix' ? matrix : null}
      </div>
    </div>
  );
}
