'use client';

import { useState, type ReactNode } from 'react';

type ThemesWorkspacePanel = 'editor' | 'preview';

export type ThemeWorkspaceItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type ThemesResponsiveWorkspaceProps = {
  labels: {
    editor: string;
    preview: string;
    themeNavigation: string;
  };
  title: string;
  description: string;
  summary: string;
  themes: ThemeWorkspaceItem[];
  preview: ReactNode;
};

const panels: ThemesWorkspacePanel[] = ['editor', 'preview'];

export function ThemesResponsiveWorkspace({
  labels,
  title,
  description,
  summary,
  themes,
  preview,
}: ThemesResponsiveWorkspaceProps) {
  const [activePanel, setActivePanel] =
    useState<ThemesWorkspacePanel>('editor');
  const [activeThemeId, setActiveThemeId] = useState(
    themes[0]?.id ?? '',
  );
  const activeTheme =
    themes.find((theme) => theme.id === activeThemeId) ?? themes[0] ?? null;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div
        role="tablist"
        aria-label={labels.editor}
        className="border-border-subtle bg-background-app/95 z-20 grid shrink-0 grid-cols-2 gap-1 border-b p-2 backdrop-blur-sm lg:hidden"
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

      <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_26rem] lg:overflow-hidden">
        <section
          id="themes-workspace-panel-editor"
          role="tabpanel"
          aria-labelledby="themes-workspace-tab-editor"
          className={[
            activePanel === 'editor' ? 'flex' : 'hidden',
            'min-h-0 min-w-0 flex-col lg:flex lg:overflow-hidden',
          ].join(' ')}
        >
          <header className="border-border-subtle shrink-0 border-b px-4 pt-4 md:px-6 xl:px-7 xl:pt-5">
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <h1 className="text-[26px] font-semibold tracking-[-0.015em]">
                    {title}
                  </h1>
                  <p className="text-content-tertiary mt-1 max-w-3xl text-sm leading-6">
                    {description}
                  </p>
                </div>
                <p className="text-content-secondary shrink-0 text-xs font-semibold">
                  {summary}
                </p>
              </div>

              <div
                role="tablist"
                aria-label={labels.themeNavigation}
                className="mt-3 flex min-w-0 gap-1 overflow-x-auto"
              >
                {themes.map((theme) => {
                  const isActive = theme.id === activeTheme?.id;

                  return (
                    <button
                      key={theme.id}
                      id={`theme-editor-tab-${theme.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`theme-editor-panel-${theme.id}`}
                      onClick={() => setActiveThemeId(theme.id)}
                      className={[
                        'border-b-2 px-3 py-2 text-sm font-semibold whitespace-nowrap transition',
                        isActive
                          ? 'border-action-primary text-content-primary'
                          : 'border-transparent text-content-tertiary hover:text-content-primary',
                      ].join(' ')}
                    >
                      {theme.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
            {activeTheme ? (
              <div
                id={`theme-editor-panel-${activeTheme.id}`}
                role="tabpanel"
                aria-labelledby={`theme-editor-tab-${activeTheme.id}`}
              >
                {activeTheme.content}
              </div>
            ) : null}
          </main>
        </section>

        <aside
          id="themes-workspace-panel-preview"
          role="tabpanel"
          aria-labelledby="themes-workspace-tab-preview"
          className={[
            activePanel === 'preview' ? 'block' : 'hidden',
            'border-border-subtle bg-background-sunken min-h-0 min-w-0 border-t lg:block lg:overflow-y-auto lg:border-t-0 lg:border-l',
          ].join(' ')}
        >
          {preview}
        </aside>
      </div>
    </div>
  );
}
