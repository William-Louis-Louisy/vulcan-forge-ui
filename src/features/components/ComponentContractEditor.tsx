'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';
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
import { ComponentWorkspaceSaveAction } from './ComponentWorkspaceSaveAction';

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
        <div className="min-w-0">
          <ComponentContractEditorContent {...props} />
          <ComponentWorkspaceSaveAction
            locale={props.locale}
            projectSlug={props.projectSlug}
            labels={props.labels.save}
            className="border-border-subtle bg-background-app/95 sticky bottom-0 z-10 mt-6 border-t py-3 backdrop-blur-sm"
          />
        </div>
      </ComponentContractWorkspaceProvider>
    </ComponentContractPreviewProvider>
  );
}

function ComponentContractEditorContent({
  labels,
  tokenOptions,
}: ComponentContractEditorProps) {
  const {
    draft,
    setDraft,
    validation,
    activeLocale,
    setActiveLocale,
    hasUnsavedChanges,
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
    </section>
  );
}
