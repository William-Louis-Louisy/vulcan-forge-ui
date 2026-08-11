'use client';

import { useState, type ReactNode } from 'react';

type ComponentWorkspacePanel = 'registry' | 'editor' | 'preview';

type ComponentResponsiveWorkspaceProps = {
  labels: Record<ComponentWorkspacePanel, string>;
  registry: ReactNode;
  editor: ReactNode;
  preview: ReactNode;
  editorScrollContextId: string;
};

const panels: ComponentWorkspacePanel[] = ['registry', 'editor', 'preview'];

export function ComponentResponsiveWorkspace({
  labels,
  registry,
  editor,
  preview,
  editorScrollContextId,
}: ComponentResponsiveWorkspaceProps) {
  const [activePanel, setActivePanel] =
    useState<ComponentWorkspacePanel>('editor');

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        role="tablist"
        aria-label={labels.editor}
        className="border-border-subtle bg-background-app/95 sticky top-0 z-20 grid grid-cols-3 gap-1 border-b p-2 backdrop-blur-sm lg:hidden"
      >
        {panels.map((panel) => {
          const isActive = panel === activePanel;

          return (
            <button
              key={panel}
              id={`components-workspace-tab-${panel}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`components-workspace-panel-${panel}`}
              onClick={() => setActivePanel(panel)}
              className={[
                'min-h-9 min-w-0 truncate rounded-md px-2 text-xs font-semibold transition',
                isActive
                  ? 'bg-content-primary text-background-app'
                  : 'text-content-secondary hover:bg-background-subtle hover:text-content-primary',
              ].join(' ')}
            >
              {labels[panel]}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] xl:h-full xl:grid-cols-[16rem_minmax(0,48rem)_minmax(24rem,1fr)] xl:overflow-hidden">
        <aside
          id="components-workspace-panel-registry"
          role="tabpanel"
          aria-labelledby="components-workspace-tab-registry"
          className={[
            activePanel === 'registry' ? 'block' : 'hidden',
            'border-border-subtle min-h-0 min-w-0 border-b lg:row-span-2 lg:block lg:border-r lg:border-b-0 xl:row-span-1 xl:h-full xl:overflow-y-auto',
          ].join(' ')}
        >
          {registry}
        </aside>

        <main
          id="components-workspace-panel-editor"
          role="tabpanel"
          aria-labelledby="components-workspace-tab-editor"
          data-save-context-scroll-container={editorScrollContextId}
          className={[
            activePanel === 'editor' ? 'block' : 'hidden',
            'min-h-0 min-w-0 lg:col-start-2 lg:block xl:col-start-auto xl:overflow-y-auto',
          ].join(' ')}
        >
          {editor}
        </main>

        <aside
          id="components-workspace-panel-preview"
          role="tabpanel"
          aria-labelledby="components-workspace-tab-preview"
          className={[
            activePanel === 'preview' ? 'grid' : 'hidden',
            'border-border-subtle bg-background-sunken min-h-0 min-w-0 content-start gap-6 border-t lg:col-start-2 lg:grid xl:col-start-auto xl:h-full xl:overflow-y-auto xl:border-t-0 xl:border-l',
          ].join(' ')}
        >
          {preview}
        </aside>
      </div>
    </div>
  );
}
