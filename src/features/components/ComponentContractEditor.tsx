'use client';

import {
  useActionState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import { useRouter } from '@/i18n/navigation';
import type { ComponentContract } from '@/domain/design-system';
import type { ComponentTokenOption } from './component-token-bindings.utils';
import {
  createComponentContractDraft,
  createComponentContractDraftFingerprint,
  createComponentContractFromDraft,
  type ComponentContractEditorDraft,
} from './component-contract-editor.utils';
import {
  ComponentContractEditorSections,
  type ComponentContractEditorLabels,
} from './ComponentContractEditorSections';
import { updateComponentContractAction } from './update-component-contract.action';
import { initialUpdateComponentContractActionState } from './update-component-contract.state';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { useActionBackedProjectSaveStatus } from '@/features/save-context/useActionBackedProjectSaveStatus';
import { useComponentContractPreview } from './ComponentContractPreviewContext';

export type { ComponentContractEditorLabels } from './ComponentContractEditorSections';

type ComponentContractEditorProps = {
  componentKey: string;
  locale: Locale;
  projectSlug: string;
  contract: ComponentContract;
  labels: ComponentContractEditorLabels;
  tokenOptions: ComponentTokenOption[];
};

type PendingCollectionFocus = {
  inputIndex: number;
  selectionStart: number | null;
  selectionEnd: number | null;
};

export function ComponentContractEditor({
  componentKey,
  locale,
  projectSlug,
  contract,
  labels,
  tokenOptions,
}: ComponentContractEditorProps) {
  const [state, formAction, isPending] = useActionState(
    updateComponentContractAction,
    initialUpdateComponentContractActionState,
  );
  const router = useRouter();
  const previewContext = useComponentContractPreview();
  const setPreviewContract = previewContext?.setContract;

  const initialDraft = useMemo(
    () => createComponentContractDraft(contract),
    [contract],
  );
  const [draft, setDraft] =
    useState<ComponentContractEditorDraft>(initialDraft);
  const pendingCollectionFocusRef = useRef<PendingCollectionFocus | null>(null);
  const lastRefreshedContractRef = useRef<string | null>(null);
  const [activeLocale, setActiveLocale] = useState<'en' | 'fr'>(
    locale === 'fr' ? 'fr' : 'en',
  );

  const getCollectionKeyInputs = useCallback(
    () =>
      Array.from(document.querySelectorAll<HTMLInputElement>('input')).filter(
        (input) => input.getAttribute('aria-label') === labels.fields.key,
      ),
    [labels.fields.key],
  );

  const setDraftPreservingCollectionFocus = useCallback(
    (nextDraft: ComponentContractEditorDraft) => {
      const activeElement = document.activeElement;

      if (
        activeElement instanceof HTMLInputElement &&
        activeElement.getAttribute('aria-label') === labels.fields.key
      ) {
        const inputIndex = getCollectionKeyInputs().indexOf(activeElement);

        if (inputIndex >= 0) {
          pendingCollectionFocusRef.current = {
            inputIndex,
            selectionStart: activeElement.selectionStart,
            selectionEnd: activeElement.selectionEnd,
          };
        }
      }

      const nextValidation = createComponentContractFromDraft(nextDraft);

      if (nextValidation.status === 'success') {
        setPreviewContract?.(nextValidation.contract);
      }

      setDraft(nextDraft);
    },
    [getCollectionKeyInputs, labels.fields.key, setPreviewContract],
  );

  useLayoutEffect(() => {
    const pendingFocus = pendingCollectionFocusRef.current;

    if (!pendingFocus) {
      return;
    }

    pendingCollectionFocusRef.current = null;

    const targetInput = getCollectionKeyInputs()[pendingFocus.inputIndex];
    if (!targetInput) {
      return;
    }

    targetInput.focus();
    if (
      pendingFocus.selectionStart !== null &&
      pendingFocus.selectionEnd !== null
    ) {
      targetInput.setSelectionRange(
        pendingFocus.selectionStart,
        pendingFocus.selectionEnd,
      );
    }
  }, [draft, getCollectionKeyInputs]);

  const validation = useMemo(
    () => createComponentContractFromDraft(draft),
    [draft],
  );
  const contractPayload =
    validation.status === 'success' ? JSON.stringify(validation.contract) : '';
  const saveContextId = `component-contract:${projectSlug}:${componentKey}`;
  const currentFingerprint = createComponentContractDraftFingerprint(draft);
  const initialSavedFingerprint =
    createComponentContractDraftFingerprint(initialDraft);
  const successfulFingerprint =
    state.status === 'success' && state.savedContract
      ? createComponentContractDraftFingerprint(
          createComponentContractDraft(state.savedContract),
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
    actionStatus: state.status,
    successfulFingerprint,
    isPending,
    hasValidationError: validation.status === 'error',
  });
  const preserveSaveContext = usePreserveSaveContext(saveContextId);

  useEffect(() => {
    if (state.status !== 'success' || !state.savedContract) {
      return;
    }

    const savedContractFingerprint = JSON.stringify(state.savedContract);

    if (lastRefreshedContractRef.current === savedContractFingerprint) {
      return;
    }

    lastRefreshedContractRef.current = savedContractFingerprint;
    router.refresh();
  }, [router, state.savedContract, state.status]);

  function handleSubmitCapture() {
    markCurrentDraftSubmitted();
    preserveSaveContext();
  }

  const saveStatusDotClassName = {
    saved: 'bg-action-success',
    unsaved: 'bg-action-warning',
    saving: 'bg-action-info',
    error: 'bg-action-danger',
  }[saveStatus];
  const saveStatusLabel =
    saveStatus === 'saving'
      ? labels.save.saving
      : saveStatus === 'error'
        ? validation.status === 'error'
          ? labels.save.invalid
          : labels.save.errors[state.formError ?? 'unexpected']
        : saveStatus === 'unsaved'
          ? labels.save.unsaved
          : labels.save.saved;

  return (
    <section className="min-w-0">
      {hasUnsavedChanges ? (
        <p
          role="status"
          className="text-action-warning mb-4 text-xs font-semibold"
        >
          {labels.unsavedNotice}
        </p>
      ) : null}

      {validation.status === 'error' ? (
        <div
          role="alert"
          className="border-action-danger/30 bg-action-danger/5 text-action-danger mb-4 rounded-md border px-3 py-2.5 text-xs"
        >
          <p className="font-semibold">{labels.validationTitle}</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-4">
            {validation.errors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <ComponentContractEditorSections
        labels={labels}
        draft={draft}
        setDraft={setDraftPreservingCollectionFocus}
        activeLocale={activeLocale}
        setActiveLocale={setActiveLocale}
        tokenOptions={tokenOptions}
      />

      <form
        action={formAction}
        onSubmitCapture={handleSubmitCapture}
        className="border-border-subtle bg-background-app/95 sticky bottom-0 z-10 mt-6 flex min-w-0 flex-col gap-2 border-t py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="componentKey" value={componentKey} />
        <input type="hidden" name="componentType" value={draft.type} />
        <input type="hidden" name="contract" value={contractPayload} />

        <div aria-live="polite" className="min-w-0 text-xs">
          <p className="flex items-center gap-2 font-semibold">
            <span
              aria-hidden="true"
              className={[
                'size-1.5 shrink-0 rounded-full',
                saveStatusDotClassName,
              ].join(' ')}
            />
            {saveStatusLabel}
          </p>

          {validation.status === 'error' ? (
            <p className="text-action-danger mt-1 font-medium">
              {labels.save.invalid}
            </p>
          ) : null}

          {hasCurrentActionError && state.formError ? (
            <p role="alert" className="text-action-danger mt-1 font-medium">
              {labels.save.errors[state.formError]}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={
            isPending || validation.status === 'error' || !hasUnsavedChanges
          }
          className="shrink-0"
        >
          {isPending ? labels.save.saving : labels.save.action}
        </Button>
      </form>
    </section>
  );
}
