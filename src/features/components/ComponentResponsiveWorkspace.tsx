'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Button } from '@/components/ui';
import {
  useOptionalComponentContractWorkspace,
} from './ComponentContractWorkspaceContext';

type ComponentWorkspaceAuxiliaryPanel = 'navigation' | 'inspector';

type ComponentResponsiveWorkspaceProps = {
  labels: {
    navigation: string;
    canvas: string;
    inspector: string;
  };
  componentName: string;
  navigation: ReactNode;
  canvas: ReactNode;
  inspector: ReactNode;
  saveAction: ReactNode;
  inspectorScrollContextId: string;
};

export function ComponentResponsiveWorkspace({
  labels,
  componentName,
  navigation,
  canvas,
  inspector,
  saveAction,
  inspectorScrollContextId,
}: ComponentResponsiveWorkspaceProps) {
  const workspace = useOptionalComponentContractWorkspace();
  const [activeAuxiliaryPanel, setActiveAuxiliaryPanel] =
    useState<ComponentWorkspaceAuxiliaryPanel | null>(null);
  const navigationPanelRef = useRef<HTMLElement>(null);
  const inspectorPanelRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const displayedComponentName = workspace?.draft.name.trim() || componentName;

  const openAuxiliaryPanel = useCallback(
    (panel: ComponentWorkspaceAuxiliaryPanel) => {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setActiveAuxiliaryPanel(panel);
    },
    [],
  );

  const closeAuxiliaryPanel = useCallback(() => {
    setActiveAuxiliaryPanel(null);
    returnFocusRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!activeAuxiliaryPanel) {
      return;
    }

    const activePanel =
      activeAuxiliaryPanel === 'navigation'
        ? navigationPanelRef.current
        : inspectorPanelRef.current;

    activePanel
      ?.querySelector<HTMLElement>('[data-workspace-panel-close]')
      ?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeAuxiliaryPanel();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeAuxiliaryPanel, closeAuxiliaryPanel]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-border-subtle bg-background-app/95 sticky top-0 z-30 shrink-0 border-b px-3 py-3 backdrop-blur-sm sm:px-4">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
              {labels.canvas}
            </p>
            <h1 className="mt-0.5 truncate text-lg font-semibold tracking-tight">
              {displayedComponentName}
            </h1>
          </div>

          <div className="min-w-0 sm:max-w-[24rem] sm:shrink-0">
            {saveAction}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 xl:hidden">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            aria-controls="components-workspace-navigation"
            aria-expanded={activeAuxiliaryPanel === 'navigation'}
            onClick={() => openAuxiliaryPanel('navigation')}
            className="lg:hidden"
          >
            {labels.navigation}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            aria-controls="components-workspace-inspector"
            aria-expanded={activeAuxiliaryPanel === 'inspector'}
            onClick={() => openAuxiliaryPanel('inspector')}
            className="col-start-2"
          >
            {labels.inspector}
          </Button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_22rem] xl:overflow-hidden">
        <aside
          ref={navigationPanelRef}
          id="components-workspace-navigation"
          aria-label={labels.navigation}
          role={activeAuxiliaryPanel === 'navigation' ? 'dialog' : undefined}
          aria-modal={activeAuxiliaryPanel === 'navigation' ? true : undefined}
          className={[
            activeAuxiliaryPanel === 'navigation'
              ? 'bg-background-app fixed inset-0 z-50 block overflow-y-auto'
              : 'hidden',
            'border-border-subtle min-h-0 min-w-0 lg:static lg:z-auto lg:block lg:h-full lg:overflow-y-auto lg:border-r',
          ].join(' ')}
        >
          <div className="border-border-subtle bg-background-app sticky top-0 z-10 border-b p-3 lg:hidden">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              data-workspace-panel-close
              onClick={closeAuxiliaryPanel}
            >
              ← {labels.canvas}
            </Button>
          </div>
          {navigation}
        </aside>

        <main
          aria-label={labels.canvas}
          className="bg-background-sunken min-h-0 min-w-0 lg:col-start-2 lg:h-full lg:overflow-y-auto xl:col-start-auto"
        >
          {canvas}
        </main>

        {activeAuxiliaryPanel === 'inspector' ? (
          <div
            aria-hidden="true"
            className="bg-overlay-scrim fixed inset-0 z-40 hidden sm:block xl:hidden"
          />
        ) : null}

        <aside
          ref={inspectorPanelRef}
          id="components-workspace-inspector"
          aria-label={labels.inspector}
          role={activeAuxiliaryPanel === 'inspector' ? 'dialog' : undefined}
          aria-modal={activeAuxiliaryPanel === 'inspector' ? true : undefined}
          data-save-context-scroll-container={inspectorScrollContextId}
          className={[
            activeAuxiliaryPanel === 'inspector'
              ? 'bg-background-app fixed inset-0 z-50 block overflow-y-auto sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[min(42rem,calc(100%-2rem))] sm:shadow-2xl'
              : 'hidden',
            'border-border-subtle min-h-0 min-w-0 xl:static xl:z-auto xl:block xl:h-full xl:w-auto xl:overflow-y-auto xl:border-l xl:shadow-none',
          ].join(' ')}
        >
          <div className="border-border-subtle bg-background-app sticky top-0 z-20 border-b p-3 xl:hidden">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              data-workspace-panel-close
              onClick={closeAuxiliaryPanel}
            >
              ← {labels.canvas}
            </Button>
          </div>
          {inspector}
        </aside>
      </div>
    </div>
  );
}
