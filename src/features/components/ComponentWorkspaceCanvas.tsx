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
    preview: string;
    anatomy: string;
  };
  anatomy: ComponentAnatomyCanvasLabels;
};

export function ComponentWorkspaceCanvas({
  preview,
  labels,
}: {
  preview: ReactNode;
  labels: ComponentWorkspaceCanvasLabels;
}) {
  const { canvasView, setCanvasView } = useComponentContractWorkspace();

  const options = [
    { value: 'preview', label: labels.modes.preview },
    { value: 'anatomy', label: labels.modes.anatomy },
  ] satisfies ReadonlyArray<{
    value: ComponentWorkspaceCanvasView;
    label: string;
  }>;

  return (
    <div className="min-h-0 min-w-0">
      <div className="border-border-subtle bg-background-app/95 sticky top-0 z-20 border-b px-3 py-2 backdrop-blur-sm sm:px-4">
        <SegmentedControl<ComponentWorkspaceCanvasView>
          value={canvasView}
          options={options}
          onValueChange={setCanvasView}
          ariaLabel={labels.modes.ariaLabel}
        />
      </div>

      {canvasView === 'anatomy' ? (
        <ComponentAnatomyCanvas labels={labels.anatomy} />
      ) : (
        preview
      )}
    </div>
  );
}
