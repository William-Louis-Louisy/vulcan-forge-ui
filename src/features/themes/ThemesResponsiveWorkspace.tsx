'use client';

import { useState, type ReactNode } from 'react';

type ThemesWorkspacePanel = 'editor' | 'preview';

type ThemesResponsiveWorkspaceProps = {
  labels: Record<ThemesWorkspacePanel, string>;
  editor: ReactNode;
  preview: ReactNode;
};

const panels: ThemesWorkspacePanel[] = ['editor', 'preview'];

export function ThemesResponsiveWorkspace({
  labels,
  editor,
  preview,
}: ThemesResponsiveWorkspaceProps) {
  const [activePanel, setActivePanel] =
    useState<ThemesWorkspacePanel>('editor');

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        role="tablist"
        aria-label={labels.editor}
        className="border-border-subtle bg-background-app/95 sticky top-0 z-20 grid grid-cols-2 gap-1 border-b p-2 backdrop-blur-sm lg:hidden"
      >
        {panels.map((panel) => {
          const isActive = panel === activePanel;

          return (
            <button
              key={panel}
              id={`themes-workspace-tab-${panel}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`themes-workspace-panel-${panel}`}
              onClick={() => setActivePanel(panel)}
              className={[
                'min-h-9 min-w-0 truncate rounded-md px-3 text-xs font-semibold transition',
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

      <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] xl:h-full xl:grid-cols-[minmax(0,1fr)_24rem] xl:overflow-hidden">
        <main
          id="themes-workspace-panel-editor"
          role="tabpanel"
          aria-labelledby="themes-workspace-tab-editor"
          className={[
            activePanel === 'editor' ? 'block' : 'hidden',
            'min-h-0 min-w-0 lg:block xl:overflow-y-auto',
          ].join(' ')}
        >
          {editor}
        </main>

        <aside
          id="themes-workspace-panel-preview"
          role="tabpanel"
          aria-labelledby="themes-workspace-tab-preview"
          className={[
            activePanel === 'preview' ? 'block' : 'hidden',
            'border-border-subtle bg-background-sunken min-h-0 min-w-0 border-t lg:block lg:border-t-0 lg:border-l xl:h-full xl:overflow-y-auto',
          ].join(' ')}
        >
          {preview}
        </aside>
      </div>
    </div>
  );
}
