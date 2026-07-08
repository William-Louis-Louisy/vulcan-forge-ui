'use client';

import { useActionState, useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import type { ComponentContract } from '@/domain/design-system';
import type { ComponentTokenOption } from './component-token-bindings.utils';
import {
  createComponentContractDraft,
  createComponentContractFromDraft,
  type ComponentContractEditorDraft,
} from './component-contract-editor.utils';
import {
  ComponentContractEditorSections,
  type ComponentContractEditorLabels,
} from './ComponentContractEditorSections';
import { updateComponentContractAction } from './update-component-contract.action';
import { initialUpdateComponentContractActionState } from './update-component-contract.state';
import { getComponentContractEditorSaveStatus } from './component-contract-editor-save-status';
import { usePreserveSaveContext } from '@/features/save-context/usePreserveSaveContext';
import { useProjectSaveStatus } from '@/components/layout/ProjectTopbarBreadcrumb';

export type { ComponentContractEditorLabels } from './ComponentContractEditorSections';

type ComponentContractEditorProps = {
  locale: Locale;
  projectSlug: string;
  contract: ComponentContract;
  labels: ComponentContractEditorLabels;
  tokenOptions: ComponentTokenOption[];
};

export function ComponentContractEditor({
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

  const initialDraft = useMemo(
    () => createComponentContractDraft(contract),
    [contract],
  );
  const [draft, setDraft] =
    useState<ComponentContractEditorDraft>(initialDraft);
  const [activeLocale, setActiveLocale] = useState<'en' | 'fr'>(
    locale === 'fr' ? 'fr' : 'en',
  );

  const savedContract =
    state.status === 'success' && state.savedContract
      ? state.savedContract
      : contract;
  const savedDraft = useMemo(
    () => createComponentContractDraft(savedContract),
    [savedContract],
  );
  const validation = createComponentContractFromDraft(draft);
  const contractPayload =
    validation.status === 'success' ? JSON.stringify(validation.contract) : '';
  const hasUnsavedChanges =
    JSON.stringify(draft) !== JSON.stringify(savedDraft);
  const saveContextId = `component-contract:${projectSlug}:${contract.type}`;
  const saveStatus = getComponentContractEditorSaveStatus({
    isPending,
    hasUnsavedChanges,
    hasValidationError: validation.status === 'error',
    hasFormError: Boolean(state.formError),
  });

  useProjectSaveStatus(saveContextId, saveStatus);

  const preserveSaveContext = usePreserveSaveContext(saveContextId);

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
        setDraft={setDraft}
        activeLocale={activeLocale}
        setActiveLocale={setActiveLocale}
        tokenOptions={tokenOptions}
      />

      <form
        action={formAction}
        onSubmitCapture={preserveSaveContext}
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
                isPending
                  ? 'bg-action-warning'
                  : hasUnsavedChanges
                    ? 'bg-content-tertiary'
                    : 'bg-action-success',
              ].join(' ')}
            />
            {isPending
              ? labels.save.saving
              : hasUnsavedChanges
                ? labels.save.unsaved
                : labels.save.saved}
          </p>

          {validation.status === 'error' ? (
            <p className="text-action-danger mt-1 font-medium">
              {labels.save.invalid}
            </p>
          ) : null}

          {state.formError ? (
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
