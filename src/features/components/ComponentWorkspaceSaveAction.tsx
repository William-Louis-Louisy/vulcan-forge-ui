'use client';

import { Button } from '@/components/ui';
import type { Locale } from '@/i18n/routing';
import type { ComponentContractEditorLabels } from './ComponentContractEditor';
import { useComponentContractWorkspace } from './ComponentContractWorkspaceContext';

type ComponentWorkspaceSaveActionProps = {
  locale: Locale;
  projectSlug: string;
  labels: ComponentContractEditorLabels['save'];
  className?: string;
};

export function ComponentWorkspaceSaveAction({
  locale,
  projectSlug,
  labels,
  className,
}: ComponentWorkspaceSaveActionProps) {
  const {
    draft,
    validation,
    contractPayload,
    actionState,
    formAction,
    isPending,
    hasCurrentActionError,
    hasUnsavedChanges,
    saveStatus,
    handleSubmitCapture,
  } = useComponentContractWorkspace();

  const saveStatusDotClassName = {
    saved: 'bg-action-success',
    unsaved: 'bg-action-warning',
    saving: 'bg-action-info',
    error: 'bg-action-danger',
  }[saveStatus];
  const saveStatusLabel =
    saveStatus === 'saving'
      ? labels.saving
      : saveStatus === 'error'
        ? validation.status === 'error'
          ? labels.invalid
          : labels.errors[actionState.formError ?? 'unexpected']
        : saveStatus === 'unsaved'
          ? labels.unsaved
          : labels.saved;

  return (
    <form
      action={formAction}
      onSubmitCapture={handleSubmitCapture}
      className={['flex min-w-0 items-center justify-between gap-3', className]
        .filter(Boolean)
        .join(' ')}
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="componentType" value={draft.type} />
      <input type="hidden" name="contract" value={contractPayload} />

      <div aria-live="polite" className="min-w-0 text-xs">
        <p className="flex min-w-0 items-center gap-2 font-semibold">
          <span
            aria-hidden="true"
            className={[
              'size-1.5 shrink-0 rounded-full',
              saveStatusDotClassName,
            ].join(' ')}
          />
          <span className="min-w-0 truncate">{saveStatusLabel}</span>
        </p>

        {validation.status === 'error' ? (
          <p className="text-action-danger mt-1 font-medium">
            {labels.invalid}
          </p>
        ) : null}

        {hasCurrentActionError && actionState.formError ? (
          <p role="alert" className="text-action-danger mt-1 font-medium">
            {labels.errors[actionState.formError]}
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
        {isPending ? labels.saving : labels.action}
      </Button>
    </form>
  );
}
