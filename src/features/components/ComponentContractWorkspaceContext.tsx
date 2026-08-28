'use client';

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ComponentContract } from '@/domain/design-system';
import type { Locale } from '@/i18n/routing';
import { useRouter } from '@/i18n/navigation';
import { useActionBackedProjectSaveStatus } from '@/features/save-context/useActionBackedProjectSaveStatus';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import {
  createComponentContractDraft,
  createComponentContractDraftFingerprint,
  createComponentContractFromDraft,
  type ComponentContractDraftValidationResult,
  type ComponentContractEditorDraft,
} from './component-contract-editor.utils';
import {
  createComponentWorkspacePreviewAxes,
  createInitialComponentWorkspacePreviewConfiguration,
  resolveComponentWorkspacePreviewConfiguration,
  type ComponentWorkspacePreviewAxes,
  type ComponentWorkspacePreviewConfiguration,
  type ResolvedComponentWorkspacePreviewConfiguration,
} from './component-preview-configuration.utils';
import { useComponentContractPreview } from './ComponentContractPreviewContext';
import { updateComponentContractAction } from './update-component-contract.action';
import {
  initialUpdateComponentContractActionState,
  type UpdateComponentContractActionState,
} from './update-component-contract.state';

type ComponentContractWorkspaceLocale = 'en' | 'fr';
type ComponentContractWorkspaceSaveStatus =
  | 'saved'
  | 'unsaved'
  | 'saving'
  | 'error';

export type ComponentWorkspaceCanvasView = 'instance' | 'anatomy' | 'matrix';

export type ComponentWorkspaceAuthoringSelection =
  | { kind: 'component' }
  | { kind: 'anatomyPart'; draftId: string }
  | { kind: 'variantDefinition'; draftId: string }
  | { kind: 'sizeDefinition'; draftId: string }
  | { kind: 'stateDefinition'; draftId: string };

type ComponentContractWorkspaceContextValue = {
  draft: ComponentContractEditorDraft;
  setDraft: (draft: ComponentContractEditorDraft) => void;
  validation: ComponentContractDraftValidationResult;
  contractPayload: string;
  previewContract: ComponentContract;
  previewAxes: ComponentWorkspacePreviewAxes;
  activeLocale: ComponentContractWorkspaceLocale;
  setActiveLocale: (locale: ComponentContractWorkspaceLocale) => void;
  canvasView: ComponentWorkspaceCanvasView;
  setCanvasView: (view: ComponentWorkspaceCanvasView) => void;
  authoringSelection: ComponentWorkspaceAuthoringSelection;
  setAuthoringSelection: (
    selection: ComponentWorkspaceAuthoringSelection,
  ) => void;
  previewConfiguration: ComponentWorkspacePreviewConfiguration;
  setPreviewConfiguration: (
    configuration: ComponentWorkspacePreviewConfiguration,
  ) => void;
  resolvedPreviewConfiguration: ResolvedComponentWorkspacePreviewConfiguration;
  actionState: UpdateComponentContractActionState;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  hasCurrentActionError: boolean;
  hasUnsavedChanges: boolean;
  saveStatus: ComponentContractWorkspaceSaveStatus;
  saveContextId: string;
  handleSubmitCapture: () => void;
};

const ComponentContractWorkspaceContext =
  createContext<ComponentContractWorkspaceContextValue | null>(null);

export function ComponentContractWorkspaceProvider({
  locale,
  projectSlug,
  contract,
  children,
}: {
  locale: Locale;
  projectSlug: string;
  contract: ComponentContract;
  children: ReactNode;
}) {
  const [actionState, formAction, isPending] = useActionState(
    updateComponentContractAction,
    initialUpdateComponentContractActionState,
  );
  const router = useRouter();
  const previewContext = useComponentContractPreview();
  const previewContract = previewContext?.contract ?? contract;
  const initialDraft = useMemo(
    () => createComponentContractDraft(contract),
    [contract],
  );
  const initialPreviewConfiguration = useMemo(
    () => createInitialComponentWorkspacePreviewConfiguration(initialDraft),
    [initialDraft],
  );
  const [draft, setDraftState] =
    useState<ComponentContractEditorDraft>(initialDraft);
  const [previewAxes, setPreviewAxes] = useState<ComponentWorkspacePreviewAxes>(
    () => createComponentWorkspacePreviewAxes(initialDraft),
  );
  const [activeLocale, setActiveLocale] =
    useState<ComponentContractWorkspaceLocale>(locale === 'fr' ? 'fr' : 'en');
  const [canvasView, setCanvasView] =
    useState<ComponentWorkspaceCanvasView>('instance');
  const [authoringSelection, setAuthoringSelection] =
    useState<ComponentWorkspaceAuthoringSelection>({ kind: 'component' });
  const [previewConfiguration, setPreviewConfiguration] =
    useState<ComponentWorkspacePreviewConfiguration>(initialPreviewConfiguration);
  const lastRefreshedContractRef = useRef<string | null>(null);

  const setDraft = useCallback(
    (nextDraft: ComponentContractEditorDraft) => {
      const nextValidation = createComponentContractFromDraft(nextDraft);

      if (nextValidation.status === 'success') {
        previewContext?.setContract(nextValidation.contract);
        setPreviewAxes(createComponentWorkspacePreviewAxes(nextDraft));
      }

      setDraftState(nextDraft);
    },
    [previewContext],
  );

  const validation = useMemo(
    () => createComponentContractFromDraft(draft),
    [draft],
  );
  const resolvedPreviewConfiguration = useMemo(
    () =>
      resolveComponentWorkspacePreviewConfiguration(
        draft,
        previewConfiguration,
      ),
    [draft, previewConfiguration],
  );
  const contractPayload =
    validation.status === 'success' ? JSON.stringify(validation.contract) : '';
  const saveContextId = `component-contract:${projectSlug}:${contract.type}`;
  const currentFingerprint = createComponentContractDraftFingerprint(draft);
  const initialSavedFingerprint =
    createComponentContractDraftFingerprint(initialDraft);
  const successfulFingerprint =
    actionState.status === 'success' && actionState.savedContract
      ? createComponentContractDraftFingerprint(
          createComponentContractDraft(actionState.savedContract),
        )
      : null;
  const {
    hasCurrentActionError,
    hasUnsavedChanges,
    markCurrentDraftSubmitted,
    status: saveStatus,
  } = useActionBackedProjectSaveStatus({
    sourceId: saveContextId,
    currentFingerprint,
    initialSavedFingerprint,
    actionStatus: actionState.status,
    successfulFingerprint,
    isPending,
    hasValidationError: validation.status === 'error',
  });
  const preserveSaveContext = usePreserveSaveContext(saveContextId);

  useEffect(() => {
    if (actionState.status !== 'success' || !actionState.savedContract) {
      return;
    }

    const savedContractFingerprint = JSON.stringify(actionState.savedContract);

    if (lastRefreshedContractRef.current === savedContractFingerprint) {
      return;
    }

    lastRefreshedContractRef.current = savedContractFingerprint;
    router.refresh();
  }, [actionState.savedContract, actionState.status, router]);

  const handleSubmitCapture = useCallback(() => {
    markCurrentDraftSubmitted();
    preserveSaveContext();
  }, [markCurrentDraftSubmitted, preserveSaveContext]);

  const value = useMemo<ComponentContractWorkspaceContextValue>(
    () => ({
      draft,
      setDraft,
      validation,
      contractPayload,
      previewContract,
      previewAxes,
      activeLocale,
      setActiveLocale,
      canvasView,
      setCanvasView,
      authoringSelection,
      setAuthoringSelection,
      previewConfiguration,
      setPreviewConfiguration,
      resolvedPreviewConfiguration,
      actionState,
      formAction,
      isPending,
      hasCurrentActionError,
      hasUnsavedChanges,
      saveStatus,
      saveContextId,
      handleSubmitCapture,
    }),
    [
      actionState,
      activeLocale,
      authoringSelection,
      canvasView,
      contractPayload,
      draft,
      formAction,
      handleSubmitCapture,
      hasCurrentActionError,
      hasUnsavedChanges,
      isPending,
      previewAxes,
      previewConfiguration,
      previewContract,
      resolvedPreviewConfiguration,
      saveContextId,
      saveStatus,
      setDraft,
      validation,
    ],
  );

  return (
    <ComponentContractWorkspaceContext.Provider value={value}>
      {children}
    </ComponentContractWorkspaceContext.Provider>
  );
}

export function useComponentContractWorkspace() {
  const context = useContext(ComponentContractWorkspaceContext);

  if (!context) {
    throw new Error(
      'useComponentContractWorkspace must be used within ComponentContractWorkspaceProvider.',
    );
  }

  return context;
}

export function useOptionalComponentContractWorkspace() {
  return useContext(ComponentContractWorkspaceContext);
}
