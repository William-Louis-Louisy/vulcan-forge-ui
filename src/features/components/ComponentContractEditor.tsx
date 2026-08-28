'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import type { ComponentContract } from '@/domain/design-system';
import type { ComponentTokenOption } from './component-token-bindings.utils';
import type { ComponentContractEditorDraft } from './component-contract-editor.utils';
import {
  ComponentContractEditorSections,
  type ComponentContractEditorLabels,
} from './ComponentContractEditorSections';
import {
  ComponentContractWorkspaceProvider,
  useComponentContractWorkspace,
  useOptionalComponentContractWorkspace,
} from './ComponentContractWorkspaceContext';
import { ComponentContractPreviewProvider } from './ComponentContractPreviewContext';

export type { ComponentContractEditorLabels } from './ComponentContractEditorSections';

type ComponentContractEditorProps = {
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

export function ComponentContractEditor(props: ComponentContractEditorProps) {
  const workspace = useOptionalComponentContractWorkspace();

  if (workspace) {
    return <ComponentContractEditorContent {...props} />;
  }

  return (
    <ComponentContractPreviewProvider initialContract={props.contract}>
      <ComponentContractWorkspaceProvider
        locale={props.locale}
        projectSlug={props.projectSlug}
        contract={props.contract}
      >
        <ComponentContractEditorContent {...props} />
      </ComponentContractWorkspaceProvider>
    </ComponentContractPreviewProvider>
  );
}

function ComponentContractEditorContent({
  locale,
  projectSlug,
  labels,
  tokenOptions,
}: ComponentContractEditorProps) {
  const {
    draft,
    setDraft,
    validation,
    contractPayload,
    activeLocale,
    setActiveLocale,
    actionState,
    formAction,
    isPending,
    hasCurrentActionError,
    hasUnsavedChanges,
    saveStatus,
    handleSubmitCapture,
  } = useComponentContractWorkspace();
  const pendingCollectionFocusRef = useRef<PendingCollectionFocus | null>(null);

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

      setDraft(nextDraft);
    },
    [getCollectionKeyInputs, labels.fields.key, setDraft],
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
          : labels.save.errors[actionState.formError ?? 'unexpected']
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

          {hasCurrentActionError && actionState.formError ? (
            <p role="alert" className="text-action-danger mt-1 font-medium">
              {labels.save.errors[actionState.formError]}
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
